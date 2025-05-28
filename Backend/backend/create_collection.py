import os
import time
from dotenv import load_dotenv
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.exception import AppwriteException
from appwrite.id import ID

# Load environment variables from .env file
load_dotenv()

# Get Appwrite configuration from environment variables
APPWRITE_ENDPOINT = os.getenv("APPWRITE_ENDPOINT", "https://cloud.appwrite.io/v1")
APPWRITE_PROJECT_ID = os.getenv("APPWRITE_PROJECT_ID")
APPWRITE_API_KEY = os.getenv("APPWRITE_API_KEY")
APPWRITE_DATABASE_ID = os.getenv("APPWRITE_DATABASE_ID")

# Format the endpoint URL if needed
if APPWRITE_ENDPOINT and not (APPWRITE_ENDPOINT.startswith("http://") or APPWRITE_ENDPOINT.startswith("https://")):
    # Assume it's just a region code
    APPWRITE_ENDPOINT = f"https://{APPWRITE_ENDPOINT}.cloud.appwrite.io/v1"

# Initialize Appwrite client
client = Client()
client.set_endpoint(APPWRITE_ENDPOINT)
client.set_project(APPWRITE_PROJECT_ID)
client.set_key(APPWRITE_API_KEY)

# Initialize Databases service
databases = Databases(client)

def create_company_collection():
    try:
        # Use fixed collection_id 'company'
        collection_id = "company"
        name = "Company"
        
        # Create the collection
        try:
            collection = databases.create_collection(
                database_id=APPWRITE_DATABASE_ID,
                collection_id=collection_id,
                name=name,
                permissions=[], # Public access
                document_security=False
            )
            print(f"Collection '{name}' created successfully with ID: {collection['$id']}")
            
            # Simple delay to ensure collection is registered in Appwrite
            print("Waiting for collection to be ready (5 seconds)...")
            time.sleep(5)
            
        except AppwriteException as e:
            if "already exists" in str(e).lower():
                print(f"Collection '{collection_id}' already exists. Proceeding with attribute creation.")
            else:
                raise e
        
        # Add attributes to the collection, one by one with delays to ensure processing
        try:
            # String attribute: name (required)
            try:
                print("Creating 'name' attribute...")
                databases.create_string_attribute(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=collection_id,
                    key="name",
                    size=100,
                    required=True
                )
                print("Created 'name' attribute (string, required)")
                time.sleep(2)  # Wait between attribute creation
            except AppwriteException as e:
                if "already exists" in str(e).lower():
                    print("Attribute 'name' already exists")
                else:
                    raise e
            
            # String attribute: industry (optional)
            try:
                print("Creating 'industry' attribute...")
                databases.create_string_attribute(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=collection_id,
                    key="industry",
                    size=50,
                    required=False
                )
                print("Created 'industry' attribute (string, optional)")
                time.sleep(2)  # Wait between attribute creation
            except AppwriteException as e:
                if "already exists" in str(e).lower():
                    print("Attribute 'industry' already exists")
                else:
                    raise e
            
            # Integer attribute: founded_year (required)
            try:
                print("Creating 'founded_year' attribute...")
                databases.create_integer_attribute(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=collection_id,
                    key="founded_year",
                    required=True,
                    min=1800,
                    max=2100
                )
                print("Created 'founded_year' attribute (integer, required)")
                time.sleep(2)  # Wait between attribute creation
            except AppwriteException as e:
                if "already exists" in str(e).lower():
                    print("Attribute 'founded_year' already exists")
                else:
                    raise e
            
            # Boolean attribute: is_active (default: True)
            try:
                print("Creating 'is_active' attribute...")
                databases.create_boolean_attribute(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=collection_id,
                    key="is_active",
                    required=False,
                    default=True
                )
                print("Created 'is_active' attribute (boolean, default: True)")
                time.sleep(2)  # Wait between attribute creation
            except AppwriteException as e:
                if "already exists" in str(e).lower():
                    print("Attribute 'is_active' already exists")
                else:
                    raise e
            
            # Integer attribute: employees (optional)
            try:
                print("Creating 'employees' attribute...")
                databases.create_integer_attribute(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=collection_id,
                    key="employees",
                    required=False,
                    min=0,
                    max=1000000
                )
                print("Created 'employees' attribute (integer, optional)")
                time.sleep(2)  # Wait between attribute creation
            except AppwriteException as e:
                if "already exists" in str(e).lower():
                    print("Attribute 'employees' already exists")
                else:
                    raise e
            
            print("\nAll attributes have been created for the 'company' collection.")
            print("Waiting for attributes to be indexed (10 seconds)...")
            time.sleep(10)
            
            # Create a test document
            print("\nAttempting to create a test company document...")
            test_company = {
                "name": "Appwrite Test Company",
                "industry": "Technology",
                "founded_year": 2023,
                "is_active": True,
                "employees": 42
            }
            
            try:
                document = databases.create_document(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=collection_id,
                    document_id=ID.unique(),
                    data=test_company
                )
                
                print(f"Test company created with ID: {document['$id']}")
                print("Collection setup completed successfully!")
            except AppwriteException as e:
                print(f"Couldn't create test document: {str(e)}")
                print("You may need to wait a bit longer for the attributes to be fully indexed.")
                print("Try running your FastAPI application in a few minutes.")
            
        except AppwriteException as e:
            print(f"Error creating attributes: {str(e)}")
                
    except AppwriteException as e:
        print(f"Appwrite Error: {str(e)}")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    create_company_collection() 