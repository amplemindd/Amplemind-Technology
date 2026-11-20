from fastapi import HTTPException
from app.config.database import db
from app.schemas.certificate_schema import CertificateCreate
from datetime import datetime

def create_certificate(data: CertificateCreate):
    try:
        certificate = {
            "student_id": data.student_id,
            "student_name": data.student_name,
            "course": data.course,
            "certificate_name": data.certificate_name,
            "completion_date": data.completion_date,
            "certificate_id": data.certificate_id,
            "certificate_url": data.certificate_url,
            "status": "Active",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }

        result = db["certificates"].insert_one(certificate)

        return {
            "success": True,
            "message": "Certificate created successfully",
            "certificate_id": str(result.inserted_id)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
