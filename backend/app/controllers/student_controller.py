from bson import ObjectId
from passlib.context import CryptContext

from app.models.student import student_collection
from app.models.course import course_collection
# from app.models.payment import payment_collection
from app.models.certificate import certificate_collection
# from app.models.result import result_collection
# from app.models.notification import notification_collection


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# ==========================================
# Student Profile
# ==========================================

def get_profile(student_id):

    try:

        student = student_collection.find_one(
            {
                "_id": ObjectId(student_id)
            }
        )

        if not student:

            return {
                "success": False,
                "message": "Student Not Found"
            }

        student["_id"] = str(student["_id"])

        student.pop("password", None)
        student.pop("resetPasswordToken", None)
        student.pop("resetPasswordExpire", None)

        return {
            "success": True,
            "student": student
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }
    # ==========================================
# Update Profile
# ==========================================

def update_profile(student_id, data):

    try:

        student = student_collection.find_one(
            {
                "_id": ObjectId(student_id)
            }
        )

        if not student:

            return {
                "success": False,
                "message": "Student Not Found"
            }

        update_data = {
            "name": data.name,
            "email": data.email,
            "mobile": data.mobile,
            "address": data.address
        }

        student_collection.update_one(
            {
                "_id": ObjectId(student_id)
            },
            {
                "$set": update_data
            }
        )

        updated_student = student_collection.find_one(
            {
                "_id": ObjectId(student_id)
            }
        )

        updated_student["_id"] = str(updated_student["_id"])

        updated_student.pop("password", None)
        updated_student.pop("resetPasswordToken", None)
        updated_student.pop("resetPasswordExpire", None)

        return {
            "success": True,
            "message": "Profile Updated Successfully",
            "student": updated_student
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }
    # ==========================================
# Change Password
# ==========================================

def change_password(student_id, data):

    try:

        student = student_collection.find_one(
            {
                "_id": ObjectId(student_id)
            }
        )

        if not student:

            return {
                "success": False,
                "message": "Student Not Found"
            }

        if not pwd_context.verify(
            data.currentPassword,
            student["password"]
        ):

            return {
                "success": False,
                "message": "Current Password is Incorrect"
            }

        new_password = pwd_context.hash(
            data.newPassword
        )

        student_collection.update_one(
            {
                "_id": ObjectId(student_id)
            },
            {
                "$set": {
                    "password": new_password
                }
            }
        )

        return {
            "success": True,
            "message": "Password Changed Successfully"
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }
    # ==========================================
# My Courses
# ==========================================

def get_my_courses(student_id):

    try:

        student = student_collection.find_one(
            {
                "_id": ObjectId(student_id)
            }
        )

        if not student:

            return {
                "success": False,
                "message": "Student Not Found"
            }

        course_ids = student.get("courses", [])

        courses = []

        for course_id in course_ids:

            course = course_collection.find_one(
                {
                    "_id": ObjectId(course_id)
                }
            )

            if course:

                course["_id"] = str(course["_id"])
                courses.append(course)

        return {
            "success": True,
            "courses": courses
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }
    # ==========================================
# Course Details
# ==========================================

def get_course_details(course_id):

    try:

        if not ObjectId.is_valid(course_id):

            return {
                "success": False,
                "message": "Invalid Course ID"
            }

        course = course_collection.find_one(
            {
                "_id": ObjectId(course_id)
            }
        )

        if not course:

            return {
                "success": False,
                "message": "Course Not Found"
            }

        course["_id"] = str(course["_id"])

        return {
            "success": True,
            "course": course
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }
    # ==========================================
# My Payments
# ==========================================

def get_my_payments(student_id):

    try:

        payments = list(
            payment_collection.find(
                {
                    "student_id": str(student_id)
                }
            )
        )

        for payment in payments:

            payment["_id"] = str(payment["_id"])

        return {
            "success": True,
            "payments": payments
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }
    # ==========================================
# My Certificates
# ==========================================

def get_my_certificates(student_id):

    try:

        certificates = list(
            certificate_collection.find(
                {
                    "student_id": str(student_id)
                }
            )
        )

        for certificate in certificates:

            certificate["_id"] = str(certificate["_id"])

        return {
            "success": True,
            "certificates": certificates
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }
    # ==========================================
# My Results
# ==========================================

def get_my_results(student_id):

    try:

        results = list(
            result_collection.find(
                {
                    "studentId": str(student_id)
                }
            )
        )

        for result in results:

            result["_id"] = str(result["_id"])

        return {
            "success": True,
            "results": results
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }
    # ==========================================
# Notifications
# ==========================================

def get_notifications():

    try:

        notifications = list(
            notification_collection.find().sort("_id", -1)
        )

        for notification in notifications:

            notification["_id"] = str(notification["_id"])

        return {
            "success": True,
            "notifications": notifications
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Mark Notification As Read
# ==========================================

def mark_notification_as_read(notification_id):

    try:

        if not ObjectId.is_valid(notification_id):

            return {
                "success": False,
                "message": "Invalid Notification ID"
            }

        notification = notification_collection.find_one(
            {
                "_id": ObjectId(notification_id)
            }
        )

        if not notification:

            return {
                "success": False,
                "message": "Notification Not Found"
            }

        notification_collection.update_one(
            {
                "_id": ObjectId(notification_id)
            },
            {
                "$set": {
                    "isRead": True
                }
            }
        )

        return {
            "success": True,
            "message": "Notification Marked As Read"
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }
    