"""
ROCKET Framework - Unified Conversation Orchestration Service
Seamlessly integrates ROCKET Framework + Multi-Persona System + Existing AI
"""

import asyncio
import json
import uuid
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
from enum import Enum
from sqlalchemy.orm import Session

from ..agent.manager import AgentManager
from ..models.conversation import ConversationSession, ConversationMessage, UserCareerProfile, ConversationPhase
from ..models.personas import PersonaProfile, PersonaSession, PersonaInsight, PersonaType
from .conversation_service import ROCKETFramework
from .enhanced_career_psychologist import DrMayaInsightService
from .persona_session_manager import PersonaSessionManager
from .persona_definitions import PersonaDefinitions


class ConversationMode(Enum):
    """Different conversation modes for unified orchestration"""
    ROCKET_STANDARD = "rocket_standard"          # Standard ROCKET Framework
    PSYCHOLOGY_ENHANCED = "psychology_enhanced"  # Dr. Maya Insight focused
    MULTI_PERSONA = "multi_persona"             # Multiple persona switching
    INTEGRATED_COACHING = "integrated_coaching"  # Full integration mode


class UnifiedConversationOrchestrator:
    """Main orchestrator for all conversation modes and AI services"""
    
    def __init__(self, db: Session):
        self.db = db
        self.agent_manager = AgentManager(strategy="json", model="gemma3:4b")
        self.rocket_framework = ROCKETFramework()
        self.psychology_service = DrMayaInsightService(db)
        self.persona_manager = PersonaSessionManager(db)
        
    async def process_conversation(
        self, 
        session_id: str, 
        user_input: str, 
        mode: ConversationMode = ConversationMode.INTEGRATED_COACHING,
        persona_preference: Optional[str] = None
    ) -> Dict[str, Any]:
        """Main entry point for processing user conversation with unified intelligence"""
        
        try:
            # Get or create conversation session
            session = await self._get_or_create_session(session_id)
            
            # Analyze user input for routing and processing
            input_analysis = await self._analyze_user_input(user_input, session)
            
            # Route to appropriate processing mode
            if mode == ConversationMode.ROCKET_STANDARD:
                response = await self._process_rocket_standard(session, user_input, input_analysis)
            elif mode == ConversationMode.PSYCHOLOGY_ENHANCED:
                response = await self._process_psychology_enhanced(session, user_input, input_analysis)
            elif mode == ConversationMode.MULTI_PERSONA:
                response = await self._process_multi_persona(session, user_input, input_analysis, persona_preference)
            else:  # INTEGRATED_COACHING
                response = await self._process_integrated_coaching(session, user_input, input_analysis)
            
            # Store conversation message
            await self._store_conversation_message(session, user_input, response)
            
            # Update session state and progress
            await self._update_session_state(session, response)
            
            return {
                "success": True,
                "response": response,
                "session_state": await self._get_session_state(session),
                "processing_mode": mode.value
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "fallback_response": await self._generate_fallback_response(user_input)
            }
    
    async def _get_or_create_session(self, session_id: str) -> ConversationSession:
        """Get existing session or create new one"""
        session = self.db.query(ConversationSession).filter(
            ConversationSession.id == session_id
        ).first()
        
        if not session:
            session = ConversationSession(
                id=session_id,
                current_phase=ConversationPhase.INTRODUCTION,
                conversation_state={"mode": "integrated_coaching", "personas_used": []}
            )
            self.db.add(session)
            self.db.commit()
        
        return session
    
    async def _analyze_user_input(self, user_input: str, session: ConversationSession) -> Dict[str, Any]:
        """Comprehensive analysis of user input for intelligent routing"""
        
        analysis = {
            "intent": await self._detect_user_intent(user_input),
            "emotional_state": self._detect_emotional_state(user_input),
            "complexity_level": self._assess_response_complexity(user_input),
            "psychological_indicators": self._detect_psychological_needs(user_input),
            "rocket_readiness": self._assess_rocket_readiness(user_input, session),
            "persona_alignment": await self._assess_persona_alignment(user_input),
            "conversation_stage": self._determine_conversation_stage(session)
        }
        
        return analysis
    
    async def _process_rocket_standard(self, session: ConversationSession, user_input: str, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Process using standard ROCKET Framework approach"""
        
        # Get conversation history
        conversation_history = await self._get_conversation_history(session)
        
        # Apply ROCKET Framework analysis
        rocket_analysis = await self._apply_rocket_analysis(user_input, conversation_history, session)
        
        # Generate ROCKET-focused response
        ai_response = await self._generate_rocket_response(user_input, rocket_analysis, session)
        
        # Calculate progress and next steps
        progress_data = self._calculate_rocket_progress(rocket_analysis, session)
        
        return {
            "ai_response": ai_response,
            "rocket_analysis": rocket_analysis,
            "progress_data": progress_data,
            "mode": "rocket_standard",
            "next_recommendations": self._get_rocket_next_steps(rocket_analysis)
        }
    
    async def _process_psychology_enhanced(self, session: ConversationSession, user_input: str, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Process with Dr. Maya Insight psychology focus"""
        
        # Get conversation history
        conversation_history = await self._get_conversation_history(session)
        
        # Generate psychological analysis
        psychology_analysis = await self.psychology_service.generate_psychologist_response(
            user_input, 
            {"session_id": session.id}, 
            conversation_history
        )
        
        # Combine with basic ROCKET insights
        rocket_insights = await self._get_basic_rocket_insights(user_input, conversation_history)
        
        return {
            "ai_response": psychology_analysis["ai_response"],
            "psychological_insights": psychology_analysis["psychological_insights"],
            "rocket_insights": rocket_insights,
            "follow_up_questions": psychology_analysis["follow_up_questions"],
            "mode": "psychology_enhanced",
            "confidence_score": psychology_analysis["confidence_score"]
        }
    
    async def _process_multi_persona(self, session: ConversationSession, user_input: str, analysis: Dict[str, Any], persona_preference: Optional[str]) -> Dict[str, Any]:
        """Process using multi-persona approach"""
        
        # Determine optimal persona based on input and preferences
        optimal_persona = await self._select_optimal_persona(user_input, analysis, persona_preference)
        
        # Get or create persona session
        persona_session = await self._get_or_create_persona_session(session.id, optimal_persona)
        
        # Process with selected persona
        persona_response = await self.persona_manager.process_persona_response(
            persona_session["session_id"], 
            user_input
        )
        
        # Add basic ROCKET context
        rocket_context = await self._get_basic_rocket_insights(user_input, [])
        
        return {
            "ai_response": persona_response[2]["ai_response"] if persona_response[0] else "Processing...",
            "persona_used": optimal_persona,
            "persona_insights": persona_response[2].get("insights_generated", 0) if persona_response[0] else 0,
            "rocket_context": rocket_context,
            "mode": "multi_persona",
            "session_progress": persona_response[2].get("progress_percentage", 0) if persona_response[0] else 0
        }
    
    async def _process_integrated_coaching(self, session: ConversationSession, user_input: str, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Process using full integrated coaching approach - the premium experience"""
        
        # Get conversation history
        conversation_history = await self._get_conversation_history(session)
        
        # Parallel processing for comprehensive analysis
        async def get_rocket_analysis():
            return await self._apply_rocket_analysis(user_input, conversation_history, session)
        
        async def get_psychology_analysis():
            return await self.psychology_service.generate_psychologist_response(
                user_input, {"session_id": session.id}, conversation_history
            )
        
        async def get_persona_recommendations():
            return await self._get_persona_recommendations(user_input, analysis)
        
        # Run analyses in parallel for performance
        rocket_analysis, psychology_analysis, persona_recs = await asyncio.gather(
            get_rocket_analysis(),
            get_psychology_analysis(), 
            get_persona_recommendations()
        )
        
        # Synthesize all analyses into unified response
        unified_response = await self._synthesize_unified_response(
            user_input, rocket_analysis, psychology_analysis, persona_recs, session
        )
        
        # Calculate comprehensive progress
        progress_data = self._calculate_integrated_progress(rocket_analysis, psychology_analysis, session)
        
        return {
            "ai_response": unified_response["primary_response"],
            "rocket_insights": rocket_analysis,
            "psychological_insights": psychology_analysis["psychological_insights"][:3],  # Top 3
            "persona_recommendations": persona_recs,
            "alternative_responses": unified_response["alternative_perspectives"],
            "progress_data": progress_data,
            "mode": "integrated_coaching",
            "confidence_score": unified_response["confidence_score"],
            "next_steps": unified_response["recommended_next_steps"]
        }
    
    async def _detect_user_intent(self, user_input: str) -> str:
        """Detect user's primary intent from their input"""
        
        intent_patterns = {
            "career_guidance": ["career", "job", "role", "position", "work", "professional"],
            "skill_development": ["skill", "learn", "improve", "develop", "training", "education"],
            "interview_prep": ["interview", "questions", "preparation", "practice"],
            "salary_negotiation": ["salary", "compensation", "pay", "negotiate", "raise"],
            "networking": ["network", "connections", "people", "relationships", "contacts"],
            "life_balance": ["balance", "stress", "time", "personal", "family", "health"],
            "resume_building": ["resume", "cv", "application", "experience", "achievements"]
        }
        
        user_lower = user_input.lower()
        intent_scores = {}
        
        for intent, keywords in intent_patterns.items():
            score = sum(1 for keyword in keywords if keyword in user_lower)
            if score > 0:
                intent_scores[intent] = score
        
        if intent_scores:
            return max(intent_scores, key=intent_scores.get)
        else:
            return "general_career"
    
    def _detect_emotional_state(self, user_input: str) -> str:
        """Detect user's emotional state for appropriate response tone"""
        
        text_lower = user_input.lower()
        
        # Emotional indicators
        positive_emotions = ["excited", "happy", "confident", "motivated", "passionate", "enthusiastic"]
        negative_emotions = ["stressed", "worried", "frustrated", "confused", "overwhelmed", "anxious"]
        neutral_emotions = ["think", "consider", "wondering", "curious", "interested"]
        
        positive_count = sum(1 for word in positive_emotions if word in text_lower)
        negative_count = sum(1 for word in negative_emotions if word in text_lower)
        
        if positive_count > negative_count:
            return "positive"
        elif negative_count > positive_count:
            return "negative"
        else:
            return "neutral"
    
    def _assess_response_complexity(self, user_input: str) -> str:
        """Assess complexity level of user's response"""
        
        word_count = len(user_input.split())
        sentence_count = len([s for s in user_input.split('.') if s.strip()])
        
        if word_count > 50 and sentence_count > 3:
            return "high"
        elif word_count > 20:
            return "medium"
        else:
            return "low"
    
    def _detect_psychological_needs(self, user_input: str) -> List[str]:
        """Detect psychological needs indicated in user input"""
        
        needs_patterns = {
            "clarity": ["confused", "unclear", "don't know", "unsure", "direction"],
            "confidence": ["insecure", "doubt", "uncertain", "worried", "scared"],
            "validation": ["right track", "doing well", "feedback", "opinion", "thoughts"],
            "motivation": ["stuck", "unmotivated", "inspiration", "drive", "purpose"],
            "structure": ["plan", "steps", "roadmap", "guidance", "framework"]
        }
        
        detected_needs = []
        user_lower = user_input.lower()
        
        for need, patterns in needs_patterns.items():
            if any(pattern in user_lower for pattern in patterns):
                detected_needs.append(need)
        
        return detected_needs
    
    def _assess_rocket_readiness(self, user_input: str, session: ConversationSession) -> float:
        """Assess how ready the user is for ROCKET Framework techniques"""
        
        readiness_score = 0.5  # baseline
        
        # Check if they mention specific achievements or results
        achievement_indicators = ["achieved", "accomplished", "delivered", "resulted", "improved", "increased"]
        if any(indicator in user_input.lower() for indicator in achievement_indicators):
            readiness_score += 0.2
        
        # Check conversation stage
        if session.current_phase in [ConversationPhase.ACHIEVEMENT_MINING, ConversationPhase.QUANTIFICATION]:
            readiness_score += 0.2
        
        # Check for quantifiable details
        if any(char.isdigit() for char in user_input):
            readiness_score += 0.1
        
        return min(1.0, readiness_score)
    
    async def _assess_persona_alignment(self, user_input: str) -> Dict[str, float]:
        """Assess alignment with different personas"""
        
        persona_indicators = {
            "executive_coach": ["leadership", "strategy", "management", "executive", "team"],
            "life_coach": ["balance", "values", "purpose", "fulfillment", "meaning"],
            "career_psychologist": ["personality", "behavior", "motivation", "style", "patterns"],
            "industry_expert": ["industry", "trends", "market", "competition", "sector"],
            "interview_coach": ["interview", "questions", "preparation", "answers"],
            "salary_negotiator": ["salary", "compensation", "negotiate", "value", "pay"],
            "network_builder": ["network", "connections", "relationships", "people"]
        }
        
        alignment_scores = {}
        user_lower = user_input.lower()
        
        for persona, indicators in persona_indicators.items():
            score = sum(0.2 for indicator in indicators if indicator in user_lower)
            alignment_scores[persona] = min(1.0, score)
        
        return alignment_scores
    
    def _determine_conversation_stage(self, session: ConversationSession) -> str:
        """Determine what stage of conversation we're in"""
        
        message_count = len(session.messages) if session.messages else 0
        
        if message_count < 3:
            return "introduction"
        elif message_count < 8:
            return "exploration"
        elif message_count < 15:
            return "deep_dive"
        else:
            return "synthesis"
    
    async def _apply_rocket_analysis(self, user_input: str, conversation_history: List[str], session: ConversationSession) -> Dict[str, Any]:
        """Apply comprehensive ROCKET Framework analysis"""
        
        # Use existing ROCKET Framework service
        all_responses = conversation_history + [user_input]
        
        # Personal story analysis
        personal_story = self.rocket_framework.analyze_personal_story(all_responses)
        
        # CAR framework extraction if applicable
        car_analysis = None
        if len(user_input.split()) > 20:  # Substantial response
            car_analysis = self.rocket_framework.extract_car_structure(user_input)
        
        # Generate ROCKET insights
        rocket_insights = await self._generate_rocket_insights(user_input, all_responses)
        
        return {
            "personal_story": personal_story.__dict__ if personal_story else None,
            "car_analysis": car_analysis.__dict__ if car_analysis else None,
            "rocket_insights": rocket_insights,
            "readiness_score": self._assess_rocket_readiness(user_input, session)
        }
    
    async def _generate_rocket_response(self, user_input: str, rocket_analysis: Dict[str, Any], session: ConversationSession) -> str:
        """Generate AI response focused on ROCKET Framework"""
        
        prompt = f"""You are a ROCKET Framework (Results-Optimized Career Knowledge Enhancement Toolkit) coach. 

User response: "{user_input}"

ROCKET Analysis: {json.dumps(rocket_analysis, indent=2)}

Provide a response that:
1. Acknowledges their input with ROCKET Framework perspective
2. Identifies specific achievements or results mentioned
3. Asks a follow-up question to extract more quantifiable details
4. Uses CAR (Context-Action-Results) or REST (Results-Efficiency-Scope-Time) methodology

Keep your response encouraging but focused on extracting concrete, quantifiable achievements."""
        
        try:
            ai_result = await self.agent_manager.run(prompt)
            return ai_result.get("content", "")
        except Exception as e:
            return "Thank you for sharing that. I'd like to focus on the specific results and achievements you've delivered. Can you tell me about a particular accomplishment where you made a measurable impact?"
    
    async def _select_optimal_persona(self, user_input: str, analysis: Dict[str, Any], preference: Optional[str]) -> str:
        """Select the optimal persona for the current interaction"""
        
        if preference and preference in PersonaType.__members__.values():
            return preference
        
        # Use persona alignment scores
        persona_scores = analysis.get("persona_alignment", {})
        
        if persona_scores:
            return max(persona_scores, key=persona_scores.get)
        else:
            # Default based on intent
            intent_persona_map = {
                "career_guidance": "career_psychologist",
                "interview_prep": "interview_coach",
                "salary_negotiation": "salary_negotiator",
                "networking": "network_builder",
                "life_balance": "life_coach"
            }
            return intent_persona_map.get(analysis.get("intent"), "career_psychologist")
    
    async def _get_or_create_persona_session(self, conversation_session_id: str, persona_type: str) -> Dict[str, Any]:
        """Get or create persona session for multi-persona mode"""
        
        # Check if persona session already exists
        existing_session = self.db.query(PersonaSession).filter(
            PersonaSession.conversation_session_id == conversation_session_id,
            PersonaSession.persona_profile.has(persona_type=persona_type)
        ).first()
        
        if existing_session:
            return {"session_id": existing_session.id, "existing": True}
        
        # Create new persona session
        success, session_id, session_data = self.persona_manager.start_persona_session(
            user_id="unified_user",  # Could be enhanced with actual user IDs
            persona_type=persona_type,
            session_objectives=["Provide specialized coaching", "Generate actionable insights"],
            conversation_session_id=conversation_session_id
        )
        
        if success:
            return {"session_id": session_id, "existing": False, "session_data": session_data}
        else:
            return {"session_id": None, "error": "Could not create persona session"}
    
    async def _get_persona_recommendations(self, user_input: str, analysis: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Get persona recommendations for integrated coaching"""
        
        persona_scores = analysis.get("persona_alignment", {})
        
        # Get top 3 persona recommendations
        sorted_personas = sorted(persona_scores.items(), key=lambda x: x[1], reverse=True)[:3]
        
        recommendations = []
        for persona_type, score in sorted_personas:
            if score > 0.1:  # Only recommend if some alignment
                persona_def = PersonaDefinitions.get_all_personas().get(persona_type, {})
                recommendations.append({
                    "persona_type": persona_type,
                    "name": persona_def.get("name", "Unknown"),
                    "title": persona_def.get("title", "Coach"),
                    "alignment_score": score,
                    "why_recommended": self._explain_persona_recommendation(persona_type, user_input)
                })
        
        return recommendations
    
    def _explain_persona_recommendation(self, persona_type: str, user_input: str) -> str:
        """Explain why a persona is recommended"""
        
        explanations = {
            "executive_coach": "Your response indicates leadership and strategic thinking patterns",
            "life_coach": "You're expressing concerns about work-life balance and personal fulfillment",
            "career_psychologist": "Understanding your personality and behavior patterns would be valuable",
            "industry_expert": "You could benefit from sector-specific insights and market intelligence",
            "interview_coach": "Your situation suggests interview preparation would be beneficial",
            "salary_negotiator": "Compensation optimization appears to be a priority for you",
            "network_builder": "Building strategic relationships seems important for your goals"
        }
        
        return explanations.get(persona_type, "This coach aligns with your current needs")
    
    async def _synthesize_unified_response(
        self, 
        user_input: str, 
        rocket_analysis: Dict[str, Any], 
        psychology_analysis: Dict[str, Any], 
        persona_recs: List[Dict[str, Any]], 
        session: ConversationSession
    ) -> Dict[str, Any]:
        """Synthesize all analyses into a unified response"""
        
        synthesis_prompt = f"""You are an expert career coach synthesizing multiple AI analysis approaches for a comprehensive response.

User Input: "{user_input}"

ROCKET Framework Analysis: {json.dumps(rocket_analysis, default=str)}
Psychology Analysis: {json.dumps(psychology_analysis, default=str)[:500]}...
Recommended Personas: {json.dumps(persona_recs, default=str)}

Create a unified response that:
1. Addresses the user's input with empathy and understanding
2. Integrates insights from ROCKET Framework and psychological analysis
3. Provides actionable next steps
4. Maintains an encouraging, professional tone

Format as JSON with:
- primary_response: Main response to user
- alternative_perspectives: 2-3 different coaching perspectives
- confidence_score: Overall confidence (0-1)
- recommended_next_steps: Array of specific actions"""
        
        try:
            ai_result = await self.agent_manager.run(synthesis_prompt)
            synthesis = ai_result.get("content", {})
            
            # Ensure proper format
            if isinstance(synthesis, dict):
                return synthesis
            else:
                # Fallback if AI doesn't return proper JSON
                return {
                    "primary_response": psychology_analysis.get("ai_response", "Thank you for sharing that insight."),
                    "alternative_perspectives": [
                        "From a ROCKET Framework perspective: Focus on quantifiable achievements",
                        "From a psychological perspective: Understanding your motivations is key"
                    ],
                    "confidence_score": 0.7,
                    "recommended_next_steps": ["Continue the conversation", "Provide more specific examples"]
                }
            
        except Exception as e:
            # Robust fallback
            return {
                "primary_response": psychology_analysis.get("ai_response", "Thank you for that insight. Let's explore this further."),
                "alternative_perspectives": ["ROCKET Framework analysis available", "Multiple coaching perspectives integrated"],
                "confidence_score": 0.6,
                "recommended_next_steps": ["Provide more details about your experience", "Consider specific coaching focus areas"]
            }
    
    async def _get_conversation_history(self, session: ConversationSession) -> List[str]:
        """Get conversation history as list of user responses"""
        
        messages = self.db.query(ConversationMessage).filter(
            ConversationMessage.session_id == session.id,
            ConversationMessage.sender == "user"
        ).order_by(ConversationMessage.created_at).all()
        
        return [msg.message for msg in messages]
    
    async def _store_conversation_message(self, session: ConversationSession, user_input: str, response: Dict[str, Any]):
        """Store conversation message in database"""
        
        # Store user message
        user_message = ConversationMessage(
            id=str(uuid.uuid4()),
            session_id=session.id,
            sender="user",
            message=user_input,
            message_metadata={"timestamp": datetime.utcnow().isoformat()}
        )
        self.db.add(user_message)
        
        # Store AI response
        ai_message = ConversationMessage(
            id=str(uuid.uuid4()),
            session_id=session.id,
            sender="ai",
            message=response.get("ai_response", ""),
            message_metadata={
                "mode": response.get("mode", "unknown"),
                "confidence_score": response.get("confidence_score", 0.7),
                "timestamp": datetime.utcnow().isoformat()
            }
        )
        self.db.add(ai_message)
        
        self.db.commit()
    
    async def _update_session_state(self, session: ConversationSession, response: Dict[str, Any]):
        """Update session state based on response"""
        
        # Update conversation state
        current_state = session.conversation_state or {}
        current_state.update({
            "last_mode": response.get("mode", "unknown"),
            "last_confidence": response.get("confidence_score", 0.7),
            "message_count": len(session.messages) + 2 if session.messages else 2,
            "updated_at": datetime.utcnow().isoformat()
        })
        
        session.conversation_state = current_state
        session.updated_at = datetime.utcnow()
        
        self.db.commit()
    
    async def _get_session_state(self, session: ConversationSession) -> Dict[str, Any]:
        """Get current session state"""
        
        return {
            "session_id": session.id,
            "current_phase": session.current_phase.value if session.current_phase else "introduction",
            "conversation_state": session.conversation_state or {},
            "message_count": len(session.messages) if session.messages else 0,
            "created_at": session.created_at.isoformat() if session.created_at else None,
            "updated_at": session.updated_at.isoformat() if session.updated_at else None
        }
    
    async def _generate_fallback_response(self, user_input: str) -> str:
        """Generate fallback response if processing fails"""
        
        return f"Thank you for sharing that. I'm processing your response and would like to understand more about your career goals. Could you tell me more about what you're hoping to achieve?"
    
    # Helper methods for progress calculation and insights
    def _calculate_rocket_progress(self, rocket_analysis: Dict[str, Any], session: ConversationSession) -> Dict[str, Any]:
        """Calculate ROCKET Framework progress"""
        
        progress = {
            "personal_story_completeness": 0.0,
            "achievement_details": 0.0,
            "quantification_level": 0.0,
            "overall_progress": 0.0
        }
        
        # Calculate based on ROCKET analysis
        if rocket_analysis.get("personal_story"):
            story = rocket_analysis["personal_story"]
            if story.get("coherence_score", 0) > 0.5:
                progress["personal_story_completeness"] = story.get("coherence_score", 0)
        
        if rocket_analysis.get("car_analysis"):
            progress["achievement_details"] = 0.7  # Has structured achievement data
        
        # Overall progress
        progress["overall_progress"] = sum(progress.values()) / len(progress)
        
        return progress
    
    def _calculate_integrated_progress(self, rocket_analysis: Dict[str, Any], psychology_analysis: Dict[str, Any], session: ConversationSession) -> Dict[str, Any]:
        """Calculate comprehensive progress across all analyses"""
        
        rocket_progress = self._calculate_rocket_progress(rocket_analysis, session)
        
        psychology_progress = {
            "personality_understanding": len(psychology_analysis.get("psychological_insights", [])) * 0.2,
            "behavioral_patterns": psychology_analysis.get("confidence_score", 0.5),
            "career_alignment": 0.6  # Baseline for having psychological analysis
        }
        
        overall_progress = {
            "rocket_framework": rocket_progress["overall_progress"],
            "psychological_analysis": sum(psychology_progress.values()) / len(psychology_progress),
            "integrated_coaching": (rocket_progress["overall_progress"] + sum(psychology_progress.values()) / len(psychology_progress)) / 2
        }
        
        return {
            "rocket_progress": rocket_progress,
            "psychology_progress": psychology_progress, 
            "overall_progress": overall_progress,
            "completion_percentage": overall_progress["integrated_coaching"] * 100
        }
    
    async def _generate_rocket_insights(self, user_input: str, conversation_history: List[str]) -> List[Dict[str, Any]]:
        """Generate ROCKET-specific insights"""
        
        insights = []
        
        # Achievement detection
        achievement_words = ["achieved", "delivered", "improved", "increased", "reduced", "created", "led"]
        if any(word in user_input.lower() for word in achievement_words):
            insights.append({
                "type": "achievement_detected",
                "title": "Achievement Mentioned",
                "description": "You mentioned specific achievements - let's quantify the impact",
                "confidence": 0.8
            })
        
        # Quantification opportunities
        if any(char.isdigit() for char in user_input):
            insights.append({
                "type": "quantification_present", 
                "title": "Numbers Provided",
                "description": "You included quantifiable data - excellent for resume impact",
                "confidence": 0.9
            })
        
        return insights
    
    async def _get_basic_rocket_insights(self, user_input: str, conversation_history: List[str]) -> List[Dict[str, Any]]:
        """Get basic ROCKET insights for other modes"""
        
        return await self._generate_rocket_insights(user_input, conversation_history)
    
    def _get_rocket_next_steps(self, rocket_analysis: Dict[str, Any]) -> List[str]:
        """Get next steps based on ROCKET analysis"""
        
        next_steps = []
        
        if not rocket_analysis.get("personal_story") or rocket_analysis["personal_story"].get("coherence_score", 0) < 0.7:
            next_steps.append("Develop a clearer personal story statement")
        
        if not rocket_analysis.get("car_analysis"):
            next_steps.append("Provide specific examples using Context-Action-Results format")
        
        if rocket_analysis.get("readiness_score", 0) < 0.7:
            next_steps.append("Include more quantifiable achievements and results")
        
        if not next_steps:
            next_steps.append("Continue building your achievement portfolio")
        
        return next_steps