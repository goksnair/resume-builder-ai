import logging
import traceback
from uuid import uuid4
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, Query, status
from fastapi.responses import JSONResponse, StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core import get_db_session
from app.services.elite_comparison_service import EliteComparisonService, EliteComparisonError
from app.services.ats_optimization_service import ATSOptimizationService
from app.services.real_time_feedback_service import RealTimeFeedbackService
from app.services.semantic_analysis_service import SemanticAnalysisService
from app.services import ResumeNotFoundError, JobNotFoundError

logger = logging.getLogger(__name__)

elite_router = APIRouter()


class EliteAnalysisRequest(BaseModel):
    resume_id: str
    target_role: Optional[str] = None
    target_industry: Optional[str] = None


class SemanticMatchRequest(BaseModel):
    resume_id: str
    job_id: str
    analysis_depth: str = "comprehensive"


class RealtimeFeedbackRequest(BaseModel):
    resume_content: str
    target_role: Optional[str] = None
    target_industry: Optional[str] = None


class ATSAnalysisRequest(BaseModel):
    resume_content: str
    target_industry: Optional[str] = None


@elite_router.post(
    "/analyze",
    summary="Comprehensive elite resume analysis with percentile ranking"
)
async def analyze_elite_comparison(
    request: Request,
    payload: EliteAnalysisRequest,
    db: AsyncSession = Depends(get_db_session),
):
    """
    Perform comprehensive elite comparison analysis against top 1% performers.
    
    Features:
    - Multi-dimensional scoring across 6 components
    - Percentile ranking against elite benchmarks
    - Industry-specific comparisons
    - Detailed improvement recommendations
    """
    request_id = getattr(request.state, "request_id", str(uuid4()))
    headers = {"X-Request-ID": request_id}
    
    try:
        elite_service = EliteComparisonService(db)
        
        analysis_result = await elite_service.analyze_resume_elite_comparison(
            resume_id=payload.resume_id,
            target_role=payload.target_role,
            target_industry=payload.target_industry
        )
        
        return JSONResponse(
            content={
                "request_id": request_id,
                "status": "success",
                "data": analysis_result,
                "message": "Elite comparison analysis completed successfully"
            },
            headers=headers,
        )
        
    except ResumeNotFoundError as e:
        logger.error(f"Resume not found: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resume not found: {payload.resume_id}"
        )
    except EliteComparisonError as e:
        logger.error(f"Elite comparison error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Elite analysis error: {str(e)} - traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Elite analysis failed. Please try again."
        )


@elite_router.post(
    "/ats-analysis",
    summary="Comprehensive ATS optimization analysis for 50+ systems"
)
async def analyze_ats_compatibility(
    request: Request,
    payload: ATSAnalysisRequest,
):
    """
    Analyze resume compatibility with 50+ major ATS systems.
    
    Features:
    - Compatibility scoring for 50+ ATS systems
    - Industry-specific ATS prioritization
    - Format and structure analysis
    - Specific optimization recommendations
    """
    request_id = getattr(request.state, "request_id", str(uuid4()))
    headers = {"X-Request-ID": request_id}
    
    try:
        ats_service = ATSOptimizationService()
        
        ats_analysis = ats_service.analyze_ats_compatibility(
            resume_content=payload.resume_content,
            target_industry=payload.target_industry
        )
        
        return JSONResponse(
            content={
                "request_id": request_id,
                "status": "success",
                "data": ats_analysis,
                "message": "ATS compatibility analysis completed successfully"
            },
            headers=headers,
        )
        
    except Exception as e:
        logger.error(f"ATS analysis error: {str(e)} - traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="ATS analysis failed. Please try again."
        )


@elite_router.post(
    "/realtime-feedback",
    summary="Real-time resume feedback with sub-200ms response"
)
async def generate_realtime_feedback(
    request: Request,
    payload: RealtimeFeedbackRequest,
    db: AsyncSession = Depends(get_db_session),
):
    """
    Generate instant resume feedback with sub-200ms response time.
    
    Features:
    - Instant scoring and priority actions
    - Quick wins identification
    - Live metrics and improvement areas
    - Next steps guidance
    """
    request_id = getattr(request.state, "request_id", str(uuid4()))
    headers = {"X-Request-ID": request_id}
    
    try:
        feedback_service = RealTimeFeedbackService(db)
        
        instant_feedback = await feedback_service.generate_instant_feedback(
            resume_content=payload.resume_content,
            target_role=payload.target_role,
            target_industry=payload.target_industry
        )
        
        return JSONResponse(
            content={
                "request_id": request_id,
                "status": "success",
                "data": instant_feedback,
                "message": "Real-time feedback generated successfully"
            },
            headers=headers,
        )
        
    except Exception as e:
        logger.error(f"Real-time feedback error: {str(e)} - traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Real-time feedback generation failed. Please try again."
        )


@elite_router.post(
    "/progressive-feedback",
    summary="Progressive feedback with streaming updates"
)
async def generate_progressive_feedback(
    request: Request,
    payload: RealtimeFeedbackRequest,
    db: AsyncSession = Depends(get_db_session),
):
    """
    Generate progressive feedback with streaming updates.
    
    Stages:
    1. Instant feedback (0-200ms)
    2. ATS analysis (200ms-2s)
    3. Elite comparison (2s-5s)
    4. Comprehensive recommendations (5s-10s)
    """
    request_id = getattr(request.state, "request_id", str(uuid4()))
    headers = {"X-Request-ID": request_id}
    
    try:
        feedback_service = RealTimeFeedbackService(db)
        
        async def feedback_stream():
            async for feedback_update in feedback_service.generate_progressive_feedback(
                resume_content=payload.resume_content,
                target_role=payload.target_role,
                target_industry=payload.target_industry
            ):
                yield f"data: {feedback_update}\n\n"
        
        return StreamingResponse(
            content=feedback_stream(),
            media_type="text/event-stream",
            headers=headers,
        )
        
    except Exception as e:
        logger.error(f"Progressive feedback error: {str(e)} - traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Progressive feedback generation failed. Please try again."
        )


@elite_router.post(
    "/semantic-match",
    summary="Semantic analysis for job-resume matching"
)
async def analyze_semantic_match(
    request: Request,
    payload: SemanticMatchRequest,
    db: AsyncSession = Depends(get_db_session),
):
    """
    Perform semantic analysis between resume and job posting.
    
    Features:
    - Contextual understanding beyond keywords
    - Skill alignment and gap analysis
    - Role compatibility scoring
    - Improvement suggestions
    """
    request_id = getattr(request.state, "request_id", str(uuid4()))
    headers = {"X-Request-ID": request_id}
    
    try:
        semantic_service = SemanticAnalysisService(db)
        
        semantic_match = await semantic_service.analyze_job_resume_match(
            resume_id=payload.resume_id,
            job_id=payload.job_id,
            analysis_depth=payload.analysis_depth
        )
        
        # Convert to dict for JSON response
        match_data = {
            "overall_score": semantic_match.overall_score,
            "confidence": semantic_match.confidence.value,
            "skill_alignment": semantic_match.skill_alignment,
            "experience_relevance": semantic_match.experience_relevance,
            "role_compatibility": semantic_match.role_compatibility,
            "industry_alignment": semantic_match.industry_alignment,
            "missing_requirements": semantic_match.missing_requirements,
            "skill_gaps": semantic_match.skill_gaps,
            "strengths": semantic_match.strengths,
            "improvement_suggestions": semantic_match.improvement_suggestions
        }
        
        return JSONResponse(
            content={
                "request_id": request_id,
                "status": "success",
                "data": match_data,
                "message": "Semantic analysis completed successfully"
            },
            headers=headers,
        )
        
    except (ResumeNotFoundError, JobNotFoundError) as e:
        logger.error(f"Resource not found: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Semantic analysis error: {str(e)} - traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Semantic analysis failed. Please try again."
        )


@elite_router.post(
    "/skill-analysis",
    summary="Advanced skill analysis and categorization"
)
async def analyze_skills(
    request: Request,
    resume_content: str,
    db: AsyncSession = Depends(get_db_session),
):
    """
    Analyze resume content to extract and categorize skills.
    
    Features:
    - Multi-method skill extraction
    - Skill categorization and proficiency analysis
    - Certification identification
    - Skill gap recommendations
    """
    request_id = getattr(request.state, "request_id", str(uuid4()))
    headers = {"X-Request-ID": request_id}
    
    try:
        semantic_service = SemanticAnalysisService(db)
        
        skill_analysis = await semantic_service.analyze_resume_content(resume_content)
        
        # Convert to dict for JSON response
        analysis_data = {
            "technical_skills": skill_analysis.technical_skills,
            "soft_skills": skill_analysis.soft_skills,
            "domain_expertise": skill_analysis.domain_expertise,
            "certifications": skill_analysis.certifications,
            "skill_proficiency": skill_analysis.skill_proficiency,
            "skill_categories": skill_analysis.skill_categories
        }
        
        return JSONResponse(
            content={
                "request_id": request_id,
                "status": "success",
                "data": analysis_data,
                "message": "Skill analysis completed successfully"
            },
            headers=headers,
        )
        
    except Exception as e:
        logger.error(f"Skill analysis error: {str(e)} - traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Skill analysis failed. Please try again."
        )


@elite_router.get(
    "/benchmarks",
    summary="Get elite benchmarks and industry standards"
)
async def get_elite_benchmarks(
    request: Request,
    industry: Optional[str] = Query(None, description="Industry for specific benchmarks"),
    role: Optional[str] = Query(None, description="Role for specific benchmarks"),
):
    """
    Get elite benchmarks and industry standards for reference.
    
    Returns:
    - Top 1% performance thresholds
    - Industry-specific standards
    - Role-specific requirements
    - Scoring criteria explanations
    """
    request_id = getattr(request.state, "request_id", str(uuid4()))
    headers = {"X-Request-ID": request_id}
    
    try:
        # Static benchmarks data (in production, this would come from database)
        benchmarks = {
            "scoring_dimensions": {
                "content_quality": {
                    "weight": 0.25,
                    "description": "Keywords, achievements, quantifiable results",
                    "elite_threshold": 0.91,
                    "excellent_threshold": 0.85,
                    "good_threshold": 0.75
                },
                "structure_optimization": {
                    "weight": 0.20,
                    "description": "ATS compatibility, formatting, sections",
                    "elite_threshold": 0.88,
                    "excellent_threshold": 0.82,
                    "good_threshold": 0.72
                },
                "industry_alignment": {
                    "weight": 0.20,
                    "description": "Role-specific requirements and standards",
                    "elite_threshold": 0.87,
                    "excellent_threshold": 0.80,
                    "good_threshold": 0.70
                },
                "achievement_impact": {
                    "weight": 0.15,
                    "description": "Quantifiable results and business impact",
                    "elite_threshold": 0.86,
                    "excellent_threshold": 0.78,
                    "good_threshold": 0.68
                },
                "communication_clarity": {
                    "weight": 0.10,
                    "description": "Professional language and presentation",
                    "elite_threshold": 0.90,
                    "excellent_threshold": 0.84,
                    "good_threshold": 0.74
                },
                "rocket_alignment": {
                    "weight": 0.10,
                    "description": "Personality-career alignment optimization",
                    "elite_threshold": 0.85,
                    "excellent_threshold": 0.75,
                    "good_threshold": 0.65
                }
            },
            "percentile_rankings": {
                "top_1_percent": {"min_score": 0.95, "description": "Elite performers"},
                "top_5_percent": {"min_score": 0.90, "description": "Exceptional candidates"},
                "top_10_percent": {"min_score": 0.85, "description": "Outstanding professionals"},
                "top_20_percent": {"min_score": 0.75, "description": "Strong candidates"},
                "average": {"min_score": 0.60, "description": "Developing professionals"}
            },
            "ats_compatibility": {
                "excellent": {"min_score": 0.90, "grade": "A+"},
                "very_good": {"min_score": 0.85, "grade": "A"},
                "good": {"min_score": 0.75, "grade": "B"},
                "fair": {"min_score": 0.65, "grade": "C"},
                "poor": {"max_score": 0.64, "grade": "D"}
            },
            "industry_standards": {
                "technology": {
                    "key_skills": ["programming", "system design", "problem solving"],
                    "avg_experience_years": 5.2,
                    "common_certifications": ["AWS", "Azure", "GCP", "Kubernetes"]
                },
                "finance": {
                    "key_skills": ["financial analysis", "risk management", "compliance"],
                    "avg_experience_years": 6.8,
                    "common_certifications": ["CFA", "FRM", "CPA", "PMP"]
                },
                "healthcare": {
                    "key_skills": ["clinical expertise", "patient care", "regulatory compliance"],
                    "avg_experience_years": 7.5,
                    "common_certifications": ["Board Certification", "HIPAA", "Clinical"]
                }
            }
        }
        
        # Filter by industry/role if specified
        if industry and industry.lower() in benchmarks["industry_standards"]:
            benchmarks["filtered_standards"] = benchmarks["industry_standards"][industry.lower()]
        
        return JSONResponse(
            content={
                "request_id": request_id,
                "status": "success",
                "data": benchmarks,
                "message": "Elite benchmarks retrieved successfully"
            },
            headers=headers,
        )
        
    except Exception as e:
        logger.error(f"Benchmarks retrieval error: {str(e)} - traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve benchmarks. Please try again."
        )


@elite_router.get(
    "/health",
    summary="Health check for elite analysis services"
)
async def health_check():
    """Health check endpoint for elite analysis services."""
    return {
        "status": "healthy",
        "services": {
            "elite_comparison": "operational",
            "ats_optimization": "operational", 
            "real_time_feedback": "operational",
            "semantic_analysis": "operational"
        },
        "version": "1.0.0",
        "features": [
            "Multi-dimensional scoring",
            "Top 1% benchmarking",
            "50+ ATS compatibility",
            "Real-time feedback",
            "Semantic job matching"
        ]
    }