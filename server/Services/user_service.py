def get_user_by_id_service(user_id):
    print("Hello from user service with id:", user_id)
    return {"message": f"Hello from user service with id: {user_id}"}

def delete_user_service(user_id):
    print("Deleting user with id:", user_id)
    return {"message": f"Deleting user with id: {user_id}"}

def get_user_at_event_service(event_id):
    print("getting user at event with id:", event_id)
    return {"message": f"getting user at event with id: {event_id}"}

def update_user_service(user_id, user_data):
    print("Updating user with id:", user_id)
    print("User data:", user_data)
    return {"message": f"Updating user with id: {user_id}", "user_data": user_data}

def create_user_service(user_data):
    print("Creating user")
    print("User data:", user_data)
    return {"message": f"Creating user", "user_data": user_data}

def get_all_users_service():
    print("Hello from user service")
    return {"message": "Hello from user service"}