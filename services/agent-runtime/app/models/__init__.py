from pydantic import BaseModel
from typing import Optional

class AudioPayload(BaseModel):
    audio: str

class TranscriptPayload(BaseModel):
    id: str
    speaker: str
    text: str
    isFinal: bool = False
    timestamp: Optional[str] = None

class DigestPayload(BaseModel):
    text: str
    sessionId: str

class WSMessage(BaseModel):
    type: str
    payload: Optional[dict] = None
    sessionId: Optional[str] = None
    timestamp: Optional[str] = None

class ErrorPayload(BaseModel):
    message: str
    code: Optional[str] = None
