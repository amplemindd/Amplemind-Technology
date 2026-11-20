from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

from app.config.settings import settings
from app.models.student import student_collection
from app.models.admin import admin_collection


# ============================================================
# BEARER AUTHENTICATION
# ============================================================

security = HTTPBearer()


# ============================================================
# GET CURRENT STUDENT
# ============================================================

def get_current_student(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):

    try:

        # ----------------------------------------------------
        # Get JWT token
        # ----------------------------------------------------

        token = credentials.credentials

        # ----------------------------------------------------
        # Decode JWT
        # ----------------------------------------------------

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        student_id = payload.get("id")

        if not student_id:

            raise HTTPException(
                status_code=401,
                detail="Invalid Token"
            )

        # ----------------------------------------------------
        # IMPORTANT:
        #
        # Production database is MySQL.
        #
        # Do NOT use MongoDB ObjectId here.
        #
        # MySQL compatibility layer maps:
        #
        # Mongo-style "_id"
        #        ↓
        # MySQL "id"
        #
        # Therefore student_id can be used directly.
        # ----------------------------------------------------

        student = student_collection.find_one({
            "_id": str(student_id)
        })

        if student is None:

            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        # ----------------------------------------------------
        # Convert ID to string
        # ----------------------------------------------------

        if "_id" in student:
            student["_id"] = str(student["_id"])

        # ----------------------------------------------------
        # Never send password
        # ----------------------------------------------------

        if "password" in student:
            del student["password"]

        return student

    except HTTPException:
        raise

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid or Expired Token"
        )

    except Exception as e:

        print("GET CURRENT STUDENT ERROR:", e)

        raise HTTPException(
            status_code=401,
            detail="Authentication failed"
        )

# ============================================================
# GET CURRENT ADMIN
# ============================================================

def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):

    try:

        token = credentials.credentials

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        admin_id = payload.get("id")
        role = payload.get("role")

        if not admin_id or role != "admin":
            raise HTTPException(
                status_code=403,
                detail="Admin access required"
            )

        admin = admin_collection.find_one({
            "_id": str(admin_id)
        })

        if admin is None:
            raise HTTPException(
                status_code=404,
                detail="Admin not found"
            )

        if admin.get("status") != "Active":
            raise HTTPException(
                status_code=403,
                detail="Admin account is inactive"
            )

        if "password" in admin:
            del admin["password"]

        if "_id" in admin:
            admin["_id"] = str(admin["_id"])

        return admin

    except HTTPException:
        raise

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid or Expired Token"
        )

    except Exception as e:

        print("GET CURRENT ADMIN ERROR:", e)

        raise HTTPException(
            status_code=401,
            detail="Authentication failed"
        )
