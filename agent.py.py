import logging
import os
from dotenv import load_dotenv

from livekit.agents import (
    AutoSubscribe,
    JobContext,
    JobProcess,
    WorkerOptions,
    cli,
    llm,
)
from livekit.agents.pipeline import VoicePipelineAgent
from livekit.plugins import gladia, openai, silero

# Load environment variables from .env file
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("translator-agent")

# Set default target language for translation
TARGET_LANGUAGE = "Spanish"


def prewarm(proc: JobProcess):
    """Pre-load Silero Voice Activity Detection into memory."""
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    """Worker process that handles incoming WebRTC audio tracks."""
    
    initial_ctx = llm.ChatContext().append(
        role="system",
        text=(
            f"You are an ultra-fast, live voice-call translator. "
            f"Translate any incoming spoken text directly into {TARGET_LANGUAGE}. "
            f"RULES:\n"
            f"1. Output ONLY the raw translation in {TARGET_LANGUAGE}.\n"
            f"2. Do NOT add commentary, explanations, or greetings."
        ),
    )

    logger.info(f"Connecting to room: {ctx.room.name}")
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    participant = await ctx.wait_for_participant()
    logger.info(f"Connected participant: {participant.identity}")

    # Build Pipeline: Gladia (STT) -> Groq (LLM) -> OpenAI/LiveKit (TTS)
    agent = VoicePipelineAgent(
        vad=ctx.proc.userdata["vad"],
        stt=gladia.STT(
            api_key=os.getenv("GLADIA_API_KEY"),
        ),
        llm=openai.LLM.with_groq(
            model="llama-3.1-8b-instant",
            api_key=os.getenv("GROQ_API_KEY"),
        ),
        tts=openai.TTS(),
        chat_ctx=initial_ctx,
    )

    # Start audio processing
    agent.start(ctx.room, participant)


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
        ),
    )
    