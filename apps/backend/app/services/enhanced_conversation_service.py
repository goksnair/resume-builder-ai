import uuid
import re
import logging
from typing import Optional, List, Dict, Any
from datetime import datetime
from contextlib import contextmanager

from sqlalchemy.orm import Session
from sqlalchemy import and_
from pydantic import ValidationError

from ..models.conversation import ConversationSession, ConversationMessage, UserCareerProfile, ConversationPhase
from ..schemas.pydantic.conversation import (
    ResumeConversationState, ConversationResponse, PersonalStory, 
    CARExperience, RESTMetrics, WorkExperienceData, FollowUpStrategy,
    IntelligenceScores, PersonalityProfile, ResumeSummary
)

logger = logging.getLogger(__name__)

class InputValidator:
    """Enhanced input validation and sanitization"""
    
    @staticmethod
    def validate_user_input(user_input: str) -> tuple[bool, str]:
        """Validate and sanitize user input"""
        if not user_input or not user_input.strip():
            return False, "Input cannot be empty"
        
        # Length validation
        if len(user_input) > 5000:
            return False, "Input too long (max 5000 characters)"
        
        if len(user_input.strip()) < 3:
            return False, "Input too short (min 3 characters)"
        
        # Sanitization
        sanitized = re.sub(r'[^\w\s\-.,!?@()&:;\'"$%/]', '', user_input)
        
        return True, sanitized.strip()
    
    @staticmethod
    def validate_session_id(session_id: str) -> bool:
        """Validate session ID format"""
        if not session_id:
            return False
        
        try:
            uuid.UUID(session_id)
            return True
        except ValueError:
            return False

class EnhancedROCKETFramework:
    """Enhanced ROCKET Framework with improved scoring and analysis"""
    
    @staticmethod
    def analyze_personal_story(responses: List[str]) -> PersonalStory:
        """Enhanced personal story analysis with better pattern matching"""
        if not responses:
            return PersonalStory(coherence_score=0.0)
            
        combined_text = " ".join(responses).lower()
        
        # Enhanced role extraction patterns
        role_patterns = [
            r"i'm (?:a |an |the )?([^,\.\n]+?)(?:who|that|with)",
            r"(?:i am|i'm) (?:a |an |the )?([^,\.\n]+)",
            r"as (?:a |an |the )?([^,\.\n]+)",
            r"(?:senior|junior|lead|principal|staff)\s+([^,\.\n]+)",
            r"([^,\.\n]+?)\s+(?:engineer|developer|manager|analyst|consultant|specialist)"
        ]
        
        role_identity = None
        for pattern in role_patterns:
            match = re.search(pattern, combined_text)
            if match:
                role_identity = match.group(1).strip()
                if len(role_identity) > 3 and len(role_identity) < 50:
                    break
        
        # Enhanced value proposition extraction
        value_patterns = [
            r"help(?:s?|ing)?\s+(?:companies?|organizations?|teams?)\s+([^,\.\n]+)",
            r"(?:achieve|deliver|drive|create|improve|optimize|build)\s+([^,\.\n]+)",
            r"specialize(?:s?|ing)?\s+in\s+([^,\.\n]+)",
            r"focus(?:es|ing)?\s+on\s+([^,\.\n]+)",
            r"expert(?:ise)?\s+in\s+([^,\.\n]+)"
        ]
        
        value_proposition = None
        for pattern in value_patterns:
            match = re.search(pattern, combined_text)
            if match:
                value_proposition = match.group(1).strip()
                if len(value_proposition) > 5:
                    break
        
        # Enhanced coherence scoring
        coherence_score = 0.0
        
        # Base scores
        if role_identity:
            coherence_score += 0.3
        if value_proposition:
            coherence_score += 0.3
        
        # Response quality factors
        total_words = sum(len(response.split()) for response in responses)
        if total_words > 50:
            coherence_score += 0.2
        
        # Quantification presence
        has_numbers = any(re.search(r'\d+', response) for response in responses)
        if has_numbers:
            coherence_score += 0.1
        
        # Business language presence
        business_terms = ['revenue', 'profit', 'efficiency', 'growth', 'impact', 'roi', 'kpi', 'metrics']
        has_business_language = any(term in combined_text for term in business_terms)
        if has_business_language:
            coherence_score += 0.1
        
        story_statement = None
        if role_identity and value_proposition:
            story_statement = f"I'm the {role_identity} who can help companies achieve {value_proposition}"
        
        return PersonalStory(
            role_identity=role_identity,
            value_proposition=value_proposition,
            story_statement=story_statement,
            coherence_score=min(coherence_score, 1.0)
        )
    
    @staticmethod
    def enhanced_car_extraction(experience_text: str) -> CARExperience:
        """Enhanced CAR structure extraction with better context detection"""
        if not experience_text:
            return CARExperience(
                context="Context to be refined",
                action="Actions to be detailed", 
                results="Results to be quantified"
            )
            
        sentences = [s.strip() for s in experience_text.split('.') if s.strip()]
        
        context = ""
        action = ""
        results = ""
        
        # Enhanced pattern matching
        context_indicators = [
            'situation', 'challenge', 'problem', 'faced', 'when', 'during', 
            'background', 'context', 'scenario', 'environment', 'condition'
        ]
        action_indicators = [
            'implemented', 'led', 'developed', 'created', 'managed', 'optimized',
            'designed', 'built', 'architected', 'executed', 'delivered', 'established'
        ]
        result_indicators = [
            'result', 'impact', 'outcome', 'achieved', 'increased', 'decreased', 
            'improved', 'reduced', 'generated', 'saved', 'enhanced', 'delivered'
        ]
        
        # Score sentences for each category
        sentence_scores = []
        for sentence in sentences:
            sentence_lower = sentence.lower()
            context_score = sum(1 for ind in context_indicators if ind in sentence_lower)
            action_score = sum(1 for ind in action_indicators if ind in sentence_lower)
            result_score = sum(1 for ind in result_indicators if ind in sentence_lower)
            
            sentence_scores.append({
                'sentence': sentence,
                'context_score': context_score,
                'action_score': action_score,
                'result_score': result_score
            })
        
        # Assign sentences to categories based on highest scores
        for scored_sentence in sentence_scores:
            scores = [scored_sentence['context_score'], scored_sentence['action_score'], scored_sentence['result_score']]
            max_score_index = scores.index(max(scores))
            
            if max_score_index == 0 and not context:
                context = scored_sentence['sentence']
            elif max_score_index == 1 and not action:
                action = scored_sentence['sentence'] 
            elif max_score_index == 2 and not results:
                results = scored_sentence['sentence']
        
        # Fallback to first sentences if no patterns matched
        if not context and sentences:
            context = sentences[0]
        if not action and len(sentences) > 1:
            action = sentences[1]
        if not results and len(sentences) > 2:
            results = sentences[2]
            
        return CARExperience(
            context=context or "Context to be refined",
            action=action or "Actions to be detailed",
            results=results or "Results to be quantified"
        )
    
    @staticmethod 
    def enhanced_rest_extraction(experience_text: str) -> RESTMetrics:
        """Enhanced REST metrics extraction with better number detection"""
        if not experience_text:
            return RESTMetrics()
            
        text_lower = experience_text.lower()
        
        # Enhanced number extraction patterns
        number_patterns = [
            r'(\d+(?:\.\d+)?)\s*%',  # Percentages
            r'\$(\d+(?:,\d{3})*(?:\.\d{2})?)',  # Money
            r'(\d+(?:,\d{3})*)\s*(?:users?|people|employees?|customers?)',  # People
            r'(\d+(?:\.\d+)?)\s*(?:seconds?|minutes?|hours?|days?|weeks?|months?|years?)',  # Time
            r'(\d+(?:,\d{3})*)\s*(?:requests?|transactions?|operations?)',  # Volume
        ]
        
        numbers = []
        for pattern in number_patterns:
            matches = re.finditer(pattern, experience_text, re.IGNORECASE)
            for match in matches:
                numbers.append(match.group())
        
        results = None
        efficiency = None
        scope = None
        time = None
        
        # Enhanced Results detection
        if any(word in text_lower for word in ['revenue', 'profit', 'sales', 'growth', 'roi', 'income', 'earnings']):
            revenue_match = re.search(r'\$(\d+(?:,\d{3})*(?:\.\d{2})?)', experience_text)
            percent_match = re.search(r'(\d+(?:\.\d+)?)\s*%', experience_text)
            if revenue_match:
                results = f"Generated ${revenue_match.group(1)} business impact"
            elif percent_match:
                results = f"Achieved {percent_match.group(1)}% improvement in business metrics"
        
        # Enhanced Efficiency detection
        if any(word in text_lower for word in ['saved', 'reduced', 'optimized', 'streamlined', 'faster', 'improved']):
            time_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:seconds?|minutes?|hours?|days?|weeks?|months?)', experience_text)
            percent_match = re.search(r'(\d+(?:\.\d+)?)\s*%', experience_text)
            if time_match:
                efficiency = f"Achieved {time_match.group()} time savings"
            elif percent_match:
                efficiency = f"Delivered {percent_match.group()}% efficiency improvement"
        
        # Enhanced Scope detection  
        people_match = re.search(r'(\d+(?:,\d{3})*)\s*(?:users?|people|employees?|customers?|stakeholders?)', experience_text)
        if people_match:
            scope = f"Impacted {people_match.group(1)} stakeholders"
        
        # Enhanced Time detection
        time_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:weeks?|months?|quarters?)', experience_text)
        if time_match:
            time = f"Delivered in {time_match.group()}"
        
        return RESTMetrics(
            results=results,
            efficiency=efficiency,
            scope=scope,
            time=time
        )

class EnhancedIntelligentFollowUp:
    """Enhanced follow-up system with more sophisticated analysis"""
    
    @staticmethod
    def analyze_response_quality(response: str) -> tuple[FollowUpStrategy, float]:
        """Enhanced response quality analysis with confidence scoring"""
        if not response:
            return FollowUpStrategy.CLARIFICATION, 0.0
        
        quality_indicators = {
            "has_numbers": bool(re.search(r'\d+', response)),
            "has_percentages": bool(re.search(r'\d+%', response)),
            "has_money": bool(re.search(r'\$\d+', response)),
            "specific_details": len(response.split()) > 20,
            "business_impact": any(word in response.lower() for word in 
                                  ['revenue', 'cost', 'efficiency', 'growth', 'roi', 'profit', 'savings']),
            "modesty_indicators": any(phrase in response.lower() for phrase in 
                                    ['helped', 'assisted', 'contributed', 'supported', 'participated']),
            "vague_language": any(phrase in response.lower() for phrase in 
                                ['some', 'a few', 'several', 'many', 'various', 'multiple', 'different']),
            "action_verbs": any(verb in response.lower() for verb in
                              ['led', 'developed', 'created', 'implemented', 'designed', 'built', 'managed']),
            "quantified_results": len(re.findall(r'\d+(?:\.\d+)?(?:%|\$|,\d{3})', response)) > 0
        }
        
        # Calculate confidence score
        confidence = 0.0
        if quality_indicators["has_numbers"]:
            confidence += 0.2
        if quality_indicators["quantified_results"]:
            confidence += 0.3
        if quality_indicators["business_impact"]:
            confidence += 0.2
        if quality_indicators["action_verbs"]:
            confidence += 0.15
        if quality_indicators["specific_details"]:
            confidence += 0.15
        
        # Determine strategy
        if not quality_indicators["has_numbers"] and not quality_indicators["quantified_results"]:
            return FollowUpStrategy.QUANTIFICATION_PROBE, confidence
        elif quality_indicators["modesty_indicators"]:
            return FollowUpStrategy.CONFIDENCE_BOOST, confidence
        elif quality_indicators["vague_language"]:
            return FollowUpStrategy.CLARIFICATION, confidence
        elif not quality_indicators["specific_details"]:
            return FollowUpStrategy.DEPTH_EXPLORATION, confidence
        else:
            return FollowUpStrategy.PROCEED, confidence

class EnhancedConversationalResumeBuilder:
    """Enhanced conversation service with comprehensive improvements"""
    
    def __init__(self, db: Session):
        self.db = db
        self.rocket_framework = EnhancedROCKETFramework()
        self.follow_up_system = EnhancedIntelligentFollowUp()
        self.input_validator = InputValidator()
        
        # Enhanced conversation templates with role-specific questions
        self.role_specific_questions = {
            'software engineer': [
                "Tell me about a complex technical challenge you solved. What was the architecture or approach?",
                "Describe a system you built or improved. What metrics improved and by how much?",
                "What's the most significant code or system optimization you've implemented?"
            ],
            'product manager': [
                "Describe a product feature you launched. What was the user impact and business results?",
                "Tell me about a time you had to make a difficult product decision. What data drove your choice?",
                "What's your most successful product initiative? How did you measure success?"
            ],
            'marketing manager': [
                "Describe a marketing campaign you led. What were the conversion rates and ROI?",
                "Tell me about a time you improved marketing metrics. What strategies worked best?",
                "What's your most successful lead generation or brand awareness initiative?"
            ]
        }
    
    @contextmanager
    def database_transaction(self):
        """Enhanced database transaction management"""
        try:
            yield self.db
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            logger.error(f"Database transaction failed: {str(e)}")
            raise
        finally:
            # Connection will be returned to pool by FastAPI dependency injection
            pass
    
    def get_role_specific_questions(self, role: str) -> List[str]:
        """Get questions tailored to user's role"""
        role_lower = role.lower() if role else ""
        
        for key, questions in self.role_specific_questions.items():
            if key in role_lower:
                return questions
        
        # Default questions for unknown roles
        return [
            "Tell me about your most significant professional achievement with measurable results.",
            "Describe a challenging project you led. What was the impact on the business?",
            "What's an example of when you exceeded expectations? Include specific metrics."
        ]
    
    async def initiate_conversation(self, user_id: Optional[str] = None) -> ConversationResponse:
        """Enhanced conversation initialization with better error handling"""
        try:
            with self.database_transaction():
                session_id = str(uuid.uuid4())
                
                # Create conversation session
                session = ConversationSession(
                    id=session_id,
                    user_id=user_id,
                    current_phase=ConversationPhase.INTRODUCTION,
                    conversation_state={}
                )
                
                # Create career profile
                profile = UserCareerProfile(
                    id=str(uuid.uuid4()),
                    session_id=session_id,
                    user_id=user_id
                )
                
                self.db.add(session)
                self.db.add(profile)
                
                welcome_message = """🚀 **Welcome to the ROCKET Framework!**

I'm here to help you create a bulletproof resume that positions you as THE best choice for your target role.

**ROCKET = Results-Optimized Career Knowledge Enhancement Toolkit**
🎯 **R**esults-focused positioning - Your unique value story
🚀 **O**ptimized achievement structure - CAR + REST methodology  
📈 **C**areer acceleration strategy - Industry-specific optimization
🔑 **K**eyword enhancement - ATS-optimized content
⚡ **E**xperience transformation - Quantified impact stories
🎪 **T**argeted positioning - Strategic career narrative

Let's ROCKET your career! What's your name and target role?"""

                # Save initial AI message
                initial_message = ConversationMessage(
                    id=str(uuid.uuid4()),
                    session_id=session_id,
                    sender="ai",
                    message=welcome_message,
                    message_metadata={"phase": ConversationPhase.INTRODUCTION.value}
                )
                
                self.db.add(initial_message)
                
                return ConversationResponse(
                    message=welcome_message,
                    phase=ConversationPhase.INTRODUCTION,
                    progress_percentage=10.0,
                    session_id=session_id
                )
                
        except Exception as e:
            logger.error(f"Failed to initiate conversation: {str(e)}")
            raise
    
    async def process_response(self, session_id: str, user_input: str) -> ConversationResponse:
        """Enhanced response processing with comprehensive validation"""
        
        # Validate inputs
        if not self.input_validator.validate_session_id(session_id):
            raise ValueError("Invalid session ID format")
        
        is_valid, processed_input = self.input_validator.validate_user_input(user_input)
        if not is_valid:
            raise ValueError(f"Invalid input: {processed_input}")
        
        try:
            with self.database_transaction():
                # Get session and profile with error handling
                session = self.db.query(ConversationSession).filter(
                    ConversationSession.id == session_id
                ).first()
                
                if not session:
                    raise ValueError("Session not found")
                    
                profile = self.db.query(UserCareerProfile).filter(
                    UserCareerProfile.session_id == session_id
                ).first()
                
                if not profile:
                    raise ValueError("Profile not found")
                
                # Save user message
                user_message = ConversationMessage(
                    id=str(uuid.uuid4()),
                    session_id=session_id,
                    sender="user",
                    message=processed_input,
                    message_metadata={"phase": session.current_phase.value}
                )
                self.db.add(user_message)
                
                # Process based on current phase with enhanced logic
                response = await self._process_phase_enhanced(session, profile, processed_input)
                
                # Save AI response
                ai_message = ConversationMessage(
                    id=str(uuid.uuid4()),
                    session_id=session_id,
                    sender="ai",
                    message=response.message,
                    message_metadata={
                        "phase": response.phase.value,
                        "follow_up_strategy": response.follow_up_strategy.value if response.follow_up_strategy else None
                    }
                )
                self.db.add(ai_message)
                
                return response
                
        except Exception as e:
            logger.error(f"Failed to process response: {str(e)}")
            raise
    
    async def _process_phase_enhanced(self, session: ConversationSession, 
                                    profile: UserCareerProfile, user_input: str) -> ConversationResponse:
        """Enhanced phase processing with dynamic transitions"""
        
        if session.current_phase == ConversationPhase.INTRODUCTION:
            return await self._process_introduction_enhanced(session, profile, user_input)
        elif session.current_phase == ConversationPhase.STORY_DISCOVERY:
            return await self._process_story_discovery_enhanced(session, profile, user_input)
        elif session.current_phase == ConversationPhase.ACHIEVEMENT_MINING:
            return await self._process_achievement_mining_enhanced(session, profile, user_input)
        else:
            return await self._process_synthesis_enhanced(session, profile, user_input)
    
    async def _process_introduction_enhanced(self, session: ConversationSession, 
                                           profile: UserCareerProfile, user_input: str) -> ConversationResponse:
        """Enhanced introduction processing"""
        
        # Extract name and role with better patterns
        name = self._extract_name_enhanced(user_input)
        role = self._extract_role_enhanced(user_input)
        
        # Update profile
        if name:
            profile.name = name
        if role:
            profile.target_role = role
            
        # Progress to story discovery
        session.current_phase = ConversationPhase.STORY_DISCOVERY
        
        # Get role-specific questions
        role_questions = self.get_role_specific_questions(role or "")
        selected_question = role_questions[0] if role_questions else "Tell me about your most significant professional achievement."
        
        response_message = f"""Perfect, {name or 'there'}! Targeting a {role or 'professional'} role - excellent choice.

**Let's dive into your background using the CAR framework:**

{selected_question}

I want to understand:
- **Context**: What was the situation or challenge? 
- **Action**: What specific actions did you take?
- **Results**: What was the measurable impact?

*Be specific with numbers, percentages, timelines, and business outcomes. This will form the foundation of your compelling resume story.* 🎯"""

        return ConversationResponse(
            message=response_message,
            phase=ConversationPhase.STORY_DISCOVERY,
            progress_percentage=25.0,
            session_id=session.id
        )
    
    async def _process_story_discovery_enhanced(self, session: ConversationSession,
                                              profile: UserCareerProfile, user_input: str) -> ConversationResponse:
        """Enhanced story discovery with intelligent follow-ups"""
        
        # Enhanced response quality analysis
        follow_up_strategy, confidence_score = self.follow_up_system.analyze_response_quality(user_input)
        
        # Enhanced CAR and REST extraction
        car_experience = self.rocket_framework.enhanced_car_extraction(user_input)
        rest_metrics = self.rocket_framework.enhanced_rest_extraction(user_input)
        
        # Store experience with quality metadata
        experience = WorkExperienceData(
            car_structure=car_experience,
            rest_metrics=rest_metrics
        )
        
        # Update profile
        current_experiences = profile.work_experiences or []
        experience_dict = experience.dict()
        experience_dict['confidence_score'] = confidence_score
        current_experiences.append(experience_dict)
        profile.work_experiences = current_experiences
        
        # Dynamic phase transition based on response quality
        if confidence_score > 0.7 and follow_up_strategy == FollowUpStrategy.PROCEED:
            # High quality response - move to achievement mining
            session.current_phase = ConversationPhase.ACHIEVEMENT_MINING
            
            # Get role-specific follow-up question
            role_questions = self.get_role_specific_questions(profile.target_role or "")
            next_question = role_questions[1] if len(role_questions) > 1 else "Tell me about another significant accomplishment."
            
            response_message = f"""Excellent! I can see strong results in your experience with {confidence_score:.1%} confidence.

**Let's mine more achievements using the REST framework:**

{next_question}

Focus on:
- **R**esults: Direct business impact  
- **E**fficiency: Time/resource savings
- **S**cope: People/systems affected
- **T**ime: Speed of achievement

What's another proud moment in your career?"""

            progress = 50.0
        else:
            # Needs improvement - provide targeted follow-up
            follow_up_templates = {
                FollowUpStrategy.QUANTIFICATION_PROBE: [
                    "Great start! Can you add specific numbers to that impact?",
                    "What was the measurable result of this achievement?",
                    "How would you quantify the success of this initiative?"
                ],
                FollowUpStrategy.CONFIDENCE_BOOST: [
                    "I sense you're underselling yourself. What was the bigger picture result?",
                    "You were clearly instrumental in this success. What was your specific contribution?",
                    "Don't be modest - what was the full impact you created?"
                ],
                FollowUpStrategy.CLARIFICATION: [
                    "Can you be more specific about the scope of this project?",
                    "Help me understand the exact details of what you accomplished.",
                    "What were the concrete outcomes of your work?"
                ]
            }
            
            selected_follow_up = follow_up_templates.get(follow_up_strategy, ["Can you provide more specific details?"])[0]
            
            response_message = f"""{selected_follow_up}

Looking at your response (confidence: {confidence_score:.1%}), I can see the potential for a strong achievement. Let's refine it:

**Current CAR structure:**
- **Context**: {car_experience.context}
- **Action**: {car_experience.action}  
- **Results**: {car_experience.results}

Can you enhance this with specific numbers, percentages, or measurable outcomes?"""

            progress = 35.0
        
        return ConversationResponse(
            message=response_message,
            phase=session.current_phase,
            follow_up_strategy=follow_up_strategy,
            progress_percentage=progress,
            session_id=session.id
        )
    
    def _extract_name_enhanced(self, message: str) -> Optional[str]:
        """Enhanced name extraction with more patterns"""
        name_patterns = [
            r"(?:i'm|i am|my name is|call me|i go by)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)",
            r"^hi,?\s*i'm\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)",
            r"^([a-zA-Z]+)(?:\s+[a-zA-Z]+)?(?:\s|,|\.|\s+and)",
            r"hello,?\s*i'm\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)"
        ]
        
        for pattern in name_patterns:
            match = re.search(pattern, message, re.IGNORECASE)
            if match and len(match.group(1).strip()) > 1:
                name = match.group(1).strip().title()
                # Validate it's actually a name (not common words)
                common_words = ['the', 'and', 'but', 'for', 'with', 'from', 'they', 'this', 'that']
                if name.lower() not in common_words:
                    return name
        return None
    
    def _extract_role_enhanced(self, message: str) -> Optional[str]:
        """Enhanced role extraction with comprehensive role database"""
        roles = {
            # Technology roles
            'software engineer': 'Software Engineer',
            'software developer': 'Software Developer',
            'full stack developer': 'Full Stack Developer',
            'frontend developer': 'Frontend Developer', 
            'backend developer': 'Backend Developer',
            'data scientist': 'Data Scientist',
            'data analyst': 'Data Analyst',
            'devops engineer': 'DevOps Engineer',
            'cloud engineer': 'Cloud Engineer',
            'security engineer': 'Security Engineer',
            'mobile developer': 'Mobile Developer',
            'web developer': 'Web Developer',
            
            # Management roles
            'product manager': 'Product Manager',
            'project manager': 'Project Manager',
            'engineering manager': 'Engineering Manager',
            'technical lead': 'Technical Lead',
            'team lead': 'Team Lead',
            
            # Business roles
            'business analyst': 'Business Analyst',
            'marketing manager': 'Marketing Manager',
            'sales manager': 'Sales Manager',
            'account manager': 'Account Manager',
            'consultant': 'Consultant',
            'business consultant': 'Business Consultant',
            
            # Design roles
            'ux designer': 'UX Designer',
            'ui designer': 'UI Designer',
            'product designer': 'Product Designer',
            'graphic designer': 'Graphic Designer',
            
            # Other roles
            'architect': 'Solutions Architect',
            'designer': 'Designer',
            'developer': 'Developer',
            'engineer': 'Engineer',
            'manager': 'Manager',
            'analyst': 'Analyst'
        }
        
        message_lower = message.lower()
        
        # Sort by length (longest first) to match more specific roles first
        sorted_roles = sorted(roles.items(), key=lambda x: len(x[0]), reverse=True)
        
        for key, value in sorted_roles:
            if key in message_lower:
                return value
        return None
    
    # Add more enhanced methods for achievement mining and synthesis...
    async def _process_achievement_mining_enhanced(self, session: ConversationSession,
                                                  profile: UserCareerProfile, user_input: str) -> ConversationResponse:
        """Enhanced achievement mining with better completion detection"""
        
        # Extract and analyze the new experience
        follow_up_strategy, confidence_score = self.follow_up_system.analyze_response_quality(user_input)
        car_experience = self.rocket_framework.enhanced_car_extraction(user_input)
        rest_metrics = self.rocket_framework.enhanced_rest_extraction(user_input)
        
        experience = WorkExperienceData(
            car_structure=car_experience,
            rest_metrics=rest_metrics
        )
        
        # Update profile
        current_experiences = profile.work_experiences or []
        experience_dict = experience.dict()
        experience_dict['confidence_score'] = confidence_score
        current_experiences.append(experience_dict)
        profile.work_experiences = current_experiences
        
        # Calculate average confidence across all experiences
        avg_confidence = sum(exp.get('confidence_score', 0.5) for exp in current_experiences) / len(current_experiences)
        
        # Dynamic synthesis trigger based on quality and quantity
        should_synthesize = (
            len(current_experiences) >= 3 or  # Have enough experiences
            (len(current_experiences) >= 2 and avg_confidence > 0.8)  # High quality with fewer experiences
        )
        
        if should_synthesize:
            # Move to synthesis
            session.current_phase = ConversationPhase.SYNTHESIS
            
            # Generate enhanced personal story
            user_messages = self.db.query(ConversationMessage).filter(
                ConversationMessage.session_id == session.id,
                ConversationMessage.sender == "user"
            ).all()
            all_responses = [msg.message for msg in user_messages]
            personal_story = self.rocket_framework.analyze_personal_story(all_responses)
            
            # Build enhanced resume summary
            experiences_obj = [WorkExperienceData(**{k: v for k, v in exp.items() if k != 'confidence_score'}) 
                             for exp in current_experiences]
            resume_summary = self.rocket_framework.build_resume_summary(personal_story, experiences_obj)
            
            # Update profile with enhanced scoring
            profile.personal_story = personal_story.story_statement
            profile.resume_summary_bullets = resume_summary.bullets
            profile.story_coherence_score = personal_story.coherence_score
            profile.achievement_quantification = avg_confidence
            
            response_message = f"""🚀 **ROCKET Launch Complete, {profile.name}!**

I now have rich material to create your bulletproof resume. Based on our conversation, I can see you're a {personal_story.role_identity or 'strategic professional'} with unique strengths.

**Your ROCKET-Powered Resume Summary:**
**{resume_summary.title}**

{chr(10).join(f"• {bullet}" for bullet in resume_summary.bullets)}

**Enhanced ROCKET Framework Scores:**
- Story Coherence: {personal_story.coherence_score:.1%}
- Achievement Quantification: {avg_confidence:.1%}
- Experience Quality: {len([exp for exp in current_experiences if exp.get('confidence_score', 0) > 0.7])}/{len(current_experiences)} high-quality

Your resume is now optimized using the ROCKET Framework! 🚀

**Next Steps:**
1. Review and refine any bullets above
2. Add skills and education details
3. Export your final resume

Is there anything you'd like to adjust in your resume summary?"""

            progress = 90.0
        else:
            # Continue mining more achievements
            role_questions = self.get_role_specific_questions(profile.target_role or "")
            next_question = (
                role_questions[2] if len(role_questions) > 2 
                else "Tell me about one more significant accomplishment that showcases your unique value."
            )
            
            response_message = f"""Great achievement! I can see the impact you created (confidence: {confidence_score:.1%}).

**Let's capture one more significant accomplishment:**

{next_question}

Think about a time when you:
- Led a team or project with measurable outcomes
- Solved a complex problem with quantified results
- Improved a process or system with specific metrics
- Delivered exceptional results under pressure

*Remember: Context, Action, Results with specific numbers* 📊"""

            progress = 70.0
        
        return ConversationResponse(
            message=response_message,
            phase=session.current_phase,
            follow_up_strategy=follow_up_strategy,
            progress_percentage=progress,
            session_id=session.id
        )
    
    async def _process_synthesis_enhanced(self, session: ConversationSession,
                                        profile: UserCareerProfile, user_input: str) -> ConversationResponse:
        """Enhanced synthesis with final optimization"""
        
        response_message = f"""🎉 **ROCKET Framework Complete!**

Your AI-optimized resume following the ROCKET Framework is ready for launch!

**What I've created for you:**
✅ **Results-focused positioning** for {profile.target_role or 'your target role'}
✅ **Optimized achievements** using enhanced CAR + REST methodology
✅ **Career-accelerated keywords** based on industry requirements  
✅ **Knowledge-enhanced story** that positions you as THE best choice
✅ **Experience transformation** with quantified impact
✅ **Targeted positioning** for maximum career velocity

**Enhanced Framework Scores:**
- Story Coherence: {profile.story_coherence_score or 0:.1%}
- Achievement Quality: {profile.achievement_quantification or 0:.1%}
- Experience Count: {len(profile.work_experiences or [])} detailed achievements

**Your resume is ready to ROCKET your career!** 🚀

You can now:
- Review your generated resume in the Analysis tab
- Upload job descriptions for targeted optimization
- Download in multiple formats

Thank you for using the ROCKET Framework - Results-Optimized Career Knowledge Enhancement Toolkit!"""

        # Mark session as completed
        session.completed_at = datetime.utcnow()
        
        return ConversationResponse(
            message=response_message,
            phase=ConversationPhase.REVIEW,
            progress_percentage=100.0,
            session_id=session.id
        )