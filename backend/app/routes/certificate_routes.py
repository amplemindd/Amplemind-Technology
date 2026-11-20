import os
import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form

from app.config.database import db
from app.middleware.auth import get_current_student, get_current_admin

router = APIRouter(prefix="/api", tags=["Certificates"])

UPLOAD_DIR = os.path.abspath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "uploads")
)

CERTIFICATE_DIR = os.path.join(UPLOAD_DIR, "certificates")
os.makedirs(CERTIFICATE_DIR, exist_ok=True)


@router.post("/admin/certificate/upload")
async def admin_upload_certificate(
    student_id: str = Form(...),
    student_name: str = Form(...),
    course: str = Form(""),
    roll_number: str = Form(""),
    completion_date: str = Form(""),
    certificate: UploadFile = File(...),
    current_admin=Depends(get_current_admin)
):
    try:
        allowed_types = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/webp": ".webp"
        }

        extension = allowed_types.get(certificate.content_type)

        if not extension:
            raise HTTPException(
                status_code=400,
                detail="Only JPG, PNG and WEBP certificate images are allowed."
            )

        filename = f"{uuid.uuid4().hex}{extension}"
        filepath = os.path.join(CERTIFICATE_DIR, filename)

        content = await certificate.read()

        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="Certificate image must be below 10 MB."
            )

        with open(filepath, "wb") as f:
            f.write(content)

        certificate_url = f"/api/uploads/certificates/{filename}"

        # Every upload creates a separate certificate.
        # One student can have multiple certificates.
        data = {
            "student_id": student_id,
            "student_name": student_name,
            "course": course,
            "certificate_name": "Certificate of Completion",
            "completion_date": completion_date,
            "certificate_id": f"CERT-{uuid.uuid4().hex[:10].upper()}",
            "certificate_url": certificate_url,
            "roll_number": roll_number,
            "status": "Active",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }

        result = db["certificates"].insert_one(data)
        certificate_db_id = str(result.inserted_id)

        return {
            "success": True,
            "message": "Certificate uploaded successfully",
            "certificate_id": certificate_db_id,
            "certificate_url": certificate_url
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/admin/certificates")
async def admin_get_certificates(
    current_admin=Depends(get_current_admin)
):
    try:

        certificates = list(
            db["certificates"].find({})
        )

        for certificate in certificates:
            certificate["_id"] = str(certificate["_id"])

        return {
            "success": True,
            "count": len(certificates),
            "certificates": certificates
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/student/certificates")
async def get_my_certificates(
    current_student=Depends(get_current_student)
):
    try:
        student_id = current_student["_id"]

        certificates = list(
            db["certificates"].find({
                "student_id": student_id
            })
        )

        for certificate in certificates:
            certificate["_id"] = str(certificate["_id"])

        return {
            "success": True,
            "count": len(certificates),
            "certificates": certificates
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/student/certificate/{certificate_id}")
async def get_single_certificate(
    certificate_id: str,
    current_student=Depends(get_current_student)
):
    try:
        certificate = db["certificates"].find_one({
            "_id": certificate_id,
            "student_id": current_student["_id"]
        })

        if not certificate:
            raise HTTPException(
                status_code=404,
                detail="Certificate not found"
            )

        certificate["_id"] = str(certificate["_id"])

        return {
            "success": True,
            "certificate": certificate
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
