"""
ROCKET Framework Service Helper Methods

Additional helper methods for the ROCKETFrameworkService to handle:
- REST quantification analysis
- Response quality assessment
- Business impact calculations
- AI-powered content generation
"""

import re
import json
from typing import Dict, List, Optional, Any, Tuple

from ..models.rocket_framework import CARFrameworkData, ROCKETPhase, ResponseQuality


class ROCKETFrameworkHelpers:
    """Helper methods for ROCKET Framework Service"""
    
    @staticmethod
    def _analyze_results_metrics(results_text: Optional[str], quantifiable_metrics: Dict) -> Dict[str, Any]:
        """Analyze results metrics for REST quantification"""
        if not results_text:
            return {}
            
        metrics = {
            'primary_outcomes': [],
            'quantified_results': quantifiable_metrics,
            'impact_magnitude': 'medium',  # low, medium, high
            'measurement_type': 'qualitative'  # qualitative, quantitative, mixed
        }
        
        # Determine impact magnitude based on numbers found
        if quantifiable_metrics.get('percentage') or quantifiable_metrics.get('currency'):
            metrics['measurement_type'] = 'quantitative'
            
            # Analyze percentage improvements
            percentages = quantifiable_metrics.get('percentage', [])
            if percentages:
                max_percentage = max([float(p) for p in percentages if p.replace('.', '').isdigit()])
                if max_percentage > 50:
                    metrics['impact_magnitude'] = 'high'
                elif max_percentage > 20:
                    metrics['impact_magnitude'] = 'medium'
                else:
                    metrics['impact_magnitude'] = 'low'
        
        return metrics
    
    
    @staticmethod 
    def _analyze_efficiency_gains(experience_text: str) -> Dict[str, Any]:
        """Analyze efficiency improvements from experience"""
        efficiency_keywords = [
            'faster', 'quicker', 'streamlined', 'automated', 'optimized',
            'reduced time', 'saved time', 'efficiency', 'productivity'
        ]
        
        gains = {
            'time_savings': [],
            'process_improvements': [],
            'automation_level': 'none'  # none, partial, full
        }
        
        text_lower = experience_text.lower()
        
        # Check for efficiency indicators
        for keyword in efficiency_keywords:
            if keyword in text_lower:
                gains['process_improvements'].append(keyword)
        
        # Look for time-related improvements
        time_patterns = [
            r'(\d+)(?:\s*%|\s*percent)\s*(?:faster|quicker|reduction)',
            r'reduced.*?time.*?by.*?(\d+)',
            r'saved.*?(\d+).*?(?:hours?|days?|weeks?)'
        ]
        
        for pattern in time_patterns:
            matches = re.finditer(pattern, experience_text, re.IGNORECASE)
            for match in matches:
                gains['time_savings'].append(match.group(1))
        
        # Determine automation level
        if any(word in text_lower for word in ['automated', 'automation']):
            gains['automation_level'] = 'full' if 'fully automated' in text_lower else 'partial'
        
        return gains
    
    
    @staticmethod
    def _analyze_scope_impact(experience_text: str) -> Dict[str, Any]:
        """Analyze scope and reach of impact"""
        scope_indicators = {
            'department': ['department', 'team', 'group'],
            'company': ['company', 'organization', 'enterprise', 'firm'],
            'industry': ['industry', 'sector', 'market'],
            'global': ['global', 'worldwide', 'international']
        }
        
        scope = {
            'reach_level': 'team',  # team, department, company, industry, global
            'stakeholders_affected': [],
            'geographic_scope': 'local'  # local, regional, national, global
        }
        
        text_lower = experience_text.lower()
        
        # Determine reach level
        for level, keywords in scope_indicators.items():
            if any(keyword in text_lower for keyword in keywords):
                scope['reach_level'] = level
                break
        
        # Look for stakeholder mentions
        stakeholder_patterns = [
            r'(\d+).*?(?:people|employees|users|customers|clients)',
            r'(?:affecting|impacting).*?(\d+)',
            r'(\d+).*?(?:teams?|departments?|divisions?)'
        ]
        
        for pattern in stakeholder_patterns:
            matches = re.finditer(pattern, experience_text, re.IGNORECASE)
            for match in matches:
                scope['stakeholders_affected'].append(match.group(1))
        
        return scope
    
    
    @staticmethod
    def _analyze_time_factors(experience_text: str) -> Dict[str, Any]:
        """Analyze time-related factors and delivery speed"""
        time_factors = {
            'project_duration': None,
            'delivery_speed': 'standard',  # fast, standard, extended
            'deadline_performance': 'met',  # ahead, met, delayed
            'timeline_mentions': []
        }
        
        # Look for duration mentions
        duration_patterns = [
            r'(\d+)\s*(?:days?|weeks?|months?|years?)',
            r'over\s*(\d+)',
            r'within\s*(\d+)'
        ]
        
        for pattern in duration_patterns:
            matches = re.finditer(pattern, experience_text, re.IGNORECASE)
            for match in matches:
                time_factors['timeline_mentions'].append(match.group(0))
        
        # Determine delivery speed indicators
        text_lower = experience_text.lower()
        if any(word in text_lower for word in ['ahead of schedule', 'early', 'faster than expected']):
            time_factors['deadline_performance'] = 'ahead'
        elif any(word in text_lower for word in ['delayed', 'behind schedule', 'extended timeline']):
            time_factors['deadline_performance'] = 'delayed'
        
        if any(word in text_lower for word in ['rapid', 'quick', 'fast', 'immediate']):
            time_factors['delivery_speed'] = 'fast'
        elif any(word in text_lower for word in ['extended', 'long-term', 'gradual']):
            time_factors['delivery_speed'] = 'extended'
        
        return time_factors
    
    
    @staticmethod
    def _calculate_business_impact(
        quantifiable_metrics: Dict, 
        results_metrics: Dict
    ) -> Tuple[Optional[float], Optional[float]]:
        """Calculate estimated business impact (revenue, cost savings)"""
        revenue_impact = None
        cost_savings = None
        
        # Look for currency amounts
        if 'currency' in quantifiable_metrics:
            amounts = quantifiable_metrics['currency']
            if amounts:
                # Take the largest amount mentioned
                max_amount = max([float(amt.replace(',', '')) for amt in amounts])
                
                # Heuristic: if context suggests savings, it's cost savings; otherwise revenue
                if 'saved' in str(results_metrics).lower() or 'reduction' in str(results_metrics).lower():
                    cost_savings = max_amount
                else:
                    revenue_impact = max_amount
        
        # Look for percentage improvements that might indicate financial impact
        if 'percentage' in quantifiable_metrics:
            percentages = quantifiable_metrics['percentage']
            if percentages:
                max_percentage = max([float(p) for p in percentages if p.replace('.', '').isdigit()])
                
                # If high percentage improvement, estimate potential impact
                if max_percentage > 30:
                    # This is a rough estimation - could be refined with industry data
                    estimated_impact = max_percentage * 1000  # Very rough estimation
                    if cost_savings is None and revenue_impact is None:
                        cost_savings = estimated_impact
        
        return revenue_impact, cost_savings
    
    
    @staticmethod
    def _extract_percentage_improvements(experience_text: str) -> Dict[str, float]:
        """Extract percentage improvements from text"""
        improvements = {}
        
        patterns = [
            (r'(\d+(?:\.\d+)?)\s*%\s*(?:increase|improvement|growth)', 'increase'),
            (r'(\d+(?:\.\d+)?)\s*%\s*(?:decrease|reduction|savings?)', 'decrease'),
            (r'improved.*?by.*?(\d+(?:\.\d+)?)\s*%', 'improvement'),
            (r'reduced.*?by.*?(\d+(?:\.\d+)?)\s*%', 'reduction')
        ]
        
        for pattern, category in patterns:
            matches = re.finditer(pattern, experience_text, re.IGNORECASE)
            for match in matches:
                percentage = float(match.group(1))
                if category not in improvements:
                    improvements[category] = []
                improvements[category].append(percentage)
        
        # Convert lists to max values for simplicity
        for category in improvements:
            if isinstance(improvements[category], list):
                improvements[category] = max(improvements[category])
        
        return improvements
    
    
    @staticmethod
    def _estimate_people_affected(experience_text: str) -> Optional[int]:
        """Estimate number of people affected by the work"""
        people_patterns = [
            r'(\d+)\s*(?:people|employees|team members|users|customers|clients)',
            r'team\s*of\s*(\d+)',
            r'(\d+).*?(?:person|individual)s?'
        ]
        
        people_counts = []
        
        for pattern in people_patterns:
            matches = re.finditer(pattern, experience_text, re.IGNORECASE)
            for match in matches:
                count = int(match.group(1))
                people_counts.append(count)
        
        return max(people_counts) if people_counts else None
    
    
    @staticmethod
    def _calculate_rest_confidence(
        results_metrics: Dict, 
        efficiency_gains: Dict, 
        scope_impact: Dict, 
        time_factors: Dict
    ) -> float:
        """Calculate confidence score for REST quantification"""
        components = [results_metrics, efficiency_gains, scope_impact, time_factors]
        
        # Base confidence from component completeness
        non_empty_components = sum(1 for comp in components if comp and len(str(comp)) > 10)
        base_confidence = non_empty_components / 4.0
        
        # Boost for quantified data
        quantification_boost = 0.0
        if results_metrics.get('quantified_results'):
            quantification_boost += 0.2
        if efficiency_gains.get('time_savings'):
            quantification_boost += 0.1
        if scope_impact.get('stakeholders_affected'):
            quantification_boost += 0.1
        
        return min(base_confidence + quantification_boost, 1.0)
    
    
    @staticmethod
    def _calculate_completeness_score_response(response: str, phase: ROCKETPhase) -> float:
        """Calculate completeness score for user response based on conversation phase"""
        if not response or len(response.strip()) < 10:
            return 0.0
        
        # Phase-specific completeness criteria
        phase_requirements = {
            ROCKETPhase.INTRODUCTION: {
                'min_length': 50,
                'required_elements': ['role', 'work', 'experience']
            },
            ROCKETPhase.STORY_EXTRACTION: {
                'min_length': 100,
                'required_elements': ['help', 'achieve', 'I am', 'I do']
            },
            ROCKETPhase.CAR_ANALYSIS: {
                'min_length': 150,
                'required_elements': ['situation', 'action', 'result', 'impact']
            },
            ROCKETPhase.REST_QUANTIFICATION: {
                'min_length': 100,
                'required_elements': ['number', 'percent', 'result', 'outcome']
            }
        }
        
        requirements = phase_requirements.get(phase, {'min_length': 50, 'required_elements': []})
        
        # Length score
        length_score = min(len(response) / requirements['min_length'], 1.0)
        
        # Element presence score
        elements_found = 0
        for element in requirements['required_elements']:
            if any(elem in response.lower() for elem in element.split()):
                elements_found += 1
        
        element_score = elements_found / len(requirements['required_elements']) if requirements['required_elements'] else 1.0
        
        return (length_score * 0.6) + (element_score * 0.4)
    
    
    @staticmethod
    def _calculate_specificity_score(response: str) -> float:
        """Calculate how specific and detailed the response is"""
        if not response:
            return 0.0
        
        # Look for specific indicators
        specificity_indicators = [
            r'\d+',  # Numbers
            r'[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*',  # Proper nouns/names
            r'(?:using|with|through)\s+[A-Za-z]+',  # Tool/method mentions
            r'(?:January|February|March|April|May|June|July|August|September|October|November|December)',  # Dates
            r'(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)',  # Days
            r'\$\d+',  # Money amounts
            r'\d+\s*%'  # Percentages
        ]
        
        specificity_count = 0
        for pattern in specificity_indicators:
            matches = re.finditer(pattern, response)
            specificity_count += len(list(matches))
        
        # Normalize by response length
        words = len(response.split())
        if words == 0:
            return 0.0
        
        specificity_ratio = specificity_count / words
        return min(specificity_ratio * 10, 1.0)  # Scale to 0-1
    
    
    @staticmethod
    def _calculate_relevance_score(response: str, context: str) -> float:
        """Calculate how relevant the response is to the asked question/context"""
        if not response or not context:
            return 0.5  # Neutral score if we can't determine
        
        # Extract key terms from context
        context_words = set(context.lower().split())
        response_words = set(response.lower().split())
        
        # Remove common words
        common_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'}
        context_words -= common_words
        response_words -= common_words
        
        # Calculate overlap
        if not context_words:
            return 0.5
        
        overlap = len(context_words.intersection(response_words))
        relevance_score = overlap / len(context_words)
        
        return min(relevance_score * 2, 1.0)  # Scale appropriately
    
    
    @staticmethod
    def _determine_quality_rating(
        completeness_score: float, 
        specificity_score: float, 
        relevance_score: float
    ) -> ResponseQuality:
        """Determine overall quality rating from component scores"""
        overall_score = (completeness_score + specificity_score + relevance_score) / 3
        
        if overall_score >= 0.8:
            return ResponseQuality.EXCELLENT
        elif overall_score >= 0.65:
            return ResponseQuality.GOOD
        elif overall_score >= 0.5:
            return ResponseQuality.ADEQUATE
        elif overall_score >= 0.3:
            return ResponseQuality.NEEDS_FOLLOWUP
        else:
            return ResponseQuality.INSUFFICIENT
    
    
    @staticmethod
    def _identify_missing_elements(response: str, phase: ROCKETPhase) -> List[str]:
        """Identify what elements are missing from the response for the given phase"""
        missing = []
        
        phase_requirements = {
            ROCKETPhase.INTRODUCTION: [
                ('current_role', ['role', 'position', 'job', 'title']),
                ('experience_level', ['year', 'experience', 'senior', 'junior', 'lead']),
                ('industry', ['industry', 'sector', 'field', 'domain'])
            ],
            ROCKETPhase.STORY_EXTRACTION: [
                ('who_you_help', ['help', 'assist', 'serve', 'work with']),
                ('what_you_achieve', ['achieve', 'accomplish', 'deliver', 'provide']),
                ('your_role_identity', ['I am', 'I\'m', 'my role', 'as a'])
            ],
            ROCKETPhase.CAR_ANALYSIS: [
                ('context', ['situation', 'challenge', 'problem', 'when', 'during']),
                ('action', ['I did', 'I implemented', 'I created', 'I led', 'action']),
                ('results', ['result', 'outcome', 'achieved', 'delivered', 'impact'])
            ],
            ROCKETPhase.REST_QUANTIFICATION: [
                ('quantified_results', ['percent', '%', 'number', 'amount', 'increase', 'decrease']),
                ('business_impact', ['revenue', 'cost', 'savings', 'profit', 'efficiency']),
                ('scope', ['team', 'department', 'company', 'people', 'users'])
            ]
        }
        
        requirements = phase_requirements.get(phase, [])
        response_lower = response.lower()
        
        for element_name, keywords in requirements:
            if not any(keyword in response_lower for keyword in keywords):
                missing.append(element_name)
        
        return missing