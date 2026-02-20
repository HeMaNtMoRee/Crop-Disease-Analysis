# 🏗️ Project Workflow & Architecture

## Overview
This project is a **Full-Stack AI Application** designed to help farmers and agronomists identify crop diseases from images. It uses a modern web frontend to interact with a powerful Python backend that leverages **Ollama** for local AI inference.

---

## 💻 Tech Stack

### Frontend
*   **Framework**: React (Vite)
*   **Styling**: Tailwind CSS (Custom Design System)
*   **State Management**: React Hooks
*   **HTTP Client**: Axios/Fetch

### Backend
*   **Framework**: FastAPI (Python)
*   **Database**: SQLite (Local file storage)
*   **AI Engine**: Ollama (Running `gemma3:4b`)
*   **Image Processing**: Pillow (PIL)

---

## 🧩 System Architecture

```mermaid
graph TD
    User([User]) -->|Uploads Image| UI[React Frontend]
    UI -->|POST /api/analyze| API[FastAPI Backend]
    
    subgraph Backend System
        API -->|Save Image| Storage[File System]
        API -->|Inference Request| AI[Ollama (Gemma 3)]
        AI -->|JSON Analysis| API
        API -->|Store Result| DB[(SQLite Database)]
    end
    
    API -->|Return Analysis| UI
    UI -->|Display Report| User
```

## 🔄 Data Flow

1.  **Image Upload**:
    The user selects an image of a crop leaf via the frontend interface.

2.  **API Request**:
    The frontend sends the image file to the `/api/analyze` endpoint on the backend.

3.  **Processing**:
    *   The backend saves the image locally.
    *   It constructs a prompt for the AI model asking for:
        *   Leaf Name
        *   Health Status (Healthy/Affected)
        *   Disease Name
        *   Severity Percentage
        *   Reasoning & Tips
    *   The image path and prompt are sent to the local **Ollama** instance.

4.  **AI Inference**:
    Ollama processes the image using the `gemma3:4b` vision model and returns a structured JSON response.

5.  **Storage**:
    The results (including diagnosis, confidence score, and timestamp) are saved to the `history.db` SQLite database for future reference.

6.  **Response**:
    The backend sends the structured data back to the frontend, which renders a beautiful report card for the user.

---

## 🌟 Key Features

*   **Local AI Privacy**: All analysis happens locally on your machine via Ollama; no images are sent to the cloud.
*   **History Tracking**: Previous analyses are stored and can be reviewed in the "History" tab.
*   **Responsive Design**: Works on desktops, tablets, and mobile devices.
*   **Dark Capability**: Built-in support for dark mode aesthetics.
