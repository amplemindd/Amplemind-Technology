from app.models.admin import admin_collection

from app.utils.password import verify_password, hash_password
from app.utils.jwt_handler import generate_token

from app.schemas.admin_schema import ChangePasswordSchema


# ==========================================
# Admin Login
# ==========================================

def admin_login(admin):

    print("\n==============================")
    print("🔥 ADMIN LOGIN REQUEST")
    print("==============================")

    try:

        print("📧 Email :", admin.email)

        print("📂 Collection Name :", admin_collection.name)

        admins = list(admin_collection.find())

        print("👥 Total Admins :", len(admins))

        for item in admins:
            print(item)

        existing_admin = admin_collection.find_one({
            "email": admin.email.lower()
        })

        print("👤 Admin :", existing_admin)

        if not existing_admin:
            return {
                "success": False,
                "message": "Invalid Email or Password"
            }

        if existing_admin.get("status") != "Active":
            return {
                "success": False,
                "message": "Admin account is inactive."
            }

        is_match = verify_password(
            admin.password,
            existing_admin["password"]
        )

        if not is_match:
            return {
                "success": False,
                "message": "Invalid Email or Password"
            }

        token = generate_token(
            str(existing_admin["_id"]),
            role="admin"
        )

        existing_admin["_id"] = str(existing_admin["_id"])

        del existing_admin["password"]

        return {
            "success": True,
            "message": "Login Successful",
            "token": token,
            "admin": existing_admin
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Get Admin Profile
# ==========================================

def get_admin_profile():

    try:

        admin = admin_collection.find_one()

        if not admin:

            return {
                "success": False,
                "message": "Admin not found."
            }

        admin["_id"] = str(admin["_id"])

        if "password" in admin:
            del admin["password"]

        return {
            "success": True,
            "admin": admin
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Change Password
# ==========================================

def change_admin_password(data: ChangePasswordSchema):

    try:

        admin = admin_collection.find_one()

        if not admin:

            return {
                "success": False,
                "message": "Admin not found."
            }

        # Current Password Check

        if not verify_password(
            data.currentPassword,
            admin["password"]
        ):

            return {
                "success": False,
                "message": "Current password is incorrect."
            }

        # Confirm Password Check

        if data.newPassword != data.confirmPassword:

            return {
                "success": False,
                "message": "New password and Confirm password do not match."
            }

        # Same Password Check

        if verify_password(
            data.newPassword,
            admin["password"]
        ):

            return {
                "success": False,
                "message": "New password cannot be the same as the current password."
            }

        # Hash Password

        new_hash = hash_password(
            data.newPassword
        )

        admin_collection.update_one(
            {
                "_id": admin["_id"]
            },
            {
                "$set": {
                    "password": new_hash
                }
            }
        )

        return {
            "success": True,
            "message": "Password changed successfully."
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }