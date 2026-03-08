#Requires -Version 5.1
<#
.SYNOPSIS
    NovaCare - Unified Service Launcher (PowerShell)
.DESCRIPTION
    Starts all 3 NovaCare services in separate terminal windows:
    1. ASL Model API     (FastAPI, port 8000)
    2. LLM Backend       (Flask,   port 5000)
    3. Frontend           (Next.js, port 3000)
.NOTES
    Run with: .\start_all.ps1
    If you get an execution policy error, run:
      Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
#>

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

# ---- Colors & Banner ----
function Write-Banner {
    Write-Host ""
    Write-Host "  ============================================" -ForegroundColor Cyan
    Write-Host "   NovaCare - Starting All Services" -ForegroundColor White
    Write-Host "  ============================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   [1] ASL Model API     " -NoNewline; Write-Host "(port 8000)" -ForegroundColor Yellow
    Write-Host "   [2] LLM Backend       " -NoNewline; Write-Host "(port 5000)" -ForegroundColor Yellow
    Write-Host "   [3] Frontend           " -NoNewline; Write-Host "(port 3000)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  ============================================" -ForegroundColor Cyan
    Write-Host ""
}

# ---- Service launcher ----
function Start-Service {
    param(
        [string]$Name,
        [string]$WorkDir,
        [string]$Command,
        [string]$Color = "Green"
    )
    Write-Host "  [*] Starting $Name..." -ForegroundColor $Color
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$WorkDir'; $Command" -WindowStyle Normal
    Start-Sleep -Seconds 2
}

Write-Banner

# -------------------------------------------------
# 1. ASL Model API (FastAPI, port 8000)
# -------------------------------------------------
$aslDir = Join-Path $Root "services\asl-model"
$aslCmd = @"
Write-Host '=== NovaCare - ASL Model API ===' -ForegroundColor Cyan
if (-not (Test-Path 'venv')) {
    Write-Host '[!] No venv found!' -ForegroundColor Red
    Write-Host '[!] Copy your existing venv here, or run:' -ForegroundColor Yellow
    Write-Host '    python -m venv venv' -ForegroundColor Yellow
    Write-Host '    .\venv\Scripts\Activate.ps1' -ForegroundColor Yellow
    Write-Host '    pip install -r requirements.txt' -ForegroundColor Yellow
} else {
    .\venv\Scripts\Activate.ps1
    Write-Host '[OK] ASL Model venv activated' -ForegroundColor Green
    Write-Host '[*] Starting FastAPI on port 8000...' -ForegroundColor Cyan
    python -m api.main --port 8000
}
"@
Start-Service -Name "ASL Model API" -WorkDir $aslDir -Command $aslCmd -Color "Magenta"

# -------------------------------------------------
# 2. LLM Backend (Flask, port 5000)
# -------------------------------------------------
$llmDir = Join-Path $Root "services\llm-backend"
$llmCmd = @"
Write-Host '=== NovaCare - LLM Backend ===' -ForegroundColor Cyan
if (-not (Test-Path 'venv')) {
    Write-Host '[*] Creating venv...' -ForegroundColor Yellow
    python -m venv venv
    .\venv\Scripts\Activate.ps1
    Write-Host '[*] Installing dependencies...' -ForegroundColor Yellow
    pip install -r requirements.txt
    Write-Host '[OK] Dependencies installed' -ForegroundColor Green
} else {
    .\venv\Scripts\Activate.ps1
    Write-Host '[OK] LLM Backend venv activated' -ForegroundColor Green
}
if (-not (Test-Path '.env')) {
    Write-Host '[!] WARNING: No .env file found!' -ForegroundColor Red
    Write-Host '[!] Create .env with: HUGGINGFACE_API_KEY=your_key_here' -ForegroundColor Yellow
}
Write-Host '[*] Starting Flask on port 5000...' -ForegroundColor Cyan
python start_server.py
"@
Start-Service -Name "LLM Backend" -WorkDir $llmDir -Command $llmCmd -Color "Blue"

# -------------------------------------------------
# 3. Frontend (Next.js, port 3000)
# -------------------------------------------------
$feDir = Join-Path $Root "frontend"
$feCmd = @"
Write-Host '=== NovaCare - Frontend ===' -ForegroundColor Cyan
if (-not (Test-Path 'node_modules')) {
    Write-Host '[*] Installing npm dependencies...' -ForegroundColor Yellow
    npm install
    Write-Host '[OK] Dependencies installed' -ForegroundColor Green
} else {
    Write-Host '[OK] node_modules found' -ForegroundColor Green
}
if (-not (Test-Path '.env.local')) {
    Write-Host '[!] WARNING: No .env.local file found!' -ForegroundColor Red
    Write-Host '[!] Create .env.local with:' -ForegroundColor Yellow
    Write-Host '    NEXT_PUBLIC_NOVABOT_API_URL=http://localhost:5000' -ForegroundColor Yellow
    Write-Host '    HUGGINGFACE_API_KEY=your_key_here' -ForegroundColor Yellow
}
Write-Host '[*] Starting Next.js on port 3000...' -ForegroundColor Cyan
npm run dev
"@
Start-Service -Name "Frontend" -WorkDir $feDir -Command $feCmd -Color "Green"

# ---- Summary ----
Write-Host ""
Write-Host "  ============================================" -ForegroundColor Cyan
Write-Host "   All services launched!" -ForegroundColor Green
Write-Host "  ============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "   ASL Model API:  " -NoNewline; Write-Host "http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host "   LLM Backend:    " -NoNewline; Write-Host "http://localhost:5000" -ForegroundColor Yellow
Write-Host "   Frontend:       " -NoNewline; Write-Host "http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
