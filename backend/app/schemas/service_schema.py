from pydantic import BaseModel


# ==========================================
# Add Service Schema
# ==========================================

class ServiceSchema(BaseModel):

    name: str
    category: str
    status: str = "Active"