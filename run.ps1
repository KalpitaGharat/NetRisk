# NETRISK — Enterprise Cybersecurity Risk Intelligence Platform
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  NETRISK — Enterprise Cybersecurity SDLC Platform" -ForegroundColor Cyan
Write-Host "  FastAPI Core (Port 8000) + React Frontend (Port 5501)" -ForegroundColor DarkCyan
Write-Host "==========================================================" -ForegroundColor Cyan

$VENV_PYTHON = ".\.venv\Scripts\python.exe"
if (-not (Test-Path $VENV_PYTHON)) {
    $VENV_PYTHON = "python"
}

Write-Host "[+] Ensuring FastAPI Backend is running on http://127.0.0.1:8000 ..." -ForegroundColor Green
Start-Process -NoNewWindow $VENV_PYTHON -ArgumentList "-m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000"

Write-Host "[+] Starting React Frontend on http://localhost:5501 ..." -ForegroundColor Cyan
Start-Process "http://localhost:5501"
Set-Location frontend
npm run dev
