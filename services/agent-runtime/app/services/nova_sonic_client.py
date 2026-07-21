"""Client for Amazon Nova Sonic bidirectional audio streaming via Bedrock Runtime.

Corresponds to the Nova Sonic block in the architecture diagram (Section 3).
Manages the bidirectional streaming API: receives chunks from the WebSocket client,
sends them to Bedrock Runtime, and streams response audio back to the client."""
import json
import logging
import asyncio
from typing import Optional
import boto3
from botocore import config
from app.core.config import settings

logger = logging.getLogger(__name__)

class NovaSonicClient:
    def __init__(self):
        self.bedrock_runtime = boto3.client(
            "bedrock-runtime",
            region_name=settings.aws_region,
            config=config.Config(read_timeout=300, retries={"max_attempts": 3, "mode": "adaptive"}),
        )
        self._stream: Optional[dict] = None
        self._audio_queue: asyncio.Queue = asyncio.Queue()

    async def start_stream(self, websocket) -> None:
        logger.info("Starting Nova Sonic bidirectional stream")
        self._stream = {"session_id": getattr(websocket, "session_id", "unknown")}
        asyncio.create_task(self._process_audio_queue(websocket))

    async def send_audio(self, payload: dict) -> None:
        if payload and "audio" in payload:
            await self._audio_queue.put(payload["audio"])

    async def _process_audio_queue(self, websocket) -> None:
        while True:
            try:
                audio_chunk = await asyncio.wait_for(self._audio_queue.get(), timeout=settings.session_timeout_seconds)
                response = self.bedrock_runtime.invoke_model_with_response_stream(
                    modelId=settings.nova_sonic_model_id,
                    body=json.dumps({"audio": audio_chunk}),
                )
                for event in response.get("body", []):
                    if "audio" in event:
                        await websocket.send_json({"type": "audio", "payload": event["audio"]})
            except asyncio.TimeoutError:
                logger.info("Audio queue timeout, ending stream")
                break
            except Exception as e:
                logger.error("Error processing audio chunk", extra={"error": str(e)})
                await websocket.send_json({"type": "error", "payload": {"message": "Audio processing error"}})

    async def stop_stream(self) -> None:
        logger.info("Stopping Nova Sonic stream")
        self._stream = None
