from fastapi import APIRouter, Request
from Controllers.event_controller import (
    get_events,
    create_event,
    update_event,
    delete_event,
    get_all_events,
    get_event_by_event_id,
)

router = APIRouter()


@router.post("/all_events/{user_id}")
async def get_all_events_route(request:Request,user_id: int):
    return await get_all_events(request,user_id)


@router.get("/{event_id}")
async def get_event_by_event_id_route(request: Request, event_id: int):
    return await get_event_by_event_id(request, event_id)


@router.post("/create-event/{user_id}")
async def create_event_route(request:Request,user_id):
    print("in route")
    return await create_event(request,user_id)



@router.put("/{event_id}")
async def update_event_route(request: Request, event_id: int):
    return await update_event(request, event_id)


@router.delete("/{event_id}")
def delete_event_route(event_id: int):
    return delete_event(event_id)


@router.post("/")
async def get_events_route(request: Request):
    print("in the route")
    return await get_events(request)
