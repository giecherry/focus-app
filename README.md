# 🐝 BeeFocused

**BeeFocused** is a minimalist hyperfocus assistant built to gently guide you through your deep work sessions — without snapping you out of the zone. Inspired by real-life check-ins, this app helps you stay aware of your focus, log your thoughts, and reflect with clarity.

<img src="preview.png" alt="BeeFocused screenshot" width="600"/>

---

## ✨ Features

- ⏱️ Customizable focus timer (set check-in intervals like 20, 30, or 45 mins)
- 🎙️ Voice check-ins using Web Speech API (no typing mid-flow!)
- 🎙️ Voice-to-text input using the Web Speech API
- 🧠 Automatic cleanup & bullet-point summaries (via LLM)
- 📋 End-session reflection summary
- 💾 LocalStorage log of past sessions
- 📤 Export notes to copy or download as PDF
- 🌘 Dark mode with a cozy bee-themed interface

---

## 🌱 Future Features & Ideas

- 🐝 Gentle reminders to stretch, drink water, or take a snack break
- 🧠 Smarter summaries using GPT or Whisper (via OpenAI or OpenRouter)
- ⏳ See total time spent on each type of task/project
- 📱 Mobile-first polish & PWA support
- 🐾 Cute bee animations for micro-interactions (optional)
- 🧑‍💻 Self-hosted backend for syncing across devices (if needed)

---

## 🚀 Live Demo

**▶ Try it now on Vercel:**  
[https://bee-focused.vercel.app/](https://bee-focused.vercel.app/)

---

## 🛠 Tech Stack

- ⚛️ [React](https://react.dev/)
- ⚡ [Vite](https://vitejs.dev/)
- 💨 [TailwindCSS](https://tailwindcss.com/)
- 🧠 Web Speech API (for voice-to-text)
- 🧩 Optional/WIP: LLM summarization via [OpenAI](https://platform.openai.com/docs) / [OpenRouter](https://openrouter.ai/)

---

## 🧪 Running Locally

```bash
# Clone the repo
git clone https://github.com/giecherry/focus-app.git
cd focus-app

# Install dependencies
npm install

# Start the dev server
npm run dev
