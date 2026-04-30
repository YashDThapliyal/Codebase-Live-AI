import os

from pydantic import BaseModel


class Settings(BaseModel):
  app_name: str = "Codebase Live AI API"
  openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
  openai_realtime_model: str = os.getenv("OPENAI_REALTIME_MODEL", "gpt-4o-realtime-preview")

  realtime_vad_threshold: float = float(os.getenv("REALTIME_VAD_THRESHOLD", "0.65"))
  realtime_vad_prefix_padding_ms: int = int(os.getenv("REALTIME_VAD_PREFIX_PADDING_MS", "300"))
  realtime_vad_silence_duration_ms: int = int(os.getenv("REALTIME_VAD_SILENCE_DURATION_MS", "1000"))

  @property
  def openai_key_configured(self) -> bool:
    return bool(self.openai_api_key)


settings = Settings()
