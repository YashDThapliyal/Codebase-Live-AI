import os

from pydantic import BaseModel


class Settings(BaseModel):
  app_name: str = "Codebase Live AI API"
  openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
  openai_realtime_model: str = os.getenv("OPENAI_REALTIME_MODEL", "gpt-4o-realtime-preview")
  openai_transcription_model: str = os.getenv("OPENAI_TRANSCRIPTION_MODEL", "gpt-4o-mini-transcribe")

  realtime_vad_threshold: float = float(os.getenv("REALTIME_VAD_THRESHOLD", "0.58"))
  realtime_vad_prefix_padding_ms: int = int(os.getenv("REALTIME_VAD_PREFIX_PADDING_MS", "220"))
  realtime_vad_silence_duration_ms: int = int(os.getenv("REALTIME_VAD_SILENCE_DURATION_MS", "850"))

  auth_secret: str = os.getenv("AUTH_SECRET", "change-me-local-dev-secret")
  sqlite_db_path: str = os.getenv("SQLITE_DB_PATH", "data/codebase_live_ai.db")

  @property
  def openai_key_configured(self) -> bool:
    return bool(self.openai_api_key)


settings = Settings()
