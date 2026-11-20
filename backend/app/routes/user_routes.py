from fastapi import APIRouter

from app.schemas.user_schema import UserSchema

from app.controllers.user_controller import (
    get_all_users,
    add_user,
    update_user,
    delete_user
)

router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)


# ==========================================
# Get All Users
# ==========================================

@router.get("/")
def get_users():

    return get_all_users()


# ==========================================
# Add User
# ==========================================

@router.post("/")
def create_user(
    user: UserSchema
):

    return add_user(user)


# ==========================================
# Update User
# ==========================================

@router.put("/{user_id}")
def edit_user(
    user_id: str,
    user: UserSchema
):

    return update_user(
        user_id,
        user
    )


# ==========================================
# Delete User
# ==========================================

@router.delete("/{user_id}")
def remove_user(
    user_id: str
):

    return delete_user(
        user_id
    )