import os
import re
from datetime import datetime
from urllib.parse import quote_plus
from dotenv import load_dotenv
from sqlalchemy import (
    create_engine,
    MetaData,
    Table,
    Column,
    String,
    Text,
    Integer,
    Float,
    Boolean,
    DateTime,
    select,
    insert,
    update,
    delete,
    func,
    and_,
    or_,
)
from sqlalchemy.exc import SQLAlchemyError
load_dotenv()
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "amplemind")
MYSQL_USER = os.getenv("MYSQL_USER", "amplemind")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
DATABASE_URL = (
    f"mysql+pymysql://"
    f"{quote_plus(MYSQL_USER)}:"
    f"{quote_plus(MYSQL_PASSWORD)}@"
    f"{MYSQL_HOST}:{MYSQL_PORT}/"
    f"{MYSQL_DATABASE}"
)
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=280,
    future=True,
)
metadata = MetaData()
print("=" * 60)
print("MYSQL CONFIGURATION")
print("HOST     :", MYSQL_HOST)
print("PORT     :", MYSQL_PORT)
print("DATABASE :", MYSQL_DATABASE)
print("USER     :", MYSQL_USER)
print("=" * 60)
try:
    with engine.connect() as connection:
        connection.execute(select(1))
        print("✅ MySQL Connected Successfully")
except Exception as e:
    print("❌ MySQL Connection Failed")
    print("ERROR:", e)
def camel_to_snake(name):
    """
    Convert camelCase to snake_case.
    createdAt -> created_at
    studentId -> student_id
    totalMarks -> total_marks
    """
    if name == "_id":
        return "id"
    name = re.sub(r"(.)([A-Z][a-z]+)", r"\1_\2", name)
    name = re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", name)
    return name.lower()
def snake_to_camel(name):
    """
    Convert snake_case to camelCase.
    created_at -> createdAt
    student_id -> studentId
    """
    if name == "id":
        return "_id"
    parts = name.split("_")
    if len(parts) == 1:
        return name
    return parts[0] + "".join(
        word.capitalize() for word in parts[1:]
    )
def convert_value(value):
    """
    Convert Python values into MySQL-friendly values.
    """
    if isinstance(value, datetime):
        return value
    if isinstance(value, bool):
        return value
    if value is None:
        return None
    if isinstance(value, (dict, list)):
        import json
        return json.dumps(value, default=str)
    return value
def restore_value(value):
    """
    Restore MySQL values for API responses.
    """
    return value
class InsertOneResult:
    def __init__(self, inserted_id):
        self.inserted_id = inserted_id
class UpdateResult:
    def __init__(self, matched_count=0, modified_count=0):
        self.matched_count = matched_count
        self.modified_count = modified_count
class DeleteResult:
    def __init__(self, deleted_count=0):
        self.deleted_count = deleted_count
class MySQLCursor:
    def __init__(self, collection, documents):
        self.collection = collection
        self.documents = documents
    def sort(self, field, direction=1):
        """
        Mongo style:
        .sort("createdAt", -1)
        """
        reverse = direction == -1
        def get_value(doc):
            value = doc.get(field)
            if value is None:
                value = doc.get(camel_to_snake(field))
            return value
        self.documents.sort(
            key=lambda x: (
                get_value(x) is None,
                get_value(x)
                if get_value(x) is not None
                else ""
            ),
            reverse=reverse,
        )
        return self
    def limit(self, number):
        self.documents = self.documents[:number]
        return self
    def skip(self, number):
        self.documents = self.documents[number:]
        return self
    def __iter__(self):
        return iter(self.documents)
    def __len__(self):
        return len(self.documents)
    def __getitem__(self, index):
        return self.documents[index]
class MySQLCollection:
    def __init__(self, table_name):
        self.table_name = table_name
        self.name = table_name
        self.preserve_snake_case = (
            table_name == "certificates"
        )
        self.table = self._get_or_create_table()
    def _get_or_create_table(self):
        if self.table_name in metadata.tables:
            table = metadata.tables[self.table_name]
            try:
                metadata.create_all(
                    engine,
                    tables=[table]
                )
            except Exception:
                pass
            return table
        table = Table(
            self.table_name,
            metadata,
            Column(
                "id",
                String(100),
                primary_key=True,
            ),
            extend_existing=True,
        )
        try:
            metadata.create_all(
                engine,
                tables=[table]
            )
        except Exception as e:
            print(
                f"⚠️ Could not create table "
                f"{self.table_name}: {e}"
            )
        return table
    def _refresh_table(self):
        try:
            self.table = Table(
                self.table_name,
                metadata,
                autoload_with=engine,
                extend_existing=True,
            )
        except Exception:
            self.table = self._get_or_create_table()
        return self.table
    def _ensure_columns(self, document):
        if not document:
            return
        self._refresh_table()
        existing_columns = {
            column.name
            for column in self.table.columns
        }
        missing_columns = []
        for key, value in document.items():
            if self.preserve_snake_case:
                column_name = key
            else:
                column_name = camel_to_snake(key)
            if column_name == "_id":
                column_name = "id"
            if column_name not in existing_columns:
                missing_columns.append(
                    (column_name, value)
                )
        if not missing_columns:
            return
        try:
            with engine.begin() as connection:
                for column_name, value in missing_columns:
                    if isinstance(value, bool):
                        sql_type = "BOOLEAN"
                    elif isinstance(value, int):
                        sql_type = "BIGINT"
                    elif isinstance(value, float):
                        sql_type = "DOUBLE"
                    elif isinstance(value, datetime):
                        sql_type = "DATETIME"
                    else:
                        sql_type = "LONGTEXT"
                    connection.exec_driver_sql(
                        f"ALTER TABLE `{self.table_name}` "
                        f"ADD COLUMN `{column_name}` "
                        f"{sql_type}"
                    )
        except Exception as e:
            if "Duplicate column" not in str(e):
                print(
                    f"⚠️ Column creation warning "
                    f"for {self.table_name}: {e}"
                )
        self._refresh_table()
    def _convert_document_for_mysql(self, document):
        result = {}
        for key, value in document.items():
            if self.preserve_snake_case:
                mysql_key = key
            else:
                mysql_key = camel_to_snake(key)
            if mysql_key == "_id":
                mysql_key = "id"
            result[mysql_key] = convert_value(value)
        return result
    def _convert_row_to_document(self, row):
        data = dict(row._mapping)
        result = {}
        for key, value in data.items():
            if self.preserve_snake_case:
                if key == "id":
                    result["_id"] = value
                else:
                    result[key] = restore_value(value)
            else:
                if key == "id":
                    result["_id"] = value
                else:
                    result[
                        snake_to_camel(key)
                    ] = restore_value(value)
        return result
    def _build_condition(
        self,
        key,
        value,
        table=None
    ):
        if table is None:
            table = self.table
        if self.preserve_snake_case:
            column_name = key
        else:
            column_name = camel_to_snake(key)
        if column_name == "_id":
            column_name = "id"
        if column_name not in table.c:
            return False
        column = table.c[column_name]
        if isinstance(value, dict):
            conditions = []
            for operator, operator_value in value.items():
                operator_value = convert_value(
                    operator_value
                )
                if operator == "$in":
                    if not isinstance(
                        operator_value,
                        list
                    ):
                        operator_value = [
                            operator_value
                        ]
                    conditions.append(
                        column.in_(operator_value)
                    )
                elif operator == "$nin":
                    if not isinstance(
                        operator_value,
                        list
                    ):
                        operator_value = [
                            operator_value
                        ]
                    conditions.append(
                        ~column.in_(operator_value)
                    )
                elif operator == "$ne":
                    conditions.append(
                        column != operator_value
                    )
                elif operator == "$gt":
                    conditions.append(
                        column > operator_value
                    )
                elif operator == "$gte":
                    conditions.append(
                        column >= operator_value
                    )
                elif operator == "$lt":
                    conditions.append(
                        column < operator_value
                    )
                elif operator == "$lte":
                    conditions.append(
                        column <= operator_value
                    )
                elif operator == "$regex":
                    conditions.append(
                        column.like(
                            f"%{operator_value}%"
                        )
                    )
                else:
                    conditions.append(
                        column == operator_value
                    )
            if not conditions:
                return True
            return and_(*conditions)
        return column == convert_value(value)
    def _build_filter(
        self,
        query,
        table=None
    ):
        if table is None:
            table = self.table
        if not query:
            return True
        conditions = []
        for key, value in query.items():
            if key == "$or":
                or_conditions = []
                for item in value:
                    or_conditions.append(
                        self._build_filter(
                            item,
                            table
                        )
                    )
                conditions.append(
                    or_(*or_conditions)
                )
            elif key == "$and":
                and_conditions = []
                for item in value:
                    and_conditions.append(
                        self._build_filter(
                            item,
                            table
                        )
                    )
                conditions.append(
                    and_(*and_conditions)
                )
            else:
                conditions.append(
                    self._build_condition(
                        key,
                        value,
                        table
                    )
                )
        if not conditions:
            return True
        return and_(*conditions)
    def find(
        self,
        query=None,
        projection=None
    ):
        self._refresh_table()
        try:
            with engine.connect() as connection:
                stmt = select(self.table)
                condition = self._build_filter(
                    query or {},
                    self.table
                )
                if condition is not True:
                    stmt = stmt.where(condition)
                result = connection.execute(stmt)
                documents = [
                    self._convert_row_to_document(row)
                    for row in result
                ]
        except Exception as e:
            print(
                f"❌ FIND ERROR [{self.table_name}]: {e}"
            )
            documents = []
        if projection:
            exclude_fields = {
                key
                for key, value in projection.items()
                if value == 0
            }
            include_fields = {
                key
                for key, value in projection.items()
                if value == 1
            }
            new_documents = []
            for document in documents:
                if include_fields:
                    new_document = {}
                    for field in include_fields:
                        if field in document:
                            new_document[field] = document[field]
                    if (
                        "_id" in document
                        and projection.get("_id", 1) != 0
                    ):
                        new_document["_id"] = document["_id"]
                else:
                    new_document = dict(document)
                    for field in exclude_fields:
                        new_document.pop(
                            field,
                            None
                        )
                new_documents.append(
                    new_document
                )
            documents = new_documents
        return MySQLCursor(
            self,
            documents
        )
    def find_one(
        self,
        query=None,
        projection=None,
        sort=None
    ):
        cursor = self.find(
            query=query,
            projection=projection
        )
        if sort:
            for field, direction in reversed(sort):
                cursor.sort(field, direction)
        for document in cursor:
            return document
        return None
    def insert_one(self, document):
        import uuid
        document = dict(document)
        if "_id" not in document and "id" not in document:
            document["_id"] = (
                uuid.uuid4().hex[:24]
            )
        self._ensure_columns(document)
        mysql_document = (
            self._convert_document_for_mysql(
                document
            )
        )
        self._refresh_table()
        try:
            with engine.begin() as connection:
                connection.execute(
                    insert(self.table).values(
                        **mysql_document
                    )
                )
            inserted_id = document.get(
                "_id",
                document.get("id")
            )
            return InsertOneResult(
                inserted_id
            )
        except Exception as e:
            print(
                f"❌ INSERT ERROR "
                f"[{self.table_name}]: {e}"
            )
            raise
    def update_one(
        self,
        query,
        update_data,
        upsert=False
    ):
        self._refresh_table()
        existing = self.find_one(query)
        if existing is None:
            if upsert:
                new_document = {}
                for key, value in query.items():
                    if not key.startswith("$"):
                        if not isinstance(
                            value,
                            dict
                        ):
                            new_document[key] = value
                if "$set" in update_data:
                    new_document.update(
                        update_data["$set"]
                    )
                if "$setOnInsert" in update_data:
                    new_document.update(
                        update_data[
                            "$setOnInsert"
                        ]
                    )
                result = self.insert_one(
                    new_document
                )
                return UpdateResult(
                    matched_count=0,
                    modified_count=1
                )
            return UpdateResult(
                matched_count=0,
                modified_count=0
            )
        fields_to_ensure = {}
        if "$set" in update_data:
            fields_to_ensure.update(
                update_data["$set"]
            )
        if "$setOnInsert" in update_data:
            fields_to_ensure.update(
                update_data["$setOnInsert"]
            )
        for key, value in update_data.items():
            if key.startswith("$"):
                continue
            fields_to_ensure[key] = value
        if "$unset" in update_data:
            for key in update_data["$unset"]:
                fields_to_ensure[key] = None
        if fields_to_ensure:
            self._ensure_columns(
                fields_to_ensure
            )
            self._refresh_table()
        values = {}
        if "$set" in update_data:
            set_data = update_data["$set"]
            for key, value in set_data.items():
                if self.preserve_snake_case:
                    column_name = key
                else:
                    column_name = camel_to_snake(key)
                if column_name == "_id":
                    column_name = "id"
                if column_name in self.table.c:
                    values[column_name] = (
                        convert_value(value)
                    )
        for key, value in update_data.items():
            if key.startswith("$"):
                continue
            if self.preserve_snake_case:
                column_name = key
            else:
                column_name = camel_to_snake(key)
            if column_name == "_id":
                column_name = "id"
            if column_name in self.table.c:
                values[column_name] = (
                    convert_value(value)
                )
        if "$unset" in update_data:
            for key in update_data["$unset"]:
                if self.preserve_snake_case:
                    column_name = key
                else:
                    column_name = camel_to_snake(key)
                if column_name == "_id":
                    column_name = "id"
                if column_name in self.table.c:
                    values[column_name] = None
        if not values:
            return UpdateResult(
                matched_count=1,
                modified_count=0
            )
        condition = self._build_filter(
            query,
            self.table
        )
        try:
            with engine.begin() as connection:
                result = connection.execute(
                    update(self.table)
                    .where(condition)
                    .values(**values)
                )
            return UpdateResult(
                matched_count=result.rowcount or 0,
                modified_count=result.rowcount or 0
            )
        except Exception as e:
            print(
                f"❌ UPDATE ERROR "
                f"[{self.table_name}]: {e}"
            )
            raise
    def delete_one(self, query):
        self._refresh_table()
        condition = self._build_filter(
            query,
            self.table
        )
        try:
            with engine.begin() as connection:
                result = connection.execute(
                    delete(self.table)
                    .where(condition)
                )
            return DeleteResult(
                deleted_count=result.rowcount or 0
            )
        except Exception as e:
            print(
                f"❌ DELETE ERROR "
                f"[{self.table_name}]: {e}"
            )
            raise
    def count_documents(self, query=None):
        self._refresh_table()
        try:
            with engine.connect() as connection:
                stmt = select(
                    func.count()
                ).select_from(
                    self.table
                )
                condition = self._build_filter(
                    query or {},
                    self.table
                )
                if condition is not True:
                    stmt = stmt.where(condition)
                result = connection.execute(
                    stmt
                )
                return result.scalar() or 0
        except Exception as e:
            print(
                f"❌ COUNT ERROR "
                f"[{self.table_name}]: {e}"
            )
            return 0
    def aggregate(self, pipeline):
        documents = list(
            self.find()
        )
        for stage in pipeline:
            if "$match" in stage:
                match_query = stage["$match"]
                filtered = []
                for document in documents:
                    matches = True
                    for key, value in match_query.items():
                        if isinstance(
                            value,
                            dict
                        ):
                            current = document.get(
                                key
                            )
                            if "$ne" in value:
                                if current == value["$ne"]:
                                    matches = False
                            if "$in" in value:
                                if current not in value["$in"]:
                                    matches = False
                        else:
                            if document.get(key) != value:
                                matches = False
                    if matches:
                        filtered.append(document)
                documents = filtered
            elif "$sort" in stage:
                sort_data = stage["$sort"]
                for field, direction in reversed(
                    list(sort_data.items())
                ):
                    documents.sort(
                        key=lambda x: (
                            x.get(field)
                            if x.get(field) is not None
                            else ""
                        ),
                        reverse=direction == -1
                    )
            elif "$group" in stage:
                group_config = stage["$group"]
                group_field = group_config.get(
                    "_id"
                )
                groups = {}
                for document in documents:
                    if (
                        isinstance(
                            group_field,
                            str
                        )
                        and group_field.startswith("$")
                    ):
                        field_name = (
                            group_field[1:]
                        )
                        group_key = document.get(
                            field_name
                        )
                    else:
                        group_key = group_field
                    if group_key not in groups:
                        groups[group_key] = {
                            "_id": group_key
                        }
                    for output_field, expression in (
                        group_config.items()
                    ):
                        if output_field == "_id":
                            continue
                        if (
                            isinstance(
                                expression,
                                dict
                            )
                            and "$sum" in expression
                        ):
                            sum_value = expression[
                                "$sum"
                            ]
                            if isinstance(
                                sum_value,
                                str
                            ) and sum_value.startswith("$"):
                                field_name = (
                                    sum_value[1:]
                                )
                                value = document.get(
                                    field_name,
                                    0
                                )
                                try:
                                    value = float(
                                        value or 0
                                    )
                                except Exception:
                                    value = 0
                            else:
                                value = sum_value
                            groups[group_key][
                                output_field
                            ] = (
                                groups[group_key]
                                .get(
                                    output_field,
                                    0
                                )
                                + value
                            )
                documents = list(
                    groups.values()
                )
            elif "$count" in stage:
                field_name = stage["$count"]
                documents = [
                    {
                        field_name: len(
                            documents
                        )
                    }
                ]
        return documents
class MySQLDatabase:
    def __init__(self):
        self._collections = {}
    def __getitem__(self, collection_name):
        if collection_name not in self._collections:
            table_name = self._normalize_table_name(
                collection_name
            )
            self._collections[
                collection_name
            ] = MySQLCollection(
                table_name
            )
        return self._collections[
            collection_name
        ]
    @staticmethod
    def _normalize_table_name(name):
        mappings = {
            "courseenrollments":
                "course_enrollments",
            "testattempts":
                "test_attempts",
            "courseEnrollments":
                "course_enrollments",
            "testAttempts":
                "test_attempts",
        }
        if name in mappings:
            return mappings[name]
        return camel_to_snake(name)
db = MySQLDatabase()
client = None
print("=" * 60)
print("✅ MySQL DATABASE COMPATIBILITY LAYER LOADED")
print("✅ Existing Mongo-style controllers can use MySQL")
print("=" * 60)
