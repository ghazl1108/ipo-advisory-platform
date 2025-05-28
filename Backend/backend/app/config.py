import os
from dotenv import load_dotenv
from typing import Dict, Any

# Load environment variables from .env file
load_dotenv()

# Appwrite configuration
# Default to global endpoint if no region is specified
APPWRITE_ENDPOINT = os.getenv("APPWRITE_ENDPOINT", "https://cloud.appwrite.io/v1")
APPWRITE_PROJECT_ID = os.getenv("APPWRITE_PROJECT_ID")
APPWRITE_API_KEY = os.getenv("APPWRITE_API_KEY")
APPWRITE_DATABASE_ID = os.getenv("APPWRITE_DATABASE_ID")
APPWRITE_COLLECTION_ID = os.getenv("APPWRITE_COLLECTION_ID", "company")

# Format the endpoint URL if needed
# If a region is specified but not included in the URL, this would format it properly
if APPWRITE_ENDPOINT and not (APPWRITE_ENDPOINT.startswith("http://") or APPWRITE_ENDPOINT.startswith("https://")):
    # Assume it's just a region code
    APPWRITE_ENDPOINT = f"https://{APPWRITE_ENDPOINT}.cloud.appwrite.io/v1"

# Validate configuration
if not APPWRITE_PROJECT_ID:
    raise ValueError("APPWRITE_PROJECT_ID environment variable is not set")
if not APPWRITE_API_KEY:
    raise ValueError("APPWRITE_API_KEY environment variable is not set")
if not APPWRITE_DATABASE_ID:
    raise ValueError("APPWRITE_DATABASE_ID environment variable is not set")

# Export configuration as a dictionary for easier access
config: Dict[str, Any] = {
    "appwrite": {
        "endpoint": APPWRITE_ENDPOINT,
        "project_id": APPWRITE_PROJECT_ID,
        "api_key": APPWRITE_API_KEY,
        "database_id": APPWRITE_DATABASE_ID,
        "collection_id": APPWRITE_COLLECTION_ID,
    }
} 