from fastapi import APIRouter

from app.controllers.settings_controller import (
    get_settings,
    update_settings,
    get_email_settings,
    update_email_settings,
    send_test_email
)

from app.schemas.settings_schema import SettingsSchema

router = APIRouter(
    prefix="/api/settings",
    tags=["Settings"]
)


# ==========================================
# Website Settings
# ==========================================

@router.get("/")
async def fetch_settings():

    return await get_settings()


@router.put("/")
async def save_settings(data: SettingsSchema):

    return await update_settings(data)


# ==========================================
# Email Settings
# ==========================================

@router.get("/email")
async def fetch_email_settings():

    return await get_email_settings()


@router.put("/email")
async def save_email_settings(data: dict):

    return await update_email_settings(data)


# ==========================================
# Send Test Email
# ==========================================

@router.post("/test-email")
async def test_email():

    return await send_test_email()