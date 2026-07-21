# Architecture

## Overview
Voice Agent App connects a React Native mobile client to AWS Bedrock AgentCore for real-time bidirectional voice conversations with AI agents (Amazon Nova Sonic) and text digest generation (Amazon Nova Pro).

## Components

### Mobile Client (React Native)
- Auth via Cognito OAuth 2.0 with PKCE
- WebSocket connection to Agent Runtime via SigV4-presigned URL
- Microphone capture and audio playback via native modules
- Transcript and digest display

### Agent Runtime (FastAPI on Bedrock AgentCore)
- /ws WebSocket endpoint for bidirectional audio
- Integrates with Nova Sonic for voice and Nova Pro for text generation
- Validates SigV4 and JWT on connection

### Presign API (API Gateway + Lambda)
- POST /presign generates time-limited SigV4 WebSocket URLs
- JWT authorizer validates Cognito access token

### Auth (Cognito)
- User Pool for login (OAuth 2.0 + PKCE)
- Identity Pool for temporary AWS credentials

## Data Flow
1. User logs in via Cognito → gets tokens
2. App exchanges tokens for AWS credentials via Identity Pool
3. App calls Presign API → gets SigV4-signed WebSocket URL
4. App opens WebSocket to Agent Runtime → streams mic audio → receives agent audio
5. Agent calls Nova Sonic for voice, Nova Pro for digests
