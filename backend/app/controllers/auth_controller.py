from datetime import datetime, timedelta

from app.models.student import student_collection

from app.utils.password import (
    hash_password,
    verify_password
)

from app.utils.jwt_handler import generate_token

from app.utils.email_service import (
    generate_otp,
    send_otp_email,
    send_password_changed_email
)


# ==========================================
# Generate Roll Number
# ==========================================

def generate_roll_number(course):

    prefix_map = {

        "Java Full Stack": "JFS",

        "Python Full Stack": "PFS",

        "React Development": "RD",

        "MERN Stack": "MERN",

        "Data Analytics": "DA",

        "UI / UX Design": "UI"

    }

    prefix = prefix_map.get(
        course,
        "STD"
    )

    last_student = student_collection.find_one(

        {
            "course": course
        },

        sort=[
            (
                "rollNumber",
                -1
            )
        ]

    )

    if last_student and last_student.get("rollNumber"):

        try:

            last_number = int(

                last_student["rollNumber"].replace(
                    prefix,
                    ""
                )

            )

            next_number = last_number + 1

        except:

            next_number = 1

    else:

        next_number = 1

    return f"{prefix}{next_number:03d}"


# ==========================================
# Student Register
# ==========================================

def student_register(student):

    existing_student = student_collection.find_one(

        {
            "email": student.email
        }

    )

    if existing_student:

        return {

            "success": False,

            "message": "Student already exists."

        }

    hashed_password = hash_password(
        student.password
    )

    roll_number = generate_roll_number(
        student.course
    )

    student_data = {

        "name": student.name,

        "email": student.email,

        "phone": student.phone,

        "course": student.course,

        "batch": student.course,

        "rollNumber": roll_number,

        "password": hashed_password,

        "role": "student",

        "status": "Active",

        "isVerified": False,

        "attendance": 0,

        "presentDays": 0,

        "absentDays": 0,

        "totalTests": 0,

        "completedTests": 0,

        "averageScore": 0,

        "progress": 0,

        "certificateStatus": "Not Eligible",

        "paymentStatus": "Pending",

        "paidAmount": 0,

        "dueAmount": 0,

        "totalFees": 0,

        "otp": None,

        "otpExpire": None

    }

    result = student_collection.insert_one(
        student_data
    )

    token = generate_token(
        str(result.inserted_id)
    )

    student_data["_id"] = str(
        result.inserted_id
    )

    del student_data["password"]

    return {

        "success": True,

        "message": "Registration Successful",

        "token": token,

        "student": student_data

    }
# ==========================================
# Student Login
# ==========================================

def student_login(student):

    try:

        existing_student = student_collection.find_one(

            {
                "email": student.email
            }

        )

        if not existing_student:

            return {

                "success": False,

                "message": "Invalid Email or Password"

            }

        if not verify_password(

            student.password,

            existing_student["password"]

        ):

            return {

                "success": False,

                "message": "Invalid Email or Password"

            }

        token = generate_token(

            str(existing_student["_id"])

        )

        existing_student["_id"] = str(

            existing_student["_id"]

        )

        del existing_student["password"]

        return {

            "success": True,

            "message": "Login Successful",

            "token": token,

            "student": existing_student

        }

    except Exception as e:

        print("LOGIN ERROR :", e)

        return {

            "success": False,

            "message": str(e)

        }

    # ==========================================
# Forgot Password
# ==========================================

def forgot_password(data):

    try:

        student = student_collection.find_one(

            {
                "email": data.email
            }

        )

        if not student:

            return {

                "success": False,

                "message": "No account found with this email."

            }

        # Generate OTP
        otp = generate_otp()

        expiry = datetime.utcnow() + timedelta(minutes=5)

        # Save OTP in Database
        student_collection.update_one(

            {
                "_id": student["_id"]
            },

            {
                "$set": {

                    "otp": otp,

                    "otpExpire": expiry

                }

            }

        )

        print("\n==============================")
        print("FORGOT PASSWORD REQUEST")
        print("==============================")
        print("Email :", data.email)
        print("OTP :", otp)
        print("Expiry :", expiry)
        print("==============================")

        # Send OTP Email
        email_sent = send_otp_email(

            data.email,

            otp

        )

        if not email_sent:

            return {

                "success": False,

                "message": "Unable to send OTP email."

            }

        return {

            "success": True,

            "message": "OTP sent successfully to your email."

        }

    except Exception as e:

        print("FORGOT PASSWORD ERROR :", e)

        return {

            "success": False,

            "message": str(e)

        }

    # ==========================================
# Verify OTP
# ==========================================

def verify_otp(data):

    try:

        student = student_collection.find_one(

            {
                "email": data.email
            }

        )

        if not student:

            return {

                "success": False,

                "message": "Student not found."

            }

        saved_otp = student.get("otp")

        otp_expire = student.get("otpExpire")

        if not saved_otp:

            return {

                "success": False,

                "message": "Please request a new OTP."

            }

        if saved_otp != data.otp:

            return {

                "success": False,

                "message": "Invalid OTP."

            }

        if not otp_expire:

            return {

                "success": False,

                "message": "OTP Expired."

            }

        if datetime.utcnow() > otp_expire:

            return {

                "success": False,

                "message": "OTP has expired."

            }

        print("\n==============================")
        print("OTP VERIFIED SUCCESSFULLY")
        print("==============================")
        print("Email :", data.email)
        print("OTP :", data.otp)
        print("==============================")

        return {

            "success": True,

            "message": "OTP Verified Successfully."

        }

    except Exception as e:

        print("VERIFY OTP ERROR :", e)

        return {

            "success": False,

            "message": str(e)

        }

    # ==========================================
# Reset Password
# ==========================================

def reset_password(data):

    try:

        student = student_collection.find_one(

            {
                "email": data.email
            }

        )

        if not student:

            return {

                "success": False,

                "message": "Student not found."

            }

        saved_otp = student.get("otp")

        otp_expire = student.get("otpExpire")

        if not saved_otp:

            return {

                "success": False,

                "message": "Please request a new OTP."

            }

        if saved_otp != data.otp:

            return {

                "success": False,

                "message": "Invalid OTP."

            }

        if not otp_expire:

            return {

                "success": False,

                "message": "OTP Expired."

            }

        if datetime.utcnow() > otp_expire:

            return {

                "success": False,

                "message": "OTP has expired."

            }

        hashed_password = hash_password(

            data.newPassword

        )

        student_collection.update_one(

            {
                "_id": student["_id"]
            },

            {
                "$set": {

                    "password": hashed_password

                },

                "$unset": {

                    "otp": "",

                    "otpExpire": ""

                }

            }

        )

        # ======================================
        # Send Password Changed Email
        # ======================================

        email_sent = send_password_changed_email(

            data.email

        )

        if email_sent:

            print("✅ Password Changed Email Sent")

        else:

            print("⚠ Password changed but confirmation email failed.")

        print("\n==============================")
        print("PASSWORD RESET SUCCESS")
        print("==============================")
        print("Email :", data.email)
        print("==============================")

        return {

            "success": True,

            "message": "Password Reset Successfully."

        }

    except Exception as e:

        print("RESET PASSWORD ERROR :", e)

        return {

            "success": False,

            "message": str(e)

        }