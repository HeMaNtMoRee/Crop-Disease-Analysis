# 📊 System UML Diagrams (PlantUML)

This document contains **PlantUML** code for the project's architecture. You can render these diagrams using any PlantUML viewer or online editor (like [PlantText](https://www.planttext.com/)).

## 1. Sequence Diagram: Image Analysis Flow
This diagram shows the step-by-step process from uploading an image to receiving the disease analysis.

```plantuml
@startuml
skinparam style strictuml
actor User
participant "Frontend (React)" as UI
participant "Backend API (FastAPI)" as API
participant "File System" as FS
participant "Ollama (Gemma 3)" as AI
database "SQLite DB" as DB

User -> UI: Uploads Crop Image
activate UI

UI -> API: POST /api/analyze (image)
activate API

API -> FS: Save Image (uuid.jpg)
activate FS
FS --> API: File Path
deactivate FS

API -> API: Construct Prompt\n(Identify disease, severity, cure)

API -> AI: Chat Request (Image + Prompt)
activate AI
note right of AI: Processing with\ngemma3:4b model
AI --> API: JSON Response
deactivate AI

API -> DB: Store Analysis Result
activate DB
DB --> API: Success
deactivate DB

API --> UI: Return JSON (Analysis + Confidence)
deactivate API

UI -> User: Display Disease Report
deactivate UI
@enduml
```

---

## 2. Component Diagram: System Architecture
This diagram illustrates the high-level components and their relationships.

```plantuml
@startuml
skinparam componentStyle uml2

package "Client Side" {
    [React Frontend] as UI
    [Vite Server] as Vite
}

package "Server Side" {
    [FastAPI Backend] as API
    [Uvicorn Server] as Server
    
    component "Storage Integration" {
        [File System] as FS
        database "SQLite (history.db)" as DB
    }
}

package "AI Infrastructure" {
    [Ollama Service] as Ollama
    component "Gemma 3:4b" as Model
}

UI <..> Server : HTTP/JSON\n(Port 8000)
Server - [API]

[API] --> [Ollama] : Inference Request
[Ollama] - [Model]

[API] --> [FS] : Save Uploads
[API] --> [DB] : Log History
@enduml
```

## 3. Class Diagram: Backend Data Models
A simplified view of the data structure used in the backend.

```plantuml
@startuml
class AnalysisRequest {
    + file: UploadFile
}

class AnalysisResult {
    + id: UUID
    + filename: String
    + leaf_name: String
    + status: Healthy | Affected
    + disease_name: String
    + severity: String
    + confidence: Float
    + reasoning: String
    + timestamp: DateTime
}

class Database {
    + init_db()
    + add_entry(entry: Dict)
    + get_all_entries(): List
}

class AI_Engine {
    + predict_disease(image_path): Dict
}

AnalysisRequest --> AI_Engine : triggers
AI_Engine --> AnalysisResult : generates
AnalysisResult --> Database : stored_in
@enduml
```
