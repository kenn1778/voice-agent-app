"""Lambda handler for generating SigV4-presigned WebSocket URLs."""
import json
import os
from app.sigv4 import generate_presigned_url

def handler(event: dict, context) -> dict:
    try:
        url = generate_presigned_url(
            endpoint=os.environ["AGENT_RUNTIME_ENDPOINT"],
            region=os.environ.get("AWS_REGION", "us-east-1"),
        )
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"url": url, "expiresAt": 60, "sessionId": "session-placeholder"}),
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
        }
