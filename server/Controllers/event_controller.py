# used to get an event with event_id
def get_event_by_event_id(event_id:int):
    print("Hello from event controller with id:",event_id)
    return {"message": f"Hello from event controller with id: {event_id}"}

# used to create an event with event_id and event_data
def create_event(event_data:dict):
    print("Creating event with id:")
    return {"message":f"Creating event with {event_data}"}

# used to update an event with event_id and event_data
def update_event(event_id:int,event_data:dict):
    print("Updating event with id:",event_id)
    print("Event data:",event_data)
    return {"message": f"Updating event with id: {event_id}", "event_data": event_data}

# used to delete an event with event_id
def delete_event(event_id:int):
    print("deleting event wuth id:",event_id)
    return {"message":f"deleting event with id: {event_id}"}

# used to get all event with a user id 
def get_all_events(user_id:int):
    print("Getting all events for user with id:",user_id)
    return {"message":f"Getting all events for user with id: {user_id}"}

# used to get all events by the admin
def get_events():
    print("all events by admin")
    return {"message":f"all events from admin"}
