# Appwrite Backend API

A scalable Python backend using Appwrite Cloud platform with FastAPI.

## Features

- User management (CRUD operations)
- Integration with Appwrite Cloud
- RESTful API endpoints
- Proper error handling
- Environment configuration

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py                  # Load .env vars
│   ├── main.py                    # FastAPI app entry
│   ├── routes/
│   │   ├── __init__.py
│   │   └── users.py               # CRUD endpoints for user
│   ├── services/
│   │   ├── __init__.py
│   │   ├── appwrite_client.py     # Setup Appwrite client
│   │   ├── user_service.py        # CRUD logic for Appwrite users
│   └── models/
│       ├── __init__.py
│       └── user.py                # Pydantic schema for user request/response
├── .env
├── requirements.txt
└── README.md
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the root directory with the following content:
   ```
   APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   APPWRITE_PROJECT_ID=your_project_id
   APPWRITE_API_KEY=your_api_key
   ```
   Replace `your_project_id` and `your_api_key` with your actual Appwrite credentials.

## Running the Server

```
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000.

## API Documentation

Once the server is running, you can access the interactive API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### User Management

- `POST /users/` - Create a new user
- `GET /users/{user_id}` - Get user by ID
- `PUT /users/{user_id}` - Update user
- `DELETE /users/{user_id}` - Delete user
- `GET /users/` - List all users

## Appwrite Setup

Make sure you have created a project in Appwrite Cloud and have the necessary API key with permissions for user management. 