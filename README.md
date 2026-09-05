# LangBridge - Real-Time Voice Call Translator

A full-stack, low-latency multilingual voice call translation monorepo powered by **LiveKit Agents**, **Deepgram (STT & TTS)**, **Groq (LLaMA 3.3 LLM)**, and **Next.js (React 19, Tailwind CSS, TypeScript)**.

---

## 🏗 Monorepo Architecture

```
Langbridge/
├── server/               # Python LiveKit Voice Agent backend
│   ├── .venv/            # Python virtual environment
│   ├── agent.py          # Real-time VoicePipelineAgent with STT, LLM, TTS & VAD
│   ├── requirements.txt  # Python agent dependencies
│   └── .env.example      # Server environment configuration
├── client/               # Next.js frontend web application
│   ├── app/              # Next.js App Router (UI + /api/token endpoint)
│   ├── package.json      # Client dependencies & scripts
│   ├── tsconfig.json     # TypeScript configuration
│   └── next.config.ts    # Next.js configuration
├── .env.example          # Root environment template
└── .gitignore            # Git ignore rules
```

---

## ⚡ Quick Start

### 1. Configure Environment Variables

Create `.env.local` inside `client/` and `.env` inside `server/` (or copy root `.env.example`):

```bash
# LiveKit Cloud Configuration
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret

# Speech-to-Text & Text-to-Speech
DEEPGRAM_API_KEY=your_deepgram_api_key

# Fast LLM Translation Inference
GROQ_API_KEY=gsk_your_groq_api_key
```

---

### 2. Start the Python Voice Agent Server

```bash
cd server
# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Download models & start worker in dev mode
python agent.py download-files
python agent.py dev
```

---

### 3. Start the Next.js Client

```bash
cd client
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Join the voice call room to start real-time voice translation.

---

## 🛠 Tech Stack

- **Voice Orchestration & WebRTC**: [LiveKit Agents](https://docs.livekit.io/agents/) & LiveKit Cloud
- **Speech-to-Text (STT)**: Deepgram Nova-2
- **Voice Activity Detection (VAD)**: Silero VAD
- **Translation Engine (LLM)**: Groq (LLaMA 3.3 70B Versatile)
- **Text-to-Speech (TTS)**: Deepgram Aura
- **Frontend Framework**: Next.js (App Router), React 19, Tailwind CSS, `@livekit/components-react`
