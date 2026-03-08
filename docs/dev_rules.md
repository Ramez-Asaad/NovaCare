# NovaCare — Development Rules

> **Version:** 1.0 · **Last Updated:** March 8, 2026

These guidelines apply to all code contributed to the NovaCare project. The goal is consistency, readability, and maintainability across a 5-person team.

---

## 1. Git Workflow

### Branching Strategy (GitHub Flow)

```
main ──────────────────────────────────────────▶ (always deployable)
  └── feature/add-fall-detection ──── PR ──┘
  └── fix/asl-camera-timeout ────── PR ────┘
  └── chore/update-dependencies ─── PR ────┘
```

| Branch | Purpose |
|--------|---------|
| `main` | Stable, tested code. Never commit directly. |
| `feature/<name>` | New features |
| `fix/<name>` | Bug fixes |
| `chore/<name>` | Refactoring, dependency updates, docs |
| `hotfix/<name>` | Urgent fixes to production |

### Branch Naming
- Use lowercase with hyphens: `feature/guardian-notifications`
- Be descriptive but concise: `fix/asl-model-timeout` not `fix/issue-42`

### Commits

Follow **Conventional Commits**:

```
<type>(<scope>): <description>

[optional body]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `build`

**Scopes:** `frontend`, `llm-backend`, `asl-model`, `docs`, `scripts`

**Examples:**
```
feat(frontend): add medication reminder notifications
fix(asl-model): handle missing hand landmarks gracefully
docs(architecture): update API endpoint table
chore(scripts): fix PowerShell quoting in start_all.ps1
```

### Pull Requests
- Every PR must target `main`
- Include a description of **what** and **why**
- At least 1 team member must review before merge
- Squash-merge to keep history clean
- Delete the branch after merging

---

## 2. Code Style

### Python (LLM Backend + ASL Model)

- **Formatter:** Use [Black](https://github.com/psf/black) with default settings (line length 88)
- **Linter:** Use [Ruff](https://github.com/astral-sh/ruff) or Flake8
- **Type hints:** Use type hints for all function signatures
- **Docstrings:** Google-style docstrings for all public functions

```python
# ✅ Good
def predict_letter(image: np.ndarray, confidence_threshold: float = 0.5) -> dict:
    """Predict ASL letter from an image.

    Args:
        image: RGB image as numpy array (H, W, 3).
        confidence_threshold: Minimum confidence to accept prediction.

    Returns:
        Dictionary with 'letter', 'confidence', and 'landmarks' keys.
    """
    ...

# ❌ Bad
def predict(img, thresh=0.5):
    # predicts stuff
    ...
```

**Naming Conventions:**
| Element | Convention | Example |
|---------|-----------|---------|
| Functions | `snake_case` | `get_emotion_analyzer()` |
| Classes | `PascalCase` | `ASLPredictor` |
| Constants | `UPPER_SNAKE` | `CHECKPOINT_DIR` |
| Files | `snake_case.py` | `emotion_detection.py` |
| Private | `_prefix` | `_initialized` |

### TypeScript / React (Frontend)

- **Formatter:** Prettier (default settings)
- **Linter:** ESLint with Next.js config
- **Components:** Functional components with hooks (no class components)
- **Types:** Explicit TypeScript types — no `any` unless absolutely necessary

```tsx
// ✅ Good
interface MedicationCardProps {
  name: string;
  dosage: string;
  nextDose: Date;
  onTake: () => void;
}

export function MedicationCard({ name, dosage, nextDose, onTake }: MedicationCardProps) {
  return ( ... );
}

// ❌ Bad
export function MedicationCard(props: any) {
  return ( ... );
}
```

**Naming Conventions:**
| Element | Convention | Example |
|---------|-----------|---------|
| Components | `PascalCase` | `ASLRecognitionModal` |
| Files (components) | `PascalCase.tsx` | `EmotionDetectionModal.tsx` |
| Files (utilities) | `kebab-case.ts` | `asl-api.ts` |
| Hooks | `useCamelCase` | `useEmotionDetection` |
| Types/Interfaces | `PascalCase` | `VitalSignData` |
| CSS classes | `kebab-case` | `card-header` |

---

## 3. Project Structure Rules

### Service Boundaries
- Each service is **independent** — it has its own dependencies, venv/node_modules, and entry point
- Cross-service communication is **only via REST API** — never import directly between services
- Environment variables configure URLs, never hardcode service addresses

### File Organization
- **One component per file** in the frontend
- **Group by feature**, not by type (e.g., `/rover/medications/page.tsx`, not `/pages/medications.tsx`)
- Keep utility functions in `lib/` (frontend) or `utils/` (backend)
- Configuration in dedicated `config/` folders, not scattered in code

### API Design
- Use RESTful conventions: `GET` for reads, `POST` for mutations
- Return consistent JSON shapes:
  ```json
  {
    "status": "success" | "error",
    "data": { ... },
    "error": "message (only on error)"
  }
  ```
- Include `/health` endpoints on every service
- Use appropriate HTTP status codes (200, 400, 404, 500)

---

## 4. Environment & Secrets

- **Never** commit `.env`, `.env.local`, or API keys
- Use `.env.example` files to document required variables
- Prefix public frontend vars with `NEXT_PUBLIC_`
- Store secrets in `.env` files locally; use environment variables in production

---

## 5. Testing Guidelines

### Test Structure
```
service/
├── tests/
│   ├── test_api.py         # API endpoint tests
│   ├── test_model.py       # Model/logic unit tests
│   └── conftest.py         # Shared fixtures
```

### Testing Practices
- Write tests for all API endpoints (happy path + error cases)
- Write tests for AI model inference (mock the model for speed)
- Use `pytest` for Python services
- Use descriptive test names: `test_chat_returns_error_when_message_empty`
- Run tests before every PR merge

### Test Commands
```bash
# ASL Model
cd services/asl-model && python -m pytest tests/ -v

# LLM Backend
cd services/llm-backend && python -m pytest tests/ -v

# Frontend
cd frontend && npm test
```

---

## 6. Documentation

- Update `docs/` when adding features or changing architecture
- Keep `README.md` current with setup instructions
- Add inline comments for **why**, not **what** (the code shows what)
- Use JSDoc / docstrings for all public interfaces

---

## 7. Code Review Checklist

Before approving a PR, reviewers should check:

- [ ] Code follows naming conventions and style guidelines
- [ ] No hardcoded secrets, URLs, or magic numbers
- [ ] Error handling is present (try/catch, status codes)
- [ ] New endpoints include health/validation checks
- [ ] Types are explicit (no `any` in TS, type hints in Python)
- [ ] Documentation is updated if behavior changes
- [ ] No debug code left behind (`console.log`, `print` statements)
