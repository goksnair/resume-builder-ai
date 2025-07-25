from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from ....core.database import get_sync_db_session
from ....services.conversation_service import ConversationalResumeBuilder
from ....schemas.pydantic.conversation import (
    StartConversationRequest, StartConversationResponse,
    ProcessResponseRequest, ProcessResponseResponse,
    ResumePreview
)
from ....models.conversation import ConversationSession, UserCareerProfile

router = APIRouter(prefix="/conversation", tags=["conversation"])


@router.post("/start", response_model=StartConversationResponse)
async def start_conversation(
    request: StartConversationRequest,
    db: Session = Depends(get_sync_db_session)
):
    """Initialize ROCKET Framework-based conversation"""
    try:
        conversation_service = ConversationalResumeBuilder(db)
        response = await conversation_service.initiate_conversation(request.user_id)
        
        return StartConversationResponse(
            session_id=response.session_id,
            message=response.message,
            phase=response.phase
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start conversation: {str(e)}"
        )


@router.post("/respond", response_model=ProcessResponseResponse)
async def process_user_response(
    request: ProcessResponseRequest,
    db: Session = Depends(get_sync_db_session)
):
    """Process user input through ROCKET Framework methodology"""
    try:
        conversation_service = ConversationalResumeBuilder(db)
        response = await conversation_service.process_response(request.session_id, request.user_input)
        
        return ProcessResponseResponse(
            message=response.message,
            phase=response.phase,
            progress_percentage=response.progress_percentage,
            follow_up_strategy=response.follow_up_strategy
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process response: {str(e)}"
        )


@router.get("/{session_id}/resume-preview", response_model=ResumePreview)
async def get_live_resume_preview(
    session_id: str,
    db: Session = Depends(get_sync_db_session)
):
    """Generate real-time resume based on conversation state"""
    try:
        # Get session and profile
        session = db.query(ConversationSession).filter(ConversationSession.id == session_id).first()
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )
            
        profile = db.query(UserCareerProfile).filter(UserCareerProfile.session_id == session_id).first()
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )
        
        # Calculate progress scores
        progress_scores = {
            "story_coherence": profile.story_coherence_score or 0.0,
            "achievement_quantification": profile.achievement_quantification or 0.0,
            "information_clarity": profile.information_clarity or 0.0,
            "keyword_optimization": 0.8 if profile.keyword_optimization else 0.0
        }
        
        # Build work experiences
        experiences = []
        if profile.work_experiences:
            from ....schemas.pydantic.conversation import WorkExperienceData
            experiences = [WorkExperienceData(**exp) for exp in profile.work_experiences]
        
        # Build resume summary
        resume_summary = None
        if profile.resume_summary_bullets:
            from ....schemas.pydantic.conversation import ResumeSummary
            resume_summary = ResumeSummary(
                title=profile.target_role or "Professional",
                bullets=profile.resume_summary_bullets
            )
        
        return ResumePreview(
            name=profile.name or "Professional",
            target_role=profile.target_role or "Professional",
            summary=resume_summary,
            experiences=experiences,
            skills=profile.technical_skills or [],
            progress_scores=progress_scores
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate resume preview: {str(e)}"
        )


@router.get("/{session_id}/status")
async def get_conversation_status(
    session_id: str,
    db: Session = Depends(get_sync_db_session)
):
    """Get current conversation status and progress"""
    try:
        session = db.query(ConversationSession).filter(ConversationSession.id == session_id).first()
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )
        
        profile = db.query(UserCareerProfile).filter(UserCareerProfile.session_id == session_id).first()
        
        # Calculate overall progress
        progress_percentage = 0.0
        if session.current_phase:
            phase_progress = {
                "introduction": 10.0,
                "story_discovery": 35.0,
                "achievement_mining": 70.0,
                "quantification": 85.0,
                "optimization": 95.0,
                "synthesis": 100.0,
                "review": 100.0
            }
            progress_percentage = phase_progress.get(session.current_phase.value, 0.0)
        
        return {
            "session_id": session_id,
            "current_phase": session.current_phase.value if session.current_phase else None,
            "progress_percentage": progress_percentage,
            "created_at": session.created_at.isoformat(),
            "updated_at": session.updated_at.isoformat(),
            "completed_at": session.completed_at.isoformat() if session.completed_at else None,
            "profile": {
                "name": profile.name if profile else None,
                "target_role": profile.target_role if profile else None,
                "story_coherence_score": profile.story_coherence_score if profile else 0.0,
                "experiences_count": len(profile.work_experiences) if profile and profile.work_experiences else 0
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get conversation status: {str(e)}"
        )


@router.delete("/{session_id}")
async def delete_conversation_session(
    session_id: str,
    db: Session = Depends(get_sync_db_session)
):
    """Delete a conversation session and all associated data"""
    try:
        session = db.query(ConversationSession).filter(ConversationSession.id == session_id).first()
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )
        
        db.delete(session)
        db.commit()
        
        return {"message": "Session deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete session: {str(e)}"
        )