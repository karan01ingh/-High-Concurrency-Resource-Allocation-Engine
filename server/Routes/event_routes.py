from fastapi import APIRouter
from Controllers.event_controller import get_events, create_event, update_event, delete_event, get_all_events,get_event_by_event_id
router=APIRouter()

@router.get("/all_events/{user_id}")
def get_all_events_route(user_id:int):
    return get_all_events(user_id)

@router.get("/{event_id}")
def get_event_by_event_id_route(event_id:int):
    return get_event_by_event_id(event_id)

@router.post("/")
def create_event_route(event_data:dict):
    return create_event(event_data)

@router.put("/{event_id}")
def update_event_route(event_id:int,event_data:dict):
    return update_event(event_id,event_data)

@router.delete("/{event_id}")
def delete_event_route(event_id:int):
    return delete_event(event_id)
    
@router.get("/")
def get_events_route():
    return get_events()