"""SigV4 presigned URL generation for WebSocket connections."""
import boto3
from botocore.signers import RequestSigner
from botocore.awsrequest import AWSRequest

def generate_presigned_url(endpoint: str, region: str) -> str:
    session = boto3.Session()
    credentials = session.get_credentials().get_frozen_credentials()
    service = "bedrock"
    request = AWSRequest(method="GET", url=endpoint, data=b"")
    signer = RequestSigner(service, region, "wss", credentials)
    signed = signer.generate_presigned_url(request, expires_in=60)
    return signed
