import { useState, useCallback, useEffect, useRef } from 'react';
import rocketAPI from '../services/rocketAPI';

/**
 * Custom hook for managing ROCKET Framework session state
 * 
 * Provides session management, message handling, and progress tracking
 * for the ROCKET Framework career coaching experience
 * 
 * @param {string} userId - User identifier
 * @returns {Object} Session state and control methods
 */
export const useROCKETSession = (userId) => {
    // Core session state
    const [session, setSession] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isSessionActive, setIsSessionActive] = useState(false);

    // Progress tracking
    const [progress, setProgress] = useState({
        story_completion: 0,
        experience_mining: 0,
        quantification_rate: 0,
        overall_score: 0
    });

    const [componentsStatus, setComponentsStatus] = useState({
        personal_story: false,
        experiences_count: 0,
        quantified_achievements: 0,
        session_active: false
    });

    // Personality analysis state
    const [personalityAnalysis, setPersonalityAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Refs for managing state
    const sessionRef = useRef(session);
    const messagesRef = useRef(messages);

    // Update refs when state changes
    useEffect(() => {
        sessionRef.current = session;
        messagesRef.current = messages;
    }, [session, messages]);

    /**
     * Start a new ROCKET session
     */
    const startSession = useCallback(async (sessionType = 'integrated') => {
        if (!userId) {
            setError('User ID is required to start session');
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const sessionData = await rocketAPI.startSession(userId, sessionType);

            setSession(sessionData);
            setIsSessionActive(true);
            setProgress(sessionData.rocket_progress);
            setComponentsStatus(sessionData.components_status);
            setPersonalityAnalysis(sessionData.personality_analysis);

            // Add welcome message
            const welcomeMessage = {
                id: `msg_${Date.now()}`,
                sender: 'ai',
                content: `Welcome to the ROCKET Framework! I'm here to help you build a compelling career narrative. Let's start by understanding your professional background. What role are you currently in or seeking?`,
                timestamp: new Date().toISOString(),
                type: 'rocket',
                insights: {
                    phase: 'introduction',
                    focus: 'personal_story'
                }
            };

            setMessages([welcomeMessage]);

            console.log('✅ ROCKET Session started successfully:', sessionData.session_id);
            return true;

        } catch (err) {
            console.error('❌ Failed to start ROCKET session:', err);
            setError(err.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    /**
     * Send a message and get AI response
     */
    const sendMessage = useCallback(async (messageContent, processingMode = 'rocket') => {
        if (!session?.session_id) {
            setError('No active session. Please start a session first.');
            return false;
        }

        if (!messageContent?.trim()) {
            setError('Message cannot be empty');
            return false;
        }

        setIsLoading(true);
        setError(null);

        // Add user message immediately (optimistic update)
        const userMessage = {
            id: `msg_${Date.now()}_user`,
            sender: 'user',
            content: messageContent.trim(),
            timestamp: new Date().toISOString(),
            type: processingMode
        };

        setMessages(prev => [...prev, userMessage]);

        try {
            const response = await rocketAPI.sendMessage(
                session.session_id,
                messageContent.trim(),
                processingMode
            );

            // Add AI response
            const aiMessage = {
                id: `msg_${Date.now()}_ai`,
                sender: 'ai',
                content: response.response,
                timestamp: new Date().toISOString(),
                type: processingMode,
                insights: response.processing_insights,
                suggestions: response.next_questions
            };

            setMessages(prev => [...prev, aiMessage]);

            // Update progress
            if (response.rocket_progress) {
                setProgress(response.rocket_progress);
            }

            if (response.components_status) {
                setComponentsStatus(response.components_status);
            }

            console.log('✅ Message sent successfully');
            return true;

        } catch (err) {
            console.error('❌ Failed to send message:', err);
            setError(err.message);

            // Remove the optimistic user message on error
            setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [session]);

    /**
     * Get personality analysis from Dr. Maya Insight
     */
    const requestPersonalityAnalysis = useCallback(async () => {
        if (!session?.session_id) {
            setError('No active session for personality analysis');
            return false;
        }

        setIsAnalyzing(true);
        setError(null);

        try {
            const analysis = await rocketAPI.getPersonalityAnalysis(session.session_id);
            setPersonalityAnalysis(analysis);

            // Add analysis message to conversation
            const analysisMessage = {
                id: `msg_${Date.now()}_analysis`,
                sender: 'psychologist',
                content: `Based on our conversation, I've completed your personality analysis. ${analysis.personality_summary}`,
                timestamp: new Date().toISOString(),
                type: 'psychologist',
                analysis: analysis
            };

            setMessages(prev => [...prev, analysisMessage]);

            console.log('✅ Personality analysis completed');
            return true;

        } catch (err) {
            console.error('❌ Failed to get personality analysis:', err);
            setError(err.message);
            return false;
        } finally {
            setIsAnalyzing(false);
        }
    }, [session]);

    /**
     * Refresh progress data
     */
    const refreshProgress = useCallback(async () => {
        if (!session?.session_id) return false;

        try {
            const progressData = await rocketAPI.getProgress(session.session_id);
            setProgress(progressData.rocket_progress);
            setComponentsStatus(progressData.components_status);
            return true;
        } catch (err) {
            console.error('❌ Failed to refresh progress:', err);
            return false;
        }
    }, [session]);

    /**
     * End current session
     */
    const endSession = useCallback(async () => {
        if (!session?.session_id) return true;

        setIsLoading(true);

        try {
            const summary = await rocketAPI.endSession(session.session_id);

            // Add session summary message
            const summaryMessage = {
                id: `msg_${Date.now()}_summary`,
                sender: 'ai',
                content: summary.session_summary,
                timestamp: new Date().toISOString(),
                type: 'summary',
                sessionSummary: summary
            };

            setMessages(prev => [...prev, summaryMessage]);

            // Reset session state
            setSession(null);
            setIsSessionActive(false);

            console.log('✅ Session ended successfully');
            return true;

        } catch (err) {
            console.error('❌ Failed to end session:', err);
            setError(err.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [session]);

    /**
     * Clear error state
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    /**
     * Reset all state
     */
    const resetSession = useCallback(() => {
        setSession(null);
        setIsSessionActive(false);
        setMessages([]);
        setProgress({
            story_completion: 0,
            experience_mining: 0,
            quantification_rate: 0,
            overall_score: 0
        });
        setComponentsStatus({
            personal_story: false,
            experiences_count: 0,
            quantified_achievements: 0,
            session_active: false
        });
        setPersonalityAnalysis(null);
        setError(null);
        setIsLoading(false);
        setIsAnalyzing(false);
    }, []);

    // Auto-refresh progress periodically
    useEffect(() => {
        if (!isSessionActive || !session?.session_id) return;

        const progressInterval = setInterval(() => {
            refreshProgress();
        }, 30000); // Refresh every 30 seconds

        return () => clearInterval(progressInterval);
    }, [isSessionActive, session?.session_id, refreshProgress]);

    return {
        // Session state
        session,
        isSessionActive,
        isLoading,
        error,

        // Conversation
        messages,

        // Progress tracking
        progress,
        componentsStatus,

        // Personality analysis
        personalityAnalysis,
        isAnalyzing,

        // Actions
        startSession,
        sendMessage,
        requestPersonalityAnalysis,
        refreshProgress,
        endSession,
        clearError,
        resetSession,

        // Computed values
        hasProgress: progress.overall_score > 0,
        isReady: !isLoading && !error,
        messageCount: messages.length,
        lastMessage: messages[messages.length - 1] || null
    };
};
