from fastapi import APIRouter
from app.schemas.seminar_schema import SeminarUpdateSchema
from app.controllers.seminar_controller import get_seminar, update_seminar

router = APIRouter(prefix="/api/seminar", tags=["Seminar"])


@router.get("/")
def public_seminar():
    return {
        "success": True,
        "seminar": get_seminar()
    }


@router.get("/admin")
def admin_get_seminar():
    return {
        "success": True,
        "seminar": get_seminar()
    }


@router.put("/admin")
def admin_update_seminar(data: SeminarUpdateSchema):
    return {
        "success": True,
        "message": "Seminar updated successfully",
        "seminar": update_seminar(data)
    }
