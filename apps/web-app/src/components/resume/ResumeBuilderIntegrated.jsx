import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Send,
    Bot,
    User,
    Sparkles,
    FileText,
    Brain,
    MessageCircle,
    Clock,
    CheckCircle,
    ArrowRight,
    Lightbulb,
    Target,
    TrendingUp,
    Award,
    Users,
    Zap,
    BarChart3,
    Briefcase,
    Heart,
    Star,
    Eye,
    Download
} from 'lucide-react';

const ResumeBuilderIntegrated = ({ onResumeGenerated }) => {
    const [messages, setMessages] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessionPhase, setSessionPhase] = useState('intro');
    const [userProfile, setUserProfile] = useState({
        personalInfo: {},
        careerGoals: {},
        workStyle: {},
        achievements: [],
        experiences: [],
        skills: [],
        values: [],
        responses: [],
        psychometricProfile: {},
        industryFocus: null,
        seniorityLevel: null
    });
    const [questionCount, setQuestionCount] = useState(0);
    const [currentQuestionCategory, setCurrentQuestionCategory] = useState(null);
    const [followUpDepth, setFollowUpDepth] = useState(0);
    const [intelligenceScores, setIntelligenceScores] = useState({
        analytical: 0,
        emotional: 0,
        creative: 0,
        strategic: 0,
        execution: 0
    });
    const [personalityTraits, setPersonalityTraits] = useState({
        leadership: 0,
        collaboration: 0,
        innovation: 0,
        resilience: 0,
        communication: 0
    });
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        initializeSession();
    }, []);

    const initializeSession = () => {
        const welcomeMessage = {
            id: 1,
            type: 'ai',
            content: `🎯 **Welcome to AI Resume Intelligence** 

I'm your AI Career Strategist - combining Chief People Officer expertise with advanced psychological profiling. I'll help you create a resume that positions you as an exceptional candidate.

**My approach:**
✨ **Behavioral Analysis**: Deep-dive into your experiences
🧠 **Cognitive Mapping**: Identify your unique intelligence patterns  
🎯 **Strategic Positioning**: Industry-specific narrative architecture
📊 **ATS Optimization**: Ensure your resume passes all screening systems

**Ready to begin?** What's your name and target role?`,
            timestamp: new Date(),
            category: 'system_intro'
        };
        setMessages([welcomeMessage]);
    };

    // Simplified questionnaire engine for integrated version
    const generateAIResponse = async (userMessage) => {
        setIsTyping(true);

        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));

        let response = "";

        setUserProfile(prev => ({
            ...prev,
            responses: [...(prev.responses || []), {
                content: userMessage,
                phase: sessionPhase,
                timestamp: new Date(),
                questionCategory: currentQuestionCategory
            }]
        }));

        analyzeResponse(userMessage);

        if (sessionPhase === 'intro') {
            response = handleIntroPhase(userMessage);
        } else if (sessionPhase === 'profiling') {
            response = handleProfilingPhase(userMessage);
        } else if (sessionPhase === 'generation') {
            response = handleGenerationPhase(userMessage);
        }

        const aiMessage = {
            id: messages.length + 1,
            type: 'ai',
            content: response,
            timestamp: new Date(),
            phase: sessionPhase
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
        setQuestionCount(prev => prev + 1);
    };

    const analyzeResponse = (response) => {
        const words = response.toLowerCase().split(/\s+/);

        // Simple analysis for integrated version
        const leadershipWords = ['led', 'managed', 'directed', 'influenced', 'guided'];
        const analyticalWords = ['analyzed', 'data', 'metrics', 'process', 'framework'];
        const creativityWords = ['innovative', 'creative', 'designed', 'developed'];

        const leadershipScore = leadershipWords.filter(word => words.includes(word)).length / 10;
        const analyticalScore = analyticalWords.filter(word => words.includes(word)).length / 10;
        const creativityScore = creativityWords.filter(word => words.includes(word)).length / 10;

        setPersonalityTraits(prev => ({
            leadership: Math.min(prev.leadership + leadershipScore, 1),
            collaboration: Math.min(prev.collaboration + 0.1, 1),
            innovation: Math.min(prev.innovation + creativityScore, 1),
            resilience: Math.min(prev.resilience + 0.1, 1),
            communication: Math.min(prev.communication + 0.1, 1)
        }));
    };

    const handleIntroPhase = (userMessage) => {
        const name = extractName(userMessage);
        const role = extractRole(userMessage);

        setUserProfile(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, name },
            careerGoals: { ...prev.careerGoals, targetRole: role }
        }));

        if (questionCount === 0) {
            setSessionPhase('profiling');
            return `Perfect, ${name}! Targeting a ${role} role - excellent choice.

**Let's dive into your background:**
Tell me about your most significant professional achievement. What challenge did you face, what actions did you take, and what was the measurable impact?

*I'm looking for specific details that showcase your unique value.* 🎯`;
        }

        return generateNextQuestion();
    };

    const handleProfilingPhase = (userMessage) => {
        if (questionCount <= 6) {
            return generateNextQuestion();
        }

        setSessionPhase('generation');
        return `Excellent insights, ${userProfile.personalInfo?.name}! 🌟

I now have enough information to generate your strategic resume. Based on our conversation, I can see you're a strong candidate with unique strengths in ${getTopStrength()}.

**Generating your optimized resume now...** ⚡

Your resume will be automatically saved and available for analysis once complete.`;
    };

    const handleGenerationPhase = (userMessage) => {
        // Simulate resume generation
        const resumeData = {
            name: userProfile.personalInfo?.name || 'Professional',
            role: userProfile.careerGoals?.targetRole || 'Professional',
            profile: userProfile,
            generatedAt: new Date()
        };

        // Notify parent component that resume is generated
        if (onResumeGenerated) {
            onResumeGenerated(resumeData);
        }

        return `🎉 **Resume Generation Complete!**

Your AI-optimized resume has been generated and is now available in the Analysis tab. Here's what I've created for you:

**✅ Strategic positioning** for ${userProfile.careerGoals?.targetRole || 'your target role'}
**✅ ATS-optimized keywords** based on industry requirements  
**✅ Quantified achievements** from your experiences
**✅ Professional summary** highlighting your unique value proposition

**Next Steps:**
1. Switch to the **Analysis tab** to review your generated resume
2. Upload a job description to get targeted optimization recommendations
3. Download your final resume in multiple formats

Your resume is ready to make an impact! 🚀`;
    };

    const generateNextQuestion = () => {
        const questions = [
            "What's your proudest professional moment? Tell me about a time when you exceeded expectations.",
            "Describe your leadership style. How do you motivate and guide others?",
            "What's the most complex problem you've solved? Walk me through your approach.",
            "How do you handle pressure and tight deadlines? Give me a specific example.",
            "What drives you professionally? What gets you excited about work?",
            "Tell me about a time you had to learn something completely new. How did you approach it?"
        ];

        return questions[Math.min(questionCount - 1, questions.length - 1)] +
            "\n\n*Be specific with examples, numbers, and outcomes.* 📊";
    };

    const extractName = (message) => {
        const namePatterns = [
            /(?:i'm|i am|my name is|call me|i go by)\s+([a-z]+)/i,
            /^hi,?\s*i'm\s+([a-z]+)/i,
            /^([a-z]+)(?:\s|,|\.)/i
        ];

        for (const pattern of namePatterns) {
            const match = message.match(pattern);
            if (match && match[1].length > 1) return match[1];
        }
        return "there";
    };

    const extractRole = (message) => {
        const roles = {
            'software engineer': 'Software Engineer',
            'product manager': 'Product Manager',
            'chief of staff': 'Chief of Staff',
            'data scientist': 'Data Scientist',
            'marketing manager': 'Marketing Manager',
            'designer': 'Designer',
            'consultant': 'Consultant'
        };

        const lowerMessage = message.toLowerCase();
        for (const [key, value] of Object.entries(roles)) {
            if (lowerMessage.includes(key)) {
                return value;
            }
        }
        return "Professional";
    };

    const getTopStrength = () => {
        const topTrait = Object.entries(personalityTraits).reduce((a, b) =>
            personalityTraits[a[0]] > personalityTraits[b[0]] ? a : b
        );
        return topTrait[0];
    };

    const handleSendMessage = () => {
        if (!currentInput.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            type: 'user',
            content: currentInput,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        generateAIResponse(currentInput);
        setCurrentInput('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const getPhaseLabel = () => {
        switch (sessionPhase) {
            case 'intro': return 'Introduction';
            case 'profiling': return 'Experience Deep-Dive';
            case 'generation': return 'Resume Generation';
            default: return 'Complete';
        }
    };

    const getProgressPercentage = () => {
        const phaseProgress = {
            'intro': 20,
            'profiling': 70,
            'generation': 100
        };
        return phaseProgress[sessionPhase] || 0;
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Indicator */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{getPhaseLabel()}</span>
                    <span className="text-sm text-gray-500">{getProgressPercentage()}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${getProgressPercentage()}%` }}
                    />
                </div>
            </div>

            {/* Chat Interface */}
            <Card className="h-[500px] flex flex-col">
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg p-3 ${message.type === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                    }`}
                            >
                                <div className="flex items-start gap-2">
                                    {message.type === 'ai' && (
                                        <Bot className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    )}
                                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                        {message.content}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                                <div className="flex items-center gap-2">
                                    <Bot className="w-4 h-4 text-blue-600" />
                                    <div className="flex space-x-1">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </CardContent>

                {/* Input Area */}
                <div className="border-t p-3">
                    <div className="flex gap-2">
                        <Input
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Share your experiences and achievements..."
                            className="flex-1"
                            disabled={isTyping || sessionPhase === 'generation'}
                        />
                        <Button
                            onClick={handleSendMessage}
                            disabled={!currentInput.trim() || isTyping || sessionPhase === 'generation'}
                            size="sm"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Tips */}
            <Card className="mt-4">
                <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-orange-500 mt-0.5" />
                        <div>
                            <p className="text-sm text-gray-600">
                                💡 <strong>Tip:</strong> Be specific with numbers, timelines, and outcomes. The more detail you provide, the better your AI-generated resume will be.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResumeBuilderIntegrated;
