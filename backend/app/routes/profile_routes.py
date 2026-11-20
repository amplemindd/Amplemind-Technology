from fastapi import APIRouter, Depends, Form, File, UploadFile

from app.middleware.auth import get_current_student
from app.controllers.profile_controller import (
    get_profile,
    update_profile
)

router = APIRouter(
    prefix="/api/profile",
    tags=["Profile"]
)


# ===========================
# Get Student Profile
# ===========================

@router.get("/")
def student_profile(
    current_student=Depends(get_current_student)
):
    return get_profile(current_student)


# ===========================
# Update Student Profile
# ===========================

@router.put("/")
async def update_student_profile(
    phone: str = Form(None),
    dob: str = Form(None),
    gender: str = Form(None),
    address: str = Form(None),
    city: str = Form(None),
    state: str = Form(None),
    country: str = Form(None),
    profileImage: UploadFile = File(None),
    current_student=Depends(get_current_student)
):

    print("Profile Image:", profileImage)
    print("Filename:", profileImage.filename if profileImage else "No Image")

    return await update_profile(
        current_student,
        phone,
        dob,
        gender,
        address,
        city,
        state,
        country,
        profileImage
    )