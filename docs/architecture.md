# NovaCare — System Architecture

> **Version:** 1.0 · **Last Updated:** March 8, 2026

---

## 1. High-Level Architecture

NovaCare follows a **3-service microservice architecture** with a shared frontend. Each service runs independently and communicates via REST APIs.

```
┌─────────────────────────────────────────────────────────────┐
│                    USER (Browser / Rover Touchscreen)        │
│                      http://localhost:3000                   │
└────────────┬───────────────────┬───────────────────┬────────┘
             │                   │                   │
             ▼                   ▼                   ▼
┌────────────────┐   ┌───────────────────┐   ┌──────────────┐
│   Frontend     │   │   LLM Backend     │   │  ASL Model   │
│   (Next.js)    │──▶│   (Flask)         │   │  API         │
│   Port 3000    │   │   Port 5000       │   │  (FastAPI)   │
│                │   │                   │   │  Port 8000   │
│  ┌──────────┐  │   │ • /api/chat       │   │              │
│  │ Rover    │  │   │ • /api/emotion/*  │   │ • /predict   │
│  │ Guardian │  │   │ • /api/clear      │   │ • /health    │
│  │ Medical  │  │   │ • /health         │   │ • /reset     │
│  └──────────┘  │   └───────────────────┘   └──────────────┘
│                │              │                    │
│  ┌──────────┐  │              ▼                    ▼
│  │ Flask    │  │   ┌───────────────────┐   ┌──────────────┐
│  │ Backend  │  │   │ HuggingFace API   │   │ PyTorch +    │
│  │ (Python) │  │   │ ViT Emotion Model │   │ MediaPipe    │
│  │ Port 5001│  │   └───────────────────┘   └──────────────┘
│  └──────────┘  │
└────────────────┘
        │
        ▼
 ┌──────────────┐
 │  SQLite DB   │
 │ (novacare.db)│
 └──────────────┘
```

---

## 2. Service Details

### 2.1 Frontend (`/frontend`)

| Attribute | Value |
|-----------|-------|
| **Framework** | Next.js 14 (App Router) |
| **Port** | 3000 |
| **Language** | TypeScript + React 18 |
| **Styling** | Tailwind CSS + Framer Motion |
| **State** | React hooks (no external state lib) |

**Structure:**
```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/               # Login, Signup
│   │   ├── rover/              # Primary user dashboard
│   │   │   ├── talk/           # NovaBot chat interface
│   │   │   ├── health/         # Health overview
│   │   │   ├── medications/    # Medication reminders
│   │   │   ├── emergency/      # Emergency contacts & SOS
│   │   │   ├── entertainment/  # Media & activities
│   │   │   ├── navigate/       # Robot navigation controls
│   │   │   ├── help/           # ASL guide & help
│   │   │   └── settings/       # Rover preferences
│   │   ├── guardian/           # Caregiver dashboard
│   │   │   ├── activity/       # Activity logs
│   │   │   ├── communication/  # Messaging
│   │   │   ├── medications/    # Medication management
│   │   │   └── settings/       # Guardian preferences
│   │   └── medical/            # Doctor dashboard
│   │       ├── vitals/         # Vital signs charts
│   │       ├── records/        # Patient records
│   │       ├── care-plan/      # Care plans
│   │       ├── appointments/   # Scheduling
│   │       ├── medications/    # Prescriptions
│   │       └── settings/       # Medical preferences
│   ├── components/             # Shared UI components
│   │   ├── ASLRecognitionModal.tsx
│   │   ├── EmotionDetectionModal.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── ui/                 # Design system (Button, Card, etc.)
│   ├── lib/                    # API clients & utilities
│   │   ├── asl-api.ts          # ASL Model API client
│   │   ├── emotion-api.ts      # Emotion detection client
│   │   ├── novabot-api.ts      # LLM chat client
│   │   ├── speech.ts           # Browser STT/TTS
│   │   └── utils.ts
│   └── types/                  # TypeScript definitions
├── backend/                    # Flask backend (dashboard data)
│   ├── routes/api/             # REST endpoints (alerts, chat, medication, vitals)
│   ├── routes/auth.py          # Authentication
│   ├── routes/dashboard.py     # Dashboard rendering
│   ├── templates/              # HTML templates (Jinja2)
│   └── static/                 # CSS & JS assets
├── ai/                         # AI integration modules
└── package.json
```

**API Communication:**
- → LLM Backend: via `NEXT_PUBLIC_NOVABOT_API_URL` env var (default `http://localhost:5000`)
- → ASL Model: via hardcoded `http://localhost:8000` in `lib/asl-api.ts`

---

### 2.2 LLM Backend (`/services/llm-backend`)

| Attribute | Value |
|-----------|-------|
| **Framework** | Flask + Flask-CORS |
| **Port** | 5000 |
| **AI Models** | HuggingFace LLM (conversational), ViT (emotion detection) |
| **Entry point** | `start_server.py` or `api_server.py` |

**API Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat` | Send message, get AI response |
| `POST` | `/api/clear` | Clear conversation history |
| `POST` | `/api/emotion/detect` | Detect emotion from base64 image |
| `GET` | `/api/emotion/health` | Check emotion analyzer status |
| `GET` | `/health` | Service health check |

**Key modules:**
- `LLMs/conversational_ai.py` — HuggingFace model wrapper for chat
- `emotion_detection.py` — ViT-based facial emotion recognition
- `utils/` — Shared utilities

---

### 2.3 ASL Model API (`/services/asl-model`)

| Attribute | Value |
|-----------|-------|
| **Framework** | FastAPI + Uvicorn |
| **Port** | 8000 |
| **AI Models** | Custom PyTorch CNN + MediaPipe hand landmarks |
| **Entry point** | `python -m api.main --port 8000` |

**API Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/predict` | Predict ASL letter from base64 image |
| `POST` | `/predict/landmarks` | Predict from raw hand landmarks |
| `POST` | `/predict/confirm` | Predict with text accumulation |
| `GET` | `/accumulator` | Get accumulated text |
| `POST` | `/reset` | Reset predictor state |
| `GET` | `/health` | Service health check |

**Key modules:**
- `inference/predictor.py` — ASLPredictor class with MediaPipe + PyTorch
- `models/landmark_classifier.py` — Neural network architecture
- `training/` — Training, evaluation, and data augmentation scripts
- `config/config.py` — Model and API configuration

---

## 3. Data Flow

```
User Input (voice/text/ASL/touch)
        │
        ▼
┌─── Frontend ───────────────────────────────────────┐
│  Browser captures input                             │
│  • Voice → Web Speech API (STT) → text              │
│  • ASL → Camera → base64 frame → ASL API → text     │
│  • Text → direct input                              │
│  • Emotion → Camera → base64 → LLM Backend          │
└────────────┬──────────────────────────────┬─────────┘
             │ text message                 │ base64 image
             ▼                              ▼
    ┌─── LLM Backend ──┐         ┌── ASL Model API ──┐
    │ Conversational AI │         │ MediaPipe → CNN    │
    │ → HuggingFace LLM │         │ → letter → text    │
    └────────┬──────────┘         └────────┬──────────┘
             │ AI response                  │ recognized text
             ▼                              ▼
       ┌─── Frontend ──────────────────────────────┐
       │ Display response (text + TTS audio)        │
       └────────────────────────────────────────────┘
```

---

## 4. Database (Current)

**SQLite** (`novacare.db`) managed via the Flask backend. Planned migration to **PostgreSQL**.

Key entities (from project book ERD):
- `User` — profiles with role-based access
- `VitalSign` — health metrics
- `MedicationSchedule` — reminders and tracking
- `AlertEvent` — safety alerts and notifications
- `HealthReport` — generated health summaries
- `InteractionLog` — conversation and usage logs

---

## 5. Deployment

| Current | Planned |
|---------|---------|
| Local development (3 terminals or `start_all.bat`) | To be decided: local on rover vs. cloud |
| SQLite | PostgreSQL |
| No auth middleware | JWT/session-based auth |
| No HTTPS | TLS for all communications |

---

## 6. Future Architecture Considerations

- **Robot Integration:** ROS 2 nodes will communicate with the web services via WebSocket/REST
- **Notification Service:** WebSocket or push notifications for real-time guardian alerts
- **Cloud Deployment:** API gateway + containerized services if deployed to cloud
- **Database:** ORM migration from SQLite to PostgreSQL with Alembic migrations
