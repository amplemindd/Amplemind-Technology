from bson import ObjectId

from app.models.user import user_collection


# ==========================================
# Get All Users
# ==========================================

def get_all_users():

    try:

        users = list(user_collection.find())

        for user in users:
            user["_id"] = str(user["_id"])

        return {
            "success": True,
            "message": "Users Fetched Successfully",
            "users": users
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Add User
# ==========================================

def add_user(user):

    try:

        existing_user = user_collection.find_one(
            {
                "email": user.email
            }
        )

        if existing_user:

            return {
                "success": False,
                "message": "Email Already Exists"
            }

        data = {
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "status": user.status
        }

        result = user_collection.insert_one(data)

        new_user = user_collection.find_one(
            {
                "_id": result.inserted_id
            }
        )

        new_user["_id"] = str(new_user["_id"])

        return {
            "success": True,
            "message": "User Added Successfully",
            "user": new_user
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Update User
# ==========================================

def update_user(user_id, user):

    try:

        existing_user = user_collection.find_one(
            {
                "_id": ObjectId(user_id)
            }
        )

        if not existing_user:

            return {
                "success": False,
                "message": "User Not Found"
            }

        user_collection.update_one(
            {
                "_id": ObjectId(user_id)
            },
            {
                "$set": {
                    "name": user.name,
                    "email": user.email,
                    "role": user.role,
                    "status": user.status
                }
            }
        )

        updated_user = user_collection.find_one(
            {
                "_id": ObjectId(user_id)
            }
        )

        updated_user["_id"] = str(updated_user["_id"])

        return {
            "success": True,
            "message": "User Updated Successfully",
            "user": updated_user
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Delete User
# ==========================================

def delete_user(user_id):

    try:

        existing_user = user_collection.find_one(
            {
                "_id": ObjectId(user_id)
            }
        )

        if not existing_user:

            return {
                "success": False,
                "message": "User Not Found"
            }

        user_collection.delete_one(
            {
                "_id": ObjectId(user_id)
            }
        )

        return {
            "success": True,
            "message": "User Deleted Successfully"
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }