from pydantic import BaseModel


# ==========================================
# Update Student Profile Schema
# ==========================================

class UpdateProfile(BaseModel):

    name: str
    phone: str
    course: str

    address: str
    city: str
    state: str
    country: str