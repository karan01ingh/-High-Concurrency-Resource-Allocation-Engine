from fastapi import FastAPI
# from DB import dbConnection
from DB.dbConnection import get_db_connection
from custom_response.custom_response import custom_response
app=FastAPI()
connection=get_db_connection()
@app.get("/users/{user_id}")
def read_root(user_id:int):
    additional_data = {"user_id": user_id, "Work": "Software Engineer"}
    return custom_response(message="User data retrieved successfully", status_code=200, additional_response=additional_data)