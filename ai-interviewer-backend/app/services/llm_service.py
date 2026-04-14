import json
from groq import AsyncGroq
from beanie import PydanticObjectId
from app.core.config import settings
from app.models.orm import Interview, Scorecard

# Initialize Groq
groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)

async def generate_scorecard_task(interview_id: str):
    print(f"🧠 [Evaluator] Grading Interview: {interview_id}...")
    
    # 1. Fetch Data
    interview = await Interview.get(PydanticObjectId(interview_id))
    if not interview or not interview.transcript:
        print("❌ [Evaluator] No transcript found.")
        return

    # 2. Format Transcript for LLM
    transcript_text = ""
    for msg in interview.transcript:
        role = "CANDIDATE" if msg.role == "user" else "INTERVIEWER"
        transcript_text += f"{role}: {msg.content}\n"

    # 3. The "Hiring Committee" Prompt
    system_prompt = f"""
    You are a Bar-Raiser at a FAANG company (Google/Amazon level).
    Evaluate this candidate for the role of: {interview.job_role}.
    
    TRANSCRIPT:
    {transcript_text}
    
    ---
    
    YOUR TASK:
    Analyze the transcript deepy. Do not be generic.
    Return a valid JSON object matching this EXACT structure:
    {{
        "overall_score": (integer 0-100),
        "recommendation": ("Strong Hire", "Hire", "No Hire"),
        "summary": "2 sentences summarizing performance.",
        "skill_breakdown": [
            {{ "name": "Technical Accuracy", "score": (0-100), "feedback": "Specific technical error or success." }},
            {{ "name": "Communication", "score": (0-100), "feedback": "Did they ramble? Were they concise?" }},
            {{ "name": "Problem Solving", "score": (0-100), "feedback": "Did they ask clarifying questions?" }},
            {{ "name": "Subject Matter Expertise", "score": (0-100), "feedback": "Depth of knowledge in {interview.job_role}." }}
        ],
        "behavioral_analysis": [
            {{ "label": "Confidence", "status": "Positive/Neutral/Negative", "observation": "Tone analysis." }},
            {{ "label": "Honesty", "status": "Positive/Negative", "observation": "Did they admit when they didn't know?" }}
        ],
        "key_strengths": ["List of 3 specific strengths"],
        "areas_for_improvement": ["List of 3 specific weaknesses"],
        "coaching_tips": ["Actionable advice for their next interview"]
    }}
    """

    try:
        # 4. Call Llama 3 (Force JSON)
        response = await groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": system_prompt}],
            response_format={"type": "json_object"},
            temperature=0.2 # Low temp for consistency
        )

        # 5. Parse & Save
        data = json.loads(response.choices[0].message.content)
        
        # Safety checks (ensure lists exist)
        data["skill_breakdown"] = data.get("skill_breakdown", [])
        data["behavioral_analysis"] = data.get("behavioral_analysis", [])
        data["coaching_tips"] = data.get("coaching_tips", [])

        interview.scorecard = Scorecard(**data)
        interview.status = "completed"
        await interview.save()
        
        print(f"✅ [Evaluator] Scorecard Generated! Score: {interview.scorecard.overall_score}")

    except Exception as e:
        print(f"❌ [Evaluator] Failed: {str(e)}")