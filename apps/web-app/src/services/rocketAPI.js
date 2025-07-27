/**
 * ROCKET Framework API Service
 * 
 * Handles all API communications for the ROCKET Framework features
 * Including session management, conversation handling, and progress tracking
 * 
 * WAITING FOR: Claude Code CLI to complete backend API endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://resume-builder-ai-production.up.railway.app';

/**
 * ROCKET API Service Class
 */
class ROCKETAPIService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.sessionId = null;
    }

    /**
     * Start a new ROCKET Framework session
     * @param {string} userId - User identifier
     * @param {string} sessionType - Type of session ('integrated', 'rocket_only', 'psychologist_only', 'automatic')
     * @returns {Promise<Object>} Session data
     */
    async startSession(userId, sessionType = 'integrated', targetRole = null) {
        try {
            // Real API call to backend
            const response = await fetch(`${this.baseURL}/rocket/rocket/session/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    user_id: userId, 
                    processing_mode: sessionType,
                    target_role: targetRole 
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Transform backend response to frontend format
            const sessionData = {
                session_id: data.session_id,
                user_id: userId,
                session_type: sessionType,
                target_role: targetRole,
                created_at: new Date().toISOString(),
                message: data.message,
                rocket_progress: {
                    story_completion: data.progress_percentage || 5,
                    experience_mining: 0,
                    quantification_rate: 0,
                    overall_score: data.progress_percentage || 5
                },
                components_status: {
                    personal_story: false,
                    experiences_count: 0,
                    quantified_achievements: 0,
                    session_active: true
                },
                conversation_history: [
                    {
                        id: `msg_${Date.now()}`,
                        sender: 'ai',
                        message: data.message,
                        timestamp: new Date().toISOString(),
                        rocket_analysis: data.rocket_analysis,
                        psychological_insight: data.psychological_insight
                    }
                ],
                personality_analysis: data.psychological_insight,
                follow_up_questions: data.follow_up_questions || []
            };

            this.sessionId = sessionData.session_id;
            console.log('🚀 ROCKET Session Started:', sessionData);
            return sessionData;

        } catch (error) {
            console.error('Failed to start ROCKET session:', error);
            
            // Fallback to mock data for development if API fails
            const mockSessionData = {
                session_id: `session_${Date.now()}`,
                user_id: userId,
                session_type: sessionType,
                created_at: new Date().toISOString(),
                rocket_progress: {
                    story_completion: 15,
                    experience_mining: 25,
                    quantification_rate: 10,
                    overall_score: 17
                },
                components_status: {
                    personal_story: false,
                    experiences_count: 1,
                    quantified_achievements: 0,
                    session_active: true
                },
                conversation_history: [],
                personality_analysis: null
            };

            this.sessionId = mockSessionData.session_id;
            console.log('🚀 ROCKET Session Started (MOCK):', mockSessionData);
            return mockSessionData;
        }
    }

    /**
     * Send a message and get AI response
     * @param {string} sessionId - Session identifier
     * @param {string} message - User message
     * @param {string} processingMode - Processing mode ('rocket', 'psychologist', 'general')
     * @returns {Promise<Object>} AI response with progress updates
     */
    async sendMessage(sessionId, message, processingMode = 'rocket') {
        try {
            // Real API call to backend (Note: response processing has minor async issue, using mock for now)
            // const response = await fetch(`${this.baseURL}/rocket/rocket/session/${sessionId}/respond`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         user_input: message,
            //         processing_mode: processingMode
            //     })
            // });
            // 
            // const data = await response.json();

            // Temporary mock data while backend response processing is being fixed
            await this.simulateDelay(1000); // Simulate API call delay

            const mockResponse = {
                response: this.generateMockResponse(message, processingMode),
                rocket_progress: {
                    story_completion: Math.min(100, Math.random() * 50 + 20),
                    experience_mining: Math.min(100, Math.random() * 60 + 15),
                    quantification_rate: Math.min(100, Math.random() * 40 + 5),
                    overall_score: Math.min(100, Math.random() * 45 + 15)
                },
                components_status: {
                    personal_story: Math.random() > 0.7,
                    experiences_count: Math.floor(Math.random() * 5) + 1,
                    quantified_achievements: Math.floor(Math.random() * 3),
                    session_active: true
                },
                processing_insights: {
                    identified_skills: ['Leadership', 'Problem Solving', 'Communication'],
                    suggested_quantifications: ['Increased efficiency by X%', 'Managed team of X people'],
                    story_coherence_score: Math.random() * 40 + 60
                },
                next_questions: [
                    "Can you tell me more about the specific results you achieved?",
                    "What challenges did you overcome in this role?",
                    "How did you measure success in this position?"
                ]
            };

            console.log('🤖 ROCKET AI Response (MOCK):', mockResponse);
            return mockResponse;

        } catch (error) {
            console.error('Failed to send message:', error);
            throw new Error('Message sending failed');
        }
    }

    /**
     * Get personality analysis from Dr. Maya Insight
     * @param {string} sessionId - Session identifier
     * @returns {Promise<Object>} Personality analysis data
     */
    async getPersonalityAnalysis(sessionId) {
        try {
            // TODO: Replace with actual API call when backend ready
            // const response = await fetch(`${this.baseURL}/rocket/psychologist/analyze`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ session_id: sessionId })
            // });
            // const data = await response.json();

            // MOCK DATA for development
            await this.simulateDelay(2000); // Simulate analysis delay

            const mockAnalysis = {
                analyst_name: "Dr. Maya Insight",
                analysis_date: new Date().toISOString(),
                dominant_traits: [
                    { trait: "Analytical", strength: 85, description: "Strong problem-solving orientation" },
                    { trait: "Leadership", strength: 75, description: "Natural tendency to guide teams" },
                    { trait: "Innovation", strength: 70, description: "Seeks creative solutions" }
                ],
                work_style: {
                    collaboration_preference: "Small Teams",
                    communication_style: "Direct and Clear",
                    problem_solving_approach: "Data-Driven",
                    leadership_style: "Collaborative"
                },
                career_recommendations: [
                    "Focus on roles that leverage analytical skills",
                    "Seek positions with team leadership opportunities",
                    "Consider innovation-focused organizations"
                ],
                personality_summary: "You demonstrate strong analytical capabilities combined with natural leadership tendencies. Your approach to problem-solving is methodical and data-driven, which makes you well-suited for roles requiring both technical expertise and team coordination.",
                confidence_score: 0.87
            };

            console.log('🧠 Personality Analysis (MOCK):', mockAnalysis);
            return mockAnalysis;

        } catch (error) {
            console.error('Failed to get personality analysis:', error);
            throw new Error('Personality analysis failed');
        }
    }

    /**
     * Get current session progress
     * @param {string} sessionId - Session identifier
     * @returns {Promise<Object>} Progress data
     */
    async getProgress(sessionId) {
        try {
            // TODO: Replace with actual API call when backend ready
            // const response = await fetch(`${this.baseURL}/rocket/session/${sessionId}/progress`);
            // const data = await response.json();

            // MOCK DATA for development
            const mockProgress = {
                rocket_progress: {
                    story_completion: Math.min(100, Math.random() * 80 + 10),
                    experience_mining: Math.min(100, Math.random() * 70 + 20),
                    quantification_rate: Math.min(100, Math.random() * 60 + 5),
                    overall_score: Math.min(100, Math.random() * 65 + 15)
                },
                components_status: {
                    personal_story: Math.random() > 0.5,
                    experiences_count: Math.floor(Math.random() * 8) + 1,
                    quantified_achievements: Math.floor(Math.random() * 5),
                    session_active: true
                },
                last_updated: new Date().toISOString()
            };

            return mockProgress;

        } catch (error) {
            console.error('Failed to get progress:', error);
            throw new Error('Progress retrieval failed');
        }
    }

    /**
     * End current session
     * @param {string} sessionId - Session identifier
     * @returns {Promise<Object>} Session summary
     */
    async endSession(sessionId) {
        try {
            // TODO: Replace with actual API call when backend ready
            const mockSummary = {
                session_id: sessionId,
                ended_at: new Date().toISOString(),
                final_progress: await this.getProgress(sessionId),
                session_summary: "Great progress! You've developed a clearer career narrative and identified key achievements."
            };

            this.sessionId = null;
            console.log('🏁 ROCKET Session Ended (MOCK):', mockSummary);
            return mockSummary;

        } catch (error) {
            console.error('Failed to end session:', error);
            throw new Error('Session termination failed');
        }
    }

    // Helper methods
    simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    generateMockResponse(message, processingMode) {
        const responses = {
            rocket: [
                "That's a great start! Let's dive deeper into the specific impact you had. Can you quantify any of those results?",
                "I can see strong leadership qualities in your description. What challenges did you overcome in that role?",
                "Your experience shows excellent problem-solving skills. How did you measure success in this position?",
                "This demonstrates valuable technical expertise. What was the most significant outcome you achieved?"
            ],
            psychologist: [
                "I notice you tend to focus on collaborative achievements. This suggests you thrive in team environments.",
                "Your communication style indicates a preference for direct, results-oriented discussions.",
                "The way you describe challenges shows a methodical approach to problem-solving.",
                "Your leadership examples suggest you naturally take initiative in group settings."
            ],
            general: [
                "Tell me more about your professional background and what you're hoping to achieve.",
                "What aspects of your career are you most proud of?",
                "I'd like to understand your goals better. What kind of opportunities are you seeking?"
            ]
        };

        const modeResponses = responses[processingMode] || responses.general;
        return modeResponses[Math.floor(Math.random() * modeResponses.length)];
    }
}

// Create singleton instance
const rocketAPI = new ROCKETAPIService();

export default rocketAPI;
