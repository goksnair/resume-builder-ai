"""
ROCKET Framework - Response Quality Intelligence Service
Advanced NLP analysis for response quality scoring and achievement mining
"""

import asyncio
import json
import re
import uuid
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
from dataclasses import dataclass
from enum import Enum
from sqlalchemy.orm import Session

from ..agent.manager import AgentManager
from ..models.conversation import ConversationSession, ConversationMessage
from ..models.personas import PersonaInsight


class ResponseQuality(Enum):
    """Response quality levels"""
    EXCELLENT = "excellent"      # 0.8-1.0
    GOOD = "good"               # 0.6-0.8
    ADEQUATE = "adequate"       # 0.4-0.6
    POOR = "poor"              # 0.0-0.4


@dataclass
class AchievementMining:
    """Structured achievement data"""
    context: str
    action: str
    result: str
    quantification: Optional[str]
    impact_level: str
    confidence_score: float
    raw_text: str


@dataclass
class QualityMetrics:
    """Response quality scoring metrics"""
    clarity_score: float
    specificity_score: float
    achievement_density: float
    quantification_score: float
    overall_score: float
    quality_level: ResponseQuality
    improvement_suggestions: List[str]


class ResponseQualityIntelligence:
    """Advanced NLP analysis for response quality and achievement extraction"""
    
    def __init__(self, db: Session):
        self.db = db
        self.agent_manager = AgentManager(strategy="json", model="gemma3:4b")
        
    async def analyze_response_quality(self, user_response: str, conversation_context: Optional[Dict[str, Any]] = None) -> QualityMetrics:
        """Comprehensive quality analysis of user response - optimized for sub-500ms performance"""
        
        # Pre-process text once for all analyses
        text_lower = user_response.lower()
        words = text_lower.split()
        sentences = self._split_into_sentences(user_response)
        
        # Run optimized synchronous analyses (most are pattern-based)
        clarity = self._analyze_clarity_optimized(user_response, text_lower, words, sentences)
        specificity = self._analyze_specificity_optimized(user_response, text_lower, words)
        achievement_density = self._calculate_achievement_density_optimized(words)
        quantification = self._analyze_quantification_optimized(user_response, text_lower)
        
        # Calculate overall quality score
        overall_score = self._calculate_overall_score(clarity, specificity, achievement_density, quantification)
        quality_level = self._determine_quality_level(overall_score)
        
        # Generate improvement suggestions (optimized synchronous version)
        improvement_suggestions = self._generate_improvement_suggestions_optimized(
            text_lower, words, clarity, specificity, achievement_density, quantification
        )
        
        return QualityMetrics(
            clarity_score=clarity,
            specificity_score=specificity,
            achievement_density=achievement_density,
            quantification_score=quantification,
            overall_score=overall_score,
            quality_level=quality_level,
            improvement_suggestions=improvement_suggestions
        )
    
    async def mine_achievements(self, user_response: str, context: Optional[Dict[str, Any]] = None) -> List[AchievementMining]:
        """Extract and structure achievements from user response"""
        
        # Pattern-based achievement detection
        pattern_achievements = self._extract_pattern_based_achievements(user_response)
        
        # AI-enhanced achievement extraction
        ai_achievements = await self._extract_ai_achievements(user_response, context)
        
        # Combine and deduplicate achievements
        all_achievements = pattern_achievements + ai_achievements
        deduplicated_achievements = self._deduplicate_achievements(all_achievements)
        
        # Score and rank achievements
        scored_achievements = []
        for achievement in deduplicated_achievements:
            confidence_score = await self._score_achievement_confidence(achievement)
            achievement.confidence_score = confidence_score
            scored_achievements.append(achievement)
        
        # Sort by confidence and return top achievements
        scored_achievements.sort(key=lambda x: x.confidence_score, reverse=True)
        return scored_achievements[:5]  # Return top 5 achievements
    
    async def generate_follow_up_intelligence(self, response_quality: QualityMetrics, achievements: List[AchievementMining]) -> Dict[str, Any]:
        """Generate intelligent follow-up questions based on quality analysis"""
        
        follow_ups = []
        
        # Quality-based follow-ups
        if response_quality.clarity_score < 0.6:
            follow_ups.extend([
                "Could you provide more specific details about your role and responsibilities?",
                "What were the key challenges you faced in this situation?"
            ])
        
        if response_quality.quantification_score < 0.5:
            follow_ups.extend([
                "Can you quantify the impact of your work with specific numbers or percentages?",
                "What measurable results did you achieve?"
            ])
        
        # Achievement-based follow-ups
        for achievement in achievements[:2]:  # Top 2 achievements
            if achievement.quantification:
                follow_ups.append(f"You mentioned {achievement.quantification} - can you tell me more about how you achieved this result?")
            else:
                follow_ups.append(f"Regarding your work on {achievement.action.lower()}, what specific metrics show your success?")
        
        # AI-generated contextual follow-ups
        ai_follow_ups = await self._generate_ai_follow_ups(response_quality, achievements)
        follow_ups.extend(ai_follow_ups[:2])
        
        return {
            "follow_up_questions": follow_ups[:4],  # Return top 4
            "quality_insights": {
                "strengths": self._identify_response_strengths(response_quality),
                "improvement_areas": response_quality.improvement_suggestions[:2]
            },
            "achievement_potential": {
                "identified_achievements": len(achievements),
                "high_confidence_achievements": len([a for a in achievements if a.confidence_score > 0.7]),
                "missing_quantification": len([a for a in achievements if not a.quantification])
            }
        }
    
    async def _analyze_clarity(self, text: str) -> float:
        """Analyze response clarity and coherence"""
        clarity_score = 0.5  # baseline
        
        # Sentence structure analysis
        sentences = self._split_into_sentences(text)
        if not sentences:
            return 0.0
        
        avg_sentence_length = sum(len(s.split()) for s in sentences) / len(sentences)
        
        # Optimal sentence length (12-20 words)
        if 12 <= avg_sentence_length <= 20:
            clarity_score += 0.2
        elif avg_sentence_length > 30:
            clarity_score -= 0.1
        
        # Coherence indicators
        coherence_words = ["because", "therefore", "however", "additionally", "furthermore", "consequently", "as a result"]
        coherence_count = sum(1 for word in coherence_words if word in text.lower())
        clarity_score += min(0.2, coherence_count * 0.05)
        
        # Specific examples
        example_indicators = ["for example", "such as", "specifically", "in particular", "for instance"]
        if any(indicator in text.lower() for indicator in example_indicators):
            clarity_score += 0.1
        
        # Avoid excessive filler words
        filler_words = ["um", "uh", "like", "you know", "basically", "actually", "literally"]
        filler_count = sum(text.lower().count(word) for word in filler_words)
        if filler_count > 3:
            clarity_score -= 0.1
        
        return min(1.0, max(0.0, clarity_score))
    
    async def _analyze_specificity(self, text: str) -> float:
        """Analyze how specific and detailed the response is"""
        specificity_score = 0.4  # baseline
        
        # Named entities and proper nouns
        proper_nouns = len(re.findall(r'\b[A-Z][a-z]+', text))
        specificity_score += min(0.2, proper_nouns * 0.02)
        
        # Numbers and metrics
        numbers = len(re.findall(r'\b\d+(?:\.\d+)?(?:%|k|million|billion)?\b', text))
        specificity_score += min(0.2, numbers * 0.05)
        
        # Technical terms and domain-specific language
        technical_indicators = ["implemented", "developed", "optimized", "analyzed", "managed", "designed", "executed"]
        technical_count = sum(1 for word in technical_indicators if word in text.lower())
        specificity_score += min(0.15, technical_count * 0.03)
        
        # Time indicators
        time_indicators = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december", "2020", "2021", "2022", "2023", "2024", "q1", "q2", "q3", "q4"]
        if any(indicator in text.lower() for indicator in time_indicators):
            specificity_score += 0.1
        
        # Company or project names
        if any(word.isupper() and len(word) > 2 for word in text.split()):
            specificity_score += 0.1
        
        return min(1.0, max(0.0, specificity_score))
    
    async def _calculate_achievement_density(self, text: str) -> float:
        """Calculate density of achievement-related content"""
        achievement_words = [
            "achieved", "accomplished", "delivered", "completed", "succeeded",
            "improved", "increased", "reduced", "decreased", "optimized",
            "created", "developed", "built", "designed", "implemented",
            "led", "managed", "coordinated", "supervised", "mentored",
            "won", "earned", "gained", "saved", "generated"
        ]
        
        words = text.lower().split()
        if not words:
            return 0.0
        
        achievement_count = sum(1 for word in words if any(ach in word for ach in achievement_words))
        density = achievement_count / len(words)
        
        # Normalize to 0-1 scale (assuming good density is around 0.1)
        return min(1.0, density * 10)
    
    async def _analyze_quantification(self, text: str) -> float:
        """Analyze presence and quality of quantifiable metrics"""
        quantification_score = 0.0
        
        # Numbers with units
        number_patterns = [
            r'\b\d+(?:\.\d+)?%',  # Percentages
            r'\$\d+(?:,\d{3})*(?:\.\d{2})?(?:k|m|b)?',  # Money
            r'\b\d+(?:,\d{3})*\s*(?:hours?|days?|weeks?|months?|years?)',  # Time
            r'\b\d+(?:,\d{3})*\s*(?:people|users|customers|clients|employees)',  # People
            r'\b\d+(?:\.\d+)?x\b',  # Multipliers
            r'\b\d+(?:,\d{3})*\s*(?:projects?|tasks?|initiatives?)',  # Quantities
        ]
        
        for pattern in number_patterns:
            matches = len(re.findall(pattern, text, re.IGNORECASE))
            quantification_score += min(0.2, matches * 0.1)
        
        # Impact words with numbers
        impact_with_numbers = re.findall(r'(?:increased|decreased|improved|reduced|saved|generated|created)\s+(?:by\s+)?\d+', text, re.IGNORECASE)
        quantification_score += min(0.3, len(impact_with_numbers) * 0.15)
        
        # Time-bound achievements
        time_bound = re.findall(r'(?:in|within|over|during)\s+\d+\s*(?:hours?|days?|weeks?|months?|years?)', text, re.IGNORECASE)
        quantification_score += min(0.2, len(time_bound) * 0.1)
        
        return min(1.0, quantification_score)
    
    def _calculate_overall_score(self, clarity: float, specificity: float, achievement_density: float, quantification: float) -> float:
        """Calculate weighted overall quality score"""
        weights = {
            "clarity": 0.25,
            "specificity": 0.25,
            "achievement_density": 0.30,
            "quantification": 0.20
        }
        
        overall = (
            clarity * weights["clarity"] +
            specificity * weights["specificity"] +
            achievement_density * weights["achievement_density"] +
            quantification * weights["quantification"]
        )
        
        return round(overall, 3)
    
    def _determine_quality_level(self, overall_score: float) -> ResponseQuality:
        """Determine quality level from overall score"""
        if overall_score >= 0.8:
            return ResponseQuality.EXCELLENT
        elif overall_score >= 0.6:
            return ResponseQuality.GOOD
        elif overall_score >= 0.4:
            return ResponseQuality.ADEQUATE
        else:
            return ResponseQuality.POOR
    
    async def _generate_improvement_suggestions(self, text: str, clarity: float, specificity: float, achievement_density: float, quantification: float) -> List[str]:
        """Generate specific improvement suggestions"""
        suggestions = []
        
        if clarity < 0.6:
            suggestions.append("Use clearer sentence structure and logical connectors like 'because', 'therefore', and 'as a result'")
        
        if specificity < 0.5:
            suggestions.append("Include specific company names, project titles, technologies, and timeframes")
        
        if achievement_density < 0.3:
            suggestions.append("Focus more on your accomplishments using action verbs like 'achieved', 'delivered', and 'improved'")
        
        if quantification < 0.4:
            suggestions.append("Add specific numbers, percentages, dollar amounts, or measurable outcomes")
        
        if len(text.split()) < 50:
            suggestions.append("Provide more detailed examples with context about your role and impact")
        
        # AI-enhanced suggestions
        ai_suggestions = await self._generate_ai_improvement_suggestions(text, clarity, specificity, achievement_density, quantification)
        suggestions.extend(ai_suggestions[:2])
        
        return suggestions[:4]  # Return top 4 suggestions
    
    def _extract_pattern_based_achievements(self, text: str) -> List[AchievementMining]:
        """Extract achievements using pattern matching"""
        achievements = []
        
        # CAR pattern (Context-Action-Result)
        car_patterns = [
            r'(?:in|at|during|while)\s+([^,.]+)[,.]?\s*(?:i|we)\s+([^,.]+)[,.]?\s*(?:resulting|leading|which led)\s+(?:to|in)\s+([^,.]+)',
            r'([^,.]+)\s+(?:challenge|situation|problem)[,.]?\s*(?:i|we)\s+([^,.]+)[,.]?\s*(?:and|which|resulting in)\s+([^,.]+)'
        ]
        
        for pattern in car_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                if len(match) == 3:
                    context, action, result = match
                    
                    # Extract quantification from result
                    quantification = self._extract_quantification_from_text(result)
                    
                    achievement = AchievementMining(
                        context=context.strip(),
                        action=action.strip(),
                        result=result.strip(),
                        quantification=quantification,
                        impact_level=self._determine_impact_level(result),
                        confidence_score=0.0,  # Will be scored later
                        raw_text=f"{context} {action} {result}"
                    )
                    achievements.append(achievement)
        
        # Simple achievement patterns
        achievement_patterns = [
            r'(?:i|we)\s+(achieved|accomplished|delivered|completed|improved|increased|reduced|created|developed|built|led|managed)\s+([^,.]+?)(?:by|with|resulting in|which led to)\s+([^,.]+)',
            r'(achieved|accomplished|delivered|completed|improved|increased|reduced|created|developed|built|led|managed)\s+([^,.]+?)\s+(?:by|with|of|to)\s+(\d+(?:\.\d+)?(?:%|x|k|m|million|billion|\$)?)'
        ]
        
        for pattern in achievement_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if len(match) >= 2:
                    action = match[0]
                    description = match[1]
                    result = match[2] if len(match) > 2 else ""
                    
                    achievement = AchievementMining(
                        context="Professional work",  # Default context
                        action=f"{action} {description}".strip(),
                        result=result.strip() if result else description.strip(),
                        quantification=self._extract_quantification_from_text(result if result else description),
                        impact_level=self._determine_impact_level(result if result else description),
                        confidence_score=0.0,
                        raw_text=" ".join(match)
                    )
                    achievements.append(achievement)
        
        return achievements
    
    async def _extract_ai_achievements(self, text: str, context: Optional[Dict[str, Any]] = None) -> List[AchievementMining]:
        """Use AI to extract achievements from text"""
        
        prompt = f"""Analyze this text for professional achievements and accomplishments:

Text: "{text}"

Extract achievements using the CAR (Context-Action-Result) framework. For each achievement, identify:
1. Context: The situation or background
2. Action: What was done
3. Result: The outcome or impact
4. Quantification: Any numbers, percentages, or measurable outcomes

Return as JSON array with format:
[{{"context": "...", "action": "...", "result": "...", "quantification": "...", "impact_level": "high/medium/low"}}]

Focus on concrete accomplishments with measurable impact."""

        try:
            ai_result = await self.agent_manager.run(prompt)
            ai_achievements = ai_result.get("content", [])
            
            achievements = []
            for ai_ach in ai_achievements:
                if isinstance(ai_ach, dict) and all(key in ai_ach for key in ["context", "action", "result"]):
                    achievement = AchievementMining(
                        context=ai_ach["context"],
                        action=ai_ach["action"],
                        result=ai_ach["result"],
                        quantification=ai_ach.get("quantification"),
                        impact_level=ai_ach.get("impact_level", "medium"),
                        confidence_score=0.0,
                        raw_text=f"{ai_ach['context']} {ai_ach['action']} {ai_ach['result']}"
                    )
                    achievements.append(achievement)
            
            return achievements
            
        except Exception as e:
            return []  # Fallback to pattern-based extraction only
    
    def _extract_quantification_from_text(self, text: str) -> Optional[str]:
        """Extract quantification from text"""
        quantification_patterns = [
            r'\d+(?:\.\d+)?%',
            r'\$\d+(?:,\d{3})*(?:\.\d{2})?(?:k|m|b)?',
            r'\d+(?:,\d{3})*\s*(?:hours?|days?|weeks?|months?|years?)',
            r'\d+(?:,\d{3})*\s*(?:people|users|customers|clients|employees)',
            r'\d+(?:\.\d+)?x',
            r'\d+(?:,\d{3})*\s*(?:projects?|tasks?|initiatives?)'
        ]
        
        for pattern in quantification_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(0)
        
        return None
    
    def _determine_impact_level(self, text: str) -> str:
        """Determine impact level from text"""
        high_impact_words = ["significant", "major", "substantial", "dramatic", "revolutionary", "breakthrough"]
        medium_impact_words = ["improved", "enhanced", "increased", "optimized", "streamlined"]
        
        text_lower = text.lower()
        
        if any(word in text_lower for word in high_impact_words):
            return "high"
        elif any(word in text_lower for word in medium_impact_words):
            return "medium"
        else:
            return "low"
    
    def _deduplicate_achievements(self, achievements: List[AchievementMining]) -> List[AchievementMining]:
        """Remove duplicate achievements"""
        seen_actions = set()
        unique_achievements = []
        
        for achievement in achievements:
            action_key = achievement.action.lower().strip()
            if action_key not in seen_actions:
                seen_actions.add(action_key)
                unique_achievements.append(achievement)
        
        return unique_achievements
    
    async def _score_achievement_confidence(self, achievement: AchievementMining) -> float:
        """Score confidence level of extracted achievement"""
        confidence = 0.5  # baseline
        
        # Context specificity
        if len(achievement.context.split()) > 3:
            confidence += 0.1
        
        # Action verb strength
        strong_verbs = ["achieved", "delivered", "improved", "increased", "reduced", "created", "led", "managed"]
        if any(verb in achievement.action.lower() for verb in strong_verbs):
            confidence += 0.2
        
        # Result specificity
        if achievement.quantification:
            confidence += 0.2
        
        # Impact level
        if achievement.impact_level == "high":
            confidence += 0.1
        elif achievement.impact_level == "medium":
            confidence += 0.05
        
        # Text length (more detailed = higher confidence)
        if len(achievement.raw_text.split()) > 10:
            confidence += 0.1
        
        return min(1.0, confidence)
    
    async def _generate_ai_follow_ups(self, quality: QualityMetrics, achievements: List[AchievementMining]) -> List[str]:
        """Generate AI-enhanced follow-up questions"""
        
        prompt = f"""Based on this response quality analysis and achievements, generate 2 intelligent follow-up questions:

Quality Analysis:
- Clarity: {quality.clarity_score}
- Specificity: {quality.specificity_score}  
- Achievement Density: {quality.achievement_density}
- Quantification: {quality.quantification_score}
- Overall: {quality.overall_score}

Top Achievements:
{json.dumps([{{"action": a.action, "result": a.result, "quantification": a.quantification} for a in achievements[:2]], indent=2)}

Generate follow-up questions that:
1. Address the lowest scoring quality areas
2. Dig deeper into the most promising achievements
3. Extract more quantifiable details

Return as JSON array of strings."""

        try:
            ai_result = await self.agent_manager.run(prompt)
            follow_ups = ai_result.get("content", [])
            return follow_ups if isinstance(follow_ups, list) else []
        except Exception as e:
            return []
    
    async def _generate_ai_improvement_suggestions(self, text: str, clarity: float, specificity: float, achievement_density: float, quantification: float) -> List[str]:
        """Generate AI-enhanced improvement suggestions"""
        
        prompt = f"""Analyze this response and provide specific improvement suggestions:

Response: "{text[:200]}..."

Quality Scores:
- Clarity: {clarity}
- Specificity: {specificity}
- Achievement Density: {achievement_density}
- Quantification: {quantification}

Provide 2 specific, actionable suggestions to improve the response quality. Focus on the lowest scoring areas.

Return as JSON array of strings."""

        try:
            ai_result = await self.agent_manager.run(prompt)
            suggestions = ai_result.get("content", [])
            return suggestions if isinstance(suggestions, list) else []
        except Exception as e:
            return []
    
    def _identify_response_strengths(self, quality: QualityMetrics) -> List[str]:
        """Identify strengths in the response"""
        strengths = []
        
        if quality.clarity_score >= 0.7:
            strengths.append("Clear and well-structured communication")
        
        if quality.specificity_score >= 0.7:
            strengths.append("Specific details and concrete examples")
        
        if quality.achievement_density >= 0.5:
            strengths.append("Strong focus on accomplishments and results")
        
        if quality.quantification_score >= 0.6:
            strengths.append("Good use of quantifiable metrics and data")
        
        if not strengths:
            strengths.append("Provides relevant professional experience")
        
        return strengths
    
    def _split_into_sentences(self, text: str) -> List[str]:
        """Split text into sentences"""
        # Simple sentence splitting
        sentences = re.split(r'[.!?]+', text)
        return [s.strip() for s in sentences if s.strip()]
    
    # PERFORMANCE OPTIMIZED METHODS FOR SUB-500MS TARGET
    
    def _analyze_clarity_optimized(self, text: str, text_lower: str, words: List[str], sentences: List[str]) -> float:
        """Optimized clarity analysis"""
        if not sentences:
            return 0.0
        
        clarity_score = 0.5  # baseline
        
        # Sentence structure analysis
        avg_sentence_length = sum(len(s.split()) for s in sentences) / len(sentences)
        
        # Optimal sentence length (12-20 words)
        if 12 <= avg_sentence_length <= 20:
            clarity_score += 0.2
        elif avg_sentence_length > 30:
            clarity_score -= 0.1
        
        # Coherence indicators (pre-compiled for performance)
        coherence_words = {"because", "therefore", "however", "additionally", "furthermore", "consequently", "as a result"}
        coherence_count = sum(1 for word in words if word in coherence_words)
        clarity_score += min(0.2, coherence_count * 0.05)
        
        # Specific examples
        if any(indicator in text_lower for indicator in ["for example", "such as", "specifically", "in particular", "for instance"]):
            clarity_score += 0.1
        
        # Avoid excessive filler words
        filler_words = {"um", "uh", "like", "you", "know", "basically", "actually", "literally"}
        filler_count = sum(words.count(word) for word in filler_words)
        if filler_count > 3:
            clarity_score -= 0.1
        
        return min(1.0, max(0.0, clarity_score))
    
    def _analyze_specificity_optimized(self, text: str, text_lower: str, words: List[str]) -> float:
        """Optimized specificity analysis"""
        specificity_score = 0.4  # baseline
        
        # Named entities and proper nouns (optimized regex)
        proper_nouns = len(re.findall(r'\b[A-Z][a-z]+', text))
        specificity_score += min(0.2, proper_nouns * 0.02)
        
        # Numbers and metrics (pre-compiled regex)
        numbers = len(re.findall(r'\b\d+(?:\.\d+)?(?:%|k|million|billion)?\b', text))
        specificity_score += min(0.2, numbers * 0.05)
        
        # Technical terms (set lookup for performance)
        technical_words = {"implemented", "developed", "optimized", "analyzed", "managed", "designed", "executed"}
        technical_count = sum(1 for word in words if word in technical_words)
        specificity_score += min(0.15, technical_count * 0.03)
        
        # Time indicators (set lookup)
        time_words = {"january", "february", "march", "april", "may", "june", "july", "august", 
                     "september", "october", "november", "december", "2020", "2021", "2022", "2023", "2024", "q1", "q2", "q3", "q4"}
        if any(word in words for word in time_words):
            specificity_score += 0.1
        
        # Company or project names (simplified check)
        if any(word.isupper() and len(word) > 2 for word in text.split()):
            specificity_score += 0.1
        
        return min(1.0, max(0.0, specificity_score))
    
    def _calculate_achievement_density_optimized(self, words: List[str]) -> float:
        """Optimized achievement density calculation"""
        if not words:
            return 0.0
        
        # Pre-compiled achievement word set for O(1) lookup
        achievement_words = {
            "achieved", "accomplished", "delivered", "completed", "succeeded",
            "improved", "increased", "reduced", "decreased", "optimized",
            "created", "developed", "built", "designed", "implemented",
            "led", "managed", "coordinated", "supervised", "mentored",
            "won", "earned", "gained", "saved", "generated"
        }
        
        achievement_count = sum(1 for word in words if word in achievement_words)
        density = achievement_count / len(words)
        
        # Normalize to 0-1 scale
        return min(1.0, density * 10)
    
    def _analyze_quantification_optimized(self, text: str, text_lower: str) -> float:
        """Optimized quantification analysis"""
        quantification_score = 0.0
        
        # Pre-compiled patterns for performance
        number_patterns = [
            (r'\b\d+(?:\.\d+)?%', 0.2),  # Percentages
            (r'\$\d+(?:,\d{3})*(?:\.\d{2})?(?:k|m|b)?', 0.2),  # Money
            (r'\b\d+(?:,\d{3})*\s*(?:hours?|days?|weeks?|months?|years?)', 0.15),  # Time
            (r'\b\d+(?:,\d{3})*\s*(?:people|users|customers|clients|employees)', 0.15),  # People
            (r'\b\d+(?:\.\d+)?x\b', 0.15),  # Multipliers
            (r'\b\d+(?:,\d{3})*\s*(?:projects?|tasks?|initiatives?)', 0.1),  # Quantities
        ]
        
        for pattern, weight in number_patterns:
            matches = len(re.findall(pattern, text, re.IGNORECASE))
            quantification_score += min(weight, matches * 0.1)
        
        # Impact words with numbers (single regex for performance)
        impact_with_numbers = len(re.findall(r'(?:increased|decreased|improved|reduced|saved|generated|created)\s+(?:by\s+)?\d+', text, re.IGNORECASE))
        quantification_score += min(0.3, impact_with_numbers * 0.15)
        
        # Time-bound achievements
        time_bound = len(re.findall(r'(?:in|within|over|during)\s+\d+\s*(?:hours?|days?|weeks?|months?|years?)', text, re.IGNORECASE))
        quantification_score += min(0.2, time_bound * 0.1)
        
        return min(1.0, quantification_score)
    
    def _generate_improvement_suggestions_optimized(self, text_lower: str, words: List[str], clarity: float, specificity: float, achievement_density: float, quantification: float) -> List[str]:
        """Optimized improvement suggestions generation"""
        suggestions = []
        
        if clarity < 0.6:
            suggestions.append("Use clearer sentence structure and logical connectors like 'because', 'therefore', and 'as a result'")
        
        if specificity < 0.5:
            suggestions.append("Include specific company names, project titles, technologies, and timeframes")
        
        if achievement_density < 0.3:
            suggestions.append("Focus more on your accomplishments using action verbs like 'achieved', 'delivered', and 'improved'")
        
        if quantification < 0.4:
            suggestions.append("Add specific numbers, percentages, dollar amounts, or measurable outcomes")
        
        if len(words) < 50:
            suggestions.append("Provide more detailed examples with context about your role and impact")
        
        return suggestions[:4]  # Return top 4 suggestions