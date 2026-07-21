# Security

## Authentication
- OAuth 2.0 Authorization Code with PKCE (never Implicit Grant)
- Tokens stored in OS Keychain/Keystore only
- Biometric re-auth as optional app-lock layer

## Transport
- TLS everywhere (HTTPS, WSS)
- No cleartext connections

## Credentials
- No long-lived AWS credentials on device
- All credentials short-lived via Cognito Identity Pool
- Backend secrets in AWS Secrets Manager

## API Protection
- JWT authorizer on API Gateway
- SigV4 signature validation on WebSocket connections
- Rate limiting via API Gateway usage plans

## IAM
- Least-privilege roles per Lambda/container
- No wildcard resource ARNs in production
- Distinct roles for auth, presign, and agent-runtime

## Data Privacy
- Encryption at rest (S3/DynamoDB default encryption with KMS)
- Transcript/audio retention policy enforced
