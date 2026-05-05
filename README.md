# 🐝 BeeFocused

**BeeFocused** is a minimalist hyperfocus assistant built to gently guide you through your deep work sessions — without snapping you out of the zone. Inspired by real-life check-ins, this app helps you stay aware of your focus, log your thoughts, and reflect with clarity.

---

## ✨ Features

- ⏱️ Customizable focus timer (set check-in intervals like 20, 30, or 45 mins)
- 🎙️ Voice check-ins, no typing mid-flow!
- 🎙️ Voice-to-text input
- 🧠 Automatic cleanup & bullet-point summaries (via LLM)
- 📋 End-session reflection summary
- 📤 Export notes to copy or download as PDF


---

## 🌱 Future Features & Ideas

- 🐝 Gentle reminders to stretch, drink water, or take a snack break
- ⏳ See total time spent on each type of task/project
- 📱 Mobile-first polish & PWA support
- 🐾 Cute bee animations for micro-interactions (optional)
- 🌘 Dark mode with a cozy bee-themed interface
- 💾 LocalStorage log of past sessions
- 🖥️ Desktop/local app mode for personal use on macOS
- 🔑 Bring-your-own-API-key mode so users can run summaries with their own provider key
- 📦 Reusable open-source setup for people who want to self-host the app

---

## 🔐 API Key Safety

The deployed frontend should never contain an AI provider API key. Browser-exposed environment variables such as `VITE_*` are public and should only contain non-secret values like the backend URL.

For the hosted demo, API calls should go through a small backend with:

- `OPENROUTER_API_KEY` stored only as a backend environment variable
- `ALLOWED_ORIGINS` limited to the deployed frontend URL and local development URLs
- basic rate limiting enabled
- request body size limits
- no transcript or API key logging
- spending/credit limits configured in the OpenRouter dashboard

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
