from app.config.mysql_database import engine

try:
    with engine.connect() as connection:
        print("✅ MySQL Connected Successfully")
        print("✅ Database connection is working!")
except Exception as e:
    print("❌ MySQL Connection Failed")
    print("ERROR:", e)