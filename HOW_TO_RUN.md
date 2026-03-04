# 🚀 NovaCare — How to Run Everything

This guide covers starting all 3 services needed to run the full NovaCare app.

| Service          | Port   | Tech         |
|------------------|--------|--------------|
| 🖥️ Frontend      | `3000` | Next.js      |
| 🤖 LLM Backend   | `5000` | Flask        |
| 🖐️ ASL Model API | `8000` | FastAPI      |

> **You need 3 separate terminals** — one for each service.

---

## Prerequisites

- **Node.js** (v18+) and **npm**
- **Python** (3.10+)
- A **Hugging Face API key** (for the LLM backend)

---

## Terminal 1 — ASL Model API (port 8000)

```powershell
# Navigate to the ASL model directory
cd "G:\OneDrive - Alamein International University\Uni stuff\semester 7 - Fall 25-26\graduation project\ASL-model\model"

# Activate the virtual environment
venv\Scripts\activate

# (First time only) Install dependencies
pip install -r requirements.txt

# Start the API server
python -m api.main --port 8000
```

✅ Verify: open http://localhost:8000/docs — you should see the FastAPI docs.

---

## Terminal 2 — LLM Backend (port 5000)

```powershell
# Navigate to the LLM backend directory
cd "G:\OneDrive - Alamein International University\Uni stuff\semester 7 - Fall 25-26\graduation project\LLM\NovaCare-backend-stitch"

# Activate the virtual environment
venv\Scripts\activate

# (First time only) Install dependencies
pip install -r requirements.txt

# Make sure the .env file exists with your Hugging Face key:
#   HUGGINGFACE_API_KEY=hf_your_key_here

# Start the Flask server
python -c "from api_server import app; app.run(host='0.0.0.0', port=5000, debug=False)"
```

✅ Verify: open http://localhost:5000 — the server should respond.

---

## Terminal 3 — Frontend (port 3000)

```powershell
# Navigate to the frontend directory
cd "G:\OneDrive - Alamein International University\Uni stuff\semester 7 - Fall 25-26\graduation project\UIUX\novacare-frontend"

# (First time only) Install dependencies
npm install

# Make sure .env.local exists with:
#   NEXT_PUBLIC_NOVABOT_API_URL=http://localhost:5000
#   HUGGINGFACE_API_KEY=hf_your_key_here

# Start the dev server
npm run dev
```

✅ Verify: open http://localhost:3000 — the app should load.

---

## ⚡ Quick Start (after first-time setup)

Once everything is installed, you just need these 3 commands in 3 terminals:

```
# Terminal 1 — ASL Model
cd "...\ASL-model\model" && venv\Scripts\activate && python -m api.main --port 8000

# Terminal 2 — LLM Backend
cd "...\NovaCare-backend-stitch" && venv\Scripts\activate && python -c "from api_server import app; app.run(host='0.0.0.0', port=5000, debug=False)"

# Terminal 3 — Frontend
cd "...\novacare-frontend" && npm run dev
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| `CUDA not available` | `pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118` |
| `mediapipe` import error | `pip uninstall mediapipe && pip install mediapipe==0.10.9` |
| ASL not detecting hands | Check lighting, keep hand in frame |
| Frontend can't reach LLM API | Make sure `.env.local` has `NEXT_PUBLIC_NOVABOT_API_URL=http://localhost:5000` |
| Frontend can't reach ASL API | Make sure the ASL server is running on port `8000` |
| `venv` not found | Run `python -m venv venv` first to create it |
