from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class ConversationPhase(str, Enum):
    INTRODUCTION = "introduction"
    STORY_DISCOVERY = "story_discovery"
    ACHIEVEMENT_MINING = "achievement_mining"
    QUANTIFICATION = "quantification"
    OPTIMIZATION = "optimization"
    SYNTHESIS = "synthesis"
    REVIEW = "review"


class ConversationStyle(BaseModel):
    tone: str = Field(..., description="Communication tone: executive, coaching, analytical, empathetic")
    question_depth: str = Field(..., description="Question depth: surface, medium, deep")
    feedback_style: str = Field(..., description="Feedback approach: direct, supportive, challenging")
    vocabulary_level: str = Field(..., description="Language complexity: technical, business, conversational")


class PersonalStory(BaseModel):
    """ROCKET Framework core personal story structure"""
    role_identity: Optional[str] = Field(None, description="What are they?")
    value_proposition: Optional[str] = Field(None, description="What can they help achieve?")
    unique_differentiator: Optional[str] = Field(None, description="What makes them THE best choice?")
    story_statement: Optional[str] = Field(None, description="I'm the [ROLE] who can help [TARGET] achieve [OUTCOME]")
    coherence_score: float = Field(0.0, description="Story clarity and coherence rating")


class CARExperience(BaseModel):
    """CAR Framework: Context-Action-Results"""
    context: str = Field(..., description="The situation or challenge (10,000-feet view)")
    action: str = Field(..., description="Specific actions taken")
    results: str = Field(..., description="Measurable outcomes")


class RESTMetrics(BaseModel):
    """REST Framework for quantification"""
    results: Optional[str] = Field(None, description="Direct business impact")
    efficiency: Optional[str] = Field(None, description="Time or resource savings")
    scope: Optional[str] = Field(None, description="People/systems/processes affected")
    time: Optional[str] = Field(None, description="Speed of achievement")


class WorkExperienceData(BaseModel):
    """Enhanced work experience with CAR + REST"""
    company: Optional[str] = None
    title: Optional[str] = None
    duration: Optional[str] = None
    car_structure: Optional[CARExperience] = None
    rest_metrics: Optional[RESTMetrics] = None
    keywords: List[str] = Field(default_factory=list)
    quantified_achievements: List[str] = Field(default_factory=list)


class PersonalityProfile(BaseModel):
    """Comprehensive personality assessment"""
    leadership_style: Optional[str] = None
    work_preferences: Dict[str, Any] = Field(default_factory=dict)
    communication_style: Optional[str] = None
    decision_making_approach: Optional[str] = None
    stress_management: Optional[str] = None
    motivation_drivers: List[str] = Field(default_factory=list)


class IntelligenceScores(BaseModel):
    """Multi-dimensional intelligence assessment"""
    analytical: float = Field(0.0, ge=0.0, le=1.0)
    emotional: float = Field(0.0, ge=0.0, le=1.0)
    creative: float = Field(0.0, ge=0.0, le=1.0)
    strategic: float = Field(0.0, ge=0.0, le=1.0)
    execution: float = Field(0.0, ge=0.0, le=1.0)


class ResumeConversationState(BaseModel):
    """Core conversation state following ROCKET Framework"""
    # ROCKET Core Components
    personal_story: Optional[PersonalStory] = None
    resume_summary_bullets: List[str] = Field(default_factory=list)
    work_experiences: List[WorkExperienceData] = Field(default_factory=list)
    
    # Conversation State
    current_phase: ConversationPhase = ConversationPhase.INTRODUCTION
    completed_tasks: List[str] = Field(default_factory=list)
    personality_insights: Optional[PersonalityProfile] = None
    intelligence_scores: Optional[IntelligenceScores] = None
    
    # ROCKET Framework Assessment Areas
    story_coherence_score: float = Field(0.0, ge=0.0, le=1.0)
    keyword_optimization: Dict[str, List[str]] = Field(default_factory=dict)
    customization_level: float = Field(0.0, ge=0.0, le=1.0)
    information_clarity: float = Field(0.0, ge=0.0, le=1.0)
    achievement_quantification: float = Field(0.0, ge=0.0, le=1.0)
    error_assessment: List[str] = Field(default_factory=list)


class FollowUpStrategy(str, Enum):
    QUANTIFICATION_PROBE = "quantification_probe"
    CONFIDENCE_BOOST = "confidence_boost"
    DEPTH_EXPLORATION = "depth_exploration"
    CLARIFICATION = "clarification"
    PROCEED = "proceed"


class QuestionPattern(BaseModel):
    question: str
    follow_up_triggers: Dict[str, str] = Field(default_factory=dict)
    extraction_goal: str
    rest_follow_up: List[str] = Field(default_factory=list)


class CareerPersona(BaseModel):
    """Multi-persona system for comprehensive career counseling"""
    name: str
    role: str
    expertise: List[str]
    conversation_style: ConversationStyle
    question_patterns: List[QuestionPattern] = Field(default_factory=list)
    analysis_focus: List[str] = Field(default_factory=list)


class ConversationResponse(BaseModel):
    message: str
    phase: ConversationPhase
    questions: List[str] = Field(default_factory=list)
    follow_up_strategy: Optional[FollowUpStrategy] = None
    progress_percentage: float = Field(0.0, ge=0.0, le=100.0)
    session_id: Optional[str] = None


class ConversationRequest(BaseModel):
    user_input: str
    session_id: Optional[str] = None
    persona_key: Optional[str] = None


class ResumeSummary(BaseModel):
    """ROCKET Framework 5-bullet resume summary structure"""
    title: str = Field(..., description="Optimized professional title")
    bullets: List[str] = Field(..., min_items=5, max_items=5, description="5 strategic bullets")


class PersonaSession(BaseModel):
    persona: CareerPersona
    objectives: List[str]
    conversation_state: Dict[str, Any] = Field(default_factory=dict)
    session_plan: List[str] = Field(default_factory=list)


# Request/Response Models
class StartConversationRequest(BaseModel):
    user_id: Optional[str] = None


class StartConversationResponse(BaseModel):
    session_id: str
    message: str
    phase: ConversationPhase


class ProcessResponseRequest(BaseModel):
    session_id: str
    user_input: str


class ProcessResponseResponse(BaseModel):
    message: str
    phase: ConversationPhase
    progress_percentage: float
    follow_up_strategy: Optional[FollowUpStrategy] = None


class ResumePreview(BaseModel):
    name: str
    target_role: str
    summary: Optional[ResumeSummary] = None
    experiences: List[WorkExperienceData] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)
    progress_scores: Dict[str, float] = Field(default_factory=dict)