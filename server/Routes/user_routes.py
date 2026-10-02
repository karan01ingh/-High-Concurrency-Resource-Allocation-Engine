from fastapi import APIRouter,Request
from Controllers.user_controller import get_all_users, get_user_by_id, delete_user, get_user_at_event, update_user,create_user

router=APIRouter()

@router.post("/all")
async def get_user_route(Request:Request):
    return await get_all_users(Request)

@router.get("/{user_id}")
def get_user_by_id_route(user_id:int):
    return get_user_by_id(user_id)

@router.delete("/{user_id}")
def delete_user_route(user_id:int):
    return delete_user(user_id)

@router.get("/users_at_events/{event_id}")
def get_user_at_event_route(event_id:int):
    return get_user_at_event(event_id)

@router.put("/{user_id}")
def update_user_route(user_id:int,user_data:dict):
    return update_user(user_id,user_data)

@router.post("/")
def create_user_route(user_data:dict):
    print("Creating user with")
    return create_user(user_data)  