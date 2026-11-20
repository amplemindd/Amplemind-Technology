from fastapi import APIRouter, UploadFile, File, Form
from app.controllers.job_controller import (
    get_all_jobs,
    get_job,
    create_job,
    update_job,
    delete_job,
    get_job_statistics,
)

router = APIRouter(
    prefix="/api/jobs",
    tags=["Jobs"],
)


@router.get("/")
def fetch_jobs():
    return get_all_jobs()


@router.get("/statistics")
def fetch_job_statistics():
    return get_job_statistics()


@router.get("/{job_id}")
def fetch_job(job_id: str):
    return get_job(job_id)


@router.post("/")
async def add_job(
    title: str = Form(...),
    location: str = Form(...),
    experience: str = Form(...),
    salary: str = Form(...),
    status: str = Form("Active"),
):
    return await create_job(
        title,
        location,
        experience,
        salary,
        status,
    )


@router.put("/{job_id}")
async def edit_job(
    job_id: str,
    title: str = Form(...),
    location: str = Form(...),
    experience: str = Form(...),
    salary: str = Form(...),
    status: str = Form("Active"),
):
    return await update_job(
        job_id,
        title,
        location,
        experience,
        salary,
        status,
    )


@router.delete("/{job_id}")
def remove_job(job_id: str):
    return delete_job(job_id)