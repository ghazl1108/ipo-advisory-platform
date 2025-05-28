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

def create_attribute_safely(collection_id, attr_type, key, **kwargs):
    """Helper function to create attributes safely with error handling"""
    try:
        print(f"Creating '{key}' attribute...")
        
        if attr_type == "string":
            databases.create_string_attribute(
                database_id=APPWRITE_DATABASE_ID,
                collection_id=collection_id,
                key=key,
                **kwargs
            )
        elif attr_type == "integer":
            databases.create_integer_attribute(
                database_id=APPWRITE_DATABASE_ID,
                collection_id=collection_id,
                key=key,
                **kwargs
            )
        elif attr_type == "float":
            databases.create_float_attribute(
                database_id=APPWRITE_DATABASE_ID,
                collection_id=collection_id,
                key=key,
                **kwargs
            )
        elif attr_type == "boolean":
            databases.create_boolean_attribute(
                database_id=APPWRITE_DATABASE_ID,
                collection_id=collection_id,
                key=key,
                **kwargs
            )
        elif attr_type == "datetime":
            databases.create_datetime_attribute(
                database_id=APPWRITE_DATABASE_ID,
                collection_id=collection_id,
                key=key,
                **kwargs
            )
        
        print(f"Created '{key}' attribute ({attr_type})")
        time.sleep(2)  # Wait between attribute creation
        
    except AppwriteException as e:
        if "already exists" in str(e).lower():
            print(f"Attribute '{key}' already exists")
        else:
            raise e

def create_collection_safely(collection_id, name):
    """Helper function to create collections safely with error handling"""
    try:
        collection = databases.create_collection(
            database_id=APPWRITE_DATABASE_ID,
            collection_id=collection_id,
            name=name,
            permissions=[],  # Public access
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

def create_users_collection():
    """Create users collection for authentication and company registration"""
    print("\n=== Creating Users Collection ===")
    
    collection_id = "users"
    name = "Users"
    
    create_collection_safely(collection_id, name)
    
    # User registration attributes from MultiStepForm step 1
    create_attribute_safely(collection_id, "string", "companyName", size=200, required=True)
    create_attribute_safely(collection_id, "string", "registrationNumber", size=100, required=True)
    create_attribute_safely(collection_id, "string", "email", size=255, required=True)
    create_attribute_safely(collection_id, "string", "password", size=255, required=True)  # Will be hashed
    
    # Additional user metadata
    create_attribute_safely(collection_id, "datetime", "createdAt", required=False)
    create_attribute_safely(collection_id, "datetime", "updatedAt", required=False)
    create_attribute_safely(collection_id, "boolean", "isActive", required=False, default=True)
    create_attribute_safely(collection_id, "boolean", "isVerified", required=False, default=False)
    
    print("\nUsers collection attributes created successfully!")

def create_ipo_predictions_collection():
    """Create IPO predictions collection for all prediction data"""
    print("\n=== Creating IPO Predictions Collection ===")
    
    collection_id = "ipo_predictions"
    name = "IPO Predictions"
    
    create_collection_safely(collection_id, name)
    
    # Link to user
    create_attribute_safely(collection_id, "string", "userId", size=50, required=True)
    
    # Industry and Exchange (dropdown fields)
    create_attribute_safely(collection_id, "string", "industryFF12", size=50, required=True)
    create_attribute_safely(collection_id, "string", "exchange", size=20, required=True)
    
    # Boolean indicators
    create_attribute_safely(collection_id, "boolean", "highTech", required=True)
    create_attribute_safely(collection_id, "boolean", "egc", required=True)
    create_attribute_safely(collection_id, "boolean", "vc", required=True)
    create_attribute_safely(collection_id, "boolean", "pe", required=True)
    create_attribute_safely(collection_id, "boolean", "prominence", required=True)
    
    # Integer fields
    create_attribute_safely(collection_id, "integer", "age", required=True, min=0, max=200)
    create_attribute_safely(collection_id, "integer", "year", required=True, min=1900, max=2100)
    create_attribute_safely(collection_id, "integer", "nUnderwriters", required=True, min=0, max=100)
    create_attribute_safely(collection_id, "integer", "nVCs", required=True, min=0, max=100)
    create_attribute_safely(collection_id, "integer", "nExecutives", required=True, min=0, max=1000)
    create_attribute_safely(collection_id, "integer", "nPatents", required=True, min=0, max=10000)
    
    # Float/Decimal fields for financial data
    create_attribute_safely(collection_id, "float", "sharesOfferedPerc", required=True)
    create_attribute_safely(collection_id, "float", "investmentReceived", required=True)
    create_attribute_safely(collection_id, "float", "amountOnProspectus", required=True)
    create_attribute_safely(collection_id, "float", "commonEquity", required=True)
    create_attribute_safely(collection_id, "float", "sp2weeksBefore", required=True)
    create_attribute_safely(collection_id, "float", "blueSky", required=True)
    create_attribute_safely(collection_id, "float", "managementFee", required=True)
    create_attribute_safely(collection_id, "float", "bookValue", required=True)
    create_attribute_safely(collection_id, "float", "totalAssets", required=True)
    create_attribute_safely(collection_id, "float", "totalRevenue", required=True)
    create_attribute_safely(collection_id, "float", "netIncome", required=True)
    create_attribute_safely(collection_id, "float", "roa", required=True)
    create_attribute_safely(collection_id, "float", "leverage", required=True)
    create_attribute_safely(collection_id, "float", "priorFinancing", required=True)
    create_attribute_safely(collection_id, "float", "reputationLeadMax", required=True)
    create_attribute_safely(collection_id, "float", "reputationAvg", required=True)
    create_attribute_safely(collection_id, "float", "ipoSize", required=True)
    
    # Prediction results (populated by AI service)
    create_attribute_safely(collection_id, "float", "predictedOfferPrice", required=False)
    create_attribute_safely(collection_id, "float", "predictedCloseDay1", required=False)
    create_attribute_safely(collection_id, "string", "predictionStatus", size=50, required=False)  # pending, completed, failed
    create_attribute_safely(collection_id, "string", "modelUsed", size=50, required=False)  # xgboost, ensemble, etc.
    
    # Metadata
    create_attribute_safely(collection_id, "datetime", "createdAt", required=False)
    create_attribute_safely(collection_id, "datetime", "updatedAt", required=False)
    create_attribute_safely(collection_id, "datetime", "predictedAt", required=False)
    
    print("\nIPO Predictions collection attributes created successfully!")

def create_risk_analysis_collection():
    """Create risk analysis collection for additional risk assessment data"""
    print("\n=== Creating Risk Analysis Collection ===")
    
    collection_id = "risk_analysis"
    name = "Risk Analysis"
    
    create_collection_safely(collection_id, name)
    
    # Link to user and IPO prediction
    create_attribute_safely(collection_id, "string", "userId", size=50, required=True)
    create_attribute_safely(collection_id, "string", "ipoPredictionId", size=50, required=True)
    
    # Risk analysis data from MultiStepForm step 3
    create_attribute_safely(collection_id, "string", "additionalInfo", size=5000, required=False)
    create_attribute_safely(collection_id, "boolean", "uploadPdf", required=False, default=False)
    
    # File information if PDF uploaded
    create_attribute_safely(collection_id, "string", "pdfFileId", size=100, required=False)  # Appwrite file ID
    create_attribute_safely(collection_id, "string", "pdfFileName", size=255, required=False)
    create_attribute_safely(collection_id, "integer", "pdfFileSize", required=False, min=0, max=10485760)  # 10MB max
    
    # Risk analysis results
    create_attribute_safely(collection_id, "string", "riskLevel", size=20, required=False)  # low, medium, high
    create_attribute_safely(collection_id, "float", "riskScore", required=False)  # 0-100
    create_attribute_safely(collection_id, "string", "riskFactors", size=2000, required=False)  # JSON string of risk factors
    create_attribute_safely(collection_id, "string", "analysisStatus", size=50, required=False)  # pending, completed, failed
    
    # Metadata
    create_attribute_safely(collection_id, "datetime", "createdAt", required=False)
    create_attribute_safely(collection_id, "datetime", "updatedAt", required=False)
    create_attribute_safely(collection_id, "datetime", "analyzedAt", required=False)
    
    print("\nRisk Analysis collection attributes created successfully!")

def create_prediction_history_collection():
    """Create prediction history collection to track multiple predictions per user"""
    print("\n=== Creating Prediction History Collection ===")
    
    collection_id = "prediction_history"
    name = "Prediction History"
    
    create_collection_safely(collection_id, name)
    
    # Links
    create_attribute_safely(collection_id, "string", "userId", size=50, required=True)
    create_attribute_safely(collection_id, "string", "ipoPredictionId", size=50, required=True)
    
    # Prediction tracking
    create_attribute_safely(collection_id, "string", "predictionType", size=50, required=True)  # offer_price, close_day1, combined
    create_attribute_safely(collection_id, "float", "predictedValue", required=True)
    create_attribute_safely(collection_id, "float", "actualValue", required=False)  # For tracking accuracy later
    create_attribute_safely(collection_id, "float", "confidenceScore", required=False)
    
    # Model information
    create_attribute_safely(collection_id, "string", "modelVersion", size=50, required=False)
    create_attribute_safely(collection_id, "string", "features", size=5000, required=False)  # JSON string of features used
    
    # Metadata
    create_attribute_safely(collection_id, "datetime", "createdAt", required=False)
    create_attribute_safely(collection_id, "boolean", "isActive", required=False, default=True)
    
    print("\nPrediction History collection attributes created successfully!")

def create_test_documents():
    """Create test documents for each collection"""
    print("\n=== Creating Test Documents ===")
    
    try:
        # Test user
        print("Creating test user...")
        test_user = {
            "companyName": "Test IPO Company",
            "registrationNumber": "REG123456",
            "email": "test@ipocompany.com",
            "password": "hashed_password_here",
            "isActive": True,
            "isVerified": False
        }
        
        user_doc = databases.create_document(
            database_id=APPWRITE_DATABASE_ID,
            collection_id="users",
            document_id=ID.unique(),
            data=test_user
        )
        
        print(f"Test user created with ID: {user_doc['$id']}")
        
        # Test IPO prediction
        print("Creating test IPO prediction...")
        test_prediction = {
            "userId": user_doc['$id'],
            "industryFF12": "Technology",
            "exchange": "NASDAQ",
            "highTech": True,
            "egc": True,
            "vc": True,
            "pe": False,
            "prominence": True,
            "age": 10,
            "year": 2024,
            "nUnderwriters": 3,
            "sharesOfferedPerc": 25.5,
            "investmentReceived": 5000000.0,
            "amountOnProspectus": 100000000.0,
            "commonEquity": 0.75,
            "sp2weeksBefore": 4500.0,
            "blueSky": 50000.0,
            "managementFee": 0.07,
            "bookValue": 15.0,
            "totalAssets": 50000000.0,
            "totalRevenue": 20000000.0,
            "netIncome": 2000000.0,
            "roa": 0.04,
            "leverage": 0.3,
            "nVCs": 2,
            "nExecutives": 5,
            "priorFinancing": 10000000.0,
            "reputationLeadMax": 9.0,
            "reputationAvg": 8.5,
            "nPatents": 15,
            "ipoSize": 100000000.0,
            "predictionStatus": "pending"
        }
        
        prediction_doc = databases.create_document(
            database_id=APPWRITE_DATABASE_ID,
            collection_id="ipo_predictions",
            document_id=ID.unique(),
            data=test_prediction
        )
        
        print(f"Test IPO prediction created with ID: {prediction_doc['$id']}")
        
        # Test risk analysis
        print("Creating test risk analysis...")
        test_risk = {
            "userId": user_doc['$id'],
            "ipoPredictionId": prediction_doc['$id'],
            "additionalInfo": "This is additional risk analysis information.",
            "uploadPdf": False,
            "analysisStatus": "pending"
        }
        
        risk_doc = databases.create_document(
            database_id=APPWRITE_DATABASE_ID,
            collection_id="risk_analysis",
            document_id=ID.unique(),
            data=test_risk
        )
        
        print(f"Test risk analysis created with ID: {risk_doc['$id']}")
        
        print("\nAll test documents created successfully!")
        
    except AppwriteException as e:
        print(f"Error creating test documents: {str(e)}")
        print("You may need to wait a bit longer for the attributes to be fully indexed.")

def main():
    """Main function to create all collections"""
    print("Starting IPO Platform Collections Creation...")
    print("=" * 50)
    
    try:
        # Create all collections
        create_users_collection()
        create_ipo_predictions_collection()
        create_risk_analysis_collection()
        create_prediction_history_collection()
        
        print("\n" + "=" * 50)
        print("Waiting for all collections to be fully indexed (15 seconds)...")
        time.sleep(15)
        
        # Create test documents
        create_test_documents()
        
        print("\n" + "=" * 50)
        print("🎉 All collections created successfully!")
        print("\nCollections created:")
        print("✅ users - User registration and authentication")
        print("✅ ipo_predictions - IPO data and ML predictions")
        print("✅ risk_analysis - Risk assessment data")
        print("✅ prediction_history - Prediction tracking")
        print("\nYour backend is now ready to connect with the frontend!")
        
    except AppwriteException as e:
        print(f"Appwrite Error: {str(e)}")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main() 