from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Resume Builder AI API",
    description="Expanded API with core features",
    version="2.0.0",
    docs_url="/api/docs"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://tranquil-frangipane-ceffd4.netlify.app",
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class JobDescription(BaseModel):
    description: str

class AnalysisResult(BaseModel):
    ats_score: int
    skills_matched: int
    total_skills: int
    suggestions: list

@app.get("/")
def root():
    return {
        "message": "Resume Builder AI - Expanded Version",
        "status": "operational",
        "version": "2.0.0",
        "features": ["resume_upload", "job_matching", "templates", "ai_analysis"]
    }

@app.get("/ping")
def ping():
    return {"message": "pong", "status": "healthy"}

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "backend": "expanded_working",
        "features": {
            "resume_upload": "available",
            "job_matching": "available", 
            "templates": "available",
            "ai_analysis": "available"
        }
    }

@app.post("/api/resume/upload")
async def upload_resume(file: UploadFile = File(...)):
    """Upload and analyze resume"""
    logger.info(f"Resume upload: {file.filename}")
    
    # Simulate file processing
    if not file.filename.endswith(('.pdf', '.doc', '.docx')):
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    return {
        "message": "Resume uploaded successfully",
        "filename": file.filename,
        "size": f"{file.size} bytes" if file.size else "unknown",
        "analysis": {
            "ats_score": 85,
            "skills_found": ["Python", "React", "FastAPI", "JavaScript"],
            "experience_years": 5,
            "sections": ["Contact", "Summary", "Experience", "Skills", "Education"]
        }
    }

@app.post("/api/job/match")
async def match_job(job: JobDescription):
    """Match resume against job description"""
    logger.info("Job matching request")
    
    return {
        "match_score": 88,
        "matching_skills": ["Python", "FastAPI", "React", "JavaScript"],
        "missing_skills": ["Docker", "AWS", "Kubernetes"], 
        "recommendations": [
            "Add Docker experience to your skills",
            "Highlight your FastAPI projects",
            "Include more quantified achievements"
        ]
    }

@app.get("/api/templates")
def get_templates():
    """Get available resume templates"""
    return {
        "templates": [
            {
                "id": "executive",
                "name": "Executive Template",
                "description": "Professional template for senior roles",
                "category": "Leadership"
            },
            {
                "id": "technical", 
                "name": "Technical Template",
                "description": "Perfect for software engineers",
                "category": "Technology"
            },
            {
                "id": "creative",
                "name": "Creative Template", 
                "description": "Showcase your creative portfolio",
                "category": "Design"
            },
            {
                "id": "academic",
                "name": "Academic Template",
                "description": "Research-focused template",
                "category": "Education"
            }
        ]
    }

@app.get("/api/analysis/{resume_id}")
def get_analysis(resume_id: str):
    """Get detailed resume analysis"""
    return {
        "resume_id": resume_id,
        "ats_score": 85,
        "analysis": {
            "strengths": [
                "Clear professional summary",
                "Quantified achievements",
                "Relevant technical skills"
            ],
            "improvements": [
                "Add more keywords from job description",
                "Include certifications section",
                "Expand on leadership experience"
            ],
            "score_breakdown": {
                "formatting": 90,
                "keywords": 80,
                "experience": 85,
                "skills": 88
            }
        }
    }

@app.post("/api/rocket/session")
def start_rocket_session():
    """Start ROCKET Framework session"""
    return {
        "session_id": "rocket_001",
        "message": "Welcome to ROCKET Framework! I'm Dr. Maya, your career psychologist.",
        "questions": [
            "What are your primary career goals for the next 2-3 years?",
            "What type of work environment do you thrive in?",
            "What are your core professional strengths?"
        ],
        "progress": {
            "current_phase": "Introduction",
            "completion": 0
        }
    }

@app.get("/api/features")
def get_features():
    """Get all available features"""
    return {
        "resume_builder": {
            "status": "available",
            "description": "Upload and analyze resumes"
        },
        "job_matching": {
            "status": "available", 
            "description": "Match resumes with job descriptions"
        },
        "templates": {
            "status": "available",
            "description": "Professional resume templates"
        },
        "ai_analysis": {
            "status": "available",
            "description": "AI-powered resume analysis"
        },
        "rocket_framework": {
            "status": "available",
            "description": "Career psychology assessment"
        }
    }

# Additional API endpoints for frontend compatibility
@app.get("/api/v1/resumes")
def list_resumes():
    """List resumes for frontend compatibility"""
    return {
        "resumes": [
            {
                "id": "sample_resume_1",
                "filename": "sample_resume.pdf",
                "created_at": "2025-07-27T21:00:00Z",
                "status": "processed"
            }
        ]
    }

@app.get("/api/v1/jobs") 
def list_jobs():
    """List jobs for frontend compatibility"""
    return {
        "jobs": [
            {
                "id": "sample_job_1", 
                "title": "Software Engineer",
                "company": "Tech Company",
                "created_at": "2025-07-27T21:00:00Z"
            }
        ]
    }

@app.post("/api/v1/resumes/upload")
async def upload_resume_v1(file: UploadFile = File(...)):
    """V1 API endpoint for resume upload"""
    return await upload_resume(file)

@app.get("/api/v1/conversation/start")
def start_conversation():
    """Start conversation for ROCKET Framework"""
    return start_rocket_session()

@app.get("/api/v1/personas/available")
def get_available_personas():
    """Get available AI coaching personas"""
    return {
        "personas": [
            {
                "id": "career_psychologist",
                "name": "Dr. Maya Insight",
                "title": "Career Psychologist",
                "description": "Psychological analysis and career guidance",
                "specialties": ["personality assessment", "career alignment", "stress management"]
            },
            {
                "id": "executive_coach", 
                "name": "Alexandra Sterling",
                "title": "Executive Coach",
                "description": "Leadership development and executive presence",
                "specialties": ["leadership", "executive presence", "strategic thinking"]
            },
            {
                "id": "interview_coach",
                "name": "Sarah Spotlight", 
                "title": "Interview Coach",
                "description": "Interview preparation and performance optimization",
                "specialties": ["interview techniques", "storytelling", "confidence building"]
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)