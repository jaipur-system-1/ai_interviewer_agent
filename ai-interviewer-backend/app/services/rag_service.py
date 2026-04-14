import os
import io
import chromadb
from PyPDF2 import PdfReader

# Initialize Local ChromaDB
# This creates a hidden folder called 'chroma_data' in your project root to permanently save vectors
CHROMA_PATH = os.path.join(os.getcwd(), "chroma_data")
chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)

# Create a 'table' (collection) just for resumes
resume_collection = chroma_client.get_or_create_collection(name="candidate_resumes")

def process_and_store_resume(candidate_id: str, file_bytes: bytes) -> str:
    print(f"📄 [RAG Service] Parsing PDF for Candidate {candidate_id}...")
    
    # 1. Read the PDF
    reader = PdfReader(io.BytesIO(file_bytes))
    full_text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            full_text += extracted + "\n"
            
    # 2. Store in Vector Database
    # ChromaDB will automatically convert this text into an Embedding Vector!
    print("🧠 [RAG Service] Generating vector embeddings and saving to ChromaDB...")
    resume_collection.upsert(
        documents=[full_text],
        metadatas=[{"candidate_id": candidate_id}],
        ids=[f"resume_{candidate_id}"]
    )
    
    return full_text

def get_resume_context(candidate_id: str) -> str:
    # 3. Retrieve the resume when the interview starts
    try:
        results = resume_collection.get(
            ids=[f"resume_{candidate_id}"]
        )
        if results['documents'] and len(results['documents']) > 0:
            return results['documents'][0]
        return "No resume provided."
    except Exception as e:
        print(f"⚠️ [RAG Service] Could not fetch resume: {e}")
        return "No resume provided."