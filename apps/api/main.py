from fastapi import FastAPI

from app.routes import admin, candidates, grading, health, interviews

app = FastAPI(title="Codebase Live AI API", version="0.1.0")

app.include_router(health.router)
app.include_router(candidates.router, prefix="/candidates", tags=["candidates"])
app.include_router(interviews.router, prefix="/interviews", tags=["interviews"])
app.include_router(grading.router, prefix="/grading", tags=["grading"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
