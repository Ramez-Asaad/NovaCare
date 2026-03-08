# NovaCare — Roadmap & Tasks

> **Deadline:** May 31, 2026 · **Last Updated:** March 8, 2026 · **Team Size:** 5

---

## Status Legend

| Icon | Meaning |
|------|---------|
| ✅ | Done |
| 🔄 | In Progress |
| ⬜ | Not Started |
| 🔴 | Blocked |

---

## Phase 1: Core Software (✅ Complete)

> Foundation services and UI dashboards — all functional.

| Task | Status | Service |
|------|--------|---------|
| ASL fingerspelling model (PyTorch + MediaPipe) | ✅ | ASL Model |
| ASL FastAPI with `/predict` endpoints | ✅ | ASL Model |
| NovaBot conversational AI (HuggingFace LLM) | ✅ | LLM Backend |
| Facial emotion detection (ViT model) | ✅ | LLM Backend |
| Chat API (`/api/chat`, `/api/clear`) | ✅ | LLM Backend |
| Emotion API (`/api/emotion/detect`) | ✅ | LLM Backend |
| Rover dashboard (talk, health, meds, emergency, entertainment, navigate, help, settings) | ✅ | Frontend |
| Guardian dashboard (activity, communication, medications, settings) | ✅ | Frontend |
| Medical dashboard (vitals, records, care-plan, appointments, medications, settings) | ✅ | Frontend |
| Login & signup pages | ✅ | Frontend |
| Browser STT/TTS integration | ✅ | Frontend |
| ASL modal component | ✅ | Frontend |
| Emotion detection modal component | ✅ | Frontend |
| UI component library (Button, Card, Modal, Alert, etc.) | ✅ | Frontend |

---

## Phase 2: Repository & Infrastructure (🔄 In Progress)

> Cleaning up the codebase, unifying services, and preparing for integration.

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Unify 3 repos into single project structure | ✅ | — | `novacare/` folder created |
| One-click startup scripts (`start_all.bat`, `start_all.ps1`) | ✅ | — | Working |
| Project documentation (`docs/`) | 🔄 | — | This file + 3 others |
| Set up `.gitignore` for unified repo | ✅ | — | |
| Push unified repo to GitHub | ⬜ | | |
| Upgrade Next.js to stable patched version | ⬜ | | Currently on 14.2.35, consider stable v14 |
| Set up CI/CD pipeline (GitHub Actions) | ⬜ | | Lint + test on PR |
| Add environment variable validation on startup | ⬜ | | Fail fast if keys missing |

---

## Phase 3: Feature Completion (⬜ Not Started)

> Must-have features to complete before deadline.

| Task | Status | Priority | Service | Notes |
|------|--------|----------|---------|-------|
| **Navigation module** (robot control via web UI) | ⬜ | 🔴 Must-have | Frontend + ROS | Core rover feature |
| **Notification service** (real-time guardian alerts) | ⬜ | 🔴 Must-have | Backend | WebSocket or push notifications |
| **Fall detection** integration | ⬜ | 🔴 Must-have | ASL Model / new service | Pose estimation + alert pipeline |
| **Database migration** (SQLite → PostgreSQL) | ⬜ | 🟡 High | Frontend backend | Use Alembic for migrations |
| **Authentication middleware** (JWT/sessions) | ⬜ | 🟡 High | Frontend backend | Currently no real auth |
| **RAG medical queries** | ⬜ | 🟡 Medium | LLM Backend | Vector search on medical KB |
| Speech emotion recognition | ⬜ | 🟢 Nice-to-have | LLM Backend | Wav2Vec 2.0 model |
| Text emotion recognition | ⬜ | 🟢 Nice-to-have | LLM Backend | RoBERTa model |
| Multi-language support | ⬜ | 🟢 Nice-to-have | All | Arabic at minimum |

---

## Phase 4: Robot Integration (⬜ Not Started)

> Hardware integration once the JetAuto Kit is available.

| Task | Status | Notes |
|------|--------|-------|
| Set up ROS 2 on JetAuto Kit | ⬜ | Follow Hiwonder docs |
| Bridge ROS 2 ↔ web services (WebSocket/REST) | ⬜ | Navigation commands, sensor data |
| Deploy AI models to edge (Jetson) | ⬜ | Optimize for inference speed |
| Camera feed streaming to guardian dashboard | ⬜ | WebRTC or MJPEG |
| SLAM + obstacle avoidance integration | ⬜ | LiDAR + depth camera |
| Follow-user mode | ⬜ | Camera-based tracking |
| On-device vs cloud deployment decision | ⬜ | Performance benchmarks needed |

---

## Phase 5: Testing & Polish (⬜ Not Started)

> Final validation before graduation demo.

| Task | Status | Notes |
|------|--------|-------|
| Write API tests for all endpoints | ⬜ | pytest + requests |
| Write frontend component tests | ⬜ | React Testing Library |
| Integration testing (all 3 services) | ⬜ | End-to-end flow |
| Performance benchmarks (latency, accuracy) | ⬜ | ASL < 200ms, LLM < 3s |
| Accessibility audit (WCAG 2.1) | ⬜ | Screen reader, contrast, keyboard nav |
| User acceptance testing | ⬜ | Target ≥ 4.0/5.0 rating |
| Security review (secrets, CORS, auth) | ⬜ | |
| Final demo preparation | ⬜ | Presentation + live demo |

---

## Suggested Weekly Milestones

| Week | Dates | Focus |
|------|-------|-------|
| **W1** | Mar 9–15 | Finish repo cleanup, push to GitHub, set up CI |
| **W2** | Mar 16–22 | Navigation module + notification service skeleton |
| **W3** | Mar 23–29 | Fall detection + database migration |
| **W4** | Mar 30–Apr 5 | Authentication + RAG medical queries |
| **W5** | Apr 6–12 | Robot integration begins (ROS 2 setup) |
| **W6** | Apr 13–19 | Edge deployment + camera streaming |
| **W7** | Apr 20–26 | SLAM + navigation + follow-user |
| **W8** | Apr 27–May 3 | Integration testing + bug fixes |
| **W9** | May 4–10 | Performance tuning + accessibility audit |
| **W10** | May 11–17 | User testing + polish |
| **W11** | May 18–24 | Final demo prep + documentation |
| **W12** | May 25–31 | **🎓 Submission deadline** |

---

> **Note:** This roadmap should be updated weekly during team meetings. Mark tasks as 🔄 when started and ✅ when complete.
