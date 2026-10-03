from fastapi import Request
from Services.user_service import get_user_by_id_service,delete_user_service,get_user_at_event_service,update_user_service,create_user_service,get_all_users_service

# used by admin only
async def get_all_users(request:Request):
    body = await request.json()
    search_value = body.get("search_value")
    filter_value = body.get("filter_value")
    order_col = body.get("order_col")
    order_col_dir = body.get("order_col_dir")
    limit = body.get("limit")
    offset = body.get("offset")
    return await get_all_users_service(search_value,filter_value,order_col,order_col_dir,limit,offset)

# used to get user by id
async def get_user_by_id(user_id:int):
    return await get_user_by_id_service(user_id)

# used to delete user by id 
def delete_user(user_id):
    return delete_user_service(user_id)

# used to get users at event by event id
def get_user_at_event(event_id):
    return get_user_at_event_service(event_id)

# used to update user by id
async def update_user(request:Request, user_id:int):
    body = await request.json()
    return await update_user_service(user_id, body.get("user_data"))

# used to craete a user with user_id and user_data
def create_user(user_data):
    return create_user_service(user_data)
    