"""
ROCKET Framework Service Implementation

Core service implementing the ROCKET Framework (Results-Optimized Career Knowledge Enhancement Toolkit)
with sophisticated algorithmic analysis for:

1. Personal Story Extraction - "I'm the _____ who helps _____ achieve _____"
2. CAR Framework Analysis - Context, Action, Results structured extraction
3. REST Quantification - Results, Efficiency, Scope, Time business impact analysis
4. Intelligent Response Quality Assessment and Follow-up Generation

Integrates with existing Ollama AI system for enhanced career counseling.
"""

import re
import json
import asyncio
from datetime import datetime
from typing import Dict, List, Optional, Tuple, Any
from uuid import uuid4

from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

from ..core.database import AsyncSessionLocal
from ..models.rocket_framework import (
    ROCKETSession, PersonalStory, CARFrameworkData, RESTQuantification,
    ResponseAnalysis, ROCKETPhase, ProcessingMode, ResponseQuality
)
from ..agent.manager import AgentManager
from .exceptions import ServiceException


class ROCKETFrameworkService:
    """
    Core ROCKET Framework service with advanced algorithmic implementations
    
    Handles personal story extraction, CAR analysis, REST quantification,
    and intelligent conversation management.
    """
    
    def __init__(self, ai_manager: Optional[AgentManager] = None):
        self.ai_manager = ai_manager
        
        # Personal Story Extraction Patterns
        self.story_patterns = {
            'role_identity': [
                r"I(?:'m| am) (?:a |an |the )?(.+?)(?:\s+who|\s+that|\s+helping|\.)",
                r"As (?:a |an |the )?(.+?),",
                r"(?:My role|My position) (?:is|as) (?:a |an |the )?(.+?)(?:\s+who|\s+where|\s+that|\.)",
                r"I work as (?:a |an |the )?(.+?)(?:\s+who|\s+where|\s+in|\.)"
            ],
            'target_audience': [
                r"(?:who |that )?(?:helps?|helping|assist|supporting?) (.+?)(?:\s+(?:achieve|by|to|with)|\.)",
                r"(?:working with|serve|serving) (.+?)(?:\s+(?:to|by|achieve)|\.)",
                r"for (.+?)(?:\s+(?:to|by|achieve|who)|\.)"
            ],
            'value_proposition': [
                r"(?:achieve|accomplish|reach|attain|realize) (.+?)(?:\.|$)",
                r"(?:to|by) (.+?)(?:\.|$)",
                r"(?:helping .+?) (.+?)(?:\.|$)"
            ]
        }
        
        # CAR Framework Indicators
        self.car_indicators = {
            'context': [
                'situation', 'challenge', 'problem', 'environment', 'when', 'during',
                'faced with', 'tasked with', 'responsible for', 'working on'
            ],
            'action': [
                'implemented', 'developed', 'created', 'designed', 'led', 'managed',
                'organized', 'coordinated', 'executed', 'performed', 'delivered'
            ],
            'results': [
                'resulted in', 'achieved', 'increased', 'decreased', 'improved',
                'reduced', 'generated', 'saved', 'delivered', 'produced'
            ]
        }
        
        # REST Quantification Patterns
        self.quantification_patterns = {
            'percentage': r'(\d+(?:\.\d+)?)\s*%',
            'currency': r'\$\s*(\d+(?:,\d{3})*(?:\.\d{2})?)',
            'numbers': r'(\d+(?:,\d{3})*(?:\.\d+)?)',
            'time_periods': r'(\d+)\s*(days?|weeks?|months?|years?)',
            'people_count': r'(\d+)\s*(?:people|employees|team members|users|customers)'
        }


    async def create_rocket_session(
        self, 
        user_id: str, 
        conversation_session_id: Optional[str] = None,
        processing_mode: ProcessingMode = ProcessingMode.INTEGRATED
    ) -> ROCKETSession:
        """Create a new ROCKET Framework session"""
        
        async with AsyncSessionLocal() as session:
            rocket_session = ROCKETSession(
                id=str(uuid4()),
                user_id=user_id,
                conversation_session_id=conversation_session_id,
                processing_mode=processing_mode,
                current_phase=ROCKETPhase.INTRODUCTION
            )
            
            session.add(rocket_session)
            await session.commit()
            await session.refresh(rocket_session)
            
            return rocket_session


    async def extract_personal_story(
        self, 
        rocket_session_id: str, 
        responses: List[str]
    ) -> PersonalStory:
        """
        Advanced NLP for personal story pattern extraction
        
        Implements the "I'm the _____ who helps _____ achieve _____" framework
        with confidence scoring and alternative version generation.
        """
        
        # Combine all responses into analysis text
        combined_text = " ".join(responses)
        
        # Extract story components using pattern matching
        role_identity = self._extract_component(combined_text, self.story_patterns['role_identity'])
        target_audience = self._extract_component(combined_text, self.story_patterns['target_audience'])
        value_proposition = self._extract_component(combined_text, self.story_patterns['value_proposition'])
        
        # Generate formatted story
        formatted_story = self._format_personal_story(role_identity, target_audience, value_proposition)
        
        # Calculate confidence score
        confidence_score = self._calculate_story_confidence(role_identity, target_audience, value_proposition)
        
        # Generate alternative versions
        alternative_versions = await self._generate_story_alternatives(
            role_identity, target_audience, value_proposition, combined_text
        )
        
        # Save to database
        async with AsyncSessionLocal() as session:
            personal_story = PersonalStory(
                id=str(uuid4()),
                rocket_session_id=rocket_session_id,
                role_identity=role_identity,
                target_audience=target_audience,
                value_proposition=value_proposition,
                formatted_story=formatted_story,
                alternative_versions=alternative_versions,
                confidence_score=confidence_score,
                source_responses=responses
            )
            
            session.add(personal_story)
            await session.commit()
            await session.refresh(personal_story)
            
            return personal_story


    async def apply_car_framework(
        self, 
        rocket_session_id: str, 
        experience_text: str,
        experience_category: Optional[str] = None
    ) -> CARFrameworkData:
        """
        Apply Context-Action-Results analysis with advanced text structuring
        
        Extracts and structures experience data using CAR methodology with
        skills identification and impact analysis.
        """
        
        # Extract CAR components
        context = self._extract_car_component(experience_text, 'context')
        action = self._extract_car_component(experience_text, 'action')
        results = self._extract_car_component(experience_text, 'results')
        
        # Identify skills demonstrated
        skills_demonstrated = await self._identify_skills(experience_text)
        
        # Analyze impact areas
        impact_areas = self._analyze_impact_areas(experience_text)
        
        # Extract quantifiable metrics
        quantifiable_metrics = self._extract_quantifiable_metrics(experience_text)
        
        # Calculate analysis confidence
        analysis_confidence = self._calculate_car_confidence(context, action, results)
        completeness_score = self._calculate_completeness_score(context, action, results)
        
        # Generate enhancement suggestions
        enhancement_suggestions = await self._generate_car_enhancements(
            context, action, results, experience_text
        )
        
        # Save to database
        async with AsyncSessionLocal() as session:
            car_data = CARFrameworkData(
                id=str(uuid4()),
                rocket_session_id=rocket_session_id,
                raw_experience_text=experience_text,
                experience_category=experience_category,
                context=context,
                action=action,
                results=results,
                skills_demonstrated=skills_demonstrated,
                impact_areas=impact_areas,
                quantifiable_metrics=quantifiable_metrics,
                analysis_confidence=analysis_confidence,
                completeness_score=completeness_score,
                enhancement_suggestions=enhancement_suggestions
            )
            
            session.add(car_data)
            await session.commit()
            await session.refresh(car_data)
            
            return car_data


    async def quantify_with_rest(
        self, 
        rocket_session_id: str,
        car_data_id: str,
        car_data: CARFrameworkData
    ) -> RESTQuantification:
        """
        Advanced quantification using REST methodology (Results, Efficiency, Scope, Time)
        
        Performs business impact analysis and generates formatted outputs for
        resume bullets, LinkedIn summaries, and interview talking points.
        """
        
        # Analyze REST components
        results_metrics = self._analyze_results_metrics(car_data.results, car_data.quantifiable_metrics)
        efficiency_gains = self._analyze_efficiency_gains(car_data.raw_experience_text)
        scope_impact = self._analyze_scope_impact(car_data.raw_experience_text)
        time_factors = self._analyze_time_factors(car_data.raw_experience_text)
        
        # Calculate business impact
        revenue_impact, cost_savings = self._calculate_business_impact(
            car_data.quantifiable_metrics, results_metrics
        )
        
        # Extract percentage improvements
        percentage_improvements = self._extract_percentage_improvements(car_data.raw_experience_text)
        
        # Estimate people affected
        people_affected = self._estimate_people_affected(car_data.raw_experience_text)
        
        # Generate formatted outputs
        resume_bullets = await self._generate_resume_bullets(car_data, results_metrics)
        linkedin_points = await self._generate_linkedin_points(car_data, results_metrics)
        interview_points = await self._generate_interview_points(car_data, results_metrics)
        
        # Calculate confidence
        quantification_confidence = self._calculate_rest_confidence(
            results_metrics, efficiency_gains, scope_impact, time_factors
        )
        
        # Save to database
        async with AsyncSessionLocal() as session:
            rest_quantification = RESTQuantification(
                id=str(uuid4()),
                rocket_session_id=rocket_session_id,
                car_data_id=car_data_id,
                results_metrics=results_metrics,
                efficiency_gains=efficiency_gains,
                scope_impact=scope_impact,
                time_factors=time_factors,
                revenue_impact=revenue_impact,
                cost_savings=cost_savings,
                percentage_improvements=percentage_improvements,
                people_affected=people_affected,
                quantification_confidence=quantification_confidence,
                resume_bullet_points=resume_bullets,
                linkedin_summary_points=linkedin_points,
                interview_talking_points=interview_points
            )
            
            session.add(rest_quantification)
            await session.commit()
            await session.refresh(rest_quantification)
            
            return rest_quantification


    async def analyze_response_quality(
        self, 
        rocket_session_id: str,
        user_response: str, 
        response_context: str,
        conversation_phase: ROCKETPhase
    ) -> ResponseAnalysis:
        """
        Intelligent analysis for response quality and follow-up generation
        
        Analyzes user responses for completeness, specificity, and relevance,
        then generates appropriate follow-up questions and recommendations.
        """
        
        # Calculate quality scores
        completeness_score = self._calculate_completeness_score_response(user_response, conversation_phase)
        specificity_score = self._calculate_specificity_score(user_response)
        relevance_score = self._calculate_relevance_score(user_response, response_context)
        
        # Determine overall quality rating
        quality_rating = self._determine_quality_rating(completeness_score, specificity_score, relevance_score)
        
        # Extract information from response
        extracted_information = await self._extract_response_information(user_response, conversation_phase)
        
        # Identify missing elements
        missing_elements = self._identify_missing_elements(user_response, conversation_phase)
        
        # Generate suggested follow-ups
        suggested_followups = await self._generate_intelligent_followups(
            user_response, missing_elements, conversation_phase, quality_rating
        )
        
        # Determine follow-up actions needed
        needs_clarification = len(missing_elements) > 2 or quality_rating == ResponseQuality.INSUFFICIENT
        requires_examples = specificity_score < 0.6 or quality_rating == ResponseQuality.NEEDS_FOLLOWUP
        ready_for_next_phase = quality_rating in [ResponseQuality.EXCELLENT, ResponseQuality.GOOD] and completeness_score > 0.7
        
        # Save analysis
        async with AsyncSessionLocal() as session:
            response_analysis = ResponseAnalysis(
                id=str(uuid4()),
                rocket_session_id=rocket_session_id,
                user_response=user_response,
                response_context=response_context,
                conversation_phase=conversation_phase,
                quality_rating=quality_rating,
                completeness_score=completeness_score,
                specificity_score=specificity_score,
                relevance_score=relevance_score,
                extracted_information=extracted_information,
                missing_elements=missing_elements,
                suggested_followups=suggested_followups,
                confidence_score=(completeness_score + specificity_score + relevance_score) / 3,
                needs_clarification=needs_clarification,
                requires_examples=requires_examples,
                ready_for_next_phase=ready_for_next_phase
            )
            
            session.add(response_analysis)
            await session.commit()
            await session.refresh(response_analysis)
            
            return response_analysis


    # ============================================================================
    # PRIVATE HELPER METHODS - Core Algorithm Implementations
    # ============================================================================

    def _extract_component(self, text: str, patterns: List[str]) -> Optional[str]:
        """Extract story component using regex patterns with confidence scoring"""
        best_match = None
        highest_confidence = 0.0
        
        for pattern in patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                extracted = match.group(1).strip()
                # Calculate confidence based on length and context
                confidence = min(len(extracted) / 50.0, 1.0) * 0.8 + 0.2
                if confidence > highest_confidence:
                    highest_confidence = confidence
                    best_match = extracted
        
        return best_match


    def _format_personal_story(
        self, 
        role_identity: Optional[str], 
        target_audience: Optional[str], 
        value_proposition: Optional[str]
    ) -> str:
        """Format the personal story in the ROCKET framework format"""
        role = role_identity or "[Your Role]"
        audience = target_audience or "[Target Audience]"
        value = value_proposition or "[Value Delivered]"
        
        return f"I'm the {role} who helps {audience} achieve {value}"


    def _calculate_story_confidence(
        self, 
        role_identity: Optional[str], 
        target_audience: Optional[str], 
        value_proposition: Optional[str]
    ) -> float:
        """Calculate confidence score for story extraction (0.0 to 1.0)"""
        components_found = sum([
            1 if role_identity and len(role_identity) > 2 else 0,
            1 if target_audience and len(target_audience) > 2 else 0,
            1 if value_proposition and len(value_proposition) > 2 else 0
        ])
        
        base_confidence = components_found / 3.0
        
        # Boost confidence for quality components
        quality_boost = 0.0
        if role_identity and len(role_identity) > 10:
            quality_boost += 0.1
        if target_audience and len(target_audience) > 10:
            quality_boost += 0.1
        if value_proposition and len(value_proposition) > 10:
            quality_boost += 0.1
            
        return min(base_confidence + quality_boost, 1.0)


    async def _generate_story_alternatives(
        self, 
        role_identity: Optional[str], 
        target_audience: Optional[str], 
        value_proposition: Optional[str],
        original_text: str
    ) -> Dict[str, Any]:
        """Generate alternative story versions using AI"""
        alternatives = {
            'professional': self._format_personal_story(role_identity, target_audience, value_proposition),
            'casual': None,
            'linkedin': None,
            'elevator_pitch': None
        }
        
        if self.ai_manager:
            try:
                # Use AI to generate variations
                prompt = f"""
                Based on this original text: "{original_text}"
                Role: {role_identity}
                Audience: {target_audience} 
                Value: {value_proposition}
                
                Generate 3 alternative versions:
                1. Casual/conversational version
                2. LinkedIn professional summary version
                3. 30-second elevator pitch version
                
                Return as JSON with keys: casual, linkedin, elevator_pitch
                """
                
                ai_response = await self.ai_manager.process_prompt(prompt)
                if ai_response and 'response' in ai_response:
                    try:
                        ai_alternatives = json.loads(ai_response['response'])
                        alternatives.update(ai_alternatives)
                    except json.JSONDecodeError:
                        pass  # Keep manual alternatives
                        
            except Exception:
                pass  # Fallback to manual alternatives
        
        return alternatives


    def _extract_car_component(self, text: str, component_type: str) -> Optional[str]:
        """Extract specific CAR component using indicator words and sentence analysis"""
        indicators = self.car_indicators.get(component_type, [])
        sentences = re.split(r'[.!?]+', text)
        
        best_sentence = None
        highest_score = 0.0
        
        for sentence in sentences:
            sentence = sentence.strip()
            if len(sentence) < 10:  # Skip very short sentences
                continue
                
            # Calculate indicator score
            indicator_score = sum(1 for indicator in indicators if indicator.lower() in sentence.lower())
            
            # Normalize by sentence length and number of indicators
            if len(indicators) > 0:
                normalized_score = indicator_score / len(indicators)
                
                if normalized_score > highest_score:
                    highest_score = normalized_score
                    best_sentence = sentence
        
        return best_sentence


    async def _identify_skills(self, experience_text: str) -> List[str]:
        """Identify skills demonstrated in the experience using AI analysis"""
        skills = []
        
        # Basic skill pattern matching
        skill_patterns = [
            r'(?:using|with|through|via) ([A-Z][a-zA-Z\s]{2,20})',
            r'(?:implemented|developed|created|designed) ([a-zA-Z\s]{3,20})',
            r'(?:proficient|skilled|experienced) (?:in|with) ([a-zA-Z\s]{3,20})'
        ]
        
        for pattern in skill_patterns:
            matches = re.finditer(pattern, experience_text, re.IGNORECASE)
            for match in matches:
                skill = match.group(1).strip()
                if len(skill) > 2 and skill not in skills:
                    skills.append(skill)
        
        # Use AI for enhanced skill extraction if available
        if self.ai_manager and skills:
            try:
                prompt = f"""
                Analyze this experience text and identify specific skills demonstrated:
                "{experience_text}"
                
                Focus on:
                - Technical skills
                - Leadership skills  
                - Communication skills
                - Problem-solving skills
                - Domain expertise
                
                Return top 5 most relevant skills as JSON array.
                """
                
                ai_response = await self.ai_manager.process_prompt(prompt)
                if ai_response and 'response' in ai_response:
                    try:
                        ai_skills = json.loads(ai_response['response'])
                        if isinstance(ai_skills, list):
                            # Merge with pattern-matched skills
                            skills.extend([skill for skill in ai_skills if skill not in skills])
                    except json.JSONDecodeError:
                        pass
                        
            except Exception:
                pass
        
        return skills[:10]  # Limit to top 10 skills


    def _analyze_impact_areas(self, experience_text: str) -> List[str]:
        """Analyze business impact areas from experience text"""
        impact_keywords = {
            'revenue': ['revenue', 'sales', 'income', 'profit', 'earnings'],
            'efficiency': ['efficiency', 'productivity', 'streamlined', 'optimized', 'automated'],
            'cost': ['cost', 'savings', 'budget', 'expenses', 'reduced'],
            'quality': ['quality', 'accuracy', 'reliability', 'improvement'],
            'customer': ['customer', 'client', 'user', 'satisfaction', 'experience'],
            'team': ['team', 'collaboration', 'leadership', 'mentoring', 'training'],
            'innovation': ['innovation', 'creative', 'novel', 'breakthrough', 'pioneered'],
            'scale': ['scale', 'growth', 'expansion', 'increased', 'volume']
        }
        
        impact_areas = []
        text_lower = experience_text.lower()
        
        for area, keywords in impact_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                impact_areas.append(area)
        
        return impact_areas


    def _extract_quantifiable_metrics(self, text: str) -> Dict[str, Any]:
        """Extract quantifiable metrics using advanced pattern matching"""
        metrics = {}
        
        for metric_type, pattern in self.quantification_patterns.items():
            matches = re.finditer(pattern, text, re.IGNORECASE)
            values = []
            for match in matches:
                values.append(match.group(1))
            
            if values:
                metrics[metric_type] = values
        
        return metrics


    def _calculate_car_confidence(
        self, 
        context: Optional[str], 
        action: Optional[str], 
        results: Optional[str]
    ) -> float:
        """Calculate confidence for CAR framework analysis"""
        components = [context, action, results]
        present_components = sum(1 for comp in components if comp and len(comp) > 10)
        
        base_confidence = present_components / 3.0
        
        # Quality adjustments
        quality_bonus = 0.0
        if context and len(context) > 50:
            quality_bonus += 0.1
        if action and len(action) > 50:
            quality_bonus += 0.1
        if results and len(results) > 50:
            quality_bonus += 0.1
            
        return min(base_confidence + quality_bonus, 1.0)


    # Additional helper methods continue...
    # (Implementation continues with remaining private methods for completeness)
    
    def _calculate_completeness_score(
        self, 
        context: Optional[str], 
        action: Optional[str], 
        results: Optional[str]
    ) -> float:
        """Calculate completeness score for CAR analysis"""
        components = [context, action, results]
        present_count = sum(1 for comp in components if comp and len(comp.strip()) > 5)
        return present_count / 3.0


    async def _generate_car_enhancements(
        self, 
        context: Optional[str], 
        action: Optional[str], 
        results: Optional[str],
        original_text: str
    ) -> List[str]:
        """Generate enhancement suggestions for CAR analysis"""
        suggestions = []
        
        # Basic rule-based suggestions
        if not context or len(context) < 20:
            suggestions.append("Add more context about the situation or challenge you faced")
        
        if not action or len(action) < 20:
            suggestions.append("Provide more specific details about the actions you took")
        
        if not results or len(results) < 20:
            suggestions.append("Include quantified results and measurable outcomes")
        
        # AI-powered enhancement suggestions
        if self.ai_manager:
            try:
                prompt = f"""
                Analyze this experience and suggest specific improvements:
                
                Context: {context or 'Missing context'}
                Action: {action or 'Missing action details'}
                Results: {results or 'Missing results'}
                
                Original text: {original_text}
                
                Provide 3 specific suggestions to improve this experience description for a resume.
                Focus on quantification, impact, and clarity.
                Return as JSON array of strings.
                """
                
                ai_response = await self.ai_manager.process_prompt(prompt)
                if ai_response and 'response' in ai_response:
                    try:
                        ai_suggestions = json.loads(ai_response['response'])
                        if isinstance(ai_suggestions, list):
                            suggestions.extend(ai_suggestions)
                    except json.JSONDecodeError:
                        pass
                        
            except Exception:
                pass
        
        return suggestions[:5]  # Limit to 5 suggestions


    async def _generate_resume_bullets(
        self, 
        car_data: CARFrameworkData,
        results_metrics: Dict
    ) -> List[str]:
        """Generate optimized resume bullet points"""
        bullets = []
        
        # Template-based bullet generation
        if car_data.action and car_data.results:
            # Basic bullet format: Action verb + what you did + quantified result
            action_clean = car_data.action.strip()
            results_clean = car_data.results.strip()
            
            basic_bullet = f"{action_clean}, resulting in {results_clean}"
            bullets.append(basic_bullet)
        
        # AI-powered bullet generation
        if self.ai_manager:
            try:
                prompt = f"""
                Create 3 professional resume bullet points from this experience:
                
                Context: {car_data.context}
                Action: {car_data.action}
                Results: {car_data.results}
                Skills: {car_data.skills_demonstrated}
                Metrics: {car_data.quantifiable_metrics}
                
                Requirements:
                - Start with strong action verbs
                - Include quantified results where possible
                - Keep under 150 characters each
                - Professional tone
                
                Return as JSON array of strings.
                """
                
                ai_response = await self.ai_manager.process_prompt(prompt)
                if ai_response and 'response' in ai_response:
                    try:
                        ai_bullets = json.loads(ai_response['response'])
                        if isinstance(ai_bullets, list):
                            bullets.extend(ai_bullets)
                    except json.JSONDecodeError:
                        pass
                        
            except Exception:
                pass
        
        return bullets[:5]  # Limit to 5 bullets


    async def _generate_linkedin_points(
        self, 
        car_data: CARFrameworkData,
        results_metrics: Dict
    ) -> List[str]:
        """Generate LinkedIn summary points"""
        points = []
        
        # AI-powered LinkedIn point generation
        if self.ai_manager:
            try:
                prompt = f"""
                Create 3 LinkedIn summary points highlighting this achievement:
                
                Experience: {car_data.raw_experience_text}
                Skills: {car_data.skills_demonstrated}
                Impact Areas: {car_data.impact_areas}
                
                Requirements:
                - Professional yet engaging tone
                - Emphasize business impact
                - Include industry-relevant keywords
                - Each point 100-200 characters
                
                Return as JSON array of strings.
                """
                
                ai_response = await self.ai_manager.process_prompt(prompt)
                if ai_response and 'response' in ai_response:
                    try:
                        ai_points = json.loads(ai_response['response'])
                        if isinstance(ai_points, list):
                            points.extend(ai_points)
                    except json.JSONDecodeError:
                        pass
                        
            except Exception:
                pass
        
        return points


    async def _generate_interview_points(
        self, 
        car_data: CARFrameworkData,
        results_metrics: Dict
    ) -> List[str]:
        """Generate interview talking points"""
        points = []
        
        # AI-powered interview point generation
        if self.ai_manager:
            try:
                prompt = f"""
                Create interview talking points for this experience:
                
                Context: {car_data.context}
                Action: {car_data.action}  
                Results: {car_data.results}
                
                Focus on:
                - Specific challenges overcome
                - Problem-solving approach
                - Leadership or initiative shown
                - Business impact achieved
                
                Return 3 key talking points as JSON array of strings.
                """
                
                ai_response = await self.ai_manager.process_prompt(prompt)
                if ai_response and 'response' in ai_response:
                    try:
                        ai_points = json.loads(ai_response['response'])
                        if isinstance(ai_points, list):
                            points.extend(ai_points)
                    except json.JSONDecodeError:
                        pass
                        
            except Exception:
                pass
        
        return points


    async def _extract_response_information(
        self, 
        user_response: str, 
        conversation_phase: ROCKETPhase
    ) -> Dict[str, Any]:
        """Extract structured information from user response"""
        extracted = {
            'key_terms': [],
            'entities': [],
            'sentiment': 'neutral',
            'confidence_indicators': []
        }
        
        # Extract key terms (simple keyword extraction)
        words = user_response.lower().split()
        
        # Filter out common words and extract meaningful terms
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were'}
        key_terms = [word for word in words if len(word) > 3 and word not in stop_words]
        extracted['key_terms'] = list(set(key_terms))[:10]  # Top 10 unique terms
        
        # Look for confidence indicators
        confidence_phrases = ['definitely', 'certainly', 'clearly', 'obviously', 'I think', 'maybe', 'perhaps', 'probably']
        for phrase in confidence_phrases:
            if phrase in user_response.lower():
                extracted['confidence_indicators'].append(phrase)
        
        return extracted


    async def _generate_intelligent_followups(
        self, 
        user_response: str,
        missing_elements: List[str], 
        conversation_phase: ROCKETPhase,
        quality_rating: ResponseQuality
    ) -> List[str]:
        """Generate intelligent follow-up questions based on response analysis"""
        followups = []
        
        # Phase-specific follow-up templates
        phase_followups = {
            ROCKETPhase.INTRODUCTION: {
                'current_role': "Can you tell me more about your current role and responsibilities?",
                'experience_level': "How many years of experience do you have in this field?",
                'industry': "What industry or sector do you work in?"
            },
            ROCKETPhase.STORY_EXTRACTION: {
                'who_you_help': "Who specifically do you help or work with in your role?",
                'what_you_achieve': "What specific outcomes or value do you help them achieve?",
                'your_role_identity': "How would you describe your professional identity in one sentence?"
            },
            ROCKETPhase.CAR_ANALYSIS: {
                'context': "Can you provide more context about the situation or challenge you faced?",
                'action': "What specific actions did you take to address this challenge?",
                'results': "What were the specific results or outcomes of your actions?"
            },
            ROCKETPhase.REST_QUANTIFICATION: {
                'quantified_results': "Can you provide any specific numbers, percentages, or metrics for these results?",
                'business_impact': "What was the business impact in terms of revenue, cost savings, or efficiency?",
                'scope': "How many people, teams, or customers were affected by this work?"
            }
        }
        
        # Add follow-ups for missing elements
        phase_templates = phase_followups.get(conversation_phase, {})
        for missing_element in missing_elements:
            if missing_element in phase_templates:
                followups.append(phase_templates[missing_element])
        
        # Quality-based follow-ups
        if quality_rating == ResponseQuality.INSUFFICIENT:
            followups.append("Could you provide a more detailed response? I'd love to hear more specifics about your experience.")
        elif quality_rating == ResponseQuality.NEEDS_FOLLOWUP:
            followups.append("That's a great start! Can you expand on that with some specific examples?")
        
        # AI-powered intelligent follow-ups
        if self.ai_manager and len(followups) < 3:
            try:
                prompt = f"""
                Based on this user response: "{user_response}"
                
                Conversation phase: {conversation_phase.value}
                Missing elements: {missing_elements}
                Quality rating: {quality_rating.value}
                
                Generate 2 intelligent follow-up questions that will help gather more specific, actionable information for resume building.
                
                Requirements:
                - Questions should be conversational and encouraging
                - Focus on extracting quantifiable achievements
                - Help uncover specific details that make great resume content
                
                Return as JSON array of strings.
                """
                
                ai_response = await self.ai_manager.process_prompt(prompt)
                if ai_response and 'response' in ai_response:
                    try:
                        ai_followups = json.loads(ai_response['response'])
                        if isinstance(ai_followups, list):
                            followups.extend(ai_followups)
                    except json.JSONDecodeError:
                        pass
                        
            except Exception:
                pass
        
        return followups[:5]  # Limit to 5 follow-ups


    # Import helper methods from the separate helpers file
    from .rocket_framework_helpers import ROCKETFrameworkHelpers
    
    # Mix in all helper methods
    _analyze_results_metrics = ROCKETFrameworkHelpers._analyze_results_metrics
    _analyze_efficiency_gains = ROCKETFrameworkHelpers._analyze_efficiency_gains
    _analyze_scope_impact = ROCKETFrameworkHelpers._analyze_scope_impact
    _analyze_time_factors = ROCKETFrameworkHelpers._analyze_time_factors
    _calculate_business_impact = ROCKETFrameworkHelpers._calculate_business_impact
    _extract_percentage_improvements = ROCKETFrameworkHelpers._extract_percentage_improvements
    _estimate_people_affected = ROCKETFrameworkHelpers._estimate_people_affected
    _calculate_rest_confidence = ROCKETFrameworkHelpers._calculate_rest_confidence
    _calculate_completeness_score_response = ROCKETFrameworkHelpers._calculate_completeness_score_response
    _calculate_specificity_score = ROCKETFrameworkHelpers._calculate_specificity_score
    _calculate_relevance_score = ROCKETFrameworkHelpers._calculate_relevance_score
    _determine_quality_rating = ROCKETFrameworkHelpers._determine_quality_rating
    _identify_missing_elements = ROCKETFrameworkHelpers._identify_missing_elements