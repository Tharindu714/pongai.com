// game.js - plain JS version (paste as-is)
const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const scoreEl = document.getElementById('score');
const scoreAIEl = document.getElementById('scoreAI');

function resizeCanvasForDisplaySize(canvasEl) {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const rect = canvasEl.getBoundingClientRect();
  const width = Math.round(rect.width * dpr);
  const height = Math.round(rect.height * dpr);
  if (canvasEl.width !== width || canvasEl.height !== height) {
    canvasEl.width = width;
    canvasEl.height = height;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
}
resizeCanvasForDisplaySize(canvas);
window.addEventListener('resize', () => resizeCanvasForDisplaySize(canvas));

const LOGICAL_WIDTH = 800;
const LOGICAL_HEIGHT = 440;

const PADDLE_W = 12;
const PADDLE_H = 100;
const BALL_R = 10;

const player = {
  x: 20,
  y: LOGICAL_HEIGHT / 2 - PADDLE_H / 2,
  width: PADDLE_W,
  height: PADDLE_H,
  speed: 8
};

const ai = {
  x: LOGICAL_WIDTH - PADDLE_W - 20,
  y: LOGICAL_HEIGHT / 2 - PADDLE_H / 2,
  width: PADDLE_W,
  height: PADDLE_H,
  speed: 5
};

const ball = {
  x: LOGICAL_WIDTH / 2,
  y: LOGICAL_HEIGHT / 2,
  radius: BALL_R,
  vx: 5 * (Math.random() > 0.5 ? 1 : -1),
  vy: 3 * (Math.random() > 0.5 ? 1 : -1),
  speed: 6
};

let playerScore = 0;
let aiScore = 0;
let running = false;
let paused = false;

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function clear() {
  ctx.fillStyle = '#0b0d0f';
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
}

function drawNet() {
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  const gap = 14;
  for (let y = 10; y < LOGICAL_HEIGHT; y += gap) {
    ctx.moveTo(LOGICAL_WIDTH / 2, y);
    ctx.lineTo(LOGICAL_WIDTH / 2, y + gap / 2);
  }
  ctx.stroke();
}

function drawRoundedRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
}

function draw() {
  clear();
  const grd = ctx.createRadialGradient(LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2, 10, LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2, 400);
  grd.addColorStop(0, 'rgba(0,212,255,0.03)');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
  drawNet();
  ctx.fillStyle = '#fff';
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 6;
  drawRoundedRect(player.x, player.y, player.width, player.height, 8);
  drawRoundedRect(ai.x, ai.y, ai.width, ai.height, 8);
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.fillStyle = '#00d4ff';
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = 'bold 36px Poppins, Arial';
  ctx.fillStyle = '#00d4ff';
  ctx.textAlign = 'center';
  ctx.fillText(String(playerScore), LOGICAL_WIDTH / 4, 50);
  ctx.fillText(String(aiScore), (LOGICAL_WIDTH / 4) * 3, 50);
}

function intersectRect(px, py, pw, ph, bx, by, br) {
  return (bx - br < px + pw && bx + br > px && by - br < py + ph && by + br > py);
}

function handlePaddleCollision(p) {
  if (intersectRect(p.x, p.y, p.width, p.height, ball.x, ball.y, ball.radius)) {
    if (p === player) {
      ball.x = player.x + player.width + ball.radius;
      ball.vx = Math.abs(ball.vx);
    } else {
      ball.x = ai.x - ball.radius;
      ball.vx = -Math.abs(ball.vx);
    }
    const relativeIntersectY = (ball.y - (p.y + p.height / 2)) / (p.height / 2);
    const bounceAngle = relativeIntersectY * (Math.PI / 3);
    const speed = Math.min(12, Math.hypot(ball.vx, ball.vy) * 1.07);
    ball.vx = (p === player ? 1 : -1) * Math.cos(bounceAngle) * speed;
    ball.vy = Math.sin(bounceAngle) * speed;
    ball.vy += (Math.random() - 0.5) * 0.8;
    playBeep(800, 0.03);
  }
}

function resetBall(direction = (Math.random() > 0.5 ? 1 : -1)) {
  ball.x = LOGICAL_WIDTH / 2;
  ball.y = LOGICAL_HEIGHT / 2;
  const angle = (Math.random() * Math.PI / 4) - (Math.PI / 8);
  ball.vx = direction * Math.cos(angle) * 6;
  ball.vy = Math.sin(angle) * 6;
}

function updateAI() {
  const targetY = ball.y - ai.height / 2;
  const dy = targetY - ai.y;
  const maxMove = ai.speed;
  ai.y += clamp(dy, -maxMove, maxMove);
  ai.y = clamp(ai.y, 0, LOGICAL_HEIGHT - ai.height);
}

function update() {
  if (!running || paused) return;
  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.y - ball.radius <= 0) {
    ball.y = ball.radius;
    ball.vy *= -1;
    playBeep(600, 0.02);
  } else if (ball.y + ball.radius >= LOGICAL_HEIGHT) {
    ball.y = LOGICAL_HEIGHT - ball.radius;
    ball.vy *= -1;
    playBeep(600, 0.02);
  }
  handlePaddleCollision(player);
  handlePaddleCollision(ai);
  if (ball.x - ball.radius <= 0) {
    aiScore++;
    updateScoreUI();
    playBeep(300, 0.06);
    resetBall(1);
  } else if (ball.x + ball.radius >= LOGICAL_WIDTH) {
    playerScore++;
    updateScoreUI();
    playBeep(1200, 0.06);
    resetBall(-1);
  }
  updateAI();
}

function updateScoreUI() {
  scoreEl.innerText = String(playerScore);
  scoreAIEl.innerText = String(aiScore);
}

let lastTime = 0;
function loop(time = 0) {
  const dt = time - lastTime;
  lastTime = time;
  resizeCanvasForDisplaySize(canvas);
  const rect = canvas.getBoundingClientRect();
  const scaleX = rect.width / LOGICAL_WIDTH;
  const scaleY = rect.height / LOGICAL_HEIGHT;
  ctx.save();
  ctx.scale(scaleX, scaleY);
  draw();
  update();
  ctx.restore();
  requestAnimationFrame(loop);
}

function movePlayerTo(y) {
  player.y = clamp(y - player.height / 2, 0, LOGICAL_HEIGHT - player.height);
}

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const cssY = (e.clientY - rect.top) / (rect.height) * LOGICAL_HEIGHT;
  movePlayerTo(cssY);
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const cssY = (touch.clientY - rect.top) / (rect.height) * LOGICAL_HEIGHT;
  movePlayerTo(cssY);
}, { passive: false });

const keys = new Set();
window.addEventListener('keydown', (e) => {
  keys.add(e.key);
  if (e.key === ' ' && !running) {
    startGame();
  }
});
window.addEventListener('keyup', (e) => {
  keys.delete(e.key);
});

function handleKeyboard() {
  if (keys.has('w') || keys.has('W') || keys.has('ArrowUp')) {
    player.y -= player.speed;
  } else if (keys.has('s') || keys.has('S') || keys.has('ArrowDown')) {
    player.y += player.speed;
  }
  player.y = clamp(player.y, 0, LOGICAL_HEIGHT - player.height);
}

function keyboardLoop() {
  if (running && !paused) {
    handleKeyboard();
  }
  requestAnimationFrame(keyboardLoop);
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playBeep(freq, duration = 0.05) {
  try {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.value = 0.0001;
    o.connect(g);
    g.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.06, now + 0.01);
    o.start(now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    o.stop(now + duration + 0.02);
  } catch (err) {}
}

startBtn.addEventListener('click', () => {
  startGame();
});
pauseBtn.addEventListener('click', () => {
  togglePause();
});
restartBtn.addEventListener('click', () => {
  restartGame();
});

function startGame() {
  if (!running) {
    running = true;
    paused = false;
    lastTime = performance.now();
  } else {
    paused = false;
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function togglePause() {
  if (!running) return;
  paused = !paused;
}

function restartGame() {
  running = true;
  paused = false;
  playerScore = 0;
  aiScore = 0;
  updateScoreUI();
  resetBall((Math.random() > 0.5) ? 1 : -1);
}

resetBall();
updateScoreUI();
requestAnimationFrame(loop);
requestAnimationFrame(keyboardLoop);
