import os
from appwrite.client import Client
from appwrite.services.users import Users
from appwrite.services.databases import Databases
from appwrite.id import ID
from ..config import config

# Initialize Appwrite client
client = Client()

# Set endpoint with proper region format
# The endpoint should include the region, e.g. 'https://cloud.appwrite.io/v1' or 'https://us-east.cloud.appwrite.io/v1'
client.set_endpoint(config["appwrite"]["endpoint"])
client.set_project(config["appwrite"]["project_id"])
client.set_key(config["appwrite"]["api_key"])

# Initialize Appwrite services
users_service = Users(client)
databases_service = Databases(client)

# Company collection configuration
company_config = {
    "database_id": config["appwrite"].get("database_id", ""),
    "collection_id": config["appwrite"].get("collection_id", "company")
}

# Helper functions for the new IPO service
def get_client() -> Client:
    """Get the Appwrite client instance"""
    return client

def get_databases() -> Databases:
    """Get the Appwrite databases service instance"""
    return databases_service

def get_users() -> Users:
    """Get the Appwrite users service instance"""
    return users_service 