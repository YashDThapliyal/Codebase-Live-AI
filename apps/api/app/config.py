from pydantic import BaseModel


class Settings(BaseModel):
  app_name: str = "Codebase Live AI API"
  openai_key_configured: bool = False


settings = Settings()
