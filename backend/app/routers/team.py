import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database.database import get_db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/team", tags=["team"])


@router.get("/members", response_model=List[schemas.TeamMember])
def list_team_members(
    supplier_id: int,
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Get all team members for a supplier.
    """
    try:
        members = db.query(models.TeamMember).filter(
            models.TeamMember.supplier_id == supplier_id
        ).offset(skip).limit(limit).all()
        
        return members
    except Exception as e:
        logger.error(f"Error fetching team members: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch team members"
        )


@router.get("/members/{member_id}", response_model=schemas.TeamMember)
def get_team_member(
    member_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific team member.
    """
    try:
        member = db.query(models.TeamMember).filter(models.TeamMember.id == member_id).first()
        
        if not member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team member not found"
            )
        
        return member
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching team member: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch team member"
        )


@router.post("/members", response_model=schemas.TeamMember, status_code=status.HTTP_201_CREATED)
def add_team_member(
    member: schemas.TeamMemberCreate,
    db: Session = Depends(get_db)
):
    """
    Add a new team member to a supplier.
    """
    try:
        # Check if supplier exists
        supplier = db.query(models.Supplier).filter(models.Supplier.id == member.supplier_id).first()
        if not supplier:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Supplier not found"
            )
        
        # Check if member already exists
        existing = db.query(models.TeamMember).filter(
            (models.TeamMember.supplier_id == member.supplier_id) &
            (models.TeamMember.user_id == member.user_id)
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is already a team member"
            )
        
        db_member = models.TeamMember(
            supplier_id=member.supplier_id,
            user_id=member.user_id,
            role=member.role,
            is_active=True
        )
        
        db.add(db_member)
        db.commit()
        db.refresh(db_member)
        
        logger.info(f"Team member added: supplier_id={member.supplier_id}, user_id={member.user_id}, role={member.role}")
        
        return db_member
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding team member: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add team member: {str(e)}"
        )


@router.put("/members/{member_id}", response_model=schemas.TeamMember)
def update_team_member(
    member_id: int,
    update: schemas.TeamMemberUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a team member's role or status.
    """
    try:
        db_member = db.query(models.TeamMember).filter(models.TeamMember.id == member_id).first()
        
        if not db_member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team member not found"
            )
        
        if update.role:
            db_member.role = update.role
        if update.is_active is not None:
            db_member.is_active = update.is_active
        
        db.commit()
        db.refresh(db_member)
        
        logger.info(f"Team member updated: id={member_id}")
        
        return db_member
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating team member: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update team member"
        )


@router.delete("/members/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_team_member(
    member_id: int,
    db: Session = Depends(get_db)
):
    """
    Remove a team member from a supplier.
    """
    try:
        db_member = db.query(models.TeamMember).filter(models.TeamMember.id == member_id).first()
        
        if not db_member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team member not found"
            )
        
        db.delete(db_member)
        db.commit()
        
        logger.info(f"Team member removed: id={member_id}")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error removing team member: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to remove team member"
        )
