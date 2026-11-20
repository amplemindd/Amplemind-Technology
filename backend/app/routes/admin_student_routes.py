from fastapi import (
    APIRouter,
    Form,
    File,
    UploadFile,
)

from app.controllers.student_analytics_controller import get_student_analytics

from app.controllers.admin_student_controller import (
    get_all_students,
    get_student,
    update_student,
    delete_student,
)

router = APIRouter(
    prefix="/api/admin/students",
    tags=["Admin Students"]
)


@router.get("")
def fetch_all_students():
    return get_all_students()


@router.get("/analytics")
def fetch_student_analytics():
    return get_student_analytics()


@router.get("/{student_id}")
def fetch_student(student_id: str):
    return get_student(student_id)


@router.put("/{student_id}")
async def edit_student(
    student_id: str,
    name: str = Form(None),
    email: str = Form(None),
    phone: str = Form(None),
    studentId: str = Form(None),
    course: str = Form(None),
    status: str = Form(None),
    address: str = Form(None),
    city: str = Form(None),
    state: str = Form(None),
    country: str = Form(None),
    gender: str = Form(None),
    qualification: str = Form(None),
    college: str = Form(None),
    batch: str = Form(None),
    rollNumber: str = Form(None),
    paymentStatus: str = Form(None),
    paidAmount: float = Form(None),
    dueAmount: float = Form(None),
    totalFees: float = Form(None),
    certificateStatus: str = Form(None),
    profileImage: UploadFile = File(None),
):
    data = {
        "name": name,
        "email": email,
        "phone": phone,
        "studentId": studentId,
        "course": course,
        "status": status,
        "address": address,
        "city": city,
        "state": state,
        "country": country,
        "gender": gender,
        "qualification": qualification,
        "college": college,
        "batch": batch,
        "rollNumber": rollNumber,
        "paymentStatus": paymentStatus,
        "paidAmount": paidAmount,
        "dueAmount": dueAmount,
        "totalFees": totalFees,
        "certificateStatus": certificateStatus,
    }

    return await update_student(
        student_id,
        data,
        profileImage,
    )


@router.delete("/{student_id}")
def remove_student(student_id: str):
    return delete_student(student_id)