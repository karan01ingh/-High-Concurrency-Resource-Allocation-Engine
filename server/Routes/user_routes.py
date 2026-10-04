from fastapi import APIRouter, Request
from Controllers.user_controller import (
    get_all_users,
    get_user_by_id,
    update_user,
    create_user,
)

router = APIRouter()


@router.post("/all")
async def get_user_route(request: Request):
    return await get_all_users(request)


@router.get("/{user_id}")
async def get_user_by_id_route(user_id: int):
    return await get_user_by_id(user_id)


@router.patch("/{user_id}")
async def update_user_route(request: Request, user_id: int):
    return await update_user(request, user_id)


@router.post("/")
async def create_user_route(request:Request,user_data: dict):
    return await create_user(request,user_data)
