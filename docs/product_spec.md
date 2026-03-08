# NovaCare — Product Specification (PRD)

> **Version:** 1.0 · **Last Updated:** March 8, 2026 · **Deadline:** May 31, 2026

---

## 1. Overview

**NovaCare** is the software layer of an AI-powered assistant rover designed to support individuals with physical or sensory disabilities. The rover integrates advanced AI models for multimodal communication, health monitoring, safety, and autonomous navigation — all accessible through a web-based interface.

### Vision
Enable disabled individuals to live more independently by providing a unified, intelligent assistant that communicates naturally, monitors health proactively, and alerts caregivers instantly.

### Context
This is the software component of a larger graduation project. The full system includes the **Hiwonder JetAuto Kit** rover hardware, onboard sensors, and this web application stack. The software is being developed ahead of hardware integration.

---

## 2. Target Users

| Role | Description | Dashboard |
|------|-------------|-----------|
| **Rover (Primary User)** | Elderly or disabled individuals using the rover day-to-day | `/rover/*` — simplified, accessible interface |
| **Guardian (Caregiver)** | Family members or caregivers monitoring the user remotely | `/guardian/*` — monitoring, medications, activity |
| **Medical (Doctor)** | Healthcare professionals reviewing patient data | `/medical/*` — vitals, records, care plans, appointments |

---

## 3. Core Features

### 3.1 Currently Implemented ✅

| Feature | Service | Description |
|---------|---------|-------------|
| **NovaBot Chat** | LLM Backend | Conversational AI via HuggingFace LLM, accessible from Rover dashboard |
| **ASL Recognition** | ASL Model API | Real-time fingerspelling recognition from camera feed using MediaPipe + PyTorch |
| **Emotion Detection** | LLM Backend | Facial emotion recognition using ViT model (7 emotion categories) |
| **Speech-to-Text** | Frontend (browser) | Voice input for hands-free interaction |
| **Text-to-Speech** | Frontend (browser) | Voice output for accessibility |
| **Rover Dashboard** | Frontend | Talk, health, medications, emergency, entertainment, navigation, settings |
| **Guardian Dashboard** | Frontend | Activity monitoring, communication, medication tracking, settings |
| **Medical Dashboard** | Frontend | Vitals, records, care plans, appointments, medications, settings |
| **Authentication** | Frontend | Login and signup pages |

### 3.2 Planned / In Progress 🔄

| Feature | Priority | Description |
|---------|----------|-------------|
| **Navigation Module** | Must-have | Robot navigation controls integrated into the web interface |
| **Notification Service** | High | Real-time alerts to guardians (fall detection, health anomalies) |
| **Fall Detection** | High | Pose estimation-based fall detection with emergency alerts |
| **Database Migration** | Medium | Migrate from SQLite to PostgreSQL for production |
| **RAG Medical Queries** | Medium | Retrieval-augmented generation for medical Q&A |
| **Multimodal Emotion** | Low | Speech + text emotion detection alongside facial |

---

## 4. Functional Requirements

> Derived from the project book, filtered to software-relevant items.

| ID | Requirement |
|----|-------------|
| FR-1 | Users can communicate via voice, text, or ASL through the rover interface |
| FR-2 | The system recognizes ASL fingerspelling from camera input in real time |
| FR-3 | NovaBot provides conversational responses using an LLM |
| FR-4 | The system detects facial emotions and adapts responses accordingly |
| FR-5 | Guardians receive real-time alerts for safety events (falls, health anomalies) |
| FR-6 | Medical personnel can view patient vitals, records, and generate health reports |
| FR-7 | The system tracks and reminds users about medications |
| FR-8 | Users are authenticated with role-based access (Rover, Guardian, Medical) |
| FR-9 | All user interactions are logged for review and diagnostics |

## 5. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | ASL recognition < 200ms latency; LLM response < 3s |
| **Accessibility** | WCAG 2.1 compliant; multimodal feedback (visual + audio + text) |
| **Security** | Role-based access control; encrypted communication (TLS); no biometric data stored without consent |
| **Privacy** | Local-first data storage; explicit consent for recordings; 30-day log retention |
| **Compatibility** | Chrome, Edge, Safari; responsive for tablet (rover touchscreen) |

---

## 6. Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion |
| **LLM Backend** | Python, Flask, HuggingFace Transformers, ViT (emotion detection) |
| **ASL Model API** | Python, FastAPI, PyTorch, MediaPipe, Uvicorn |
| **Database** | SQLite (current) → PostgreSQL (planned) |
| **Robot** | Hiwonder JetAuto Kit, ROS 2 (future integration) |

---

## 7. Team

5-member team at Alamein International University, graduation project for Fall 2025–26.

## 8. Timeline

- **Now → May 31, 2026:** Finish software layer, repository cleanup, robot integration
- See [roadmap.md](./roadmap.md) for detailed task breakdown
