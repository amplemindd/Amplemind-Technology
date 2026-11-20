from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form
)

from app.controllers.course_controller import (
    get_all_courses,
    get_course,
    create_course,
    update_course,
    delete_course,
    get_course_statistics
)

router = APIRouter(
    prefix="/api/courses",
    tags=["Courses"]
)


# ==========================================
# Get All Courses
# ==========================================

@router.get("/")
def get_courses():

    return get_all_courses()


# ==========================================
# Course Statistics
# ==========================================

@router.get("/statistics")
def statistics():

    return get_course_statistics()


# ==========================================
# Get Single Course
# ==========================================

@router.get("/{course_id}")
def single_course(course_id: str):

    return get_course(course_id)


# ==========================================
# Create Course
# ==========================================

@router.post("/")
async def add_course(

    title: str = Form(...),
    category: str = Form(...),
    instructor: str = Form(...),

    shortDescription: str = Form(""),
    description: str = Form(""),
    duration: str = Form(""),
    level: str = Form(""),
    language: str = Form(""),

    price: float = Form(0),
    discountPrice: float = Form(0),

    status: str = Form("Active"),

    thumbnail: UploadFile = File(None)

):

    return await create_course(
        title,
        category,
        instructor,
        shortDescription,
        description,
        duration,
        level,
        language,
        price,
        discountPrice,
        status,
        thumbnail
    )


# ==========================================
# Update Course
# ==========================================

@router.put("/{course_id}")
async def edit_course(

    course_id: str,

    title: str = Form(...),
    category: str = Form(...),
    instructor: str = Form(...),

    shortDescription: str = Form(""),
    description: str = Form(""),
    duration: str = Form(""),
    level: str = Form(""),
    language: str = Form(""),

    price: float = Form(0),
    discountPrice: float = Form(0),

    status: str = Form("Active"),

    thumbnail: UploadFile = File(None)

):

    return await update_course(

        course_id,

        title,
        category,
        instructor,

        shortDescription,
        description,

        duration,
        level,
        language,

        price,
        discountPrice,

        status,

        thumbnail

    )


# ==========================================
# Delete Course
# ==========================================

@router.delete("/{course_id}")
def remove_course(course_id: str):

    return delete_course(course_id)