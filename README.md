# 🌿 Healora — AI-Integrated Lifestyle Care Platform

Healora is a full-stack healthcare web application that combines doctor appointments, AI-powered health tools, diet planning, and symptom analysis — all in one platform.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 👤 Role-based Auth | Patient / Doctor / Admin with JWT |
| 🤖 AI Chatbot | Powered by Groq (Llama 3) |
| 🧬 Symptom Checker | AI analysis via Google Gemini |
| 🥗 Diet Planner | Personalised AI diet plans |
| 📅 Appointments | Book, manage & track appointments |
| 🎥 Video Call | Real-time video consultations |
| 💊 Wellness Hub | Health insights and predictions |
| 👨‍⚕️ Doctor Profiles | Public profiles with certificates |
| 📧 Contact Form | Email notifications via Nodemailer |

---

## 🛠️ Tech Stack

**Frontend:** React 19, TanStack Start, Tailwind CSS, TypeScript  
**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Multer  
**AI:** Google Gemini API, Groq SDK (Llama 3)  
**Deployment:** Netlify (frontend) + Render (backend)

---

## 📁 Project Structure

```
Healora/
├── backend/     # Express API server
└── frontend/    # TanStack Start React app (TypeScript + Tailwind)
```

---

## ⚙️ Local Setup

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Groq API key — [console.groq.com](https://console.groq.com)
- Google Gemini API key — [aistudio.google.com](https://aistudio.google.com)

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your values in .env
npm run dev
```

### 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The backend runs at `http://localhost:5000` and the frontend at `http://localhost:5173` (Vite default).

---

## 🔐 Environment Variables

**Backend** — copy `backend/.env.example` to `backend/.env`:

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_long_random_secret
GROQ_API_KEY=your_groq_key
GEMINI_API_KEY=your_gemini_key
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
PORT=5000
```

**Frontend** — copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore`.

---

## 👥 User Roles

| Role | Access |
|---|---|
| **Patient** | Book appointments, use AI tools, diet planner, chatbot |
| **Doctor** | Manage appointments, set schedule, update profile |
| **Admin** | Analytics dashboard, manage all users |

---

## 🌐 Deployment

- **Frontend:** Deployed on [Netlify](https://netlify.com) — see `netlify.toml`
- **Backend:** Deployed on [Render](https://render.com) — add all `.env` variables in Render's environment settings

---

## 📄 License

This project was created as a college major project. For educational use only.
