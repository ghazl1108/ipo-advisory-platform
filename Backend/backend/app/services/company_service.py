from typing import Dict, List, Any, Optional
from appwrite.exception import AppwriteException
from appwrite.id import ID
from .appwrite_client import databases_service, company_config


class CompanyService:
    @staticmethod
    async def create_company(data: dict) -> Dict[str, Any]:
        """
        Create a new company document in the Appwrite collection
        
        Args:
            data (dict): Company data including name, industry, etc.
            
        Returns:
            Dict[str, Any]: The created company document
        """
        try:
            # Generate a unique document ID using Appwrite's ID class
            document_id = ID.unique()
            
            # Create document in the collection
            document = databases_service.create_document(
                database_id=company_config["database_id"],
                collection_id=company_config["collection_id"],
                document_id=document_id,
                data=data
            )
            
            print(f"Company created successfully with ID: {document['$id']}")
            return document
        except AppwriteException as e:
            print(f"Error creating company: {str(e)}")
            raise Exception(f"Failed to create company: {str(e)}")
    
    @staticmethod
    async def get_company(document_id: str) -> Dict[str, Any]:
        """
        Retrieve a company document by its ID
        
        Args:
            document_id (str): The ID of the company document
            
        Returns:
            Dict[str, Any]: The company document
        """
        try:
            document = databases_service.get_document(
                database_id=company_config["database_id"],
                collection_id=company_config["collection_id"],
                document_id=document_id
            )
            
            print(f"Company retrieved successfully: {document['$id']}")
            return document
        except AppwriteException as e:
            print(f"Error retrieving company: {str(e)}")
            raise Exception(f"Company not found: {str(e)}")
    
    @staticmethod
    async def update_company(document_id: str, updates: dict) -> Dict[str, Any]:
        """
        Update a company document with new data
        
        Args:
            document_id (str): The ID of the company to update
            updates (dict): The fields to update and their new values
            
        Returns:
            Dict[str, Any]: The updated company document
        """
        try:
            document = databases_service.update_document(
                database_id=company_config["database_id"],
                collection_id=company_config["collection_id"],
                document_id=document_id,
                data=updates
            )
            
            print(f"Company updated successfully: {document['$id']}")
            return document
        except AppwriteException as e:
            print(f"Error updating company: {str(e)}")
            raise Exception(f"Failed to update company: {str(e)}")
    
    @staticmethod
    async def delete_company(document_id: str) -> Dict[str, Any]:
        """
        Delete a company document by its ID
        
        Args:
            document_id (str): The ID of the company to delete
            
        Returns:
            Dict[str, Any]: The deletion result
        """
        try:
            result = databases_service.delete_document(
                database_id=company_config["database_id"],
                collection_id=company_config["collection_id"],
                document_id=document_id
            )
            
            print(f"Company deleted successfully: {document_id}")
            return {"success": True, "message": f"Company {document_id} deleted successfully"}
        except AppwriteException as e:
            print(f"Error deleting company: {str(e)}")
            raise Exception(f"Failed to delete company: {str(e)}")
    
    @staticmethod
    async def list_companies(queries: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Retrieve a list of all companies
        
        Args:
            queries (Optional[List[str]]): Optional queries to filter results
            
        Returns:
            Dict[str, Any]: Object containing the list of companies and total count
        """
        try:
            documents = databases_service.list_documents(
                database_id=company_config["database_id"],
                collection_id=company_config["collection_id"],
                queries=queries
            )
            
            print(f"Successfully retrieved {documents['total']} companies")
            return documents
        except AppwriteException as e:
            print(f"Error listing companies: {str(e)}")
            raise Exception(f"Failed to list companies: {str(e)}") 