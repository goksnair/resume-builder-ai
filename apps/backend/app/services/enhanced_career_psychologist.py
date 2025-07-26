"""
ROCKET Framework - Enhanced Career Psychologist Service
Dr. Maya Insight persona with advanced psychological analysis and AI integration
"""

import asyncio
import json
import re
import uuid
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
from sqlalchemy.orm import Session

from ..agent.manager import AgentManager
from ..models.conversation import ConversationSession, ConversationMessage, UserCareerProfile
from ..models.personas import PersonaProfile, PersonaSession, PersonaInsight
from .persona_definitions import PersonaDefinitions


class PersonalityAnalyzer:
    """Advanced personality analysis from conversation responses"""
    
    @staticmethod
    def analyze_personality_traits(responses: List[str]) -> Dict[str, Any]:
        """Analyze personality traits from user responses"""
        combined_text = " ".join(responses).lower()
        
        # Big Five personality indicators
        personality_scores = {
            "openness": 0.0,
            "conscientiousness": 0.0,
            "extraversion": 0.0,
            "agreeableness": 0.0,
            "neuroticism": 0.0
        }
        
        # Openness indicators
        openness_patterns = [
            r"creative|innovative|new ideas|explore|experiment|curious|learning",
            r"artistic|imaginative|abstract|theoretical|intellectual",
            r"enjoy|love|passionate about.*(?:research|discovery|innovation)"
        ]
        
        for pattern in openness_patterns:
            if re.search(pattern, combined_text):
                personality_scores["openness"] += 0.2
        
        # Conscientiousness indicators
        conscientiousness_patterns = [
            r"organized|planned|structured|systematic|methodical",
            r"deadlines|schedule|goals|target|achievement|completion",
            r"detail|quality|accuracy|precision|thorough"
        ]
        
        for pattern in conscientiousness_patterns:
            if re.search(pattern, combined_text):
                personality_scores["conscientiousness"] += 0.2
        
        # Extraversion indicators
        extraversion_patterns = [
            r"team|collaboration|people|social|network|meeting",
            r"presentation|speaking|leading|managing|mentoring",
            r"energy|enthusiastic|outgoing|engaging"
        ]
        
        for pattern in extraversion_patterns:
            if re.search(pattern, combined_text):
                personality_scores["extraversion"] += 0.2
        
        # Agreeableness indicators
        agreeableness_patterns = [
            r"help|support|assist|cooperation|harmony|consensus",
            r"empathy|understanding|caring|compassionate",
            r"conflict resolution|mediation|compromise"
        ]
        
        for pattern in agreeableness_patterns:
            if re.search(pattern, combined_text):
                personality_scores["agreeableness"] += 0.2
        
        # Neuroticism indicators (lower scores are better)
        stress_patterns = [
            r"stress|anxiety|pressure|overwhelm|difficult|challenging",
            r"worry|concern|fear|uncertainty|doubt"
        ]
        
        stress_count = 0
        for pattern in stress_patterns:
            if re.search(pattern, combined_text):
                stress_count += 1
        
        # Reverse score for neuroticism (less stress = lower neuroticism)
        personality_scores["neuroticism"] = max(0.0, 1.0 - (stress_count * 0.2))
        
        # Normalize scores
        for trait in personality_scores:
            personality_scores[trait] = min(1.0, personality_scores[trait])
        
        return personality_scores
    
    @staticmethod
    def analyze_work_preferences(responses: List[str]) -> Dict[str, Any]:
        """Analyze work style and environmental preferences"""
        combined_text = " ".join(responses).lower()
        
        preferences = {
            "work_environment": "hybrid",  # remote, office, hybrid
            "team_vs_individual": 0.5,     # 0=individual, 1=team
            "structure_vs_flexibility": 0.5, # 0=flexible, 1=structured
            "innovation_vs_stability": 0.5,  # 0=stability, 1=innovation
            "detail_vs_big_picture": 0.5     # 0=details, 1=big picture
        }
        
        # Work environment preferences
        if re.search(r"remote|home|virtual|distributed", combined_text):
            preferences["work_environment"] = "remote"
        elif re.search(r"office|in-person|face-to-face|on-site", combined_text):
            preferences["work_environment"] = "office"
        
        # Team vs individual work
        team_indicators = len(re.findall(r"team|collaboration|group|together", combined_text))
        individual_indicators = len(re.findall(r"independent|alone|solo|individual", combined_text))
        
        if team_indicators + individual_indicators > 0:
            preferences["team_vs_individual"] = team_indicators / (team_indicators + individual_indicators)
        
        # Structure vs flexibility
        structure_indicators = len(re.findall(r"structure|process|plan|schedule|organized", combined_text))
        flexibility_indicators = len(re.findall(r"flexible|adaptable|agile|dynamic|fluid", combined_text))
        
        if structure_indicators + flexibility_indicators > 0:
            preferences["structure_vs_flexibility"] = structure_indicators / (structure_indicators + flexibility_indicators)
        
        return preferences
    
    @staticmethod
    def analyze_motivation_drivers(responses: List[str]) -> Dict[str, Any]:
        """Analyze core motivation and drive patterns"""
        combined_text = " ".join(responses).lower()
        
        motivations = {
            "achievement": 0.0,
            "autonomy": 0.0,
            "mastery": 0.0,
            "purpose": 0.0,
            "recognition": 0.0,
            "security": 0.0,
            "variety": 0.0
        }
        
        # Achievement motivation
        achievement_patterns = [
            r"goals|targets|accomplish|achieve|success|results",
            r"challenge|competition|winning|excellence|performance"
        ]
        
        for pattern in achievement_patterns:
            if re.search(pattern, combined_text):
                motivations["achievement"] += 0.3
        
        # Autonomy motivation
        autonomy_patterns = [
            r"independent|freedom|control|own decisions|self-directed",
            r"flexibility|choice|autonomy"
        ]
        
        for pattern in autonomy_patterns:
            if re.search(pattern, combined_text):
                motivations["autonomy"] += 0.3
        
        # Mastery motivation
        mastery_patterns = [
            r"learning|growth|development|skill|expertise|mastery",
            r"improve|better|enhance|advance|progress"
        ]
        
        for pattern in mastery_patterns:
            if re.search(pattern, combined_text):
                motivations["mastery"] += 0.3
        
        # Purpose motivation
        purpose_patterns = [
            r"impact|difference|meaning|purpose|mission|value",
            r"help|contribute|benefit|improve.*(?:lives|world|society)"
        ]
        
        for pattern in purpose_patterns:
            if re.search(pattern, combined_text):
                motivations["purpose"] += 0.3
        
        # Normalize scores
        for motivation in motivations:
            motivations[motivation] = min(1.0, motivations[motivation])
        
        return motivations


class DrMayaInsightService:
    """Enhanced Career Psychologist - Dr. Maya Insight"""
    
    def __init__(self, db: Session):
        self.db = db
        self.agent_manager = AgentManager(strategy="json", model="gemma3:4b")
        self.persona_definition = PersonaDefinitions.career_psychologist()
        self.personality_analyzer = PersonalityAnalyzer()
    
    async def analyze_personality_from_responses(self, responses: List[str]) -> Dict[str, Any]:
        """Comprehensive personality analysis from conversation responses"""
        
        # Basic personality trait analysis
        personality_traits = self.personality_analyzer.analyze_personality_traits(responses)
        
        # Work preferences analysis
        work_preferences = self.personality_analyzer.analyze_work_preferences(responses)
        
        # Motivation drivers analysis
        motivation_drivers = self.personality_analyzer.analyze_motivation_drivers(responses)
        
        # AI-enhanced personality analysis
        ai_insights = await self._get_ai_personality_insights(responses)
        
        personality_profile = {
            "personality_traits": personality_traits,
            "work_preferences": work_preferences,
            "motivation_drivers": motivation_drivers,
            "ai_insights": ai_insights,
            "analysis_timestamp": datetime.utcnow().isoformat(),
            "confidence_score": self._calculate_confidence_score(responses),
            "primary_personality_type": self._determine_primary_type(personality_traits),
            "career_alignment_score": self._calculate_career_alignment(personality_traits, work_preferences)
        }
        
        return personality_profile
    
    async def generate_psychological_insights(self, personality_profile: Dict[str, Any], conversation_context: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate actionable psychological insights for career development"""
        
        insights = []
        
        # Personality-based insights
        personality_insights = self._generate_personality_insights(personality_profile["personality_traits"])
        insights.extend(personality_insights)
        
        # Work preference insights
        preference_insights = self._generate_preference_insights(personality_profile["work_preferences"])
        insights.extend(preference_insights)
        
        # Motivation insights
        motivation_insights = self._generate_motivation_insights(personality_profile["motivation_drivers"])
        insights.extend(motivation_insights)
        
        # AI-enhanced insights
        ai_enhanced_insights = await self._generate_ai_enhanced_insights(personality_profile, conversation_context)
        insights.extend(ai_enhanced_insights)
        
        # Sort by confidence and relevance
        insights.sort(key=lambda x: x["confidence_score"], reverse=True)
        
        return insights[:10]  # Return top 10 insights
    
    async def generate_psychologist_response(self, user_input: str, session_context: Dict[str, Any], conversation_history: List[str]) -> Dict[str, Any]:
        """Generate Dr. Maya Insight persona response with psychological analysis"""
        
        # Analyze current response for psychological indicators
        current_analysis = await self._analyze_current_response(user_input)
        
        # Generate contextual psychological insights
        insights = await self._generate_contextual_insights(user_input, conversation_history)
        
        # Create AI prompt for Dr. Maya Insight response
        ai_response = await self._generate_ai_response(user_input, session_context, insights)
        
        # Determine follow-up questions based on psychological assessment
        follow_ups = self._generate_psychological_follow_ups(current_analysis, conversation_history)
        
        response_data = {
            "ai_response": ai_response,
            "psychological_insights": insights,
            "follow_up_questions": follow_ups,
            "analysis_data": current_analysis,
            "confidence_score": current_analysis.get("confidence_score", 0.7),
            "response_type": "psychological_analysis",
            "persona_voice": "dr_maya_insight"
        }
        
        return response_data
    
    async def _get_ai_personality_insights(self, responses: List[str]) -> Dict[str, Any]:
        """Use AI to enhance personality analysis"""
        
        prompt = f"""As Dr. Maya Insight, a Career & Organizational Psychologist, analyze these user responses for deeper personality insights:

Responses: {' '.join(responses[:3])}

Provide psychological analysis focusing on:
1. Underlying personality patterns
2. Cognitive preferences and decision-making style
3. Potential blind spots or growth areas
4. Work style compatibility factors

Return insights in JSON format with confidence scores."""
        
        try:
            ai_result = await self.agent_manager.run(prompt)
            return ai_result.get("content", {})
        except Exception as e:
            return {"error": str(e), "fallback_analysis": "Basic pattern recognition applied"}
    
    def _generate_personality_insights(self, personality_traits: Dict[str, float]) -> List[Dict[str, Any]]:
        """Generate insights based on Big Five personality traits"""
        
        insights = []
        
        # High openness insights
        if personality_traits["openness"] > 0.7:
            insights.append({
                "category": "personality_strength",
                "title": "High Creative & Intellectual Curiosity",
                "description": "You demonstrate strong openness to new experiences and ideas, making you well-suited for innovative roles.",
                "confidence_score": 0.8,
                "actionable_recommendations": [
                    "Seek roles that involve innovation and creative problem-solving",
                    "Consider positions in emerging fields or cutting-edge industries",
                    "Look for companies that value experimentation and new approaches"
                ]
            })
        
        # High conscientiousness insights
        if personality_traits["conscientiousness"] > 0.7:
            insights.append({
                "category": "work_style_strength",
                "title": "Strong Organization & Goal Orientation", 
                "description": "Your high conscientiousness indicates excellent planning and execution abilities.",
                "confidence_score": 0.8,
                "actionable_recommendations": [
                    "Leverage your organizational skills in project management roles",
                    "Consider leadership positions that require planning and execution",
                    "Highlight your reliability and goal achievement in applications"
                ]
            })
        
        # Extraversion insights
        if personality_traits["extraversion"] > 0.6:
            insights.append({
                "category": "communication_strength",
                "title": "Natural People & Communication Skills",
                "description": "Your extraversion suggests strong interpersonal and leadership capabilities.",
                "confidence_score": 0.7,
                "actionable_recommendations": [
                    "Pursue roles involving team leadership or client interaction",
                    "Consider positions in sales, consulting, or people management",
                    "Seek environments with collaborative team structures"
                ]
            })
        
        return insights
    
    def _generate_preference_insights(self, work_preferences: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate insights based on work style preferences"""
        
        insights = []
        
        # Team vs individual preference
        if work_preferences["team_vs_individual"] > 0.7:
            insights.append({
                "category": "work_environment_fit",
                "title": "Strong Team Collaboration Preference",
                "description": "You thrive in collaborative environments and team-based work structures.",
                "confidence_score": 0.75,
                "actionable_recommendations": [
                    "Prioritize companies with strong team cultures",
                    "Look for cross-functional project opportunities",
                    "Consider roles that involve mentoring or team leadership"
                ]
            })
        elif work_preferences["team_vs_individual"] < 0.3:
            insights.append({
                "category": "work_environment_fit", 
                "title": "Independent Work Style Preference",
                "description": "You perform best with autonomy and individual responsibility.",
                "confidence_score": 0.75,
                "actionable_recommendations": [
                    "Seek roles with high autonomy and independent decision-making",
                    "Consider remote work opportunities or flexible arrangements",
                    "Look for specialist roles rather than highly collaborative positions"
                ]
            })
        
        return insights
    
    def _generate_motivation_insights(self, motivation_drivers: Dict[str, float]) -> List[Dict[str, Any]]:
        """Generate insights based on core motivations"""
        
        insights = []
        
        # Find top motivation drivers
        sorted_motivations = sorted(motivation_drivers.items(), key=lambda x: x[1], reverse=True)
        top_motivation = sorted_motivations[0]
        
        if top_motivation[1] > 0.6:
            motivation_map = {
                "achievement": {
                    "title": "Achievement-Driven Career Focus",
                    "description": "You're motivated by accomplishing goals and measuring success through results.",
                    "recommendations": [
                        "Seek roles with clear performance metrics and advancement paths",
                        "Look for companies that recognize and reward high achievement",
                        "Consider positions with stretch goals and challenging objectives"
                    ]
                },
                "mastery": {
                    "title": "Learning & Growth Motivation",
                    "description": "You're driven by continuous learning and skill development.",
                    "recommendations": [
                        "Prioritize companies with strong learning and development programs",
                        "Seek roles that offer skill-building and career advancement",
                        "Consider positions in fast-evolving industries or technologies"
                    ]
                },
                "purpose": {
                    "title": "Mission-Driven Career Orientation",
                    "description": "You're motivated by meaningful work that creates positive impact.",
                    "recommendations": [
                        "Focus on companies with strong mission alignment",
                        "Consider roles in social impact, sustainability, or mission-driven organizations",
                        "Look for positions where you can see the direct impact of your work"
                    ]
                }
            }
            
            motivation_info = motivation_map.get(top_motivation[0])
            if motivation_info:
                insights.append({
                    "category": "core_motivation",
                    "title": motivation_info["title"],
                    "description": motivation_info["description"],
                    "confidence_score": top_motivation[1],
                    "actionable_recommendations": motivation_info["recommendations"]
                })
        
        return insights
    
    async def _generate_ai_enhanced_insights(self, personality_profile: Dict[str, Any], conversation_context: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate AI-enhanced psychological insights"""
        
        prompt = f"""As Dr. Maya Insight, provide 3 specific psychological insights for career development based on:

Personality Profile: {json.dumps(personality_profile, indent=2)}
Conversation Context: {json.dumps(conversation_context, indent=2)}

Focus on actionable insights that help with:
1. Career positioning and role selection
2. Interview preparation and self-presentation
3. Long-term career development strategy

Return as JSON array with title, description, confidence_score, and actionable_recommendations for each insight."""
        
        try:
            ai_result = await self.agent_manager.run(prompt)
            insights = ai_result.get("content", [])
            
            # Ensure proper format
            formatted_insights = []
            for insight in insights:
                if isinstance(insight, dict):
                    formatted_insights.append({
                        "category": "ai_enhanced_insight",
                        "title": insight.get("title", "AI-Generated Insight"),
                        "description": insight.get("description", ""),
                        "confidence_score": insight.get("confidence_score", 0.7),
                        "actionable_recommendations": insight.get("actionable_recommendations", [])
                    })
            
            return formatted_insights
            
        except Exception as e:
            return [{
                "category": "ai_enhanced_insight",
                "title": "AI Analysis Temporarily Unavailable", 
                "description": "Using baseline psychological analysis patterns.",
                "confidence_score": 0.6,
                "actionable_recommendations": ["Continue conversation for more detailed analysis"]
            }]
    
    async def _analyze_current_response(self, user_input: str) -> Dict[str, Any]:
        """Analyze current user response for psychological indicators"""
        
        analysis = {
            "response_length": len(user_input.split()),
            "emotional_tone": self._detect_emotional_tone(user_input),
            "confidence_indicators": self._detect_confidence_level(user_input),
            "stress_indicators": self._detect_stress_patterns(user_input),
            "clarity_score": self._assess_response_clarity(user_input),
            "confidence_score": 0.7
        }
        
        # Adjust confidence based on response quality
        if analysis["response_length"] > 20:
            analysis["confidence_score"] += 0.1
        if analysis["clarity_score"] > 0.7:
            analysis["confidence_score"] += 0.1
            
        analysis["confidence_score"] = min(1.0, analysis["confidence_score"])
        
        return analysis
    
    def _detect_emotional_tone(self, text: str) -> str:
        """Detect emotional tone of response"""
        text_lower = text.lower()
        
        positive_indicators = ["excited", "happy", "love", "enjoy", "passionate", "enthusiastic", "great", "amazing"]
        negative_indicators = ["stressed", "worried", "difficult", "challenging", "frustrated", "concerned", "overwhelmed"]
        neutral_indicators = ["think", "believe", "consider", "probably", "maybe", "perhaps"]
        
        positive_count = sum(1 for word in positive_indicators if word in text_lower)
        negative_count = sum(1 for word in negative_indicators if word in text_lower)
        
        if positive_count > negative_count:
            return "positive"
        elif negative_count > positive_count:
            return "negative"
        else:
            return "neutral"
    
    def _detect_confidence_level(self, text: str) -> float:
        """Detect confidence level from language patterns"""
        confidence_score = 0.5  # baseline
        
        confidence_indicators = ["definitely", "absolutely", "certainly", "confident", "sure", "strong", "excel"]
        uncertainty_indicators = ["maybe", "perhaps", "might", "possibly", "unsure", "confused", "difficult"]
        
        for indicator in confidence_indicators:
            if indicator in text.lower():
                confidence_score += 0.1
        
        for indicator in uncertainty_indicators:
            if indicator in text.lower():
                confidence_score -= 0.1
        
        return max(0.0, min(1.0, confidence_score))
    
    def _detect_stress_patterns(self, text: str) -> List[str]:
        """Detect stress or anxiety patterns in language"""
        stress_patterns = []
        
        stress_indicators = {
            "time_pressure": ["deadline", "rushed", "time", "pressure", "urgent"],
            "overwhelm": ["overwhelmed", "too much", "can't handle", "stressed"],
            "uncertainty": ["don't know", "unsure", "confused", "unclear"],
            "perfectionism": ["perfect", "exactly right", "must be", "should be"]
        }
        
        text_lower = text.lower()
        for pattern_type, indicators in stress_indicators.items():
            if any(indicator in text_lower for indicator in indicators):
                stress_patterns.append(pattern_type)
        
        return stress_patterns
    
    def _assess_response_clarity(self, text: str) -> float:
        """Assess clarity and coherence of response"""
        # Simple clarity scoring based on structure and content
        sentences = text.split('.')
        avg_sentence_length = sum(len(s.split()) for s in sentences) / len(sentences) if sentences else 0
        
        clarity_score = 0.5
        
        # Appropriate sentence length (8-20 words)
        if 8 <= avg_sentence_length <= 20:
            clarity_score += 0.2
        
        # Contains specific examples or details
        if any(word in text.lower() for word in ["example", "specifically", "for instance", "such as"]):
            clarity_score += 0.2
        
        # Good structure indicators
        if any(connector in text.lower() for connector in ["because", "therefore", "however", "additionally"]):
            clarity_score += 0.1
        
        return min(1.0, clarity_score)
    
    async def _generate_contextual_insights(self, user_input: str, conversation_history: List[str]) -> List[Dict[str, Any]]:
        """Generate insights specific to current conversation context"""
        
        # Analyze patterns across conversation
        all_responses = conversation_history + [user_input]
        
        insights = []
        
        # Communication pattern insight
        avg_response_length = sum(len(r.split()) for r in all_responses) / len(all_responses)
        if avg_response_length > 30:
            insights.append({
                "category": "communication_style",
                "title": "Detailed Communication Style",
                "description": "You provide comprehensive responses, indicating thorough thinking and good articulation skills.",
                "confidence_score": 0.8,
                "career_implications": ["Consider roles requiring detailed communication", "Leverage your articulation skills in interviews"]
            })
        
        # Consistency insight
        emotional_tones = [self._detect_emotional_tone(response) for response in all_responses]
        if emotional_tones.count("positive") > len(emotional_tones) * 0.6:
            insights.append({
                "category": "emotional_resilience",
                "title": "Positive Professional Outlook",
                "description": "You maintain a consistently positive tone, indicating emotional resilience and optimism.",
                "confidence_score": 0.75,
                "career_implications": ["Well-suited for client-facing roles", "Natural fit for team leadership positions"]
            })
        
        return insights
    
    async def _generate_ai_response(self, user_input: str, session_context: Dict[str, Any], insights: List[Dict[str, Any]]) -> str:
        """Generate AI response in Dr. Maya Insight's voice"""
        
        persona_prompt = f"""You are Dr. Maya Insight, a Career & Organizational Psychologist. Your communication style is curious, analytical, and evidence-based. You use psychological frameworks to understand behavior patterns.

User's latest response: "{user_input}"

Recent psychological insights discovered:
{json.dumps([insight['title'] + ': ' + insight['description'] for insight in insights[:3]], indent=2)}

Respond as Dr. Maya Insight would:
1. Acknowledge the user's response with psychological insight
2. Provide one specific psychological observation
3. Ask a thoughtful follow-up question that digs deeper into their behavioral patterns or motivations
4. Keep the tone professional yet warm and supportive

Focus on helping them understand their work style, motivations, and career psychology."""
        
        try:
            ai_result = await self.agent_manager.run(persona_prompt)
            response = ai_result.get("content", "")
            
            # Ensure response is in Dr. Maya's voice
            if not response.startswith("That's"):
                response = f"That's an insightful response. {response}"
            
            return response
            
        except Exception as e:
            return f"Thank you for sharing that insight. As your career psychologist, I'm particularly interested in understanding the psychological patterns behind your career choices. What motivates you most in your work - is it the challenge of solving complex problems, the satisfaction of helping others, or perhaps the recognition that comes with achievement?"
    
    def _generate_psychological_follow_ups(self, analysis: Dict[str, Any], conversation_history: List[str]) -> List[str]:
        """Generate psychologically-informed follow-up questions"""
        
        follow_ups = []
        
        # Based on emotional tone
        if analysis["emotional_tone"] == "positive":
            follow_ups.append("What specific aspects of your work create that positive energy for you?")
        elif analysis["emotional_tone"] == "negative":
            follow_ups.append("I notice some stress indicators in your response. What workplace factors tend to energize versus drain you?")
        
        # Based on confidence level
        if analysis["confidence_indicators"] < 0.5:
            follow_ups.append("What past experiences have built your confidence, and how might we leverage those patterns?")
        
        # Based on stress patterns
        if analysis["stress_indicators"]:
            follow_ups.append("How do you typically handle pressure or challenging situations in your work?")
        
        # Generic psychological follow-ups
        psychological_questions = [
            "What patterns do you notice in the types of work that energize versus drain you?",
            "How do you prefer to process information and make decisions in your work?",
            "What feedback patterns do you notice from colleagues and supervisors?",
            "What work environments bring out your strengths versus weaknesses?"
        ]
        
        # Add 1-2 random psychological questions if no specific ones generated
        if len(follow_ups) < 2:
            follow_ups.extend(psychological_questions[:2])
        
        return follow_ups[:3]  # Return max 3 follow-ups
    
    def _calculate_confidence_score(self, responses: List[str]) -> float:
        """Calculate overall confidence in psychological analysis"""
        base_confidence = 0.6
        
        # More responses = higher confidence
        response_bonus = min(0.3, len(responses) * 0.05)
        
        # Longer responses = higher confidence
        avg_length = sum(len(r.split()) for r in responses) / len(responses) if responses else 0
        length_bonus = min(0.2, avg_length / 100)
        
        return min(1.0, base_confidence + response_bonus + length_bonus)
    
    def _determine_primary_type(self, personality_traits: Dict[str, float]) -> str:
        """Determine primary personality type based on Big Five scores"""
        # Simple type determination based on highest scores
        sorted_traits = sorted(personality_traits.items(), key=lambda x: x[1], reverse=True)
        
        top_trait = sorted_traits[0][0]
        
        type_mapping = {
            "openness": "Innovator",
            "conscientiousness": "Organizer", 
            "extraversion": "Collaborator",
            "agreeableness": "Harmonizer",
            "neuroticism": "Steady" if personality_traits["neuroticism"] < 0.5 else "Sensitive"
        }
        
        return type_mapping.get(top_trait, "Balanced")
    
    def _calculate_career_alignment(self, personality_traits: Dict[str, float], work_preferences: Dict[str, Any]) -> float:
        """Calculate how well personality aligns with stated career preferences"""
        alignment_score = 0.7  # baseline
        
        # High conscientiousness + structured work preference = good alignment
        if personality_traits["conscientiousness"] > 0.6 and work_preferences["structure_vs_flexibility"] > 0.6:
            alignment_score += 0.1
        
        # High extraversion + team preference = good alignment  
        if personality_traits["extraversion"] > 0.6 and work_preferences["team_vs_individual"] > 0.6:
            alignment_score += 0.1
        
        # High openness + innovation preference = good alignment
        if personality_traits["openness"] > 0.6 and work_preferences["innovation_vs_stability"] > 0.6:
            alignment_score += 0.1
        
        return min(1.0, alignment_score)