from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import os
from app.models.orm import User, Organization, Job, Candidate, Interview, Invitation

async def init_db():
    db_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    db_name = os.getenv("MONGODB_DB_NAME", "ai_interviewer")
    
    client = AsyncIOMotorClient(db_url)
    
    await init_beanie(
        database=client[db_name],
        document_models=[
            User, Organization, Job, Candidate, Interview, Invitation
        ]
    )
    print("✅ [Database] B2B Models Initialized")