from Services.event_service import (
    get_event_by_event_id_service,
    create_event_service,
    update_event_service,
    delete_event_service,
    get_all_events_service,
    get_events_service,
)
from fastapi import Request


# used to get an event with event_id
async def get_event_by_event_id(request: Request, event_id: int):
    body = await request.json()
    search_value = body.get("search_value")
    filter_value = body.get("filter_value")
    oder_col = body.get("order_col")
    order_col_dir = body.get("order_col_dir")
    limit = body.get("limit")
    offset = body.get("offset")
    return await get_event_by_event_id_service(
        search_value, filter_value, oder_col, order_col_dir, limit, offset, event_id
    )


# used to create an event with event_id and event_data
async def create_event(request:Request,user_id):
    print("in controller")
    body = await request.json()
    return await create_event_service(user_id,body.get("event_data"))


# used to update an event with event_id and event_data
async def update_event(request: Request, event_id: int):
    body = await request.json()
    return await update_event_service(event_id, body.get("event_data"))


# used to delete an event with event_id
def delete_event(event_id: int):
    return delete_event_service(event_id)


# used to get all event with a user id
async def get_all_events(request: Request, user_id: int):
    body = await request.json()
    search_value = body.get("search_value")
    filter_value = body.get("filter_value")
    order_col = body.get("order_col")
    order_col_dir = body.get("order_col_dir")
    limit = body.get("limit")
    offset = body.get("offset")
    return await get_all_events_service(
        user_id, search_value, filter_value, order_col, order_col_dir, limit, offset
    )


# used to get all events by the admin
async def get_events(request: Request):
    body = await request.json()
    search_value = body.get("search_value")
    filter_value = body.get("filter_value")
    order_col = body.get("order_col")
    order_col_dir = body.get("order_col_dir")
    limit = body.get("limit")
    offset = body.get("offset")
    return await get_events_service(
        search_value, filter_value, order_col, order_col_dir, limit, offset
    )
