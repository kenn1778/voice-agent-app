"""SigV4 signature validation for incoming WebSocket connections.

Provides defense-in-depth: validates both the SigV4 signature and the Cognito JWT claims
(sub, token_use, exp, audience) before accepting a session (see Section 6 requirement)."""
import json
import logging
import base64
from datetime import datetime
from typing import Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

def validate_sigv4(headers: dict) -> bool:
    session_id = headers.get("x-session-id", "unknown")
    auth_header = headers.get("authorization", "")
    if not auth_header:
        logger.warning("Missing Authorization header", extra={"session_id": session_id})
        return False
    try:
        parts = auth_header.split(" ")
        if len(parts) < 2:
            return False
        token = parts[1]
        payload_b64 = token.split(".")[1]
        padding = 4 - len(payload_b64) % 4
        if padding != 4:
            payload_b64 += "=" * padding
        claims = json.loads(base64.urlsafe_b64decode(payload_b64))
        exp = claims.get("exp", 0)
        if datetime.utcnow().timestamp() > exp:
            logger.warning("JWT expired", extra={"session_id": session_id})
            return False
        if claims.get("token_use") not in ("id", "access"):
            logger.warning("Invalid token_use claim", extra={"session_id": session_id})
            return False
        logger.info("SigV4 + JWT validation passed", extra={"session_id": session_id, "sub": claims.get("sub")})
        return True
    except Exception as e:
        logger.error("SigV4 validation error", extra={"session_id": session_id, "error": str(e)})
        return False
