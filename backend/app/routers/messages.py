import logging
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database.database import get_db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/messages", tags=["messages"])


@router.get("/conversations", response_model=List[schemas.Conversation])
def list_conversations(
    user_id: int,
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Get all conversations for a user.
    """
    try:
        conversations = db.query(models.Conversation).filter(
            (models.Conversation.user1_id == user_id) |
            (models.Conversation.user2_id == user_id)
        ).offset(skip).limit(limit).all()
        
        return conversations
    except Exception as e:
        logger.error(f"Error fetching conversations: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch conversations"
        )


@router.get("/conversations/{conversation_id}", response_model=schemas.ConversationDetail)
def get_conversation(
    conversation_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific conversation with all messages.
    """
    try:
        conversation = db.query(models.Conversation).filter(
            models.Conversation.id == conversation_id
        ).first()
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
        
        return conversation
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching conversation: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch conversation"
        )


@router.get("/conversations/{conversation_id}/messages", response_model=List[schemas.Message])
def get_conversation_messages(
    conversation_id: int,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """
    Get all messages in a conversation.
    """
    try:
        # Verify conversation exists
        conversation = db.query(models.Conversation).filter(
            models.Conversation.id == conversation_id
        ).first()
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
        
        messages = db.query(models.Message).filter(
            models.Message.conversation_id == conversation_id
        ).offset(skip).limit(limit).all()
        
        return messages
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching messages: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch messages"
        )


@router.post("/conversations", response_model=schemas.Conversation)
def create_conversation(
    conversation: schemas.ConversationCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new conversation between two users.
    """
    try:
        # Check if conversation already exists
        existing = db.query(models.Conversation).filter(
            ((models.Conversation.user1_id == conversation.user1_id) &
             (models.Conversation.user2_id == conversation.user2_id)) |
            ((models.Conversation.user1_id == conversation.user2_id) &
             (models.Conversation.user2_id == conversation.user1_id))
        ).first()
        
        if existing:
            return existing
        
        db_conversation = models.Conversation(
            user1_id=conversation.user1_id,
            user2_id=conversation.user2_id
        )
        
        db.add(db_conversation)
        db.commit()
        db.refresh(db_conversation)
        
        logger.info(f"Conversation created: user1={conversation.user1_id}, user2={conversation.user2_id}")
        
        return db_conversation
    except Exception as e:
        logger.error(f"Error creating conversation: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create conversation"
        )


@router.post("/", response_model=schemas.Message)
def send_message(
    message: schemas.MessageCreate,
    db: Session = Depends(get_db)
):
    """
    Send a message in a conversation.
    """
    try:
        # Verify conversation exists
        conversation = db.query(models.Conversation).filter(
            models.Conversation.id == message.conversation_id
        ).first()
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
        
        db_message = models.Message(
            conversation_id=message.conversation_id,
            sender_id=message.sender_id,
            content=message.content,
            created_at=datetime.utcnow()
        )
        
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
        
        logger.info(f"Message sent: conversation_id={message.conversation_id}, sender_id={message.sender_id}")
        
        return db_message
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error sending message: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send message"
        )


@router.get("/{message_id}", response_model=schemas.Message)
def get_message(
    message_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific message.
    """
    try:
        message = db.query(models.Message).filter(models.Message.id == message_id).first()
        
        if not message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Message not found"
            )
        
        return message
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching message: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch message"
        )


@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message(
    message_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a message.
    """
    try:
        message = db.query(models.Message).filter(models.Message.id == message_id).first()
        
        if not message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Message not found"
            )
        
        db.delete(message)
        db.commit()
        
        logger.info(f"Message deleted: id={message_id}")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting message: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete message"
        )
