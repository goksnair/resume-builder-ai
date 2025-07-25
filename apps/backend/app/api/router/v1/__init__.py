from fastapi import APIRouter

from .job import job_router
from .resume import resume_router
from .conversation import router as conversation_router
from .personas import router as personas_router

v1_router = APIRouter(prefix="/api/v1", tags=["v1"])
v1_router.include_router(resume_router, prefix="/resumes")
v1_router.include_router(job_router, prefix="/jobs")
v1_router.include_router(conversation_router)
v1_router.include_router(personas_router, prefix="/personas")


__all__ = ["v1_router"]
