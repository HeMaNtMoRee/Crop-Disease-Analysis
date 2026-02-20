@echo off
echo Starting Backend...
cd /d "%~dp0"
call .venv\Scripts\activate
echo Virtual Environment Activated.
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
pause
