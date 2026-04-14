from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.models.orm import Job, Candidate, User, Organization
import shutil
import os

# Note: You need a real PDF parser service. 
# For now, we mock the text extraction.
# from app.services.rag_service import extract_text_from_pdf 

router = APIRouter()

# 1. CREATE JOB (Recruiter)
@router.post("/create")
async def create_job(
    title: str = Form(...),
    description: str = Form(...),
    difficulty: str = Form("Mid-Level"),
    focus_area: str = Form("General"),
    tech_stack: str = Form(""),
    clerk_id: str = Form(...) # The Recruiter
):
    # Get Recruiter
    user = await User.find_one(User.clerk_id == clerk_id)
    if not user:
        raise HTTPException(status_code=404, detail="Recruiter not found")
        
    if not user.organization_id:
        raise HTTPException(status_code=400, detail="User not part of an organization")

    # Create Job linked to Org
    job = Job(
        organization_id=user.organization_id,
        created_by=str(user.id),
        title=title,
        description=description,
        difficulty=difficulty,
        focus_area=focus_area,
        tech_stack=tech_stack
    )
    await job.insert()
    return {"message": "Job Created", "job_id": str(job.id)}

# 2. INVITE CANDIDATE (Recruiter uploads Resume)
@router.post("/{job_id}/invite")
async def invite_candidate(
    job_id: str,
    name: str = Form(...),
    email: str = Form(...),
    resume: UploadFile = File(...)
):
    job = await Job.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Mock Text Extraction (Replace with real logic later)
    # file_location = f"/tmp/{resume.filename}"
    # with open(file_location, "wb+") as file_object:
    #     shutil.copyfileobj(resume.file, file_object)
    # resume_text = extract_text_from_pdf(file_location) 
    
    resume_text = "Placeholder resume text until PDF service is ready."

    candidate = Candidate(
        job_id=str(job.id),
        recruiter_id=job.created_by,
        name=name,
        email=email,
        resume_text=resume_text
    )
    await candidate.insert()

    # Generate the link (Frontend URL)
    invite_link = f"http://localhost:3000/interview/join/{candidate.invite_token}"
    
    return {
        "message": "Candidate Invited",
        "invite_token": candidate.invite_token,
        "invite_link": invite_link
    }

# 3. PUBLIC: GET CANDIDATE INFO (For Landing Page)
@router.get("/candidate/{invite_token}")
async def get_candidate_info(invite_token: str):
    candidate = await Candidate.find_one(Candidate.invite_token == invite_token)
    if not candidate:
        raise HTTPException(status_code=404, detail="Invalid or Expired Link")
    
    job = await Job.get(candidate.job_id)
    org = await Organization.get(job.organization_id)
    
    return {
        "candidate_name": candidate.name,
        "job_title": job.title,
        "company_name": org.name,
        "status": candidate.status,
        "description": job.description[:200] + "..." # Preview
    }