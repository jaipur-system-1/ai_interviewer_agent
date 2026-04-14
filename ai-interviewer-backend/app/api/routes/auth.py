from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.models.orm import User, UserRole, Organization, Invitation
from app.services.auth_utils import is_corporate_email, extract_domain_from_url
import httpx
import os

router = APIRouter()

# You MUST put your Clerk Secret Key in .env or here
CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY", "sk_test_...") 

class OnboardRequest(BaseModel):
    clerk_id: str
    email: str
    full_name: str
    role: str 
    company_name: str = ""
    company_website: str = ""
    invite_token: Optional[str] = None 

async def update_clerk_metadata(clerk_id: str, role: str, org_id: str = None):
    """Stamps the user's Clerk session with their Role and Org ID."""
    url = f"https://api.clerk.com/v1/users/{clerk_id}/metadata"
    headers = {"Authorization": f"Bearer {CLERK_SECRET_KEY}"}
    payload = {
        "public_metadata": {
            "role": role,
            "org_id": org_id,
            "onboarding_complete": True
        }
    }
    async with httpx.AsyncClient() as client:
        # Note: Clerk API uses PATCH to update metadata
        resp = await client.patch(url, json=payload, headers=headers)
        if resp.status_code != 200:
            print(f"⚠️ [Clerk Sync Error] {resp.text}")

@router.post("/sync_user")
async def sync_user(data: OnboardRequest):
    # Idempotency Check
    existing_user = await User.find_one({"clerk_id": data.clerk_id})
    if existing_user:
        return {"message": "User already synced", "role": existing_user.role}

    # ---------------------------------------------------------
    # SCENARIO A: JOINING WITH AN INVITE (Employee Flow)
    # ---------------------------------------------------------
    if data.invite_token:
        invite = await Invitation.find_one({"token": data.invite_token})
        if not invite:
            raise HTTPException(status_code=400, detail="Invalid or expired invitation token")
        
        # Security: Email must match
        if invite.email != data.email:
             # In production, you might be stricter. For dev, we warn.
             print(f"⚠️ Warning: Invite email {invite.email} != Signup email {data.email}")

        user = User(
            clerk_id=data.clerk_id,
            email=data.email,
            full_name=data.full_name,
            role=UserRole.RECRUITER,
            organization_id=invite.organization_id
        )
        await user.insert()
        
        # Cleanup Invite
        invite.status = "accepted"
        await invite.save()
        
        # SYNC TO CLERK
        await update_clerk_metadata(data.clerk_id, "recruiter", invite.organization_id)
        
        return {"message": "Joined Organization Successfully", "role": "recruiter"}

    # ---------------------------------------------------------
    # SCENARIO B: CREATING A NEW COMPANY (Admin Flow)
    # ---------------------------------------------------------
    if data.role == "org_admin":
        if not data.company_name:
            raise HTTPException(status_code=400, detail="Company Name is required")
        
        domain = extract_domain_from_url(data.company_website) or data.email.split("@")[1]
        
        existing_org = await Organization.find_one({"domain": domain})
        if existing_org:
            raise HTTPException(status_code=400, detail=f"Organization for {domain} already exists. Ask your admin for an invite.")

        org = Organization(
            name=data.company_name,
            domain=domain,
            website=data.company_website,
            owner_id=data.clerk_id,
            is_verified=False
        )
        await org.insert()

        user = User(
            clerk_id=data.clerk_id,
            email=data.email,
            full_name=data.full_name,
            role=UserRole.ORG_ADMIN,
            organization_id=str(org.id)
        )
        await user.insert()

        # SYNC TO CLERK
        await update_clerk_metadata(data.clerk_id, "org_admin", str(org.id))

        return {"message": "Organization Created", "role": "org_admin"}

    # ---------------------------------------------------------
    # SCENARIO C: STUDENT (B2C Flow)
    # ---------------------------------------------------------
    user = User(
        clerk_id=data.clerk_id,
        email=data.email,
        full_name=data.full_name,
        role=UserRole.USER
    )
    await user.insert()
    
    # SYNC TO CLERK
    await update_clerk_metadata(data.clerk_id, "user")

    return {"message": "Student Account Created", "role": "user"}