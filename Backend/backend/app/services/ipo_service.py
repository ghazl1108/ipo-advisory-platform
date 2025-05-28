import os
import json
import httpx
from typing import List, Dict, Optional
from datetime import datetime
from appwrite.exception import AppwriteException
from appwrite.id import ID
from ..services.appwrite_client import get_databases, get_client
from ..models.ipo_models import (
    UserCreate, UserUpdate, UserResponse,
    IPOPredictionCreate, IPOPredictionUpdate, IPOPredictionResponse,
    RiskAnalysisCreate, RiskAnalysisUpdate, RiskAnalysisResponse,
    PredictionHistoryCreate, PredictionHistoryResponse,
    MultiStepFormData, CompleteIPOAnalysisResponse,
    AIServicePredictionRequest
)

APPWRITE_DATABASE_ID = os.getenv("APPWRITE_DATABASE_ID")
AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://localhost:8001")

class UserService:
    @staticmethod
    async def create_user(user_data: dict) -> dict:
        """Create a new user"""
        try:
            databases = get_databases()
            
            # Add timestamps
            user_data["createdAt"] = datetime.now().isoformat()
            user_data["updatedAt"] = datetime.now().isoformat()
            
            result = databases.create_document(
                database_id=APPWRITE_DATABASE_ID,
                collection_id="users",
                document_id=ID.unique(),
                data=user_data
            )
            return result
        except AppwriteException as e:
            raise Exception(f"Failed to create user: {str(e)}")

    @staticmethod
    async def get_user(user_id: str) -> dict:
        """Get user by ID"""
        try:
            databases = get_databases()
            result = databases.get_document(
                database_id=APPWRITE_DATABASE_ID,
                collection_id="users",
                document_id=user_id
            )
            return result
        except AppwriteException as e:
            raise Exception(f"User not found: {str(e)}")

    @staticmethod
    async def get_user_by_email(email: str) -> Optional[dict]:
        """Get user by email"""
        try:
            databases = get_databases()
            from appwrite.query import Query
            result = databases.list_documents(
                database_id=APPWRITE_DATABASE_ID,
                collection_id="users",
                queries=[Query.equal("email", email)]
            )
            
            if result["total"] > 0:
                return result["documents"][0]
            return None
        except AppwriteException as e:
            raise Exception(f"Failed to find user by email: {str(e)}")

    @staticmethod
    async def update_user(user_id: str, user_data: dict) -> dict:
        """Update user"""
        try:
            databases = get_databases()
            
            # Add update timestamp
            user_data["updatedAt"] = datetime.now().isoformat()
            
            result = databases.update_document(
                database_id=APPWRITE_DATABASE_ID,
                collection_id="users",
                document_id=user_id,
                data=user_data
            )
            return result
        except AppwriteException as e:
            raise Exception(f"Failed to update user: {str(e)}")

    @staticmethod
    async def delete_user(user_id: str) -> bool:
        """Delete user"""
        try:
            databases = get_databases()
            databases.delete_document(
                database_id=APPWRITE_DATABASE_ID,
                collection_id="users",
                document_id=user_id
            )
            return True
        except AppwriteException as e:
            raise Exception(f"Failed to delete user: {str(e)}")

    @staticmethod
    async def list_users(queries: List[str] = None) -> dict:
        """List users with optional filtering"""
        try:
            databases = get_databases()
            result = databases.list_documents(
                database_id=APPWRITE_DATABASE_ID,
                collection_id="users",
                queries=queries or []
            )
            return result
        except AppwriteException as e:
            raise Exception(f"Failed to list users: {str(e)}")


class IPOPredictionService:
    @staticmethod
    def _convert_form_data_to_prediction(form_data: MultiStepFormData, user_id: str) -> dict:
        """Convert MultiStepForm data to IPO prediction format"""
        return {
            "userId": user_id,
            "industryFF12": form_data.industryFF12,
            "exchange": form_data.exchange,
            "highTech": form_data.highTech.lower() == "true",
            "egc": form_data.egc.lower() == "true",
            "vc": form_data.vc.lower() == "true",
            "pe": form_data.pe.lower() == "true",
            "prominence": form_data.prominence.lower() == "true",
            "age": int(form_data.age),
            "year": int(form_data.year),
            "nUnderwriters": int(form_data.nUnderwriters),
            "sharesOfferedPerc": float(form_data.sharesOfferedPerc),
            "investmentReceived": float(form_data.investmentReceived),
            "amountOnProspectus": float(form_data.amountOnProspectus),
            "commonEquity": float(form_data.commonEquity),
            "sp2weeksBefore": float(form_data.sp2weeksBefore),
            "blueSky": float(form_data.blueSky),
            "managementFee": float(form_data.managementFee),
            "bookValue": float(form_data.bookValue),
            "totalAssets": float(form_data.totalAssets),
            "totalRevenue": float(form_data.totalRevenue),
            "netIncome": float(form_data.netIncome),
            "roa": float(form_data.roa),
            "leverage": float(form_data.leverage),
            "nVCs": int(form_data.nVCs),
            "nExecutives": int(form_data.nExecutives),
            "priorFinancing": float(form_data.priorFinancing),
            "reputationLeadMax": float(form_data.reputationLeadMax),
            "reputationAvg": float(form_data.reputationAvg),
            "nPatents": int(form_data.nPatents),
            "ipoSize": float(form_data.ipoSize),
            "predictionStatus": "pending",
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat()
        }

    @staticmethod
    async def create_prediction(prediction_data: dict) -> dict:
        """Create IPO prediction"""
        try:
            databases = get_databases()
            
            result = databases.create_document(
                database_id=APPWRITE_DATABASE_ID,
                collection_id="ipo_predictions",
                document_id=ID.unique(),
                data=prediction_data
            )
            return result
        except AppwriteException as e:
            raise Exception(f"Failed to create prediction: {str(e)}")

    @staticmethod
    async def get_prediction(prediction_id: str) -> dict:
        """Get prediction by ID"""
        try:
            databases = get_databases()
            result = databases.get_document(
                database_id=APPWRITE_DATABASE_ID,
                collection_id="ipo_predictions",
                document_id=prediction_id
            )
            return result
        except AppwriteException as e:
            raise Exception(f"Prediction not found: {str(e)}")

    @staticmethod
    async def update_prediction(prediction_id: str, prediction_data: dict) -> dict:
        """Update prediction"""
        try:
            databases = get_databases()
            
            # Add update timestamp
            prediction_data["updatedAt"] = datetime.now().isoformat()
            
            result = databases.update_document(
                database_id=APPWRITE_DATABASE_ID,
                collection_id="ipo_predictions",
                document_id=prediction_id,
                data=prediction_data
            )
            return result
        except AppwriteException as e:
            raise Exception(f"Failed to update prediction: {str(e)}")

    @staticmethod
    async def get_predictions_by_user(user_id: str) -> dict:
        """Get all predictions for a user"""
        try:
            databases = get_databases()
            from appwrite.query import Query
            result = databases.list_documents(
                database_id=APPWRITE_DATABASE_ID,
                collection_id="ipo_predictions",
                queries=[Query.equal("userId", user_id)]
            )
            return result
        except AppwriteException as e:
            raise Exception(f"Failed to get user predictions: {str(e)}")

    @staticmethod
    async def list_predictions(queries: List[str] = None) -> dict:
        """List predictions with optional filtering"""
        try:
            databases = get_databases()
            result = databases.list_documents(
                database_id=APPWRITE_DATABASE_ID,
                collection_id="ipo_predictions",
                queries=queries or []
            )
            return result
        except AppwriteException as e:
            raise Exception(f"Failed to list predictions: {str(e)}")

    @staticmethod
    async def request_ai_prediction(prediction_data: dict) -> dict:
        """Request AI prediction from external service"""
        try:
            AI_SERVICE_URL = "http://localhost:8001"
            
            # Convert prediction data to AI service format
            ai_data = {
                "age": prediction_data["age"],
                "egc": 1 if prediction_data["egc"] else 0,
                "highTech": 1 if prediction_data["highTech"] else 0,
                "year": prediction_data["year"],
                "exchange": prediction_data["exchange"],
                "industryFF12": prediction_data["industryFF12"],
                "nUnderwriters": prediction_data["nUnderwriters"],
                "sharesOfferedPerc": prediction_data["sharesOfferedPerc"],
                "investmentReceived": prediction_data["investmentReceived"],
                "amountOnProspectus": prediction_data["amountOnProspectus"],
                "commonEquity": prediction_data["commonEquity"],
                "sp2weeksBefore": prediction_data["sp2weeksBefore"],
                "blueSky": prediction_data["blueSky"],
                "managementFee": prediction_data["managementFee"],
                "bookValue": prediction_data["bookValue"],
                "totalAssets": prediction_data["totalAssets"],
                "totalRevenue": prediction_data["totalRevenue"],
                "netIncome": prediction_data["netIncome"],
                "roa": prediction_data["roa"],
                "leverage": prediction_data["leverage"],
                "vc": 1 if prediction_data["vc"] else 0,
                "pe": 1 if prediction_data["pe"] else 0,
                "prominence": 1 if prediction_data["prominence"] else 0,
                "nVCs": prediction_data["nVCs"],
                "nExecutives": prediction_data["nExecutives"],
                "priorFinancing": prediction_data["priorFinancing"],
                "reputationLeadMax": prediction_data["reputationLeadMax"],
                "reputationAvg": prediction_data["reputationAvg"],
                "nPatents": prediction_data["nPatents"],
                "ipoSize": prediction_data["ipoSize"]
            }

            request_data = {"samples": [ai_data]}

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{AI_SERVICE_URL}/predict/combined",
                    json=request_data,
                    timeout=30.0
                )
                response.raise_for_status()
                ai_response = response.json()
                
                # Extract predictions from AI response
                if ai_response and len(ai_response) > 0:
                    prediction = ai_response[0]
                    return {
                        "offer_price_prediction": prediction.get("predicted_offer_price"),
                        "close_day1_prediction": prediction.get("predicted_close_day1"),
                        "model_used": "ensemble",
                        "confidence_offer": prediction.get("offer_price_confidence"),
                        "confidence_close": prediction.get("close_day1_confidence"),
                        "feature_importances": prediction.get("feature_importances", {})
                    }
                else:
                    raise Exception("Empty response from AI service")

        except Exception as e:
            raise Exception(f"AI service request failed: {str(e)}")

    @staticmethod
    async def request_ai_prediction_robust(prediction_data: dict) -> dict:
        """Robust AI prediction request with fallback logic"""
        try:
            # First try the normal AI service
            return await IPOPredictionService.request_ai_prediction(prediction_data)
        except Exception as e:
            print(f"AI service failed: {e}")
            # Fallback to simple prediction logic based on historical data
            return await IPOPredictionService._fallback_prediction(prediction_data)
    
    @staticmethod
    async def _fallback_prediction(prediction_data: dict) -> dict:
        """Fallback prediction logic when AI service fails"""
        try:
            # Simple heuristic-based prediction
            ipoSize = prediction_data.get("ipoSize", 0)
            totalRevenue = prediction_data.get("totalRevenue", 0)
            netIncome = prediction_data.get("netIncome", 0)
            
            # Base price estimation
            base_price = 15.0  # Default IPO price
            
            # Adjust based on company size
            if ipoSize > 500000000:  # Large IPO
                base_price *= 1.5
            elif ipoSize > 100000000:  # Medium IPO
                base_price *= 1.2
            
            # Adjust based on profitability
            if netIncome > 0 and totalRevenue > 0:
                profit_margin = netIncome / totalRevenue
                if profit_margin > 0.2:  # Highly profitable
                    base_price *= 1.3
                elif profit_margin > 0.1:  # Moderately profitable
                    base_price *= 1.1
            
            # Adjust based on tech premium
            if prediction_data.get("highTech"):
                base_price *= 1.2
            
            # Estimate first day performance (typically 10-30% bump for successful IPOs)
            first_day_multiplier = 1.15 + (0.1 * (base_price / 20.0))  # Dynamic based on offer price
            
            return {
                "offer_price_prediction": round(base_price, 2),
                "close_day1_prediction": round(base_price * first_day_multiplier, 2),
                "model_used": "fallback_heuristic",
                "confidence_offer": 0.7,
                "confidence_close": 0.6,
                "feature_importances": {}
            }
        except Exception as e:
            # Last resort - return default values
            return {
                "offer_price_prediction": 15.0,
                "close_day1_prediction": 17.25,
                "model_used": "default",
                "confidence_offer": 0.5,
                "confidence_close": 0.5,
                "feature_importances": {}
            }


class RiskAnalysisService:
    @staticmethod
    async def create_risk_analysis(risk_data: dict) -> dict:
        """Create risk analysis"""
        try:
            databases = get_databases()
            
            # Add timestamps
            risk_data["createdAt"] = datetime.now().isoformat()
            risk_data["updatedAt"] = datetime.now().isoformat()
            
            result = databases.create_document(
                database_id=APPWRITE_DATABASE_ID,
                collection_id="risk_analysis",
                document_id=ID.unique(),
                data=risk_data
            )
            return result
        except AppwriteException as e:
            raise Exception(f"Failed to create risk analysis: {str(e)}")

    @staticmethod
    async def get_risk_analysis(analysis_id: str) -> dict:
        """Get risk analysis by ID"""
        try:
            databases = get_databases()
            result = databases.get_document(
                database_id=APPWRITE_DATABASE_ID,
                collection_id="risk_analysis",
                document_id=analysis_id
            )
            return result
        except AppwriteException as e:
            raise Exception(f"Risk analysis not found: {str(e)}")

    @staticmethod
    async def get_risk_analysis_by_prediction(prediction_id: str) -> Optional[dict]:
        """Get risk analysis by prediction ID"""
        try:
            databases = get_databases()
            from appwrite.query import Query
            result = databases.list_documents(
                database_id=APPWRITE_DATABASE_ID,
                collection_id="risk_analysis",
                queries=[Query.equal("ipoPredictionId", prediction_id)]
            )
            
            if result["total"] > 0:
                return result["documents"][0]
            return None
        except AppwriteException as e:
            raise Exception(f"Failed to get risk analysis: {str(e)}")

    @staticmethod
    async def update_risk_analysis(analysis_id: str, risk_data: dict) -> dict:
        """Update risk analysis"""
        try:
            databases = get_databases()
            
            # Add update timestamp
            risk_data["updatedAt"] = datetime.now().isoformat()
            
            result = databases.update_document(
                database_id=APPWRITE_DATABASE_ID,
                collection_id="risk_analysis",
                document_id=analysis_id,
                data=risk_data
            )
            return result
        except AppwriteException as e:
            raise Exception(f"Failed to update risk analysis: {str(e)}")


class PredictionHistoryService:
    @staticmethod
    async def create_history_entry(history_data: dict) -> dict:
        """Create prediction history entry"""
        try:
            databases = get_databases()
            
            # Add timestamp
            history_data["createdAt"] = datetime.now().isoformat()
            
            result = databases.create_document(
                database_id=APPWRITE_DATABASE_ID,
                collection_id="prediction_history",
                document_id=ID.unique(),
                data=history_data
            )
            return result
        except AppwriteException as e:
            raise Exception(f"Failed to create history entry: {str(e)}")

    @staticmethod
    async def get_user_history(user_id: str) -> dict:
        """Get prediction history for a user"""
        try:
            databases = get_databases()
            from appwrite.query import Query
            result = databases.list_documents(
                database_id=APPWRITE_DATABASE_ID,
                collection_id="prediction_history",
                queries=[Query.equal("userId", user_id)]
            )
            return result
        except AppwriteException as e:
            raise Exception(f"Failed to get user history: {str(e)}")


class IPOWorkflowService:
    """Service to handle the complete IPO workflow"""
    
    @staticmethod
    async def process_multistep_form(form_data: MultiStepFormData) -> CompleteIPOAnalysisResponse:
        """Process complete MultiStepForm submission"""
        try:
            # Step 1: Create or get user
            existing_user = await UserService.get_user_by_email(form_data.email)
            
            if existing_user:
                user = existing_user
            else:
                user_data = {
                    "companyName": form_data.companyName,
                    "registrationNumber": form_data.registrationNumber,
                    "email": form_data.email,
                    "password": form_data.password,  # Should be hashed in production
                    "isActive": True,
                    "isVerified": False
                }
                user = await UserService.create_user(user_data)

            # Step 2: Create IPO prediction
            prediction_data = IPOPredictionService._convert_form_data_to_prediction(form_data, user["$id"])
            prediction = await IPOPredictionService.create_prediction(prediction_data)

            # Step 3: Request AI prediction
            try:
                ai_result = await IPOPredictionService.request_ai_prediction_robust(prediction_data)
                
                # Update prediction with AI results
                update_data = {
                    "predictedOfferPrice": ai_result.get("offer_price_prediction"),
                    "predictedCloseDay1": ai_result.get("close_day1_prediction"),
                    "predictionStatus": "completed",
                    "modelUsed": ai_result.get("model_used", "ensemble"),
                    "predictedAt": datetime.now().isoformat()
                }
                
                prediction = await IPOPredictionService.update_prediction(prediction["$id"], update_data)
                
                # Create history entries
                if ai_result.get("offer_price_prediction"):
                    await PredictionHistoryService.create_history_entry({
                        "userId": user["$id"],
                        "ipoPredictionId": prediction["$id"],
                        "predictionType": "offer_price",
                        "predictedValue": ai_result["offer_price_prediction"],
                        "modelVersion": ai_result.get("model_used", "ensemble")
                    })
                
                if ai_result.get("close_day1_prediction"):
                    await PredictionHistoryService.create_history_entry({
                        "userId": user["$id"],
                        "ipoPredictionId": prediction["$id"],
                        "predictionType": "close_day1",
                        "predictedValue": ai_result["close_day1_prediction"],
                        "modelVersion": ai_result.get("model_used", "ensemble")
                    })
                    
            except Exception as e:
                # Update prediction status to failed
                await IPOPredictionService.update_prediction(prediction["$id"], {
                    "predictionStatus": "failed"
                })
                print(f"AI prediction failed: {str(e)}")

            # Step 4: Create risk analysis if provided
            risk_analysis = None
            if form_data.additionalInfo or form_data.uploadPdf:
                risk_data = {
                    "userId": user["$id"],
                    "ipoPredictionId": prediction["$id"],
                    "additionalInfo": form_data.additionalInfo,
                    "uploadPdf": form_data.uploadPdf or False,
                    "analysisStatus": "pending"
                }
                risk_analysis = await RiskAnalysisService.create_risk_analysis(risk_data)

            # Get prediction history
            history_result = await PredictionHistoryService.get_user_history(user["$id"])

            return {
                "user": user,
                "prediction": prediction,
                "riskAnalysis": risk_analysis,
                "predictionHistory": history_result.get("documents", [])
            }

        except Exception as e:
            raise Exception(f"Failed to process IPO workflow: {str(e)}")

    @staticmethod
    async def process_immediate_prediction(form_data: MultiStepFormData) -> CompleteIPOAnalysisResponse:
        """Process form data with immediate AI prediction and storage"""
        try:
            # Step 1: Create or get user (same as regular workflow)
            existing_user = await UserService.get_user_by_email(form_data.email)
            
            if existing_user:
                user = existing_user
            else:
                user_data = {
                    "companyName": form_data.companyName,
                    "registrationNumber": form_data.registrationNumber,
                    "email": form_data.email,
                    "password": form_data.password,
                    "isActive": True,
                    "isVerified": False
                }
                user = await UserService.create_user(user_data)

            # Step 2: Convert form data and immediately request AI prediction
            prediction_data = IPOPredictionService._convert_form_data_to_prediction(form_data, user["$id"])
            
            # Step 3: Get AI prediction BEFORE creating database record
            print("Requesting AI prediction...")
            ai_result = await IPOPredictionService.request_ai_prediction_robust(prediction_data)
            print(f"AI prediction result: {ai_result}")
            
            # Step 4: Create prediction with AI results already included
            prediction_data.update({
                "predictedOfferPrice": ai_result.get("offer_price_prediction"),
                "predictedCloseDay1": ai_result.get("close_day1_prediction"),
                "predictionStatus": "completed",
                "modelUsed": ai_result.get("model_used", "ensemble"),
                "predictedAt": datetime.now().isoformat()
            })
            
            prediction = await IPOPredictionService.create_prediction(prediction_data)

            # Step 5: Create history entries immediately
            if ai_result.get("offer_price_prediction"):
                await PredictionHistoryService.create_history_entry({
                    "userId": user["$id"],
                    "ipoPredictionId": prediction["$id"],
                    "predictionType": "offer_price",
                    "predictedValue": ai_result["offer_price_prediction"],
                    "modelVersion": ai_result.get("model_used", "ensemble")
                })
            
            if ai_result.get("close_day1_prediction"):
                await PredictionHistoryService.create_history_entry({
                    "userId": user["$id"],
                    "ipoPredictionId": prediction["$id"],
                    "predictionType": "close_day1",
                    "predictedValue": ai_result["close_day1_prediction"],
                    "modelVersion": ai_result.get("model_used", "ensemble")
                })

            # Step 6: Create risk analysis if provided
            risk_analysis = None
            if form_data.additionalInfo or form_data.uploadPdf:
                risk_data = {
                    "userId": user["$id"],
                    "ipoPredictionId": prediction["$id"],
                    "additionalInfo": form_data.additionalInfo,
                    "uploadPdf": form_data.uploadPdf or False,
                    "analysisStatus": "completed"  # Mark as completed for immediate processing
                }
                risk_analysis = await RiskAnalysisService.create_risk_analysis(risk_data)

            # Step 7: Get updated prediction history
            history_result = await PredictionHistoryService.get_user_history(user["$id"])

            return {
                "user": user,
                "prediction": prediction,
                "riskAnalysis": risk_analysis,
                "predictionHistory": history_result.get("documents", [])
            }

        except Exception as e:
            raise Exception(f"Failed to process immediate prediction: {str(e)}")

    @staticmethod
    async def get_complete_analysis(user_id: str, prediction_id: str) -> CompleteIPOAnalysisResponse:
        """Get complete IPO analysis for a user and prediction"""
        try:
            user = await UserService.get_user(user_id)
            prediction = await IPOPredictionService.get_prediction(prediction_id)
            risk_analysis = await RiskAnalysisService.get_risk_analysis_by_prediction(prediction_id)
            history_result = await PredictionHistoryService.get_user_history(user_id)

            return {
                "user": user,
                "prediction": prediction,
                "riskAnalysis": risk_analysis,
                "predictionHistory": history_result.get("documents", [])
            }

        except Exception as e:
            raise Exception(f"Failed to get complete analysis: {str(e)}") 