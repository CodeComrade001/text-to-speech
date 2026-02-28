import dotenv from "dotenv";
dotenv.config();

import express from "express";
import router from "./routes/tts.route.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "*", // Allow all origins (for development). Adjust in production.
  methods: "POST", // Only allow POST requests
  allowedHeaders: "Content-Type", // Allow only Content-Type header,
}))

app.use(express.json());

app.use("/api", router);

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`TTS API server running on http://localhost:${PORT}`);
});

export default app;



// POST / api / tts
//      │
//      ▼
// tts.route.ts   →  validates text(exists, ≤5000 chars)
//      │
//      ▼
// tts.service.ts →  applies pitch prefix to text
//                →  calls Gemini API via Axios
//                →  decodes base64 PCM from response
//      │
//      ▼
// pcmToWav.ts    →  wraps raw PCM bytes in a proper 44 - byte WAV header
//      │
//      ▼
// tts.route.ts   →  sends WAV buffer with audio / wav headers