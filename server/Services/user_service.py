from DB.db import DB
from custom_response.custom_response import custom_response
from datetime import date
import traceback
db=DB()

async def get_user_by_id_service(user_id):
    try:
        base_query="""SELECT CAST(userid AS TEXT) as userid,username,email,CAST(phonecontact AS TEXT) as phonecontact,to_char(created_at AT TIME ZONE 'Asia/Kolkata','YYYY-MM-DD HH12:MIAM') as created_at FROM users WHERE userid=%s"""
        params=(user_id,)
        result=await db.get_one(base_query,params)
        if result is None or len(result) == 0:
            return custom_response(
                status_code=404,
                message="User not Found",
                additional_response={"error": f"No user found with id: {user_id}"}
            )
        return custom_response(
            status_code=200,
            message="Successfully fetched user",
            additional_response={
                "data":result
            }
        )
    except Exception as e:
        print("Error in get_user_by_id_service:", str(e))
        traceback.print_exc()
        return custom_response(
            status_code=400,
            message="Error in get_user_by_id_service",
            additional_response={"error": str(e)}
        )

async def update_user_service(user_id, user_data):
    try:
        if user_id is None:
            return custom_response(
                status_code=400,
                message="User ID is required for updating user",
                additional_response={"error": "User ID is missing"}
            )
        print("Updating user with id:", user_data)
        print("Username:", user_data.get("username"))
        print("Email:", user_data.get("email"))
        print("Phone Contact:", user_data.get("phonecontact"))
        if user_data is None:
            return custom_response(
                status_code=400,
                message="User data is required for updating user",
                additional_response={"error": "User data is missing"}
            )
        if user_data.get("username") is None or user_data.get("username") == "" or user_data.get("email") is None or user_data.get("email") == "" or user_data.get("phonecontact") is None or user_data.get("phonecontact") == "":
            return custom_response(
                status_code=400,
                message="Username, email, and phone contact are required for updating user",
                additional_response={"error": "Username, email, or phone contact is missing"}
            )
        
        base_query="""UPDATE users SET username=%s,email=%s, phonecontact=%s, updated_at=NOW() WHERE userid=%s """
        params=(user_data.get("username"),user_data.get("email"),user_data.get("phonecontact"),user_id)
        result=await db.get_many("SELECT * FROM users WHERE userid=%s", (user_id,))
        if result is None or len(result) == 0:
            return custom_response(
                status_code=404,
                message="User not found",
                additional_response={"error": f"No user found with id: {user_id}"}
            )
        await db.modify(base_query,params)
        return custom_response(
            status_code=200,
            message="Successfully updated user",
            additional_response={
                "data":user_data 
            }
        )
    except Exception as e:
        print("Error in update_user_service:", str(e))
        traceback.print_exc()
        return custom_response(
            status_code=400,
            message="Error in update_user_service",
            additional_response={"error": str(e)}
        )

async def create_user_service(user_data):
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
        
        order_str=f" ORDER BY {order_col} {order_col_dir} " if order_col and order_col_dir and order_col != "" and order_col_dir != "" else " ORDER BY created_at DESC "
        total_rows=f"SELECT COUNT(userid) as FULL_COUNT FROM users {where_str}"
        base_query=f"SELECT CAST(userid AS TEXT) as userid,username,email,phonecontact,to_char(created_at AT TIME ZONE 'Asia/Kolkata','YYYY-MM-DD HH12:MIAM') as created_at,to_char(updated_at AT TIME ZONE 'Asia/Kolkata','YYYY-MM-DD HH12:MIAM') as updated_at FROM users {where_str} {order_str} LIMIT {limit} OFFSET {offset}"
        total_count=await db.get_many(total_rows,None)
        result=await db.get_many(base_query,None)
        print("results:",result)
        
        return custom_response(
            status_code=200,
            message="Successfully fetched all users",
            additional_response={   
                "data": result,
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