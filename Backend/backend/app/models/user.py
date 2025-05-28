from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any, List


class UserBase(BaseModel):
    email: EmailStr
    username: str


class UserCreate(UserBase):
    """Schema for user creation request"""
    password: str
    name: str = Field(..., min_length=1)


class UserInDB(UserBase):
    hashed_password: str


class User(UserBase):
    id: str
    is_active: bool = True

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    """Schema for user update request"""
    email: Optional[EmailStr] = None
    name: Optional[str] = Field(None, min_length=1)
    prefs: Optional[Dict[str, Any]] = None


class UserResponse(BaseModel):
    """Schema for API responses containing user data"""
    id: str = Field(alias="$id")
    email: str
    name: str
    status: bool
    prefs: Optional[Dict[str, Any]] = None
    registration: Optional[str] = None
    
    class Config:
        from_attributes = True
        populate_by_name = True


class UsersListResponse(BaseModel):
    """Schema for API responses containing a list of users"""
    total: int
    users: List[UserResponse] 