from bson import ObjectId

from app.models.result import result_collection
from app.models.student import student_collection


# ==========================================
# Calculate Grade
# ==========================================

def calculate_grade(percentage):

    if percentage >= 90:
        return "A+"

    elif percentage >= 80:
        return "A"

    elif percentage >= 70:
        return "B+"

    elif percentage >= 60:
        return "B"

    elif percentage >= 50:
        return "C"

    elif percentage >= 40:
        return "D"

    return "F"


# ==========================================
# Get All Results (Admin)
# ==========================================

def get_all_results():

    try:

        results = list(

            result_collection.find().sort(

                "examDate",

                -1

            )

        )

        for result in results:

            result["_id"] = str(result["_id"])

        return {

            "success": True,

            "results": results

        }

    except Exception as e:

        return {

            "success": False,

            "message": str(e)

        }


# ==========================================
# Get Students By Course
# ==========================================

def get_students_by_course(course):

    try:

        students = list(

            student_collection.find(

                {

                    "course": course

                },

                {

                    "password": 0,

                    "resetPasswordToken": 0,

                    "resetPasswordExpire": 0

                }

            ).sort(

                "rollNumber",

                1

            )

        )

        for student in students:

            student["_id"] = str(student["_id"])

        return {

            "success": True,

            "students": students

        }

    except Exception as e:

        return {

            "success": False,

            "message": str(e)

        }
    # ==========================================
# Get Student Results
# ==========================================

def get_student_results(email):

    try:

        results = list(

            result_collection.find(

                {

                    "email": email

                }

            ).sort(

                "examDate",

                -1

            )

        )

        for result in results:

            result["_id"] = str(result["_id"])

        return {

            "success": True,

            "results": results

        }

    except Exception as e:

        return {

            "success": False,

            "message": str(e)

        }


# ==========================================
# Get Results By Exam
# ==========================================

def get_exam_results(exam_id):

    try:

        results = list(

            result_collection.find(

                {

                    "examId": exam_id

                }

            ).sort(

                "rollNumber",

                1

            )

        )

        for result in results:

            result["_id"] = str(result["_id"])

        return {

            "success": True,

            "results": results

        }

    except Exception as e:

        return {

            "success": False,

            "message": str(e)

        }
    # ==========================================
# Add Single Result
# ==========================================

def add_result(result):

    try:

        existing = result_collection.find_one(

            {

                "studentId": result.studentId,

                "examId": result.examId

            }

        )

        if existing:

            return {

                "success": False,

                "message": "Result Already Exists"

            }

        if result.isAbsent:

            obtained_marks = 0

            percentage = 0

            grade = "Absent"

        else:

            obtained_marks = result.obtainedMarks

            if result.totalMarks > 0:

                percentage = round(

                    (obtained_marks / result.totalMarks) * 100,

                    2

                )

            else:

                percentage = 0

            grade = calculate_grade(

                percentage

            )

        result_data = {

            "studentId": result.studentId,

            "rollNumber": result.rollNumber,

            "studentName": result.studentName,

            "email": result.email,

            "course": result.course,

            "batch": result.batch,

            "examId": result.examId,

            "examName": result.examName,

            "examType": result.examType,

            "subject": result.subject,

            "examDate": result.examDate,

            "totalMarks": result.totalMarks,

            "obtainedMarks": obtained_marks,

            "percentage": percentage,

            "grade": grade,

            "remarks": result.remarks,

            "isAbsent": result.isAbsent,

            "createdAt": result.createdAt

        }

        inserted = result_collection.insert_one(

            result_data

        )

        new_result = result_collection.find_one(

            {

                "_id": inserted.inserted_id

            }

        )

        new_result["_id"] = str(

            new_result["_id"]

        )

        return {

            "success": True,

            "message": "Result Added Successfully",

            "result": new_result

        }

    except Exception as e:

        return {

            "success": False,

            "message": str(e)

        }
    # ==========================================
# Bulk Save Results
# ==========================================

def bulk_save_results(data):

    try:

        results = data.get("results", [])

        if len(results) == 0:

            return {

                "success": False,

                "message": "No Results Found"

            }

        for item in results:

            if item.get("isAbsent"):

                obtained_marks = 0

                percentage = 0

                grade = "Absent"

            else:

                obtained_marks = float(

                    item.get("obtainedMarks", 0)

                )

                total_marks = float(

                    item.get("totalMarks", 0)

                )

                if total_marks > 0:

                    percentage = round(

                        (obtained_marks / total_marks) * 100,

                        2

                    )

                else:

                    percentage = 0

                grade = calculate_grade(

                    percentage

                )

            result_collection.update_one(

                {

                    "studentId": item["studentId"],

                    "examId": item["examId"]

                },

                {

                    "$set": {

                        "rollNumber": item["rollNumber"],

                        "studentName": item["studentName"],

                        "email": item["email"],

                        "course": item["course"],

                        "batch": item["batch"],

                        "examName": item["examName"],

                        "examType": item["examType"],

                        "subject": item["subject"],

                        "examDate": item["examDate"],

                        "totalMarks": item["totalMarks"],

                        "obtainedMarks": obtained_marks,

                        "percentage": percentage,

                        "grade": grade,

                        "remarks": item.get("remarks", ""),

                        "isAbsent": item.get("isAbsent", False)

                    }

                },

                upsert=True

            )

        return {

            "success": True,

            "message": "Results Saved Successfully"

        }

    except Exception as e:

        return {

            "success": False,

            "message": str(e)

        }

    # ==========================================
# Update Result
# ==========================================

def update_result(result_id, result):

    try:

        if not ObjectId.is_valid(result_id):

            return {

                "success": False,

                "message": "Invalid Result ID"

            }

        if result.isAbsent:

            obtained_marks = 0

            percentage = 0

            grade = "Absent"

        else:

            obtained_marks = result.obtainedMarks

            if result.totalMarks > 0:

                percentage = round(

                    (obtained_marks / result.totalMarks) * 100,

                    2

                )

            else:

                percentage = 0

            grade = calculate_grade(

                percentage

            )

        updated = result_collection.update_one(

            {

                "_id": ObjectId(result_id)

            },

            {

                "$set": {

                    "studentId": result.studentId,

                    "rollNumber": result.rollNumber,

                    "studentName": result.studentName,

                    "email": result.email,

                    "course": result.course,

                    "batch": result.batch,

                    "examId": result.examId,

                    "examName": result.examName,

                    "examType": result.examType,

                    "subject": result.subject,

                    "examDate": result.examDate,

                    "totalMarks": result.totalMarks,

                    "obtainedMarks": obtained_marks,

                    "percentage": percentage,

                    "grade": grade,

                    "remarks": result.remarks,

                    "isAbsent": result.isAbsent

                }

            }

        )

        if updated.matched_count == 0:

            return {

                "success": False,

                "message": "Result Not Found"

            }

        return {

            "success": True,

            "message": "Result Updated Successfully"

        }

    except Exception as e:

        return {

            "success": False,

            "message": str(e)

        }
    # ==========================================
# Delete Result
# ==========================================

def delete_result(result_id):

    try:

        if not ObjectId.is_valid(result_id):

            return {

                "success": False,

                "message": "Invalid Result ID"

            }

        deleted = result_collection.delete_one(

            {

                "_id": ObjectId(result_id)

            }

        )

        if deleted.deleted_count == 0:

            return {

                "success": False,

                "message": "Result Not Found"

            }

        return {

            "success": True,

            "message": "Result Deleted Successfully"

        }

    except Exception as e:

        return {

            "success": False,

            "message": str(e)

        }
    