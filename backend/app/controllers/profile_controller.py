import os
from fastapi import UploadFile
from bson import ObjectId

from app.models.student import student_collection
from app.utils.file_upload import save_file


# ==========================================
# Get Student Profile
# ==========================================

def get_profile(current_student):

    try:

        student = student_collection.find_one(
            {
                "_id": ObjectId(current_student["_id"])
            }
        )

        if not student:

            return {
                "success": False,
                "message": "Student not found."
            }

        student["_id"] = str(student["_id"])

        student.pop("password", None)

        return {
            "success": True,
            "message": "Profile Fetched Successfully",
            "student": student
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Update Student Profile
# ==========================================

async def update_profile(
    current_student,
    phone,
    dob,
    gender,
    address,
    city,
    state,
    country,
    profileImage: UploadFile = None
):

    try:

        update_data = {}

        if phone:
            update_data["phone"] = phone

        if dob:
            update_data["dob"] = dob

        if gender:
            update_data["gender"] = gender

        if address:
            update_data["address"] = address

        if city:
            update_data["city"] = city

        if state:
            update_data["state"] = state

        if country:
            update_data["country"] = country

        # ==================================
        # Profile Image Upload
        # ==================================

        if profileImage and profileImage.filename:

            image_path = save_file(profileImage, "profile")

            if image_path:

                update_data["profileImage"] = image_path

                print("✅ Profile Image Saved :", image_path)

            else:

                return {
                    "success": False,
                    "message": "Failed to upload profile image."
                }

        # ==================================
        # Update Student
        # ==================================

        student_collection.update_one(

            {
                "_id": ObjectId(current_student["_id"])
            },

            {
                "$set": update_data
            }

        )

        student = student_collection.find_one(

            {
                "_id": ObjectId(current_student["_id"])
            }

        )

        if not student:

            return {

                "success": False,
                "message": "Student not found."

            }

        student["_id"] = str(student["_id"])

        student.pop("password", None)

        return {

            "success": True,
            "message": "Profile Updated Successfully",
            "student": student

        }

    except Exception as e:

        print("PROFILE UPDATE ERROR :", str(e))

        return {

            "success": False,
            "message": str(e)

        }