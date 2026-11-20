from fastapi import APIRouter

from app.schemas.service_schema import ServiceSchema

from app.controllers.service_controller import (
    get_all_services,
    add_service,
    update_service,
    delete_service
)

router = APIRouter(
    prefix="/api/services",
    tags=["Services"]
)


# ==========================================
# Get All Services
# ==========================================

@router.get("/")
def get_services():

    return get_all_services()


# ==========================================
# Add Service
# ==========================================

@router.post("/")
def create_service(
    service: ServiceSchema
):

    return add_service(service)


# ==========================================
# Update Service
# ==========================================

@router.put("/{service_id}")
def edit_service(
    service_id: str,
    service: ServiceSchema
):

    return update_service(
        service_id,
        service
    )


# ==========================================
# Delete Service
# ==========================================

@router.delete("/{service_id}")
def remove_service(
    service_id: str
):

    return delete_service(service_id)