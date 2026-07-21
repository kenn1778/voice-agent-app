"""Tests for the Agent Runtime WebSocket handler and auth validator."""
import pytest
from app.auth.sigv4_validator import validate_sigv4
from app.services.nova_pro_client import NovaProClient

def test_validate_sigv4_missing_auth():
    assert validate_sigv4({}) is False

def test_validate_sigv4_invalid_token():
    headers = {"authorization": "Bearer invalid", "x-session-id": "test"}
    assert validate_sigv4(headers) is False

@pytest.mark.asyncio
async def test_nova_pro_empty_transcript():
    client = NovaProClient()
    result = await client.generate_digest([])
    assert result == "No conversation to summarize."
