from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import users
from .routes import companies
from .routes import ipo_routes

# Create FastAPI app
app = FastAPI(
    title="IPO Backend API",
    description="API backend For IPO Prediction Platform",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(companies.router)
app.include_router(ipo_routes.router)

# Root endpoint
@app.get("/", tags=["root"])
async def root():
    return {
        "message": "IPO Prediction Platform API",
        "description": "Complete IPO analysis with ML predictions and risk assessment",
        "version": "1.0.0",
        "endpoints": {
            "documentation": "/docs",
            "health": "/ipo/health",
            "submit_ipo_form": "/ipo/submit-multistep-form",
            "predictions": "/ipo/predictions/",
            "users": "/ipo/users/",
            "risk_analysis": "/ipo/risk-analysis/"
        },
        "features": [
            "User registration and management",
            "IPO data collection and validation", 
            "AI-powered price predictions",
            "Risk analysis and assessment",
            "Prediction history tracking",
            "Complete workflow integration"
        ]
    }

# Run with: uvicorn app.main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 