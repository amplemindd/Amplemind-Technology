from pydantic import BaseModel
from typing import Optional


class SeminarSchema(BaseModel):
    hero_line_1: str = "You Have a Degree."
    hero_line_2: str = "But Do You Have"
    hero_line_3: str = "a Career Roadmap?"

    registration_fee: float = 99
    registration_button: str = "REGISTER NOW"

    speaker_label: str = "WEBINAR SPEAKER"
    speaker_heading: str = "Meet Our Founder & CEO"
    speaker_name: str = "Er. Sunny Mate"
    speaker_designation: str = "Founder & CEO"
    speaker_description: str = ""

    seminar_date: str = "10th October"
    seminar_time: str = "12:00 PM – 2:00 PM"

    status: str = "active"


class SeminarUpdateSchema(BaseModel):
    hero_line_1: Optional[str] = None
    hero_line_2: Optional[str] = None
    hero_line_3: Optional[str] = None

    registration_fee: Optional[float] = None
    registration_button: Optional[str] = None

    speaker_label: Optional[str] = None
    speaker_heading: Optional[str] = None
    speaker_name: Optional[str] = None
    speaker_designation: Optional[str] = None
    speaker_description: Optional[str] = None

    seminar_date: Optional[str] = None
    seminar_time: Optional[str] = None

    status: Optional[str] = None
