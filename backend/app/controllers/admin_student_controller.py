import os
import shutil
import time

from bson import ObjectId
from fastapi import UploadFile

from app.models.student import student_collection


def get_all_students():

    try:

        students = list(
            student_collection.find().sort("createdAt", -1)
        )

        for student in students:

            student["_id"] = str(student["_id"])

            student.pop("password", None)
            student.pop("resetPasswordToken", None)
            student.pop("resetPasswordExpire", None)
            student.pop("__v", None)

        return {
            "success": True,
            "message": "Students fetched successfully.",
            "students": students
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


def get_student(student_id):

    try:

        if not ObjectId.is_valid(student_id):

            return {
                "success": False,
                "message": "Invalid Student ID."
            }

        student = student_collection.find_one(
            {
                "_id": ObjectId(student_id)
            }
        )

        if not student:

            return {
                "success": False,
                "message": "Student not found."
            }

        student["_id"] = str(student["_id"])

        student.pop("password", None)
        student.pop("resetPasswordToken", None)
        student.pop("resetPasswordExpire", None)
        student.pop("__v", None)

        return {
            "success": True,
            "student": student
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


async def update_student(
    student_id,
    data,
    profileImage: UploadFile = None
):

    try:

        if not ObjectId.is_valid(student_id):

            return {
                "success": False,
                "message": "Invalid Student ID."
            }

        student = student_collection.find_one(
            {
                "_id": ObjectId(student_id)
            }
        )

        if not student:

            return {
                "success": False,
                "message": "Student not found."
            }

        update_data = {}

        fields = [
            "name",
            "email",
            "phone",
            "studentId",
            "course",
            "status",
            "address",
            "city",
            "state",
            "country",
            "gender",
            "qualification",
            "college",
            "batch",
            "rollNumber",
            "paymentStatus",
            "paidAmount",
            "dueAmount",
            "totalFees",
            "certificateStatus"
        ]

        for field in fields:

            if data.get(field) is not None:
                update_data[field] = data[field]

        if profileImage is not None:

            upload_dir = "uploads/students"

            os.makedirs(upload_dir, exist_ok=True)

            if student.get("profileImage"):

                old_image = student["profileImage"].lstrip("/")

                if os.path.exists(old_image):

                    try:
                        os.remove(old_image)
                    except Exception:
                        pass

            extension = os.path.splitext(
                profileImage.filename
            )[1]

            filename = (
                f"{int(time.time() * 1000)}{extension}"
            )

            filepath = os.path.join(
                upload_dir,
                filename
            )

            with open(filepath, "wb") as buffer:

                shutil.copyfileobj(
                    profileImage.file,
                    buffer
                )

            update_data["profileImage"] = (
                f"/uploads/students/{filename}"
            )

        print("\n==========================")
        print("UPDATE REQUEST RECEIVED")
        print("==========================")
        print("Student ID :", student_id)
        print("Update Data :", update_data)
        print("==========================")

        result = student_collection.update_one(
            {
                "_id": ObjectId(student_id)
            },
            {
                "$set": update_data
            }
        )

        print("Matched :", result.matched_count)
        print("Modified :", result.modified_count)

        updated_student = student_collection.find_one(
            {
                "_id": ObjectId(student_id)
            }
        )

        if updated_student:

            updated_student["_id"] = str(
                updated_student["_id"]
            )

            updated_student.pop("password", None)

        print("\nUPDATED STUDENT")
        print(updated_student)
        print("==========================")

        return {
            "success": True,
            "message": "Student updated successfully.",
            "student": updated_student
        }

    except Exception as e:

        print("\nUPDATE ERROR")
        print(str(e))
        print("==========================")

        return {
            "success": False,
            "message": str(e)
        }
def delete_student(student_id):

    try:

        if not ObjectId.is_valid(student_id):

            return {
                "success": False,
                "message": "Invalid Student ID."
            }

        student = student_collection.find_one(
            {
                "_id": ObjectId(student_id)
            }
        )

        if not student:

            return {
                "success": False,
                "message": "Student not found."
            }

        # Delete Profile Image
        if student.get("profileImage"):

            old_image = student["profileImage"].lstrip("/")

            if os.path.exists(old_image):

                try:
                    os.remove(old_image)
                except Exception as e:
                    print("Image Delete Error :", e)

        result = student_collection.delete_one(
            {
                "_id": ObjectId(student_id)
            }
        )

        print("\n==========================")
        print("DELETE REQUEST")
        print("==========================")
        print("Student ID :", student_id)
        print("Deleted Count :", result.deleted_count)
        print("==========================\n")

        return {
            "success": True,
            "message": "Student deleted successfully."
        }

    except Exception as e:

        print("\nDELETE ERROR")
        print(str(e))
        print("==========================\n")

        return {
            "success": False,
            "message": str(e)
        }