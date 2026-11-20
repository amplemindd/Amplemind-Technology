from fastapi import APIRouter, Depends

from app.controllers.student_controller import (
    get_profile,
    update_profile,
    change_password,
    get_my_courses,
    get_course_details,
    get_my_payments,
    get_my_certificates,
    get_my_results,
    get_notifications,
    mark_notification_as_read,
)

from app.schemas.student_schema import (
    UpdateProfile,
    ChangePassword,
)

# JWT Dependency
from app.middleware.auth import get_current_student

router = APIRouter(
    prefix="/api/student",
    tags=["Student"]
)


# ==========================================
# Student Profile
# ==========================================

@router.get("/profile")
def student_profile(current_student=Depends(get_current_student)):
    return get_profile(current_student["_id"])


# ==========================================
# Update Profile
# ==========================================

@router.put("/profile")
def student_update_profile(
    data: UpdateProfile,
    current_student=Depends(get_current_student)
):
    return update_profile(current_student["_id"], data)


# ==========================================
# Change Password
# ==========================================

@router.put("/change-password")
def student_change_password(
    data: ChangePassword,
    current_student=Depends(get_current_student)
):
    return change_password(current_student["_id"], data)


# ==========================================
# My Courses
# ==========================================

@router.get("/my-courses")
def student_my_courses(current_student=Depends(get_current_student)):
    return get_my_courses(current_student["_id"])


# ==========================================
# Course Details
# ==========================================

@router.get("/course/{course_id}")
def student_course_details(
    course_id: str,
    current_student=Depends(get_current_student)
):
    return get_course_details(course_id)


# ==========================================
# My Payments
# ==========================================

@router.get("/my-payments")
def student_my_payments(current_student=Depends(get_current_student)):
    return get_my_payments(current_student["_id"])


# ==========================================
# My Certificates
# ==========================================

@router.get("/my-certificates")
def student_my_certificates(current_student=Depends(get_current_student)):
    return get_my_certificates(current_student["_id"])


# ==========================================
# My Results
# ==========================================

@router.get("/my-results")
def student_my_results(current_student=Depends(get_current_student)):
    return get_my_results(current_student["_id"])


# ==========================================
# Notifications
# ==========================================

@router.get("/notifications")
def student_notifications(current_student=Depends(get_current_student)):
    return get_notifications()


# ==========================================
# Mark Notification As Read
# ==========================================

@router.put("/notifications/{notification_id}")
def student_mark_notification(
    notification_id: str,
    current_student=Depends(get_current_student)
):
    return mark_notification_as_read(notification_id)