from beanie import Document, Indexed
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel, Field, EmailStr
from enum import Enum
import uuid

# --- ENUMS ---
class UserRole(str, Enum):
    SUPER_ADMIN = "super_admin"  # You (The Platform Owner)
    ORG_ADMIN = "org_admin"      # Company Owner (Customer)
    RECRUITER = "recruiter"      # Employee (Invited)
    CANDIDATE = "candidate"      # Interviewee
    USER = "user"                # Student/B2C

class InterviewStatus(str, Enum):
    INVITED = "invited"
    STARTED = "started"
    COMPLETED = "completed"

# --- SUB-MODELS ---
class SkillMetric(BaseModel):
    name: str 
    score: int
    feedback: str

class BehavioralTrait(BaseModel):
    label: str
    status: str
    observation: str

class Scorecard(BaseModel):
    overall_score: int = Field(default=0) 
    recommendation: str = ""
    summary: str = ""
    skill_breakdown: List[SkillMetric] = []
    behavioral_analysis: List[BehavioralTrait] = []
    key_strengths: List[str] = []
    areas_for_improvement: List[str] = []
    coaching_tips: List[str] = []
    class Config:
        extra = "allow" 

class InterviewMessage(BaseModel):
    role: str
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# --- 1. ORGANIZATION (The Tenant) ---
class Organization(Document):
    name: str = Indexed(unique=True) 
    domain: str = Indexed()          
    website: str
    owner_id: str                    # Clerk ID of the ORG_ADMIN
    is_verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "organizations"

# --- 2. USER (The Human) ---
class User(Document):
    clerk_id: str = Indexed(unique=True)
    email: str = Indexed(unique=True)
    full_name: str
    
    role: UserRole = UserRole.USER 
    organization_id: Optional[str] = None 
    is_active: bool = True
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"

# --- 3. INVITATION (The Security Layer) ---
class Invitation(Document):
    email: str = Indexed()
    organization_id: str
    role: UserRole = UserRole.RECRUITER
    invited_by: str # Admin ID
    
    token: str = Indexed(unique=True, default_factory=lambda: str(uuid.uuid4()))
    expires_at: datetime = Field(default_factory=lambda: datetime.utcnow() + timedelta(days=7))
    status: str = "pending" # "pending", "accepted"
    
    class Settings:
        name = "invitations"

# --- 4. JOB (The Context) ---
class Job(Document):
    organization_id: str = Indexed() 
    created_by: str                  
    
    title: str                       
    description: str                 
    difficulty: str = "Mid-Level"
    tech_stack: str = ""
    
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    class Settings:
        name = "jobs"

# --- 5. CANDIDATE (The Target) ---
class Candidate(Document):
    job_id: str = Indexed()          
    recruiter_id: str                
    
    name: str
    email: str
    resume_text: Optional[str] = None
    
    invite_token: str = Indexed(unique=True, default_factory=lambda: str(uuid.uuid4()))
    status: InterviewStatus = InterviewStatus.INVITED
    interview_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    class Settings:
        name = "candidates"

# --- 6. INTERVIEW (The Session) ---
class Interview(Document):
    clerk_id: Optional[str] = Indexed(default=None) # B2C
    candidate_id: Optional[str] = Indexed(default=None) # B2B
    job_id: Optional[str] = Indexed(default=None)      
    
    job_role: str 
    status: str = "started"
    transcript: List[InterviewMessage] = []
    scorecard: Optional[Scorecard] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "interviews"