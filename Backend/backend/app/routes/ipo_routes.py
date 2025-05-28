from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, BackgroundTasks
from ..models.ipo_models import (
    UserCreate, UserUpdate, UserResponse, UsersListResponse,
    IPOPredictionCreate, IPOPredictionUpdate, IPOPredictionResponse, IPOPredictionsListResponse,
    RiskAnalysisCreate, RiskAnalysisUpdate, RiskAnalysisResponse, RiskAnalysisListResponse,
    PredictionHistoryResponse, PredictionHistoryListResponse,
    MultiStepFormData, CompleteIPOAnalysisResponse
)
from ..services.ipo_service import (
    UserService, IPOPredictionService, RiskAnalysisService, 
    PredictionHistoryService, IPOWorkflowService
)

router = APIRouter(prefix="/ipo", tags=["IPO Predictions"])

# MultiStep Form Complete Workflow
@router.post("/submit-multistep-form", response_model=CompleteIPOAnalysisResponse, status_code=201)
async def submit_multistep_form(form_data: MultiStepFormData, background_tasks: BackgroundTasks):
    """Submit complete MultiStepForm data and process IPO prediction workflow"""
    try:
        result = await IPOWorkflowService.process_multistep_form(form_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# NEW: Immediate Prediction Endpoint
@router.post("/predict-immediately", response_model=CompleteIPOAnalysisResponse, status_code=201)
async def predict_immediately(form_data: MultiStepFormData):
    """Submit form data and get immediate AI prediction with storage"""
    try:
        result = await IPOWorkflowService.process_immediate_prediction(form_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# User Management Routes
@router.post("/users/", response_model=UserResponse, status_code=201)
async def create_user(user_data: UserCreate):
    """Create a new user"""
    try:
        user_dict = user_data.dict()
        user = await UserService.create_user(user_dict)
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    """Get user by ID"""
    try:
        user = await UserService.get_user(user_id)
        return user
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, user_data: UserUpdate):
    """Update user information"""
    try:
        update_data = {k: v for k, v in user_data.dict(exclude_unset=True).items() if v is not None}
        user = await UserService.update_user(user_id, update_data)
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/users/{user_id}")
async def delete_user(user_id: str):
    """Delete user by ID"""
    try:
        result = await UserService.delete_user(user_id)
        return {"message": f"User {user_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/users/", response_model=UsersListResponse)
async def list_users(
    limit: Optional[int] = Query(25, description="Number of users to return", ge=1, le=100),
    offset: Optional[int] = Query(0, description="Number of users to skip", ge=0),
    order_by: Optional[str] = Query(None, description="Field to order by")
):
    """Get list of users with optional filtering"""
    try:
        from appwrite.query import Query as AppwriteQuery
        queries = []
        
        if limit is not None:
            queries.append(AppwriteQuery.limit(limit))
        
        if offset is not None:
            queries.append(AppwriteQuery.offset(offset))
            
        if order_by is not None:
            queries.append(AppwriteQuery.order_asc(order_by))
        
        users = await UserService.list_users(queries)
        return {
            "total": users["total"],
            "users": users["documents"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/users/email/{email}", response_model=UserResponse)
async def get_user_by_email(email: str):
    """Get user by email"""
    try:
        user = await UserService.get_user_by_email(email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except Exception as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))

# IPO Prediction Routes
@router.post("/predictions/", response_model=IPOPredictionResponse, status_code=201)
async def create_prediction(prediction_data: IPOPredictionCreate):
    """Create a new IPO prediction"""
    try:
        prediction_dict = prediction_data.dict()
        prediction = await IPOPredictionService.create_prediction(prediction_dict)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/predictions/{prediction_id}", response_model=IPOPredictionResponse)
async def get_prediction(prediction_id: str):
    """Get prediction by ID"""
    try:
        prediction = await IPOPredictionService.get_prediction(prediction_id)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/predictions/{prediction_id}", response_model=IPOPredictionResponse)
async def update_prediction(prediction_id: str, prediction_data: IPOPredictionUpdate):
    """Update prediction information"""
    try:
        update_data = {k: v for k, v in prediction_data.dict(exclude_unset=True).items() if v is not None}
        prediction = await IPOPredictionService.update_prediction(prediction_id, update_data)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/predictions/", response_model=IPOPredictionsListResponse)
async def list_predictions(
    limit: Optional[int] = Query(25, description="Number of predictions to return", ge=1, le=100),
    offset: Optional[int] = Query(0, description="Number of predictions to skip", ge=0),
    user_id: Optional[str] = Query(None, description="Filter by user ID"),
    status: Optional[str] = Query(None, description="Filter by prediction status")
):
    """Get list of predictions with optional filtering"""
    try:
        from appwrite.query import Query as AppwriteQuery
        queries = []
        
        if limit is not None:
            queries.append(AppwriteQuery.limit(limit))
        
        if offset is not None:
            queries.append(AppwriteQuery.offset(offset))
            
        if user_id is not None:
            queries.append(AppwriteQuery.equal("userId", user_id))
            
        if status is not None:
            queries.append(AppwriteQuery.equal("predictionStatus", status))
        
        predictions = await IPOPredictionService.list_predictions(queries)
        return {
            "total": predictions["total"],
            "predictions": predictions["documents"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/users/{user_id}/predictions", response_model=IPOPredictionsListResponse)
async def get_user_predictions(user_id: str):
    """Get all predictions for a specific user"""
    try:
        predictions = await IPOPredictionService.get_predictions_by_user(user_id)
        return {
            "total": predictions["total"],
            "predictions": predictions["documents"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/predictions/{prediction_id}/request-ai-prediction")
async def request_ai_prediction(prediction_id: str):
    """Request AI prediction for an existing prediction record"""
    try:
        # Get the prediction data
        prediction = await IPOPredictionService.get_prediction(prediction_id)
        
        # Request AI prediction
        ai_result = await IPOPredictionService.request_ai_prediction(prediction)
        
        # Update prediction with AI results
        update_data = {
            "predictedOfferPrice": ai_result.get("offer_price_prediction"),
            "predictedCloseDay1": ai_result.get("close_day1_prediction"),
            "predictionStatus": "completed",
            "modelUsed": ai_result.get("model_used", "ensemble")
        }
        
        updated_prediction = await IPOPredictionService.update_prediction(prediction_id, update_data)
        
        # Create history entries
        if ai_result.get("offer_price_prediction"):
            await PredictionHistoryService.create_history_entry({
                "userId": prediction["userId"],
                "ipoPredictionId": prediction_id,
                "predictionType": "offer_price",
                "predictedValue": ai_result["offer_price_prediction"],
                "modelVersion": ai_result.get("model_used", "ensemble")
            })
        
        if ai_result.get("close_day1_prediction"):
            await PredictionHistoryService.create_history_entry({
                "userId": prediction["userId"],
                "ipoPredictionId": prediction_id,
                "predictionType": "close_day1",
                "predictedValue": ai_result["close_day1_prediction"],
                "modelVersion": ai_result.get("model_used", "ensemble")
            })
        
        return {
            "message": "AI prediction completed successfully",
            "prediction": updated_prediction,
            "ai_result": ai_result
        }
        
    except Exception as e:
        # Update prediction status to failed if AI prediction fails
        try:
            await IPOPredictionService.update_prediction(prediction_id, {
                "predictionStatus": "failed"
            })
        except:
            pass
        raise HTTPException(status_code=400, detail=str(e))

# Risk Analysis Routes
@router.post("/risk-analysis/", response_model=RiskAnalysisResponse, status_code=201)
async def create_risk_analysis(risk_data: RiskAnalysisCreate):
    """Create a new risk analysis"""
    try:
        risk_dict = risk_data.dict()
        risk_analysis = await RiskAnalysisService.create_risk_analysis(risk_dict)
        return risk_analysis
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/risk-analysis/{analysis_id}", response_model=RiskAnalysisResponse)
async def get_risk_analysis(analysis_id: str):
    """Get risk analysis by ID"""
    try:
        risk_analysis = await RiskAnalysisService.get_risk_analysis(analysis_id)
        return risk_analysis
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/risk-analysis/{analysis_id}", response_model=RiskAnalysisResponse)
async def update_risk_analysis(analysis_id: str, risk_data: RiskAnalysisUpdate):
    """Update risk analysis information"""
    try:
        update_data = {k: v for k, v in risk_data.dict(exclude_unset=True).items() if v is not None}
        risk_analysis = await RiskAnalysisService.update_risk_analysis(analysis_id, update_data)
        return risk_analysis
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/predictions/{prediction_id}/risk-analysis", response_model=RiskAnalysisResponse)
async def get_risk_analysis_by_prediction(prediction_id: str):
    """Get risk analysis for a specific prediction"""
    try:
        risk_analysis = await RiskAnalysisService.get_risk_analysis_by_prediction(prediction_id)
        if not risk_analysis:
            raise HTTPException(status_code=404, detail="Risk analysis not found for this prediction")
        return risk_analysis
    except Exception as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))

# Prediction History Routes
@router.get("/users/{user_id}/history", response_model=PredictionHistoryListResponse)
async def get_user_prediction_history(user_id: str):
    """Get prediction history for a user"""
    try:
        history = await PredictionHistoryService.get_user_history(user_id)
        return {
            "total": history["total"],
            "history": history["documents"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Complete Analysis Routes
@router.get("/analysis/{user_id}/{prediction_id}", response_model=CompleteIPOAnalysisResponse)
async def get_complete_analysis(user_id: str, prediction_id: str):
    """Get complete IPO analysis including user, prediction, risk analysis, and history"""
    try:
        analysis = await IPOWorkflowService.get_complete_analysis(user_id, prediction_id)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

# Health check endpoint
@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "IPO Prediction API",
        "endpoints": {
            "submit_form": "/ipo/submit-multistep-form",
            "users": "/ipo/users/",
            "predictions": "/ipo/predictions/",
            "risk_analysis": "/ipo/risk-analysis/",
            "history": "/ipo/users/{user_id}/history",
            "complete_analysis": "/ipo/analysis/{user_id}/{prediction_id}"
        }
    } 