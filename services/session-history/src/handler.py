import json
import os
import uuid
from datetime import datetime, timezone

import boto3
from boto3.dynamodb.conditions import Key

TABLE_NAME = os.environ["SESSION_TABLE_NAME"]
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)


def handler(event: dict, context) -> dict:
    route_key = event.get("routeKey", "")
    claims = event.get("requestContext", {}).get("authorizer", {}).get("jwt", {}).get("claims", {})
    user_id = claims.get("sub", "unknown")

    if route_key == "GET /sessions":
        return list_sessions(user_id)
    elif route_key == "GET /sessions/{sessionId}":
        session_id = event.get("pathParameters", {}).get("sessionId", "")
        return get_session(user_id, session_id)
    elif route_key == "POST /sessions":
        return create_session(user_id, event)
    elif route_key == "PUT /sessions/{sessionId}":
        session_id = event.get("pathParameters", {}).get("sessionId", "")
        return update_session(user_id, session_id, event)
    elif route_key == "DELETE /sessions/{sessionId}":
        session_id = event.get("pathParameters", {}).get("sessionId", "")
        return delete_session(user_id, session_id)
    else:
        return respond(400, {"error": f"Unknown route: {route_key}"})


def list_sessions(user_id: str) -> dict:
    resp = table.query(
        KeyConditionExpression=Key("userId").eq(user_id),
        IndexName="UserIdCreatedAtIndex",
        ScanIndexForward=False,
        Limit=50,
    )
    return respond(200, {"sessions": resp.get("Items", [])})


def get_session(user_id: str, session_id: str) -> dict:
    resp = table.get_item(Key={"userId": user_id, "sessionId": session_id})
    item = resp.get("Item")
    if not item:
        return respond(404, {"error": "Session not found"})
    return respond(200, item)


def create_session(user_id: str, event: dict) -> dict:
    body = json.loads(event.get("body", "{}"))
    session_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    item = {
        "userId": user_id,
        "sessionId": session_id,
        "createdAt": now,
        "updatedAt": now,
        "status": "active",
        "digest": body.get("digest", ""),
        "transcript": body.get("transcript", []),
    }
    table.put_item(Item=item)
    return respond(201, item)


def update_session(user_id: str, session_id: str, event: dict) -> dict:
    body = json.loads(event.get("body", "{}"))
    now = datetime.now(timezone.utc).isoformat()
    update_expr = "SET updatedAt = :updatedAt"
    expr_attrs = {":updatedAt": now}

    if "status" in body:
        update_expr += ", #st = :status"
        expr_attrs[":status"] = body["status"]
    if "digest" in body:
        update_expr += ", digest = :digest"
        expr_attrs[":digest"] = body["digest"]
    if "transcript" in body:
        update_expr += ", transcript = :transcript"
        expr_attrs[":transcript"] = body["transcript"]

    table.update_item(
        Key={"userId": user_id, "sessionId": session_id},
        UpdateExpression=update_expr,
        ExpressionAttributeNames={"#st": "status"},
        ExpressionAttributeValues=expr_attrs,
    )
    return respond(200, {"sessionId": session_id, "updatedAt": now})


def delete_session(user_id: str, session_id: str) -> dict:
    table.delete_item(Key={"userId": user_id, "sessionId": session_id})
    return respond(204, {})


def respond(status: int, body: dict) -> dict:
    return {
        "statusCode": status,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body),
    }
