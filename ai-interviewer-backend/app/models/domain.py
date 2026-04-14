from pydantic import BaseModel
from typing import Optional
from typing import List

# What the frontend sends when a candidate signs up
class CandidateCreate(BaseModel):
    name: str
    email: str
    resume_text: Optional[str] = None

# What the frontend sends when the recruiter clicks "Start Interview"

class InterviewStartRequest(BaseModel):
    candidate_id: str
    job_role: str
    difficulty: str = "Mid-Level"  # New
    focus_area: str = "General"    # New
    tech_stack: Optional[str] = "" # New
    meeting_url: Optional[str] = None
    instructions: Optional[str] = None
    interview_type: str = "b2c_practice"
    personality: str = "Professional"

class MessageItem(BaseModel):
    role: str
    content: str

class TranscriptUpdateRequest(BaseModel):
    transcript: List[MessageItem]