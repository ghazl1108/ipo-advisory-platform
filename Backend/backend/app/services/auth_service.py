from datetime import timedelta
from typing import Optional
from appwrite.client import Client
from appwrite.services.account import Account
from appwrite.services.users import Users
from appwrite.id import ID
from appwrite.query import Query
from appwrite.exception import AppwriteException
from fastapi import HTTPException, status
from ..models.user import UserCreate, UserInDB, User
from ..auth.jwt_auth import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Appwrite client
client = Client()
client.set_endpoint(os.getenv("APPWRITE_ENDPOINT"))
client.set_project(os.getenv("APPWRITE_PROJECT_ID"))
client.set_key(os.getenv("APPWRITE_API_KEY"))

account = Account(client)
users = Users(client)

async def authenticate_user(username: str, password: str) -> Optional[User]:
    try:
        # Try to login with Appwrite
        session = account.create_email_session(username, password)
        if session:
            # Get user details
            user = account.get()
            return User(
                id=user['$id'],
                email=user['email'],
                username=user['name'],
                is_active=True
            )
    except AppwriteException:
        return None
    return None

async def create_user(user: UserCreate) -> User:
    try:
        # Create user in Appwrite
        new_user = users.create(
            user_id=ID.unique(),
            email=user.email,
            password=user.password,
            name=user.username
        )
        
        return User(
            id=new_user['$id'],
            email=new_user['email'],
            username=new_user['name'],
            is_active=True
        )
    except AppwriteException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def create_access_token_for_user(user: User) -> str:
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    ) 