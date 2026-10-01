from Services.event_service import get_event_by_event_id_service,create_event_service,update_event_service,delete_event_service,get_all_events_service,get_events_service

# used to get an event with event_id
def get_event_by_event_id(event_id:int):
    return get_event_by_event_id_service(event_id)

# used to create an event with event_id and event_data
def create_event(event_data:dict):
    return create_event_service(event_data)

# used to update an event with event_id and event_data
def update_event(event_id:int,event_data:dict):
    return update_event_service(event_id,event_data)

# used to delete an event with event_id
def delete_event(event_id:int):
    return delete_event_service(event_id)

# used to get all event with a user id 
def get_all_events(user_id:int):
    return get_all_events_service(user_id)

# used to get all events by the admin
def get_events():
    return get_events_service()
