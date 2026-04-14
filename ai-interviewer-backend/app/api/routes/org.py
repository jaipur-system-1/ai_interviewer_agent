from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel, EmailStr
from app.models.orm import User, Organization, Invitation, UserRole
import uuid

router = APIRouter()

class InviteRequest(BaseModel):
    email: EmailStr
    admin_clerk_id: str

@router.post("/invite")
async def invite_recruiter(data: InviteRequest):
    # 1. Verify Admin
    admin = await User.find_one({"clerk_id": data.admin_clerk_id})
    if not admin or admin.role != UserRole.ORG_ADMIN:
        raise HTTPException(status_code=403, detail="Only Admins can invite members")
    
    if not admin.organization_id:
        raise HTTPException(status_code=400, detail="Admin is not part of an organization")

    # 2. Check if user already in system
    existing_user = await User.find_one({"email": data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already registered.")

    # 3. Create Invitation
    invite = Invitation(
        email=data.email,
        organization_id=admin.organization_id,
        role=UserRole.RECRUITER,
        invited_by=admin.clerk_id,
        token=str(uuid.uuid4())
    )
    await invite.insert()

    # 4. Generate Link 
    invite_link = f"http://localhost:3000/onboarding?token={invite.token}"
    
    return {
        "message": "Invitation Sent",
        "invite_link": invite_link 
    }

@router.get("/members/{admin_clerk_id}")
async def get_team_members(admin_clerk_id: str):
    user = await User.find_one({"clerk_id": admin_clerk_id})
    if not user or not user.organization_id:
        raise HTTPException(status_code=403, detail="Access Denied")

    members = await User.find({"organization_id": user.organization_id}).to_list()
    invites = await Invitation.find({"organization_id": user.organization_id, "status": "pending"}).to_list()

    return {
        "members": [{"email": m.email, "role": m.role, "status": "active"} for m in members],
        "invitations": [{"email": i.email, "status": "pending", "token": i.token} for i in invites]
    }