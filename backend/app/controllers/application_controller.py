from bson import ObjectId
from datetime import datetime

from app.models.application import application_collection
from app.utils.file_upload import save_file, delete_file


# ==========================================
# Get All Applications
# ==========================================

def get_all_applications():

    try:

        applications = list(
            application_collection.find().sort("_id", -1)
        )

        for application in applications:
            application["_id"] = str(application["_id"])

        return {
            "success": True,
            "applications": applications
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Get Single Application
# ==========================================

def get_application(application_id):

    try:

        if not ObjectId.is_valid(application_id):

            return {
                "success": False,
                "message": "Invalid Application ID"
            }

        application = application_collection.find_one(
            {"_id": ObjectId(application_id)}
        )

        if not application:

            return {
                "success": False,
                "message": "Application Not Found"
            }

        application["_id"] = str(application["_id"])

        return {
            "success": True,
            "application": application
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Create Application
# ==========================================

async def create_application(

    name,
    email,
    phone,
    course,
    qualification,
    experience,
    address,
    message,
    resume

):

    try:

        resume_path = ""

        if resume:

            resume_path = save_file(resume, "resumes")

            if resume_path is None:

                return {
                    "success": False,
                    "message": "Resume upload failed"
                }

        application = {

            "name": name,
            "email": email,
            "phone": phone,
            "course": course,
            "qualification": qualification,
            "experience": experience,
            "address": address,
            "message": message,
            "resume": resume_path,

            "status": "Pending",

            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()

        }

        result = application_collection.insert_one(application)

        application["_id"] = str(result.inserted_id)

        return {

            "success": True,
            "message": "Application Submitted Successfully",
            "application": application

        }

    except Exception as e:

        return {

            "success": False,
            "message": str(e)

        }


# ==========================================
# Update Application
# ==========================================

async def update_application(

    application_id,

    name,
    email,
    phone,
    course,
    qualification,
    experience,
    address,
    message,
    status,
    resume

):

    try:

        if not ObjectId.is_valid(application_id):

            return {
                "success": False,
                "message": "Invalid Application ID"
            }

        application = application_collection.find_one(
            {
                "_id": ObjectId(application_id)
            }
        )

        if not application:

            return {
                "success": False,
                "message": "Application Not Found"
            }

        resume_path = application.get("resume", "")

        if resume:

            if resume_path:
                delete_file(resume_path)

            new_resume = save_file(resume, "resumes")

            if new_resume is None:

                return {
                    "success": False,
                    "message": "Resume upload failed"
                }

            resume_path = new_resume

        update_data = {

            "name": name,
            "email": email,
            "phone": phone,
            "course": course,
            "qualification": qualification,
            "experience": experience,
            "address": address,
            "message": message,
            "status": status,
            "resume": resume_path,

            "updatedAt": datetime.utcnow()

        }

        application_collection.update_one(

            {
                "_id": ObjectId(application_id)
            },

            {
                "$set": update_data
            }

        )

        updated = application_collection.find_one(
            {
                "_id": ObjectId(application_id)
            }
        )

        updated["_id"] = str(updated["_id"])

        return {

            "success": True,
            "message": "Application Updated Successfully",
            "application": updated

        }

    except Exception as e:

        return {

            "success": False,
            "message": str(e)

        }


# ==========================================
# Delete Application
# ==========================================

def delete_application(application_id):

    try:

        if not ObjectId.is_valid(application_id):

            return {

                "success": False,
                "message": "Invalid Application ID"

            }

        application = application_collection.find_one(
            {
                "_id": ObjectId(application_id)
            }
        )

        if not application:

            return {

                "success": False,
                "message": "Application Not Found"

            }

        if application.get("resume"):
            delete_file(application["resume"])

        application_collection.delete_one(
            {
                "_id": ObjectId(application_id)
            }
        )

        return {

            "success": True,
            "message": "Application Deleted Successfully"

        }

    except Exception as e:

        return {

            "success": False,
            "message": str(e)

        }


# ==========================================
# Application Statistics
# ==========================================

def get_application_statistics():

    try:

        total = application_collection.count_documents({})
        pending = application_collection.count_documents(
            {"status": "Pending"}
        )
        approved = application_collection.count_documents(
            {"status": "Approved"}
        )
        rejected = application_collection.count_documents(
            {"status": "Rejected"}
        )

        return {

            "success": True,

            "statistics": {

                "totalApplications": total,
                "pendingApplications": pending,
                "approvedApplications": approved,
                "rejectedApplications": rejected

            }

        }

    except Exception as e:

        return {

            "success": False,
            "message": str(e)

        }