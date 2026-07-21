# Runbook

## Local Development

### Mobile App
```bash
cd apps/mobile
npm install
npx react-native run-ios
```

### Agent Runtime
```bash
cd services/agent-runtime
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Deployment
1. Deploy CDK stacks: `cd infra && npx cdk deploy --all`
2. Build and push Docker image to ECR
3. Trigger GitHub Actions deploy workflow

## Monitoring
- CloudWatch dashboards for connection counts, error rates, latency
- Alarms on error rate > 5% or latency > 5s
- X-Ray tracing for end-to-end request tracing

## Troubleshooting
- Check CloudWatch logs for agent-runtime service
- Verify Cognito User Pool and Identity Pool are in same region
- Confirm IAM roles have bedrock:InvokeModelWithBidirectionalStream permissions
