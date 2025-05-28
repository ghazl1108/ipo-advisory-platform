from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from ..models.company import CompanyCreate, CompanyUpdate, CompanyResponse, CompaniesListResponse
from ..services.company_service import CompanyService

router = APIRouter(prefix="/companies", tags=["companies"])


@router.post("/", response_model=CompanyResponse, status_code=201)
async def create_company(company_data: CompanyCreate):
    """Create a new company"""
    try:
        # Convert Pydantic model to dict, excluding unset values
        company_dict = company_data.dict(exclude_unset=True)
        company = await CompanyService.create_company(company_dict)
        return company
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(company_id: str):
    """Get company by ID"""
    try:
        company = await CompanyService.get_company(company_id)
        return company
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{company_id}", response_model=CompanyResponse)
async def update_company(company_id: str, company_data: CompanyUpdate):
    """Update company information"""
    try:
        # Filter out None values from the update data
        update_data = {k: v for k, v in company_data.dict(exclude_unset=True).items() if v is not None}
        company = await CompanyService.update_company(company_id, update_data)
        return company
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{company_id}")
async def delete_company(company_id: str):
    """Delete company by ID"""
    try:
        result = await CompanyService.delete_company(company_id)
        return {"message": f"Company {company_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=CompaniesListResponse)
async def list_companies(
    limit: Optional[int] = Query(25, description="Number of companies to return", ge=1, le=100),
    offset: Optional[int] = Query(0, description="Number of companies to skip", ge=0),
    order_by: Optional[str] = Query(None, description="Field to order by")
):
    """Get list of companies with optional filtering"""
    try:
        # Build Appwrite queries according to documentation
        queries = []
        
        # For limit, the correct syntax is "limit(25)"
        if limit is not None:
            queries.append(f"limit({limit})")
        
        # For offset, the correct syntax is "offset(10)"
        if offset is not None:
            queries.append(f"offset({offset})")
            
        # For order by, the correct syntax is "orderAsc('field')" or "orderDesc('field')"
        if order_by is not None:
            queries.append(f"orderAsc('{order_by}')")
        
        companies = await CompanyService.list_companies(queries)
        return {
            "total": companies["total"],
            "companies": companies["documents"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 