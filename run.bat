@echo off
title NETRISK — Enterprise Cybersecurity SDLC Decision Platform
echo ==========================================================
echo   NETRISK — Enterprise Cybersecurity SDLC Platform
echo   FastAPI Backend (Port 8001) + React Frontend (Port 5501)
echo ==========================================================

if exist ".venv\Scripts\python.exe" (
    set "PYTHON_CMD=.venv\Scripts\python.exe"
) else (
    set "PYTHON_CMD=python"
)

echo [+] Starting FastAPI Backend on http://127.0.0.1:8001 ...
start /B "" %PYTHON_CMD% -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8001

echo [+] Starting React Frontend on http://localhost:5501 ...
start http://localhost:5501
cd frontend
npm run dev
