from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SettingsSchema(BaseModel):

    # ==========================================
    # Company Information
    # ==========================================

    companyName: Optional[str] = ""
    websiteName: Optional[str] = ""
    email: Optional[str] = ""
    phone: Optional[str] = ""
    address: Optional[str] = ""

    # ==========================================
    # Branding
    # ==========================================

    logo: Optional[str] = ""
    favicon: Optional[str] = ""

    # ==========================================
    # Theme
    # ==========================================

    primaryColor: Optional[str] = "#2563eb"
    secondaryColor: Optional[str] = "#4f46e5"

    # ==========================================
    # Social Media
    # ==========================================

    facebook: Optional[str] = ""
    instagram: Optional[str] = ""
    linkedin: Optional[str] = ""
    youtube: Optional[str] = ""
    twitter: Optional[str] = ""

    # ==========================================
    # Email (SMTP) Settings
    # ==========================================

    smtpHost: Optional[str] = "smtp.gmail.com"
    smtpPort: Optional[int] = 587

    senderName: Optional[str] = "AmpleMind Technologies"

    senderEmail: Optional[str] = ""

    appPassword: Optional[str] = ""

    emailEnabled: Optional[bool] = False

    # ==========================================
    # OTP Settings
    # ==========================================

    otpLength: Optional[int] = 6

    otpExpiryMinutes: Optional[int] = 5

    sendWelcomeEmail: Optional[bool] = True

    sendForgotPasswordOTP: Optional[bool] = True

    sendCertificateEmail: Optional[bool] = True

    # ==========================================
    # Timestamp
    # ==========================================

    updatedAt: Optional[datetime] = None

    class Config:
        from_attributes = True