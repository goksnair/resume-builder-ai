import uuid
import re
from typing import Optional, List, Dict, Any
from datetime import datetime

from sqlalchemy.orm import Session
from sqlalchemy import and_

from ..models.conversation import ConversationSession, ConversationMessage, UserCareerProfile, ConversationPhase
from ..schemas.pydantic.conversation import (
    ResumeConversationState, ConversationResponse, PersonalStory, 
    CARExperience, RESTMetrics, WorkExperienceData, FollowUpStrategy,
    IntelligenceScores, PersonalityProfile, ResumeSummary
)


class ROCKETFramework:
    """Implementation of ROCKET Framework - Results-Optimized Career Knowledge Enhancement Toolkit"""
    
    @staticmethod
    def analyze_personal_story(responses: List[str]) -> PersonalStory:
        """Extract personal story using ROCKET Framework"""
        combined_text = " ".join(responses).lower()
        
        # Extract role identity
        role_patterns = [
            r"i'm (?:a |an |the )?([^,\.\n]+?)(?:who|that|with)",
            r"(?:i am|i'm) (?:a |an |the )?([^,\.\n]+)",
            r"as (?:a |an |the )?([^,\.\n]+)"
        ]
        
        role_identity = None
        for pattern in role_patterns:
            match = re.search(pattern, combined_text)
            if match:
                role_identity = match.group(1).strip()
                break
        
        # Extract value proposition
        value_patterns = [
            r"help(?:s?|ing)?\s+(?:companies?|organizations?|teams?)\s+([^,\.\n]+)",
            r"(?:achieve|deliver|drive|create)\s+([^,\.\n]+)",
            r"specialize(?:s?|ing)?\s+in\s+([^,\.\n]+)"
        ]
        
        value_proposition = None
        for pattern in value_patterns:
            match = re.search(pattern, combined_text)
            if match:
                value_proposition = match.group(1).strip()
                break
        
        # Calculate coherence based on story elements
        coherence_score = 0.0
        if role_identity:
            coherence_score += 0.4
        if value_proposition:
            coherence_score += 0.4
        if len(responses) >= 3:
            coherence_score += 0.2
            
        story_statement = None
        if role_identity and value_proposition:
            story_statement = f"I'm the {role_identity} who can help companies achieve {value_proposition}"
        
        return PersonalStory(
            role_identity=role_identity,
            value_proposition=value_proposition,
            story_statement=story_statement,
            coherence_score=coherence_score
        )
    
    @staticmethod
    def extract_car_structure(experience_text: str) -> CARExperience:
        """Extract CAR (Context-Action-Results) from experience description"""
        # Simple NLP extraction - in production, use advanced NLP models
        sentences = experience_text.split('.')
        
        context = ""
        action = ""
        results = ""
        
        # Look for context indicators
        context_indicators = ["situation", "challenge", "problem", "faced", "when", "during"]
        action_indicators = ["implemented", "led", "developed", "created", "managed", "optimized"]
        result_indicators = ["result", "impact", "outcome", "achieved", "increased", "decreased", "improved"]
        
        for sentence in sentences:
            sentence_lower = sentence.lower()
            if any(indicator in sentence_lower for indicator in context_indicators) and not context:
                context = sentence.strip()
            elif any(indicator in sentence_lower for indicator in action_indicators) and not action:
                action = sentence.strip()
            elif any(indicator in sentence_lower for indicator in result_indicators) and not results:
                results = sentence.strip()
        
        # Fallback: use first three sentences if specific patterns not found
        if not context and len(sentences) > 0:
            context = sentences[0].strip()
        if not action and len(sentences) > 1:
            action = sentences[1].strip()
        if not results and len(sentences) > 2:
            results = sentences[2].strip()
            
        return CARExperience(
            context=context or "Context to be refined",
            action=action or "Actions to be detailed",
            results=results or "Results to be quantified"
        )
    
    @staticmethod
    def extract_rest_metrics(experience_text: str) -> RESTMetrics:
        """Extract REST metrics from experience text"""
        text_lower = experience_text.lower()
        
        # Extract numbers and percentages
        numbers = re.findall(r'\d+(?:\.\d+)?%?', experience_text)
        
        results = None
        efficiency = None
        scope = None
        time = None
        
        # Results: Revenue, profit, business impact
        if any(word in text_lower for word in ['revenue', 'profit', 'sales', 'growth', 'roi']):
            relevant_numbers = [n for n in numbers if '%' in n or any(currency in experience_text for currency in ['$', '€', '£'])]
            if relevant_numbers:
                results = f"Generated {relevant_numbers[0]} business impact"
        
        # Efficiency: Time or cost savings
        if any(word in text_lower for word in ['saved', 'reduced', 'optimized', 'streamlined']):
            if numbers:
                efficiency = f"Achieved {numbers[0]} efficiency improvement"
        
        # Scope: People, systems, processes affected
        scope_numbers = [n for n in numbers if not '%' in n]
        if scope_numbers and any(word in text_lower for word in ['team', 'people', 'users', 'customers']):
            scope = f"Impacted {scope_numbers[0]} stakeholders"
        
        # Time: Speed of achievement
        if any(word in text_lower for word in ['months', 'weeks', 'days', 'quarterly']):
            time_matches = re.findall(r'\d+\s*(?:months?|weeks?|days?)', text_lower)
            if time_matches:
                time = f"Delivered in {time_matches[0]}"
        
        return RESTMetrics(
            results=results,
            efficiency=efficiency,
            scope=scope,
            time=time
        )
    
    @staticmethod
    def build_resume_summary(personal_story: PersonalStory, experiences: List[WorkExperienceData]) -> ResumeSummary:
        """Build ROCKET Framework 5-bullet resume summary"""
        bullets = []
        
        # Bullet 1: Career overview with quantified results
        if personal_story.story_statement:
            bullets.append(personal_story.story_statement)
        else:
            bullets.append("Results-driven professional with proven track record of delivering exceptional outcomes")
        
        # Bullets 2-5: Key selling points from experiences
        for i, exp in enumerate(experiences[:4]):
            if exp.rest_metrics and exp.rest_metrics.results:
                bullets.append(exp.rest_metrics.results)
            elif exp.car_structure and exp.car_structure.results:
                bullets.append(exp.car_structure.results)
            else:
                bullets.append(f"Expertise in {exp.title or 'professional domain'} with measurable impact")
        
        # Ensure exactly 5 bullets
        while len(bullets) < 5:
            bullets.append("Strong analytical and problem-solving capabilities with focus on business results")
        
        return ResumeSummary(
            title=personal_story.role_identity or "Strategic Professional",
            bullets=bullets[:5]
        )


class IntelligentFollowUp:
    """Intelligent follow-up system for deeper conversation insights"""
    
    @staticmethod
    def analyze_response_quality(response: str) -> FollowUpStrategy:
        """Determine if response needs deeper probing"""
        
        quality_indicators = {
            "has_numbers": bool(re.search(r'\d+', response)),
            "specific_details": len(response.split()) > 20,
            "business_impact": any(word in response.lower() for word in 
                                  ['revenue', 'cost', 'efficiency', 'growth', 'roi', 'profit']),
            "modesty_indicators": any(phrase in response.lower() for phrase in 
                                    ['helped', 'assisted', 'contributed', 'supported']),
            "vague_language": any(phrase in response.lower() for phrase in 
                                ['some', 'a few', 'several', 'many', 'various'])
        }
        
        if not quality_indicators["has_numbers"]:
            return FollowUpStrategy.QUANTIFICATION_PROBE
        elif quality_indicators["modesty_indicators"]:
            return FollowUpStrategy.CONFIDENCE_BOOST
        elif quality_indicators["vague_language"]:
            return FollowUpStrategy.CLARIFICATION
        elif not quality_indicators["specific_details"]:
            return FollowUpStrategy.DEPTH_EXPLORATION
        else:
            return FollowUpStrategy.PROCEED


class ConversationalResumeBuilder:
    """Main conversation service implementing ROCKET Framework"""
    
    def __init__(self, db: Session):
        self.db = db
        self.rocket_framework = ROCKETFramework()
        self.follow_up_system = IntelligentFollowUp()
        
        # Conversation templates
        self.phase_questions = {
            ConversationPhase.INTRODUCTION: [
                "What role are you targeting, and what drew you to this field?",
                "In one sentence: I'm the _______ who can help companies _______"
            ],
            ConversationPhase.STORY_DISCOVERY: [
                "Tell me about a time when you made a significant impact at work. What was the situation?",
                "What's the one thing you want hiring managers to remember about you?",
                "Describe a challenge you faced that showcased your unique abilities."
            ],
            ConversationPhase.ACHIEVEMENT_MINING: [
                "Let's unpack this achievement. What was the context or challenge?",
                "What specific actions did you take?",
                "What was the measurable outcome?",
                "How did this impact the business?"
            ]
        }
        
        self.follow_up_templates = {
            FollowUpStrategy.QUANTIFICATION_PROBE: [
                "Great! Can you put some numbers to that impact?",
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
    
    async def initiate_conversation(self, user_id: Optional[str] = None) -> ConversationResponse:
        """Start conversation with ROCKET Framework introduction"""
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
        self.db.commit()
        
        welcome_message = """🚀 **Welcome to the ROCKET Framework!**

I'm here to help you create a bulletproof resume that positions you as THE best choice for your target role.

**ROCKET = Results-Optimized Career Knowledge Enhancement Toolkit**
🎯 **R**esults-focused positioning - Your unique value story
🚀 **O**ptimized achievement structure - CAR + REST methodology  
📈 **C**areer acceleration strategy - Industry-specific optimization
🔑 **K**eyword enhancement - ATS-optimized content
⚡ **E**xperience transformation - Quantified impact stories
🎪 **T**argeted positioning - Strategic career narrative

Let's ROCKET your career! What role are you targeting?"""

        # Save initial AI message
        initial_message = ConversationMessage(
            id=str(uuid.uuid4()),
            session_id=session_id,
            sender="ai",
            message=welcome_message,
            message_metadata={"phase": ConversationPhase.INTRODUCTION.value}
        )
        
        self.db.add(initial_message)
        self.db.commit()
        
        return ConversationResponse(
            message=welcome_message,
            phase=ConversationPhase.INTRODUCTION,
            questions=self.phase_questions[ConversationPhase.INTRODUCTION],
            session_id=session_id,
            progress_percentage=10.0
        )
        
    async def process_response(self, session_id: str, user_input: str) -> ConversationResponse:
        """Process user response through ROCKET Framework methodology"""
        
        # Get session and profile
        session = self.db.query(ConversationSession).filter(ConversationSession.id == session_id).first()
        if not session:
            raise ValueError("Session not found")
            
        profile = self.db.query(UserCareerProfile).filter(UserCareerProfile.session_id == session_id).first()
        if not profile:
            raise ValueError("Profile not found")
        
        # Save user message
        user_message = ConversationMessage(
            id=str(uuid.uuid4()),
            session_id=session_id,
            sender="user",
            message=user_input,
            message_metadata={"phase": session.current_phase.value}
        )
        self.db.add(user_message)
        
        # Process based on current phase
        if session.current_phase == ConversationPhase.INTRODUCTION:
            response = await self._process_introduction_phase(session, profile, user_input)
        elif session.current_phase == ConversationPhase.STORY_DISCOVERY:
            response = await self._process_story_discovery_phase(session, profile, user_input)
        elif session.current_phase == ConversationPhase.ACHIEVEMENT_MINING:
            response = await self._process_achievement_mining_phase(session, profile, user_input)
        else:
            response = await self._process_synthesis_phase(session, profile, user_input)
        
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
        self.db.commit()
        
        return response
    
    async def _process_introduction_phase(self, session: ConversationSession, 
                                       profile: UserCareerProfile, user_input: str) -> ConversationResponse:
        """Process introduction phase with role and name extraction"""
        
        # Extract name and role
        name = self._extract_name(user_input)
        role = self._extract_role(user_input)
        
        # Update profile
        if name:
            profile.name = name
        if role:
            profile.target_role = role
            
        # Progress to story discovery
        session.current_phase = ConversationPhase.STORY_DISCOVERY
        
        response_message = f"""Perfect, {name or 'there'}! Targeting a {role or 'professional'} role - excellent choice.

**Let's dive into your background using the CAR framework:**

Tell me about your most significant professional achievement. I want to understand:
- **Context**: What was the situation or challenge? 
- **Action**: What specific actions did you take?
- **Results**: What was the measurable impact?

*Be specific with numbers, timelines, and outcomes. This will form the foundation of your compelling resume story.* 🎯"""

        return ConversationResponse(
            message=response_message,
            phase=ConversationPhase.STORY_DISCOVERY,
            progress_percentage=25.0,
            session_id=session.id
        )
    
    async def _process_story_discovery_phase(self, session: ConversationSession,
                                           profile: UserCareerProfile, user_input: str) -> ConversationResponse:
        """Process story discovery with intelligent follow-up"""
        
        # Analyze response quality
        follow_up_strategy = self.follow_up_system.analyze_response_quality(user_input)
        
        # Extract CAR structure
        car_experience = self.rocket_framework.extract_car_structure(user_input)
        rest_metrics = self.rocket_framework.extract_rest_metrics(user_input)
        
        # Store experience
        experience = WorkExperienceData(
            car_structure=car_experience,
            rest_metrics=rest_metrics
        )
        
        # Update profile
        current_experiences = profile.work_experiences or []
        current_experiences.append(experience.dict())
        profile.work_experiences = current_experiences
        
        # Determine response based on follow-up strategy
        if follow_up_strategy == FollowUpStrategy.PROCEED:
            # Move to achievement mining
            session.current_phase = ConversationPhase.ACHIEVEMENT_MINING
            
            response_message = f"""Excellent! I can see strong results in your experience.

**Let's mine more achievements using the REST framework:**

Tell me about another significant accomplishment, focusing on:
- **R**esults: Direct business impact  
- **E**fficiency: Time/resource savings
- **S**cope: People/systems affected
- **T**ime: Speed of achievement

What's another proud moment in your career?"""

            progress = 50.0
        else:
            # Stay in story discovery with follow-up
            follow_ups = self.follow_up_templates.get(follow_up_strategy, [])
            selected_follow_up = follow_ups[0] if follow_ups else "Can you provide more specific details?"
            
            response_message = f"""{selected_follow_up}

Looking at your response, I can see the potential for a strong achievement. Let's refine it:

**Current structure:**
- Context: {car_experience.context}
- Action: {car_experience.action}  
- Results: {car_experience.results}

Can you enhance this with specific numbers, percentages, or measurable outcomes?"""

            progress = 35.0
        
        return ConversationResponse(
            message=response_message,
            phase=session.current_phase,
            follow_up_strategy=follow_up_strategy,
            progress_percentage=progress,
            session_id=session.id
        )
    
    async def _process_achievement_mining_phase(self, session: ConversationSession,
                                              profile: UserCareerProfile, user_input: str) -> ConversationResponse:
        """Process achievement mining phase"""
        
        # Extract additional experience
        car_experience = self.rocket_framework.extract_car_structure(user_input)
        rest_metrics = self.rocket_framework.extract_rest_metrics(user_input)
        
        experience = WorkExperienceData(
            car_structure=car_experience,
            rest_metrics=rest_metrics
        )
        
        # Update profile
        current_experiences = profile.work_experiences or []
        current_experiences.append(experience.dict())
        profile.work_experiences = current_experiences
        
        # Check if we have enough experiences
        if len(current_experiences) >= 3:
            # Move to synthesis
            session.current_phase = ConversationPhase.SYNTHESIS
            
            # Generate personal story
            user_messages = self.db.query(ConversationMessage).filter(
                ConversationMessage.session_id == session_id,
                ConversationMessage.sender == "user"
            ).all()
            all_responses = [msg.message for msg in user_messages]
            personal_story = self.rocket_framework.analyze_personal_story(all_responses)
            
            # Build resume summary
            experiences_obj = [WorkExperienceData(**exp) for exp in current_experiences]
            resume_summary = self.rocket_framework.build_resume_summary(personal_story, experiences_obj)
            
            # Update profile
            profile.personal_story = personal_story.story_statement
            profile.resume_summary_bullets = resume_summary.bullets
            profile.story_coherence_score = personal_story.coherence_score
            
            response_message = f"""🚀 **ROCKET Launch Complete, {profile.name}!**

I now have rich material to create your bulletproof resume. Based on our conversation, I can see you're a {personal_story.role_identity or 'strategic professional'} with unique strengths.

**Your ROCKET-Powered Resume Summary:**
**{resume_summary.title}**

{chr(10).join(f"• {bullet}" for bullet in resume_summary.bullets)}

**ROCKET Framework Scores:**
- Story Coherence: {personal_story.coherence_score:.1%}
- Achievement Quantification: {self._calculate_quantification_score(current_experiences):.1%}

Your resume is now optimized using the ROCKET Framework! 🚀

**Next Steps:**
1. Review and refine any bullets above
2. Add skills and education details
3. Export your final resume

Is there anything you'd like to adjust in your resume summary?"""

            progress = 90.0
        else:
            # Continue mining more achievements
            response_message = f"""Great achievement! I can see the impact you created.

**Let's capture one more significant accomplishment:**

Think about a time when you:
- Led a team or project
- Solved a complex problem  
- Improved a process or system
- Delivered exceptional results

What's another example that showcases your unique value?

*Remember: Context, Action, Results with specific numbers* 📊"""

            progress = 70.0
        
        return ConversationResponse(
            message=response_message,
            phase=session.current_phase,
            progress_percentage=progress,
            session_id=session.id
        )
    
    async def _process_synthesis_phase(self, session: ConversationSession,
                                     profile: UserCareerProfile, user_input: str) -> ConversationResponse:
        """Process final synthesis and refinement"""
        
        response_message = f"""🎉 **ROCKET Framework Complete!**

Your AI-optimized resume following the ROCKET Framework is ready for launch!

**What I've created for you:**
✅ **Results-focused positioning** for {profile.target_role or 'your target role'}
✅ **Optimized achievements** using CAR + REST methodology
✅ **Career-accelerated keywords** based on industry requirements  
✅ **Knowledge-enhanced story** that positions you as THE best choice
✅ **Experience transformation** with quantified impact
✅ **Targeted positioning** for maximum career velocity

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
    
    def _extract_name(self, message: str) -> Optional[str]:
        """Extract name from user message"""
        name_patterns = [
            r"(?:i'm|i am|my name is|call me|i go by)\s+([a-zA-Z]+)",
            r"^hi,?\s*i'm\s+([a-zA-Z]+)",
            r"^([a-zA-Z]+)(?:\s|,|\.)"
        ]
        
        for pattern in name_patterns:
            match = re.search(pattern, message, re.IGNORECASE)
            if match and len(match.group(1)) > 1:
                return match.group(1).title()
        return None
    
    def _extract_role(self, message: str) -> Optional[str]:
        """Extract target role from user message"""
        roles = {
            'software engineer': 'Software Engineer',
            'product manager': 'Product Manager',
            'data scientist': 'Data Scientist',
            'marketing manager': 'Marketing Manager',
            'business analyst': 'Business Analyst',
            'project manager': 'Project Manager',
            'consultant': 'Consultant',
            'designer': 'Designer',
            'developer': 'Developer'
        }
        
        message_lower = message.lower()
        for key, value in roles.items():
            if key in message_lower:
                return value
        return None
    
    def _calculate_quantification_score(self, experiences: List[Dict]) -> float:
        """Calculate achievement quantification score"""
        if not experiences:
            return 0.0
            
        quantified_count = 0
        for exp in experiences:
            if exp.get('rest_metrics'):
                metrics = exp['rest_metrics']
                if any(metrics.get(key) for key in ['results', 'efficiency', 'scope', 'time']):
                    quantified_count += 1
            elif exp.get('car_structure', {}).get('results'):
                if re.search(r'\d+', exp['car_structure']['results']):
                    quantified_count += 1
                    
        return quantified_count / len(experiences)