from fastapi import APIRouter
from app.controllers.dashboard_controller import get_dashboard_stats

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats")
def dashboard_stats():
    return get_dashboard_stats()