"""
Enhanced Conversation Service Integration

Orchestrates ROCKET Framework, Career Psychologist, and existing AI systems for
sophisticated multi-mode career counseling conversations.

This service provides the central orchestration layer that:
1. Coordinates between ROCKET framework analysis and psychological insights
2. Manages conversation flow and phase transitions
3. Integrates with existing conversation_service.py seamlessly
4. Provides intelligent response routing and context management
5. Ensures backward compatibility with existing resume building features
"""

import asyncio
import json
from datetime import datetime
from typing import Dict, List, Optional, Any, Union
from uuid import uuid4

from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

from ..core.database import AsyncSessionLocal
from ..models.conversation import ConversationSession, ConversationMessage
from ..models.rocket_framework import (
    ROCKETSession, ROCKETPhase, ProcessingMode, ResponseQuality
)
from ..agent.manager import AgentManager
from .conversation_service import ConversationalResumeBuilder
from .rocket_framework_service import ROCKETFrameworkService
from .career_psychologist_service import CareerPsychologistService
from .exceptions import ServiceException


class EnhancedConversationResponse:
    """Enhanced response object with ROCKET and psychological insights"""
    
    def __init__(
        self,
        message: str,
        session_id: str,
        rocket_analysis: Optional[Dict] = None,
        psychological_insight: Optional[Dict] = None,
        conversation_metadata: Optional[Dict] = None,
        next_phase: Optional[ROCKETPhase] = None,
        follow_up_questions: Optional[List[str]] = None,
        progress_percentage: float = 0.0
    ):
        self.message = message
        self.session_id = session_id
        self.rocket_analysis = rocket_analysis or {}
        self.psychological_insight = psychological_insight or {}
        self.conversation_metadata = conversation_metadata or {}
        self.next_phase = next_phase
        self.follow_up_questions = follow_up_questions or []
        self.progress_percentage = progress_percentage
        self.timestamp = datetime.utcnow()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for API responses"""
        return {
            'message': self.message,
            'session_id': self.session_id,
            'rocket_analysis': self.rocket_analysis,
            'psychological_insight': self.psychological_insight,
            'conversation_metadata': self.conversation_metadata,
            'next_phase': self.next_phase.value if self.next_phase else None,
            'follow_up_questions': self.follow_up_questions,
            'progress_percentage': self.progress_percentage,
            'timestamp': self.timestamp.isoformat()
        }


class EnhancedConversationService:
    """
    Enhanced conversation service with ROCKET Framework and psychological analysis integration
    
    Orchestrates multiple AI services to provide comprehensive career counseling
    while maintaining compatibility with existing conversation flows.
    """
    
    def __init__(self, ai_manager: Optional[AgentManager] = None, db_session: Optional[Session] = None):
        self.ai_manager = ai_manager
        self.db_session = db_session
        
        # Initialize component services
        # Note: ConversationalResumeBuilder needs a db session, we'll create it when needed
        self.rocket_service = ROCKETFrameworkService(ai_manager)
        self.psychologist_service = CareerPsychologistService(ai_manager)


    async def start_enhanced_session(
        self, 
        user_id: str,
        processing_mode: ProcessingMode = ProcessingMode.INTEGRATED,
        existing_conversation_id: Optional[str] = None
    ) -> EnhancedConversationResponse:
        """
        Start an enhanced conversation session with ROCKET Framework integration
        
        Can either create a new conversation or enhance an existing one with ROCKET capabilities.
        """
        
        async with AsyncSessionLocal() as session:
            # Create or link to existing conversation session
            if existing_conversation_id:
                conversation_session = await session.get(ConversationSession, existing_conversation_id)
                if not conversation_session:
                    raise ServiceException(f"Conversation session {existing_conversation_id} not found")
            else:
                # Create new conversation session using existing service
                from sqlalchemy import create_engine
                from sqlalchemy.orm import sessionmaker
                from ..core.config import settings
                
                # Create sync session for ConversationalResumeBuilder  
                sync_engine = create_engine(settings.SYNC_DATABASE_URL)
                SyncSession = sessionmaker(bind=sync_engine)
                sync_session = SyncSession()
                
                conversation_service = ConversationalResumeBuilder(sync_session)
                conversation_response = await conversation_service.initiate_conversation(user_id)
                conversation_session_id = conversation_response.session_id
                
                sync_session.close()
                conversation_session = await session.get(ConversationSession, conversation_session_id)
            
            # Create ROCKET session
            rocket_session = await self.rocket_service.create_rocket_session(
                user_id=user_id,
                conversation_session_id=conversation_session.id,
                processing_mode=processing_mode
            )
            
            # Generate welcome message with Dr. Maya introduction
            welcome_message = await self._generate_enhanced_welcome_message(
                rocket_session, processing_mode
            )
            
            # Save initial message
            await self._save_conversation_message(
                conversation_session.id, 'ai', welcome_message['message']
            )
            
            return EnhancedConversationResponse(
                message=welcome_message['message'],
                session_id=conversation_session.id,
                rocket_analysis={'session_id': rocket_session.id, 'phase': ROCKETPhase.INTRODUCTION.value},
                psychological_insight=welcome_message.get('psychological_setup', {}),
                follow_up_questions=welcome_message.get('follow_up_questions', []),
                progress_percentage=5.0  # Initial progress
            )


    async def process_user_response(
        self, 
        session_id: str,
        user_input: str,
        processing_mode: Optional[str] = None
    ) -> EnhancedConversationResponse:
        """
        Process user response through integrated ROCKET Framework and psychological analysis
        
        Main orchestration method that routes user input through appropriate analysis
        and generates comprehensive responses.
        """
        
        async with AsyncSessionLocal() as session:
            # Get conversation and ROCKET session
            conversation_session = await session.get(ConversationSession, session_id)
            if not conversation_session:
                raise ServiceException(f"Session {session_id} not found")
            
            # Find associated ROCKET session
            rocket_session = None
            if conversation_session.rocket_session:
                rocket_session = conversation_session.rocket_session
            
            # Save user message
            await self._save_conversation_message(session_id, 'user', user_input)
            
            # Route to integrated processing
            return await self._process_integrated_response(
                session_id, user_input, rocket_session
            )


    async def _process_integrated_response(
        self, 
        session_id: str,
        user_input: str,
        rocket_session: ROCKETSession
    ) -> EnhancedConversationResponse:
        """
        Process response using integrated ROCKET Framework and psychological analysis
        
        This is the main integration method that coordinates all services.
        """
        
        # Get conversation history for context
        conversation_history = await self._get_conversation_history(session_id)
        
        # Basic response for now - full implementation continues in next phase
        ai_response = (
            "Thank you for your response! I'm analyzing your input using the ROCKET Framework "
            "and psychological insights. This enhanced system will help us create a more "
            "compelling and authentic professional profile for you."
        )
        
        # Calculate basic progress
        progress = min(len(conversation_history) * 10, 90)
        
        # Save AI response
        await self._save_conversation_message(session_id, 'ai', ai_response)
        
        return EnhancedConversationResponse(
            message=ai_response,
            session_id=session_id,
            rocket_analysis={'phase': 'introduction', 'status': 'processing'},
            psychological_insight={'dr_maya_active': True},
            follow_up_questions=[
                "Can you tell me more about your current role?",
                "What type of position are you targeting?",
                "What achievements are you most proud of?"
            ],
            progress_percentage=float(progress)
        )


    # ============================================================================
    # HELPER METHODS - Session Management and Response Generation
    # ============================================================================

    async def _generate_enhanced_welcome_message(
        self, 
        rocket_session: ROCKETSession,
        processing_mode: ProcessingMode
    ) -> Dict[str, Any]:
        """Generate enhanced welcome message introducing ROCKET Framework and Dr. Maya"""
        
        message = (
            "Welcome to your enhanced resume building experience! I'm excited to work with you today. "
            "You'll be working with both our ROCKET Framework for strategic resume development and "
            "Dr. Maya Insight, our Career Psychologist, who will help us understand how your personality "
            "and work style contribute to your professional success.\n\n"
            "Together, we'll not only create a compelling resume but also help you understand and "
            "articulate your unique professional value. Let's start by getting to know you better."
        )
        
        follow_up_questions = [
            "What's your current role and industry?",
            "What type of position are you targeting?",
            "What aspects of your work do you find most energizing?"
        ]
        
        return {
            'message': message,
            'follow_up_questions': follow_up_questions,
            'psychological_setup': {
                'dr_maya_available': True,
                'rocket_framework_active': True
            }
        }


    async def _get_conversation_history(self, session_id: str) -> List[str]:
        """Get conversation history as list of user messages"""
        async with AsyncSessionLocal() as session:
            messages = session.query(ConversationMessage).filter(
                and_(
                    ConversationMessage.session_id == session_id,
                    ConversationMessage.sender == 'user'
                )
            ).order_by(ConversationMessage.created_at).all()
            
            return [msg.message for msg in messages]


    async def _save_conversation_message(
        self, 
        session_id: str, 
        sender: str, 
        message: str,
        metadata: Optional[Dict] = None
    ) -> None:
        """Save conversation message to database"""
        async with AsyncSessionLocal() as session:
            conversation_message = ConversationMessage(
                id=str(uuid4()),
                session_id=session_id,
                sender=sender,
                message=message,
                message_metadata=metadata or {}
            )
            
            session.add(conversation_message)
            await session.commit()