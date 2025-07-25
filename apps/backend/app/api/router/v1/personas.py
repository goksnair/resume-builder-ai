"""
ROCKET Framework - Multi-Persona API Endpoints
Handles API requests for persona selection and session management
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

from ....core.database import get_sync_db_session
from ....services.persona_session_manager import PersonaSessionManager


router = APIRouter()


# Pydantic Models for API requests/responses
class PersonaRecommendationRequest(BaseModel):
    user_goals: List[str]
    career_stage: str
    challenges: List[str]


class StartPersonaSessionRequest(BaseModel):
    user_id: str
    persona_type: str
    session_objectives: List[str]
    conversation_session_id: Optional[str] = None


class PersonaResponseRequest(BaseModel):
    user_response: str


class CompleteSessionRequest(BaseModel):
    satisfaction_rating: Optional[float] = None


class CrossAnalysisRequest(BaseModel):
    user_id: str
    session_ids: List[str]


@router.post("/initialize", response_model=Dict[str, Any])
async def initialize_personas(db: Session = Depends(get_sync_db_session)):
    """Initialize all persona profiles in the database"""
    
    try:
        manager = PersonaSessionManager(db)
        success = manager.initialize_personas()
        
        if success:
            return {
                "success": True,
                "message": "Personas initialized successfully",
                "personas_available": 7
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to initialize personas")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error initializing personas: {str(e)}")


@router.post("/recommend", response_model=Dict[str, Any])
async def recommend_personas(
    request: PersonaRecommendationRequest,
    db: Session = Depends(get_sync_db_session)
):
    """Get personalized persona recommendations based on user profile"""
    
    try:
        manager = PersonaSessionManager(db)
        recommendations = manager.recommend_personas(
            user_goals=request.user_goals,
            career_stage=request.career_stage,
            challenges=request.challenges
        )
        
        return {
            "success": True,
            "message": "Persona recommendations generated",
            "recommendations": recommendations,
            "recommendation_count": len(recommendations)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")


@router.post("/session/start", response_model=Dict[str, Any])
async def start_persona_session(
    request: StartPersonaSessionRequest,
    db: Session = Depends(get_sync_db_session)
):
    """Start a new persona-specific coaching session"""
    
    try:
        manager = PersonaSessionManager(db)
        success, message, session_data = manager.start_persona_session(
            user_id=request.user_id,
            persona_type=request.persona_type,
            session_objectives=request.session_objectives,
            conversation_session_id=request.conversation_session_id
        )
        
        if success:
            return {
                "success": True,
                "message": message,
                "session_data": session_data
            }
        else:
            raise HTTPException(status_code=400, detail=message)
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error starting persona session: {str(e)}")


@router.post("/session/{session_id}/respond", response_model=Dict[str, Any])
async def process_persona_response(
    session_id: str,
    request: PersonaResponseRequest,
    db: Session = Depends(get_sync_db_session)
):
    """Process user response within persona context"""
    
    try:
        manager = PersonaSessionManager(db)
        success, message, response_data = manager.process_persona_response(
            session_id=session_id,
            user_response=request.user_response
        )
        
        if success:
            return {
                "success": True,
                "message": message,
                "response_data": response_data
            }
        else:
            raise HTTPException(status_code=400, detail=message)
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing persona response: {str(e)}")


@router.get("/session/{session_id}/status", response_model=Dict[str, Any])
async def get_persona_session_status(
    session_id: str,
    db: Session = Depends(get_sync_db_session)
):
    """Get current status and progress of persona session"""
    
    try:
        manager = PersonaSessionManager(db)
        success, message, status_data = manager.get_persona_session_status(session_id)
        
        if success:
            return {
                "success": True,
                "message": message,
                "status": status_data
            }
        else:
            raise HTTPException(status_code=404, detail=message)
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting session status: {str(e)}")


@router.post("/session/{session_id}/complete", response_model=Dict[str, Any])
async def complete_persona_session(
    session_id: str,
    request: CompleteSessionRequest,
    db: Session = Depends(get_sync_db_session)
):
    """Complete persona session and generate final analysis"""
    
    try:
        manager = PersonaSessionManager(db)
        success, message, completion_data = manager.complete_persona_session(
            session_id=session_id,
            satisfaction_rating=request.satisfaction_rating
        )
        
        if success:
            return {
                "success": True,
                "message": message,
                "completion_data": completion_data
            }
        else:
            raise HTTPException(status_code=400, detail=message)
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error completing persona session: {str(e)}")


@router.post("/analysis/cross-persona", response_model=Dict[str, Any])
async def generate_cross_persona_analysis(
    request: CrossAnalysisRequest,
    db: Session = Depends(get_sync_db_session)
):
    """Generate comprehensive analysis across multiple persona sessions"""
    
    try:
        manager = PersonaSessionManager(db)
        success, message, analysis_data = manager.generate_cross_persona_analysis(
            user_id=request.user_id,
            session_ids=request.session_ids
        )
        
        if success:
            return {
                "success": True,
                "message": message,
                "analysis": analysis_data
            }
        else:
            raise HTTPException(status_code=400, detail=message)
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating cross-persona analysis: {str(e)}")


@router.get("/available", response_model=Dict[str, Any])
async def get_available_personas(db: Session = Depends(get_sync_db_session)):
    """Get all available personas with their basic information"""
    
    try:
        from ....services.persona_definitions import PersonaDefinitions
        
        all_personas = PersonaDefinitions.get_all_personas()
        
        personas_list = []
        for persona_type, definition in all_personas.items():
            personas_list.append({
                "persona_type": persona_type,
                "name": definition["name"],
                "title": definition["title"],
                "expertise_areas": definition["expertise_areas"][:3],  # Top 3 areas
                "session_objectives": definition["session_objectives"][:3],  # Top 3 objectives
                "communication_style": definition["personality_traits"]["communication_style"]
            })
        
        return {
            "success": True,
            "message": "Available personas retrieved",
            "personas": personas_list,
            "total_count": len(personas_list)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving available personas: {str(e)}")


@router.get("/user/{user_id}/sessions", response_model=Dict[str, Any])
async def get_user_persona_sessions(
    user_id: str,
    db: Session = Depends(get_sync_db_session)
):
    """Get all persona sessions for a specific user"""
    
    try:
        from ....models.personas import PersonaSession
        
        sessions = db.query(PersonaSession).filter(
            PersonaSession.user_id == user_id
        ).order_by(PersonaSession.created_at.desc()).all()
        
        sessions_data = []
        for session in sessions:
            sessions_data.append({
                "session_id": session.id,
                "persona": {
                    "name": session.persona_profile.name,
                    "title": session.persona_profile.title,
                    "persona_type": session.persona_profile.persona_type
                },
                "status": session.status,
                "progress_percentage": session.progress_percentage,
                "current_phase": session.current_phase,
                "created_at": session.created_at.isoformat(),
                "completed_at": session.completed_at.isoformat() if session.completed_at else None,
                "satisfaction_rating": session.satisfaction_rating
            })
        
        return {
            "success": True,
            "message": f"Retrieved {len(sessions)} sessions for user",
            "sessions": sessions_data,
            "total_sessions": len(sessions_data)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving user sessions: {str(e)}")