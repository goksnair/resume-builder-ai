import json
import asyncio
import logging
import numpy as np
from typing import Dict, List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, func

from app.models import Resume, ProcessedResume, Job, ProcessedJob
from app.agent import AgentManager, EmbeddingManager
from app.prompt import prompt_factory
from .exceptions import ResumeNotFoundError, EliteComparisonError

logger = logging.getLogger(__name__)


class EliteComparisonService:
    """
    Elite Resume Comparison Engine for benchmarking against top 1% performers.
    
    Features:
    - Multi-dimensional scoring (6 components)
    - Percentile ranking against elite performers
    - ATS optimization analysis
    - Semantic job-resume matching
    - Real-time feedback generation
    """
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.agent_manager = AgentManager()
        self.embedding_manager = EmbeddingManager()
        
        # Scoring weights for multi-dimensional analysis
        self.scoring_weights = {
            'content_quality': 0.25,          # Keywords, achievements, quantifiable results
            'structure_optimization': 0.20,   # ATS compatibility, formatting, sections
            'industry_alignment': 0.20,       # Role-specific requirements and standards
            'achievement_impact': 0.15,       # Quantifiable results and business impact
            'communication_clarity': 0.10,    # Professional language and presentation
            'rocket_alignment': 0.10          # Personality-career alignment from ROCKET
        }
        
        # Elite benchmarks (top 1% thresholds by dimension)
        self.elite_benchmarks = {
            'content_quality': [0.85, 0.88, 0.91, 0.94, 0.97],      # 80th, 85th, 90th, 95th, 99th percentiles
            'structure_optimization': [0.82, 0.85, 0.88, 0.92, 0.96],
            'industry_alignment': [0.80, 0.83, 0.87, 0.91, 0.95],
            'achievement_impact': [0.78, 0.82, 0.86, 0.90, 0.94],
            'communication_clarity': [0.84, 0.87, 0.90, 0.93, 0.97],
            'rocket_alignment': [0.75, 0.80, 0.85, 0.90, 0.95]
        }
        
        # ATS system compatibility rules
        self.ats_systems = {
            'workday': {'keyword_density_optimal': 0.015, 'max_length': 2000, 'supports_tables': False},
            'greenhouse': {'keyword_density_optimal': 0.018, 'max_length': 1800, 'supports_tables': True},
            'lever': {'keyword_density_optimal': 0.016, 'max_length': 2200, 'supports_tables': True},
            'jobvite': {'keyword_density_optimal': 0.014, 'max_length': 1900, 'supports_tables': False},
            'taleo': {'keyword_density_optimal': 0.012, 'max_length': 1600, 'supports_tables': False},
            'icims': {'keyword_density_optimal': 0.017, 'max_length': 2100, 'supports_tables': True},
            'smartrecruiters': {'keyword_density_optimal': 0.019, 'max_length': 2000, 'supports_tables': True},
            'bamboohr': {'keyword_density_optimal': 0.013, 'max_length': 1700, 'supports_tables': False},
            'successfactors': {'keyword_density_optimal': 0.015, 'max_length': 1900, 'supports_tables': True},
            'cornerstone': {'keyword_density_optimal': 0.016, 'max_length': 2000, 'supports_tables': False}
        }

    async def analyze_resume_elite_comparison(
        self, 
        resume_id: str, 
        target_role: Optional[str] = None,
        target_industry: Optional[str] = None
    ) -> Dict:
        """
        Perform comprehensive elite comparison analysis.
        
        Args:
            resume_id: ID of resume to analyze
            target_role: Optional target role for alignment analysis
            target_industry: Optional target industry for benchmarking
            
        Returns:
            Comprehensive analysis with percentile rankings and recommendations
        """
        try:
            # Get resume data
            resume_data = await self._get_resume_data(resume_id)
            
            # Classify industry and role if not provided
            classification = await self._classify_resume(
                resume_data, target_role, target_industry
            )
            
            # Calculate multi-dimensional scores
            dimension_scores = await self._calculate_dimension_scores(
                resume_data, classification
            )
            
            # Calculate percentile rankings
            percentile_rankings = self._calculate_percentile_rankings(dimension_scores)
            
            # Perform ATS optimization analysis
            ats_analysis = await self._analyze_ats_compatibility(resume_data)
            
            # Generate semantic job matching scores
            semantic_scores = await self._calculate_semantic_scores(
                resume_data, classification
            )
            
            # Calculate overall elite score
            overall_score = self._calculate_overall_score(dimension_scores)
            overall_percentile = self._calculate_overall_percentile(overall_score)
            
            # Generate improvement recommendations
            recommendations = await self._generate_improvement_recommendations(
                dimension_scores, percentile_rankings, ats_analysis
            )
            
            # Generate real-time feedback
            feedback = await self._generate_real_time_feedback(
                dimension_scores, percentile_rankings, recommendations
            )
            
            return {
                'resume_id': resume_id,
                'classification': classification,
                'dimension_scores': dimension_scores,
                'percentile_rankings': percentile_rankings,
                'overall_score': overall_score,
                'overall_percentile': overall_percentile,
                'elite_rank': self._calculate_elite_rank(overall_percentile),
                'ats_analysis': ats_analysis,
                'semantic_scores': semantic_scores,
                'recommendations': recommendations,
                'feedback': feedback,
                'next_percentile_target': self._calculate_next_target(overall_percentile),
                'improvement_potential': self._calculate_improvement_potential(percentile_rankings),
                'analysis_timestamp': asyncio.get_event_loop().time()
            }
            
        except Exception as e:
            logger.error(f"Elite comparison analysis failed: {str(e)}")
            raise EliteComparisonError(f"Analysis failed: {str(e)}")

    async def _get_resume_data(self, resume_id: str) -> Dict:
        """Retrieve and structure resume data for analysis."""
        # Get raw resume
        resume_query = select(Resume).where(Resume.resume_id == resume_id)
        resume_result = await self.db.execute(resume_query)
        resume = resume_result.scalars().first()
        
        if not resume:
            raise ResumeNotFoundError(resume_id=resume_id)
        
        # Get processed resume
        processed_query = select(ProcessedResume).where(
            ProcessedResume.resume_id == resume_id
        )
        processed_result = await self.db.execute(processed_query)
        processed_resume = processed_result.scalars().first()
        
        return {
            'raw_content': resume.content,
            'processed_data': processed_resume,
            'resume_id': resume_id
        }

    async def _classify_resume(
        self, 
        resume_data: Dict, 
        target_role: Optional[str], 
        target_industry: Optional[str]
    ) -> Dict:
        """Classify resume into industry, role, and seniority level."""
        if target_role and target_industry:
            # Use provided classification
            classification = {
                'industry': target_industry,
                'role': target_role,
                'seniority': await self._determine_seniority(resume_data),
                'confidence': 0.95
            }
        else:
            # Use AI to classify
            prompt = f"""
            Analyze this resume and classify it into:
            1. Industry (e.g., Technology, Finance, Healthcare, Marketing, etc.)
            2. Role (e.g., Software Engineer, Data Scientist, Product Manager, etc.)
            3. Seniority Level (Junior, Mid, Senior, Director, VP, C-Level)
            
            Resume content:
            {resume_data['raw_content'][:2000]}
            
            Return JSON format:
            {{
                "industry": "Industry Name",
                "role": "Role Title", 
                "seniority": "Seniority Level",
                "confidence": 0.8-1.0
            }}
            """
            
            response = await self.agent_manager.run(prompt)
            try:
                classification = json.loads(response)
            except:
                # Fallback classification
                classification = {
                    'industry': 'Technology',
                    'role': 'Software Engineer',
                    'seniority': 'Mid',
                    'confidence': 0.5
                }
        
        return classification

    async def _determine_seniority(self, resume_data: Dict) -> str:
        """Determine seniority level based on experience and achievements."""
        content = resume_data['raw_content'].lower()
        
        # Keywords indicating seniority levels
        junior_keywords = ['intern', 'entry', 'junior', 'associate', 'assistant']
        senior_keywords = ['senior', 'lead', 'principal', 'staff', 'expert']
        director_keywords = ['director', 'manager', 'head', 'vp', 'vice president']
        executive_keywords = ['ceo', 'cto', 'cfo', 'president', 'founder']
        
        # Count years of experience
        years_match = len([word for word in content.split() if 'years' in word or 'year' in word])
        
        if any(keyword in content for keyword in executive_keywords):
            return 'C-Level'
        elif any(keyword in content for keyword in director_keywords):
            return 'Director'
        elif any(keyword in content for keyword in senior_keywords) or years_match > 5:
            return 'Senior'
        elif any(keyword in content for keyword in junior_keywords) or years_match <= 2:
            return 'Junior'
        else:
            return 'Mid'

    async def _calculate_dimension_scores(self, resume_data: Dict, classification: Dict) -> Dict:
        """Calculate scores for each of the 6 dimensions."""
        scores = {}
        
        # Content Quality Score (25%)
        scores['content_quality'] = await self._score_content_quality(resume_data)
        
        # Structure Optimization Score (20%)  
        scores['structure_optimization'] = await self._score_structure_optimization(resume_data)
        
        # Industry Alignment Score (20%)
        scores['industry_alignment'] = await self._score_industry_alignment(resume_data, classification)
        
        # Achievement Impact Score (15%)
        scores['achievement_impact'] = await self._score_achievement_impact(resume_data)
        
        # Communication Clarity Score (10%)
        scores['communication_clarity'] = await self._score_communication_clarity(resume_data)
        
        # ROCKET Alignment Score (10%)
        scores['rocket_alignment'] = await self._score_rocket_alignment(resume_data)
        
        return scores

    async def _score_content_quality(self, resume_data: Dict) -> float:
        """Score content quality based on keywords, achievements, and quantifiable results."""
        content = resume_data['raw_content']
        
        # Check for quantifiable achievements
        numbers = len([word for word in content.split() if any(char.isdigit() for char in word)])
        percentages = content.count('%')
        dollar_amounts = content.count('$')
        
        # Check for action verbs and impact words
        action_verbs = ['led', 'managed', 'developed', 'implemented', 'increased', 'improved', 'created', 'built']
        action_count = sum(content.lower().count(verb) for verb in action_verbs)
        
        # Check for industry keywords
        processed_data = resume_data.get('processed_data')
        if processed_data and processed_data.extracted_keywords:
            keywords_data = json.loads(processed_data.extracted_keywords)
            keyword_count = len(keywords_data.get('extracted_keywords', []))
        else:
            keyword_count = 0
        
        # Calculate score (0.0 to 1.0)
        score = min(1.0, (
            (numbers * 0.02) +           # Quantifiable metrics
            (percentages * 0.05) +       # Percentage improvements
            (dollar_amounts * 0.05) +    # Financial impact
            (action_count * 0.03) +      # Action verbs
            (keyword_count * 0.01)       # Relevant keywords
        ))
        
        return score

    async def _score_structure_optimization(self, resume_data: Dict) -> float:
        """Score structure and formatting for ATS compatibility."""
        content = resume_data['raw_content']
        
        # Check for proper sections
        sections = ['experience', 'education', 'skills', 'summary', 'objective']
        section_score = sum(1 for section in sections if section in content.lower()) / len(sections)
        
        # Check length (optimal 1-2 pages)
        word_count = len(content.split())
        if 400 <= word_count <= 800:
            length_score = 1.0
        elif 300 <= word_count <= 1000:
            length_score = 0.8
        else:
            length_score = 0.5
        
        # Check for consistent formatting indicators
        bullet_points = content.count('•') + content.count('-') + content.count('*')
        formatting_score = min(1.0, bullet_points * 0.05)
        
        # Calculate overall structure score
        score = (section_score * 0.4) + (length_score * 0.4) + (formatting_score * 0.2)
        
        return score

    async def _score_industry_alignment(self, resume_data: Dict, classification: Dict) -> float:
        """Score alignment with industry standards and requirements."""
        industry = classification.get('industry', 'Technology')
        role = classification.get('role', 'Software Engineer')
        content = resume_data['raw_content'].lower()
        
        # Industry-specific keywords
        industry_keywords = {
            'technology': ['software', 'programming', 'development', 'code', 'system', 'database', 'cloud'],
            'finance': ['financial', 'investment', 'portfolio', 'risk', 'analysis', 'banking', 'trading'],
            'healthcare': ['patient', 'medical', 'clinical', 'treatment', 'diagnosis', 'care', 'health'],
            'marketing': ['campaign', 'brand', 'digital', 'social media', 'content', 'analytics', 'seo']
        }
        
        relevant_keywords = industry_keywords.get(industry.lower(), [])
        keyword_matches = sum(1 for keyword in relevant_keywords if keyword in content)
        keyword_score = min(1.0, keyword_matches / len(relevant_keywords))
        
        # Role-specific skills check
        role_skills = {
            'software engineer': ['python', 'java', 'javascript', 'git', 'api', 'testing'],
            'data scientist': ['python', 'sql', 'machine learning', 'statistics', 'visualization'],
            'product manager': ['roadmap', 'stakeholder', 'agile', 'user research', 'metrics'],
            'marketing manager': ['campaigns', 'roi', 'analytics', 'brand', 'content strategy']
        }
        
        relevant_skills = role_skills.get(role.lower(), [])
        skill_matches = sum(1 for skill in relevant_skills if skill in content)
        skill_score = min(1.0, skill_matches / len(relevant_skills)) if relevant_skills else 0.5
        
        # Calculate alignment score
        score = (keyword_score * 0.6) + (skill_score * 0.4)
        
        return score

    async def _score_achievement_impact(self, resume_data: Dict) -> float:
        """Score the impact and quantification of achievements."""
        content = resume_data['raw_content']
        
        # Look for quantified achievements
        impact_indicators = [
            r'\d+%',                    # Percentages
            r'\$\d+',                   # Dollar amounts
            r'\d+[km]?\+?',            # Numbers with k/m (thousands/millions)
            r'increased by \d+',        # Improvement metrics
            r'reduced by \d+',          # Efficiency metrics
            r'managed \d+',             # Scale indicators
        ]
        
        import re
        total_impacts = 0
        for pattern in impact_indicators:
            matches = re.findall(pattern, content, re.IGNORECASE)
            total_impacts += len(matches)
        
        # Check for result-oriented language
        result_words = ['increased', 'improved', 'reduced', 'achieved', 'exceeded', 'delivered']
        result_count = sum(content.lower().count(word) for word in result_words)
        
        # Calculate impact score
        score = min(1.0, (total_impacts * 0.1) + (result_count * 0.05))
        
        return score

    async def _score_communication_clarity(self, resume_data: Dict) -> float:
        """Score the clarity and professionalism of communication."""
        content = resume_data['raw_content']
        
        # Check for clear, concise bullet points
        lines = content.split('\n')
        bullet_lines = [line for line in lines if line.strip().startswith(('•', '-', '*'))]
        
        if bullet_lines:
            avg_length = np.mean([len(line.split()) for line in bullet_lines])
            # Optimal bullet point length: 10-20 words
            if 10 <= avg_length <= 20:
                clarity_score = 1.0
            elif 8 <= avg_length <= 25:
                clarity_score = 0.8
            else:
                clarity_score = 0.5
        else:
            clarity_score = 0.3
        
        # Check for professional language (no informal words)
        informal_words = ['stuff', 'things', 'lots', 'awesome', 'amazing', 'cool']
        informal_count = sum(content.lower().count(word) for word in informal_words)
        professionalism_score = max(0.0, 1.0 - (informal_count * 0.1))
        
        # Calculate overall communication score
        score = (clarity_score * 0.6) + (professionalism_score * 0.4)
        
        return score

    async def _score_rocket_alignment(self, resume_data: Dict) -> float:
        """Score alignment with ROCKET Framework personality assessment."""
        # This would integrate with existing ROCKET Framework results
        # For now, return a placeholder score based on content structure
        content = resume_data['raw_content']
        
        # Check for ROCKET components in resume
        results_indicators = ['achieved', 'delivered', 'completed', 'accomplished']
        optimization_indicators = ['improved', 'enhanced', 'streamlined', 'optimized']
        clarity_indicators = ['led', 'managed', 'coordinated', 'facilitated']
        
        rocket_score = 0.0
        total_words = len(content.split())
        
        for indicators in [results_indicators, optimization_indicators, clarity_indicators]:
            count = sum(content.lower().count(word) for word in indicators)
            rocket_score += min(0.33, count / total_words * 10)
        
        return rocket_score

    def _calculate_percentile_rankings(self, dimension_scores: Dict) -> Dict:
        """Calculate percentile rankings against elite benchmarks."""
        percentiles = {}
        
        for dimension, score in dimension_scores.items():
            benchmarks = self.elite_benchmarks.get(dimension, [0.5, 0.6, 0.7, 0.8, 0.9])
            
            # Find percentile rank
            if score >= benchmarks[4]:  # 99th percentile
                percentile = 99
            elif score >= benchmarks[3]:  # 95th percentile
                percentile = 95
            elif score >= benchmarks[2]:  # 90th percentile
                percentile = 90
            elif score >= benchmarks[1]:  # 85th percentile
                percentile = 85
            elif score >= benchmarks[0]:  # 80th percentile
                percentile = 80
            else:
                # Interpolate below 80th percentile
                percentile = max(1, int(score * 80))
            
            percentiles[dimension] = percentile
        
        return percentiles

    def _calculate_overall_score(self, dimension_scores: Dict) -> float:
        """Calculate weighted overall score."""
        total_score = 0.0
        
        for dimension, score in dimension_scores.items():
            weight = self.scoring_weights.get(dimension, 0.0)
            total_score += score * weight
        
        return total_score

    def _calculate_overall_percentile(self, overall_score: float) -> float:
        """Calculate overall percentile ranking."""
        # Elite performers threshold mapping
        if overall_score >= 0.95:
            return 99
        elif overall_score >= 0.90:
            return 95
        elif overall_score >= 0.85:
            return 90
        elif overall_score >= 0.80:
            return 85
        elif overall_score >= 0.75:
            return 80
        else:
            return max(1, int(overall_score * 100))

    def _calculate_elite_rank(self, overall_percentile: float) -> str:
        """Calculate elite ranking category."""
        if overall_percentile >= 99:
            return "Top 1% Elite"
        elif overall_percentile >= 95:
            return "Top 5% Exceptional"
        elif overall_percentile >= 90:
            return "Top 10% Outstanding"
        elif overall_percentile >= 80:
            return "Top 20% Strong"
        else:
            return "Developing"

    async def _analyze_ats_compatibility(self, resume_data: Dict) -> Dict:
        """Analyze compatibility with major ATS systems."""
        content = resume_data['raw_content']
        word_count = len(content.split())
        
        ats_scores = {}
        recommendations = []
        
        for ats_name, rules in self.ats_systems.items():
            score = 1.0
            
            # Check length compatibility
            max_length = rules.get('max_length', 2000)
            if word_count > max_length:
                score -= 0.3
                if ats_name not in [r.get('ats') for r in recommendations]:
                    recommendations.append({
                        'ats': ats_name,
                        'issue': 'length',
                        'message': f'Resume too long for {ats_name} (max {max_length} words)'
                    })
            
            # Check keyword density
            optimal_density = rules.get('keyword_density_optimal', 0.015)
            processed_data = resume_data.get('processed_data')
            if processed_data and processed_data.extracted_keywords:
                keywords_data = json.loads(processed_data.extracted_keywords)
                keyword_count = len(keywords_data.get('extracted_keywords', []))
                actual_density = keyword_count / word_count if word_count > 0 else 0
                
                density_diff = abs(actual_density - optimal_density)
                if density_diff > 0.005:
                    score -= min(0.2, density_diff * 10)
            
            # Check table support
            if not rules.get('supports_tables', True) and ('table' in content.lower() or '|' in content):
                score -= 0.2
                recommendations.append({
                    'ats': ats_name,
                    'issue': 'formatting',
                    'message': f'{ats_name} may not parse tables correctly'
                })
            
            ats_scores[ats_name] = max(0.0, score)
        
        return {
            'ats_scores': ats_scores,
            'average_ats_score': np.mean(list(ats_scores.values())),
            'recommendations': recommendations,
            'overall_ats_grade': self._calculate_ats_grade(np.mean(list(ats_scores.values())))
        }

    def _calculate_ats_grade(self, average_score: float) -> str:
        """Calculate ATS compatibility grade."""
        if average_score >= 0.9:
            return "A+ (Excellent ATS Compatibility)"
        elif average_score >= 0.8:
            return "A (Very Good ATS Compatibility)"
        elif average_score >= 0.7:
            return "B (Good ATS Compatibility)"
        elif average_score >= 0.6:
            return "C (Fair ATS Compatibility)"
        else:
            return "D (Poor ATS Compatibility)"

    async def _calculate_semantic_scores(self, resume_data: Dict, classification: Dict) -> Dict:
        """Calculate semantic analysis scores for job matching."""
        content = resume_data['raw_content']
        
        # Get embedding for resume content
        resume_embedding = await self.embedding_manager.embed(content)
        
        # Create ideal job description embedding for comparison
        role = classification.get('role', 'Software Engineer')
        industry = classification.get('industry', 'Technology')
        
        ideal_job_description = f"""
        {role} position in {industry} industry. 
        Responsibilities include {role.lower()} duties and industry-specific tasks.
        Required skills and experience relevant to {role} role.
        """
        
        job_embedding = await self.embedding_manager.embed(ideal_job_description)
        
        # Calculate semantic similarity
        similarity = float(np.dot(resume_embedding, job_embedding) / 
                          (np.linalg.norm(resume_embedding) * np.linalg.norm(job_embedding)))
        
        return {
            'semantic_similarity': similarity,
            'job_match_score': min(1.0, similarity * 1.2),  # Boost for readability
            'context_alignment': 'High' if similarity > 0.8 else 'Medium' if similarity > 0.6 else 'Low'
        }

    async def _generate_improvement_recommendations(
        self, 
        dimension_scores: Dict, 
        percentile_rankings: Dict, 
        ats_analysis: Dict
    ) -> List[Dict]:
        """Generate specific improvement recommendations."""
        recommendations = []
        
        # Check each dimension for improvement opportunities
        for dimension, score in dimension_scores.items():
            percentile = percentile_rankings[dimension]
            
            if percentile < 90:  # Room for improvement
                if dimension == 'content_quality':
                    recommendations.append({
                        'dimension': dimension,
                        'priority': 'High' if percentile < 70 else 'Medium',
                        'suggestion': 'Add more quantifiable achievements with specific metrics and percentages',
                        'expected_impact': f'+{(90-percentile)//2} percentile points'
                    })
                elif dimension == 'structure_optimization':
                    recommendations.append({
                        'dimension': dimension,
                        'priority': 'High' if percentile < 70 else 'Medium', 
                        'suggestion': 'Improve resume structure with clear sections and consistent formatting',
                        'expected_impact': f'+{(90-percentile)//2} percentile points'
                    })
                elif dimension == 'industry_alignment':
                    recommendations.append({
                        'dimension': dimension,
                        'priority': 'Medium',
                        'suggestion': 'Include more industry-specific keywords and role-relevant skills',
                        'expected_impact': f'+{(90-percentile)//3} percentile points'
                    })
                elif dimension == 'achievement_impact':
                    recommendations.append({
                        'dimension': dimension,
                        'priority': 'High' if percentile < 60 else 'Medium',
                        'suggestion': 'Quantify achievements with numbers, percentages, and financial impact',
                        'expected_impact': f'+{(90-percentile)//2} percentile points'
                    })
                elif dimension == 'communication_clarity':
                    recommendations.append({
                        'dimension': dimension,
                        'priority': 'Medium',
                        'suggestion': 'Use clear, concise bullet points with professional language',
                        'expected_impact': f'+{(90-percentile)//3} percentile points'
                    })
                elif dimension == 'rocket_alignment':
                    recommendations.append({
                        'dimension': dimension,
                        'priority': 'Low',
                        'suggestion': 'Align content with ROCKET Framework personality assessment results',
                        'expected_impact': f'+{(90-percentile)//4} percentile points'
                    })
        
        # Add ATS-specific recommendations
        if ats_analysis['average_ats_score'] < 0.8:
            recommendations.extend([
                {
                    'dimension': 'ats_optimization',
                    'priority': 'High',
                    'suggestion': rec['message'],
                    'expected_impact': '+5-10 ATS compatibility points'
                }
                for rec in ats_analysis['recommendations'][:3]  # Top 3 ATS issues
            ])
        
        return sorted(recommendations, key=lambda x: {'High': 3, 'Medium': 2, 'Low': 1}[x['priority']], reverse=True)

    async def _generate_real_time_feedback(
        self, 
        dimension_scores: Dict, 
        percentile_rankings: Dict, 
        recommendations: List[Dict]
    ) -> Dict:
        """Generate real-time feedback for immediate display."""
        overall_percentile = self._calculate_overall_percentile(
            self._calculate_overall_score(dimension_scores)
        )
        
        # Generate motivational message
        if overall_percentile >= 95:
            tone = "exceptional"
            message = "Outstanding! Your resume demonstrates elite-level quality."
        elif overall_percentile >= 85:
            tone = "strong"
            message = "Great work! Your resume shows strong professional positioning."
        elif overall_percentile >= 70:
            tone = "developing"
            message = "Good foundation! Several key improvements will boost your ranking significantly."
        else:
            tone = "needs_improvement"
            message = "Significant opportunities for improvement to reach elite benchmarks."
        
        # Identify strongest and weakest dimensions
        best_dimension = max(percentile_rankings.items(), key=lambda x: x[1])
        worst_dimension = min(percentile_rankings.items(), key=lambda x: x[1])
        
        # Calculate next milestone
        next_milestone = 90 if overall_percentile < 90 else 95 if overall_percentile < 95 else 99
        
        return {
            'overall_message': message,
            'tone': tone,
            'strongest_area': {
                'dimension': best_dimension[0],
                'percentile': best_dimension[1],
                'message': f"Your {best_dimension[0].replace('_', ' ')} is in the {best_dimension[1]}th percentile - excellent!"
            },
            'improvement_area': {
                'dimension': worst_dimension[0],
                'percentile': worst_dimension[1],
                'message': f"Focus on {worst_dimension[0].replace('_', ' ')} for the biggest impact"
            },
            'next_milestone': {
                'target_percentile': next_milestone,
                'points_needed': next_milestone - overall_percentile,
                'key_actions': [rec['suggestion'] for rec in recommendations[:2]]
            },
            'elite_status': self._calculate_elite_rank(overall_percentile),
            'improvement_timeline': self._estimate_improvement_timeline(recommendations)
        }

    def _calculate_next_target(self, current_percentile: float) -> float:
        """Calculate next percentile target for motivation."""
        if current_percentile < 80:
            return 80
        elif current_percentile < 90:
            return 90
        elif current_percentile < 95:
            return 95
        else:
            return 99

    def _calculate_improvement_potential(self, percentile_rankings: Dict) -> float:
        """Calculate total improvement potential across all dimensions."""
        total_gap = sum(max(0, 95 - percentile) for percentile in percentile_rankings.values())
        max_possible_gap = len(percentile_rankings) * 95
        
        improvement_potential = total_gap / max_possible_gap if max_possible_gap > 0 else 0
        return improvement_potential

    def _estimate_improvement_timeline(self, recommendations: List[Dict]) -> str:
        """Estimate timeline for implementing improvements."""
        high_priority_count = sum(1 for rec in recommendations if rec['priority'] == 'High')
        
        if high_priority_count >= 4:
            return "2-3 weeks with focused effort"
        elif high_priority_count >= 2:
            return "1-2 weeks with targeted improvements"
        else:
            return "3-5 days with minor adjustments"


class EliteComparisonError(Exception):
    """Custom exception for elite comparison service errors."""
    pass