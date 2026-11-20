from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form
)

from app.controllers.application_controller import (
    get_all_applications,
    get_application,
    create_application,
    update_application,
    delete_application,
    get_application_statistics
)

router = APIRouter(
    prefix="/api/applications",
    tags=["Applications"]
)


# ==========================================
# Get All Applications
# ==========================================

@router.get("/")
def applications():

    return get_all_applications()


# ==========================================
# Application Statistics
# ==========================================

@router.get("/statistics")
def statistics():

    return get_application_statistics()


# ==========================================
# Get Single Application
# ==========================================

@router.get("/{application_id}")
def single_application(application_id: str):

    return get_application(application_id)


# ==========================================
# Create Application
# ==========================================

@router.post("/")
async def add_application(

    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    course: str = Form(...),

    qualification: str = Form(""),
    experience: str = Form(""),
    address: str = Form(""),
    message: str = Form(""),

    resume: UploadFile = File(None)

):

    return await create_application(

        name,
        email,
        phone,
        course,
        qualification,
        experience,
        address,
        message,
        resume

    )


# ==========================================
# Update Application
# ==========================================

@router.put("/{application_id}")
async def edit_application(

    application_id: str,

    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    course: str = Form(...),

    qualification: str = Form(""),
    experience: str = Form(""),
    address: str = Form(""),
    message: str = Form(""),

    status: str = Form("Pending"),

    resume: UploadFile = File(None)

):

    return await update_application(

        application_id,

        name,
        email,
        phone,
        course,

        qualification,
        experience,
        address,
        message,

        status,

        resume

    )


# ==========================================
# Delete Application
# ==========================================

@router.delete("/{application_id}")
def remove_application(application_id: str):

    return delete_application(application_id)