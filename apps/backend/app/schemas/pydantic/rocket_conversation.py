"""
Pydantic Schemas for ROCKET Framework API Endpoints

Defines request and response models for the ROCKET Framework API including:
- Enhanced conversation session management
- ROCKET framework analysis requests/responses
- Career psychologist analysis schemas
- Validation and serialization for all ROCKET endpoints
"""

from datetime import datetime
from typing import Dict, List, Optional, Any, Union
from pydantic import BaseModel, Field, validator
from enum import Enum

from ...models.rocket_framework import ProcessingMode, ROCKETPhase, ResponseQuality


# ============================================================================
# ENUM DEFINITIONS FOR API
# ============================================================================

class ProcessingModeEnum(str, Enum):
    """Processing mode options for API"""
    INTEGRATED = "integrated"
    ROCKET_ONLY = "rocket_only"
    PSYCHOLOGIST_ONLY = "psychologist_only"
    AUTOMATIC = "automatic"


class ROCKETPhaseEnum(str, Enum):
    """ROCKET Framework phase options for API"""
    INTRODUCTION = "introduction"
    STORY_EXTRACTION = "story_extraction"
    CAR_ANALYSIS = "car_analysis"
    REST_QUANTIFICATION = "rest_quantification"
    PSYCHOLOGIST_INSIGHT = "psychologist_insight"
    SYNTHESIS = "synthesis"
    COMPLETION = "completion"


# ============================================================================
# ENHANCED CONVERSATION SCHEMAS
# ============================================================================

class StartEnhancedSessionRequest(BaseModel):
    """Request schema for starting enhanced conversation session"""
    user_id: str = Field(..., description="User identifier")
    processing_mode: ProcessingModeEnum = Field(
        default=ProcessingModeEnum.INTEGRATED, 
        description="Processing mode for the session"
    )
    existing_conversation_id: Optional[str] = Field(
        default=None, 
        description="Existing conversation ID to enhance with ROCKET"
    )
    
    class Config:
        schema_extra = {
            "example": {
                "user_id": "user_123",
                "processing_mode": "integrated",
                "existing_conversation_id": None
            }
        }


class StartEnhancedSessionResponse(BaseModel):
    """Response schema for enhanced session start"""
    session_id: str = Field(..., description="Conversation session ID")
    message: str = Field(..., description="Welcome message from the system")
    rocket_analysis: Dict[str, Any] = Field(..., description="Initial ROCKET analysis data")
    psychological_insight: Dict[str, Any] = Field(..., description="Initial psychological setup")
    follow_up_questions: List[str] = Field(..., description="Suggested follow-up questions")
    progress_percentage: float = Field(..., description="Initial progress percentage")
    processing_mode: ProcessingModeEnum = Field(..., description="Active processing mode")
    status: str = Field(default="success", description="Response status")
    
    class Config:
        schema_extra = {
            "example": {
                "session_id": "session_456",
                "message": "Welcome to your enhanced resume building experience!",
                "rocket_analysis": {"session_id": "rocket_789", "phase": "introduction"},
                "psychological_insight": {"dr_maya_available": True},
                "follow_up_questions": ["What's your current role?", "What type of position are you targeting?"],
                "progress_percentage": 5.0,
                "processing_mode": "integrated",
                "status": "success"
            }
        }


class ProcessConversationRequest(BaseModel):
    """Request schema for processing conversation responses"""
    user_input: str = Field(..., min_length=1, description="User's input message")
    processing_mode: Optional[ProcessingModeEnum] = Field(
        default=None, 
        description="Override processing mode for this response"
    )
    
    @validator('user_input')
    def validate_user_input(cls, v):
        if not v.strip():
            raise ValueError('User input cannot be empty')
        return v.strip()
    
    class Config:
        schema_extra = {
            "example": {
                "user_input": "I'm a software engineer who helps companies build scalable applications",
                "processing_mode": None
            }
        }


class ProcessConversationResponse(BaseModel):
    """Response schema for conversation processing"""
    session_id: str = Field(..., description="Conversation session ID")
    message: str = Field(..., description="AI response message")
    rocket_analysis: Dict[str, Any] = Field(..., description="ROCKET framework analysis results")
    psychological_insight: Dict[str, Any] = Field(..., description="Psychological analysis insights")
    conversation_metadata: Dict[str, Any] = Field(..., description="Conversation metadata and quality metrics")
    next_phase: Optional[ROCKETPhaseEnum] = Field(default=None, description="Next conversation phase")
    follow_up_questions: List[str] = Field(..., description="Intelligent follow-up questions")
    progress_percentage: float = Field(..., description="Conversation progress percentage")
    timestamp: str = Field(..., description="Response timestamp")
    status: str = Field(default="success", description="Response status")


class SessionStatusResponse(BaseModel):
    """Response schema for session status"""
    session_id: str = Field(..., description="Conversation session ID")
    has_rocket_framework: bool = Field(..., description="Whether session has ROCKET framework enabled")
    rocket_session_id: Optional[str] = Field(default=None, description="ROCKET session ID if available")
    current_phase: Optional[ROCKETPhaseEnum] = Field(default=None, description="Current ROCKET phase")
    processing_mode: Optional[ProcessingModeEnum] = Field(default=None, description="Active processing mode")
    completion_percentage: Optional[float] = Field(default=None, description="Overall completion percentage")
    phase_completion: Optional[Dict[str, bool]] = Field(default=None, description="Completion status of each phase")
    total_interactions: Optional[int] = Field(default=None, description="Total number of interactions")
    quality_score: Optional[float] = Field(default=None, description="Overall conversation quality score")
    is_active: Optional[bool] = Field(default=None, description="Whether session is active")
    created_at: Optional[str] = Field(default=None, description="Session creation timestamp")
    last_updated: Optional[str] = Field(default=None, description="Last update timestamp")
    status: str = Field(default="success", description="Response status")


# ============================================================================
# ROCKET FRAMEWORK ANALYSIS SCHEMAS
# ============================================================================

class ROCKETAnalysisRequest(BaseModel):
    """Request schema for ROCKET framework analysis"""
    session_id: str = Field(..., description="ROCKET session ID")
    responses: Optional[List[str]] = Field(default=None, description="User responses for story analysis")
    experience_text: Optional[str] = Field(default=None, description="Experience text for CAR analysis")
    experience_category: Optional[str] = Field(default=None, description="Category of experience")
    car_data_id: Optional[str] = Field(default=None, description="CAR data ID for REST quantification")
    
    @validator('responses')
    def validate_responses(cls, v):
        if v is not None and len(v) == 0:
            raise ValueError('Responses list cannot be empty if provided')
        return v
    
    class Config:
        schema_extra = {
            "example": {
                "session_id": "rocket_789",
                "responses": ["I am a software engineer", "I help companies build applications"],
                "experience_text": "Led a team of 5 developers to build a new customer portal...",
                "experience_category": "leadership",
                "car_data_id": "car_123"
            }
        }


class ROCKETAnalysisResponse(BaseModel):
    """Response schema for ROCKET framework analysis"""
    analysis_type: str = Field(..., description="Type of analysis performed")
    session_id: str = Field(..., description="ROCKET session ID")
    results: Dict[str, Any] = Field(..., description="Analysis results")
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="Confidence score for analysis")
    recommendations: List[str] = Field(..., description="Recommendations based on analysis")
    status: str = Field(default="success", description="Response status")
    
    class Config:
        schema_extra = {
            "example": {
                "analysis_type": "personal_story",
                "session_id": "rocket_789",
                "results": {
                    "formatted_story": "I'm the software engineer who helps companies achieve scalable growth",
                    "confidence_score": 0.85
                },
                "confidence_score": 0.85,
                "recommendations": ["Use this as your elevator pitch", "Quantify your impact"],
                "status": "success"
            }
        }


# ============================================================================
# CAREER PSYCHOLOGIST SCHEMAS
# ============================================================================

class PsychologistAnalysisRequest(BaseModel):
    """Request schema for psychological analysis"""
    session_id: str = Field(..., description="ROCKET session ID")
    conversation_responses: List[str] = Field(..., min_items=1, description="Conversation responses for analysis")
    
    @validator('conversation_responses')
    def validate_conversation_responses(cls, v):
        if not v or len(v) == 0:
            raise ValueError('At least one conversation response is required')
        return v
    
    class Config:
        schema_extra = {
            "example": {
                "session_id": "rocket_789",
                "conversation_responses": [
                    "I love solving complex technical problems",
                    "I prefer working independently but enjoy collaborating on key decisions",
                    "I'm motivated by creating systems that help people work more efficiently"
                ]
            }
        }


class PersonalityTraitSchema(BaseModel):
    """Schema for personality trait information"""
    score: float = Field(..., ge=0.0, le=1.0, description="Trait score (0-1)")
    level: str = Field(..., description="Trait level (high/moderate/low)")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence in assessment")
    indicators_found: int = Field(..., ge=0, description="Number of trait indicators found")


class BehavioralPatternSchema(BaseModel):
    """Schema for behavioral pattern information"""
    dominant: str = Field(..., description="Dominant pattern identified")
    patterns: Dict[str, Dict[str, Any]] = Field(..., description="All patterns with scores")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence in pattern identification")


class PsychologistAnalysisResponse(BaseModel):
    """Response schema for psychological analysis"""
    session_id: str = Field(..., description="ROCKET session ID")
    dr_maya_analysis: Dict[str, Any] = Field(..., description="Dr. Maya's complete psychological analysis")
    recommendations: Dict[str, List[str]] = Field(..., description="Career positioning recommendations")
    personalized_message: str = Field(..., description="Dr. Maya's personalized message")
    confidence_level: float = Field(..., ge=0.0, le=1.0, description="Overall analysis confidence")
    analysis_framework: str = Field(..., description="Psychological framework used")
    status: str = Field(default="success", description="Response status")
    
    class Config:
        schema_extra = {
            "example": {
                "session_id": "rocket_789",
                "dr_maya_analysis": {
                    "personality_traits": {
                        "openness": {"score": 0.8, "level": "high", "confidence": 0.7}
                    },
                    "career_strengths": ["Creative problem solving", "Technical leadership"]
                },
                "recommendations": {
                    "positioning": ["Position yourself as an innovative technical leader"],
                    "interview_strategies": ["Prepare examples of creative solutions"]
                },
                "personalized_message": "Your analytical nature combined with creative thinking...",
                "confidence_level": 0.82,
                "analysis_framework": "big_five_mbti_hybrid",
                "status": "success"
            }
        }


# ============================================================================
# RESPONSE QUALITY SCHEMAS
# ============================================================================

class ResponseQualitySchema(BaseModel):
    """Schema for response quality assessment"""
    quality_rating: str = Field(..., description="Overall quality rating")
    completeness_score: float = Field(..., ge=0.0, le=1.0, description="Response completeness score")
    specificity_score: float = Field(..., ge=0.0, le=1.0, description="Response specificity score")
    relevance_score: float = Field(..., ge=0.0, le=1.0, description="Response relevance score")
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="Overall confidence score")
    missing_elements: List[str] = Field(..., description="Elements missing from response")
    suggested_followups: List[str] = Field(..., description="Suggested follow-up questions")
    needs_clarification: bool = Field(..., description="Whether response needs clarification")
    requires_examples: bool = Field(..., description="Whether response requires examples")
    ready_for_next_phase: bool = Field(..., description="Whether ready to advance to next phase")


# ============================================================================
# UTILITY SCHEMAS
# ============================================================================

class ErrorResponse(BaseModel):
    """Standard error response schema"""
    detail: str = Field(..., description="Error detail message")
    error_code: Optional[str] = Field(default=None, description="Error code if applicable")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat(), description="Error timestamp")
    status: str = Field(default="error", description="Response status")


class SuccessResponse(BaseModel):
    """Standard success response schema"""
    message: str = Field(..., description="Success message")
    data: Optional[Dict[str, Any]] = Field(default=None, description="Response data")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat(), description="Response timestamp")
    status: str = Field(default="success", description="Response status")


# ============================================================================
# COMPREHENSIVE SCHEMAS FOR COMPLEX RESPONSES
# ============================================================================

class ComprehensiveAnalysisResponse(BaseModel):
    """Comprehensive analysis combining all ROCKET components"""
    session_id: str = Field(..., description="Session identifier")
    personal_story: Optional[Dict[str, Any]] = Field(default=None, description="Personal story analysis")
    car_analysis: Optional[Dict[str, Any]] = Field(default=None, description="CAR framework analysis")
    rest_quantification: Optional[Dict[str, Any]] = Field(default=None, description="REST quantification")
    psychological_profile: Optional[Dict[str, Any]] = Field(default=None, description="Psychological analysis")
    synthesis: Optional[Dict[str, Any]] = Field(default=None, description="Integrated synthesis")
    overall_confidence: float = Field(..., ge=0.0, le=1.0, description="Overall analysis confidence")
    completion_percentage: float = Field(..., ge=0.0, le=100.0, description="Analysis completion percentage")
    next_recommended_actions: List[str] = Field(..., description="Recommended next actions")
    status: str = Field(default="success", description="Response status")


class ResumeContentResponse(BaseModel):
    """Response schema for generated resume content"""
    session_id: str = Field(..., description="Session identifier")
    professional_summary: Optional[str] = Field(default=None, description="Generated professional summary")
    resume_bullets: List[str] = Field(..., description="Optimized resume bullet points")
    linkedin_summary: Optional[str] = Field(default=None, description="LinkedIn profile summary")
    interview_talking_points: List[str] = Field(..., description="Interview preparation points")
    cover_letter_template: Optional[str] = Field(default=None, description="Cover letter template")
    personal_branding_statement: Optional[str] = Field(default=None, description="Personal branding statement")
    keywords: List[str] = Field(..., description="Relevant keywords for ATS optimization")
    confidence_scores: Dict[str, float] = Field(..., description="Confidence scores for each content type")
    status: str = Field(default="success", description="Response status")