from fastapi import APIRouter, Body

from app.schemas.test_schema import TestSchema

from app.controllers.test_controller import (
    get_all_tests,
    get_test,
    create_test,
    update_test,
    delete_test
)

router = APIRouter(
    prefix="/api/tests",
    tags=["Tests"]
)


# ==========================================
# Get All Tests
# ==========================================

@router.get("/")
def all_tests():

    return get_all_tests()


# ==========================================
# Get Single Test
# ==========================================

@router.get("/{test_id}")
def single_test(test_id: str):

    return get_test(test_id)


# ==========================================
# Create Test
# ==========================================

@router.post("/")
def add_test(test: TestSchema = Body(...)):

    print("\n==============================")
    print("CREATE EXAM REQUEST")
    print("==============================")
    print(test.model_dump())
    print("==============================\n")

    return create_test(test)


# ==========================================
# Update Test
# ==========================================

@router.put("/{test_id}")
def edit_test(
    test_id: str,
    test: TestSchema = Body(...)
):

    print("\n==============================")
    print("UPDATE EXAM REQUEST")
    print("==============================")
    print(test.model_dump())
    print("==============================\n")

    return update_test(
        test_id,
        test
    )


# ==========================================
# Delete Test
# ==========================================

@router.delete("/{test_id}")
def remove_test(test_id: str):

    return delete_test(test_id)