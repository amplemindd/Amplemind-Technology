from fastapi import APIRouter

from app.schemas.admin_schema import (
    AdminLogin,
    ChangePasswordSchema
)

from app.controllers.admin_controller import (
    admin_login,
    get_admin_profile,
    change_admin_password
)

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)


# ==========================================
# Admin Login
# ==========================================

@router.post("/login")
def login(admin: AdminLogin):
    return admin_login(admin)


# ==========================================
# Get Admin Profile
# ==========================================

@router.get("/profile")
def profile():
    return get_admin_profile()


# ==========================================
# Change Password
# ==========================================

@router.put("/change-password")
def change_password(data: ChangePasswordSchema):
    return change_admin_password(data)