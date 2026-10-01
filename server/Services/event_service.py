def get_event_by_event_id_service(event_id):
    return {"message": f"Hello from event service with id: {event_id}"}

def create_event_service(event_data):   
    return {"message": f"Creating event with {event_data}"}

def update_event_service(event_id,event_data):
    return {"message": f"Updating event with id: {event_id}", "event_data": event_data}

def delete_event_service(event_id):
    return {"message":f"deleting event with id: {event_id}"}

def get_all_events_service(user_id):    
    return {"message":f"Getting all events for user with id: {user_id}"}

def get_events_service():
    return {"message":f"all events from admin"}