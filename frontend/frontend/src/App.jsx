import { useState, useEffect } from "react";
import "./styles.css";

function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  // Fetch notes from API on page load
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/get_notes/");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setNotes(data.notes); // Load notes into state
        console.log("Fetched Notes:", data.notes);
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };

    fetchNotes();
  }, []);

  const addNote = async () => {
    if (!note) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/add_note/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: note }),
      });

      if (!res.ok) throw new Error("Failed to add note");

      setNote(""); // Clear input
      setNotes([...notes, { text: note }]); // Update UI without refresh
    } catch (err) {
      console.error("Error adding note:", err);
    }
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

      <div className="notes-list">
        <h2>Your Notes</h2>
        {notes.length === 0 ? (
          <p className="no-note">No notes yet.</p>
        ) : (
          notes.map((n, index) => (
            <div key={index} className="note-item">
              <p>{n.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
