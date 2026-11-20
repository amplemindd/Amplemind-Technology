from pydantic import BaseModel, EmailStr
from typing import Optional


# ==========================================
# Update Profile Schema
# ==========================================

class UpdateProfile(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    profileImage: Optional[str] = None


# ==========================================
# Change Password Schema
# ==========================================

class ChangePassword(BaseModel):
    currentPassword: str
    newPassword: str


# ==========================================
# Student Response Schema
# ==========================================

class StudentResponse(BaseModel):
    success: bool
    message: str


# ==========================================
# Notification Schema
# ==========================================

class Notification(BaseModel):
    id: int
    title: str
    message: str
    isRead: bool


# ==========================================
# Course Schema
# ==========================================

class Course(BaseModel):
    id: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    instructor: Optional[str] = None
    duration: Optional[str] = None
    price: Optional[float] = None


# ==========================================
# Payment Schema
# ==========================================

class Payment(BaseModel):
    id: Optional[str] = None
    amount: Optional[float] = None
    paymentStatus: Optional[str] = None
    paymentMethod: Optional[str] = None
    createdAt: Optional[str] = None


# ==========================================
# Certificate Schema
# ==========================================

class Certificate(BaseModel):
    id: Optional[str] = None
    certificateName: Optional[str] = None
    courseName: Optional[str] = None
    issueDate: Optional[str] = None


# ==========================================
# Test Result Schema
# ==========================================

class TestResult(BaseModel):
    id: Optional[str] = None
    testName: Optional[str] = None
    score: Optional[float] = None
    totalMarks: Optional[float] = None
    createdAt: Optional[str] = None