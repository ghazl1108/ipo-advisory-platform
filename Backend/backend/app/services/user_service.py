from typing import Dict, List, Any, Optional
from ..services.appwrite_client import users_service
from ..models.user import UserCreate, UserUpdate

class UserService:
    @staticmethod
    async def create_user(data: UserCreate) -> Dict[str, Any]:
        """Create a new user with bcrypt hashed password"""
        try:
            user = users_service.create_bcrypt_user(
                user_id="unique()",
                email=data.email,
                password=data.password,
                name=data.name
            )
            return user
        except Exception as e:
            raise Exception(f"Failed to create user: {str(e)}")

    @staticmethod
    async def get_user(user_id: str) -> Dict[str, Any]:
        """Get user by ID"""
        try:
            return users_service.get(user_id)
        except Exception as e:
            raise Exception(f"User not found: {str(e)}")

    @staticmethod
    async def update_user(user_id: str, data: UserUpdate) -> Dict[str, Any]:
        """Update user information"""
        try:
            updates = {}
            if data.email:
                updates["email"] = data.email
            if data.name:
                updates["name"] = data.name
            if data.prefs and isinstance(data.prefs, dict):
                updates["prefs"] = data.prefs
                
            # Apply updates
            if updates:
                return users_service.update_prefs(user_id, updates.get("prefs", {}))
            return users_service.get(user_id)
        except Exception as e:
            raise Exception(f"Failed to update user: {str(e)}")

    @staticmethod
    async def delete_user(user_id: str) -> Dict[str, Any]:
        """Delete user by ID"""
        try:
            return users_service.delete(user_id)
        except Exception as e:
            raise Exception(f"Failed to delete user: {str(e)}")

    @staticmethod
    async def list_users(queries: Optional[List[str]] = None) -> Dict[str, Any]:
        """List all users with optional filters"""
        try:
            return users_service.list(queries=queries)
        except Exception as e:
            raise Exception(f"Failed to list users: {str(e)}") 