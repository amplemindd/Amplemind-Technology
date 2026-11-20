from fastapi import APIRouter

from app.schemas.result_schema import ResultSchema

from app.controllers.result_controller import (
    get_all_results,
    get_students_by_course,
    get_student_results,
    get_exam_results,
    add_result,
    bulk_save_results,
    update_result,
    delete_result
)

router = APIRouter(
    prefix="/api/results",
    tags=["Results"]
)


# ==========================================
# Get All Results (Admin)
# ==========================================

@router.get("/")
def all_results():

    return get_all_results()


# ==========================================
# Get Students By Course
# ==========================================

@router.get("/course-students")
def course_students(course: str):

    return get_students_by_course(course)


# ==========================================
# Get Student Results
# ==========================================

@router.get("/my-results")
def my_results(email: str):

    return get_student_results(email)


# ==========================================
# Get Results By Exam
# ==========================================

@router.get("/exam/{exam_id}")
def exam_results(exam_id: str):

    return get_exam_results(exam_id)


# ==========================================
# Add Single Result
# ==========================================

@router.post("/")
def create_result(result: ResultSchema):

    return add_result(result)


# ==========================================
# Bulk Save Results
# ==========================================

@router.post("/bulk-save")
def save_bulk_results(data: dict):

    return bulk_save_results(data)


# ==========================================
# Update Result
# ==========================================

@router.put("/{result_id}")
def edit_result(
    result_id: str,
    result: ResultSchema
):

    return update_result(
        result_id,
        result
    )


# ==========================================
# Delete Result
# ==========================================

@router.delete("/{result_id}")
def remove_result(result_id: str):

    return delete_result(result_id)