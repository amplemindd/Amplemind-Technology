from datetime import datetime
from fastapi import HTTPException

from app.config.database import db
from app.models.settings import Settings
from app.schemas.settings_schema import SettingsSchema
from app.utils.email_service import send_otp_email

settings_collection = db[Settings.collection]


# ==========================================
# Get Settings
# ==========================================

async def get_settings():

    settings = settings_collection.find_one()

    if not settings:

        default_settings = Settings.default_settings()

        default_settings["createdAt"] = datetime.utcnow()
        default_settings["updatedAt"] = datetime.utcnow()

        result = settings_collection.insert_one(
            default_settings
        )

        settings = settings_collection.find_one(
            {
                "_id": result.inserted_id
            }
        )

    settings["_id"] = str(settings["_id"])

    return {

        "success": True,

        "settings": settings

    }


# ==========================================
# Update Settings
# ==========================================

async def update_settings(data: SettingsSchema):

    update_data = data.dict(
        exclude_unset=True
    )

    update_data["updatedAt"] = datetime.utcnow()

    settings = settings_collection.find_one()

    if settings:

        settings_collection.update_one(

            {
                "_id": settings["_id"]
            },

            {
                "$set": update_data
            }

        )

        updated = settings_collection.find_one(

            {
                "_id": settings["_id"]
            }

        )

    else:

        update_data["createdAt"] = datetime.utcnow()

        result = settings_collection.insert_one(
            update_data
        )

        updated = settings_collection.find_one(

            {
                "_id": result.inserted_id
            }

        )

    updated["_id"] = str(updated["_id"])

    return {

        "success": True,

        "message": "Settings Updated Successfully",

        "settings": updated

    }


# ==========================================
# Get Email Settings
# ==========================================

async def get_email_settings():

    settings = settings_collection.find_one()

    if not settings:

        default_settings = Settings.default_settings()

        default_settings["createdAt"] = datetime.utcnow()
        default_settings["updatedAt"] = datetime.utcnow()

        result = settings_collection.insert_one(
            default_settings
        )

        settings = settings_collection.find_one(
            {
                "_id": result.inserted_id
            }
        )

    settings["_id"] = str(settings["_id"])

    return {

        "success": True,

        "email": {

            "smtpHost": settings.get("smtpHost"),

            "smtpPort": settings.get("smtpPort"),

            "senderName": settings.get("senderName"),

            "senderEmail": settings.get("senderEmail"),

            "appPassword": settings.get("appPassword"),

            "emailEnabled": settings.get("emailEnabled")

        }

    }


# ==========================================
# Update Email Settings
# ==========================================

async def update_email_settings(data: dict):

    settings = settings_collection.find_one()

    if not settings:

        settings = Settings.default_settings()

        settings["createdAt"] = datetime.utcnow()

        settings_collection.insert_one(
            settings
        )

        settings = settings_collection.find_one()

    settings_collection.update_one(

        {
            "_id": settings["_id"]
        },

        {

            "$set": {

                "smtpHost": data.get("smtpHost"),

                "smtpPort": data.get("smtpPort"),

                "senderName": data.get("senderName"),

                "senderEmail": data.get("senderEmail"),

                "appPassword": data.get("appPassword"),

                "emailEnabled": data.get("emailEnabled"),

                "updatedAt": datetime.utcnow()

            }

        }

    )

    return {

        "success": True,

        "message": "Email Settings Saved Successfully"

    }


# ==========================================
# Send Test Email
# ==========================================

async def send_test_email():

    settings = settings_collection.find_one()

    if not settings:

        raise HTTPException(

            status_code=404,

            detail="Settings Not Found"

        )

    if not settings.get("emailEnabled"):

        return {

            "success": False,

            "message": "Email Service Disabled"

        }

    sent = send_otp_email(

        settings.get("senderEmail"),

        "123456"

    )

    if sent:

        return {

            "success": True,

            "message": "Test Email Sent Successfully"

        }

    return {

        "success": False,

        "message": "Unable To Send Test Email"

    }