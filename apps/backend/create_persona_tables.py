#!/usr/bin/env python3
"""
ROCKET Framework - Multi-Persona Database Migration
Creates database tables for the multi-persona coaching system
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.base import Base
from app.core.config import settings

def create_persona_tables():
    """Create all persona-related tables"""
    try:
        # Create database engine
        database_url = settings.SYNC_DATABASE_URL or "sqlite:///./resume_builder.db"
        engine = create_engine(
            database_url,
            echo=True  # Enable SQL logging for debugging
        )
        
        print("🚀 Creating ROCKET Framework Persona Tables...")
        print(f"Database URL: {database_url}")
        
        # Import persona models to register them with Base metadata
        from app.models import personas
        
        # Create all tables defined in persona models
        Base.metadata.create_all(bind=engine, checkfirst=True)
        
        print("✅ Successfully created persona tables:")
        print("   - persona_profiles")
        print("   - persona_sessions")
        print("   - persona_insights")
        print("   - persona_cross_analysis")
        
        # Initialize personas in database
        from sqlalchemy.orm import sessionmaker
        from app.services.persona_session_manager import PersonaSessionManager
        
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        try:
            print("\n🤖 Initializing 7 AI Persona Profiles...")
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