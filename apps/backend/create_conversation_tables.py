#!/usr/bin/env python3
"""
Database migration script to create conversation tables for ROCKET Framework
Run this script to add the conversational resume builder tables to your existing database.
ROCKET = Results-Optimized Career Knowledge Enhancement Toolkit
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Add the app directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from app.core.config import settings
from app.models.base import Base
from app.models.conversation import ConversationSession, ConversationMessage, UserCareerProfile

def create_conversation_tables():
    """Create conversation tables in the database"""
    
    # Create engine using the same config as the app
    database_url = settings.SYNC_DATABASE_URL
    if not database_url:
        # Fallback to local SQLite
        database_url = "sqlite:///./resume_builder.db"
    
    engine = create_engine(database_url)
    
    print("Creating conversation tables for ROCKET Framework...")
    
    try:
        # Create all conversation tables
        Base.metadata.create_all(bind=engine, tables=[
            ConversationSession.__table__,
            ConversationMessage.__table__,
            UserCareerProfile.__table__
        ])
        
        print("✅ Successfully created conversation tables:")
        print("   - conversation_sessions")
        print("   - conversation_messages") 
        print("   - user_career_profiles")
        
        # Verify tables were created
        Session = sessionmaker(bind=engine)
        session = Session()
        
        # Test table existence
        result = session.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%conversation%'"))
        tables = [row[0] for row in result.fetchall()]
        
        if tables:
            print(f"\n✅ Verified tables exist in database: {', '.join(tables)}")
        else:
            print("\n❌ Warning: Could not verify table creation")
            
        session.close()
        
        print("\n🚀 ROCKET Framework Conversational Resume Builder is ready!")
        print("   You can now use the conversation endpoints:")
        print("   - POST /api/v1/conversation/start")
        print("   - POST /api/v1/conversation/respond")
        print("   - GET /api/v1/conversation/{session_id}/resume-preview")
        
    except Exception as e:
        print(f"❌ Error creating tables: {str(e)}")
        return False
        
    return True

if __name__ == "__main__":
    success = create_conversation_tables()
    sys.exit(0 if success else 1)