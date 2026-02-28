"""
AI Travel Planner - Backend API
Uses Amazon Nova (via Amazon Bedrock) for intelligent travel planning
"""

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
import boto3
import json
import os
import uuid
from datetime import datetime
from decimal import Decimal
from functools import lru_cache
import urllib.request
from dotenv import load_dotenv
from jose import jwt, JWTError

load_dotenv()  # Load .env file before boto3 client is created

app = FastAPI(
    title="AI Travel Planner API",
    description="Powered by Amazon Nova via Amazon Bedrock",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Amazon Bedrock client — explicitly reads credentials from .env
bedrock_client = boto3.client(
    service_name="bedrock-runtime",
    region_name=os.getenv("AWS_DEFAULT_REGION", "us-east-1"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    aws_session_token=os.getenv("AWS_SESSION_TOKEN"),  # for temporary/SSO creds only
)

MODEL_ID = "amazon.nova-lite-v1:0"  # Cost-effective; swap to amazon.nova-pro-v1:0 for richer output


# ─── AWS Cognito JWT Verification ─────────────────────────────────────────────

COGNITO_REGION = os.getenv("COGNITO_REGION", os.getenv("AWS_DEFAULT_REGION", "us-east-1"))
COGNITO_USER_POOL_ID = os.getenv("COGNITO_USER_POOL_ID", "")
COGNITO_APP_CLIENT_ID = os.getenv("COGNITO_APP_CLIENT_ID", "")
COGNITO_ISSUER = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{COGNITO_USER_POOL_ID}"


# ─── DynamoDB for Persistent Saved Trips ──────────────────────────────────────

DYNAMODB_TABLE = os.getenv("DYNAMODB_TABLE", "roamly-trips")
dynamodb_resource = boto3.resource(
    "dynamodb",
    region_name=os.getenv("AWS_DEFAULT_REGION", "us-east-1"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    aws_session_token=os.getenv("AWS_SESSION_TOKEN"),
)


@lru_cache()
def _fetch_jwks() -> tuple:
    """Fetch and cache Cognito JWKS (JSON Web Key Set)."""
    url = f"{COGNITO_ISSUER}/.well-known/jwks.json"
    with urllib.request.urlopen(url) as resp:
        keys = json.loads(resp.read())["keys"]
    return tuple(json.dumps(k) for k in keys)   # tuple for hashability


def verify_cognito_token(token: str) -> dict:
    """Verify a Cognito JWT and return user claims."""
    try:
        jwks_raw = _fetch_jwks()
        jwks = [json.loads(k) for k in jwks_raw]
        headers = jwt.get_unverified_headers(token)
        kid = headers.get("kid")
        key = next((k for k in jwks if k["kid"] == kid), None)
        if not key:
            raise HTTPException(status_code=401, detail="Unknown signing key")
        claims = jwt.decode(
            token, key, algorithms=["RS256"],
            audience=COGNITO_APP_CLIENT_ID,
            issuer=COGNITO_ISSUER,
        )
        return claims
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {e}")


async def get_current_user(authorization: str = Header(..., alias="Authorization")):
    """FastAPI dependency — require valid Cognito JWT."""
    if not COGNITO_USER_POOL_ID:
        raise HTTPException(status_code=503, detail="Auth not configured on server")
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    return verify_cognito_token(authorization[7:])


async def get_optional_user(authorization: Optional[str] = Header(None, alias="Authorization")):
    """FastAPI dependency — return user claims or None."""
    if not COGNITO_USER_POOL_ID or not authorization or not authorization.startswith("Bearer "):
        return None
    try:
        return verify_cognito_token(authorization[7:])
    except Exception:
        return None


# ─── Request / Response Models ────────────────────────────────────────────────

class TripRequest(BaseModel):
    destination: str
    origin: str
    start_date: str          # ISO date string, e.g. "2025-06-01"
    end_date: str
    budget: str              # "budget", "moderate", "luxury"
    travelers: int = 1
    interests: List[str] = []   # e.g. ["food", "history", "adventure"]
    special_requirements: Optional[str] = None


class DayPlanRequest(BaseModel):
    destination: str
    date: str
    preferences: Optional[str] = None


class PackingRequest(BaseModel):
    destination: str
    start_date: str
    end_date: str
    activities: List[str] = []


class BudgetRequest(BaseModel):
    destination: str
    duration_days: int
    travelers: int
    budget_level: str


class ChatMessage(BaseModel):
    role: str   # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    trip_context: Optional[dict] = None


# ─── Helper: Call Amazon Nova ─────────────────────────────────────────────────

def call_nova(system_prompt: str, user_message: str, max_tokens: int = 2048) -> str:
    """Invoke Amazon Nova Lite via Bedrock and return the text response."""
    body = {
        "messages": [
            {"role": "user", "content": [{"text": user_message}]}
        ],
        "system": [{"text": system_prompt}],
        "inferenceConfig": {
            "maxTokens": max_tokens,
            "temperature": 0.7,
            "topP": 0.9,
        }
    }

    response = bedrock_client.invoke_model(
        modelId=MODEL_ID,
        body=json.dumps(body),
        contentType="application/json",
        accept="application/json"
    )

    result = json.loads(response["body"].read())
    return result["output"]["message"]["content"][0]["text"]


def call_nova_stream(system_prompt: str, user_message: str, max_tokens: int = 2048):
    """Stream response from Amazon Nova via Bedrock."""
    body = {
        "messages": [
            {"role": "user", "content": [{"text": user_message}]}
        ],
        "system": [{"text": system_prompt}],
        "inferenceConfig": {
            "maxTokens": max_tokens,
            "temperature": 0.7,
            "topP": 0.9,
        }
    }

    response = bedrock_client.invoke_model_with_response_stream(
        modelId=MODEL_ID,
        body=json.dumps(body),
        contentType="application/json",
        accept="application/json"
    )

    for event in response["body"]:
        chunk = json.loads(event["chunk"]["bytes"])
        if chunk.get("type") == "content_block_delta":
            delta = chunk.get("delta", {})
            if delta.get("type") == "text_delta":
                yield delta.get("text", "")


# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "AI Travel Planner API — Powered by Amazon Nova", "status": "running"}


@app.get("/health")
def health():
    return {"status": "healthy", "model": MODEL_ID, "timestamp": datetime.utcnow().isoformat()}


@app.post("/api/plan/full")
async def generate_full_itinerary(req: TripRequest):
    """Generate a complete multi-day travel itinerary using Amazon Nova."""
    interests_str = ", ".join(req.interests) if req.interests else "general sightseeing"
    duration = (datetime.fromisoformat(req.end_date) - datetime.fromisoformat(req.start_date)).days + 1

    system_prompt = """You are an expert AI travel planner with deep knowledge of destinations worldwide.
You create detailed, realistic, and personalized travel itineraries. 
Always respond with valid JSON matching the exact schema requested.
Be specific with place names, timings, and practical advice."""

    user_message = f"""Create a detailed {duration}-day travel itinerary for the following trip:

Destination: {req.destination}
Origin: {req.origin}
Travel Dates: {req.start_date} to {req.end_date} ({duration} days)
Number of Travelers: {req.travelers}
Budget Level: {req.budget}
Interests: {interests_str}
Special Requirements: {req.special_requirements or "None"}

Return a JSON object with this exact structure:
{{
  "trip_summary": {{
    "title": "Creative trip title",
    "destination": "{req.destination}",
    "duration": {duration},
    "best_time_to_visit": "...",
    "overall_theme": "...",
    "highlights": ["highlight1", "highlight2", "highlight3"]
  }},
  "daily_itinerary": [
    {{
      "day": 1,
      "date": "{req.start_date}",
      "title": "Day title",
      "theme": "Day theme",
      "activities": [
        {{
          "time": "9:00 AM",
          "name": "Activity name",
          "description": "Detailed description",
          "duration": "2 hours",
          "cost_estimate": "$20-30",
          "tips": "Insider tip",
          "category": "sightseeing|food|adventure|culture|shopping|relaxation"
        }}
      ],
      "meals": {{
        "breakfast": {{"name": "...", "description": "...", "price_range": "..."}},
        "lunch": {{"name": "...", "description": "...", "price_range": "..."}},
        "dinner": {{"name": "...", "description": "...", "price_range": "..."}}
      }},
      "accommodation": {{"name": "...", "type": "...", "price_range": "..."}},
      "transportation": "How to get around this day",
      "daily_budget_estimate": "$X-Y per person"
    }}
  ],
  "practical_info": {{
    "getting_there": "...",
    "local_transportation": "...",
    "currency_tips": "...",
    "safety_tips": "...",
    "local_customs": "...",
    "emergency_contacts": "..."
  }},
  "budget_breakdown": {{
    "accommodation_total": "$...",
    "food_total": "$...",
    "activities_total": "$...",
    "transportation_total": "$...",
    "grand_total_per_person": "$..."
  }}
}}

Generate all {duration} days. Make it genuinely helpful and specific to {req.destination}."""

    try:
        response_text = call_nova(system_prompt, user_message, max_tokens=4096)
        # Extract JSON from response
        start = response_text.find("{")
        end = response_text.rfind("}") + 1
        if start >= 0 and end > start:
            itinerary = json.loads(response_text[start:end])
        else:
            raise ValueError("No valid JSON in response")
        return {"success": True, "data": itinerary, "model_used": MODEL_ID}
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse AI response: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/plan/packing-list")
async def generate_packing_list(req: PackingRequest):
    """Generate a smart packing list using Amazon Nova."""
    duration = (datetime.fromisoformat(req.end_date) - datetime.fromisoformat(req.start_date)).days + 1
    activities_str = ", ".join(req.activities) if req.activities else "general travel"

    system_prompt = "You are a professional travel packing expert. Return only valid JSON."

    user_message = f"""Create a comprehensive packing list for:
Destination: {req.destination}
Duration: {duration} days ({req.start_date} to {req.end_date})
Planned Activities: {activities_str}

Return JSON:
{{
  "weather_advisory": "Expected weather and what to prepare for",
  "categories": [
    {{
      "name": "Category name",
      "icon": "emoji",
      "items": [
        {{"item": "Item name", "quantity": "X", "essential": true/false, "notes": "..."}}
      ]
    }}
  ],
  "tips": ["tip1", "tip2"],
  "carry_on_essentials": ["item1", "item2"]
}}"""

    try:
        response_text = call_nova(system_prompt, user_message, max_tokens=2048)
        start = response_text.find("{")
        end = response_text.rfind("}") + 1
        data = json.loads(response_text[start:end])
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/plan/budget")
async def estimate_budget(req: BudgetRequest):
    """Generate a detailed budget estimate using Amazon Nova."""
    system_prompt = "You are a travel budget expert. Return only valid JSON."

    user_message = f"""Create a detailed budget breakdown for:
Destination: {req.destination}
Duration: {req.duration_days} days
Travelers: {req.travelers}
Budget Level: {req.budget_level}

Return JSON:
{{
  "summary": "Brief budget overview",
  "daily_breakdown": {{
    "accommodation": {{"low": X, "average": Y, "high": Z, "notes": "..."}},
    "food": {{"low": X, "average": Y, "high": Z, "notes": "..."}},
    "transportation": {{"low": X, "average": Y, "high": Z, "notes": "..."}},
    "activities": {{"low": X, "average": Y, "high": Z, "notes": "..."}},
    "miscellaneous": {{"low": X, "average": Y, "high": Z, "notes": "..."}}
  }},
  "total_per_person": {{"low": X, "recommended": Y, "comfortable": Z}},
  "total_for_group": {{"low": X, "recommended": Y, "comfortable": Z}},
  "money_saving_tips": ["tip1", "tip2", "tip3"],
  "splurge_recommendations": ["experience1", "experience2"],
  "currency": "Local currency and exchange tips"
}}"""

    try:
        response_text = call_nova(system_prompt, user_message, max_tokens=1500)
        start = response_text.find("{")
        end = response_text.rfind("}") + 1
        data = json.loads(response_text[start:end])
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat")
async def chat_with_travel_ai(req: ChatRequest):
    """Multi-turn chat with the AI travel assistant using Amazon Nova."""
    system_prompt = """You are Nova, an expert AI travel assistant powered by Amazon Nova.
You help travelers plan amazing trips with personalized, detailed advice.
You're friendly, knowledgeable, enthusiastic about travel, and always practical.
When asked about specific places, give concrete recommendations with names, not generic advice.
Keep responses conversational but informative."""

    if req.trip_context:
        system_prompt += f"\n\nCurrent trip context: {json.dumps(req.trip_context)}"

    # Build conversation for Nova
    # Rules: first message must be "user", roles must alternate, no empty content
    raw = [m for m in req.messages if m.content and m.content.strip()]
    
    # Drop any leading assistant messages
    while raw and raw[0].role == "assistant":
        raw = raw[1:]
    
    # Ensure roles strictly alternate (user/assistant/user/...)
    nova_messages = []
    expected_role = "user"
    for msg in raw:
        if msg.role == expected_role:
            nova_messages.append({"role": msg.role, "content": [{"text": msg.content}]})
            expected_role = "assistant" if expected_role == "user" else "user"
    
    # Must have at least one user message
    if not nova_messages:
        raise HTTPException(status_code=400, detail="No user message found in conversation")

    body = {
        "messages": nova_messages,
        "system": [{"text": system_prompt}],
        "inferenceConfig": {
            "maxTokens": 1024,
            "temperature": 0.8,
            "topP": 0.9,
        }
    }

    try:
        response = bedrock_client.invoke_model(
            modelId=MODEL_ID,
            body=json.dumps(body),
            contentType="application/json",
            accept="application/json"
        )
        result = json.loads(response["body"].read())
        reply = result["output"]["message"]["content"][0]["text"]
        return {"success": True, "reply": reply, "model": MODEL_ID}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/plan/quick-tips")
async def get_quick_tips(destination: str, category: str = "general"):
    """Get quick travel tips for a destination."""
    system_prompt = "You are a travel expert. Be concise and practical. Return valid JSON only."

    user_message = f"""Give me 5 essential {category} tips for visiting {destination}.
Return JSON: {{"tips": [{{"title": "...", "description": "...", "icon": "emoji"}}]}}"""

    try:
        response_text = call_nova(system_prompt, user_message, max_tokens=800)
        start = response_text.find("{")
        end = response_text.rfind("}") + 1
        data = json.loads(response_text[start:end])
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Saved Itineraries — DynamoDB + Cognito Auth ─────────────────────────────

class SaveItineraryRequest(BaseModel):
    destination: str
    dates: str
    travelers: int = 1
    budget: str = ""
    title: str = ""
    itinerary: dict
    tripForm: dict


@app.on_event("startup")
async def startup_event():
    """Auto-create DynamoDB table for saved trips if Cognito is configured."""
    if not COGNITO_USER_POOL_ID:
        print("ℹ  COGNITO_USER_POOL_ID not set — auth endpoints disabled (local mode)")
        return
    print(f"✓ Cognito configured: pool={COGNITO_USER_POOL_ID}")
    try:
        ddb_client = boto3.client(
            "dynamodb",
            region_name=os.getenv("AWS_DEFAULT_REGION", "us-east-1"),
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            aws_session_token=os.getenv("AWS_SESSION_TOKEN"),
        )
        tables = ddb_client.list_tables()["TableNames"]
        if DYNAMODB_TABLE not in tables:
            ddb_client.create_table(
                TableName=DYNAMODB_TABLE,
                KeySchema=[
                    {"AttributeName": "userId", "KeyType": "HASH"},
                    {"AttributeName": "id", "KeyType": "RANGE"},
                ],
                AttributeDefinitions=[
                    {"AttributeName": "userId", "AttributeType": "S"},
                    {"AttributeName": "id", "AttributeType": "S"},
                ],
                BillingMode="PAY_PER_REQUEST",
            )
            print(f"✓ Created DynamoDB table: {DYNAMODB_TABLE}")
        else:
            print(f"✓ DynamoDB table exists: {DYNAMODB_TABLE}")
    except Exception as e:
        print(f"⚠  DynamoDB auto-setup: {e}")


@app.get("/api/itineraries")
async def list_saved_trips(user: dict = Depends(get_current_user)):
    """List all saved itineraries for the authenticated user."""
    from boto3.dynamodb.conditions import Key as DDBKey
    table = dynamodb_resource.Table(DYNAMODB_TABLE)
    resp = table.query(
        KeyConditionExpression=DDBKey("userId").eq(user["sub"]),
        ScanIndexForward=False,
    )
    items = []
    for item in resp.get("Items", []):
        item["itinerary"] = json.loads(item.pop("itinerary_json", "{}"))
        item["tripForm"] = json.loads(item.pop("tripForm_json", "{}"))
        # Convert Decimal → int for JSON serialization
        if isinstance(item.get("travelers"), Decimal):
            item["travelers"] = int(item["travelers"])
        items.append(item)
    return {"success": True, "data": items}


@app.post("/api/itineraries")
async def save_trip(body: SaveItineraryRequest, user: dict = Depends(get_current_user)):
    """Save an itinerary to DynamoDB for the authenticated user."""
    table = dynamodb_resource.Table(DYNAMODB_TABLE)
    trip_id = str(uuid.uuid4())
    item = {
        "userId": user["sub"],
        "id": trip_id,
        "savedAt": datetime.utcnow().isoformat(),
        "destination": body.destination,
        "dates": body.dates,
        "travelers": body.travelers,
        "budget": body.budget,
        "title": body.title,
        "itinerary_json": json.dumps(body.itinerary),
        "tripForm_json": json.dumps(body.tripForm),
    }
    table.put_item(Item=item)
    return {
        "success": True,
        "data": {
            "userId": user["sub"], "id": trip_id,
            "savedAt": item["savedAt"],
            "destination": body.destination, "dates": body.dates,
            "travelers": body.travelers, "budget": body.budget,
            "title": body.title,
            "itinerary": body.itinerary, "tripForm": body.tripForm,
        }
    }


@app.delete("/api/itineraries/{trip_id}")
async def delete_saved_trip(trip_id: str, user: dict = Depends(get_current_user)):
    """Delete a saved itinerary from DynamoDB."""
    table = dynamodb_resource.Table(DYNAMODB_TABLE)
    table.delete_item(Key={"userId": user["sub"], "id": trip_id})
    return {"success": True}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
