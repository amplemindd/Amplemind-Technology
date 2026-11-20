from fastapi import APIRouter, Query

from app.schemas.payment_schema import PaymentSchema

from app.controllers.payment_controller import (
    get_all_payments,
    get_student_payments,
    add_payment,
    update_payment,
    delete_payment
)

router = APIRouter(
    prefix="/api/payments",
    tags=["Payments"]
)


# ==========================================
# Get All Payments (Admin)
# ==========================================

@router.get("/")
def all_payments():

    return get_all_payments()


# ==========================================
# Get Student Payments
# ==========================================

@router.get("/my-payments")
def my_payments(

    email: str = Query(...)

):

    return get_student_payments(email)


# ==========================================
# Add Payment
# ==========================================

@router.post("/")
def create_payment(

    payment: PaymentSchema

):

    return add_payment(payment)


# ==========================================
# Update Payment
# ==========================================

@router.put("/{payment_id}")
def edit_payment(

    payment_id: str,
    payment: PaymentSchema

):

    return update_payment(
        payment_id,
        payment
    )


# ==========================================
# Delete Payment
# ==========================================

@router.delete("/{payment_id}")
def remove_payment(

    payment_id: str

):

    return delete_payment(payment_id)