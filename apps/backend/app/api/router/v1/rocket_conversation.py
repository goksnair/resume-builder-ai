"""
ROCKET Framework API Endpoints

RESTful API endpoints for the ROCKET Framework integration including:
- Enhanced conversation session management
- ROCKET framework analysis endpoints
- Career psychologist integration
- Multi-mode processing support

Integrates with existing API structure while providing enhanced capabilities.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, List, Optional, Any
from uuid import uuid4

from ....core.database import get_db_session
from ....models.rocket_framework import (
    ROCKETSession, ProcessingMode, ROCKETPhase
)
from ....services.enhanced_conversation_service import (
    EnhancedConversationService, EnhancedConversationResponse
)
from ....services.rocket_framework_service import ROCKETFrameworkService
from ....services.career_psychologist_service import CareerPsychologistService
from ....agent.manager import AgentManager
from ....schemas.pydantic.rocket_conversation import (
    StartEnhancedSessionRequest, StartEnhancedSessionResponse,
    ProcessConversationRequest, ProcessConversationResponse,
    ROCKETAnalysisRequest, ROCKETAnalysisResponse,
    PsychologistAnalysisRequest, PsychologistAnalysisResponse,
    SessionStatusResponse
)

router = APIRouter(prefix="/rocket", tags=["ROCKET Framework"])


# Dependency injection
async def get_ai_manager() -> AgentManager:
    """Get AI Manager instance"""
    return AgentManager()


async def get_enhanced_conversation_service(
    ai_manager: AgentManager = Depends(get_ai_manager)
) -> EnhancedConversationService:
    """Get Enhanced Conversation Service instance"""
    return EnhancedConversationService(ai_manager)


async def get_rocket_service(
    ai_manager: AgentManager = Depends(get_ai_manager)
) -> ROCKETFrameworkService:
    """Get ROCKET Framework Service instance"""
    return ROCKETFrameworkService(ai_manager)


async def get_psychologist_service(
    ai_manager: AgentManager = Depends(get_ai_manager)
) -> CareerPsychologistService:
    """Get Career Psychologist Service instance"""
    return CareerPsychologistService(ai_manager)


# ============================================================================
# ENHANCED CONVERSATION ENDPOINTS
# ============================================================================

@router.post("/session/start", response_model=StartEnhancedSessionResponse)
async def start_enhanced_session(
    request: StartEnhancedSessionRequest,
    enhanced_service: EnhancedConversationService = Depends(get_enhanced_conversation_service)
) -> Dict[str, Any]:
    """
    Start an enhanced conversation session with ROCKET Framework integration
    
    Creates a new conversation session with ROCKET Framework and Dr. Maya Insight
    psychological analysis capabilities.
    """
    
    try:
        response = await enhanced_service.start_enhanced_session(
            user_id=request.user_id,
            processing_mode=ProcessingMode(request.processing_mode),
            existing_conversation_id=request.existing_conversation_id
        )
        
        return {
            "session_id": response.session_id,
            "message": response.message,
            "rocket_analysis": response.rocket_analysis,
            "psychological_insight": response.psychological_insight,
            "follow_up_questions": response.follow_up_questions,
            "progress_percentage": response.progress_percentage,
            "processing_mode": request.processing_mode,
            "status": "success"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start enhanced session: {str(e)}"
        )


@router.post("/session/{session_id}/respond", response_model=ProcessConversationResponse)
async def process_conversation_response(
    session_id: str,
    request: ProcessConversationRequest,
    enhanced_service: EnhancedConversationService = Depends(get_enhanced_conversation_service)
) -> Dict[str, Any]:
    """
    Process user input through integrated ROCKET Framework and psychological analysis
    
    Main conversation processing endpoint that orchestrates ROCKET analysis,
    psychological insights, and AI-powered responses.
    """
    
    try:
        response = await enhanced_service.process_user_response(
            session_id=session_id,
            user_input=request.user_input,
            processing_mode=request.processing_mode
        )
        
        return {
            "session_id": response.session_id,
            "message": response.message,
            "rocket_analysis": response.rocket_analysis,
            "psychological_insight": response.psychological_insight,
            "conversation_metadata": response.conversation_metadata,
            "next_phase": response.next_phase.value if response.next_phase else None,
            "follow_up_questions": response.follow_up_questions,
            "progress_percentage": response.progress_percentage,
            "timestamp": response.timestamp.isoformat(),
            "status": "success"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process conversation response: {str(e)}"
        )


@router.get("/session/{session_id}/status", response_model=SessionStatusResponse)
async def get_session_status(
    session_id: str,
    db_session = Depends(get_db_session)
) -> Dict[str, Any]:
    """
    Get current status and progress of a ROCKET Framework session
    
    Returns detailed information about session progress, current phase,
    and completion status of different analysis components.
    """
    
    try:
        async with db_session as session:
            # Get conversation session
            conversation_session = await session.get(ConversationSession, session_id)
            if not conversation_session:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Session not found"
                )
            
            # Get associated ROCKET session
            rocket_session = conversation_session.rocket_session
            if not rocket_session:
                return {
                    "session_id": session_id,
                    "has_rocket_framework": False,
                    "status": "basic_conversation"
                }
            
            return {
                "session_id": session_id,
                "has_rocket_framework": True,
                "rocket_session_id": rocket_session.id,
                "current_phase": rocket_session.current_phase.value,
                "processing_mode": rocket_session.processing_mode.value,
                "completion_percentage": rocket_session.completion_percentage,
                "phase_completion": {
                    "story_extraction": rocket_session.story_extraction_complete,
                    "car_analysis": rocket_session.car_analysis_complete,
                    "rest_quantification": rocket_session.rest_quantification_complete,
                    "psychologist_analysis": rocket_session.psychologist_analysis_complete
                },
                "total_interactions": rocket_session.total_interactions,
                "quality_score": rocket_session.quality_score,
                "is_active": rocket_session.is_active,
                "created_at": rocket_session.created_at.isoformat(),
                "last_updated": rocket_session.updated_at.isoformat(),
                "status": "success"
            }
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get session status: {str(e)}"
        )


# ============================================================================
# ROCKET FRAMEWORK ANALYSIS ENDPOINTS
# ============================================================================

@router.post("/analysis/story", response_model=ROCKETAnalysisResponse)
async def analyze_personal_story(
    request: ROCKETAnalysisRequest,
    rocket_service: ROCKETFrameworkService = Depends(get_rocket_service)
) -> Dict[str, Any]:
    """
    Extract and analyze personal professional story using ROCKET Framework
    
    Implements the "I'm the _____ who helps _____ achieve _____" methodology
    with confidence scoring and alternative version generation.
    """
    
    try:
        story_analysis = await rocket_service.extract_personal_story(
            rocket_session_id=request.session_id,
            responses=request.responses
        )
        
        return {
            "analysis_type": "personal_story",
            "session_id": request.session_id,
            "results": {
                "formatted_story": story_analysis.formatted_story,
                "role_identity": story_analysis.role_identity,
                "target_audience": story_analysis.target_audience,
                "value_proposition": story_analysis.value_proposition,
                "confidence_score": story_analysis.confidence_score,
                "alternative_versions": story_analysis.alternative_versions,
                "extraction_method": story_analysis.extraction_method
            },
            "confidence_score": story_analysis.confidence_score,
            "recommendations": [
                "Use this story as your elevator pitch foundation",
                "Adapt the language for different audiences",
                "Quantify your value proposition with specific examples"
            ],
            "status": "success"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze personal story: {str(e)}"
        )


@router.post("/analysis/car", response_model=ROCKETAnalysisResponse)
async def analyze_car_framework(
    request: ROCKETAnalysisRequest,
    rocket_service: ROCKETFrameworkService = Depends(get_rocket_service)
) -> Dict[str, Any]:
    """
    Apply Context-Action-Results framework analysis to professional experience
    
    Structures experience data using CAR methodology with skills identification
    and impact analysis for optimized resume content.
    """
    
    try:
        if not request.experience_text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Experience text is required for CAR analysis"
            )
        
        car_analysis = await rocket_service.apply_car_framework(
            rocket_session_id=request.session_id,
            experience_text=request.experience_text,
            experience_category=request.experience_category
        )
        
        return {
            "analysis_type": "car_framework",
            "session_id": request.session_id,
            "results": {
                "context": car_analysis.context,
                "action": car_analysis.action,
                "results": car_analysis.results,
                "skills_demonstrated": car_analysis.skills_demonstrated,
                "impact_areas": car_analysis.impact_areas,
                "quantifiable_metrics": car_analysis.quantifiable_metrics,
                "analysis_confidence": car_analysis.analysis_confidence,
                "completeness_score": car_analysis.completeness_score
            },
            "confidence_score": car_analysis.analysis_confidence,
            "recommendations": car_analysis.enhancement_suggestions,
            "status": "success"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze CAR framework: {str(e)}"
        )


@router.post("/analysis/rest", response_model=ROCKETAnalysisResponse)
async def analyze_rest_quantification(
    request: ROCKETAnalysisRequest,
    rocket_service: ROCKETFrameworkService = Depends(get_rocket_service)
) -> Dict[str, Any]:
    """
    Apply REST quantification methodology (Results, Efficiency, Scope, Time)
    
    Performs business impact analysis and generates optimized content for
    resumes, LinkedIn profiles, and interview preparation.
    """
    
    try:
        if not request.car_data_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CAR data ID is required for REST quantification"
            )
        
        # Get CAR data first
        async with get_db_session() as session:
            car_data = await session.get(CARFrameworkData, request.car_data_id)
            if not car_data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="CAR analysis not found"
                )
        
        rest_analysis = await rocket_service.quantify_with_rest(
            rocket_session_id=request.session_id,
            car_data_id=request.car_data_id,
            car_data=car_data
        )
        
        return {
            "analysis_type": "rest_quantification",
            "session_id": request.session_id,
            "results": {
                "results_metrics": rest_analysis.results_metrics,
                "efficiency_gains": rest_analysis.efficiency_gains,
                "scope_impact": rest_analysis.scope_impact,
                "time_factors": rest_analysis.time_factors,
                "revenue_impact": rest_analysis.revenue_impact,
                "cost_savings": rest_analysis.cost_savings,
                "percentage_improvements": rest_analysis.percentage_improvements,
                "people_affected": rest_analysis.people_affected,
                "resume_bullet_points": rest_analysis.resume_bullet_points,
                "linkedin_summary_points": rest_analysis.linkedin_summary_points,
                "interview_talking_points": rest_analysis.interview_talking_points
            },
            "confidence_score": rest_analysis.quantification_confidence,
            "recommendations": [
                "Use these quantified bullets in your resume",
                "Adapt LinkedIn points for your profile summary",
                "Practice interview talking points with specific metrics"
            ],
            "status": "success"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze REST quantification: {str(e)}"
        )


# ============================================================================
# CAREER PSYCHOLOGIST ENDPOINTS
# ============================================================================

@router.post("/psychologist/analyze", response_model=PsychologistAnalysisResponse)
async def analyze_personality_profile(
    request: PsychologistAnalysisRequest,
    psychologist_service: CareerPsychologistService = Depends(get_psychologist_service)
) -> Dict[str, Any]:
    """
    Generate comprehensive psychological analysis and career positioning insights
    
    Dr. Maya Insight provides personality trait analysis, behavioral patterns,
    and career alignment recommendations based on conversation responses.
    """
    
    try:
        psychologist_analysis = await psychologist_service.analyze_personality_from_responses(
            rocket_session_id=request.session_id,
            conversation_responses=request.conversation_responses
        )
        
        return {
            "session_id": request.session_id,
            "dr_maya_analysis": {
                "personality_traits": psychologist_analysis.personality_traits,
                "behavioral_patterns": psychologist_analysis.behavioral_patterns,
                "motivation_drivers": psychologist_analysis.motivation_drivers,
                "stress_indicators": psychologist_analysis.stress_indicators,
                "career_strengths": psychologist_analysis.career_strengths,
                "development_areas": psychologist_analysis.development_areas,
                "ideal_work_environment": psychologist_analysis.ideal_work_environment,
                "career_progression_style": psychologist_analysis.career_progression_style
            },
            "recommendations": {
                "positioning": psychologist_analysis.positioning_recommendations,
                "interview_strategies": psychologist_analysis.interview_strategies,
                "networking_approaches": psychologist_analysis.networking_approaches,
                "personal_branding_tips": psychologist_analysis.personal_branding_tips,
                "action_plan": psychologist_analysis.action_plan
            },
            "personalized_message": psychologist_analysis.personalized_message,
            "confidence_level": psychologist_analysis.confidence_level,
            "analysis_framework": psychologist_analysis.psychological_framework,
            "status": "success"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze personality profile: {str(e)}"
        )


@router.post("/psychologist/response", response_model=Dict[str, Any])
async def generate_psychologist_response(
    request: Dict[str, Any],
    psychologist_service: CareerPsychologistService = Depends(get_psychologist_service)
) -> Dict[str, Any]:
    """
    Generate Dr. Maya Insight's contextual response to user input
    
    Provides psychologically-informed responses that guide users through
    career discovery and resume enhancement with professional insight.
    """
    
    try:
        dr_maya_response = await psychologist_service.generate_psychologist_response(
            user_input=request.get("user_input", ""),
            rocket_session_id=request.get("session_id", ""),
            conversation_history=request.get("conversation_history", []),
            current_phase=ROCKETPhase(request.get("current_phase", "introduction"))
        )
        
        return {
            "session_id": request.get("session_id"),
            "dr_maya_response": dr_maya_response,
            "status": "success"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate psychologist response: {str(e)}"
        )


# ============================================================================
# UTILITY ENDPOINTS
# ============================================================================

@router.get("/phases", response_model=Dict[str, Any])
async def get_rocket_phases() -> Dict[str, Any]:
    """
    Get information about ROCKET Framework conversation phases
    
    Returns details about each phase in the ROCKET methodology including
    objectives, typical duration, and success criteria.
    """
    
    phases_info = {
        "introduction": {
            "name": "Introduction",
            "description": "Initial rapport building and basic professional information gathering",
            "objectives": ["Understand current role", "Identify target position", "Assess user readiness"],
            "typical_duration": "2-3 interactions",
            "success_criteria": "Basic professional profile established"
        },
        "story_extraction": {
            "name": "Personal Story Extraction", 
            "description": "Extract and refine the core professional narrative",
            "objectives": ["Identify role identity", "Define target audience", "Articulate value proposition"],
            "typical_duration": "3-5 interactions",
            "success_criteria": "Clear professional story with >70% confidence"
        },
        "car_analysis": {
            "name": "CAR Framework Analysis",
            "description": "Context-Action-Results analysis of professional experiences",
            "objectives": ["Structure experiences", "Identify skills", "Analyze impact"],
            "typical_duration": "2-4 interactions per experience",
            "success_criteria": "Well-structured experience with clear impact"
        },
        "rest_quantification": {
            "name": "REST Quantification",
            "description": "Results, Efficiency, Scope, Time business impact analysis",
            "objectives": ["Quantify results", "Generate resume bullets", "Create talking points"],
            "typical_duration": "1-2 interactions",
            "success_criteria": "Quantified impact with actionable content"
        },
        "psychologist_insight": {
            "name": "Psychological Insight",
            "description": "Dr. Maya's personality analysis and career positioning",
            "objectives": ["Personality assessment", "Career alignment", "Positioning strategy"],
            "typical_duration": "2-3 interactions",
            "success_criteria": "Comprehensive psychological profile with recommendations"
        },
        "synthesis": {
            "name": "Synthesis",
            "description": "Integration of all insights into cohesive professional positioning",
            "objectives": ["Combine insights", "Finalize content", "Strategic positioning"],
            "typical_duration": "1-2 interactions",
            "success_criteria": "Complete professional profile ready for use"
        },
        "completion": {
            "name": "Completion",
            "description": "Final review and next steps guidance",
            "objectives": ["Review results", "Provide guidance", "Plan follow-up"],
            "typical_duration": "1 interaction",
            "success_criteria": "User satisfied with results and clear on next steps"
        }
    }
    
    return {
        "phases": phases_info,
        "total_phases": len(phases_info),
        "framework": "ROCKET (Results-Optimized Career Knowledge Enhancement Toolkit)",
        "status": "success"
    }


@router.get("/processing-modes", response_model=Dict[str, Any])
async def get_processing_modes() -> Dict[str, Any]:
    """
    Get information about available processing modes
    
    Returns details about different processing modes available for
    ROCKET Framework conversations.
    """
    
    modes_info = {
        "integrated": {
            "name": "Integrated Mode",
            "description": "Full ROCKET Framework with Dr. Maya psychological insights",
            "features": ["Complete ROCKET analysis", "Psychological assessment", "Career positioning"],
            "best_for": "Comprehensive career development and resume optimization",
            "duration": "Longest but most comprehensive"
        },
        "rocket_only": {
            "name": "ROCKET Only Mode",
            "description": "Focus on ROCKET Framework analysis without psychological insights",
            "features": ["Story extraction", "CAR analysis", "REST quantification"],
            "best_for": "Resume content optimization and experience structuring",
            "duration": "Medium duration, focused on content"
        },
        "psychologist_only": {
            "name": "Dr. Maya Only Mode",
            "description": "Focus on psychological analysis and career positioning",
            "features": ["Personality assessment", "Career alignment", "Positioning strategy"],
            "best_for": "Career guidance and professional development",
            "duration": "Medium duration, focused on psychology"
        },
        "automatic": {
            "name": "Automatic Mode",
            "description": "AI-driven mode selection based on user needs and responses",
            "features": ["Adaptive processing", "Smart mode switching", "Optimized experience"],
            "best_for": "Users who want the system to optimize their experience",
            "duration": "Variable based on needs"
        }
    }
    
    return {
        "modes": modes_info,
        "default_mode": "integrated",
        "recommendation": "Use integrated mode for best results",
        "status": "success"
    }