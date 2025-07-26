"""
Career Psychologist Service - Dr. Maya Insight Persona

Implementation of sophisticated psychological analysis and career guidance service featuring:
- Dr. Maya Insight: Career & Organizational Psychologist persona
- Advanced personality trait analysis from conversation responses
- Behavioral pattern recognition for career alignment
- Psychological insight generation for career positioning
- Integration with ROCKET Framework for comprehensive career counseling

This service provides the psychological intelligence layer for the enhanced resume builder.
"""

import re
import json
import asyncio
from datetime import datetime
from typing import Dict, List, Optional, Tuple, Any
from uuid import uuid4

from sqlalchemy.orm import Session

from ..core.database import AsyncSessionLocal
from ..models.rocket_framework import (
    ROCKETSession, PsychologistInsight, ROCKETPhase
)
from ..agent.manager import AgentManager
from .exceptions import ServiceException


class CareerPsychologistService:
    """
    Dr. Maya Insight - Career & Organizational Psychologist Service
    
    Provides sophisticated psychological analysis capabilities including:
    - Personality trait identification from conversation patterns
    - Behavioral analysis for career alignment
    - Motivation and stress pattern recognition
    - Career positioning recommendations based on psychological profile
    """
    
    def __init__(self, ai_manager: Optional[AgentManager] = None):
        self.ai_manager = ai_manager
        
        # Dr. Maya Insight persona characteristics
        self.persona_profile = {
            'name': 'Dr. Maya Insight',
            'title': 'Career & Organizational Psychologist',
            'specialties': [
                'Personality assessment and career alignment',
                'Behavioral pattern analysis',
                'Workplace psychology and team dynamics',
                'Career transition guidance',
                'Professional development coaching'
            ],
            'approach': 'analytical yet empathetic',
            'communication_style': 'professional, insightful, encouraging',
            'frameworks': ['Big Five Personality Model', 'MBTI', 'DISC', 'Career Anchors']
        }
        
        # Personality trait indicators based on language patterns
        self.personality_indicators = {
            'openness': {
                'high': ['creative', 'innovative', 'explore', 'learn', 'curious', 'new ideas', 'artistic', 'imaginative'],
                'low': ['practical', 'traditional', 'conventional', 'routine', 'standard', 'established']
            },
            'conscientiousness': {
                'high': ['organized', 'planned', 'structured', 'detail', 'systematic', 'thorough', 'deadline', 'complete'],
                'low': ['flexible', 'spontaneous', 'adaptable', 'go with flow', 'improvise', 'last minute']
            },
            'extraversion': {
                'high': ['team', 'people', 'collaborate', 'present', 'social', 'networking', 'public speaking', 'groups'],
                'low': ['independent', 'solo', 'analyze', 'research', 'quiet', 'focus', 'concentrate', 'individual']
            },
            'agreeableness': {
                'high': ['help', 'support', 'collaborate', 'harmony', 'consensus', 'understanding', 'empathy', 'service'],
                'low': ['compete', 'challenge', 'direct', 'results', 'performance', 'achievement', 'leadership']
            },
            'neuroticism': {
                'high': ['stress', 'pressure', 'worry', 'anxiety', 'nervous', 'overwhelming', 'challenging'],
                'low': ['calm', 'stable', 'confident', 'resilient', 'composed', 'handle pressure', 'steady']
            }
        }
        
        # Behavioral pattern recognition
        self.behavioral_patterns = {
            'decision_making': {
                'analytical': ['analyze', 'data', 'research', 'evaluate', 'consider', 'study', 'investigate'],
                'intuitive': ['feel', 'sense', 'instinct', 'gut', 'immediate', 'natural', 'spontaneous'],
                'collaborative': ['discuss', 'team', 'consensus', 'input', 'feedback', 'group decision'],
                'decisive': ['decided', 'determined', 'quick', 'immediate', 'action', 'execute']
            },
            'communication': {
                'direct': ['direct', 'straightforward', 'clear', 'concise', 'bottom line', 'brief'],
                'diplomatic': ['carefully', 'consider', 'tactful', 'sensitive', 'appropriate', 'respectful'],
                'expressive': ['enthusiasm', 'passionate', 'energetic', 'exciting', 'dynamic'],
                'reserved': ['thoughtful', 'measured', 'careful', 'considered', 'selective']
            },
            'work_style': {
                'structured': ['process', 'systematic', 'organized', 'planned', 'methodical', 'step by step'],
                'flexible': ['adapt', 'flexible', 'adjust', 'change', 'modify', 'responsive'],
                'detail_oriented': ['detail', 'precise', 'accurate', 'thorough', 'complete', 'careful'],
                'big_picture': ['strategy', 'vision', 'overall', 'broad', 'general', 'overview']
            }
        }
        
        # Career positioning frameworks
        self.career_positioning = {
            'leadership_styles': {
                'visionary': ['vision', 'future', 'strategy', 'innovation', 'transformation'],
                'collaborative': ['team', 'consensus', 'inclusive', 'partnership', 'cooperation'],
                'results_driven': ['results', 'performance', 'achievement', 'metrics', 'goals'],
                'coaching': ['develop', 'mentor', 'guide', 'support', 'growth', 'potential']
            },
            'value_drivers': {
                'autonomy': ['independent', 'freedom', 'control', 'self-directed', 'ownership'],
                'mastery': ['expertise', 'skill', 'proficiency', 'excellence', 'perfection'],
                'purpose': ['meaning', 'impact', 'difference', 'contribution', 'value', 'mission'],
                'security': ['stability', 'predictable', 'secure', 'reliable', 'consistent']
            }
        }


    async def analyze_personality_from_responses(
        self, 
        rocket_session_id: str,
        conversation_responses: List[str]
    ) -> PsychologistInsight:
        """
        Advanced personality trait analysis from conversation patterns
        
        Analyzes user responses to identify personality traits using multiple frameworks
        including Big Five, behavioral patterns, and career-relevant characteristics.
        """
        
        # Combine all responses for analysis
        combined_text = " ".join(conversation_responses)
        
        # Analyze personality traits using Big Five model
        personality_traits = self._analyze_big_five_traits(combined_text)
        
        # Identify behavioral patterns
        behavioral_patterns = self._identify_behavioral_patterns(combined_text)
        
        # Analyze motivation drivers
        motivation_drivers = self._analyze_motivation_drivers(combined_text)
        
        # Identify stress indicators
        stress_indicators = self._identify_stress_indicators(combined_text)
        
        # Generate career alignment analysis
        career_analysis = await self._generate_career_alignment_analysis(
            personality_traits, behavioral_patterns, combined_text
        )
        
        # Create personalized recommendations
        recommendations = await self._generate_psychological_recommendations(
            personality_traits, behavioral_patterns, career_analysis
        )
        
        # Generate Dr. Maya's personalized message
        personalized_message = await self._generate_dr_maya_message(
            personality_traits, career_analysis, recommendations
        )
        
        # Calculate confidence level
        confidence_level = self._calculate_analysis_confidence(
            personality_traits, behavioral_patterns, len(conversation_responses)
        )
        
        # Save analysis to database
        async with AsyncSessionLocal() as session:
            psychologist_insight = PsychologistInsight(
                id=str(uuid4()),
                rocket_session_id=rocket_session_id,
                personality_traits=personality_traits,
                behavioral_patterns=behavioral_patterns,
                motivation_drivers=motivation_drivers,
                stress_indicators=stress_indicators,
                career_strengths=career_analysis.get('strengths', []),
                development_areas=career_analysis.get('development_areas', []),
                ideal_work_environment=career_analysis.get('ideal_environment', {}),
                career_progression_style=career_analysis.get('progression_style'),
                positioning_recommendations=recommendations.get('positioning', []),
                interview_strategies=recommendations.get('interview_strategies', []),
                networking_approaches=recommendations.get('networking', []),
                personal_branding_tips=recommendations.get('branding', []),
                confidence_level=confidence_level,
                personalized_message=personalized_message,
                action_plan=recommendations.get('action_plan', [])
            )
            
            session.add(psychologist_insight)
            await session.commit()
            await session.refresh(psychologist_insight)
            
            return psychologist_insight


    async def generate_psychologist_response(
        self, 
        user_input: str,
        rocket_session_id: str,
        conversation_history: List[str],
        current_phase: ROCKETPhase
    ) -> Dict[str, Any]:
        """
        Generate Dr. Maya Insight persona responses
        
        Creates contextual, psychologically-informed responses that guide users
        through career discovery and resume enhancement with professional insight.
        """
        
        # Analyze current user input for psychological indicators
        input_analysis = self._analyze_single_response(user_input)
        
        # Generate context-aware response based on conversation phase
        if current_phase == ROCKETPhase.INTRODUCTION:
            response = await self._generate_introduction_response(user_input, input_analysis)
        elif current_phase == ROCKETPhase.STORY_EXTRACTION:
            response = await self._generate_story_guidance_response(user_input, input_analysis)
        elif current_phase == ROCKETPhase.CAR_ANALYSIS:
            response = await self._generate_experience_analysis_response(user_input, input_analysis)
        elif current_phase == ROCKETPhase.PSYCHOLOGIST_INSIGHT:
            response = await self._generate_psychological_insight_response(
                user_input, conversation_history, rocket_session_id
            )
        else:
            response = await self._generate_general_guidance_response(user_input, input_analysis)
        
        # Add Dr. Maya's professional signature and approach
        response['persona'] = self.persona_profile
        response['psychological_analysis'] = input_analysis
        response['phase_guidance'] = self._get_phase_specific_guidance(current_phase)
        
        return response


    # ============================================================================
    # PRIVATE ANALYSIS METHODS - Core Psychological Assessment
    # ============================================================================

    def _analyze_big_five_traits(self, text: str) -> Dict[str, Any]:
        """Analyze Big Five personality traits from text patterns"""
        traits = {}
        text_lower = text.lower()
        
        for trait, indicators in self.personality_indicators.items():
            high_count = sum(1 for word in indicators['high'] if word in text_lower)
            low_count = sum(1 for word in indicators['low'] if word in text_lower)
            
            # Calculate trait score (0.0 to 1.0, with 0.5 as neutral)
            total_indicators = len(indicators['high']) + len(indicators['low'])
            if total_indicators > 0:
                high_ratio = high_count / len(indicators['high'])
                low_ratio = low_count / len(indicators['low'])
                
                # Score based on relative presence of high vs low indicators
                if high_count + low_count > 0:
                    trait_score = high_count / (high_count + low_count)
                else:
                    trait_score = 0.5  # Neutral if no indicators found
            else:
                trait_score = 0.5
            
            traits[trait] = {
                'score': trait_score,
                'level': 'high' if trait_score > 0.6 else 'low' if trait_score < 0.4 else 'moderate',
                'confidence': min((high_count + low_count) / 5.0, 1.0),  # Confidence based on evidence
                'indicators_found': high_count + low_count
            }
        
        return traits


    def _identify_behavioral_patterns(self, text: str) -> Dict[str, Any]:
        """Identify behavioral patterns from language use"""
        patterns = {}
        text_lower = text.lower()
        
        for category, pattern_types in self.behavioral_patterns.items():
            category_patterns = {}
            
            for pattern_type, keywords in pattern_types.items():
                keyword_count = sum(1 for keyword in keywords if keyword in text_lower)
                category_patterns[pattern_type] = {
                    'score': keyword_count,
                    'strength': 'strong' if keyword_count > 2 else 'moderate' if keyword_count > 0 else 'weak'
                }
            
            # Determine dominant pattern for this category
            dominant_pattern = max(category_patterns.items(), key=lambda x: x[1]['score'])
            patterns[category] = {
                'dominant': dominant_pattern[0] if dominant_pattern[1]['score'] > 0 else 'unclear',
                'patterns': category_patterns,
                'confidence': min(dominant_pattern[1]['score'] / 3.0, 1.0)
            }
        
        return patterns


    def _analyze_motivation_drivers(self, text: str) -> List[str]:
        """Analyze what motivates the individual based on language patterns"""
        motivation_keywords = {
            'achievement': ['achieve', 'accomplish', 'succeed', 'excel', 'perform', 'results'],
            'recognition': ['recognition', 'praise', 'acknowledge', 'appreciate', 'credit'],
            'autonomy': ['independent', 'freedom', 'control', 'decide', 'own', 'self-directed'],
            'growth': ['learn', 'grow', 'develop', 'improve', 'advance', 'progress'],
            'impact': ['impact', 'difference', 'change', 'influence', 'contribute', 'help'],
            'security': ['stable', 'secure', 'predictable', 'reliable', 'safe', 'certain'],
            'variety': ['variety', 'diverse', 'different', 'change', 'new', 'various'],
            'collaboration': ['team', 'together', 'collaborate', 'partnership', 'group']
        }
        
        text_lower = text.lower()
        motivation_scores = {}
        
        for motivation, keywords in motivation_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > 0:
                motivation_scores[motivation] = score
        
        # Return top motivations sorted by strength
        sorted_motivations = sorted(motivation_scores.items(), key=lambda x: x[1], reverse=True)
        return [motivation for motivation, score in sorted_motivations[:5]]


    def _identify_stress_indicators(self, text: str) -> List[str]:
        """Identify potential stress indicators and pressure points"""
        stress_patterns = {
            'time_pressure': ['deadline', 'urgent', 'rush', 'time pressure', 'quickly', 'immediate'],
            'workload': ['overwhelmed', 'too much', 'heavy workload', 'overloaded', 'busy'],
            'ambiguity': ['unclear', 'uncertain', 'ambiguous', 'confused', 'not sure'],
            'conflict': ['conflict', 'disagreement', 'tension', 'difficult people', 'friction'],
            'change': ['change', 'transition', 'uncertainty', 'unstable', 'shifting'],
            'perfectionism': ['perfect', 'exactly right', 'no mistakes', 'flawless', 'precise']
        }
        
        text_lower = text.lower()
        stress_indicators = []
        
        for stress_type, keywords in stress_patterns.items():
            if any(keyword in text_lower for keyword in keywords):
                stress_indicators.append(stress_type)
        
        return stress_indicators


    async def _generate_career_alignment_analysis(
        self, 
        personality_traits: Dict,
        behavioral_patterns: Dict,
        conversation_text: str
    ) -> Dict[str, Any]:
        """Generate comprehensive career alignment analysis"""
        
        # Determine career strengths based on personality profile
        strengths = []
        development_areas = []
        
        # Analyze each trait for career implications
        for trait, data in personality_traits.items():
            if data['level'] == 'high':
                if trait == 'openness':
                    strengths.extend(['Creative problem solving', 'Innovation', 'Adaptability'])
                elif trait == 'conscientiousness':
                    strengths.extend(['Project management', 'Attention to detail', 'Reliability'])
                elif trait == 'extraversion':
                    strengths.extend(['Leadership', 'Networking', 'Public speaking'])
                elif trait == 'agreeableness':
                    strengths.extend(['Team collaboration', 'Customer service', 'Conflict resolution'])
                elif trait == 'neuroticism':
                    development_areas.extend(['Stress management', 'Emotional regulation'])
            elif data['level'] == 'low':
                if trait == 'neuroticism':  # Low neuroticism is positive
                    strengths.extend(['Stress resilience', 'Emotional stability'])
        
        # Determine ideal work environment
        ideal_environment = self._determine_ideal_work_environment(personality_traits, behavioral_patterns)
        
        # Determine career progression style
        progression_style = self._determine_progression_style(personality_traits, behavioral_patterns)
        
        # Use AI for enhanced analysis if available
        if self.ai_manager:
            try:
                ai_analysis = await self._get_ai_career_analysis(
                    personality_traits, behavioral_patterns, conversation_text
                )
                if ai_analysis:
                    strengths.extend(ai_analysis.get('additional_strengths', []))
                    development_areas.extend(ai_analysis.get('additional_development_areas', []))
            except Exception:
                pass  # Continue with rule-based analysis
        
        return {
            'strengths': list(set(strengths))[:10],  # Remove duplicates, limit to 10
            'development_areas': list(set(development_areas))[:5],
            'ideal_environment': ideal_environment,
            'progression_style': progression_style
        }


    def _determine_ideal_work_environment(
        self, 
        personality_traits: Dict,
        behavioral_patterns: Dict
    ) -> Dict[str, Any]:
        """Determine ideal work environment characteristics"""
        environment = {
            'structure_preference': 'moderate',
            'social_interaction': 'moderate',
            'autonomy_level': 'moderate',
            'innovation_focus': 'moderate',
            'pace': 'moderate'
        }
        
        # Adjust based on personality traits
        if personality_traits.get('conscientiousness', {}).get('level') == 'high':
            environment['structure_preference'] = 'high'
        elif personality_traits.get('openness', {}).get('level') == 'high':
            environment['structure_preference'] = 'low'
            environment['innovation_focus'] = 'high'
        
        if personality_traits.get('extraversion', {}).get('level') == 'high':
            environment['social_interaction'] = 'high'
        elif personality_traits.get('extraversion', {}).get('level') == 'low':
            environment['social_interaction'] = 'low'
            environment['autonomy_level'] = 'high'
        
        return environment


    def _determine_progression_style(
        self, 
        personality_traits: Dict,
        behavioral_patterns: Dict
    ) -> str:
        """Determine preferred career progression style"""
        
        # Default to balanced
        style = 'balanced_growth'
        
        # Analyze personality indicators
        if personality_traits.get('conscientiousness', {}).get('level') == 'high':
            if personality_traits.get('openness', {}).get('level') == 'high':
                style = 'strategic_advancement'  # High C + High O
            else:
                style = 'steady_progression'     # High C + Lower O
        elif personality_traits.get('openness', {}).get('level') == 'high':
            style = 'exploratory_growth'         # High O + Lower C
        
        if personality_traits.get('extraversion', {}).get('level') == 'high':
            if style in ['strategic_advancement', 'exploratory_growth']:
                style = 'leadership_track'       # High E + High cognitive traits
        
        return style


    async def _generate_psychological_recommendations(
        self, 
        personality_traits: Dict,
        behavioral_patterns: Dict,
        career_analysis: Dict
    ) -> Dict[str, List[str]]:
        """Generate personalized psychological recommendations"""
        
        recommendations = {
            'positioning': [],
            'interview_strategies': [],
            'networking': [],
            'branding': [],
            'action_plan': []
        }
        
        # Generate positioning recommendations based on strengths
        strengths = career_analysis.get('strengths', [])
        if 'Leadership' in strengths:
            recommendations['positioning'].append("Position yourself as a leader who drives results through people")
        if 'Creative problem solving' in strengths:
            recommendations['positioning'].append("Highlight your innovative approach to complex challenges")
        if 'Team collaboration' in strengths:
            recommendations['positioning'].append("Emphasize your ability to build consensus and foster collaboration")
        
        # Interview strategies based on personality
        if personality_traits.get('extraversion', {}).get('level') == 'high':
            recommendations['interview_strategies'].extend([
                "Use your natural communication skills to tell compelling stories",
                "Prepare examples that showcase your team leadership abilities"
            ])
        else:
            recommendations['interview_strategies'].extend([
                "Prepare detailed examples that demonstrate your analytical thinking",
                "Focus on quality over quantity in your responses"
            ])
        
        # Networking approaches
        if personality_traits.get('agreeableness', {}).get('level') == 'high':
            recommendations['networking'].extend([
                "Focus on building genuine, long-term professional relationships",
                "Offer help and support to others before seeking assistance"
            ])
        
        # Personal branding tips
        recommendations['branding'].append("Develop a professional brand that authentically reflects your personality")
        
        # Action plan based on development areas
        development_areas = career_analysis.get('development_areas', [])
        for area in development_areas:
            if 'stress' in area.lower():
                recommendations['action_plan'].append("Develop stress management techniques and mindfulness practices")
            elif 'communication' in area.lower():
                recommendations['action_plan'].append("Join professional speaking groups or communication workshops")
        
        return recommendations


    async def _generate_dr_maya_message(
        self, 
        personality_traits: Dict,
        career_analysis: Dict,
        recommendations: Dict
    ) -> str:
        """Generate Dr. Maya's personalized message"""
        
        # Extract key insights for personalization
        dominant_traits = [trait for trait, data in personality_traits.items() 
                          if data.get('level') == 'high' and data.get('confidence', 0) > 0.5]
        
        top_strengths = career_analysis.get('strengths', [])[:3]
        
        # Create personalized message
        message_parts = [
            f"Based on our conversation, I can see that you have a {', '.join(dominant_traits[:2])} personality profile, "
            f"which translates beautifully into professional strengths.",
            f"\nYour key career assets include {', '.join(top_strengths[:2])}, "
            f"which positions you well for roles that value {career_analysis.get('progression_style', 'balanced growth')}.",
        ]
        
        if recommendations.get('positioning'):
            message_parts.append(f"\nI recommend positioning yourself as someone who {recommendations['positioning'][0].lower()}.")
        
        message_parts.append("\nRemember, authentic self-presentation is key to finding the right career fit. "
                           "Your personality is your professional superpower when leveraged correctly.")
        
        return "".join(message_parts)


    def _calculate_analysis_confidence(
        self, 
        personality_traits: Dict,
        behavioral_patterns: Dict,
        response_count: int
    ) -> float:
        """Calculate confidence level for psychological analysis"""
        
        # Base confidence from response count
        base_confidence = min(response_count / 10.0, 0.8)  # Max 0.8 from response count
        
        # Confidence boost from trait evidence
        trait_evidence = sum(trait.get('confidence', 0) for trait in personality_traits.values())
        trait_confidence = min(trait_evidence / len(personality_traits), 0.2)  # Max 0.2 boost
        
        # Pattern consistency boost
        pattern_confidence = 0.0
        for category_data in behavioral_patterns.values():
            pattern_confidence += category_data.get('confidence', 0)
        pattern_confidence = min(pattern_confidence / len(behavioral_patterns), 0.2)  # Max 0.2 boost
        
        total_confidence = base_confidence + trait_confidence + pattern_confidence
        return min(total_confidence, 1.0)


    # ============================================================================
    # CONVERSATION RESPONSE GENERATION - Dr. Maya Insight Persona
    # ============================================================================

    def _analyze_single_response(self, user_input: str) -> Dict[str, Any]:
        """Quick analysis of a single user response for immediate insights"""
        analysis = {
            'emotional_tone': 'neutral',
            'confidence_level': 'moderate',
            'detail_orientation': 'moderate',
            'key_themes': []
        }
        
        input_lower = user_input.lower()
        
        # Emotional tone indicators
        positive_words = ['enjoy', 'love', 'excited', 'great', 'amazing', 'excellent', 'wonderful']
        negative_words = ['stress', 'difficult', 'challenge', 'struggle', 'hard', 'tough', 'problem']
        
        positive_count = sum(1 for word in positive_words if word in input_lower)
        negative_count = sum(1 for word in negative_words if word in input_lower)
        
        if positive_count > negative_count:
            analysis['emotional_tone'] = 'positive'
        elif negative_count > positive_count:
            analysis['emotional_tone'] = 'negative'
        
        # Confidence indicators
        confidence_words = ['definitely', 'certainly', 'clearly', 'confident', 'sure']
        uncertainty_words = ['maybe', 'perhaps', 'not sure', 'think', 'probably', 'might']
        
        if any(word in input_lower for word in confidence_words):
            analysis['confidence_level'] = 'high'
        elif any(word in input_lower for word in uncertainty_words):
            analysis['confidence_level'] = 'low'
        
        # Detail orientation
        if len(user_input.split()) > 50 and any(char.isdigit() for char in user_input):
            analysis['detail_orientation'] = 'high'
        elif len(user_input.split()) < 20:
            analysis['detail_orientation'] = 'low'
        
        return analysis


    async def _generate_introduction_response(
        self, 
        user_input: str,
        input_analysis: Dict
    ) -> Dict[str, Any]:
        """Generate Dr. Maya's introduction phase response"""
        
        response_base = {
            'message': "",
            'follow_up_questions': [],
            'psychological_observation': "",
            'encouragement': ""
        }
        
        # Personalized greeting based on input analysis
        if input_analysis['emotional_tone'] == 'positive':
            greeting = "I can sense your enthusiasm about your career journey, which is wonderful to see!"
        elif input_analysis['emotional_tone'] == 'negative':
            greeting = "I appreciate your honesty about the challenges you're facing. That self-awareness is actually a strength."
        else:
            greeting = "Thank you for sharing that with me. I'm here to help you discover and articulate your unique professional value."
        
        response_base['message'] = (
            f"Hello! I'm Dr. Maya Insight, and {greeting} "
            f"As we work together on your resume, I'll be helping you understand not just what you've accomplished, "
            f"but how your personality and work style contribute to your professional success. "
            f"This psychological insight will help us position you authentically and powerfully."
        )
        
        # Generate follow-up questions
        response_base['follow_up_questions'] = [
            "What aspects of your work energize you the most?",
            "How do you typically approach new challenges or projects?",
            "What kind of work environment brings out your best performance?"
        ]
        
        response_base['psychological_observation'] = (
            f"I notice you communicate with a {input_analysis['confidence_level']} confidence level "
            f"and {input_analysis['detail_orientation']} attention to detail, which already tells me something about your work style."
        )
        
        return response_base


    async def _generate_psychological_insight_response(
        self, 
        user_input: str,
        conversation_history: List[str],
        rocket_session_id: str
    ) -> Dict[str, Any]:
        """Generate comprehensive psychological insight response"""
        
        # Get existing analysis
        async with AsyncSessionLocal() as session:
            insight = await session.get(PsychologistInsight, rocket_session_id)
            
            if not insight:
                # Generate new analysis
                insight = await self.analyze_personality_from_responses(
                    rocket_session_id, conversation_history + [user_input]
                )
        
        # Create comprehensive response
        response = {
            'message': insight.personalized_message if insight else "Let me analyze your responses...",
            'personality_summary': self._create_personality_summary(insight) if insight else {},
            'career_recommendations': insight.positioning_recommendations if insight else [],
            'action_steps': insight.action_plan if insight else [],
            'next_phase_guidance': "Now let's apply these insights to craft compelling resume content that reflects your authentic professional self."
        }
        
        return response


    def _create_personality_summary(self, insight: PsychologistInsight) -> Dict[str, Any]:
        """Create a user-friendly personality summary"""
        if not insight or not insight.personality_traits:
            return {}
        
        summary = {
            'primary_traits': [],
            'work_style': insight.behavioral_patterns.get('work_style', {}).get('dominant', 'balanced'),
            'leadership_approach': insight.behavioral_patterns.get('decision_making', {}).get('dominant', 'thoughtful'),
            'ideal_role_characteristics': []
        }
        
        # Extract primary traits
        for trait, data in insight.personality_traits.items():
            if isinstance(data, dict) and data.get('level') == 'high' and data.get('confidence', 0) > 0.6:
                summary['primary_traits'].append(trait.replace('_', ' ').title())
        
        # Generate ideal role characteristics
        if 'Leadership' in insight.career_strengths:
            summary['ideal_role_characteristics'].append('Leadership and team management responsibilities')
        if 'Creative problem solving' in insight.career_strengths:
            summary['ideal_role_characteristics'].append('Complex problem-solving and innovation opportunities')
        
        return summary


    def _get_phase_specific_guidance(self, phase: ROCKETPhase) -> Dict[str, str]:
        """Get phase-specific psychological guidance"""
        guidance = {
            ROCKETPhase.INTRODUCTION: {
                'focus': 'Building rapport and understanding your professional identity',
                'psychology_tip': 'Authentic self-presentation starts with self-awareness'
            },
            ROCKETPhase.STORY_EXTRACTION: {
                'focus': 'Discovering your core professional narrative',
                'psychology_tip': 'Your personal story reflects your values and motivations'
            },
            ROCKETPhase.CAR_ANALYSIS: {
                'focus': 'Understanding how you approach challenges and create value',
                'psychology_tip': 'Your problem-solving style is a key differentiator'
            },
            ROCKETPhase.PSYCHOLOGIST_INSIGHT: {
                'focus': 'Integrating psychological insights with professional positioning',
                'psychology_tip': 'Align your authentic self with career opportunities'
            }
        }
        
        return guidance.get(phase, {
            'focus': 'Continuing our career development conversation',
            'psychology_tip': 'Stay true to your authentic professional self'
        })


    # Additional response generation methods for other phases...
    async def _generate_story_guidance_response(self, user_input: str, input_analysis: Dict) -> Dict[str, Any]:
        """Generate story extraction guidance response"""
        return {
            'message': "I can see patterns in how you describe your work that reveal your professional identity. Let's dig deeper into what makes you unique.",
            'follow_up_questions': [
                "What impact do you have on the people you work with?",
                "How do others describe your contribution to projects?"
            ],
            'psychological_insight': f"Your {input_analysis['confidence_level']} confidence in describing your role suggests {self._interpret_confidence_level(input_analysis['confidence_level'])}"
        }


    async def _generate_experience_analysis_response(self, user_input: str, input_analysis: Dict) -> Dict[str, Any]:
        """Generate experience analysis response"""
        return {
            'message': "The way you structure your experience tells me about your thinking process. This helps us present your achievements in the most compelling way.",
            'follow_up_questions': [
                "What specific metrics or outcomes can you quantify from this experience?",
                "How did this experience change your approach to similar challenges?"
            ],
            'psychological_insight': f"Your {input_analysis['detail_orientation']} level of detail suggests you have a {self._interpret_detail_orientation(input_analysis['detail_orientation'])} cognitive style."
        }


    def _interpret_confidence_level(self, confidence_level: str) -> str:
        """Interpret confidence level for psychological insight"""
        interpretations = {
            'high': 'strong self-awareness and clarity about your professional value',
            'moderate': 'developing confidence that we can strengthen through this process',
            'low': 'thoughtful self-reflection, which often leads to more authentic positioning'
        }
        return interpretations.get(confidence_level, 'a balanced approach to self-assessment')


    def _interpret_detail_orientation(self, detail_level: str) -> str:
        """Interpret detail orientation for psychological insight"""
        interpretations = {
            'high': 'systematic and thorough',
            'moderate': 'balanced and practical', 
            'low': 'big-picture and strategic'
        }
        return interpretations.get(detail_level, 'thoughtful')


    async def _generate_general_guidance_response(self, user_input: str, input_analysis: Dict) -> Dict[str, Any]:
        """Generate general guidance response"""
        return {
            'message': "I'm here to help you understand how your unique personality and approach contribute to your professional success.",
            'follow_up_questions': ["What would you like to explore about your career development?"],
            'psychological_insight': "Every response gives me insight into your professional personality."
        }


    async def _get_ai_career_analysis(
        self, 
        personality_traits: Dict,
        behavioral_patterns: Dict,
        conversation_text: str
    ) -> Optional[Dict]:
        """Get AI-powered career analysis enhancement"""
        if not self.ai_manager:
            return None
            
        try:
            prompt = f"""
            As Dr. Maya Insight, Career Psychologist, analyze this personality profile:
            
            Personality Traits: {json.dumps(personality_traits, indent=2)}
            Behavioral Patterns: {json.dumps(behavioral_patterns, indent=2)}
            
            Conversation Context: {conversation_text[:500]}...
            
            Provide additional career insights:
            - 3 additional career strengths not obvious from the data
            - 2 development opportunities for growth
            - Career positioning recommendations
            
            Return as JSON with keys: additional_strengths, additional_development_areas, positioning_insights
            """
            
            ai_response = await self.ai_manager.process_prompt(prompt)
            if ai_response and 'response' in ai_response:
                return json.loads(ai_response['response'])
                
        except Exception:
            pass
            
        return None