# InterviewVerse AI

InterviewVerse AI is a zero-cost, full-stack AI-powered mock interview preparation platform. Users can upload their resumes, choose an interview category and difficulty level, experience a real-time browser-based voice mock interview, and receive a comprehensive multi-dimensional report card.

---

## 🚀 Key Features

* **Custom JWT Authentication:** Secure signup, login, logout, and token rotation using secure HTTP-only cookies.
* **Resume upload & Parsing:** Real-time text extraction from PDFs using `pdf-parse` stored directly in MongoDB (no heavy cloud file hosting).
* **Zero-Cost Voice Pipeline:** Uses the browser's native **Web Speech API** for both Text-to-Speech (TTS) and Speech-to-Text (STT), eliminating server-side audio processing lag and external voice API costs.
* **Evaluation Engine:** Powered by **Google Gemini API**, grading user responses across 6 core metrics:
  * Technical Relevance
  * Communication Skills
  * Grammar & Sentence Construction
  * Confidence Level
  * Fluency
  * Vocabulary
* **Performance Dashboard:** Visualizes interview history and score progression over time using interactive graphs.
* **Abuse Protection & Security:** Configured with `helmet` for secure HTTP headers and `express-rate-limit` for DDoS prevention.

---

## 🛠️ Technology Stack

* **Frontend:** React.js (Vite) + Tailwind CSS v4 + Lucide React + Recharts
* **Backend:** Node.js + Express.js (MVC Architecture)
* **Database:** MongoDB Atlas + Mongoose
* **AI Engine:** Google Gemini API (via `@google/genai` SDK)
* **Speech Integration:** Native Browser Web Speech API (`webkitSpeechRecognition` & `speechSynthesis`)
* **Email Service:** Nodemailer + Resend SMTP

---

## 📂 Project Structure

```text
AI_Interview/
├── backend/                   # Backend Express Application
│   ├── src/
│   │   ├── config/            # Database connection
│   │   ├── controllers/       # Route request handlers
│   │   ├── middleware/        # JWT auth, rate limits, error handlers
│   │   ├── models/            # Mongoose Schemas (User, Resume, Interview, etc.)
│   │   ├── routes/            # Express endpoint routings
│   │   ├── services/          # Gemini AI & Resend email utilities
│   │   ├── utils/             # Helper helper/formatting functions
│   │   └── index.js           # Express app entry point
│   ├── .env.template          # Environment variables guide
│   └── package.json
├── frontend/                  # Frontend Vite React Application
│   ├── src/
│   │   ├── assets/            # Static assets
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # Auth and session state managers
│   │   ├── hooks/             # Custom Web Speech hooks
│   │   ├── pages/             # Dashboard, landing, and session views
│   │   ├── App.jsx            # Main app file
│   │   ├── index.css          # Tailwind CSS base file
│   │   └── main.jsx           # Vite React entry point
│   ├── vite.config.js
│   └── package.json
├── LIBRARIES.md               # Detailed guide for every external dependency
└── README.md                  # Project overview and setup instructions
```

---

## ⚙️ Local Installation & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and [MongoDB](https://www.mongodb.com/) (local or Atlas cluster) ready.

### 1. Backend Setup
1. Open the backend directory and copy the environment template:
   ```bash
   cd backend
   cp .env.template .env
   ```
2. Open `.env` and fill in your actual credentials:
   * `MONGO_URI`: Your MongoDB connection string.
   * `GEMINI_API_KEY`: Your key from Google AI Studio.
   * `RESEND_API_KEY`: Your API key from Resend.
3. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```
   *The backend will start running at `http://localhost:5000/`.*

### 2. Frontend Setup
1. Open the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies and start the Vite dev server:
   ```bash
   npm install --legacy-peer-deps
   npm run dev
   ```
   *The client will start running at `http://localhost:5173/`.*
