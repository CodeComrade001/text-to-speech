import { Router, Request, Response } from "express";
import { TTSRequestBody } from "../types/tts.types.js";
import { generateSpeech } from "../services/tts.service.js";

const router = Router();

router.post("/upload-text", async (req: Request, res: Response) => {
  const { text, voice, pitch } = req.body as TTSRequestBody;

  // Validation
  if (!text || typeof text !== "string") {
    res.status(400).json({ error: "text is required and must be a string." });
    return;
  }

  if (text.length > 5000) {
    res.status(400).json({ error: "text must not exceed 5000 characters." });
    return;
  }

  try {
    const wavBuffer = await generateSpeech({ text, voice, pitch });

    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Content-Disposition", "attachment; filename=speech.wav");
    res.setHeader("Content-Length", wavBuffer.length);
    res.status(200).send(wavBuffer);
  } catch (error: any) {
    console.error(
      "[TTS Error]",
      error?.response?.data ?? error?.message ?? error
    );
    res.status(500).json({
      error: "Failed to generate speech.",
      details: error?.response?.data ?? error?.message ?? "Unknown error",
    });
  }
});

export default router;