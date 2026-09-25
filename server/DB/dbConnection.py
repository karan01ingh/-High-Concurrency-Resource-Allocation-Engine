import psycopg
from config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
def get_db_connection():
    try:
        connection = psycopg.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        return connection
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        return None
print("Database connection established successfully.")