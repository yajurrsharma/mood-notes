from fastapi import FastAPI
from firebase_config import db
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI()

# Fix CORS issues
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Mood Notes API is Running!"}

@app.post("/add_note/")
def add_note(note: dict):
    note["timestamp"] = datetime.utcnow().isoformat()  # Add timestamp
    doc_ref = db.collection("notes").document()
    doc_ref.set(note)
    return {"message": "Note added successfully!"}

@app.get("/get_notes")
def get_notes():
    notes = db.collection("notes").order_by("timestamp", direction="DESCENDING").stream()
    notes_list = [{"id": note.id, **note.to_dict()} for note in notes]
    return {"notes": notes_list}
