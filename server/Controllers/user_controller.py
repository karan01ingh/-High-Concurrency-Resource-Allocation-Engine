from Services.user_service import get_user_by_id_service,delete_user_service,get_user_at_event_service,update_user_service,create_user_service,get_all_users_service
# used by admin only
def get_all_users():
    return get_all_users_service()

# used to get user by id
def get_user_by_id(user_id):
    return get_user_by_id_service(user_id)

# used to delete user by id 
def delete_user(user_id):
    return delete_user_service(user_id)

# used to get users at event by event id
def get_user_at_event(event_id):
    return get_user_at_event_service(event_id)

# used to update user by id
def update_user(user_id, user_data):
    return update_user_service(user_id, user_data)

# used to craete a user with user_id and user_data
def create_user(user_data):
    return create_user_service(user_data)
    