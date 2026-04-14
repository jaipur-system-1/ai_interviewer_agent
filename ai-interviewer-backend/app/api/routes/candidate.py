from fastapi import APIRouter, HTTPException, UploadFile, File
import io
import PyPDF2
from beanie import PydanticObjectId
from app.models.orm import Candidate
from app.models.domain import CandidateCreate
from app.services.rag_service import process_and_store_resume
from datetime import datetime
router = APIRouter()

@router.post("/", response_model=Candidate)
async def create_candidate(candidate_in: CandidateCreate):
    candidate = Candidate(name=candidate_in.name, email=candidate_in.email)
    await candidate.insert()
    return candidate

# --- NEW ENDPOINT: UPLOAD PDF RESUME ---
@router.post("/{candidate_id}/upload-resume")
async def upload_resume(candidate_id: str, file: UploadFile = File(...)):
    # 1. Validate Candidate ID
    try:
        obj_id = PydanticObjectId(candidate_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    candidate = await Candidate.get(obj_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    # 2. Validate it's a PDF
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    # 3. Read the file into memory
    file_bytes = await file.read()

    # 4. Send to our RAG Service (Extract text & save to ChromaDB Vector Database)
    extracted_text = process_and_store_resume(str(candidate.id), file_bytes)

    # 5. Save the raw text to MongoDB as a backup
    candidate.resume_text = extracted_text
    candidate.resume_text = text
    candidate.resume_filename = file.filename # Save the name
    candidate.resume_uploaded_at = datetime.utcnow() # Save the time
    
    await candidate.save()

    return {"message": "Resume successfully uploaded and vectorized!", "candidate_name": candidate.name}

@router.get("/{candidate_id}", response_model=Candidate)
async def get_candidate(candidate_id: str):
    try:
        obj_id = PydanticObjectId(candidate_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    candidate = await Candidate.get(obj_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    return candidate

#We change the path slightly to /resume-upload/{clerk_id} 
# to ensure there's no conflict with old routes
@router.post("/resume-upload/{clerk_id}")
async def upload_resume(clerk_id: str, file: UploadFile = File(...)):
    print(f"📥 Received resume upload request for Clerk ID: {clerk_id}")
    
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    try:
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()

        # IMPORTANT: We search by the clerk_id string field
        candidate = await Candidate.find_one(Candidate.clerk_id == clerk_id)
        
        if not candidate:
            print(f"❌ User {clerk_id} not found in DB")
            raise HTTPException(status_code=404, detail="User profile not found. Please refresh dashboard first.")

        candidate.resume_text = text
        # candidate.resume_text = text
        candidate.resume_filename = file.filename # Save the name
        candidate.resume_uploaded_at = datetime.utcnow() # Save the time
        await candidate.save()
        
        print(f"✅ Successfully updated resume for {clerk_id}")
        return {"status": "success"}

    except Exception as e:
        print(f"🔥 Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me/{clerk_id}")
async def get_candidate_profile(clerk_id: str):
    candidate = await Candidate.find_one(Candidate.clerk_id == clerk_id)
    
    if not candidate:
        raise HTTPException(status_code=404, detail="Profile not found")

    return {
        "name": candidate.name,
        "email": candidate.email,
        "resume": {
            "filename": candidate.resume_filename,
            "uploaded_at": candidate.resume_uploaded_at,
            "has_resume": candidate.resume_text is not None
        }
    }