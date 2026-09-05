import logging
import os
from pathlib import Path
from dotenv import load_dotenv

# Force loading .env from the exact directory of agent.py
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    WorkerOptions,
    cli,
)
from livekit.plugins import gladia, groq, silero

load_dotenv(dotenv_path=".env")
logger = logging.getLogger("voice-translator")

async def entrypoint(ctx: JobContext):
    """Entry point for each LiveKit room session."""
    logger.info(f"Connecting to room: {ctx.room.name}")
    await ctx.connect()

    # Participant setup
    participant = await ctx.wait_for_participant()
    logger.info(f"Connected participant: {participant.identity}")

    # Initialize translation session using LiveKit v1.x AgentSession
    session = AgentSession(
        stt=gladia.STT(),
        llm=groq.LLM(model="llama-3.3-70b-versatile"),
        vad=silero.VAD.load(),
        tts=silero.TTS(),
    )

    instructions = (
        "You are a real-time multilingual voice call translator. "
        "Your objective is to translate spoken dialogue naturally, accurately, and concisely. "
        "When a participant speaks, translate their message into the desired target language. "
        "Keep translations clear, conversational, and faithful to original tone and nuance."
    )

    # Start the agent pipeline session in the room
    await session.start(
        room=ctx.room,
        agent=Agent(instructions=instructions),
    )

    # Greet participant to confirm active voice channel
    await session.say("Hello! I am your real-time voice call translator. Please start speaking whenever you are ready.")

if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
        )
    )