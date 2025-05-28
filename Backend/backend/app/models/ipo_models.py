from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

# User Models (Step 1 - Registration)
class UserCreate(BaseModel):
    companyName: str = Field(..., min_length=2, max_length=200)
    registrationNumber: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=255)

class UserUpdate(BaseModel):
    companyName: Optional[str] = Field(None, min_length=2, max_length=200)
    registrationNumber: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    isActive: Optional[bool] = None
    isVerified: Optional[bool] = None

class UserResponse(BaseModel):
    id: str = Field(..., alias="$id")
    companyName: str
    registrationNumber: str
    email: str
    isActive: bool
    isVerified: bool
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    class Config:
        populate_by_name = True

# IPO Prediction Models (Step 2 - Prediction Data)
class IPOPredictionCreate(BaseModel):
    userId: str
    
    # Industry and Exchange
    industryFF12: str = Field(..., description="Industry classification")
    exchange: str = Field(..., description="Exchange where shares will be listed")
    
    # Boolean indicators
    highTech: bool = Field(..., description="High tech firm indicator")
    egc: bool = Field(..., description="Emerging Growth Company indicator")
    vc: bool = Field(..., description="Venture capital backing indicator")
    pe: bool = Field(..., description="Private equity backing indicator")
    prominence: bool = Field(..., description="VC prominence")
    
    # Integer fields
    age: int = Field(..., ge=0, le=200, description="Firm age")
    year: int = Field(..., ge=1900, le=2100, description="Issue year")
    nUnderwriters: int = Field(..., ge=0, le=100, description="Count of underwriters")
    nVCs: int = Field(..., ge=0, le=100, description="Count of VC firms backing IPO firm")
    nExecutives: int = Field(..., ge=0, le=1000, description="Count of executives")
    nPatents: int = Field(..., ge=0, le=10000, description="Count of patents granted at time of IPO")
    
    # Float fields for financial data
    sharesOfferedPerc: float = Field(..., description="Shares offered as % of shares outstanding after offer")
    investmentReceived: float = Field(..., description="Total known amount invested in company ($000)")
    amountOnProspectus: float = Field(..., description="Total amount on prospectus (USD, Global)")
    commonEquity: float = Field(..., description="Tangible Common Equity Ratio Before Offer")
    sp2weeksBefore: float = Field(..., description="S&P 500 average 2 weeks before offer date")
    blueSky: float = Field(..., description="Blue sky expenses")
    managementFee: float = Field(..., description="Total management fee")
    bookValue: float = Field(..., description="Book value")
    totalAssets: float = Field(..., description="Total assets")
    totalRevenue: float = Field(..., description="Total revenue")
    netIncome: float = Field(..., description="Net income")
    roa: float = Field(..., description="Return on assets")
    leverage: float = Field(..., description="Leverage")
    priorFinancing: float = Field(..., description="Prior financing received")
    reputationLeadMax: float = Field(..., description="Lead underwriter reputation (max if more than one)")
    reputationAvg: float = Field(..., description="Average reputation of all underwriters")
    ipoSize: float = Field(..., description="IPO size in USD")

class IPOPredictionUpdate(BaseModel):
    industryFF12: Optional[str] = None
    exchange: Optional[str] = None
    highTech: Optional[bool] = None
    egc: Optional[bool] = None
    vc: Optional[bool] = None
    pe: Optional[bool] = None
    prominence: Optional[bool] = None
    age: Optional[int] = Field(None, ge=0, le=200)
    year: Optional[int] = Field(None, ge=1900, le=2100)
    nUnderwriters: Optional[int] = Field(None, ge=0, le=100)
    sharesOfferedPerc: Optional[float] = None
    investmentReceived: Optional[float] = None
    amountOnProspectus: Optional[float] = None
    commonEquity: Optional[float] = None
    sp2weeksBefore: Optional[float] = None
    blueSky: Optional[float] = None
    managementFee: Optional[float] = None
    bookValue: Optional[float] = None
    totalAssets: Optional[float] = None
    totalRevenue: Optional[float] = None
    netIncome: Optional[float] = None
    roa: Optional[float] = None
    leverage: Optional[float] = None
    nVCs: Optional[int] = Field(None, ge=0, le=100)
    nExecutives: Optional[int] = Field(None, ge=0, le=1000)
    priorFinancing: Optional[float] = None
    reputationLeadMax: Optional[float] = None
    reputationAvg: Optional[float] = None
    nPatents: Optional[int] = Field(None, ge=0, le=10000)
    ipoSize: Optional[float] = None
    
    # Prediction results
    predictedOfferPrice: Optional[float] = None
    predictedCloseDay1: Optional[float] = None
    predictionStatus: Optional[str] = None
    modelUsed: Optional[str] = None

class IPOPredictionResponse(BaseModel):
    id: str = Field(..., alias="$id")
    userId: str
    industryFF12: str
    exchange: str
    highTech: bool
    egc: bool
    vc: bool
    pe: bool
    prominence: bool
    age: int
    year: int
    nUnderwriters: int
    sharesOfferedPerc: float
    investmentReceived: float
    amountOnProspectus: float
    commonEquity: float
    sp2weeksBefore: float
    blueSky: float
    managementFee: float
    bookValue: float
    totalAssets: float
    totalRevenue: float
    netIncome: float
    roa: float
    leverage: float
    nVCs: int
    nExecutives: int
    priorFinancing: float
    reputationLeadMax: float
    reputationAvg: float
    nPatents: int
    ipoSize: float
    
    # Prediction results
    predictedOfferPrice: Optional[float] = None
    predictedCloseDay1: Optional[float] = None
    predictionStatus: Optional[str] = None
    modelUsed: Optional[str] = None
    
    # Metadata
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None
    predictedAt: Optional[datetime] = None

    class Config:
        populate_by_name = True

# Risk Analysis Models (Step 3 - Risk Analysis)
class RiskAnalysisCreate(BaseModel):
    userId: str
    ipoPredictionId: str
    additionalInfo: Optional[str] = Field(None, max_length=5000)
    uploadPdf: Optional[bool] = False

class RiskAnalysisUpdate(BaseModel):
    additionalInfo: Optional[str] = Field(None, max_length=5000)
    uploadPdf: Optional[bool] = None
    pdfFileId: Optional[str] = None
    pdfFileName: Optional[str] = None
    pdfFileSize: Optional[int] = None
    riskLevel: Optional[str] = None
    riskScore: Optional[float] = None
    riskFactors: Optional[str] = None
    analysisStatus: Optional[str] = None

class RiskAnalysisResponse(BaseModel):
    id: str = Field(..., alias="$id")
    userId: str
    ipoPredictionId: str
    additionalInfo: Optional[str] = None
    uploadPdf: bool
    pdfFileId: Optional[str] = None
    pdfFileName: Optional[str] = None
    pdfFileSize: Optional[int] = None
    riskLevel: Optional[str] = None
    riskScore: Optional[float] = None
    riskFactors: Optional[str] = None
    analysisStatus: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None
    analyzedAt: Optional[datetime] = None

    class Config:
        populate_by_name = True

# Prediction History Models
class PredictionHistoryCreate(BaseModel):
    userId: str
    ipoPredictionId: str
    predictionType: str = Field(..., description="offer_price, close_day1, or combined")
    predictedValue: float
    actualValue: Optional[float] = None
    confidenceScore: Optional[float] = None
    modelVersion: Optional[str] = None
    features: Optional[str] = None

class PredictionHistoryResponse(BaseModel):
    id: str = Field(..., alias="$id")
    userId: str
    ipoPredictionId: str
    predictionType: str
    predictedValue: float
    actualValue: Optional[float] = None
    confidenceScore: Optional[float] = None
    modelVersion: Optional[str] = None
    features: Optional[str] = None
    createdAt: Optional[datetime] = None
    isActive: bool = True

    class Config:
        populate_by_name = True

# Combined MultiStep Form Model
class MultiStepFormData(BaseModel):
    """Complete form data from MultiStepForm frontend"""
    # Step 1: Registration
    companyName: str
    registrationNumber: str
    email: EmailStr
    password: str
    
    # Step 2: Prediction Data
    industryFF12: str
    exchange: str
    highTech: str  # Will be converted to bool
    egc: str       # Will be converted to bool
    vc: str        # Will be converted to bool
    pe: str        # Will be converted to bool
    prominence: str # Will be converted to bool
    age: str       # Will be converted to int
    year: str      # Will be converted to int
    nUnderwriters: str # Will be converted to int
    sharesOfferedPerc: str # Will be converted to float
    investmentReceived: str # Will be converted to float
    amountOnProspectus: str # Will be converted to float
    commonEquity: str # Will be converted to float
    sp2weeksBefore: str # Will be converted to float
    blueSky: str # Will be converted to float
    managementFee: str # Will be converted to float
    bookValue: str # Will be converted to float
    totalAssets: str # Will be converted to float
    totalRevenue: str # Will be converted to float
    netIncome: str # Will be converted to float
    roa: str # Will be converted to float
    leverage: str # Will be converted to float
    nVCs: str # Will be converted to int
    nExecutives: str # Will be converted to int
    priorFinancing: str # Will be converted to float
    reputationLeadMax: str # Will be converted to float
    reputationAvg: str # Will be converted to float
    nPatents: str # Will be converted to int
    ipoSize: str # Will be converted to float
    
    # Step 3: Risk Analysis
    additionalInfo: Optional[str] = None
    uploadPdf: Optional[bool] = False

# Response Models
class UsersListResponse(BaseModel):
    total: int
    users: List[UserResponse]

class IPOPredictionsListResponse(BaseModel):
    total: int
    predictions: List[IPOPredictionResponse]

class RiskAnalysisListResponse(BaseModel):
    total: int
    analyses: List[RiskAnalysisResponse]

class PredictionHistoryListResponse(BaseModel):
    total: int
    history: List[PredictionHistoryResponse]

# AI Service Integration Models
class AIServicePredictionRequest(BaseModel):
    """Model for sending data to AI service"""
    samples: List[dict]

class AIServicePredictionResponse(BaseModel):
    """Model for receiving predictions from AI service"""
    predictions: List[dict]
    model_used: str
    timestamp: str

# Complete IPO Analysis Response
class CompleteIPOAnalysisResponse(BaseModel):
    """Complete response including user, prediction, and risk analysis"""
    user: UserResponse
    prediction: IPOPredictionResponse
    riskAnalysis: Optional[RiskAnalysisResponse] = None
    predictionHistory: List[PredictionHistoryResponse] = [] 