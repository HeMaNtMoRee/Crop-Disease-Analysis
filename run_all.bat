@echo off
echo ===========================================
echo   Starting Crop Disease Analysis System
echo ===========================================

:: Check if Ollama is running
tasklist /FI "IMAGENAME eq ollama.exe" 2>NUL | find /I /N "ollama.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] Ollama is running.
) else (
    echo [WARNING] Ollama is NOT running. Please start Ollama for reasoning features.
)

start "Backend Server" cmd /k "run_backend.bat"
start "Frontend Client" cmd /k "cd frontend && npm run dev"

echo.
echo Application starting...
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000/docs
echo.
pause
