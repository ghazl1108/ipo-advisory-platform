from pydantic import BaseModel, Field, conint
from typing import Optional, Dict, Any, List


class CompanyCreate(BaseModel):
    """Schema for company creation request"""
    name: str = Field(..., min_length=1, max_length=100)
    industry: Optional[str] = Field(None, max_length=50)
    founded_year: conint(ge=1800, le=2100)
    is_active: bool = True
    employees: Optional[conint(ge=0, le=1000000)] = None


class CompanyUpdate(BaseModel):
    """Schema for company update request"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    industry: Optional[str] = Field(None, max_length=50)
    founded_year: Optional[conint(ge=1800, le=2100)] = None
    is_active: Optional[bool] = None
    employees: Optional[conint(ge=0, le=1000000)] = None


class CompanyResponse(BaseModel):
    """Schema for API responses containing company data"""
    id: str = Field(alias="$id")
    name: str
    industry: Optional[str] = None
    founded_year: int
    is_active: bool
    employees: Optional[int] = None
    
    class Config:
        from_attributes = True
        populate_by_name = True


class CompaniesListResponse(BaseModel):
    """Schema for API responses containing a list of companies"""
    total: int
    companies: List[CompanyResponse]
    
    @classmethod
    def from_appwrite_response(cls, response: Dict[str, Any]):
        """Convert Appwrite response to our schema format"""
        return cls(
            total=response["total"],
            companies=response["documents"]
        ) 