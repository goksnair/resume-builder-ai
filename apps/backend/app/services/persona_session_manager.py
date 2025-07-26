"""
ROCKET Framework - Multi-Persona Session Management
Orchestrates conversations between different AI personas for comprehensive career coaching
"""

import uuid
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
from sqlalchemy.orm import Session

from ..models.personas import PersonaProfile, PersonaSession, PersonaInsight, PersonaCrossAnalysis, PersonaType
from ..models.conversation import ConversationSession
from .persona_definitions import PersonaDefinitions, PersonaSelector
from .conversation_service import ROCKETFramework
from ..core.database import get_sync_db_session


class PersonaSessionManager:
    """Manages multi-persona career coaching sessions"""
    
    def __init__(self, db: Session):
        self.db = db
        self.persona_definitions = PersonaDefinitions.get_all_personas()
        self.rocket_framework = ROCKETFramework(db)
        
    def initialize_personas(self) -> bool:
        """Initialize persona profiles in database if they don't exist"""
        try:
            for persona_type, definition in self.persona_definitions.items():
                # Check if persona already exists
                existing = self.db.query(PersonaProfile).filter(
                    PersonaProfile.persona_type == persona_type
                ).first()
                
                if not existing:
                    persona_profile = PersonaProfile(
                        id=str(uuid.uuid4()),
                        persona_type=persona_type,
                        name=definition["name"],
                        title=definition["title"],
                        expertise_areas=definition["expertise_areas"],
                        conversation_style=definition["conversation_style"],
                        question_templates=definition["question_templates"],
                        analysis_focus=definition["analysis_focus"],
                        personality_traits=definition["personality_traits"],
                        success_metrics=definition["success_metrics"]
                    )
                    self.db.add(persona_profile)
            
            self.db.commit()
            return True
            
        except Exception as e:
            self.db.rollback()
            print(f"Error initializing personas: {str(e)}")
            return False
    
    def recommend_personas(self, user_goals: List[str], career_stage: str, challenges: List[str]) -> List[Dict[str, Any]]:
        """Recommend optimal personas based on user profile"""
        recommended_types = PersonaSelector.recommend_personas(user_goals, career_stage, challenges)
        
        recommendations = []
        for persona_type in recommended_types:
            persona_profile = self.db.query(PersonaProfile).filter(
                PersonaProfile.persona_type == persona_type
            ).first()
            
            if persona_profile:
                definition = self.persona_definitions[persona_type]
                recommendations.append({
                    "id": persona_profile.id,
                    "persona_type": persona_type,
                    "name": definition["name"],
                    "title": definition["title"],
                    "expertise_areas": definition["expertise_areas"],
                    "session_objectives": definition["session_objectives"],
                    "personality_traits": definition["personality_traits"]
                })
        
        return recommendations
    
    def start_persona_session(
        self, 
        user_id: str, 
        persona_type: str, 
        session_objectives: List[str],
        conversation_session_id: Optional[str] = None
    ) -> Tuple[bool, str, Dict[str, Any]]:
        """Start a new persona-specific session"""
        try:
            # Get persona profile
            persona_profile = self.db.query(PersonaProfile).filter(
                PersonaProfile.persona_type == persona_type
            ).first()
            
            if not persona_profile:
                return False, "Persona not found", {}
            
            # Create persona session
            session_id = str(uuid.uuid4())
            persona_session = PersonaSession(
                id=session_id,
                user_id=user_id,
                persona_id=persona_profile.id,
                conversation_session_id=conversation_session_id,
                session_objectives=session_objectives,
                current_phase="introduction",
                progress_percentage=0.0,
                conversation_history=[],
                status="active"
            )
            
            self.db.add(persona_session)
            self.db.commit()
            
            # Generate welcome message
            welcome_message = self._generate_welcome_message(persona_profile, session_objectives)
            
            return True, session_id, {
                "session_id": session_id,
                "persona": {
                    "name": persona_profile.name,
                    "title": persona_profile.title,
                    "persona_type": persona_type
                },
                "welcome_message": welcome_message,
                "current_phase": "introduction",
                "progress_percentage": 0.0
            }
            
        except Exception as e:
            self.db.rollback()
            return False, f"Error starting persona session: {str(e)}", {}
    
    def process_persona_response(
        self, 
        session_id: str, 
        user_response: str
    ) -> Tuple[bool, str, Dict[str, Any]]:
        """Process user response within persona context"""
        try:
            # Get persona session
            persona_session = self.db.query(PersonaSession).filter(
                PersonaSession.id == session_id
            ).first()
            
            if not persona_session:
                return False, "Persona session not found", {}
            
            if persona_session.status != "active":
                return False, "Persona session is not active", {}
            
            # Get persona definition
            persona_definition = self.persona_definitions.get(persona_session.persona_profile.persona_type)
            if not persona_definition:
                return False, "Persona definition not found", {}
            
            # Process response using persona-specific logic
            ai_response, insights, next_phase = self._process_persona_interaction(
                persona_definition,
                persona_session,
                user_response
            )
            
            # Update conversation history
            conversation_history = persona_session.conversation_history or []
            conversation_history.extend([
                {
                    "type": "user",
                    "content": user_response,
                    "timestamp": datetime.utcnow().isoformat()
                },
                {
                    "type": "assistant",
                    "content": ai_response,
                    "timestamp": datetime.utcnow().isoformat(),
                    "phase": persona_session.current_phase
                }
            ])
            
            # Update session
            persona_session.conversation_history = conversation_history
            persona_session.current_phase = next_phase
            persona_session.progress_percentage = self._calculate_progress(conversation_history, next_phase)
            
            # Store insights if generated
            if insights:
                self._store_persona_insights(session_id, insights)
            
            self.db.commit()
            
            return True, "Response processed successfully", {
                "ai_response": ai_response,
                "current_phase": next_phase,
                "progress_percentage": persona_session.progress_percentage,
                "insights_generated": len(insights) if insights else 0,
                "session_status": persona_session.status
            }
            
        except Exception as e:
            self.db.rollback()
            return False, f"Error processing persona response: {str(e)}", {}
    
    def get_persona_session_status(self, session_id: str) -> Tuple[bool, str, Dict[str, Any]]:
        """Get current status of persona session"""
        try:
            persona_session = self.db.query(PersonaSession).filter(
                PersonaSession.id == session_id
            ).first()
            
            if not persona_session:
                return False, "Persona session not found", {}
            
            # Get recent insights
            recent_insights = self.db.query(PersonaInsight).filter(
                PersonaInsight.persona_session_id == session_id
            ).order_by(PersonaInsight.created_at.desc()).limit(5).all()
            
            return True, "Session status retrieved", {
                "session_id": session_id,
                "persona": {
                    "name": persona_session.persona_profile.name,
                    "title": persona_session.persona_profile.title,
                    "persona_type": persona_session.persona_profile.persona_type
                },
                "current_phase": persona_session.current_phase,
                "progress_percentage": persona_session.progress_percentage,
                "status": persona_session.status,
                "conversation_length": len(persona_session.conversation_history or []),
                "insights_count": len(recent_insights),
                "recent_insights": [
                    {
                        "title": insight.insight_title,
                        "category": insight.insight_category,
                        "confidence": insight.confidence_score
                    } for insight in recent_insights
                ]
            }
            
        except Exception as e:
            return False, f"Error getting session status: {str(e)}", {}
    
    def complete_persona_session(self, session_id: str, satisfaction_rating: Optional[float] = None) -> Tuple[bool, str, Dict[str, Any]]:
        """Complete a persona session and generate final analysis"""
        try:
            persona_session = self.db.query(PersonaSession).filter(
                PersonaSession.id == session_id
            ).first()
            
            if not persona_session:
                return False, "Persona session not found", {}
            
            # Update session status
            persona_session.status = "completed"
            persona_session.completed_at = datetime.utcnow()
            persona_session.completion_percentage = 100.0
            
            if satisfaction_rating:
                persona_session.satisfaction_rating = satisfaction_rating
            
            # Generate final insights and recommendations
            final_analysis = self._generate_final_persona_analysis(persona_session)
            persona_session.recommendations = final_analysis.get("recommendations", [])
            persona_session.assessment_results = final_analysis.get("assessment_results", {})
            
            self.db.commit()
            
            return True, "Persona session completed successfully", {
                "session_id": session_id,
                "final_analysis": final_analysis,
                "total_insights": len(final_analysis.get("insights", [])),
                "completion_time": persona_session.completed_at.isoformat() if persona_session.completed_at else None
            }
            
        except Exception as e:
            self.db.rollback()
            return False, f"Error completing persona session: {str(e)}", {}
    
    def generate_cross_persona_analysis(self, user_id: str, session_ids: List[str]) -> Tuple[bool, str, Dict[str, Any]]:
        """Generate comprehensive analysis across multiple persona sessions"""
        try:
            # Get all persona sessions
            persona_sessions = self.db.query(PersonaSession).filter(
                PersonaSession.id.in_(session_ids),
                PersonaSession.user_id == user_id,
                PersonaSession.status == "completed"
            ).all()
            
            if len(persona_sessions) < 2:
                return False, "Need at least 2 completed persona sessions for cross-analysis", {}
            
            # Gather insights from all sessions
            all_insights = []
            for session in persona_sessions:
                session_insights = self.db.query(PersonaInsight).filter(
                    PersonaInsight.persona_session_id == session.id
                ).all()
                all_insights.extend(session_insights)
            
            # Perform cross-analysis
            cross_analysis = self._perform_cross_persona_analysis(persona_sessions, all_insights)
            
            # Store cross-analysis results
            analysis_id = str(uuid.uuid4())
            cross_analysis_record = PersonaCrossAnalysis(
                id=analysis_id,
                user_id=user_id,
                primary_persona_sessions=session_ids,
                cross_insights=cross_analysis["cross_insights"],
                consistency_analysis=cross_analysis["consistency_analysis"],
                comprehensive_profile=cross_analysis["comprehensive_profile"],
                priority_recommendations=cross_analysis["priority_recommendations"],
                development_plan=cross_analysis["development_plan"],
                success_metrics=cross_analysis["success_metrics"],
                confidence_score=cross_analysis["confidence_score"],
                completeness_score=cross_analysis["completeness_score"]
            )
            
            self.db.add(cross_analysis_record)
            self.db.commit()
            
            return True, "Cross-persona analysis completed", {
                "analysis_id": analysis_id,
                "cross_analysis": cross_analysis,
                "sessions_analyzed": len(persona_sessions),
                "total_insights": len(all_insights)
            }
            
        except Exception as e:
            self.db.rollback()
            return False, f"Error generating cross-persona analysis: {str(e)}", {}
    
    def _generate_welcome_message(self, persona_profile: PersonaProfile, objectives: List[str]) -> str:
        """Generate personalized welcome message for persona"""
        definition = self.persona_definitions[persona_profile.persona_type]
        
        welcome_template = f"""Hello! I'm {definition['name']}, your {definition['title']}. 
        
I specialize in {', '.join(definition['expertise_areas'][:3])} and I'm here to help you with:
{chr(10).join(f'• {obj}' for obj in objectives[:3])}

{definition['personality_traits']['approach']}

Let's begin with a question that will help me understand your current situation better:

{definition['question_templates']['opening'][0]}"""
        
        return welcome_template
    
    def _process_persona_interaction(
        self, 
        persona_definition: Dict[str, Any], 
        persona_session: PersonaSession, 
        user_response: str
    ) -> Tuple[str, List[Dict[str, Any]], str]:
        """Process interaction using persona-specific logic"""
        
        current_phase = persona_session.current_phase
        conversation_history = persona_session.conversation_history or []
        
        # Analyze response quality and extract insights
        response_analysis = self._analyze_persona_response(
            user_response, 
            persona_definition, 
            current_phase
        )
        
        # Generate insights based on persona focus areas
        insights = self._extract_persona_insights(
            user_response, 
            persona_definition, 
            response_analysis
        )
        
        # Determine next question/response
        ai_response = self._generate_persona_response(
            persona_definition,
            user_response,
            response_analysis,
            current_phase,
            len(conversation_history)
        )
        
        # Determine next phase
        next_phase = self._determine_next_phase(
            current_phase, 
            response_analysis, 
            len(conversation_history)
        )
        
        return ai_response, insights, next_phase
    
    def _analyze_persona_response(
        self, 
        response: str, 
        persona_definition: Dict[str, Any], 
        current_phase: str
    ) -> Dict[str, Any]:
        """Analyze user response from persona-specific perspective"""
        
        analysis = {
            "response_length": len(response.split()),
            "confidence_score": 0.0,
            "depth_score": 0.0,
            "relevance_score": 0.0,
            "key_themes": [],
            "next_probe_areas": []
        }
        
        # Basic quality scoring
        if len(response) > 50:
            analysis["confidence_score"] += 0.3
        if len(response) > 150:
            analysis["confidence_score"] += 0.2
        
        # Look for persona-specific indicators
        focus_areas = persona_definition["analysis_focus"]
        for area in focus_areas:
            if any(keyword in response.lower() for keyword in area.lower().split()):
                analysis["relevance_score"] += 0.1
                analysis["key_themes"].append(area)
        
        # Phase-specific analysis
        if current_phase == "introduction":
            if len(response) > 100:
                analysis["depth_score"] = 0.7
        elif current_phase == "deep_dive":
            if "because" in response.lower() or "resulted in" in response.lower():
                analysis["depth_score"] = 0.8
        
        # Normalize scores
        analysis["confidence_score"] = min(1.0, analysis["confidence_score"])
        analysis["relevance_score"] = min(1.0, analysis["relevance_score"])
        
        return analysis
    
    def _extract_persona_insights(
        self, 
        response: str, 
        persona_definition: Dict[str, Any], 
        analysis: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Extract insights based on persona-specific focus areas"""
        
        insights = []
        
        for theme in analysis["key_themes"]:
            insight = {
                "category": theme.lower().replace(" ", "_"),
                "title": f"{theme} Assessment",
                "description": f"User demonstrates awareness in {theme.lower()}",
                "confidence": analysis["confidence_score"],
                "supporting_evidence": [response[:200] + "..." if len(response) > 200 else response],
                "recommendations": []
            }
            insights.append(insight)
        
        return insights
    
    def _generate_persona_response(
        self, 
        persona_definition: Dict[str, Any], 
        user_response: str, 
        analysis: Dict[str, Any], 
        current_phase: str, 
        conversation_length: int
    ) -> str:
        """Generate AI response in persona's voice and style"""
        
        style = persona_definition["conversation_style"]
        templates = persona_definition["question_templates"]
        
        # Choose appropriate response based on phase and analysis
        if current_phase == "introduction" and analysis["confidence_score"] > 0.6:
            # Move to deeper questions
            next_questions = templates.get("deep_dive", ["Tell me more about that."])
            base_response = f"That's insightful. {next_questions[0]}"
        elif current_phase == "deep_dive":
            # Assessment questions
            assessment_questions = templates.get("assessment", ["How do you measure success in this area?"])
            base_response = f"I can see the depth of your experience. {assessment_questions[0]}"
        else:
            # Default follow-up
            base_response = "Thank you for sharing that. Can you provide more specific details?"
        
        # Apply persona voice
        persona_name = persona_definition["name"]
        communication_style = persona_definition["personality_traits"]["communication_style"]
        
        personalized_response = f"{base_response}\n\nAs someone who is {communication_style.lower()}, I'm particularly interested in understanding this better."
        
        return personalized_response
    
    def _determine_next_phase(
        self, 
        current_phase: str, 
        analysis: Dict[str, Any], 
        conversation_length: int
    ) -> str:
        """Determine next conversation phase"""
        
        if current_phase == "introduction":
            if analysis["confidence_score"] > 0.6 and conversation_length > 2:
                return "deep_dive"
        elif current_phase == "deep_dive":
            if conversation_length > 6 and analysis["depth_score"] > 0.5:
                return "assessment"
        elif current_phase == "assessment":
            if conversation_length > 10:
                return "synthesis"
        
        return current_phase
    
    def _calculate_progress(self, conversation_history: List[Dict], current_phase: str) -> float:
        """Calculate session progress percentage"""
        base_progress = len(conversation_history) * 5  # 5% per exchange
        
        phase_bonuses = {
            "introduction": 0,
            "deep_dive": 20,
            "assessment": 50,
            "synthesis": 80
        }
        
        total_progress = min(95, base_progress + phase_bonuses.get(current_phase, 0))
        return float(total_progress)
    
    def _store_persona_insights(self, session_id: str, insights: List[Dict[str, Any]]):
        """Store generated insights in database"""
        for insight_data in insights:
            insight = PersonaInsight(
                id=str(uuid.uuid4()),
                persona_session_id=session_id,
                insight_category=insight_data["category"],
                insight_title=insight_data["title"],
                insight_description=insight_data["description"],
                confidence_score=insight_data["confidence"],
                supporting_evidence=insight_data["supporting_evidence"],
                actionable_recommendations=insight_data.get("recommendations", []),
                priority_level="medium"
            )
            self.db.add(insight)
    
    def _generate_final_persona_analysis(self, persona_session: PersonaSession) -> Dict[str, Any]:
        """Generate comprehensive final analysis for completed session"""
        
        # Get all insights for this session
        insights = self.db.query(PersonaInsight).filter(
            PersonaInsight.persona_session_id == persona_session.id
        ).all()
        
        analysis = {
            "insights": [
                {
                    "title": insight.insight_title,
                    "category": insight.insight_category,
                    "description": insight.insight_description,
                    "confidence": insight.confidence_score
                } for insight in insights
            ],
            "recommendations": [
                f"Continue developing expertise in {insight.insight_category.replace('_', ' ')}"
                for insight in insights if insight.confidence_score > 0.7
            ],
            "assessment_results": {
                "total_insights_generated": len(insights),
                "average_confidence": sum(i.confidence_score for i in insights) / len(insights) if insights else 0,
                "top_strength_areas": [i.insight_category for i in insights if i.confidence_score > 0.8]
            }
        }
        
        return analysis
    
    def _perform_cross_persona_analysis(
        self, 
        persona_sessions: List[PersonaSession], 
        all_insights: List[PersonaInsight]
    ) -> Dict[str, Any]:
        """Perform comprehensive cross-persona analysis"""
        
        # Group insights by category
        insight_categories = {}
        for insight in all_insights:
            category = insight.insight_category
            if category not in insight_categories:
                insight_categories[category] = []
            insight_categories[category].append(insight)
        
        # Find consistent themes across personas
        consistent_themes = [
            category for category, insights in insight_categories.items()
            if len(insights) >= 2  # Mentioned by at least 2 personas
        ]
        
        # Generate comprehensive profile
        comprehensive_profile = {
            "primary_strengths": consistent_themes[:3],
            "development_areas": [
                category for category, insights in insight_categories.items()
                if any(i.confidence_score < 0.6 for i in insights)
            ],
            "persona_coverage": [session.persona_profile.persona_type for session in persona_sessions]
        }
        
        cross_analysis = {
            "cross_insights": consistent_themes,
            "consistency_analysis": {
                "agreement_score": len(consistent_themes) / len(insight_categories) if insight_categories else 0,
                "conflicting_areas": []  # Could be enhanced to detect conflicts
            },
            "comprehensive_profile": comprehensive_profile,
            "priority_recommendations": [
                f"Focus on strengthening {theme.replace('_', ' ')}" for theme in consistent_themes[:3]
            ],
            "development_plan": {
                "immediate_actions": ["Schedule follow-up sessions for development areas"],
                "medium_term_goals": ["Implement recommendations from top 3 personas"],
                "long_term_objectives": ["Achieve mastery in identified strength areas"]
            },
            "success_metrics": {
                "personas_consulted": len(persona_sessions),
                "insights_generated": len(all_insights),
                "consistency_score": len(consistent_themes) / len(insight_categories) if insight_categories else 0
            },
            "confidence_score": sum(i.confidence_score for i in all_insights) / len(all_insights) if all_insights else 0,
            "completeness_score": min(1.0, len(persona_sessions) / 3)  # More complete with more personas
        }
        
        return cross_analysis