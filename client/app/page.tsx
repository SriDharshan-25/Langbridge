"use client";

import { useState, useCallback } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VoiceAssistantControlBar,
  BarVisualizer,
  useVoiceAssistant,
} from "@livekit/components-react";
import { Mic, MicOff, PhoneCall, PhoneOff, Languages, Sparkles, Volume2 } from "lucide-react";

export default function Home() {
  const [token, setToken] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("translator-session");
  const [sourceLang, setSourceLang] = useState<string>("English");
  const [targetLang, setTargetLang] = useState<string>("Spanish");
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const connectToRoom = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const resp = await fetch(
        `/api/token?room=${encodeURIComponent(roomName)}&identity=user-${Math.floor(
          Math.random() * 10000
        )}`
      );
      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.error || "Failed to fetch LiveKit token");
      }
      const data = await resp.json();

      if (!data.token || !data.wsUrl) {
        throw new Error("Invalid response payload from token API endpoint");
      }

      setToken(data.token);
      setUrl(data.wsUrl);
      setIsConnected(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsConnecting(false);
    }
  }, [roomName]);

  const disconnectFromRoom = useCallback(() => {
    setIsConnected(false);
    setToken("");
    setUrl("");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col items-center justify-between p-6 sm:p-10">
      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between py-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold text-lg tracking-tight flex items-center gap-2">
              LangBridge <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">AI Translator</span>
            </h1>
            <p className="text-xs text-slate-400">Real-Time Low-Latency Voice Call Translator</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
            isConnected ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800 text-slate-400 border border-slate-700"
          }`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`}></span>
            {isConnected ? "Call Active" : "Disconnected"}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center my-8">
        {!isConnected || !token || !url ? (
          <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-slate-100">Start Voice Translation</h2>
              <p className="text-xs text-slate-400">
                Join a session with the AI Agent for bidirectional instant speech-to-speech translation.
              </p>
            </div>

            {error && (
              <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Room Name</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="e.g. translator-session"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Source Language</label>
                  <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Target Language</label>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="Spanish">Spanish</option>
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>
              </div>

              <button
                onClick={connectToRoom}
                disabled={isConnecting || !roomName.trim()}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/25"
              >
                {isConnecting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Connecting...
                  </span>
                ) : (
                  <>
                    <PhoneCall className="w-4 h-4" />
                    Join Call Session
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <LiveKitRoom
            token={token}
            serverUrl={url}
            connect={true}
            audio={true}
            video={false}
            onDisconnected={disconnectFromRoom}
            onError={(err) => {
              setError(err.message);
              disconnectFromRoom();
            }}
            className="w-full max-w-xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center space-y-6"
          >
            <RoomAudioRenderer />
            <VoiceAgentActiveView onDisconnect={disconnectFromRoom} roomName={roomName} />
          </LiveKitRoom>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center text-xs text-slate-500 py-4 border-t border-slate-800/80">
        LiveKit Agents Pipeline • Deepgram STT/TTS • Groq LLM (LLaMA 3.3)
      </footer>
    </div>
  );
}

function VoiceAgentActiveView({
  onDisconnect,
  roomName,
}: {
  onDisconnect: () => void;
  roomName: string;
}) {
  const voiceAssistant = useVoiceAssistant();

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      <div className="flex items-center justify-between w-full border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="font-semibold text-slate-200">Room: {roomName}</h3>
          <p className="text-xs text-slate-400 capitalize">Agent Status: {voiceAssistant.state || "idle"}</p>
        </div>
        <button
          onClick={onDisconnect}
          className="flex items-center gap-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
        >
          <PhoneOff className="w-4 h-4" />
          End Call
        </button>
      </div>

      <div className="w-full flex flex-col items-center justify-center py-10 space-y-4">
        <div className="w-24 h-24 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center relative">
          <Sparkles className="w-10 h-10 text-indigo-400 animate-pulse" />
          {voiceAssistant.state === "speaking" && (
            <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-25"></div>
          )}
        </div>

        <div className="h-12 flex items-center justify-center w-full max-w-xs">
          {voiceAssistant.audioTrack ? (
            <BarVisualizer
              state={voiceAssistant.state}
              barCount={15}
              trackRef={voiceAssistant.audioTrack}
              className="h-10 w-full"
            />
          ) : (
            <p className="text-xs text-slate-500">Connecting audio track...</p>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-slate-300">
            {voiceAssistant.state === "listening"
              ? "Listening to voice input..."
              : voiceAssistant.state === "thinking"
              ? "Translating..."
              : voiceAssistant.state === "speaking"
              ? "Speaking translation..."
              : "Voice Translator Ready"}
          </p>
          <p className="text-xs text-slate-500 mt-1">Speak clearly into your microphone</p>
        </div>
      </div>

      <div className="w-full flex justify-center pt-2">
        <VoiceAssistantControlBar />
      </div>
    </div>
  );
}