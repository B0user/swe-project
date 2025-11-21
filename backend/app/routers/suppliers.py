import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database.database import get_db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/suppliers", tags=["suppliers"])


@router.get("", response_model=List[schemas.Supplier])
def list_suppliers(
    skip: int = 0,
    limit: int = 10,
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    List all suppliers with optional filtering by category or search term.
    """
    query = db.query(models.Supplier)
    
    if search:
        query = query.filter(
            (models.Supplier.name.ilike(f"%{search}%")) |
            (models.Supplier.description.ilike(f"%{search}%"))
        )
    
    if category:
        query = query.filter(models.Supplier.category.ilike(f"%{category}%"))
    
    suppliers = query.offset(skip).limit(limit).all()
    return suppliers


@router.get("/{supplier_id}", response_model=schemas.Supplier)
def get_supplier(
    supplier_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific supplier by ID.
    """
    supplier = db.query(models.Supplier).filter(models.Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Supplier not found"
        )
    return supplier


@router.post("/link-request", response_model=dict)
def send_link_request(
    request: schemas.LinkRequest,
    db: Session = Depends(get_db)
):
    """
    Send a link request to a supplier.
    """
    try:
        # Check if supplier exists
        supplier = db.query(models.Supplier).filter(models.Supplier.id == request.supplier_id).first()
        if not supplier:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Supplier not found"
            )
        
        # Check if request already exists
        existing = db.query(models.LinkRequest).filter(
            (models.LinkRequest.supplier_id == request.supplier_id) &
            (models.LinkRequest.user_id == request.user_id) &
            (models.LinkRequest.status == "pending")
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Link request already exists"
            )
        
        # Create new link request
        db_request = models.LinkRequest(
            supplier_id=request.supplier_id,
            user_id=request.user_id,
            message=request.message,
            status="pending"
        )
        
        db.add(db_request)
        db.commit()
        db.refresh(db_request)
        
        logger.info(f"Link request created: user_id={request.user_id}, supplier_id={request.supplier_id}")
        
        return {
            "id": db_request.id,
            "status": "pending",
            "message": "Link request sent successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating link request: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send link request: {str(e)}"
        )


@router.get("/link-requests/user/{user_id}", response_model=List[schemas.LinkRequestResponse])
def get_user_link_requests(
    user_id: int,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all link requests for a user.
    """
    query = db.query(models.LinkRequest).filter(models.LinkRequest.user_id == user_id)
    
    if status:
        query = query.filter(models.LinkRequest.status == status)
    
    requests = query.all()
    return requests


@router.get("/link-requests/supplier/{supplier_id}", response_model=List[schemas.LinkRequestResponse])
def get_supplier_link_requests(
    supplier_id: int,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all link requests for a supplier.
    """
    query = db.query(models.LinkRequest).filter(models.LinkRequest.supplier_id == supplier_id)
    
    if status:
        query = query.filter(models.LinkRequest.status == status)
    
    requests = query.all()
    return requests


@router.put("/link-requests/{request_id}", response_model=schemas.LinkRequestResponse)
def update_link_request(
    request_id: int,
    update: schemas.LinkRequestUpdate,
    db: Session = Depends(get_db)
):
    """
    Accept or reject a link request.
    """
    try:
        db_request = db.query(models.LinkRequest).filter(models.LinkRequest.id == request_id).first()
        if not db_request:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Link request not found"
            )
        
        db_request.status = update.status
        db.commit()
        db.refresh(db_request)
        
        logger.info(f"Link request updated: id={request_id}, status={update.status}")
        
        return db_request
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating link request: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update link request: {str(e)}"
        )
