import axios from "axios";
import { GeminiAudioResponse, TTSRequestBody } from "../types/tts.types.js";
import { pcmToWav } from "../utils/pcmToWav.js";

const GEMINI_TTS_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent";

export async function generateSpeech(body: TTSRequestBody): Promise<Buffer> {

  const { text, voice = "Puck", pitch } = body;

  // Apply pitch prefix
  let processedText = "";
  if (pitch !== undefined) {
    if (pitch <= -3) {
      processedText = `Speak in a very deep voice. ${text}`;
    } else if (pitch <= -1) {
      processedText = `Speak in a deep voice. ${text}`;
    } else if (pitch >= 3) {
      processedText = `Speak in a very high-pitched voice. ${text}`;
    } else if (pitch >= 1) {
      processedText = `Speak in a high-pitched voice. ${text}`;
    }
  }
  if (!processedText) processedText = text;

  const apiKey = process.env.GEMINI_API_KEY;

  // const payload = {
  //   contents: [
  //     {
  //       role: "user",
  //       parts: [{ text }], // ONLY raw text
  //     },
  //   ],
  //   generationConfig: {
  //     responseModalities: ["AUDIO"],
  //     speechConfig: {
  //       voiceConfig: {
  //         prebuiltVoiceConfig: {
  //           voiceName: voice.toLowerCase(),
  //         },
  //       },
  //     },
  //   },
  // };

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text }],
      },
    ],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: voice.toLowerCase(),
          },
        },
      },
    },
    systemInstruction: {
      parts: [
        {
          text: "Convert the provided text into speech. Do not generate text. Only return audio.",
        },
      ],
    },
  };
  try {



    const response = await axios.post<GeminiAudioResponse>(
      `${GEMINI_TTS_URL}?key=${apiKey}`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("Turbo Log  ~ generateSpeech ~ response:", response);

    const base64Audio =
      response.data.candidates[0].content.parts[0].inlineData.data;

    const pcmBuffer = Buffer.from(base64Audio, "base64");
    const wavBuffer = pcmToWav(new Uint8Array(pcmBuffer));

    return wavBuffer;
  } catch (error: any) {
    console.error("[TTS Error]", error.response?.data || error.message);
    throw error;
  }
}