from custom_response.custom_response import custom_response
import traceback
from DB.db import DB
from datetime import date

db=DB()

async def get_event_by_event_id_service(event_id):
    try:
        base_query= f"SELECT * FROM events WHERE event_id = %s"
        params = (event_id,)
        result=await db.get_one(base_query,params)
        if result is None:
            return custom_response(
                status_code=404,
                message="Event not found",
                additional_response={"error": f"No event found with id: {event_id}"},
            )
        return custom_response(
            status_code=200,
            message="Successfully fetched event",
            additional_response={"data": result},
        )
    except Exception as e:
        print("Error in get_event_by_event_id_service:", str(e))
        traceback.print_exc()
        return custom_response(
            status_code=400,
            message="Error in get_event_by_event_id_service",
            additional_response={"error": str(e)},
        )   

def create_event_service(event_data):   
    return {"message": f"Creating event with {event_data}"}

def update_event_service(event_id,event_data):
    return {"message": f"Updating event with id: {event_id}", "event_data": event_data}

def delete_event_service(event_id):
    return {"message":f"deleting event with id: {event_id}"}

def get_all_events_service(user_id):    
    return {"message":f"Getting all events for user with id: {user_id}"}

async def get_events_service(search_value, filter_value, order_col, order_col_dir, limit, offset):
    try:
        print("in service")
        where =[]
        if search_value:
            where.append(f"""(
                CAST(eventid AS TEXT) ILIKE '%{search_value}%' OR 
                CAST(created_at AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_time AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_name AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_date AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_capacity AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_ticket_price AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_ticket_sold AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_place AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_description AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_created_by AS TEXT) ILIKE '%{search_value}%'  
            )""")
        
        order_str=f"ORDER BY {order_col} {order_col_dir}" if order_col and order_col_dir and order_col_dir.upper() in ['ASC', 'DESC'] and order_col.lower() in ['eventid', 'created_at', 'event_time', 'event_name', 'event_date', 'event_capacity', 'event_ticket_price', 'event_ticket_sold', 'event_place', 'event_description', 'event_created_by'] else "ORDER BY event_date DESC"
        _to_date = (
            date(3000,1,1)
            if not filter_value.get("to_date")
            else filter_value.get("to_date")
        )
        _from_date = (
            date(1970, 1, 1)
            if not filter_value.get("from_date")
            else filter_value.get("from_date")
        )
        _to_price=( 9999999999 if not filter_value.get("to_price") else filter_value.get("to_price"))
        _from_price=(0 if not filter_value.get("from_price") else filter_value.get("from_price"))
        where.append(f" event_date BETWEEN '{_from_date}' AND '{_to_date}' ")
        where.append(f" event_ticket_price BETWEEN '{_from_price}' AND '{_to_price}' ")
        where_str = f" WHERE {' AND '.join(where)} " if where else ""
        
        total_row_query=f"SELECT COUNT(*) from events {where_str}"
        total_rows=await db.get_many(total_row_query,None)
        print("total_count:",total_rows)
            
        
        base_query=f"SELECT CAST(eventid AS TEXT) as eventid,event_date,to_char(event_time, 'HH12:MIAM' ) as event_time,event_name,CAST(event_capacity AS TEXT) as event_capacity,CAST(event_ticket_price AS TEXT) as event_ticket_price,event_place,event_description,CAST(event_created_by AS TEXT) as event_created_by  FROM events {where_str} {order_str} LIMIT {limit} OFFSET {offset} "

        
        result=await db.get_many(base_query,None)
        print("results",result)
        
        if result is None or len(result) == 0:
            return custom_response(
                status_code=404,
                message="No events found",
                additional_response={"error": "No events found in the database"},
            )
        return custom_response(
            status_code=200,
            message="Successfully fetched events",
            additional_response={"data": result,"total_count":total_rows[0][0] if total_rows else 0},
        )
    except Exception as e:
        print("Error in get_events_service:", str(e))
        traceback.print_exc()
        return custom_response(
            status_code=400,
            message="Error in get_events_service",
            additional_response={"error": str(e)},
        )