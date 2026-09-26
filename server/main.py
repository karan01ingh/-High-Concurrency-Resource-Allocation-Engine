from fastapi import FastAPI
from DB.db import DB   
from custom_response.custom_response import custom_response
print("FastAPI app started")
app=FastAPI()
print("FastAPI app created")
@app.get("/users/{user_id}")
def read_root(user_id:int):
    additional_data = {"user_id": user_id, "Work": "Software Engineer"}
    return custom_response(message="User data retrieved successfully", status_code=200, additional_response=additional_data)