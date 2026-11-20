from fastapi import APIRouter

from app.schemas.job_schema import JobSchema
from app.controllers.job_controller import (
    get_all_jobs,
    get_job,
    add_job,
    update_job,
    delete_job,
    get_job_statistics,
)

router = APIRouter(
    prefix="/api/jobs",
    tags=["Jobs"]
)


# ==========================================
# Get All Jobs
# ==========================================

@router.get("/")
def fetch_jobs():

    return get_all_jobs()


# ==========================================
# Get Job Statistics
# ==========================================

@router.get("/statistics")
def fetch_job_statistics():

    return get_job_statistics()


# ==========================================
# Get Single Job
# ==========================================

@router.get("/{job_id}")
def fetch_job(job_id: str):

    return get_job(job_id)


# ==========================================
# Add Job
# ==========================================

@router.post("/")
def create_job(job: JobSchema):

    return add_job(job)


# ==========================================
# Update Job
# ==========================================

@router.put("/{job_id}")
def edit_job(job_id: str, job: JobSchema):

    return update_job(job_id, job)


# ==========================================
# Delete Job
# ==========================================

@router.delete("/{job_id}")
def remove_job(job_id: str):

    return delete_job(job_id)