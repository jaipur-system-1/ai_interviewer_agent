from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str
    API_V1_STR: str
    ENVIRONMENT: str
    
    # Database
    MONGODB_URI: str
    MONGODB_DB_NAME: str
    
    # API Keys
    GROQ_API_KEY: str

    # Tells Pydantic to read from the .env file
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

# Create a global instance of the settings to use everywhere
settings = Settings()