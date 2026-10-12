@echo off
title NeuraScan Launcher
echo ============================================================
echo Starting NeuraScan Brain Tumor Detection System...
echo ============================================================

echo [1/2] Starting Flask Backend on http://localhost:8000 ...
start "NeuraScan Backend" cmd /k "cd /d "%~dp0" && .\.venv\Scripts\python.exe app.py"

echo [2/2] Starting React Frontend on http://localhost:3000 ...
start "NeuraScan Frontend" cmd /k "cd /d "%~dp0brain-tumor-app" && npm run dev"

echo.
echo Both services launched in separate windows!
echo - Frontend: http://localhost:3000
echo - Backend:  http://localhost:8000
echo ============================================================
pause
