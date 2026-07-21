# Voice Agent App

Monorepo for an AI voice agent mobile app with real-time bidirectional voice conversations using Amazon Nova Sonic and text digest generation using Amazon Nova Pro.

## Structure

```
voice-agent-app/
├── apps/mobile/          # React Native iOS/Android app
├── services/
│   ├── agent-runtime/    # FastAPI container on Bedrock AgentCore
│   └── presign-api/      # Lambda for SigV4 presigned URLs
├── infra/                # AWS CDK infrastructure as code
├── packages/
│   └── shared-types/     # Shared TypeScript type definitions
├── .github/workflows/    # CI/CD pipelines
└── docs/                 # Architecture, Security, Runbook
```

## Quick Start

### Mobile
```bash
cd apps/mobile
npm install
npx react-native run-ios
```

### Backend
```bash
cd services/agent-runtime
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Deploy Infrastructure
```bash
cd infra
npm install
npx cdk deploy --all
```

## Environment Variables
Copy `.env.example` to `.env` in each service and fill in your AWS Cognito credentials.
