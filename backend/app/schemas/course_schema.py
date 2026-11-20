from typing import Optional

from pydantic import BaseModel


class CourseSchema(BaseModel):

    title: str

    category: str

    instructor: str

    shortDescription: Optional[str] = ""

    description: Optional[str] = ""

    duration: Optional[str] = ""

    level: Optional[str] = ""

    language: Optional[str] = ""

    price: Optional[float] = 0

    discountPrice: Optional[float] = 0

    status: Optional[str] = "Active"

    thumbnail: Optional[str] = ""

    totalStudents: Optional[int] = 0

    rating: Optional[float] = 0