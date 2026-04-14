import os
from pathlib import Path

# Define the folder structure
folders = [
    "app/api/routes",
    "app/core",
    "app/services",
    "app/db",
    "app/models",
    "bot"
]

# Define the files to create
files = [
    "app/__init__.py",
    "app/api/__init__.py",
    "app/api/routes/__init__.py",
    "app/api/routes/interview.py",
    "app/api/routes/candidate.py",
    "app/api/dependencies.py",
    "app/core/__init__.py",
    "app/core/config.py",
    "app/core/security.py",
    "app/services/__init__.py",
    "app/services/llm_service.py",
    "app/services/bot_manager.py",
    "app/services/rag_service.py",
    "app/db/__init__.py",
    "app/db/relational.py",
    "app/db/vector.py",
    "app/models/__init__.py",
    "app/models/domain.py",
    "app/models/orm.py",
    "app/main.py",
    ".env",
    "requirements.txt"
]

print("🏗️ Building Enterprise AI Interviewer folder structure...")

# Create folders
for folder in folders:
    Path(folder).mkdir(parents=True, exist_ok=True)
    print(f"📁 Created folder: {folder}")

# Create files
for file_path in files:
    path = Path(file_path)
    if not path.exists():
        path.touch()
        print(f"📄 Created file: {file_path}")
    else:
        print(f"⏭️ Skipped existing file: {file_path}")

print("\n✅ Project scaffolding complete! Your backend is ready to be built.")