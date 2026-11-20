import os
import json
from datetime import datetime, date
from decimal import Decimal
from urllib.parse import quote_plus

from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine


# ============================================================
# LOAD ENVIRONMENT
# ============================================================

load_dotenv()


# ============================================================
# CONFIGURATION
# ============================================================

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DATABASE = os.getenv("DATABASE_NAME")

MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE")
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")


# ============================================================
# MONGODB COLLECTION -> MYSQL TABLE
# ============================================================

COLLECTION_TABLE_MAP = {
    "admins": "admins",
    "applications": "applications",
    "blogs": "blogs",
    "certificates": "certificates",
    "courses": "courses",
    "courseenrollments": "course_enrollments",
    "jobs": "jobs",
    "payments": "payments",
    "projects": "projects",
    "results": "results",
    "services": "services",
    "settings": "settings",
    "students": "students",
    "tests": "tests",
    "testattempts": "test_attempts",
    "users": "users",
}


# ============================================================
# CAMEL CASE -> SNAKE CASE
# ============================================================

def camel_to_snake(name: str) -> str:
    result = ""

    for index, char in enumerate(name):
        if char.isupper():
            if index != 0:
                result += "_"

            result += char.lower()
        else:
            result += char

    return result


# ============================================================
# CONVERT MONGODB VALUES
# ============================================================

def convert_value(value):

    # ObjectId -> String
    if isinstance(value, ObjectId):
        return str(value)

    # datetime
    if isinstance(value, datetime):
        return value

    # date
    if isinstance(value, date):
        return value

    # Decimal
    if isinstance(value, Decimal):
        return float(value)

    # List
    if isinstance(value, list):
        converted_list = []

        for item in value:
            converted_list.append(convert_value(item))

        return json.dumps(converted_list, default=str)

    # Dictionary
    if isinstance(value, dict):
        converted_dict = {}

        for key, item in value.items():
            converted_dict[key] = convert_value(item)

        return json.dumps(converted_dict, default=str)

    # Boolean
    if isinstance(value, bool):
        return value

    # None
    if value is None:
        return None

    # Normal values
    return value


# ============================================================
# DETECT MYSQL COLUMN TYPE
# ============================================================

def mysql_type(value):

    if isinstance(value, bool):
        return "TINYINT(1)"

    if isinstance(value, int):
        return "BIGINT"

    if isinstance(value, float):
        return "DECIMAL(18,4)"

    if isinstance(value, datetime):
        return "DATETIME"

    if isinstance(value, date):
        return "DATE"

    if isinstance(value, (dict, list)):
        return "JSON"

    return "TEXT"


# ============================================================
# CHECK TABLE EXISTS
# ============================================================

def table_exists(engine: Engine, table_name: str) -> bool:

    query = text("""
        SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = :database
        AND TABLE_NAME = :table
    """)

    with engine.connect() as connection:

        result = connection.execute(
            query,
            {
                "database": MYSQL_DATABASE,
                "table": table_name,
            }
        ).scalar()

    return result > 0


# ============================================================
# CREATE TABLE IF NOT EXISTS
# ============================================================

def create_table_if_missing(
    engine: Engine,
    table_name: str
):

    if table_exists(engine, table_name):
        return

    print(f"   + Creating MySQL table: {table_name}")

    query = text(f"""
        CREATE TABLE `{table_name}` (
            `id` VARCHAR(50) NOT NULL,
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    """)

    with engine.begin() as connection:
        connection.execute(query)

    print(f"   ✅ Table created: {table_name}")


# ============================================================
# GET MYSQL COLUMNS
# ============================================================

def get_columns(
    engine: Engine,
    table_name: str
):

    query = text("""
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = :database
        AND TABLE_NAME = :table
    """)

    with engine.connect() as connection:

        rows = connection.execute(
            query,
            {
                "database": MYSQL_DATABASE,
                "table": table_name,
            }
        ).fetchall()

    return {row[0] for row in rows}


# ============================================================
# ENSURE ID COLUMN
# ============================================================

def ensure_id_column(
    engine: Engine,
    table_name: str
):

    columns = get_columns(
        engine,
        table_name
    )

    if "id" not in columns:

        print(f"   + Adding id column to {table_name}")

        query = text(f"""
            ALTER TABLE `{table_name}`
            ADD COLUMN `id` VARCHAR(50) NULL
        """)

        with engine.begin() as connection:
            connection.execute(query)

        print(f"   ✅ id column added")

    # Check primary key
    query = text("""
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = :database
        AND TABLE_NAME = :table
        AND CONSTRAINT_NAME = 'PRIMARY'
    """)

    with engine.connect() as connection:

        primary_columns = connection.execute(
            query,
            {
                "database": MYSQL_DATABASE,
                "table": table_name,
            }
        ).fetchall()

    primary_column_names = {
        row[0] for row in primary_columns
    }

    if "id" not in primary_column_names:

        print(f"   + Making id PRIMARY KEY: {table_name}")

        # Remove NULL before primary key
        alter_null_query = text(f"""
            ALTER TABLE `{table_name}`
            MODIFY COLUMN `id` VARCHAR(50) NOT NULL
        """)

        with engine.begin() as connection:
            connection.execute(alter_null_query)

        primary_query = text(f"""
            ALTER TABLE `{table_name}`
            ADD PRIMARY KEY (`id`)
        """)

        try:

            with engine.begin() as connection:
                connection.execute(primary_query)

            print(f"   ✅ id is now PRIMARY KEY")

        except Exception as error:

            print(
                f"   ⚠ Could not make id PRIMARY KEY: {error}"
            )


# ============================================================
# ADD MISSING COLUMNS
# ============================================================

def ensure_columns(
    engine: Engine,
    table_name: str,
    document: dict
):

    existing_columns = get_columns(
        engine,
        table_name
    )

    for field, value in document.items():

        # MongoDB _id -> MySQL id
        if field == "_id":
            column_name = "id"
        else:
            column_name = camel_to_snake(field)

        # Already exists
        if column_name in existing_columns:
            continue

        column_type = mysql_type(value)

        # JSON
        if isinstance(value, (dict, list)):
            column_type = "JSON"

        safe_column = f"`{column_name}`"

        query = text(f"""
            ALTER TABLE `{table_name}`
            ADD COLUMN {safe_column} {column_type} NULL
        """)

        try:

            with engine.begin() as connection:
                connection.execute(query)

            print(
                f"   + Added column: "
                f"{table_name}.{column_name} "
                f"({column_type})"
            )

        except Exception as error:

            print(
                f"   ⚠ Could not add column "
                f"{table_name}.{column_name}"
            )

            print(
                f"     ERROR: {error}"
            )


# ============================================================
# CONVERT DOCUMENT
# ============================================================

def prepare_document(document: dict):

    data = {}

    for field, value in document.items():

        if field == "_id":

            column_name = "id"

        else:

            column_name = camel_to_snake(field)

        data[column_name] = convert_value(value)

    return data


# ============================================================
# INSERT / UPDATE DOCUMENT
# ============================================================

def migrate_document(
    engine: Engine,
    table_name: str,
    document: dict
):

    data = prepare_document(document)

    # MongoDB document must have _id
    if "id" not in data:

        print(
            f"   ⚠ Skipping document in "
            f"{table_name}: no _id"
        )

        return False

    columns = list(data.keys())

    column_sql = ", ".join(
        f"`{column}`"
        for column in columns
    )

    values_sql = ", ".join(
        f":{column}"
        for column in columns
    )

    update_columns = [
        column
        for column in columns
        if column != "id"
    ]

    if update_columns:

        update_sql = ", ".join(
            f"`{column}` = VALUES(`{column}`)"
            for column in update_columns
        )

        query_string = f"""
            INSERT INTO `{table_name}`
            ({column_sql})
            VALUES ({values_sql})
            ON DUPLICATE KEY UPDATE
            {update_sql}
        """

    else:

        query_string = f"""
            INSERT IGNORE INTO `{table_name}`
            ({column_sql})
            VALUES ({values_sql})
        """

    query = text(query_string)

    with engine.begin() as connection:

        connection.execute(
            query,
            data
        )

    return True


# ============================================================
# CREATE MYSQL ENGINE
# ============================================================

def create_mysql_engine():

    # IMPORTANT:
    # Password may contain @, #, %, etc.
    # quote_plus prevents connection URL errors.

    encoded_password = quote_plus(
        MYSQL_PASSWORD
    )

    mysql_url = (
        f"mysql+pymysql://"
        f"{MYSQL_USER}:"
        f"{encoded_password}"
        f"@{MYSQL_HOST}:"
        f"{MYSQL_PORT}/"
        f"{MYSQL_DATABASE}"
        f"?charset=utf8mb4"
    )

    engine = create_engine(
        mysql_url,
        pool_pre_ping=True,
        pool_recycle=280,
        future=True,
    )

    return engine


# ============================================================
# VALIDATE CONFIGURATION
# ============================================================

def validate_config():

    print("\nChecking configuration...\n")

    missing = []

    if not MONGO_URI:
        missing.append("MONGO_URI")

    if not MONGO_DATABASE:
        missing.append("DATABASE_NAME")

    if not MYSQL_DATABASE:
        missing.append("MYSQL_DATABASE")

    if not MYSQL_USER:
        missing.append("MYSQL_USER")

    if not MYSQL_PASSWORD:
        missing.append("MYSQL_PASSWORD")

    if missing:

        print("❌ Missing .env values:")

        for item in missing:
            print(f"   - {item}")

        return False

    print("✅ Environment configuration OK")

    return True


# ============================================================
# CONNECT MONGODB
# ============================================================

def connect_mongodb():

    print("\nConnecting to MongoDB...")

    try:

        mongo_client = MongoClient(
            MONGO_URI,
            serverSelectionTimeoutMS=10000
        )

        mongo_client.admin.command("ping")

        mongo_db = mongo_client[
            MONGO_DATABASE
        ]

        print("✅ MongoDB Connected")

        return mongo_client, mongo_db

    except Exception as error:

        print("❌ MongoDB Connection Failed")

        print(
            "ERROR:",
            error
        )

        return None, None


# ============================================================
# CONNECT MYSQL
# ============================================================

def connect_mysql():

    print("\nConnecting to MySQL...")

    try:

        engine = create_mysql_engine()

        with engine.connect() as connection:

            connection.execute(
                text("SELECT 1")
            )

        print("✅ MySQL Connected")

        return engine

    except Exception as error:

        print("❌ MySQL Connection Failed")

        print(
            "ERROR:",
            error
        )

        return None


# ============================================================
# MIGRATE COLLECTION
# ============================================================

def migrate_collection(
    mongo_db,
    mysql_engine,
    collection_name,
    table_name
):

    print("\n" + "=" * 70)

    print(
        f"COLLECTION : {collection_name}"
    )

    print(
        f"MYSQL TABLE: {table_name}"
    )

    print("=" * 70)

    # Check Mongo collection
    try:

        collection_names = (
            mongo_db.list_collection_names()
        )

        if collection_name not in collection_names:

            print(
                "⚠ Collection not found. Skipping."
            )

            return 0

    except Exception as error:

        print(
            "❌ Could not read MongoDB collections"
        )

        print(
            "ERROR:",
            error
        )

        return 0

    # Create MySQL table if missing
    try:

        create_table_if_missing(
            mysql_engine,
            table_name
        )

        ensure_id_column(
            mysql_engine,
            table_name
        )

    except Exception as error:

        print(
            f"❌ Could not prepare table "
            f"{table_name}"
        )

        print(
            "ERROR:",
            error
        )

        return 0

    # Get Mongo documents
    collection = mongo_db[
        collection_name
    ]

    documents = list(
        collection.find({})
    )

    print(
        f"Documents found: {len(documents)}"
    )

    if not documents:

        print(
            "Nothing to migrate."
        )

        return 0

    migrated_count = 0

    failed_count = 0

    for index, document in enumerate(
        documents,
        start=1
    ):

        document_id = document.get(
            "_id"
        )

        try:

            # Add missing columns
            ensure_columns(
                mysql_engine,
                table_name,
                document
            )

            # Insert/update
            success = migrate_document(
                mysql_engine,
                table_name,
                document
            )

            if success:

                migrated_count += 1

                print(
                    f"   ✅ [{index}/{len(documents)}] "
                    f"Migrated: {document_id}"
                )

        except Exception as error:

            failed_count += 1

            print(
                f"   ❌ [{index}/{len(documents)}] "
                f"Failed: {document_id}"
            )

            print(
                f"      ERROR: {error}"
            )

    print("\nResult:")

    print(
        f"   ✅ Migrated: {migrated_count}"
    )

    print(
        f"   ❌ Failed:   {failed_count}"
    )

    print(
        f"   📦 Total:    {len(documents)}"
    )

    return migrated_count


# ============================================================
# VERIFY MYSQL DATA
# ============================================================

def verify_mysql_tables(
    mysql_engine
):

    print("\n")
    print("=" * 70)
    print("MYSQL VERIFICATION")
    print("=" * 70)

    total = 0

    for table_name in COLLECTION_TABLE_MAP.values():

        try:

            if not table_exists(
                mysql_engine,
                table_name
            ):
                continue

            query = text(
                f"SELECT COUNT(*) "
                f"FROM `{table_name}`"
            )

            with mysql_engine.connect() as connection:

                count = connection.execute(
                    query
                ).scalar()

            print(
                f"{table_name:<25} : {count}"
            )

            total += count

        except Exception as error:

            print(
                f"{table_name:<25} : ERROR"
            )

            print(
                f"   {error}"
            )

    print("-" * 70)

    print(
        f"TOTAL MYSQL RECORDS : {total}"
    )

    print("=" * 70)


# ============================================================
# MAIN
# ============================================================

def main():

    print("\n")
    print("=" * 70)
    print("       MONGODB -> MYSQL MIGRATION")
    print("=" * 70)

    # --------------------------------------------------------
    # Validate configuration
    # --------------------------------------------------------

    if not validate_config():

        return

    print("\nConfiguration:")
    print(
        f"MongoDB Database : {MONGO_DATABASE}"
    )
    print(
        f"MySQL Database   : {MYSQL_DATABASE}"
    )
    print(
        f"MySQL Host       : {MYSQL_HOST}"
    )
    print(
        f"MySQL Port       : {MYSQL_PORT}"
    )
    print(
        f"MySQL User       : {MYSQL_USER}"
    )

    # --------------------------------------------------------
    # MongoDB
    # --------------------------------------------------------

    mongo_client, mongo_db = (
        connect_mongodb()
    )

    if not mongo_client:

        return

    # --------------------------------------------------------
    # MySQL
    # --------------------------------------------------------

    mysql_engine = connect_mysql()

    if not mysql_engine:

        mongo_client.close()

        return

    # --------------------------------------------------------
    # Start migration
    # --------------------------------------------------------

    print("\n")
    print("=" * 70)
    print("STARTING MIGRATION")
    print("=" * 70)

    total_migrated = 0

    total_failed = 0

    # --------------------------------------------------------
    # Each collection
    # --------------------------------------------------------

    for collection_name, table_name in (
        COLLECTION_TABLE_MAP.items()
    ):

        migrated = migrate_collection(
            mongo_db,
            mysql_engine,
            collection_name,
            table_name
        )

        total_migrated += migrated

    # --------------------------------------------------------
    # Verification
    # --------------------------------------------------------

    verify_mysql_tables(
        mysql_engine
    )

    # --------------------------------------------------------
    # Close connections
    # --------------------------------------------------------

    mongo_client.close()

    mysql_engine.dispose()

    # --------------------------------------------------------
    # Final result
    # --------------------------------------------------------

    print("\n")
    print("=" * 70)
    print("             MIGRATION COMPLETED")
    print("=" * 70)

    print(
        f"Total documents migrated/updated: "
        f"{total_migrated}"
    )

    print("\n")
    print("✅ MongoDB data has NOT been deleted.")
    print("✅ MongoDB remains as the original source.")
    print("✅ MySQL now contains the migrated data.")

    print("=" * 70)


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":
    main()