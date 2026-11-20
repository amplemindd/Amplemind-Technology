import os
import shutil
import uuid

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form
)

from app.schemas.blog_schema import BlogSchema

from app.controllers.blog_controller import (
    get_all_blogs,
    add_blog,
    update_blog,
    delete_blog
)

router = APIRouter(
    prefix="/api/blogs",
    tags=["Blogs"]
)

# ==========================================
# Upload Folder
# ==========================================

UPLOAD_FOLDER = "app/uploads/blogs"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


# ==========================================
# Get All Blogs
# ==========================================

@router.get("/")
def get_blogs():

    return get_all_blogs()


# ==========================================
# Add Blog
# ==========================================

@router.post("/")
def create_blog(

    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),

    author: str = Form("Admin"),
    company: str = Form(""),
    package: str = Form(""),
    studentName: str = Form(""),
    status: str = Form("Published"),

    image: UploadFile = File(...)
):

    extension = image.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{extension}"

    filepath = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(
            image.file,
            buffer
        )

    image_url = (
        f"https://amplemindtechnologies.com/uploads/blogs/{filename}"
    )

    blog = BlogSchema(
        title=title,
        description=description,
        category=category,
        author=author,
        company=company,
        package=package,
        studentName=studentName,
        status=status
    )

    return add_blog(
        blog,
        image_url
    )


# ==========================================
# Update Blog
# ==========================================

@router.put("/{blog_id}")
def edit_blog(

    blog_id: str,

    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),

    author: str = Form("Admin"),
    company: str = Form(""),
    package: str = Form(""),
    studentName: str = Form(""),
    status: str = Form("Published"),

    image: UploadFile = File(None)

):

    image_url = None

    if image:

        extension = image.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{extension}"

        filepath = os.path.join(
            UPLOAD_FOLDER,
            filename
        )

        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(
                image.file,
                buffer
            )

        image_url = (
            f"https://amplemindtechnologies.com/uploads/blogs/{filename}"
        )

    blog = BlogSchema(
        title=title,
        description=description,
        category=category,
        author=author,
        company=company,
        package=package,
        studentName=studentName,
        status=status
    )

    return update_blog(
        blog_id,
        blog,
        image_url
    )


# ==========================================
# Delete Blog
# ==========================================

@router.delete("/{blog_id}")
def remove_blog(
    blog_id: str
):

    return delete_blog(
        blog_id
    )