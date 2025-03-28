import { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

const API_BASE_URL = "http://127.0.0.1:8000"; // Your FastAPI backend

function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  // Fetch notes from Firebase when the app loads
  useEffect(() => {
    axios.get(`${API_BASE_URL}/get_notes`)
      .then((response) => {
        console.log("Fetched notes:", response.data.notes);
        setNotes(response.data.notes);
      })
      .catch((error) => console.error("Error fetching notes:", error));
  }, []);

  // Function to add note
  const addNote = async () => {
    if (!note.trim()) return;

    const newNote = { text: note, mood: getMood(note) };

    try {
      console.log("Sending note:", newNote);
      const response = await axios.post(`${API_BASE_URL}/add_note/`, newNote);
      console.log("Response from server:", response.data);

      if (response.data.message === "Note added successfully!") {
        setNotes([newNote, ...notes]); // Update UI immediately
        setNote(""); // Clear input field
      }
    } catch (error) {
      console.error("Error adding note:", error.response ? error.response.data : error);
    }
  };

  // Function to determine mood
  const getMood = (text) => {
    text = text.toLowerCase();
    if (text.includes("not happy") || text.includes("unhappy")) return "Sad"; 
    if (text.includes("angry") || text.includes("frustrated")) return "Angry";
    if (text.includes("happy") || text.includes("excited")) return "Happy";
    if (text.includes("sad") || text.includes("lonely")) return "Sad";
    return "Calm";
  };

  return (
    <div className="app-container">
      <h1>Mood Notes</h1>

      <div className="note-input">
        <textarea
          placeholder="Write your note here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>
        <button className="btn" onClick={addNote}>
          <p className="btn-text">Add Note</p>
        </button>
      </div>

      <div className="notes-grid">
        {["Angry", "Happy", "Sad", "Calm"].map((mood) => (
          <div key={mood} className={`notes-column ${mood.toLowerCase()}`}>
            <h2>{mood}</h2>
            {notes
              .filter((n) => n.mood === mood)
              .map((n, index) => (
                <div key={index} className="note-item">
                  <p>{n.text}</p>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
