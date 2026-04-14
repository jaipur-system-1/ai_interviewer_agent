from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db.relational import init_db 
from app.api.routes import auth, jobs, interview, org 

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(title="AI Interviewer Agent API", version="2.1", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(interview.router, prefix="/api/interviews", tags=["Interviews"])
app.include_router(org.router, prefix="/api/org", tags=["Organization"])

@app.get("/")
async def root():
    return {"message": "AI Interviewer Backend Live", "mode": "B2B SaaS"}