from DB.db import DB
from custom_response.custom_response import custom_response
from datetime import date
import traceback
import psycopg
import bcrypt
import re

db = DB()

# have to send off set and limit from the front end for pagination , we r not adding conditiion for this


async def get_user_by_id_service(user_id):
    try:
        base_query = """SELECT CAST(userid AS TEXT) as userid,username,email,CAST(phonecontact AS TEXT) as phonecontact,to_char(created_at AT TIME ZONE 'Asia/Kolkata','YYYY-MM-DD HH12:MIAM') as created_at FROM users WHERE userid=%s"""
        params = (user_id,)
        result = await db.get_one(base_query, params)
        if result is None or len(result) == 0:
            return custom_response(
                status_code=404,
                message="User not Found",
                additional_response={"error": f"No user found with id: {user_id}"},
            )
        return custom_response(
            status_code=200,
            message="Successfully fetched user",
            additional_response={"data": result},
        )
    except Exception as e:
        print("Error in get_user_by_id_service:", str(e))
        traceback.print_exc()
        return custom_response(
            status_code=400,
            message="Internal Error in get_user_by_id_service",
            additional_response={"Error": str(e)},
        )


async def update_user_service(user_id, user_data):
    try:
        if user_id is None:
            return custom_response(
                status_code=400,
                message="User ID is required for updating user",
                additional_response={"error": "User ID is missing"},
            )
        print("Updating user with id:", user_data)
        print("Username:", user_data.get("username"))
        print("Email:", user_data.get("email"))
        print("Phone Contact:", user_data.get("phonecontact"))
        if not user_data:
            return custom_response(
                status_code=400,
                message="User data is required for updating user",
                additional_response={"error": "User data is missing"},
            )
        if (
            not user_data.get("username")
            or not user_data.get("email")
            or not user_data.get("phonecontact")
        ):
            return custom_response(
                status_code=400,
                message="Username, email, and phone contact are required for updating user",
                additional_response={
                    "error": "Username, email, or phone contact is missing"
                },
            )

        base_query = """UPDATE users SET username=%s,email=%s, phonecontact=%s, updated_at=NOW() WHERE userid=%s  RETURNING userid"""
        params = (
            user_data.get("username"),
            user_data.get("email"),
            user_data.get("phonecontact"),
            user_id,
        )
        result = await db.modify(base_query, params)
        if not result:
            return custom_response(
                status_code=404, message="Invalid userid", additional_response={}
            )

        return custom_response(
            status_code=200,
            message="Successfully updated user",
            additional_response={"data": user_data},
        )
    except Exception as e:
        print("Error in update_user_service:", str(e))
        traceback.print_exc()
        return custom_response(
            status_code=400,
            message="Internal Error in update_user_service",
            additional_response={"Error": str(e)},
        )


async def create_user_service(user_data):
    try:
        if not user_data:
            return custom_response(
                status_code=404,
                message="User data is missing",
                additional_response={"error": "Please provide User data"},
            )
        if (
            not user_data.get("username")
            or not user_data.get("role")
            or not user_data.get("email")
            or not user_data.get("phonecontact")
            or not user_data.get("password")
        ):
            return custom_response(
                status_code=404,
                message="Mandatory Fields are missing",
                additional_response={"error": " Please provide all mandatory fields"},
            )

        if user_data.get("role") not in ("admin", "user", "organizer"):
            return custom_response(
                status_code=400,
                message="Invalid Role",
                additional_response={"error": "Invalid Role"},
            )
        if not re.fullmatch(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", user_data.get("email")):
            return custom_response(
                status_code=400,
                message="Invalid email",
                additional_response={"error": "Please provide a valid email address"},
            )
        if not re.fullmatch(r"[6-9]\d{9}", user_data.get("phonecontact")):
            return custom_response(
                status_code=400,
                message="Invalid phone number",
                additional_response={
                    "error": "Please provide a valid 10-digit Indian mobile number"
                },
            )
        if len(user_data.get("password")) < 8:
            return custom_response(
                status_code=400,
                message="Password length is smaller then 8 ",
                additional_response={
                    "error": " Password must be at least 8 characters long"
                },
            )
        if not re.search(r"[A-Za-z]", user_data.get("password")) or not re.search(
            r"\d", user_data.get("password")
        ):
            return custom_response(
                status_code=400,
                message="Invalid password",
                additional_response={
                    "error": "Password must contain at least one letter and one number"
                },
            )
        password = user_data.get("password")

        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")
        base_query = f"INSERT INTO users (username,role,email,phonecontact,password) values (%s,%s,%s,%s,%s) RETURNING userid"
        params = (
            user_data.get("username"),
            user_data.get("role"),
            user_data.get("email"),
            user_data.get("phonecontact"),
            hashed_password,
        )
        result = await db.modify(base_query, params)
        if not result:
            return custom_response(
                status_code=500,
                message="Internal server error in creating user",
                additional_response={"error": "Try after sometime"},
            )
        return custom_response(
            status_code=201,
            message="User created successfully",
            additional_response={"data": result},
        )

    except psycopg.errors.UniqueViolation:
        return custom_response(
            status_code=409,
            message="User already exists",
            additional_response={
                "error": "Email or phone number is already registered"
            },
        )
    except Exception as e:
        print("Error in the create user service:", str(e))
        traceback.print_exc()
        return custom_response(
            status_code=400,
            message="Internal Error in the create_user_service",
            additional_response={"Error": str(e)},
        )


async def get_all_users_service(
    search_value, filter_value, order_col, order_col_dir, limit, offset
):
    try:
        # searching
        where = []
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
        _to = (
            date.today()
            if not filter_value.get("to_date")
            else filter_value.get("to_date")
        )
        _from = (
            date(1970, 1, 1)
            if not filter_value.get("from_date")
            else filter_value.get("from_date")
        )
        where.append(f""" created_at BETWEEN '{_from}' AND '{_to}' """)
        where_str = f" WHERE {'AND'.join(where)} " if where else ""

        order_str = (
            f" ORDER BY {order_col} {order_col_dir} "
            if order_col
            and order_col_dir
            and order_col_dir.upper() in ["ASC", "DESC"]
            and order_col.lower()
            in [
                "userid",
                "username",
                "email",
                "phonecontact",
                "created_at",
                "updated_at",
            ]
            else " ORDER BY username DESC "
        )

        total_rows = f"SELECT COUNT(userid) as FULL_COUNT FROM users {where_str}"

        base_query = f"SELECT CAST(userid AS TEXT) as userid,username,email,phonecontact,to_char(created_at AT TIME ZONE 'Asia/Kolkata','YYYY-MM-DD HH12:MIAM') as created_at,to_char(updated_at AT TIME ZONE 'Asia/Kolkata','YYYY-MM-DD HH12:MIAM') as updated_at FROM users {where_str} {order_str} LIMIT {limit} OFFSET {offset}"
        total_count = await db.get_many(total_rows, None)
        print("total_count:", total_count)
        result = await db.get_many(base_query, None)
        print("results:", result)

        return custom_response(
            status_code=200,
            message="Successfully fetched all users",
            additional_response={
                "data": result,
                "total_count": total_count[0][0] if total_count else 0,
            },
        )
    except Exception as e:
        print("Error in get_all_users_service:", str(e))
        traceback.print_exc()
        return custom_response(
            status_code=400,
            message="Internal Error in get_all_users_service",
            additional_response={"Error": str(e)},
        )
