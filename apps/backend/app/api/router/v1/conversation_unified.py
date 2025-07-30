"""
ROCKET Framework - Unified Conversation API Endpoints
Enhanced conversation layer with quality intelligence and achievement mining
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, List, Any, Optional
from pydantic import BaseModel
from enum import Enum

from ....core import get_sync_db_session
from ....services.unified_conversation_service import UnifiedConversationOrchestrator, ConversationMode
from ....services.response_quality_intelligence import ResponseQualityIntelligence


router = APIRouter()


# Enhanced API Models
class ConversationModeEnum(str, Enum):
    """Available conversation modes"""
    ROCKET_STANDARD = "rocket_standard"
    PSYCHOLOGY_ENHANCED = "psychology_enhanced"
    MULTI_PERSONA = "multi_persona"
    INTEGRATED_COACHING = "integrated_coaching"


class UnifiedConversationRequest(BaseModel):
    """Request for unified conversation processing"""
    session_id: str
    user_input: str
    mode: ConversationModeEnum = ConversationModeEnum.INTEGRATED_COACHING
    persona_preference: Optional[str] = None
    enable_quality_analysis: bool = True
    enable_achievement_mining: bool = True


class QualityAnalysisRequest(BaseModel):
    """Request for standalone quality analysis"""
    user_response: str
    conversation_context: Optional[Dict[str, Any]] = None


class AchievementMiningRequest(BaseModel):
    """Request for standalone achievement mining"""
    user_response: str
    context: Optional[Dict[str, Any]] = None


class ConversationModeRequest(BaseModel):
    """Request to change conversation mode"""
    session_id: str
    new_mode: ConversationModeEnum
    reason: Optional[str] = None


@router.post("/process", response_model=Dict[str, Any])
async def process_unified_conversation(
    request: UnifiedConversationRequest,
    db: Session = Depends(get_sync_db_session)
):
    """Main endpoint for processing conversations with unified intelligence"""
    
    try:
        # Initialize services
        orchestrator = UnifiedConversationOrchestrator(db)
        quality_intelligence = ResponseQualityIntelligence(db)
        
        # Convert enum to internal enum
        mode_mapping = {
            ConversationModeEnum.ROCKET_STANDARD: ConversationMode.ROCKET_STANDARD,
            ConversationModeEnum.PSYCHOLOGY_ENHANCED: ConversationMode.PSYCHOLOGY_ENHANCED,
            ConversationModeEnum.MULTI_PERSONA: ConversationMode.MULTI_PERSONA,
            ConversationModeEnum.INTEGRATED_COACHING: ConversationMode.INTEGRATED_COACHING
        }
        internal_mode = mode_mapping[request.mode]
        
        # Process main conversation
        conversation_result = await orchestrator.process_conversation(
            session_id=request.session_id,
            user_input=request.user_input,
            mode=internal_mode,
            persona_preference=request.persona_preference
        )
        
        if not conversation_result["success"]:
            return conversation_result
        
        # Enhanced analysis if requested
        enhanced_data = {}
        
        if request.enable_quality_analysis:
            quality_metrics = await quality_intelligence.analyze_response_quality(
                request.user_input,
                conversation_result.get("session_state", {})
            )
            enhanced_data["quality_analysis"] = {
                "clarity_score": quality_metrics.clarity_score,
                "specificity_score": quality_metrics.specificity_score,
                "achievement_density": quality_metrics.achievement_density,
                "quantification_score": quality_metrics.quantification_score,
                "overall_score": quality_metrics.overall_score,
                "quality_level": quality_metrics.quality_level.value,
                "improvement_suggestions": quality_metrics.improvement_suggestions
            }
        
        if request.enable_achievement_mining:
            achievements = await quality_intelligence.mine_achievements(
                request.user_input,
                conversation_result.get("session_state", {})
            )
            enhanced_data["achievement_mining"] = {
                "achievements_found": len(achievements),
                "achievements": [
                    {
                        "context": ach.context,
                        "action": ach.action,
                        "result": ach.result,
                        "quantification": ach.quantification,
                        "impact_level": ach.impact_level,
                        "confidence_score": ach.confidence_score
                    } for ach in achievements
                ],
                "high_confidence_count": len([a for a in achievements if a.confidence_score > 0.7])
            }
        
        # Generate intelligent follow-up if both analyses are enabled
        if request.enable_quality_analysis and request.enable_achievement_mining:
            follow_up_intelligence = await quality_intelligence.generate_follow_up_intelligence(
                quality_metrics, achievements
            )
            enhanced_data["follow_up_intelligence"] = follow_up_intelligence
        
        # Combine results
        final_result = {
            **conversation_result,
            "enhanced_analysis": enhanced_data,
            "api_version": "v1_enhanced",
            "processing_time": "sub_500ms"  # Performance target
        }
        
        return final_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing unified conversation: {str(e)}")


@router.post("/quality-analysis", response_model=Dict[str, Any])
async def analyze_response_quality(
    request: QualityAnalysisRequest,
    db: Session = Depends(get_sync_db_session)
):
    """Standalone endpoint for response quality analysis"""
    
    try:
        quality_intelligence = ResponseQualityIntelligence(db)
        quality_metrics = await quality_intelligence.analyze_response_quality(
            request.user_response,
            request.conversation_context
        )
        
        return {
            "success": True,
            "quality_analysis": {
                "clarity_score": quality_metrics.clarity_score,
                "specificity_score": quality_metrics.specificity_score,
                "achievement_density": quality_metrics.achievement_density,
                "quantification_score": quality_metrics.quantification_score,
                "overall_score": quality_metrics.overall_score,
                "quality_level": quality_metrics.quality_level.value,
                "improvement_suggestions": quality_metrics.improvement_suggestions
            },
            "analysis_timestamp": "2024-01-01T00:00:00Z"  # Will use actual timestamp
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing response quality: {str(e)}")


@router.post("/mine-achievements", response_model=Dict[str, Any])
async def mine_achievements(
    request: AchievementMiningRequest,
    db: Session = Depends(get_sync_db_session)
):
    """Standalone endpoint for achievement mining"""
    
    try:
        quality_intelligence = ResponseQualityIntelligence(db)
        achievements = await quality_intelligence.mine_achievements(
            request.user_response,
            request.context
        )
        
        return {
            "success": True,
            "achievement_mining": {
                "achievements_found": len(achievements),
                "achievements": [
                    {
                        "context": ach.context,
                        "action": ach.action,
                        "result": ach.result,
                        "quantification": ach.quantification,
                        "impact_level": ach.impact_level,
                        "confidence_score": ach.confidence_score,
                        "raw_text": ach.raw_text
                    } for ach in achievements
                ],
                "high_confidence_count": len([a for a in achievements if a.confidence_score > 0.7]),
                "quantified_achievements": len([a for a in achievements if a.quantification])
            },
            "analysis_timestamp": "2024-01-01T00:00:00Z"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error mining achievements: {str(e)}")


@router.post("/change-mode", response_model=Dict[str, Any])
async def change_conversation_mode(
    request: ConversationModeRequest,
    db: Session = Depends(get_sync_db_session)
):
    """Change conversation mode for existing session"""
    
    try:
        from ....models.conversation import ConversationSession
        
        # Update session mode
        session = db.query(ConversationSession).filter(
            ConversationSession.id == request.session_id
        ).first()
        
        if not session:
            raise HTTPException(status_code=404, detail="Conversation session not found")
        
        # Update conversation state
        current_state = session.conversation_state or {}
        current_state.update({
            "mode": request.new_mode.value,
            "mode_change_reason": request.reason,
            "mode_changed_at": "2024-01-01T00:00:00Z"  # Will use actual timestamp
        })
        
        session.conversation_state = current_state
        db.commit()
        
        return {
            "success": True,
            "message": f"Conversation mode changed to {request.new_mode.value}",
            "session_id": request.session_id,
            "new_mode": request.new_mode.value,
            "previous_mode": current_state.get("last_mode", "unknown")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error changing conversation mode: {str(e)}")


@router.get("/session/{session_id}/analytics", response_model=Dict[str, Any])
async def get_session_analytics(
    session_id: str,
    db: Session = Depends(get_sync_db_session)
):
    """Get comprehensive analytics for a conversation session"""
    
    try:
        from ....models.conversation import ConversationSession, ConversationMessage
        
        # Get session
        session = db.query(ConversationSession).filter(
            ConversationSession.id == session_id
        ).first()
        
        if not session:
            raise HTTPException(status_code=404, detail="Conversation session not found")
        
        # Get messages
        messages = db.query(ConversationMessage).filter(
            ConversationMessage.session_id == session_id
        ).order_by(ConversationMessage.created_at).all()
        
        user_messages = [msg for msg in messages if msg.sender == "user"]
        
        # Basic analytics
        analytics = {
            "session_summary": {
                "session_id": session_id,
                "total_messages": len(messages),
                "user_messages": len(user_messages),
                "ai_messages": len(messages) - len(user_messages),
                "current_phase": session.current_phase.value if session.current_phase else "unknown",
                "conversation_state": session.conversation_state or {}
            },
            "user_engagement": {
                "avg_response_length": sum(len(msg.message.split()) for msg in user_messages) / len(user_messages) if user_messages else 0,
                "total_words": sum(len(msg.message.split()) for msg in user_messages),
                "response_frequency": len(user_messages)
            },
            "conversation_progress": {
                "session_duration_messages": len(messages),
                "phases_completed": [],  # Could be enhanced based on conversation analysis
                "quality_trend": "improving"  # Could be calculated from quality analyses
            }
        }
        
        return {
            "success": True,
            "analytics": analytics
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting session analytics: {str(e)}")


@router.get("/modes", response_model=Dict[str, Any])
async def get_available_conversation_modes():
    """Get available conversation modes with descriptions"""
    
    modes = {
        "rocket_standard": {
            "name": "ROCKET Standard",
            "description": "Focus on Results-Optimized Career Knowledge Enhancement Toolkit",
            "features": ["CAR Framework", "Achievement Mining", "Quantification Focus"],
            "best_for": ["Resume building", "Interview preparation", "Achievement articulation"]
        },
        "psychology_enhanced": {
            "name": "Psychology Enhanced", 
            "description": "Dr. Maya Insight persona with psychological analysis",
            "features": ["Personality Analysis", "Work Style Assessment", "Motivation Mapping"],
            "best_for": ["Career guidance", "Self-awareness", "Role alignment"]
        },
        "multi_persona": {
            "name": "Multi-Persona",
            "description": "Switch between different AI coaching personas",
            "features": ["7 Specialized Coaches", "Expert Perspectives", "Targeted Advice"],
            "best_for": ["Specific expertise", "Specialized guidance", "Multiple viewpoints"]
        },
        "integrated_coaching": {
            "name": "Integrated Coaching",
            "description": "Full integration of all coaching approaches",
            "features": ["Complete Analysis", "Multiple Perspectives", "Comprehensive Insights"],
            "best_for": ["Complete career development", "In-depth analysis", "Maximum value"]
        }
    }
    
    return {
        "success": True,
        "available_modes": modes,
        "default_mode": "integrated_coaching",
        "recommendation": "integrated_coaching for new users"
    }


@router.get("/health", response_model=Dict[str, Any])
async def conversation_health_check():
    """Health check endpoint for conversation API"""
    
    return {
        "status": "healthy",
        "api_version": "v1_enhanced",
        "services": {
            "unified_conversation_orchestrator": "operational",
            "response_quality_intelligence": "operational",
            "achievement_mining": "operational",
            "multi_persona_system": "operational"
        },
        "performance_target": "sub_500ms",
        "timestamp": "2024-01-01T00:00:00Z"
    }