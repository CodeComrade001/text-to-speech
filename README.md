# 🔊 Text-to-Speech API

A minimal REST API built with **Express.js** and **TypeScript** that converts text to speech using the **Google Gemini TTS API**, returning a downloadable `.wav` file.

---

## 📋 Table of Contents

- [Requirements](#requirements)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Reference](#api-reference)
- [Allowed Voices](#allowed-voices)
- [Error Handling](#error-handling)
- [Project Structure](#project-structure)

---

## Requirements

- Node.js v18+
- npm or yarn
- A valid **Google Gemini API key**

---

## Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd <your-repo-name>

# 2. Install dependencies
npm install
```

---

## Environment Variables

Create a `.env` file in the root of the project:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
PORT=3000
```

> ⚠️ **Never commit your `.env` file.** Add it to `.gitignore`.

### Getting a Gemini API Key

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key and paste it into your `.env` file as `GEMINI_API_KEY`

---

## Running the Server

```bash
# Development (with ts-node or tsx)
npm run dev

# Build and run production
npm run build
npm start
```

Server will be available at: `http://localhost:3000`

---

## API Reference

### `POST /api/upload-text`

Converts text to speech and returns a WAV audio file.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "text": "Hello, world!",
  "voice": "puck",
  "pitch": 0
}
```

| Field   | Type     | Required | Description                                              |
|---------|----------|----------|----------------------------------------------------------|
| `text`  | `string` | ✅ Yes   | The text to convert to speech. Max 5000 characters.      |
| `voice` | `string` | ❌ No    | Voice name to use. Defaults to `Puck`. See list below.   |
| `pitch` | `number` | ❌ No    | Pitch modifier. See pitch logic below.                   |

#### Pitch Logic

| Value         | Effect                                        |
|---------------|-----------------------------------------------|
| `pitch < -2`  | Prepends `"Speak in a deep voice: "` to text  |
| `pitch > 2`   | Prepends `"Speak in a high voice: "` to text  |
| `-2` to `2`   | Normal speech, no modification                |

#### Response

On success, returns a binary `.wav` file:

```
Content-Type: audio/wav
Content-Disposition: attachment; filename=speech.wav
```

#### Example with `curl`

```bash
curl -X POST http://localhost:3000/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello from the TTS API!", "voice": "aoede", "pitch": 0}' \
  --output speech.wav
```

---

## Allowed Voices

The following voice names are supported. Voice names are **case-insensitive**.

| #  | Voice Name       |
|----|------------------|
| 1  | `Charon`         |
| 2  | `Achird`         |
| 3  | `Algenib`        |
| 4  | `Algieba`        |
| 5  | `Alnilam`        |
| 6  | `Aoede`          |
| 7  | `Autonoe`        |
| 8  | `Callirrhoe`     |
| 9  | `Charon`         |
| 10 | `Despina`        |
| 11 | `Enceladus`      |
| 12 | `Erinome`        |
| 13 | `Fenrir`         |
| 14 | `Gacrux`         |
| 15 | `Iapetus`        |
| 16 | `Kore`           |
| 17 | `Laomedeia`      |
| 18 | `Leda`           |
| 19 | `Orus`           |
| 20 | `Puck` ⭐ default |
| 21 | `Pulcherrima`    |
| 22 | `Rasalgethi`     |
| 23 | `Sadachbia`      |
| 24 | `Sadaltager`     |
| 25 | `Schedar`        |
| 26 | `Sulafat`        |
| 27 | `Umbriel`        |
| 28 | `Vindemiatrix`   |
| 29 | `Zephyr`         |
| 30 | `Zubenelgenubi`  |

> Tip: Try `Aoede`, `Zephyr`, or `Fenrir` for distinct character voices.



## Project Structure

```
├── src/
│   ├── server.ts              # Express app entry point
│   ├── routes/
│   │   └── tts.route.ts       # POST /api/tts route handler
│   ├── services/
│   │   └── tts.service.ts     # Gemini API call + pitch logic
│   ├── utils/
│   │   └── pcmToWav.ts        # PCM → WAV conversion utility
│   └── types/
│       └── tts.types.ts       # TypeScript interfaces
├── .env                       # Environment variables (do not commit)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## License

MIT — free to use, modify, and distribute.