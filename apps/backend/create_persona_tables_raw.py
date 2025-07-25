#!/usr/bin/env python3
"""
ROCKET Framework - Multi-Persona Database Migration (Raw SQL)
Creates database tables for the multi-persona coaching system using raw SQL
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

def create_persona_tables():
    """Create all persona-related tables using raw SQL"""
    try:
        # Create database engine
        database_url = settings.SYNC_DATABASE_URL or "sqlite:///./resume_builder.db"
        engine = create_engine(database_url, echo=True)
        
        print("🚀 Creating ROCKET Framework Persona Tables...")
        print(f"Database URL: {database_url}")
        
        # Create tables using raw SQL to avoid conflicts
        with engine.connect() as conn:
            # Drop tables if they exist (for clean migration)
            print("🗑️  Dropping existing persona tables if they exist...")
            conn.execute(text("DROP TABLE IF EXISTS persona_cross_analysis"))
            conn.execute(text("DROP TABLE IF EXISTS persona_insights"))
            conn.execute(text("DROP TABLE IF EXISTS persona_sessions"))
            conn.execute(text("DROP TABLE IF EXISTS persona_profiles"))
            conn.commit()
            
            # Create persona_profiles table
            print("📋 Creating persona_profiles table...")
            conn.execute(text("""
                CREATE TABLE persona_profiles (
                    id VARCHAR NOT NULL PRIMARY KEY,
                    persona_type VARCHAR NOT NULL,
                    name VARCHAR NOT NULL,
                    title VARCHAR NOT NULL,
                    expertise_areas JSON NOT NULL,
                    conversation_style JSON NOT NULL,
                    question_templates JSON NOT NULL,
                    analysis_focus JSON NOT NULL,
                    personality_traits JSON NOT NULL,
                    success_metrics JSON NOT NULL,
                    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                )
            """))
            
            # Create persona_sessions table
            print("💬 Creating persona_sessions table...")
            conn.execute(text("""
                CREATE TABLE persona_sessions (
                    id VARCHAR NOT NULL PRIMARY KEY,
                    user_id VARCHAR,
                    persona_id VARCHAR NOT NULL,
                    conversation_session_id VARCHAR,
                    session_objectives JSON,
                    session_plan JSON,
                    current_phase VARCHAR DEFAULT 'introduction',
                    progress_percentage FLOAT DEFAULT 0.0,
                    conversation_history JSON,
                    insights_generated JSON,
                    recommendations JSON,
                    assessment_results JSON,
                    status VARCHAR DEFAULT 'active',
                    satisfaction_rating FLOAT,
                    completion_percentage FLOAT DEFAULT 0.0,
                    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    completed_at DATETIME,
                    FOREIGN KEY (persona_id) REFERENCES persona_profiles(id),
                    FOREIGN KEY (conversation_session_id) REFERENCES conversation_sessions(id)
                )
            """))
            
            # Create persona_insights table
            print("💡 Creating persona_insights table...")
            conn.execute(text("""
                CREATE TABLE persona_insights (
                    id VARCHAR NOT NULL PRIMARY KEY,
                    persona_session_id VARCHAR NOT NULL,
                    user_id VARCHAR,
                    insight_category VARCHAR NOT NULL,
                    insight_title VARCHAR NOT NULL,
                    insight_description TEXT NOT NULL,
                    confidence_score FLOAT NOT NULL,
                    supporting_evidence JSON,
                    related_responses JSON,
                    actionable_recommendations JSON,
                    priority_level VARCHAR DEFAULT 'medium',
                    user_validated VARCHAR,
                    user_feedback TEXT,
                    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (persona_session_id) REFERENCES persona_sessions(id)
                )
            """))
            
            # Create persona_cross_analysis table
            print("🔍 Creating persona_cross_analysis table...")
            conn.execute(text("""
                CREATE TABLE persona_cross_analysis (
                    id VARCHAR NOT NULL PRIMARY KEY,
                    user_id VARCHAR NOT NULL,
                    primary_persona_sessions JSON NOT NULL,
                    cross_insights JSON NOT NULL,
                    consistency_analysis JSON,
                    comprehensive_profile JSON,
                    priority_recommendations JSON,
                    development_plan JSON,
                    success_metrics JSON,
                    confidence_score FLOAT NOT NULL,
                    completeness_score FLOAT NOT NULL,
                    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                )
            """))
            
            conn.commit()
        
        print("✅ Successfully created persona tables:")
        print("   - persona_profiles")
        print("   - persona_sessions")
        print("   - persona_insights")
        print("   - persona_cross_analysis")
        
        # Initialize personas in database
        print("\n🤖 Initializing 7 AI Persona Profiles...")
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        try:
            from app.services.persona_session_manager import PersonaSessionManager
            manager = PersonaSessionManager(db)
            success = manager.initialize_personas()
            
            if success:
                print("✅ Successfully initialized all persona profiles:")
                print("   - Alexandra Sterling (Executive Coach)")
                print("   - Dr. Maya Wellness (Life Coach)") 
                print("   - Dr. James Insight (Career Psychologist)")
                print("   - Marcus TechFlow (Industry Expert)")
                print("   - Sarah Spotlight (Interview Coach)")
                print("   - David ValueMax (Salary Negotiator)")
                print("   - Elena Connector (Network Builder)")
                print("\n🎯 Multi-Persona System Ready for Production!")
            else:
                print("❌ Failed to initialize persona profiles")
                
        except Exception as e:
            print(f"⚠️  Warning: Could not initialize personas - {str(e)}")
            print("   Tables created successfully, but persona initialization failed")
            print("   You can run /api/v1/personas/initialize to set up personas later")
            
        finally:
            db.close()
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating persona tables: {str(e)}")
        return False

if __name__ == "__main__":
    print("""
    ╔══════════════════════════════════════════════════════════════╗
    ║                 🚀 ROCKET FRAMEWORK                          ║
    ║            Multi-Persona Database Migration                  ║
    ║                                                              ║
    ║  Creating tables for 7 AI Career Coaches:                   ║
    ║  • Executive Coach • Life Coach • Career Psychologist       ║
    ║  • Industry Expert • Interview Coach • Salary Negotiator    ║
    ║  • Network Builder                                           ║
    ╚══════════════════════════════════════════════════════════════╝
    """)
    
    success = create_persona_tables()
    
    if success:
        print("\n🎉 ROCKET Framework Multi-Persona System Successfully Deployed!")
        print("\n📋 Next Steps:")
        print("   1. Start backend server: uvicorn app.main:app --reload")
        print("   2. Test personas endpoint: GET /api/v1/personas/available")
        print("   3. Start using multi-persona coaching system")
        print("\n🔗 API Endpoints Available:")
        print("   • POST /api/v1/personas/recommend - Get persona recommendations")
        print("   • POST /api/v1/personas/session/start - Start coaching session")
        print("   • POST /api/v1/personas/session/{id}/respond - Chat with persona")
        print("   • POST /api/v1/personas/analysis/cross-persona - Multi-persona analysis")
    else:
        print("\n❌ Migration failed. Please check the error messages above.")
        sys.exit(1)