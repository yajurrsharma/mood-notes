import { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

const API_BASE_URL = "http://127.0.0.1:5000";

const MOOD_COLORS = {
  Angry: "#ef476f",
  Happy: "#8F87F1",
  Sad: "#118ab2",
  Neutral: "#06d6a0"
};

function App() {
  const [note, setNote] = useState("");
  const [regularNotes, setRegularNotes] = useState([]);
  const [importantNotes, setImportantNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    axios.get(`${API_BASE_URL}/get_notes`)
      .then((response) => {
        const regular = response.data.notes.filter(n => !n.text.trim().endsWith("!important"));
        const important = response.data.notes.filter(n => n.text.trim().endsWith("!important"));
        setRegularNotes(regular);
        setImportantNotes(important);
      })
      .catch((error) => console.error("Error fetching notes:", error));
  };

  const analyzeMood = async (text) => {
    try {
      const response = await puter.ai.chat(`"${text}"`);
      return response.trim();
    } catch (error) {
      console.error("Error analyzing mood:", error);
      return "Analysis failed. Try again.";
    }
  };

  const addNote = async () => {
    if (!note.trim()) return;
  
    try {
      console.log("Sending note for mood analysis..");
      const response = await puter.ai.chat(
        `Determine the mood of this note and return only one word (Angry, Happy, Sad, Neutral): "${note}"`
      );
      
      console.log("AI Response:", response);
  
      const mood = response?.message?.content?.trim() || "Neutral";
      
      console.log("Detected mood:", mood);
      
      const newNote = { text: note, mood };
      
      await axios.post(`${API_BASE_URL}/add_note`, newNote);
      fetchNotes();
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
    return "Neutral";
  };

  const darkenColor = (color, amount = 30) => {
    return color.replace(/\d+/g, num => Math.max(0, parseInt(num) - amount));
  };

  const handleAnalyze = async () => {
    if (!selectedNote) return;
  
    setIsAnalyzing(true);
    setAnalysis("Analyzing...");
  
    try {
      console.log("Sending request to AI...");
  
      const response = await puter.ai.chat(
        `"${selectedNote.text}"`
      );
  
      console.log("AI Response:", response);

      const analysisText = response?.message?.content || "No meaningful response from AI.";
  
      setAnalysis(analysisText.trim());
    } catch (error) {
      console.error("Error analyzing note:", error);
      setAnalysis("Failed to analyze. Check console for errors.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  

  if (selectedNote) {
    const displayText = selectedNote.text.endsWith("!important") 
      ? selectedNote.text.replace("!important", "")
      : selectedNote.text;
  
    return (
      <div className="app-container">
        <h1>Mood Notes</h1>
        
        <div className="note-detail-content">
          <div 
            className="note-display-box"
            style={{ 
              backgroundColor: MOOD_COLORS[selectedNote.mood],
              border: `3px solid ${darkenColor(MOOD_COLORS[selectedNote.mood], 40)}`
            }}
          >
            <p className="note-text">{displayText}</p>
          </div>
  
          <div className="button-center">
            <button 
              className="btn analyze-btn" 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              <p className="btn-text">
                {isAnalyzing ? "Analyzing..." : "Analyze and Explain"}
              </p>
            </button>
          </div>
  
          <div className="analysis-container">
            <h3>Analysis Results</h3>
            <div className="analysis-box">
              {analysis || "Click the button to analyze this note"}
            </div>
          </div>
  
          <button className="back-btn" onClick={() => {
            setSelectedNote(null);
            setAnalysis("");
            setIsAnalyzing(false);
          }}>
            ← Back to All Notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1>Mood Notes</h1>

      <div className="input-and-columns">
        <div className="left-column">
          <h2>Your Moods</h2>
          <div className="notes-scrollable">
            {regularNotes.map((n, index) => (
              <div 
                key={index} 
                className="note-box"
                style={{ 
                  backgroundColor: MOOD_COLORS[n.mood],
                  border: `2px solid ${darkenColor(MOOD_COLORS[n.mood])}`,
                }}
                onClick={() => setSelectedNote(n)}
              >
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
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && addNote()}
            ></textarea>
            <button className="btn" onClick={addNote}>
              <p className="btn-text">Add Note</p>
            </button>
          </div>
        </div>

        <div className="right-column">
          <h2>Important</h2>
          <div className="notes-scrollable">
            {importantNotes.map((n, index) => (
              <div 
                key={index} 
                className="note-box important"
                style={{ 
                  backgroundColor: MOOD_COLORS[n.mood],
                  border: `3px solid ${darkenColor(MOOD_COLORS[n.mood], 40)}`,
                }}
                onClick={() => setSelectedNote(n)}
              >
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
