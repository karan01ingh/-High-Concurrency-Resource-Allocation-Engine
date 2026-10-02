from DB.db import DB
from custom_response.custom_response import custom_response
from datetime import date
import traceback
db=DB()

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

async def get_all_users_service(search_value,filter_value,order_col,order_col_dir,limit,offset):
    try:    
        # searching
        where=[]
        if search_value:
            where.append(f"""(
                CAST(userid AS TEXT) ILIKE '%{search_value}%' OR
                CAST(username AS TEXT) ILIKE '%{search_value}%' OR
                CAST(email AS TEXT) ILIKE '%{search_value}%' OR
                CAST(phonecontact AS TEXT) ILIKE '%{search_value}%' OR
                CAST(created_at AS TEXT) ILIKE '%{search_value}%' OR 
                CAST(updated_at AS TEXT) ILIKE '%{search_value}%'    
            )""")
            
        # filtering
        _to=date.today() if not filter_value.get("to_date") else filter_value.get("to_date")
        _from=date(1970,1,1) if not filter_value.get("from_date") else filter_value.get("from_date")
        where.append(f""" created_at BETWEEN '{_from}' AND '{_to}' """)
        
        
        where_str=f" WHERE {'AND'.join(where)} " if where else ""
        
        order_str=f" ORDER BY {order_col} {order_col_dir} " if order_col and order_col_dir else " ORDER BY created_at DESC "
        total_rows=f"SELECT COUNT(userid) as FULL_COUNT FROM users {where_str}"
        base_query=f"SELECT CAST(userid AS TEXT) as userid,username,email,phonecontact,to_char(created_at AT TIME ZONE 'Asia/Kolkata','YYYY-MM-DD HH12:MIAM') as created_at,to_char(updated_at AT TIME ZONE 'Asia/Kolkata','YYYY-MM-DD HH12:MIAM') as updated_at FROM users {where_str} {order_str} LIMIT {limit} OFFSET {offset}"
        total_count=await db.get_many(total_rows,None)
        results=await db.get_many(base_query,None)
        print("results:",results)
        
        return custom_response(
            status_code=200,
            message="Successfully fetched all users",
            additional_response={   
                "data": results,
                "total_count": total_count[0][0] if total_count else 0
            }
        )
    except Exception as e:
        print("Error in get_all_users_service:", str(e))
        traceback.print_exc()
        return custom_response(
            status_code=400,
            message="Error in get_all_users_service",
            additional_response={"error": str(e)}
        )