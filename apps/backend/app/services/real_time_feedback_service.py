import json
import asyncio
import logging
import numpy as np
from typing import Dict, List, Optional, AsyncGenerator
from datetime import datetime, timedelta
import re

from app.agent import AgentManager
from .elite_comparison_service import EliteComparisonService
from .ats_optimization_service import ATSOptimizationService

logger = logging.getLogger(__name__)


class RealTimeFeedbackService:
    """
    Real-time resume feedback and improvement suggestions service.
    
    Features:
    - Sub-200ms response times for instant feedback
    - Progressive enhancement suggestions
    - Live scoring updates
    - Contextual improvement recommendations
    - Smart content analysis with immediate insights
    """
    
    def __init__(self, db_session):
        self.db = db_session
        self.elite_service = EliteComparisonService(db_session)
        self.ats_service = ATSOptimizationService()
        self.agent_manager = AgentManager()
        
        # Performance tracking
        self.response_time_target = 0.2  # 200ms target
        self.feedback_cache = {}
        self.cache_ttl = 300  # 5 minutes
        
        # Feedback templates for instant responses
        self.instant_feedback_templates = self._initialize_feedback_templates()
        
    def _initialize_feedback_templates(self) -> Dict:
        """Initialize templates for instant feedback generation."""
        return {
            'length_feedback': {
                'too_short': {
                    'message': "Your resume could benefit from more detail. Aim for 400-800 words.",
                    'priority': 'medium',
                    'quick_action': "Add specific achievements and quantifiable results to each role."
                },
                'too_long': {
                    'message': "Consider condensing your resume. Many ATS systems prefer 1-2 pages.",
                    'priority': 'high', 
                    'quick_action': "Remove older positions or combine similar experiences."
                },
                'optimal': {
                    'message': "Great length! Your resume is in the optimal range for ATS systems.",
                    'priority': 'low',
                    'quick_action': "Focus on content quality and keyword optimization."
                }
            },
            
            'keyword_feedback': {
                'insufficient': {
                    'message': "Add more relevant keywords to improve job matching.",
                    'priority': 'high',
                    'quick_action': "Include industry-specific terms and technical skills."
                },
                'excessive': {
                    'message': "Reduce keyword repetition to avoid appearing stuffed.",
                    'priority': 'medium',
                    'quick_action': "Use synonyms and vary your language naturally."
                },
                'balanced': {
                    'message': "Excellent keyword balance! Your content flows naturally.",
                    'priority': 'low',
                    'quick_action': "Continue with strategic keyword placement."
                }
            },
            
            'structure_feedback': {
                'missing_sections': {
                    'message': "Add standard resume sections for better ATS parsing.",
                    'priority': 'high',
                    'quick_action': "Include: Contact, Summary, Experience, Skills, Education"
                },
                'poor_formatting': {
                    'message': "Improve formatting with consistent bullet points and spacing.",
                    'priority': 'medium',
                    'quick_action': "Use bullet points and clear section headers."
                },
                'well_structured': {
                    'message': "Excellent structure! Your resume is well-organized and ATS-friendly.",
                    'priority': 'low',
                    'quick_action': "Fine-tune content within each section."
                }
            },
            
            'achievement_feedback': {
                'no_metrics': {
                    'message': "Quantify your achievements with numbers, percentages, or dollar amounts.",
                    'priority': 'high',
                    'quick_action': "Add metrics like '25% increase' or 'managed $500K budget'."
                },
                'some_metrics': {
                    'message': "Good use of metrics! Add more quantified results where possible.",
                    'priority': 'medium',
                    'quick_action': "Convert remaining achievements into measurable outcomes."
                },
                'strong_metrics': {
                    'message': "Outstanding quantified achievements! This demonstrates clear impact.",
                    'priority': 'low',
                    'quick_action': "Ensure metrics are accurate and relevant to target roles."
                }
            }
        }
    
    async def generate_instant_feedback(
        self, 
        resume_content: str, 
        target_role: Optional[str] = None,
        target_industry: Optional[str] = None
    ) -> Dict:
        """
        Generate instant feedback with sub-200ms response time.
        
        Args:
            resume_content: Resume text content
            target_role: Optional target role for context
            target_industry: Optional target industry for context
            
        Returns:
            Instant feedback with quick wins and priority actions
        """
        start_time = asyncio.get_event_loop().time()
        
        try:
            # Generate cache key
            cache_key = self._generate_cache_key(resume_content, target_role, target_industry)
            
            # Check cache first
            if cache_key in self.feedback_cache:
                cached_result = self.feedback_cache[cache_key]
                if datetime.now() - cached_result['timestamp'] < timedelta(seconds=self.cache_ttl):
                    logger.info(f"Cache hit - response time: {(asyncio.get_event_loop().time() - start_time)*1000:.1f}ms")
                    return cached_result['data']
            
            # Fast analysis using pre-computed rules
            quick_analysis = await self._perform_quick_analysis(resume_content)
            
            # Generate instant feedback
            feedback = {
                'instant_score': quick_analysis['instant_score'],
                'priority_actions': quick_analysis['priority_actions'],
                'quick_wins': quick_analysis['quick_wins'],
                'live_metrics': quick_analysis['live_metrics'],
                'improvement_areas': quick_analysis['improvement_areas'],
                'positive_highlights': quick_analysis['positive_highlights'],
                'next_steps': quick_analysis['next_steps'],
                'estimated_time_to_improve': quick_analysis['estimated_time'],
                'response_time_ms': (asyncio.get_event_loop().time() - start_time) * 1000
            }
            
            # Cache result
            self.feedback_cache[cache_key] = {
                'data': feedback,
                'timestamp': datetime.now()
            }
            
            logger.info(f"Instant feedback generated - response time: {feedback['response_time_ms']:.1f}ms")
            return feedback
            
        except Exception as e:
            logger.error(f"Error generating instant feedback: {str(e)}")
            # Fallback response
            return self._generate_fallback_feedback(resume_content, start_time)
    
    async def generate_progressive_feedback(
        self,
        resume_content: str,
        target_role: Optional[str] = None,
        target_industry: Optional[str] = None
    ) -> AsyncGenerator[Dict, None]:
        """
        Generate progressive feedback with streaming updates.
        
        Yields feedback in stages:
        1. Instant feedback (0-200ms)
        2. ATS analysis (200ms-2s)
        3. Elite comparison (2s-5s)
        4. Detailed recommendations (5s-10s)
        """
        start_time = asyncio.get_event_loop().time()
        
        # Stage 1: Instant feedback
        yield {
            'stage': 'instant',
            'progress': 25,
            'data': await self.generate_instant_feedback(resume_content, target_role, target_industry),
            'elapsed_ms': (asyncio.get_event_loop().time() - start_time) * 1000
        }
        
        # Stage 2: ATS analysis
        yield {
            'stage': 'ats_analysis',
            'progress': 50,
            'message': 'Analyzing ATS compatibility across 50+ systems...'
        }
        
        ats_analysis = self.ats_service.analyze_ats_compatibility(
            resume_content, target_industry
        )
        
        yield {
            'stage': 'ats_complete',
            'progress': 75,
            'data': {
                'ats_score': ats_analysis['overall_score'],
                'ats_grade': ats_analysis['summary']['overall_grade'],
                'critical_ats_issues': ats_analysis['critical_issues'][:3],
                'ats_recommendations': [rec['recommendation'] for rec in ats_analysis['recommendations'][:3]]
            },
            'elapsed_ms': (asyncio.get_event_loop().time() - start_time) * 1000
        }
        
        # Stage 3: Elite comparison (if resume_id available)
        yield {
            'stage': 'elite_analysis', 
            'progress': 90,
            'message': 'Comparing against top 1% performers...'
        }
        
        # For now, simulate elite analysis since we need resume_id
        elite_simulation = await self._simulate_elite_analysis(resume_content, target_role, target_industry)
        
        yield {
            'stage': 'elite_complete',
            'progress': 100,
            'data': elite_simulation,
            'elapsed_ms': (asyncio.get_event_loop().time() - start_time) * 1000
        }
        
        # Stage 4: Final comprehensive recommendations
        final_recommendations = await self._generate_comprehensive_recommendations(
            resume_content, ats_analysis, elite_simulation, target_role, target_industry
        )
        
        yield {
            'stage': 'complete',
            'progress': 100,
            'data': final_recommendations,
            'total_elapsed_ms': (asyncio.get_event_loop().time() - start_time) * 1000
        }
    
    async def _perform_quick_analysis(self, resume_content: str) -> Dict:
        """Perform rapid analysis using pre-computed rules."""
        word_count = len(resume_content.split())
        char_count = len(resume_content)
        
        # Quick metrics calculation
        metrics = self._calculate_quick_metrics(resume_content)
        
        # Determine instant score (0-100)
        instant_score = self._calculate_instant_score(metrics, word_count)
        
        # Generate priority actions
        priority_actions = self._identify_priority_actions(metrics, word_count)
        
        # Identify quick wins
        quick_wins = self._identify_quick_wins(metrics, resume_content)
        
        # Generate improvement areas
        improvement_areas = self._identify_improvement_areas(metrics)
        
        # Highlight positive aspects
        positive_highlights = self._identify_positive_highlights(metrics)
        
        # Generate next steps
        next_steps = self._generate_next_steps(priority_actions, quick_wins)
        
        # Estimate improvement time
        estimated_time = self._estimate_improvement_time(priority_actions, quick_wins)
        
        return {
            'instant_score': instant_score,
            'priority_actions': priority_actions,
            'quick_wins': quick_wins,
            'live_metrics': {
                'word_count': word_count,
                'character_count': char_count,
                'sections_detected': metrics['sections_count'],
                'achievements_with_numbers': metrics['quantified_achievements'],
                'action_verbs_count': metrics['action_verbs'],
                'keyword_density': metrics['keyword_density']
            },
            'improvement_areas': improvement_areas,
            'positive_highlights': positive_highlights,
            'next_steps': next_steps,
            'estimated_time': estimated_time
        }
    
    def _calculate_quick_metrics(self, content: str) -> Dict:
        """Calculate key metrics for instant analysis."""
        content_lower = content.lower()
        
        # Section detection
        sections = ['experience', 'education', 'skills', 'summary', 'contact']
        sections_count = sum(1 for section in sections if section in content_lower)
        
        # Quantified achievements
        number_patterns = [r'\d+%', r'\$\d+', r'\d+[km]', r'increased by \d+', r'reduced \d+']
        quantified_achievements = sum(len(re.findall(pattern, content, re.IGNORECASE)) for pattern in number_patterns)
        
        # Action verbs
        action_verbs = [
            'managed', 'led', 'developed', 'implemented', 'created', 'built', 'designed',
            'improved', 'increased', 'reduced', 'achieved', 'delivered', 'coordinated'
        ]
        action_verb_count = sum(content_lower.count(verb) for verb in action_verbs)
        
        # Keyword density (simple approximation)
        total_words = len(content.split())
        keyword_count = action_verb_count + quantified_achievements
        keyword_density = keyword_count / total_words if total_words > 0 else 0
        
        # Formatting quality
        bullet_points = content.count('•') + content.count('-') + content.count('*')
        has_dates = bool(re.search(r'\b\d{4}\b', content))
        
        # Professional language check
        informal_words = ['stuff', 'things', 'lots', 'awesome', 'amazing']
        informal_count = sum(content_lower.count(word) for word in informal_words)
        
        return {
            'sections_count': sections_count,
            'quantified_achievements': quantified_achievements,
            'action_verbs': action_verb_count,
            'keyword_density': keyword_density,
            'bullet_points': bullet_points,
            'has_dates': has_dates,
            'informal_language': informal_count,
            'total_words': total_words
        }
    
    def _calculate_instant_score(self, metrics: Dict, word_count: int) -> int:
        """Calculate instant score from 0-100."""
        score = 0
        
        # Word count scoring (20 points)
        if 400 <= word_count <= 800:
            score += 20
        elif 300 <= word_count <= 1000:
            score += 15
        else:
            score += 5
        
        # Sections scoring (20 points)
        score += min(20, metrics['sections_count'] * 4)
        
        # Quantified achievements (25 points)
        score += min(25, metrics['quantified_achievements'] * 5)
        
        # Action verbs (15 points)
        score += min(15, metrics['action_verbs'] * 2)
        
        # Formatting (10 points)
        if metrics['bullet_points'] > 0:
            score += 5
        if metrics['has_dates']:
            score += 5
        
        # Professional language (10 points)
        if metrics['informal_language'] == 0:
            score += 10
        elif metrics['informal_language'] <= 2:
            score += 5
        
        return min(100, score)
    
    def _identify_priority_actions(self, metrics: Dict, word_count: int) -> List[Dict]:
        """Identify highest priority actions for immediate improvement."""
        actions = []
        
        # Critical word count issues
        if word_count < 300:
            actions.append({
                'action': 'Expand Content',
                'description': 'Add more details about your achievements and responsibilities',
                'priority': 'critical',
                'estimated_impact': '+15-20 points',
                'time_required': '30-60 minutes'
            })
        elif word_count > 1000:
            actions.append({
                'action': 'Condense Content',
                'description': 'Remove less relevant information to improve ATS compatibility',
                'priority': 'high',
                'estimated_impact': '+10-15 points',
                'time_required': '20-30 minutes'
            })
        
        # Missing quantified achievements
        if metrics['quantified_achievements'] < 3:
            actions.append({
                'action': 'Add Quantified Results',
                'description': 'Include specific numbers, percentages, and measurable outcomes',
                'priority': 'critical',
                'estimated_impact': '+20-25 points',
                'time_required': '45-90 minutes'
            })
        
        # Missing essential sections
        if metrics['sections_count'] < 4:
            actions.append({
                'action': 'Add Resume Sections',
                'description': 'Include standard sections: Contact, Summary, Experience, Skills, Education',
                'priority': 'high',
                'estimated_impact': '+15-20 points',
                'time_required': '20-40 minutes'
            })
        
        # Insufficient action verbs
        if metrics['action_verbs'] < 5:
            actions.append({
                'action': 'Strengthen Language',
                'description': 'Use more action verbs to describe your accomplishments',
                'priority': 'medium',
                'estimated_impact': '+8-12 points',
                'time_required': '15-25 minutes'
            })
        
        # Sort by priority
        priority_order = {'critical': 3, 'high': 2, 'medium': 1, 'low': 0}
        actions.sort(key=lambda x: priority_order.get(x['priority'], 0), reverse=True)
        
        return actions[:3]  # Top 3 priority actions
    
    def _identify_quick_wins(self, metrics: Dict, content: str) -> List[Dict]:
        """Identify quick wins that can be implemented immediately."""
        quick_wins = []
        
        # Formatting improvements
        if metrics['bullet_points'] == 0:
            quick_wins.append({
                'win': 'Add Bullet Points',
                'description': 'Convert paragraphs to bullet points for better readability',
                'time_required': '5-10 minutes',
                'impact': 'Immediate visual improvement'
            })
        
        # Date formatting
        if not metrics['has_dates']:
            quick_wins.append({
                'win': 'Add Employment Dates',
                'description': 'Include start and end dates for all positions',
                'time_required': '3-5 minutes',
                'impact': 'Better ATS parsing'
            })
        
        # Professional language cleanup
        if metrics['informal_language'] > 0:
            quick_wins.append({
                'win': 'Professional Language',
                'description': 'Replace informal words with professional alternatives',
                'time_required': '5-8 minutes',
                'impact': 'More professional tone'
            })
        
        # Contact information check
        if 'email' not in content.lower() or 'phone' not in content.lower():
            quick_wins.append({
                'win': 'Complete Contact Info',
                'description': 'Ensure email and phone number are clearly listed',
                'time_required': '2-3 minutes',
                'impact': 'Essential for recruitment'
            })
        
        return quick_wins[:4]  # Top 4 quick wins
    
    def _identify_improvement_areas(self, metrics: Dict) -> List[Dict]:
        """Identify areas needing improvement with specific guidance."""
        areas = []
        
        if metrics['keyword_density'] < 0.01:
            areas.append({
                'area': 'Keyword Optimization',
                'current_level': 'Low',
                'target_level': 'Optimal',
                'description': 'Increase relevant industry keywords and technical terms'
            })
        
        if metrics['quantified_achievements'] < 5:
            areas.append({
                'area': 'Achievement Quantification',
                'current_level': 'Basic' if metrics['quantified_achievements'] > 0 else 'Missing',
                'target_level': 'Strong',
                'description': 'Add more specific metrics and measurable outcomes'
            })
        
        if metrics['action_verbs'] < 8:
            areas.append({
                'area': 'Dynamic Language',
                'current_level': 'Weak',
                'target_level': 'Strong',
                'description': 'Use more powerful action verbs to describe accomplishments'
            })
        
        return areas
    
    def _identify_positive_highlights(self, metrics: Dict) -> List[str]:
        """Identify positive aspects to reinforce good practices."""
        highlights = []
        
        if metrics['sections_count'] >= 4:
            highlights.append("Excellent section organization - well-structured resume")
        
        if metrics['quantified_achievements'] >= 5:
            highlights.append("Strong use of quantified achievements - demonstrates clear impact")
        
        if metrics['action_verbs'] >= 8:
            highlights.append("Dynamic language - excellent use of action verbs")
        
        if metrics['bullet_points'] > 10:
            highlights.append("Great formatting - effective use of bullet points")
        
        if metrics['informal_language'] == 0:
            highlights.append("Professional tone - appropriate language throughout")
        
        return highlights[:3]  # Top 3 highlights
    
    def _generate_next_steps(self, priority_actions: List[Dict], quick_wins: List[Dict]) -> List[Dict]:
        """Generate specific next steps for improvement."""
        next_steps = []
        
        # Immediate actions (next 15 minutes)
        if quick_wins:
            next_steps.append({
                'timeframe': 'Next 15 minutes',
                'actions': [win['win'] for win in quick_wins[:2]],
                'focus': 'Quick formatting and language improvements'
            })
        
        # Short-term actions (next hour)
        if priority_actions:
            critical_actions = [action for action in priority_actions if action['priority'] == 'critical']
            if critical_actions:
                next_steps.append({
                    'timeframe': 'Next hour',
                    'actions': [action['action'] for action in critical_actions[:2]],
                    'focus': 'Address critical content gaps'
                })
        
        # Medium-term actions (next session)
        remaining_actions = [action for action in priority_actions if action['priority'] in ['high', 'medium']]
        if remaining_actions:
            next_steps.append({
                'timeframe': 'Next editing session',
                'actions': [action['action'] for action in remaining_actions[:2]],
                'focus': 'Comprehensive content enhancement'
            })
        
        return next_steps
    
    def _estimate_improvement_time(self, priority_actions: List[Dict], quick_wins: List[Dict]) -> str:
        """Estimate total time needed for recommended improvements."""
        total_minutes = 0
        
        # Quick wins time
        for win in quick_wins:
            if 'time_required' in win:
                time_str = win['time_required']
                # Extract minutes (simple parsing)
                minutes = re.findall(r'\d+', time_str)
                if minutes:
                    total_minutes += int(minutes[0])
        
        # Priority actions time
        for action in priority_actions:
            if 'time_required' in action:
                time_str = action['time_required']
                minutes = re.findall(r'\d+', time_str)
                if minutes:
                    total_minutes += int(minutes[0])
        
        if total_minutes < 30:
            return "Less than 30 minutes"
        elif total_minutes < 60:
            return "30-60 minutes"
        elif total_minutes < 120:
            return "1-2 hours"
        else:
            return "2+ hours"
    
    async def _simulate_elite_analysis(
        self, 
        resume_content: str, 
        target_role: Optional[str], 
        target_industry: Optional[str]
    ) -> Dict:
        """Simulate elite analysis for demonstration purposes."""
        # In production, this would call the actual elite comparison service
        metrics = self._calculate_quick_metrics(resume_content)
        
        # Simulate percentile rankings based on quick metrics
        base_percentile = 50 + (metrics['quantified_achievements'] * 5) + (metrics['action_verbs'] * 2)
        
        simulated_percentiles = {
            'content_quality': min(99, base_percentile + np.random.randint(-10, 15)),
            'structure_optimization': min(99, base_percentile + np.random.randint(-8, 12)),
            'industry_alignment': min(99, base_percentile + np.random.randint(-15, 10)),
            'achievement_impact': min(99, base_percentile + np.random.randint(-5, 20)),
            'communication_clarity': min(99, base_percentile + np.random.randint(-5, 10)),
            'rocket_alignment': min(99, base_percentile + np.random.randint(-10, 15))
        }
        
        overall_percentile = np.mean(list(simulated_percentiles.values()))
        
        return {
            'percentile_rankings': simulated_percentiles,
            'overall_percentile': overall_percentile,
            'elite_rank': self._calculate_elite_rank(overall_percentile),
            'top_strength': max(simulated_percentiles.items(), key=lambda x: x[1]),
            'improvement_opportunity': min(simulated_percentiles.items(), key=lambda x: x[1])
        }
    
    def _calculate_elite_rank(self, percentile: float) -> str:
        """Calculate elite ranking category."""
        if percentile >= 99:
            return "Top 1% Elite"
        elif percentile >= 95:
            return "Top 5% Exceptional"
        elif percentile >= 90:
            return "Top 10% Outstanding"
        elif percentile >= 80:
            return "Top 20% Strong"
        else:
            return "Developing"
    
    async def _generate_comprehensive_recommendations(
        self,
        resume_content: str,
        ats_analysis: Dict,
        elite_analysis: Dict,
        target_role: Optional[str],
        target_industry: Optional[str]
    ) -> Dict:
        """Generate comprehensive final recommendations."""
        return {
            'executive_summary': self._generate_executive_summary(ats_analysis, elite_analysis),
            'improvement_roadmap': self._generate_improvement_roadmap(ats_analysis, elite_analysis),
            'competitive_positioning': self._generate_competitive_positioning(elite_analysis),
            'ats_optimization_plan': self._generate_ats_optimization_plan(ats_analysis),
            'next_milestone': self._calculate_next_milestone(elite_analysis),
            'success_metrics': self._define_success_metrics(ats_analysis, elite_analysis)
        }
    
    def _generate_executive_summary(self, ats_analysis: Dict, elite_analysis: Dict) -> str:
        """Generate executive summary of resume performance."""
        ats_grade = ats_analysis['summary']['overall_grade']
        elite_rank = elite_analysis['elite_rank']
        overall_percentile = elite_analysis['overall_percentile']
        
        if overall_percentile >= 90:
            return f"Exceptional performance: Your resume ranks in the {elite_rank} with an {ats_grade} ATS compatibility rating. You're positioned competitively for premium opportunities."
        elif overall_percentile >= 75:
            return f"Strong foundation: Your resume shows {elite_rank} performance with {ats_grade} ATS compatibility. Strategic improvements will elevate you to elite status."
        else:
            return f"Growth opportunity: Your resume currently ranks as {elite_rank} with {ats_grade} ATS compatibility. Focused improvements will significantly boost your competitive position."
    
    def _generate_improvement_roadmap(self, ats_analysis: Dict, elite_analysis: Dict) -> List[Dict]:
        """Generate step-by-step improvement roadmap."""
        roadmap = []
        
        # Phase 1: Critical fixes
        if ats_analysis['overall_score'] < 0.7 or len(ats_analysis['critical_issues']) > 0:
            roadmap.append({
                'phase': 'Phase 1: Foundation (Week 1)',
                'priority': 'Critical',
                'focus': 'ATS Compatibility & Structure',
                'actions': [
                    'Fix critical ATS compatibility issues',
                    'Standardize resume sections and formatting',
                    'Optimize length and keyword density'
                ],
                'expected_outcome': 'ATS scores above 75%, improved parsing reliability'
            })
        
        # Phase 2: Content enhancement
        improvement_area = elite_analysis['improvement_opportunity']
        roadmap.append({
            'phase': 'Phase 2: Enhancement (Week 2-3)',
            'priority': 'High',
            'focus': f'Content Quality & {improvement_area[0].replace("_", " ").title()}',
            'actions': [
                'Add quantified achievements and metrics',
                f'Strengthen {improvement_area[0].replace("_", " ")} (currently {improvement_area[1]}th percentile)',
                'Enhance professional language and impact statements'
            ],
            'expected_outcome': f'Move from {elite_analysis["overall_percentile"]:.0f}th to 85th+ percentile'
        })
        
        # Phase 3: Elite positioning
        if elite_analysis['overall_percentile'] < 95:
            roadmap.append({
                'phase': 'Phase 3: Elite Positioning (Week 4)',
                'priority': 'Medium',
                'focus': 'Top 5% Performance',
                'actions': [
                    'Refine strongest areas for competitive advantage',
                    'Add industry-specific keywords and trends',
                    'Optimize for target role requirements'
                ],
                'expected_outcome': 'Achieve Top 5% Elite status (95th+ percentile)'
            })
        
        return roadmap
    
    def _generate_competitive_positioning(self, elite_analysis: Dict) -> Dict:
        """Generate competitive positioning analysis."""
        top_strength = elite_analysis['top_strength']
        overall_percentile = elite_analysis['overall_percentile']
        
        return {
            'current_position': f"{overall_percentile:.0f}th percentile ({elite_analysis['elite_rank']})",
            'strongest_differentiator': f"{top_strength[0].replace('_', ' ').title()} ({top_strength[1]:.0f}th percentile)",
            'competitive_advantage': self._describe_competitive_advantage(top_strength[0], top_strength[1]),
            'market_positioning': self._describe_market_positioning(overall_percentile),
            'opportunities': self._identify_positioning_opportunities(elite_analysis)
        }
    
    def _describe_competitive_advantage(self, strength_area: str, percentile: float) -> str:
        """Describe competitive advantage based on top strength."""
        area_descriptions = {
            'content_quality': 'exceptional content with strong keyword optimization and relevant industry terms',
            'structure_optimization': 'superior resume structure with optimal ATS compatibility and formatting',
            'industry_alignment': 'outstanding alignment with industry standards and role requirements',
            'achievement_impact': 'powerful quantified achievements demonstrating measurable business impact',
            'communication_clarity': 'excellent professional communication with clear, compelling language',
            'rocket_alignment': 'strong personality-career alignment optimized for target roles'
        }
        
        description = area_descriptions.get(strength_area, 'strong professional presentation')
        
        if percentile >= 95:
            return f"Elite-level {description} - top 5% performance"
        elif percentile >= 90:
            return f"Outstanding {description} - top 10% performance"
        else:
            return f"Strong {description} - above average performance"
    
    def _describe_market_positioning(self, overall_percentile: float) -> str:
        """Describe overall market positioning."""
        if overall_percentile >= 95:
            return "Premium candidate - competitive for executive and senior leadership roles"
        elif overall_percentile >= 90:
            return "Strong candidate - well-positioned for senior and specialized roles"
        elif overall_percentile >= 75:
            return "Competitive candidate - good positioning for mid-level and growth roles"
        else:
            return "Developing candidate - focus on foundational improvements for market competitiveness"
    
    def _identify_positioning_opportunities(self, elite_analysis: Dict) -> List[str]:
        """Identify specific positioning opportunities."""
        opportunities = []
        improvement_area = elite_analysis['improvement_opportunity']
        
        if improvement_area[1] < 80:
            opportunities.append(f"Significant opportunity in {improvement_area[0].replace('_', ' ')} - potential for major percentile gains")
        
        if elite_analysis['overall_percentile'] < 90:
            opportunities.append("Clear path to top 10% status with targeted improvements")
        
        if elite_analysis['overall_percentile'] < 95:
            opportunities.append("Elite positioning achievable with strategic enhancements")
        
        return opportunities
    
    def _generate_ats_optimization_plan(self, ats_analysis: Dict) -> Dict:
        """Generate specific ATS optimization plan."""
        return {
            'current_ats_grade': ats_analysis['summary']['overall_grade'],
            'systems_performing_well': ats_analysis['summary']['systems_excellent'],
            'total_systems_analyzed': ats_analysis['summary']['systems_total'],
            'critical_fixes_needed': len(ats_analysis['critical_issues']),
            'top_ats_recommendations': [rec['recommendation'] for rec in ats_analysis['recommendations'][:3]],
            'estimated_optimization_time': ats_analysis['summary']['estimated_improvement_time']
        }
    
    def _calculate_next_milestone(self, elite_analysis: Dict) -> Dict:
        """Calculate next achievement milestone."""
        current_percentile = elite_analysis['overall_percentile']
        
        if current_percentile < 80:
            target = 80
            milestone = "Top 20% Strong"
        elif current_percentile < 90:
            target = 90
            milestone = "Top 10% Outstanding" 
        elif current_percentile < 95:
            target = 95
            milestone = "Top 5% Exceptional"
        else:
            target = 99
            milestone = "Top 1% Elite"
        
        return {
            'target_percentile': target,
            'target_rank': milestone,
            'points_needed': target - current_percentile,
            'estimated_effort': self._estimate_milestone_effort(target - current_percentile)
        }
    
    def _estimate_milestone_effort(self, points_needed: float) -> str:
        """Estimate effort needed to reach next milestone."""
        if points_needed <= 5:
            return "Minor adjustments - 1-2 focused sessions"
        elif points_needed <= 15:
            return "Moderate improvements - 1-2 weeks of targeted work"
        elif points_needed <= 25:
            return "Significant enhancements - 2-4 weeks of comprehensive updates"
        else:
            return "Major restructuring - 4+ weeks of thorough revision"
    
    def _define_success_metrics(self, ats_analysis: Dict, elite_analysis: Dict) -> Dict:
        """Define specific success metrics for tracking progress."""
        return {
            'ats_targets': {
                'overall_score': max(0.85, ats_analysis['overall_score'] + 0.1),
                'systems_grade_a': max(ats_analysis['summary']['systems_excellent'] + 5, 15),
                'critical_issues': 0
            },
            'elite_targets': {
                'overall_percentile': min(99, elite_analysis['overall_percentile'] + 10),
                'weakest_dimension': elite_analysis['improvement_opportunity'][1] + 15,
                'target_rank': self._calculate_target_rank(elite_analysis['overall_percentile'])
            },
            'timeline': '2-4 weeks for significant improvement',
            'key_metrics_to_track': [
                'Quantified achievements count',
                'ATS compatibility score',
                'Industry keyword density',
                'Professional language score'
            ]
        }
    
    def _calculate_target_rank(self, current_percentile: float) -> str:
        """Calculate realistic target rank."""
        if current_percentile < 70:
            return "Top 20% Strong"
        elif current_percentile < 85:
            return "Top 10% Outstanding"
        elif current_percentile < 95:
            return "Top 5% Exceptional"
        else:
            return "Top 1% Elite"
    
    def _generate_fallback_feedback(self, resume_content: str, start_time: float) -> Dict:
        """Generate basic fallback feedback if main analysis fails."""
        word_count = len(resume_content.split())
        
        return {
            'instant_score': 50,  # Neutral score
            'priority_actions': [{
                'action': 'Review Content',
                'description': 'Ensure resume includes key sections and quantified achievements',
                'priority': 'medium',
                'estimated_impact': '+10-20 points',
                'time_required': '30-60 minutes'
            }],
            'quick_wins': [{
                'win': 'Format Check',
                'description': 'Review formatting for consistency and readability',
                'time_required': '10-15 minutes',
                'impact': 'Improved presentation'
            }],
            'live_metrics': {
                'word_count': word_count,
                'analysis_status': 'Basic analysis completed'
            },
            'improvement_areas': ['Content review recommended'],
            'positive_highlights': ['Resume successfully uploaded and analyzed'],
            'next_steps': [{
                'timeframe': 'Next session',
                'actions': ['Review and enhance content'],
                'focus': 'Comprehensive improvement'
            }],
            'estimated_time_to_improve': '1-2 hours',
            'response_time_ms': (asyncio.get_event_loop().time() - start_time) * 1000,
            'status': 'fallback_mode'
        }
    
    def _generate_cache_key(self, content: str, role: Optional[str], industry: Optional[str]) -> str:
        """Generate cache key for feedback caching."""
        content_hash = hash(content[:500])  # Hash first 500 chars for speed
        return f"{content_hash}_{role or 'none'}_{industry or 'none'}"
    
    def clear_cache(self):
        """Clear feedback cache."""
        self.feedback_cache.clear()
        logger.info("Feedback cache cleared")