def cancel_booking_service(user_id,event_id,booking_id):
    print("cancelling booking with booking id:",booking_id," user id:",user_id," event id:",event_id)
    return {"message":"cancelling bookings"}

def create_booking_service(user_id,event_id,booking_data):
    
    