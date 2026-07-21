"""Tests for the Presign API Lambda handler."""
import json
from src.handler import handler

def test_handler_missing_env():
    result = handler({}, None)
    assert result["statusCode"] == 500

def test_handler_success(monkeypatch):
    monkeypatch.setenv("AGENT_RUNTIME_ENDPOINT", "wss://example.com/ws")
    result = handler({}, None)
    assert result["statusCode"] == 200
    body = json.loads(result["body"])
    assert "url" in body
    assert "sessionId" in body
