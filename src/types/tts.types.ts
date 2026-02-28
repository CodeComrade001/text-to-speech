export interface TTSRequestBody {
  text: string;
  voice?: VoiceOptionType;
  pitch?: number;
}

export interface GeminiAudioResponse {
  candidates: {
    content: {
      parts: {
        inlineData: {
          mimeType: string;
          data: string; // base64 encoded PCM
        };
      }[];
    };
  }[];
}

export const VoiceOption = [
  "achernar", "achird", "algenib", "algieba", "alnilam",
  "aoede", "autonoe", "callirrhoe", "charon", "despina",
  "enceladus", "erinome", "fenrir", "gacrux", "iapetus",
  "kore", "laomedeia", "leda", "orus", "puck",
  "pulcherrima", "rasalgethi", "sadachbia", "sadaltager",
  "schedar", "sulafat", "umbriel", "vindemiatrix", "zephyr",
  "zubenelgenubi"
] as const;

export type VoiceOptionType = typeof VoiceOption[number];