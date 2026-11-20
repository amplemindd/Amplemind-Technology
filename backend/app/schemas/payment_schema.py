from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class PaymentSchema(BaseModel):
    studentId: str
    studentName: str
    email: str
    course: str = ""
    batch: str = ""

    amount: float = Field(..., gt=0)

    transactionId: str = ""
    status: str = "Paid"

    paymentDate: Optional[datetime] = Field(
        default_factory=datetime.utcnow
    )

    remarks: str = ""

    class Config:
        from_attributes = True
