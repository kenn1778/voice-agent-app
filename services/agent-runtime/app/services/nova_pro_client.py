"""Client for Amazon Nova Pro digest generation via Bedrock Runtime.

Corresponds to the Nova Pro — Digest Generation block in the architecture diagram (Section 3).
Invoked on demand during or after a voice session to produce a structured summary."""
import json
import logging
import boto3
from app.core.config import settings

logger = logging.getLogger(__name__)

class NovaProClient:
    def __init__(self):
        self.bedrock_runtime = boto3.client("bedrock-runtime", region_name=settings.aws_region)

    async def generate_digest(self, transcript: list) -> str:
        logger.info("Generating digest from %d transcript entries", len(transcript))
        if not transcript:
            return "No conversation to summarize."
        conversation_text = "\n".join(
            f"{'User' if e.get('speaker') == 'user' else 'Agent'}: {e.get('text', '')}"
            for e in transcript
        )
        prompt = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1024,
            "messages": [{
                "role": "user",
                "content": f"Summarize this conversation concisely:\n\n{conversation_text}",
            }],
        }
        try:
            response = self.bedrock_runtime.invoke_model(
                modelId=settings.nova_pro_model_id,
                contentType="application/json",
                body=json.dumps(prompt),
            )
            result = json.loads(response["body"].read())
            return result.get("content", [{}])[0].get("text", "Summary generation failed.")
        except Exception as e:
            logger.error("Nova Pro digest generation failed", extra={"error": str(e)})
            return "Unable to generate summary at this time."
