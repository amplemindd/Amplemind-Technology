from jose import jwt
from datetime import datetime, timedelta

from app.config.settings import settings


def generate_token(student_id: str, role: str = "student"):

    payload = {
        "id": student_id,
        "role": role,
        "exp": datetime.utcnow() + timedelta(days=7)
    }

    token = jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

    return token