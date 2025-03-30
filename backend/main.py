from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

NOTES_FILE = "notes.json"

def load_notes():
    if os.path.exists(NOTES_FILE):
        with open(NOTES_FILE, "r") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []

def save_notes(notes):
    with open(NOTES_FILE, "w") as f:
        json.dump(notes, f, indent=4)

@app.route("/get_notes", methods=["GET"])
def get_notes():
    notes = load_notes()
    return jsonify({"notes": notes})

@app.route("/add_note", methods=["POST"])
def add_note():
    data = request.get_json()
    if not data or "text" not in data or "mood" not in data:
        return jsonify({"error": "Invalid data"}), 400

    notes = load_notes()
    notes.append(data)
    save_notes(notes)

    return jsonify({"message": "Note added successfully!"}), 201

if __name__ == "__main__":
    app.run(debug=True)
