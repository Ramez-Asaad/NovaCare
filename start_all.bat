@echo off
title NovaCare - Service Launcher
color 0A

echo.
echo  ============================================
echo   NovaCare - Starting All Services
echo  ============================================
echo.
echo  [1] ASL Model API     (port 8000)
echo  [2] LLM Backend       (port 5000)
echo  [3] Frontend           (port 3000)
echo.
echo  ============================================
echo.

set "ROOT=%~dp0"

:: -----------------------------------------------
:: Terminal 1: ASL Model API (FastAPI, port 8000)
:: -----------------------------------------------
echo [*] Starting ASL Model API...
start "NovaCare - ASL Model API (port 8000)" cmd /k "cd /d "%ROOT%services\asl-model" && if not exist venv (echo [!] No venv found. Create one with: python -m venv venv && echo [!] Then copy your existing venv or install deps: pip install -r requirements.txt && pause && exit) else (call venv\Scripts\activate.bat && echo [OK] ASL Model venv activated && echo [*] Starting FastAPI on port 8000... && python -m api.main --port 8000)"

:: Small delay so terminals don't fight over resources
timeout /t 2 /nobreak >nul

:: -----------------------------------------------
:: Terminal 2: LLM Backend (Flask, port 5000)
:: -----------------------------------------------
echo [*] Starting LLM Backend...
start "NovaCare - LLM Backend (port 5000)" cmd /k "cd /d "%ROOT%services\llm-backend" && if not exist venv (echo [!] No venv found. Creating... && python -m venv venv && call venv\Scripts\activate.bat && echo [*] Installing dependencies... && pip install -r requirements.txt && echo [OK] Dependencies installed) else (call venv\Scripts\activate.bat && echo [OK] LLM Backend venv activated) && if not exist .env (echo [!] WARNING: No .env file found! Create one with: HUGGINGFACE_API_KEY=your_key_here && pause) && echo [*] Starting Flask on port 5000... && python start_server.py"

timeout /t 2 /nobreak >nul

:: -----------------------------------------------
:: Terminal 3: Frontend (Next.js, port 3000)
:: -----------------------------------------------
echo [*] Starting Frontend...
start "NovaCare - Frontend (port 3000)" cmd /k "cd /d "%ROOT%frontend" && if not exist node_modules (echo [*] Installing npm dependencies... && npm install && echo [OK] Dependencies installed) else (echo [OK] node_modules found) && if not exist .env.local (echo [!] WARNING: No .env.local file found! && echo [!] Create one with: NEXT_PUBLIC_NOVABOT_API_URL=http://localhost:5000 && echo [!]                   HUGGINGFACE_API_KEY=your_key_here) && echo [*] Starting Next.js on port 3000... && npm run dev"

echo.
echo  ============================================
echo   All services launched in separate windows!
echo  ============================================
echo.
echo  ASL Model API:  http://localhost:8000/docs
echo  LLM Backend:    http://localhost:5000
echo  Frontend:       http://localhost:3000
echo.
echo  Close this window or press any key to exit.
pause >nul
