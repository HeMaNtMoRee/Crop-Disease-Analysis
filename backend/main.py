from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import shutil
import os
import uuid
import json
import time
from typing import List
import ollama
from backend.database import init_db, add_entry, get_all_entries, delete_all_entries

# Initialize App & DB
app = FastAPI(title="Crop Disease Analysis API")
init_db()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants
UPLOAD_DIR = "backend/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def predict_disease(image_path):
    """
    Uses Ollama (gemma3:4b) to analyze the crop image.
    Returns:
        dict: {
            "leaf_name": str,
            "status": "Healthy" | "Affected",
            "severity": str | None,
            "reasoning": str,
            "confidence": float
        }
    """
    prompt = """
    Analyze this crop leaf image. Identify the leaf type and its health status.
    Return ONLY a JSON object with the following keys:
    - "leaf_name": Name of the plant/leaf.
    - "status": "Healthy" or "Affected".
    - "severity": If affected, estimate severity percentage (e.g. "15%"). If healthy, return null.
    - "disease_name": specific disease name if affected, else "None".
    - "reasoning": A concise markdown report covering:
        - Identification confidence explanation.
        - If affected: Cause, spread, 1 organic & 1 chemical treatment, 2 prevention tips.
        - If healthy: 2 care tips.
    - "confidence": Estimated confidence score between 0.0 and 1.0.
    """

    try:
        response = ollama.chat(
            model='gemma3:4b',
            messages=[{
                'role': 'user',
                'content': prompt,
                'images': [image_path]
            }],
            options={'temperature': 0.2, 'format': 'json'} 
        )
        
        # Parse JSON response
        content = response['message']['content']
        # Clean up code blocks if generic model adds them
        if "```json" in content:
            content = content.replace("```json", "").replace("```", "")
        
        result_json = json.loads(content)
        return result_json

    except Exception as e:
        print(f"Ollama inference error: {e}")
        return {
            "leaf_name": "Unknown",
            "status": "Error",
            "severity": None,
            "disease_name": "Error",
            "reasoning": "Could not analyze image due to AI service error.",
            "confidence": 0.0
        }


def is_healthy(status: str) -> bool:
    return status.lower() == "healthy"


@app.get("/")
def read_root():
    return {"message": "Crop Disease Analysis API is running (Ollama Edition)"}


@app.post("/api/analyze")
async def analyze_image(file: UploadFile = File(...)):
    # 1. Save Image
    file_id = str(uuid.uuid4())
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"{file_id}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 2. AI Inference
    analysis_result = predict_disease(file_path)

    # 3. Process Result
    leaf_name = analysis_result.get("leaf_name", "Unknown Plant")
    status = analysis_result.get("status", "Unknown")
    severity = analysis_result.get("severity")
    disease = analysis_result.get("disease_name", "None")
    reasoning = analysis_result.get("reasoning", "")
    confidence = analysis_result.get("confidence", 0.0)

    is_healthy_bool = is_healthy(status)
    
    # Construct readable name
    if is_healthy_bool:
        display_name = f"{leaf_name} (Healthy)"
    else:
        display_name = f"{leaf_name} - {disease}"

    # 4. Save to DB
    result_entry = {
        "id": file_id,
        "filename": filename,
        "disease_name": disease if not is_healthy_bool else "Healthy",
        "disease_readable": display_name,
        "is_healthy": is_healthy_bool,
        "confidence": confidence,
        "reasoning": reasoning,
        "severity": severity, # Note: DB needs update to store this if we want it persistent distinct from reasoning
        "timestamp": time.time() * 1000
    }
    
    # Append severity to reasoning for now if DB doesn't support it, 
    # or just rely on 'reasoning' containing it as per prompt.
    # But wait, User asked to "use these... to display it in frontend".
    # I should probably update DB schema or just embed it in reasoning for history?
    # For now, let's keep DB schema simple and put severity in reasoning text if not there.
    if severity and "Severity" not in reasoning:
        result_entry["reasoning"] = f"**Severity:** {severity}\n\n" + result_entry["reasoning"]

    add_entry(result_entry)
    
    # Return full JSON for frontend
    result_entry["raw_analysis"] = analysis_result # validation?
    return result_entry


@app.get("/api/history")
def get_history():
    return get_all_entries()


@app.delete("/api/history")
def clear_history():
    delete_all_entries()
    return {"message": "History cleared"}


# Serve static files (uploaded images)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
