import { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

const API_BASE_URL = "http://127.0.0.1:5000";

function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/get_notes`)
      .then((response) => {
        setNotes(response.data.notes);
      })
      .catch((error) => console.error("Error fetching notes:", error));
  }, []);

  const addNote = async () => {
    if (!note.trim()) return;

    const newNote = { text: note, mood: getMood(note) };

    try {
      await axios.post(`${API_BASE_URL}/add_note`, newNote);
      setNotes([newNote, ...notes]); 
      setNote("");
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

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

      <div className="input-and-columns">
        <div className="left-column">
          <h2>Your Moods</h2>
          <div className="notes-scrollable">
            {notes.map((n, index) => (
              <div key={index} className="note-box">
                <p>{n.text.length > 100 ? `${n.text.substring(0, 100)}...` : n.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="input-container">
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
        </div>

        <div className="right-column">
          <h2>Important</h2>
          <div className="notes-scrollable">
            {notes
              .filter((n) => n.text.trim().endsWith("!important"))
              .map((n, index) => (
                <div key={index} className="note-box important">
                  <p>{n.text.replace("!important", "")}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
