from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from ..models.user import UserCreate, User
from ..services.auth_service import (
    authenticate_user,
    create_user,
    create_access_token_for_user,
    get_current_active_user
)
from ..auth.jwt_auth import Token

router = APIRouter()

@router.post("/register", response_model=User)
async def register(user: UserCreate):
    return await create_user(user)

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token_for_user(user)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user 