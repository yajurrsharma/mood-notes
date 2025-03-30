from flask import Flask, request, jsonify
from firebase_config import db
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Mood Notes API is Running!"})

@app.route("/add_note/", methods=["POST"])
def add_note():
    note = request.get_json()
    if not note:
        return jsonify({"error": "No data provided"}), 400

    note["timestamp"] = datetime.utcnow().isoformat()  # Add timestamp
    doc_ref = db.collection("notes").document()
    doc_ref.set(note)

    return jsonify({"message": "Note added successfully!"})

@app.route("/get_notes", methods=["GET"])
def get_notes():
    notes = db.collection("notes").order_by("timestamp", direction="DESCENDING").stream()
    notes_list = [{"id": note.id, **note.to_dict()} for note in notes]

    return jsonify({"notes": notes_list})

if __name__ == "__main__":
    app.run(debug=True)
