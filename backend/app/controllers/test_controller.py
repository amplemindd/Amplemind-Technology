from bson import ObjectId

from app.models.test import test_collection


# ==========================================
# Get All Tests
# ==========================================

def get_all_tests():

    try:

        tests = list(
            test_collection.find().sort(
                "examDate",
                -1
            )
        )

        for test in tests:

            test["_id"] = str(test["_id"])

        return {
            "success": True,
            "tests": tests
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Get Single Test
# ==========================================

def get_test(test_id):

    try:

        if not ObjectId.is_valid(test_id):

            return {
                "success": False,
                "message": "Invalid Test ID"
            }

        test = test_collection.find_one(
            {
                "_id": ObjectId(test_id)
            }
        )

        if not test:

            return {
                "success": False,
                "message": "Exam Not Found"
            }

        test["_id"] = str(test["_id"])

        return {
            "success": True,
            "test": test
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Create Test
# ==========================================

def create_test(test):

    try:

        test_data = {

            "examName": test.examName,

            "examType": test.examType,

            "subject": test.subject,

            "course": test.course,

            "examDate": test.examDate,

            "totalMarks": test.totalMarks,

            "createdAt": test.createdAt

        }

        result = test_collection.insert_one(
            test_data
        )

        new_test = test_collection.find_one(
            {
                "_id": result.inserted_id
            }
        )

        new_test["_id"] = str(new_test["_id"])

        return {

            "success": True,

            "message": "Exam Created Successfully",

            "test": new_test

        }

    except Exception as e:

        return {

            "success": False,

            "message": str(e)

        }


# ==========================================
# Update Test
# ==========================================

def update_test(test_id, test):

    try:

        if not ObjectId.is_valid(test_id):

            return {

                "success": False,

                "message": "Invalid Test ID"

            }

        updated = test_collection.update_one(

            {
                "_id": ObjectId(test_id)
            },

            {
                "$set": {

                    "examName": test.examName,

                    "examType": test.examType,

                    "subject": test.subject,

                    "course": test.course,

                    "examDate": test.examDate,

                    "totalMarks": test.totalMarks

                }

            }

        )

        if updated.matched_count == 0:

            return {

                "success": False,

                "message": "Exam Not Found"

            }

        return {

            "success": True,

            "message": "Exam Updated Successfully"

        }

    except Exception as e:

        return {

            "success": False,

            "message": str(e)

        }


# ==========================================
# Delete Test
# ==========================================

def delete_test(test_id):

    try:

        if not ObjectId.is_valid(test_id):

            return {

                "success": False,

                "message": "Invalid Test ID"

            }

        deleted = test_collection.delete_one(

            {
                "_id": ObjectId(test_id)
            }

        )

        if deleted.deleted_count == 0:

            return {

                "success": False,

                "message": "Exam Not Found"

            }

        return {

            "success": True,

            "message": "Exam Deleted Successfully"

        }

    except Exception as e:

        return {

            "success": False,

            "message": str(e)

        }