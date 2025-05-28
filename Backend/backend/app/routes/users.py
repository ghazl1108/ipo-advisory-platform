from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, Query
from ..models.user import UserCreate, UserUpdate, UserResponse, UsersListResponse
from ..services.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(user_data: UserCreate):
    """Create a new user"""
    try:
        user = await UserService.create_user(user_data)
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    """Get user by ID"""
    try:
        user = await UserService.get_user(user_id)
        return user
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, user_data: UserUpdate):
    """Update user information"""
    try:
        user = await UserService.update_user(user_id, user_data)
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{user_id}", response_model=dict)
async def delete_user(user_id: str):
    """Delete user by ID"""
    try:
        result = await UserService.delete_user(user_id)
        return {"message": "User deleted successfully", "result": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=UsersListResponse)
async def list_users(
    queries: Optional[List[str]] = Query(None, description="Filter queries for user list")
):
    """Get list of users with optional filtering"""
    try:
        result = await UserService.list_users(queries)
        return {
            "total": result["total"],
            "users": result["users"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 