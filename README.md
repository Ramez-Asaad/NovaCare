# 🩺 NovaCare — Unified Project

NovaCare is an AI-powered healthcare companion application with three integrated services:

| Service | Port | Tech | Description |
|---------|------|------|-------------|
| 🖐️ ASL Model API | `8000` | FastAPI | Real-time ASL fingerspelling recognition |
| 🤖 LLM Backend | `5000` | Flask | Conversational AI chatbot (NovaBot) |
| 🖥️ Frontend | `3000` | Next.js | User interface with multiple dashboards |

---

## 📁 Project Structure

```
novacare/
├── services/
│   ├── asl-model/          ← FastAPI ASL recognition service
│   │   ├── api/            ← API routes & entry point
│   │   ├── config/         ← Model configuration
│   │   ├── inference/      ← Prediction & webcam logic
│   │   ├── models/         ← Neural network architecture
│   │   ├── training/       ← Training & evaluation scripts
│   │   └── requirements.txt
│   │
│   └── llm-backend/        ← Flask LLM chatbot service
│       ├── LLMs/           ← Conversational AI logic
│       ├── utils/           ← Utility functions
│       ├── static/js/      ← Client-side JS (NovaBotClient, STT, TTS)
│       ├── templates/      ← Test HTML templates
│       └── requirements.txt
│
├── frontend/                ← Next.js frontend application
│   ├── src/                ← React pages & components
│   │   ├── app/            ← Next.js App Router pages
│   │   ├── components/     ← Reusable UI components
│   │   ├── lib/            ← API clients & utilities
│   │   └── types/          ← TypeScript type definitions
│   ├── ai/                 ← AI integration modules
│   ├── backend/            ← Flask backend (dashboard routes)
│   └── package.json
│
├── start_all.bat            ← One-click launcher (CMD)
├── start_all.ps1            ← One-click launcher (PowerShell)
└── README.md                ← This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ and **npm**
- **Python** 3.10+
- A **Hugging Face API key**

### First-Time Setup

#### 1. ASL Model API
```powershell
cd services\asl-model

# Copy your existing venv here, OR create a new one:
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# For CUDA support:
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

> **Note:** You also need model checkpoints in `services/asl-model/checkpoints/`.
> Copy them from your original `ASL-model/model/checkpoints/` directory.

#### 2. LLM Backend
```powershell
cd services\llm-backend

python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Create .env file with your Hugging Face key:
echo HUGGINGFACE_API_KEY=hf_your_key_here > .env
```

#### 3. Frontend
```powershell
cd frontend

npm install

# Create .env.local:
echo NEXT_PUBLIC_NOVABOT_API_URL=http://localhost:5000 > .env.local
echo HUGGINGFACE_API_KEY=hf_your_key_here >> .env.local
```

### ⚡ Start All Services (One Command!)

**Option A — Double-click:**
```
start_all.bat
```

**Option B — PowerShell:**
```powershell
.\start_all.ps1
```

Both will open **3 terminal windows**, one per service. Each window:
- Activates the correct virtual environment
- Checks for missing dependencies and installs them
- Warns you about missing `.env` files
- Starts the service

### ✅ Verify Everything Works

| Service | URL | What to Expect |
|---------|-----|----------------|
| ASL Model API | http://localhost:8000/docs | FastAPI Swagger docs |
| LLM Backend | http://localhost:5000 | Server response |
| Frontend | http://localhost:3000 | NovaCare app loads |

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| `CUDA not available` | `pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118` |
| `mediapipe` import error | `pip uninstall mediapipe && pip install mediapipe==0.10.9` |
| ASL not detecting hands | Check lighting, keep hand in frame |
| Frontend can't reach LLM API | Ensure `.env.local` has `NEXT_PUBLIC_NOVABOT_API_URL=http://localhost:5000` |
| Frontend can't reach ASL API | Ensure ASL server is running on port `8000` |
| `venv` not found | Run `python -m venv venv` first |
| PowerShell execution policy | Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` |
