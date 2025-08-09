# 🚀 Pong AI 🏓 — Play & Challenge the Bot

**Dev by Tharindu** ([github.com/Tharindu714](https://github.com/Tharindu714))

> Play directly: 🔗 **[https://tharindu714.github.io/pongai.com/](https://tharindu714.github.io/pongai.com/)**

---

Welcome to **Pong AI** — a modern, crisp take on the classic Pong game with responsive visuals, smooth controls, and a cheeky AI opponent that loves a good rematch. This repo is perfect for anyone who wants a quick browser game, a demo for frontend skills, or a fun time-waster. 🎉

## 🎯 Highlights

* ✅ **Play in your browser** — no install required (GitHub Pages live demo)
* 🎮 **Controls:** mouse, touch, keyboard (W / S / ↑ / ↓)
* 📱 **Mobile friendly** — touch controls supported
* 🖥️ **HiDPI / responsive canvas** for crisp graphics on all screens
* 🔊 Tiny built-in sound effects using WebAudio (no assets)
* ⚙️ Clean, well-commented code — comes in both a user-friendly JS file and a TypeScript source

## ▶️ Play Now

**Live demo:** [https://tharindu714.github.io/pongai.com/](https://tharindu714.github.io/pongai.com/)
Click **Start ▶** and show that bot who's the boss! 👑

## 💡 Why play this one?

This version of Pong adds subtle modern touches: a glowing center, rounded paddles, improved collision physics (so your hits feel *real*), a smarter but fair AI, and keyboard/touch support so you can challenge it anywhere.

---

## 🛠️ Run Locally

Want to tinker? Here's how:

```bash
# Clone the repo
git clone https://github.com/Tharindu714/pongai.com.git
cd pongai.com

# Option A — quick open (works in most browsers):
# open index.html in your browser

# Option B — run a simple HTTP server (recommended for audio & modules):
# Python 3
python -m http.server 8000
# then visit http://localhost:8000
```

If you prefer TypeScript development, `game.ts` is provided — compile with `tsc game.ts --outFile game.js` or use your preferred bundler (Vite/Parcel/webpack).

---

## 🎮 Controls

* **Mouse / Touch:** Move left paddle up & down
* **Keyboard:** `W` / `S` or `↑` / `↓`
* **Start:** Click **Start ▶** or press spacebar to serve
* **Pause / Restart:** Use the HUD buttons

---

## 📸 Screenshots / GIF

*(Paste your GIF or screenshots below — they look great on the repo front page.)*

<img width="1366" height="721" alt="image" src="https://github.com/user-attachments/assets/4e2972ba-075d-424b-8265-410ea50f8327" />


---

## 🧭 Architecture / Notes

* Single-canvas rendering with logical resolution (800×440) scaled for device pixel ratio
* Simple AI that predicts ball position with adjustable speed — easy to tweak
* Sound generated with WebAudio — no file dependencies

**UML / Diagram**

*(Paste UML diagram or architecture sketch here)*

---

## 🤝 Contribute

Love the game and want to help? Pull requests are very welcome!

* Add difficulty levels
* Add high-score persistence (`localStorage` or server backend)
* Improve visuals, particle effects, or add multiplayer

---

## 🤩 About the Dev

**Tharindu Chanaka** — Frontend tinkerer & indie game fan.
GitHub: [https://github.com/Tharindu714](https://github.com/Tharindu714)
Website / Demo: [https://tharindu714.github.io/pongai.com/](https://tharindu714.github.io/pongai.com/)

If you enjoyed the game, star ⭐ the repo and drop a message — I love seeing people play! If you want a custom version (branding, difficulty, or integration into your site), DM me on GitHub.

---

## 📜 License

This project is released under the **MIT License** — feel free to use, fork, and remix.

---

**Have fun slamming that little blue ball — and don’t forget to brag when you beat the AI! 🏆**
