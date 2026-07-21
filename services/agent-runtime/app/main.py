"""FastAPI application entrypoint for Bedrock AgentCore runtime.
Handles WebSocket connections for bidirectional audio streaming with Nova Sonic
and REST endpoints for health checks and digest retrieval."""
import uvicorn
from fastapi import FastAPI
from app.routers import websocket, health
from app.core.config import settings
from app.core.logging import setup_logging

app = FastAPI(
    title="Voice Agent Runtime",
    version="1.0.0",
    description="FastAPI service for AI voice agent on Bedrock AgentCore",
)

app.include_router(health.router)
app.include_router(websocket.router)

@app.on_event("startup")
async def startup():
    setup_logging()

@app.on_event("shutdown")
async def shutdown():
    pass

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=settings.debug)
