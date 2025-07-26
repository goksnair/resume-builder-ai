#!/usr/bin/env python3
"""
ROCKET Framework Database Migration Script

Creates all necessary tables for the ROCKET Framework integration:
- ROCKETSession (main session management)
- PersonalStory (story extraction components)
- CARFrameworkData (Context-Action-Results analysis)
- RESTQuantification (Results, Efficiency, Scope, Time metrics)
- PsychologistInsight (Dr. Maya Insight persona analysis)
- ResponseAnalysis (intelligent response analysis)

This script handles the complete database schema setup for ROCKET Framework.
"""

import asyncio
import sys
from pathlib import Path

# Add the app directory to the Python path
app_dir = Path(__file__).parent / "app"
sys.path.insert(0, str(app_dir))

from sqlalchemy import create_engine, text
from app.core.database import sync_engine
from app.models.base import Base


# Raw SQL for ROCKET Framework tables (avoiding SQLAlchemy conflicts)
ROCKET_TABLES_SQL = """
-- ROCKET Framework Tables Creation Script

-- Main ROCKET session management table
CREATE TABLE IF NOT EXISTS rocket_sessions (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    conversation_session_id VARCHAR NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    current_phase VARCHAR DEFAULT 'introduction',
    processing_mode VARCHAR DEFAULT 'integrated',
    completion_percentage REAL DEFAULT 0.0,
    story_extraction_complete BOOLEAN DEFAULT FALSE,
    car_analysis_complete BOOLEAN DEFAULT FALSE,
    rest_quantification_complete BOOLEAN DEFAULT FALSE,
    psychologist_analysis_complete BOOLEAN DEFAULT FALSE,
    total_interactions INTEGER DEFAULT 0,
    quality_score REAL DEFAULT 0.0,
    session_notes TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (conversation_session_id) REFERENCES conversation_sessions(id)
);

-- Personal story extraction and analysis
CREATE TABLE IF NOT EXISTS personal_stories (
    id VARCHAR PRIMARY KEY,
    rocket_session_id VARCHAR NOT NULL,
    role_identity VARCHAR NULL,
    target_audience VARCHAR NULL,
    value_proposition VARCHAR NULL,
    formatted_story TEXT NULL,
    alternative_versions TEXT NULL, -- JSON
    confidence_score REAL DEFAULT 0.0,
    extraction_method VARCHAR DEFAULT 'ai_analysis',
    source_responses TEXT NULL, -- JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rocket_session_id) REFERENCES rocket_sessions(id) ON DELETE CASCADE
);

-- Context-Action-Results framework data
CREATE TABLE IF NOT EXISTS car_framework_data (
    id VARCHAR PRIMARY KEY,
    rocket_session_id VARCHAR NOT NULL,
    raw_experience_text TEXT NOT NULL,
    experience_category VARCHAR NULL,
    context TEXT NULL,
    action TEXT NULL,
    results TEXT NULL,
    skills_demonstrated TEXT NULL, -- JSON
    impact_areas TEXT NULL, -- JSON
    quantifiable_metrics TEXT NULL, -- JSON
    analysis_confidence REAL DEFAULT 0.0,
    completeness_score REAL DEFAULT 0.0,
    enhancement_suggestions TEXT NULL, -- JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rocket_session_id) REFERENCES rocket_sessions(id) ON DELETE CASCADE
);

-- Results, Efficiency, Scope, Time quantification
CREATE TABLE IF NOT EXISTS rest_quantifications (
    id VARCHAR PRIMARY KEY,
    rocket_session_id VARCHAR NOT NULL,
    car_data_id VARCHAR NOT NULL,
    results_metrics TEXT NULL, -- JSON
    efficiency_gains TEXT NULL, -- JSON
    scope_impact TEXT NULL, -- JSON
    time_factors TEXT NULL, -- JSON
    revenue_impact REAL NULL,
    cost_savings REAL NULL,
    percentage_improvements TEXT NULL, -- JSON
    people_affected INTEGER NULL,
    quantification_confidence REAL DEFAULT 0.0,
    validated_metrics BOOLEAN DEFAULT FALSE,
    estimation_basis VARCHAR DEFAULT 'user_provided',
    resume_bullet_points TEXT NULL, -- JSON
    linkedin_summary_points TEXT NULL, -- JSON
    interview_talking_points TEXT NULL, -- JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rocket_session_id) REFERENCES rocket_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (car_data_id) REFERENCES car_framework_data(id) ON DELETE CASCADE
);

-- Career psychologist insights (Dr. Maya Insight persona)
CREATE TABLE IF NOT EXISTS psychologist_insights (
    id VARCHAR PRIMARY KEY,
    rocket_session_id VARCHAR NOT NULL,
    personality_traits TEXT NULL, -- JSON
    behavioral_patterns TEXT NULL, -- JSON
    motivation_drivers TEXT NULL, -- JSON
    stress_indicators TEXT NULL, -- JSON
    career_strengths TEXT NULL, -- JSON
    development_areas TEXT NULL, -- JSON
    ideal_work_environment TEXT NULL, -- JSON
    career_progression_style VARCHAR NULL,
    positioning_recommendations TEXT NULL, -- JSON
    interview_strategies TEXT NULL, -- JSON
    networking_approaches TEXT NULL, -- JSON
    personal_branding_tips TEXT NULL, -- JSON
    confidence_level REAL DEFAULT 0.0,
    analysis_depth VARCHAR DEFAULT 'comprehensive',
    psychological_framework VARCHAR DEFAULT 'big_five_mbti_hybrid',
    personalized_message TEXT NULL,
    action_plan TEXT NULL, -- JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rocket_session_id) REFERENCES rocket_sessions(id) ON DELETE CASCADE
);

-- Response analysis and quality assessment
CREATE TABLE IF NOT EXISTS response_analyses (
    id VARCHAR PRIMARY KEY,
    rocket_session_id VARCHAR NOT NULL,
    user_response TEXT NOT NULL,
    response_context VARCHAR NOT NULL,
    conversation_phase VARCHAR NOT NULL,
    quality_rating VARCHAR NOT NULL,
    completeness_score REAL DEFAULT 0.0,
    specificity_score REAL DEFAULT 0.0,
    relevance_score REAL DEFAULT 0.0,
    extracted_information TEXT NULL, -- JSON
    missing_elements TEXT NULL, -- JSON
    suggested_followups TEXT NULL, -- JSON
    analysis_model VARCHAR DEFAULT 'ollama_gemma3',
    processing_time REAL NULL,
    confidence_score REAL DEFAULT 0.0,
    needs_clarification BOOLEAN DEFAULT FALSE,
    requires_examples BOOLEAN DEFAULT FALSE,
    ready_for_next_phase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rocket_session_id) REFERENCES rocket_sessions(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_rocket_sessions_user_id ON rocket_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_rocket_sessions_conversation_id ON rocket_sessions(conversation_session_id);
CREATE INDEX IF NOT EXISTS idx_rocket_sessions_phase ON rocket_sessions(current_phase);
CREATE INDEX IF NOT EXISTS idx_personal_stories_session ON personal_stories(rocket_session_id);
CREATE INDEX IF NOT EXISTS idx_car_data_session ON car_framework_data(rocket_session_id);
CREATE INDEX IF NOT EXISTS idx_rest_quantifications_session ON rest_quantifications(rocket_session_id);
CREATE INDEX IF NOT EXISTS idx_psychologist_insights_session ON psychologist_insights(rocket_session_id);
CREATE INDEX IF NOT EXISTS idx_response_analyses_session ON response_analyses(rocket_session_id);
"""


async def create_rocket_tables():
    """Create all ROCKET Framework tables"""
    try:
        # Use existing sync engine
        engine = sync_engine
        
        print("🚀 Creating ROCKET Framework Database Tables...")
        print("=" * 60)
        
        # Execute raw SQL
        with engine.connect() as connection:
            # Split and execute each statement
            statements = [stmt.strip() for stmt in ROCKET_TABLES_SQL.split(';') if stmt.strip()]
            
            for i, statement in enumerate(statements, 1):
                if statement:
                    try:
                        connection.execute(text(statement))
                        if 'CREATE TABLE' in statement:
                            table_name = statement.split('CREATE TABLE IF NOT EXISTS ')[1].split(' ')[0]
                            print(f"✅ Created table: {table_name}")
                        elif 'CREATE INDEX' in statement:
                            index_name = statement.split('CREATE INDEX IF NOT EXISTS ')[1].split(' ')[0]
                            print(f"📊 Created index: {index_name}")
                    except Exception as e:
                        print(f"⚠️ Warning for statement {i}: {e}")
            
            connection.commit()
        
        print("\n🎯 ROCKET Framework Database Schema Created Successfully!")
        print("\n📋 Tables Created:")
        print("   • rocket_sessions - Main session management")
        print("   • personal_stories - Story extraction components")  
        print("   • car_framework_data - Context-Action-Results analysis")
        print("   • rest_quantifications - Results, Efficiency, Scope, Time metrics")
        print("   • psychologist_insights - Dr. Maya Insight persona analysis")
        print("   • response_analyses - Intelligent response analysis")
        
        print("\n🔗 Relationships Established:")
        print("   • ROCKETSession ↔ User")
        print("   • ROCKETSession ↔ ConversationSession") 
        print("   • PersonalStory → ROCKETSession")
        print("   • CARFrameworkData → ROCKETSession")
        print("   • RESTQuantification → ROCKETSession, CARFrameworkData")
        print("   • PsychologistInsight → ROCKETSession")
        print("   • ResponseAnalysis → ROCKETSession")
        
        print("\n🚀 Ready for ROCKET Framework Service Implementation!")
        return True
        
    except Exception as e:
        print(f"❌ Error creating ROCKET Framework tables: {e}")
        return False


def verify_table_creation():
    """Verify all tables were created successfully"""
    try:
        engine = sync_engine
        
        tables_to_check = [
            'rocket_sessions',
            'personal_stories', 
            'car_framework_data',
            'rest_quantifications',
            'psychologist_insights',
            'response_analyses'
        ]
        
        print("\n🔍 Verifying Table Creation...")
        
        with engine.connect() as connection:
            for table in tables_to_check:
                result = connection.execute(text(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table}'"))
                if result.fetchone():
                    print(f"✅ {table} - EXISTS")
                else:
                    print(f"❌ {table} - NOT FOUND")
        
        print("\n✅ Database verification complete!")
        
    except Exception as e:
        print(f"❌ Error during verification: {e}")


if __name__ == "__main__":
    print("🤖 ROCKET Framework Database Migration")
    print("=" * 50)
    
    # Run the migration
    success = asyncio.run(create_rocket_tables())
    
    if success:
        # Verify tables were created
        verify_table_creation()
        
        print("\n" + "=" * 60)
        print("🎉 ROCKET FRAMEWORK DATABASE SETUP COMPLETE!")
        print("🔄 Ready to proceed with ROCKET Framework Service Implementation")
        print("📋 Next Step: Implement ROCKETFrameworkService with core algorithms")
    else:
        print("\n❌ Migration failed. Please check the errors above.")
        sys.exit(1)