from bson import ObjectId

from app.models.blog import blog_collection


# ==========================================
# Production Upload URL Helper
# ==========================================

PRODUCTION_API_URL = "https://amplemindtechnologies.com/api"


def fix_image_url(image_url):
    """
    Converts old/local upload URLs into production API upload URLs.

    Examples:
    http://127.0.0.1:5000/uploads/blogs/image.jpg
        ->
    https://amplemindtechnologies.com/api/uploads/blogs/image.jpg

    http://localhost:5000/uploads/blogs/image.jpg
        ->
    https://amplemindtechnologies.com/api/uploads/blogs/image.jpg

    /uploads/blogs/image.jpg
        ->
    https://amplemindtechnologies.com/api/uploads/blogs/image.jpg
    """

    if not image_url:
        return image_url

    image_url = str(image_url).strip()

    # Old localhost URLs
    if image_url.startswith("http://127.0.0.1:5000"):
        image_url = image_url.replace(
            "http://127.0.0.1:5000",
            PRODUCTION_API_URL,
            1
        )

    elif image_url.startswith("https://127.0.0.1:5000"):
        image_url = image_url.replace(
            "https://127.0.0.1:5000",
            PRODUCTION_API_URL,
            1
        )

    elif image_url.startswith("http://localhost:5000"):
        image_url = image_url.replace(
            "http://localhost:5000",
            PRODUCTION_API_URL,
            1
        )

    elif image_url.startswith("https://localhost:5000"):
        image_url = image_url.replace(
            "https://localhost:5000",
            PRODUCTION_API_URL,
            1
        )

    # Relative upload URLs
    elif image_url.startswith("/uploads/"):
        image_url = PRODUCTION_API_URL + image_url

    # Already production API URL
    elif image_url.startswith(
        "https://amplemindtechnologies.com/api/uploads/"
    ):
        pass

    # Production domain but missing /api
    elif image_url.startswith(
        "https://amplemindtechnologies.com/uploads/"
    ):
        image_url = image_url.replace(
            "https://amplemindtechnologies.com/uploads/",
            PRODUCTION_API_URL + "/uploads/",
            1
        )

    return image_url


# ==========================================
# Convert Blog For Response
# ==========================================

def prepare_blog(blog):
    """
    Converts Mongo ObjectId to string
    and fixes image URL before sending response.
    """

    if not blog:
        return blog

    blog["_id"] = str(blog["_id"])

    if "image" in blog:
        image_url = fix_image_url(blog["image"])

        # WEBP_BLOG_OPTIMIZATION:
        # Use WebP only when the matching file exists.
        if image_url:
            from urllib.parse import urlparse, urlunparse
            import os

            parsed = urlparse(image_url)
            path = parsed.path

            if path.startswith("/api/uploads/blogs/"):
                original_name = os.path.basename(path)
                stem, ext = os.path.splitext(original_name)

                if ext.lower() in (".png", ".jpg", ".jpeg"):
                    webp_name = stem + ".webp"
                    app_dir = os.path.dirname(
                        os.path.dirname(os.path.abspath(__file__))
                    )
                    webp_file = os.path.join(
                        app_dir, "uploads", "blogs", webp_name
                    )

                    if os.path.isfile(webp_file):
                        new_path = os.path.join(
                            os.path.dirname(path), webp_name
                        )
                        image_url = urlunparse(
                            parsed._replace(path=new_path)
                        )

        blog["image"] = image_url

    return blog


# ==========================================
# Get All Blogs
# ==========================================

def get_all_blogs():
    try:

        blogs = list(
            blog_collection.find().sort("createdAt", -1)
        )

        for blog in blogs:
            prepare_blog(blog)

        return {
            "success": True,
            "message": "Blogs Fetched Successfully",
            "blogs": blogs
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Add Blog
# ==========================================

def add_blog(blog_data, image_url):

    try:

        # Always save production URL
        image_url = fix_image_url(image_url)

        data = {
            "title": blog_data.title,
            "description": blog_data.description,
            "category": blog_data.category,
            "author": blog_data.author,
            "company": blog_data.company,
            "package": blog_data.package,
            "studentName": blog_data.studentName,
            "status": blog_data.status,
            "image": image_url
        }

        result = blog_collection.insert_one(data)

        new_blog = blog_collection.find_one(
            {
                "_id": result.inserted_id
            }
        )

        prepare_blog(new_blog)

        return {
            "success": True,
            "message": "Blog Added Successfully",
            "blog": new_blog
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Update Blog
# ==========================================

def update_blog(blog_id, blog_data, image_url=None):

    try:

        blog = blog_collection.find_one(
            {
                "_id": ObjectId(blog_id)
            }
        )

        if not blog:

            return {
                "success": False,
                "message": "Blog Not Found"
            }

        update_data = {
            "title": blog_data.title,
            "description": blog_data.description,
            "category": blog_data.category,
            "author": blog_data.author,
            "company": blog_data.company,
            "package": blog_data.package,
            "studentName": blog_data.studentName,
            "status": blog_data.status,
        }

        if image_url:
            update_data["image"] = fix_image_url(image_url)

        blog_collection.update_one(
            {
                "_id": ObjectId(blog_id)
            },
            {
                "$set": update_data
            }
        )

        updated_blog = blog_collection.find_one(
            {
                "_id": ObjectId(blog_id)
            }
        )

        prepare_blog(updated_blog)

        return {
            "success": True,
            "message": "Blog Updated Successfully",
            "blog": updated_blog
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Delete Blog
# ==========================================

def delete_blog(blog_id):

    try:

        blog = blog_collection.find_one(
            {
                "_id": ObjectId(blog_id)
            }
        )

        if not blog:

            return {
                "success": False,
                "message": "Blog Not Found"
            }

        blog_collection.delete_one(
            {
                "_id": ObjectId(blog_id)
            }
        )

        return {
            "success": True,
            "message": "Blog Deleted Successfully"
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }