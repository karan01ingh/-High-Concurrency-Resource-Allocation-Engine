# used by admin only
def get_all_users():
    print("Hello from user controller")
    return {"message":"Hello from user controller"}

# used to get user by id
def get_user_by_id(user_id):
    print(" Hello from user controller with id:",user_id)
    return {"message": f"Hello from user controller with id: {user_id}"}

# used to delete user by id 
def delete_user(user_id):
    print("Deleting user with id:",user_id)
    return {"message": f"Deleting user with id: {user_id}"}

# used to get users at event by event id
def get_user_at_event(event_id):
    print("getting user at event with id:",event_id)
    return {"message": f"getting user at event with id: {event_id}"}

# used to update user by id
def update_user(user_id, user_data):
    print("Updating user with id:",user_id)
    print("User data:",user_data)
    return {"message": f"Updating user with id: {user_id}", "user_data": user_data}

# used to craete a user with user_id and user_data
def create_user(user_data):
    print("Creating user")
    print("User data:",user_data)
    return {"message": f"Creating user", "user_data": user_data}
    