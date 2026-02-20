# 🌱 Crop Disease Analysis System

An AI-powered web application that identifies crop diseases from images using **Ollama (Gemma 3)**.

## 🚀 Prerequisites

Before running the project, ensure you have the following installed:

1.  **Python 3.10+**: [Download Python](https://www.python.org/downloads/)
2.  **Node.js (v18+)**: [Download Node.js](https://nodejs.org/)
3.  **Ollama**: [Download Ollama](https://ollama.com/)
    *   **Important**: You must pull the specific model used by this app:
        ```bash
        ollama pull gemma3:4b
        ```

---

## 🛠️ Installation & Setup

### 1. Clone/Download the Repository
Extract the project files to a folder on your computer.

### 2. Backend Setup (Flask/FastAPI)

#### 🪟 Windows
1.  Open a terminal (Command Prompt or PowerShell) in the project root directory.
2.  Create a virtual environment:
    ```bash
    python -m venv .venv
    ```
3. Bypass Excecution policy
```bash
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted
```
3.  Activate the environment:
    ```bash
    .\.venv\Scripts\activate
    ```
4.  Install dependencies:
    ```bash
    pip install -r backend/requirements.txt
    ```
5.  Start the backend server:
    ```bash
    uvicorn backend.main:app --reload
    ```

#### 🍎 macOS / 🐧 Linux
1.  Open a terminal in the project root directory.
2.  Create a virtual environment:
    ```bash
    python3 -m venv .venv
    ```
3.  Activate the environment:
    ```bash
    source .venv/bin/activate
    ```
4.  Install dependencies:
    ```bash
    pip install -r backend/requirements.txt
    ```
5.  Start the backend server:
    ```bash
    uvicorn backend.main:app --reload
    ```

> The Backend API will run at: `http://localhost:8000`

---

### 3. Frontend Setup (React + Vite)

1.  Open a **new** terminal window (keep the backend running).
2.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

> The Frontend App will run at: `http://localhost:5173`

---

## 🏃‍♂️ Quick Start (Windows Only)

For convenience, you can simply double-click the `run_all.bat` file in the root directory. This script will:
1.  Check if Ollama is running.
2.  Start the Python Backend.
3.  Start the React Frontend.

---

## 🐛 Troubleshooting

*   **Ollama Connection Error**: Ensure Ollama is running in the background (`ollama serve`) and you have pulled `gemma3:4b`.
*   **Module Not Found**: Make sure you activated the virtual environment (`.venv`) before installing requirements.
*   **Port In Use**: If ports 8000 or 5173 are busy, close other applications using them.
