from fastapi import APIRouter, HTTPException, BackgroundTasks, Body
from beanie import PydanticObjectId
from pydantic import BaseModel
from typing import List, Optional

from app.models.orm import Interview, Candidate, Job, User, InterviewMessage, InterviewStatus
from app.services.bot_manager import launch_docker_bot
from app.services.llm_service import generate_scorecard_task

router = APIRouter()

# --- INPUT SCHEMAS ---
class B2CStartRequest(BaseModel):
    clerk_id: str
    job_role: str
    resume_text: Optional[str] = "No resume provided."
    difficulty: str = "Mid-Level"
    tech_stack: str = ""

class B2BStartRequest(BaseModel):
    invite_token: str

class TranscriptRequest(BaseModel):
    transcript: List[dict]

# ==========================================
# 1. B2C START (For Practice Users)
# ==========================================
@router.post("/start/practice")
async def start_practice_interview(request: B2CStartRequest, background_tasks: BackgroundTasks):
    interview = Interview(
        clerk_id=request.clerk_id,
        job_role=request.job_role,
        status="started"
    )
    await interview.insert()

    print(f"🚀 [B2C] Starting Practice for User {request.clerk_id}...")
    
    background_tasks.add_task(
        launch_docker_bot,
        str(interview.id),
        "Candidate", 
        request.job_role,
        request.resume_text,
        request.difficulty,
        "General",
        request.tech_stack,
        "Friendly Coach"
    )

    return {"message": "Practice Started", "interview_id": str(interview.id)}

# ==========================================
# 2. B2B START (For Invited Candidates)
# ==========================================
@router.post("/start/invite")
async def start_invited_interview(request: B2BStartRequest, background_tasks: BackgroundTasks):
    candidate = await Candidate.find_one(Candidate.invite_token == request.invite_token)
    if not candidate:
        raise HTTPException(status_code=404, detail="Invalid Invite Link")

    if candidate.status == InterviewStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Interview already completed")

    job = await Job.get(candidate.job_id)

    interview = Interview(
        candidate_id=str(candidate.id),
        job_id=str(job.id),
        job_role=job.title,
        status="started"
    )
    await interview.insert()

    candidate.status = InterviewStatus.STARTED
    candidate.interview_id = str(interview.id)
    await candidate.save()

    print(f"🚀 [B2B] Starting Interview for {candidate.name}...")

    background_tasks.add_task(
        launch_docker_bot,
        str(interview.id),
        candidate.name,
        job.title,
        candidate.resume_text,
        job.difficulty,
        job.focus_area,
        job.tech_stack,
        "Professional Recruiter"
    )

    return {"message": "Interview Started", "interview_id": str(interview.id)}

# ==========================================
# 3. SHARED: SAVE TRANSCRIPT & GENERATE REPORT
# ==========================================
@router.patch("/{interview_id}/transcript")
async def save_transcript(
    interview_id: str, 
    request: TranscriptRequest, 
    background_tasks: BackgroundTasks
):
    if not PydanticObjectId.is_valid(interview_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    try:
        obj_id = PydanticObjectId(interview_id)
        interview = await Interview.get(obj_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID")
        
    if not interview:
        raise HTTPException(status_code=404, detail="Not Found")

    msgs = [InterviewMessage(role=m['role'], content=m['content']) for m in request.transcript]
    interview.transcript = msgs
    interview.status = "completed"
    await interview.save()

    if interview.candidate_id:
        candidate = await Candidate.get(interview.candidate_id)
        if candidate:
            candidate.status = InterviewStatus.COMPLETED
            await candidate.save()

    print("⚡ [Orchestrator] Triggering Grading...")
    background_tasks.add_task(generate_scorecard_task, str(interview.id))

    return {"message": "Saved"}

# ==========================================
# 4. SHARED: GET REPORT
# ==========================================
@router.get("/{interview_id}")
async def get_report(interview_id: str):
    # Fix 1: Validate ID before crashing
    if interview_id == "undefined" or not PydanticObjectId.is_valid(interview_id):
        raise HTTPException(status_code=400, detail="Invalid Interview ID provided")

    interview = await Interview.get(PydanticObjectId(interview_id))
    if not interview:
        raise HTTPException(status_code=404, detail="Not Found")
    return interview

# ==========================================
# 5. B2C ONLY: LIST MY INTERVIEWS (CRITICAL FIX)
# ==========================================
@router.get("/user/{clerk_id}")
async def list_user_interviews(clerk_id: str):
    interviews = await Interview.find(Interview.clerk_id == clerk_id).sort(-Interview.created_at).to_list()
    
    # Fix 2: Explicitly format the response so Frontend finds 'interview_id'
    return [
        {
            "interview_id": str(i.id), # <--- THIS IS WHAT FRONTEND NEEDS
            "job_role": i.job_role,
            "status": i.status,
            "created_at": i.created_at,
            "has_scorecard": i.scorecard is not None
        }
        for i in interviews
    ]