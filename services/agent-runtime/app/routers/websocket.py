"""WebSocket route handling SigV4-authenticated bidirectional audio streaming with Nova Sonic."""
import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.nova_sonic_client import NovaSonicClient
from app.services.nova_pro_client import NovaProClient
from app.auth.sigv4_validator import validate_sigv4
from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()
nova_sonic = NovaSonicClient()
nova_pro = NovaProClient()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    session_id = websocket.headers.get("x-session-id", "unknown")
    logger.info("WebSocket connection attempt", extra={"session_id": session_id})
    if not validate_sigv4(websocket.headers):
        await websocket.close(code=4001, reason="SigV4 validation failed")
        return
    logger.info("WebSocket authenticated", extra={"session_id": session_id})
    transcript_buffer = []
    try:
        await nova_sonic.start_stream(websocket)
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)
            if msg.get("type") == "audio":
                await nova_sonic.send_audio(msg.get("payload"))
            elif msg.get("type") == "digest_request":
                digest_text = await nova_pro.generate_digest(transcript_buffer)
                await websocket.send_json({"type": "digest", "payload": {"text": digest_text}})
            elif msg.get("type") == "transcript":
                transcript_buffer.append(msg.get("payload", {}))
                await websocket.send_json({"type": "transcript", "payload": msg["payload"]})
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected", extra={"session_id": session_id})
        await nova_sonic.stop_stream()
