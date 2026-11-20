from bson import ObjectId
from datetime import datetime

from app.models.course import course_collection
from app.utils.file_upload import save_file, delete_file


# ==========================================
# Get All Courses
# ==========================================

def get_all_courses():

    try:

        courses = list(
            course_collection.find().sort("_id", -1)
        )

        for course in courses:

            course["_id"] = str(course["_id"])

        return {

            "success": True,

            "courses": courses

        }

    except Exception as e:

        return {

            "success": False,

            "message": str(e)

        }


# ==========================================
# Get Single Course
# ==========================================

def get_course(course_id):

    try:

        if not ObjectId.is_valid(course_id):

            return {

                "success": False,

                "message": "Invalid Course ID"

            }

        course = course_collection.find_one(

            {
                "_id": ObjectId(course_id)
            }

        )

        if not course:

            return {

                "success": False,

                "message": "Course Not Found"

            }

        course["_id"] = str(course["_id"])

        return {

            "success": True,

            "course": course

        }

    except Exception as e:

        return {

            "success": False,

            "message": str(e)

        }
# ==========================================
# Create Course
# ==========================================

async def create_course(

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

):

    try:

        # ==========================
        # Duplicate Check
        # ==========================

        existing_course = course_collection.find_one(
            {
                "title": title
            }
        )

        if existing_course:

            return {

                "success": False,

                "message": "Course already exists"

            }

        # ==========================
        # Upload Thumbnail
        # ==========================

        thumbnail_path = ""

        if thumbnail:

            thumbnail_path = save_file(thumbnail)

            if thumbnail_path is None:

                return {

                    "success": False,

                    "message": "Thumbnail upload failed"

                }

        # ==========================
        # Create Course Document
        # ==========================

        course = {

            "title": title,

            "category": category,

            "instructor": instructor,

            "shortDescription":
                shortDescription,

            "description":
                description,

            "duration":
                duration,

            "level":
                level,

            "language":
                language,

            "price":
                float(price),

            "discountPrice":
                float(discountPrice),

            "status":
                status,

            "thumbnail":
                thumbnail_path,

            "totalStudents": 0,

            "rating": 0,

            "createdAt":
                datetime.utcnow(),

            "updatedAt":
                datetime.utcnow()

        }

        result = course_collection.insert_one(
            course
        )

        course["_id"] = str(
            result.inserted_id
        )

        return {

            "success": True,

            "message":
                "Course Created Successfully",

            "course": course

        }

    except Exception as e:

        return {

            "success": False,

            "message": str(e)

        }
# ==========================================
# Update Course
# ==========================================

async def update_course(

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

):

    try:

        if not ObjectId.is_valid(course_id):

            return {

                "success": False,

                "message": "Invalid Course ID"

            }

        course = course_collection.find_one(

            {
                "_id": ObjectId(course_id)
            }

        )

        if not course:

            return {

                "success": False,

                "message": "Course Not Found"

            }

        # ==========================
        # Update Thumbnail
        # ==========================

        thumbnail_path = course.get(
            "thumbnail",
            ""
        )

        if thumbnail:

            if thumbnail_path:

                delete_file(thumbnail_path)

            new_thumbnail = save_file(
                thumbnail
            )

            if new_thumbnail is None:

                return {

                    "success": False,

                    "message": "Thumbnail upload failed"

                }

            thumbnail_path = new_thumbnail

        # ==========================
        # Update Data
        # ==========================

        update_data = {

            "title": title,

            "category": category,

            "instructor": instructor,

            "shortDescription":
                shortDescription,

            "description":
                description,

            "duration":
                duration,

            "level":
                level,

            "language":
                language,

            "price":
                float(price),

            "discountPrice":
                float(discountPrice),

            "status":
                status,

            "thumbnail":
                thumbnail_path,

            "updatedAt":
                datetime.utcnow()

        }

        course_collection.update_one(

            {
                "_id": ObjectId(course_id)
            },

            {
                "$set": update_data
            }

        )

        updated_course = course_collection.find_one(

            {
                "_id": ObjectId(course_id)
            }

        )

        updated_course["_id"] = str(
            updated_course["_id"]
        )

        return {

            "success": True,

            "message":
                "Course Updated Successfully",

            "course": updated_course

        }

    except Exception as e:

        return {

            "success": False,

            "message": str(e)

        }
# ==========================================
# Delete Course
# ==========================================

def delete_course(course_id):

    try:

        if not ObjectId.is_valid(course_id):

            return {

                "success": False,

                "message": "Invalid Course ID"

            }

        course = course_collection.find_one(

            {
                "_id": ObjectId(course_id)
            }

        )

        if not course:

            return {

                "success": False,

                "message": "Course Not Found"

            }

        # ==========================
        # Delete Thumbnail
        # ==========================

        thumbnail = course.get(
            "thumbnail",
            ""
        )

        if thumbnail:

            delete_file(thumbnail)

        # ==========================
        # Delete Course
        # ==========================

        course_collection.delete_one(

            {
                "_id": ObjectId(course_id)
            }

        )

        return {

            "success": True,

            "message": "Course Deleted Successfully"

        }

    except Exception as e:

        return {

            "success": False,

            "message": str(e)

        }


# ==========================================
# Course Statistics
# ==========================================

def get_course_statistics():

    try:

        total_courses = course_collection.count_documents({})

        active_courses = course_collection.count_documents(
            {
                "status": "Active"
            }
        )

        inactive_courses = course_collection.count_documents(
            {
                "status": "Inactive"
            }
        )

        total_students = list(

            course_collection.aggregate(

                [

                    {
                        "$group": {

                            "_id": None,

                            "students": {

                                "$sum": "$totalStudents"

                            }

                        }

                    }

                ]

            )

        )

        total_revenue = list(

            course_collection.aggregate(

                [

                    {
                        "$group": {

                            "_id": None,

                            "revenue": {

                                "$sum": "$price"

                            }

                        }

                    }

                ]

            )

        )

        return {

            "success": True,

            "statistics": {

                "totalCourses": total_courses,

                "activeCourses": active_courses,

                "inactiveCourses": inactive_courses,

                "totalStudents":
                    total_students[0]["students"]
                    if total_students else 0,

                "totalRevenue":
                    total_revenue[0]["revenue"]
                    if total_revenue else 0

            }

        }

    except Exception as e:

        return {

            "success": False,

            "message": str(e)

        }