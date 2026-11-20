from datetime import datetime
from bson import ObjectId

from app.models.payment import payment_collection
from app.models.student import student_collection


def _serialize_payment(payment):
    if not payment:
        return payment

    if "_id" in payment:
        payment["_id"] = str(payment["_id"])

    return payment


def _get_student(student_id=None, email=None):
    student = None

    if student_id:
        try:
            student = student_collection.find_one({
                "_id": ObjectId(student_id)
            })
        except Exception:
            student = None

    if not student and email:
        student = student_collection.find_one({
            "email": email
        })

    return student


def _calculate_student_payment(student_id, email):
    """
    Calculate total payment from payments table
    and synchronize student's fee summary.
    """

    payments = []

    if student_id:
        payments = payment_collection.find({
            "studentId": student_id
        })

    # Fallback / compatibility for older records
    if not payments and email:
        payments = payment_collection.find({
            "email": email
        })

    paid_amount = 0.0

    for payment in payments:
        try:
            paid_amount += float(payment.get("amount") or 0)
        except (TypeError, ValueError):
            pass

    student = _get_student(student_id, email)

    if not student:
        return None

    total_fees = float(
        student.get("totalFees")
        or student.get("total_fees")
        or 0
    )

    due_amount = max(total_fees - paid_amount, 0)

    if paid_amount <= 0:
        payment_status = "Pending"
    elif paid_amount < total_fees:
        payment_status = "Partial"
    else:
        payment_status = "Paid"

    student_key = student.get("_id")

    if student_key:
        result = student_collection.update_one(
            {"_id": student_key},
            {
                "$set": {
                    "paidAmount": paid_amount,
                    "dueAmount": due_amount,
                    "paymentStatus": payment_status
                }
            }
        )

    return {
        "totalFees": total_fees,
        "paidAmount": paid_amount,
        "dueAmount": due_amount,
        "paymentStatus": payment_status
    }


def get_all_payments():
    payments = payment_collection.find().sort(
        "paymentDate",
        -1
    )

    payments = [
        _serialize_payment(payment)
        for payment in payments
    ]

    return {
        "success": True,
        "payments": payments
    }


def get_student_payments(email):
    payments = payment_collection.find({
        "email": email
    }).sort(
        "paymentDate",
        -1
    )

    payments = [
        _serialize_payment(payment)
        for payment in payments
    ]

    student = student_collection.find_one({
        "email": email
    })

    summary = None

    if student:
        summary = {
            "totalFees": float(
                student.get("totalFees")
                or student.get("total_fees")
                or 0
            ),
            "paidAmount": float(
                student.get("paidAmount")
                or student.get("paid_amount")
                or 0
            ),
            "dueAmount": float(
                student.get("dueAmount")
                or student.get("due_amount")
                or 0
            ),
            "paymentStatus": (
                student.get("paymentStatus")
                or student.get("payment_status")
                or "Pending"
            )
        }

    return {
        "success": True,
        "payments": payments,
        "summary": summary
    }


def add_payment(payment):
    student = _get_student(
        payment.studentId,
        payment.email
    )

    if not student:
        return {
            "success": False,
            "message": "Student not found."
        }

    payment_data = {
        "studentId": payment.studentId,
        "studentName": payment.studentName,
        "email": payment.email,
        "course": payment.course,
        "batch": payment.batch,
        "amount": float(payment.amount),
        "transactionId": payment.transactionId,
        "status": payment.status or "Paid",
        "paymentDate": payment.paymentDate or datetime.utcnow(),
        "remarks": payment.remarks or ""
    }

    result = payment_collection.insert_one(
        payment_data
    )

    payment_id = getattr(
        result,
        "inserted_id",
        None
    )

    summary = _calculate_student_payment(
        payment.studentId,
        payment.email
    )

    return {
        "success": True,
        "message": "Payment added successfully.",
        "paymentId": str(payment_id) if payment_id else None,
        "payment": payment_data,
        "summary": summary
    }


def update_payment(payment_id, payment):
    try:
        object_id = ObjectId(payment_id)
    except Exception:
        return {
            "success": False,
            "message": "Invalid payment ID."
        }

    existing = payment_collection.find_one({
        "_id": object_id
    })

    if not existing:
        return {
            "success": False,
            "message": "Payment not found."
        }

    update_data = {
        "studentId": payment.studentId,
        "studentName": payment.studentName,
        "email": payment.email,
        "course": payment.course,
        "batch": payment.batch,
        "amount": float(payment.amount),
        "transactionId": payment.transactionId,
        "status": payment.status or "Paid",
        "paymentDate": payment.paymentDate or datetime.utcnow(),
        "remarks": payment.remarks or ""
    }

    payment_collection.update_one(
        {"_id": object_id},
        {"$set": update_data}
    )

    summary = _calculate_student_payment(
        payment.studentId,
        payment.email
    )

    return {
        "success": True,
        "message": "Payment updated successfully.",
        "paymentId": payment_id,
        "payment": update_data,
        "summary": summary
    }


def delete_payment(payment_id):
    try:
        object_id = ObjectId(payment_id)
    except Exception:
        return {
            "success": False,
            "message": "Invalid payment ID."
        }

    existing = payment_collection.find_one({
        "_id": object_id
    })

    if not existing:
        return {
            "success": False,
            "message": "Payment not found."
        }

    student_id = existing.get("studentId")
    email = existing.get("email")

    payment_collection.delete_one({
        "_id": object_id
    })

    summary = _calculate_student_payment(
        student_id,
        email
    )

    return {
        "success": True,
        "message": "Payment deleted successfully.",
        "summary": summary
    }
