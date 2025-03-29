import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios"; // Import axios for API requests

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(cors());

const HF_API_KEY = process.env.HF_API_KEY; // Load Hugging Face API key from .env

// API route for analyzing mood
app.post("/analyze-mood", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: "Text input is required" });
        }

        // Send request to Hugging Face API
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment",
            { inputs: text },
            { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
        );

        // Extract mood (Positive, Negative, Neutral)
        const mood = response.data[0][0].label;
        res.json({ mood });
    } catch (error) {
        console.error("Hugging Face API Error:", error);
        res.status(500).json({ error: "Failed to analyze mood" });
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
