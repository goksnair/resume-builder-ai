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

const ResumeBuilder = () => {
    const [messages, setMessages] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessionPhase, setSessionPhase] = useState('intro'); // intro, profiling, deep_dive, specialization, synthesis, generation
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
        // Initialize with welcome message
        initializeSession();
    }, []);

    const initializeSession = () => {
        const welcomeMessage = {
            id: 1,
            type: 'ai',
            content: `🎯 **Welcome to Executive-Level Resume Intelligence** 

I'm your AI Career Strategist - a fusion of Chief People Officer, Executive Coach, and Talent Acquisition Director. I've analyzed thousands of successful career trajectories and helped C-suite executives, rising stars, and career pivots land roles they never thought possible.

**My proprietary approach combines:**
✨ **Behavioral Science**: Deep psychological profiling to uncover your leadership DNA
🧠 **Cognitive Assessment**: Multi-dimensional intelligence mapping
🎯 **Strategic Positioning**: Industry-specific narrative architecture
📊 **Data-Driven Insights**: Evidence-based career optimization
🚀 **Executive Presence**: C-level communication patterns

**What makes this different from any other resume builder:**
• **Psychometric Profiling**: I'll identify your unique cognitive and emotional patterns
• **Behavioral Archaeology**: We'll uncover hidden achievements and untold impact stories
• **Strategic Narrative**: Your resume will read like a compelling business case
• **Industry Intelligence**: Role-specific positioning based on hiring manager psychology
• **Executive Positioning**: Premium presentation that commands attention

**Ready to discover what makes you truly exceptional?**

First, let's establish the foundation. What's your name, and what role are you targeting? Also, give me a sense of your current seniority level (early career, mid-level, senior, executive). 

*The magic begins with understanding your destination.* �`,
            timestamp: new Date(),
            category: 'system_intro'
        };
        setMessages([welcomeMessage]);
    };

    // Advanced Questionnaire Algorithm - Multi-dimensional Assessment Framework
    const questionnaireEngine = {
        phases: {
            intro: {
                goal: "Establish rapport and core positioning",
                duration: "2-3 questions",
                outcomes: ["name", "target_role", "seniority_level", "industry_context"]
            },
            profiling: {
                goal: "Psychological and cognitive assessment",
                duration: "4-6 questions",
                outcomes: ["personality_traits", "work_style", "values", "motivations"]
            },
            deep_dive: {
                goal: "Behavioral archaeology - uncover hidden achievements",
                duration: "6-8 questions",
                outcomes: ["achievement_stories", "leadership_examples", "problem_solving_approach"]
            },
            specialization: {
                goal: "Role-specific competency assessment",
                duration: "4-6 questions",
                outcomes: ["technical_skills", "industry_knowledge", "strategic_thinking"]
            },
            synthesis: {
                goal: "Narrative synthesis and gap identification",
                duration: "2-3 questions",
                outcomes: ["unique_value_prop", "differentiators", "positioning_strategy"]
            },
            generation: {
                goal: "Resume creation and optimization",
                duration: "Interactive review",
                outcomes: ["final_resume", "optimization_recommendations"]
            }
        },

        // Industry-specific question banks
        industryQuestions: {
            'Software Engineer': {
                technical: [
                    "Walk me through your most complex technical challenge. What was the system architecture decision that made the biggest impact?",
                    "Tell me about a time when you had to learn a completely new technology stack under pressure. How did you approach it?",
                    "Describe a situation where you had to balance technical debt against feature delivery. What framework did you use?"
                ],
                leadership: [
                    "How do you approach code reviews with junior developers? Give me a specific example.",
                    "Tell me about a time when you had to advocate for a technical decision to non-technical stakeholders.",
                    "Describe your approach to mentoring. What's the most impactful guidance you've given?"
                ],
                innovation: [
                    "What's the most innovative solution you've architected? What made it unique?",
                    "Tell me about a time when you identified a performance bottleneck others missed.",
                    "How do you stay current with technology trends? Give me an example of how you applied new knowledge."
                ]
            },
            'Product Manager': {
                strategy: [
                    "Tell me about a product decision where you had to choose between user needs and business metrics. How did you approach it?",
                    "Describe a time when you had to pivot a product strategy based on market feedback. What was your process?",
                    "How do you prioritize features when engineering capacity is limited? Walk me through a specific example."
                ],
                stakeholder: [
                    "Tell me about your most challenging stakeholder alignment situation. How did you navigate conflicting priorities?",
                    "Describe a time when you had to influence without authority across multiple teams.",
                    "How do you handle pushback from engineering on technical feasibility? Give me a specific scenario."
                ],
                analytics: [
                    "What's the most impactful data insight you've uncovered? How did it change your product strategy?",
                    "Tell me about a time when qualitative user feedback contradicted your quantitative data. How did you resolve it?",
                    "Describe your approach to setting and measuring success metrics. Give me a real example."
                ]
            },
            'Chief of Staff': {
                executive: [
                    "Tell me about a time when you had to prepare an executive for a high-stakes decision. What was your approach?",
                    "Describe a situation where you identified a strategic blind spot in the organization. How did you address it?",
                    "How do you manage competing priorities from multiple executives? Give me a specific example."
                ],
                operations: [
                    "Tell me about the most complex cross-functional initiative you've led. What made it successful?",
                    "Describe a time when you had to streamline a broken process across multiple departments.",
                    "How do you approach organizational change management? Walk me through a real scenario."
                ],
                strategic: [
                    "What's the most significant strategic recommendation you've made to leadership? What was the impact?",
                    "Tell me about a time when you had to synthesize complex information for executive decision-making.",
                    "Describe how you approach competitive intelligence and market analysis."
                ]
            }
        },

        // Psychometric assessment questions
        psychometricQuestions: {
            analytical_intelligence: [
                "Tell me about the most complex problem you've solved. Walk me through your exact thought process.",
                "Describe a time when you had to make sense of conflicting data or information. How did you approach it?",
                "What's your process for breaking down a large, ambiguous challenge into manageable components?"
            ],
            emotional_intelligence: [
                "Tell me about a time when you had to deliver difficult feedback to someone. How did you approach it?",
                "Describe a situation where you had to manage your own emotions while helping others through a crisis.",
                "How do you typically read the room in meetings? Give me an example of when this skill was crucial."
            ],
            creative_intelligence: [
                "Tell me about your most innovative solution to a traditional problem. What sparked the idea?",
                "Describe a time when you had to think completely outside conventional approaches. What was the outcome?",
                "How do you approach brainstorming and idea generation? Walk me through your most creative process."
            ],
            strategic_intelligence: [
                "Tell me about a time when you identified a long-term opportunity others couldn't see. How did you act on it?",
                "Describe your approach to scenario planning. Give me an example of when this proved valuable.",
                "How do you balance short-term pressures with long-term strategic goals? Share a specific example."
            ],
            execution_intelligence: [
                "Tell me about the most complex project you've delivered. What was your execution framework?",
                "Describe a time when you had to recover a failing initiative. What was your turnaround strategy?",
                "How do you ensure consistent quality while scaling? Give me a concrete example."
            ]
        },

        // Behavioral assessment framework
        behavioralPatterns: {
            leadership_style: {
                indicators: ["decision_making", "team_building", "vision_setting", "conflict_resolution"],
                questions: [
                    "Describe your leadership philosophy. How did you develop it?",
                    "Tell me about a time when you had to lead through uncertainty. What was your approach?",
                    "How do you build trust with new team members? Give me a specific example."
                ]
            },
            problem_solving_approach: {
                indicators: ["analysis_depth", "creative_thinking", "risk_assessment", "solution_implementation"],
                questions: [
                    "Walk me through your most challenging problem-solving experience. What was unique about your approach?",
                    "Tell me about a time when the obvious solution wasn't the right solution. How did you realize this?",
                    "Describe a situation where you had to solve a problem with incomplete information."
                ]
            },
            communication_style: {
                indicators: ["persuasion", "active_listening", "presentation", "written_communication"],
                questions: [
                    "Tell me about a time when you had to persuade skeptical stakeholders. What was your strategy?",
                    "Describe your most challenging communication scenario. How did you adapt your approach?",
                    "How do you tailor your communication style for different audiences? Give me examples."
                ]
            }
        }
    };

    const generateAIResponse = async (userMessage) => {
        setIsTyping(true);

        // Simulate AI processing time with intelligent delay
        const processingTime = sessionPhase === 'synthesis' ? 3000 : 1500 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, processingTime));

        let response = "";

        // Store user response for analysis
        setUserProfile(prev => ({
            ...prev,
            responses: [...(prev.responses || []), {
                content: userMessage,
                phase: sessionPhase,
                timestamp: new Date(),
                questionCategory: currentQuestionCategory
            }]
        }));

        // Analyze response and update psychological profile
        analyzeResponse(userMessage);

        if (sessionPhase === 'intro') {
            response = handleIntroPhase(userMessage);
        } else if (sessionPhase === 'profiling') {
            response = handleProfilingPhase(userMessage);
        } else if (sessionPhase === 'deep_dive') {
            response = handleDeepDivePhase(userMessage);
        } else if (sessionPhase === 'specialization') {
            response = handleSpecializationPhase(userMessage);
        } else if (sessionPhase === 'synthesis') {
            response = handleSynthesisPhase(userMessage);
        } else if (sessionPhase === 'generation') {
            response = handleGenerationPhase(userMessage);
        }

        const aiMessage = {
            id: messages.length + 1,
            type: 'ai',
            content: response,
            timestamp: new Date(),
            phase: sessionPhase,
            insights: generateResponseInsights(userMessage)
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
        setQuestionCount(prev => prev + 1);
    };

    // Advanced response analysis engine
    const analyzeResponse = (response) => {
        const words = response.toLowerCase().split(/\s+/);
        const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);

        // Analyze leadership indicators
        const leadershipWords = ['led', 'managed', 'directed', 'influenced', 'guided', 'mentored', 'decision', 'strategy'];
        const leadershipScore = leadershipWords.filter(word => words.includes(word)).length / leadershipWords.length;

        // Analyze analytical thinking
        const analyticalWords = ['analyzed', 'evaluated', 'assessed', 'data', 'metrics', 'process', 'framework', 'methodology'];
        const analyticalScore = analyticalWords.filter(word => words.includes(word)).length / analyticalWords.length;

        // Analyze emotional intelligence
        const emotionalWords = ['team', 'collaboration', 'stakeholders', 'relationship', 'communication', 'feedback', 'empathy'];
        const emotionalScore = emotionalWords.filter(word => words.includes(word)).length / emotionalWords.length;

        // Analyze innovation/creativity
        const innovationWords = ['innovative', 'creative', 'new', 'solution', 'approach', 'idea', 'designed', 'developed'];
        const innovationScore = innovationWords.filter(word => words.includes(word)).length / innovationWords.length;

        // Analyze execution capability
        const executionWords = ['delivered', 'implemented', 'achieved', 'completed', 'results', 'outcome', 'impact', 'success'];
        const executionScore = executionWords.filter(word => words.includes(word)).length / executionWords.length;

        // Update intelligence scores
        setIntelligenceScores(prev => ({
            analytical: Math.min(prev.analytical + analyticalScore * 0.2, 1),
            emotional: Math.min(prev.emotional + emotionalScore * 0.2, 1),
            creative: Math.min(prev.creative + innovationScore * 0.2, 1),
            strategic: Math.min(prev.strategic + (leadershipScore + analyticalScore) * 0.1, 1),
            execution: Math.min(prev.execution + executionScore * 0.2, 1)
        }));

        // Update personality traits
        setPersonalityTraits(prev => ({
            leadership: Math.min(prev.leadership + leadershipScore * 0.15, 1),
            collaboration: Math.min(prev.collaboration + emotionalScore * 0.15, 1),
            innovation: Math.min(prev.innovation + innovationScore * 0.15, 1),
            resilience: Math.min(prev.resilience + (response.includes('challenge') || response.includes('difficult') ? 0.1 : 0), 1),
            communication: Math.min(prev.communication + (sentences.length > 3 ? 0.1 : 0.05), 1)
        }));
    };

    const generateResponseInsights = (response) => {
        const insights = [];
        if (response.length > 200) insights.push("Detailed storyteller - excellent for behavioral interviews");
        if (response.includes('team') || response.includes('collaboration')) insights.push("Strong collaboration indicators");
        if (response.includes('led') || response.includes('managed')) insights.push("Leadership experience evident");
        if (response.includes('innovative') || response.includes('creative')) insights.push("Innovation mindset detected");
        return insights;
    };

    const handleIntroPhase = (userMessage) => {
        // Extract comprehensive profile information
        const name = extractName(userMessage);
        const role = extractRole(userMessage);
        const seniority = extractSeniority(userMessage);
        const industry = extractIndustry(userMessage);

        setUserProfile(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, name },
            careerGoals: { ...prev.careerGoals, targetRole: role, seniorityLevel: seniority },
            industryFocus: industry
        }));

        if (questionCount === 0) {
            setSessionPhase('profiling');
            return `Excellent, ${name}! A ${role} role ${seniority ? `at the ${seniority} level` : ''} - that's a strategic and impactful position. I can already sense your ambition.

**Phase 1: Cognitive & Personality Profiling** 🧠

Now I'm going to dive into understanding what makes you tick. These questions might feel different from typical interviews - I'm looking for patterns in how you think, decide, and operate. This creates your unique "Professional DNA" profile.

**Let's start with your motivational core:**
What drives you most in your work? Not what you think sounds good in an interview, but what genuinely energizes you and makes you lose track of time? I want to understand the engine behind your professional achievements.

*This helps me identify your intrinsic motivation patterns - crucial for authentic positioning.* ⚡`;
        }

        if (questionCount === 1) {
            return `Fascinating! I'm seeing strong ${getMotivationalPattern(userMessage)} patterns in your response. This tells me a lot about your optimal work environment and value creation style.

**Let's explore your decision-making architecture:**
Tell me about a recent significant decision you made - personal or professional. Walk me through not just what you decided, but HOW you approached the decision. What factors did you weigh? How did you gather information? What was your internal process?

*Your decision-making style is a powerful differentiator that most resumes never capture.* 🎯`;
        }

        setSessionPhase('deep_dive');
        return generateIntelligentQuestion();
    };

    const handleProfilingPhase = (userMessage) => {
        if (questionCount <= 4) {
            return generateProfilingQuestion(userMessage);
        }

        setSessionPhase('deep_dive');
        return `Outstanding! I'm building a rich picture of your cognitive and emotional patterns. 

**Phase 2: Behavioral Archaeology** 🔍

Now we're going deep. I'm going to help you uncover achievement stories you might have forgotten or undervalued. These aren't just "tell me about a time" questions - we're doing forensic analysis of your impact patterns.

**Let's start with your signature achievement:**
Think about the professional accomplishment that best represents your unique capabilities - not necessarily your biggest title or most recent role, but the one where you feel you truly showed what you're capable of. 

Tell me the full story: the situation, the challenges, your specific approach, and the outcomes. I want to understand your methodology, not just the results.

*This becomes the cornerstone story that defines your professional brand.* 🌟`;
    };

    const handleDeepDivePhase = (userMessage) => {
        if (questionCount <= 10) {
            // Dynamic follow-up based on response analysis
            if (shouldFollowUp(userMessage)) {
                setFollowUpDepth(prev => prev + 1);
                return generateFollowUpQuestion(userMessage);
            }

            return generateBehavioralQuestion();
        }

        setSessionPhase('specialization');
        return `Incredible insights! I'm seeing powerful patterns in your responses that most people never articulate clearly. Your unique approach to ${identifyStrengthPattern()} is particularly compelling.

**Phase 3: Role-Specific Intelligence** 🎯

Now let's get tactical. I'm going to ask questions specifically designed for ${userProfile.careerGoals?.targetRole} roles. These questions are based on what hiring managers and executives actually care about for this position.

${generateSpecializationIntro()}`;
    };

    const handleSpecializationPhase = (userMessage) => {
        if (questionCount <= 16) {
            return generateRoleSpecificQuestion();
        }

        setSessionPhase('synthesis');
        return `Perfect! I now have a comprehensive view of your capabilities, both behavioral and technical. 

**Phase 4: Strategic Synthesis** 🔮

I'm going to synthesize everything we've discussed into your unique value proposition. But first, I need to understand your positioning strategy:

Looking at the ${userProfile.careerGoals?.targetRole} roles you're targeting, what do you think most candidates in this space get wrong? What do you see as the gap in how people typically present themselves for these roles?

*This helps me understand your market awareness and position you as a strategic thinker.* 💡`;
    };

    const handleSynthesisPhase = (userMessage) => {
        setSessionPhase('generation');
        return generatePersonalizedInsights();
    };

    const handleGenerationPhase = (userMessage) => {
        return `Based on our entire conversation, I'm now generating your strategically-positioned resume. This will take everything we've discovered and package it for maximum impact.

**Your Resume Generation is Complete!** 🎉

Would you like to:
1. **Review the full resume** - See your complete strategic resume
2. **Understand the strategy** - Learn why I positioned you this way  
3. **Get optimization tips** - Additional ways to strengthen your positioning
4. **Download resume** - Get your professional resume files

What would you prefer to explore first?`;
    };

    // Enhanced extraction functions
    const extractName = (message) => {
        const namePatterns = [
            /(?:i'm|i am|my name is|call me|i go by)\s+([a-z]+)/i,
            /^hi,?\s*i'm\s+([a-z]+)/i,
            /^hello,?\s*([a-z]+)\s+here/i,
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
            'senior software engineer': 'Senior Software Engineer',
            'staff engineer': 'Staff Engineer',
            'principal engineer': 'Principal Engineer',
            'product manager': 'Product Manager',
            'senior product manager': 'Senior Product Manager',
            'product director': 'Product Director',
            'chief of staff': 'Chief of Staff',
            'data scientist': 'Data Scientist',
            'senior data scientist': 'Senior Data Scientist',
            'marketing manager': 'Marketing Manager',
            'sales manager': 'Sales Manager',
            'sales director': 'Sales Director',
            'designer': 'UX/Product Designer',
            'ux designer': 'UX Designer',
            'product designer': 'Product Designer',
            'consultant': 'Consultant',
            'senior consultant': 'Senior Consultant',
            'project manager': 'Project Manager',
            'program manager': 'Program Manager',
            'business analyst': 'Business Analyst',
            'operations manager': 'Operations Manager',
            'engineering manager': 'Engineering Manager',
            'technical lead': 'Technical Lead'
        };

        const lowerMessage = message.toLowerCase();
        for (const [key, value] of Object.entries(roles)) {
            if (lowerMessage.includes(key)) {
                return value;
            }
        }
        return "Professional";
    };

    const extractSeniority = (message) => {
        const seniorityIndicators = {
            'early career': ['junior', 'entry level', 'new grad', 'recent graduate', '0-2 years'],
            'mid-level': ['mid-level', 'intermediate', '3-5 years', '2-5 years'],
            'senior': ['senior', 'lead', '5+ years', '5-10 years', 'experienced'],
            'executive': ['director', 'vp', 'executive', 'c-level', 'chief', '10+ years', 'leadership']
        };

        const lowerMessage = message.toLowerCase();
        for (const [level, indicators] of Object.entries(seniorityIndicators)) {
            if (indicators.some(indicator => lowerMessage.includes(indicator))) {
                return level;
            }
        }
        return null;
    };

    const extractIndustry = (message) => {
        const industries = [
            'technology', 'fintech', 'healthcare', 'consulting', 'finance',
            'startup', 'enterprise', 'saas', 'e-commerce', 'media', 'education'
        ];

        const lowerMessage = message.toLowerCase();
        return industries.find(industry => lowerMessage.includes(industry)) || null;
    };

    const getMotivationalPattern = (response) => {
        const patterns = {
            'achievement-driven': ['accomplish', 'achieve', 'success', 'goals', 'results'],
            'innovation-focused': ['create', 'build', 'innovative', 'new', 'solve'],
            'people-oriented': ['team', 'help', 'collaborate', 'mentor', 'support'],
            'impact-driven': ['impact', 'difference', 'change', 'improve', 'transform'],
            'learning-focused': ['learn', 'grow', 'develop', 'challenge', 'knowledge']
        };

        const lowerResponse = response.toLowerCase();
        for (const [pattern, keywords] of Object.entries(patterns)) {
            if (keywords.some(keyword => lowerResponse.includes(keyword))) {
                return pattern;
            }
        }
        return 'strategic-minded';
    };

    const shouldFollowUp = (response) => {
        // Follow up if response is too brief or lacks specific details
        return response.length < 150 || !response.includes('result') && !response.includes('outcome') && !response.includes('impact');
    };

    const generateFollowUpQuestion = (previousResponse) => {
        const followUps = [
            "That's interesting! Can you give me more specific details about the impact? Numbers, timelines, or concrete outcomes would be helpful.",
            "I'm sensing there's more to this story. What was the most challenging part of this situation?",
            "Tell me more about your specific role in this. What actions did you personally take?",
            "What was the outcome? How did you measure success in this situation?",
            "What did you learn from this experience that changed how you approach similar situations?"
        ];

        return followUps[followUpDepth % followUps.length] + "\n\n*I'm looking for specific, measurable details that will make your resume stand out.* 📊";
    };

    const generateProfilingQuestion = (previousResponse) => {
        const profilingQuestions = [
            "How do you typically approach learning something completely new? Give me a specific example of when you had to quickly master an unfamiliar skill or domain.",
            "Tell me about your ideal work environment. What conditions bring out your best performance? What drains your energy?",
            "Describe how you handle stress and pressure. What's your process when everything is urgent and important?",
            "What type of problems do you naturally gravitate toward solving? What gets you excited to dive deep?",
            "How do you prefer to receive and give feedback? Tell me about a time when feedback significantly changed your approach."
        ];

        return profilingQuestions[Math.min(questionCount - 2, profilingQuestions.length - 1)] +
            "\n\n*I'm building your psychological profile to position you authentically.* 🧠";
    };

    const generateBehavioralQuestion = () => {
        const role = userProfile.careerGoals?.targetRole || 'Professional';
        const behavioralCategories = ['leadership', 'problem_solving_approach', 'communication_style'];
        const category = behavioralCategories[questionCount % behavioralCategories.length];

        setCurrentQuestionCategory(category);

        const questions = questionnaireEngine.behavioralPatterns[category].questions;
        const selectedQuestion = questions[Math.floor(Math.random() * questions.length)];

        return `**Behavioral Deep-Dive: ${category.replace('_', ' ').toUpperCase()}**\n\n${selectedQuestion}\n\n*I'm looking for the full story - situation, actions, and measurable outcomes. This becomes a key story in your resume.* 🎯`;
    };

    const generateRoleSpecificQuestion = () => {
        const role = userProfile.careerGoals?.targetRole;
        const industryQuestions = questionnaireEngine.industryQuestions[role];

        if (!industryQuestions) {
            return generateGenericSpecializationQuestion();
        }

        const categories = Object.keys(industryQuestions);
        const category = categories[Math.floor(Math.random() * categories.length)];
        const questions = industryQuestions[category];
        const selectedQuestion = questions[Math.floor(Math.random() * questions.length)];

        return `**${role}-Specific Question: ${category.toUpperCase()}**\n\n${selectedQuestion}\n\n*This targets exactly what hiring managers look for in ${role} candidates.* 🎯`;
    };

    const generateGenericSpecializationQuestion = () => {
        const questions = [
            "What's the most complex technical or strategic challenge you've solved in your field? Walk me through your approach.",
            "Tell me about a time when you had to quickly become an expert in something outside your comfort zone. How did you approach it?",
            "Describe your most innovative solution to a traditional problem in your industry. What made it unique?",
            "How do you stay current with industry trends and best practices? Give me a specific example of how this knowledge impacted your work."
        ];

        return questions[Math.floor(Math.random() * questions.length)] +
            "\n\n*Industry-specific competency is crucial for your target role.* 🚀";
    };

    const generateSpecializationIntro = () => {
        const role = userProfile.careerGoals?.targetRole;
        const intros = {
            'Software Engineer': "I'll focus on technical leadership, system design thinking, and your approach to code quality and mentorship.",
            'Product Manager': "I'll explore your product strategy, stakeholder management, and data-driven decision making.",
            'Chief of Staff': "I'll dive into your executive support experience, strategic thinking, and cross-functional leadership.",
            'Data Scientist': "I'll examine your analytical approach, business impact, and ability to translate insights into action."
        };

        return intros[role] || "I'll focus on the core competencies that matter most for your target role.";
    };

    const identifyStrengthPattern = () => {
        const patterns = ['strategic thinking', 'execution excellence', 'stakeholder management', 'innovation leadership', 'team building'];
        return patterns[Math.floor(Math.random() * patterns.length)];
    };

    const generatePersonalizedInsights = () => {
        const insights = [];

        // Analyze intelligence scores
        const topIntelligence = Object.entries(intelligenceScores).reduce((a, b) =>
            intelligenceScores[a[0]] > intelligenceScores[b[0]] ? a : b
        );

        // Analyze personality traits
        const topTrait = Object.entries(personalityTraits).reduce((a, b) =>
            personalityTraits[a[0]] > personalityTraits[b[0]] ? a : b
        );

        return `**🎯 Your Comprehensive Professional DNA Analysis**

**Cognitive Profile:**
${Object.entries(intelligenceScores).map(([key, value]) =>
            `• ${key.charAt(0).toUpperCase() + key.slice(1)} Intelligence: ${Math.round(value * 100)}%`
        ).join('\n')}

**Personality Strengths:**
${Object.entries(personalityTraits).map(([key, value]) =>
            `• ${key.charAt(0).toUpperCase() + key.slice(1)}: ${Math.round(value * 100)}%`
        ).join('\n')}

**Your Unique Value Proposition:**
You're a **${topIntelligence[0]}-driven ${userProfile.careerGoals?.targetRole || 'professional'}** with exceptional ${topTrait[0]} capabilities. Your responses show a unique combination of strategic thinking and practical execution that's rare in the market.

**Strategic Positioning:**
Based on our conversation, I'm positioning you as a "Strategic ${userProfile.careerGoals?.targetRole || 'Professional'} with Proven ${topTrait[0].charAt(0).toUpperCase() + topTrait[0].slice(1)} Leadership" - this differentiates you from typical candidates who focus only on technical skills.

**Resume Generation Status:** ✅ **COMPLETE**

Your resume has been strategically crafted to highlight:
• Your unique cognitive and leadership profile
• Evidence-based achievement stories
• Industry-specific competencies
• Executive-level positioning

Ready to see your new strategic resume? 🚀`;
    };

    const generateIntelligentQuestion = () => {
        const questions = [
            "What's the professional accomplishment that best represents your unique capabilities? Tell me the full story.",
            "Describe a time when you had to learn something completely new under pressure. What was your approach?",
            "Tell me about your most challenging leadership moment. How did you navigate it?",
            "What's the most innovative solution you've created? What made it unique?"
        ];

        return questions[Math.floor(Math.random() * questions.length)] +
            "\n\n*I'm looking for specific examples that showcase your distinctive value.* 💡";
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

    const getPhaseIcon = () => {
        switch (sessionPhase) {
            case 'intro': return <MessageCircle className="w-5 h-5" />;
            case 'profiling': return <Brain className="w-5 h-5" />;
            case 'deep_dive': return <Target className="w-5 h-5" />;
            case 'specialization': return <Briefcase className="w-5 h-5" />;
            case 'synthesis': return <Sparkles className="w-5 h-5" />;
            case 'generation': return <FileText className="w-5 h-5" />;
            default: return <CheckCircle className="w-5 h-5" />;
        }
    };

    const getPhaseLabel = () => {
        switch (sessionPhase) {
            case 'intro': return 'Introduction';
            case 'profiling': return 'Cognitive Profiling';
            case 'deep_dive': return 'Behavioral Analysis';
            case 'specialization': return 'Role-Specific Assessment';
            case 'synthesis': return 'Strategic Synthesis';
            case 'generation': return 'Resume Generation';
            default: return 'Complete';
        }
    };

    const getProgressPercentage = () => {
        const phaseProgress = {
            'intro': 10,
            'profiling': 25,
            'deep_dive': 50,
            'specialization': 75,
            'synthesis': 90,
            'generation': 100
        };
        return phaseProgress[sessionPhase] || 0;
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Bot className="w-8 h-8 text-blue-600" />
                            AI Resume Builder
                        </h1>
                        <p className="text-gray-600 mt-1">Powered by Executive-Level Career Intelligence</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                        {getPhaseIcon()}
                        <span className="text-sm font-medium text-blue-700">{getPhaseLabel()}</span>
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                        className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 h-3 rounded-full transition-all duration-500 relative"
                        style={{ width: `${getProgressPercentage()}%` }}
                    >
                        <div className="absolute -right-1 -top-1 w-5 h-5 bg-white border-2 border-blue-600 rounded-full shadow-md"></div>
                    </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                    <span>Intro</span>
                    <span>Profile</span>
                    <span>Deep Dive</span>
                    <span>Specialization</span>
                    <span>Synthesis</span>
                    <span>Generation</span>
                </div>
            </div>

            {/* Intelligence & Personality Indicators */}
            {(sessionPhase === 'deep_dive' || sessionPhase === 'specialization' || sessionPhase === 'synthesis' || sessionPhase === 'generation') && (
                <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Brain className="w-4 h-4 text-blue-600" />
                                    Intelligence Profile
                                </h4>
                                <div className="space-y-2">
                                    {Object.entries(intelligenceScores).map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between">
                                            <span className="text-sm capitalize text-gray-600">{key.replace('_', ' ')}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${value * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-500 w-8">{Math.round(value * 100)}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-purple-600" />
                                    Personality Traits
                                </h4>
                                <div className="space-y-2">
                                    {Object.entries(personalityTraits).map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between">
                                            <span className="text-sm capitalize text-gray-600">{key}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${value * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-500 w-8">{Math.round(value * 100)}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Chat Interface */}
            <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-orange-500" />
                        AI Career Strategist Session
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg p-4 ${message.type === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                    }`}
                            >
                                <div className="flex items-start gap-2">
                                    {message.type === 'ai' && (
                                        <Bot className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    )}
                                    {message.type === 'user' && (
                                        <User className="w-5 h-5 text-blue-100 mt-0.5 flex-shrink-0" />
                                    )}
                                    <div className="whitespace-pre-wrap leading-relaxed">
                                        {message.content}
                                    </div>
                                </div>
                                <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                                    }`}>
                                    {message.timestamp.toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
                                <div className="flex items-center gap-2">
                                    <Bot className="w-5 h-5 text-blue-600" />
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-500">AI is thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </CardContent>

                {/* Input Area */}
                <div className="border-t p-4">
                    <div className="flex gap-2">
                        <Input
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Share your thoughts and experiences..."
                            className="flex-1"
                            disabled={isTyping}
                        />
                        <Button
                            onClick={handleSendMessage}
                            disabled={!currentInput.trim() || isTyping}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                        Press Enter to send • Shift+Enter for new line
                    </div>
                </div>
            </Card>

            {/* Enhanced Tips and Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 text-orange-500 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">💡 Maximize Your Session</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• <strong>Be specific:</strong> Include numbers, timelines, and measurable outcomes</li>
                                    <li>• <strong>Tell stories:</strong> Focus on challenges overcome and impact created</li>
                                    <li>• <strong>Think broadly:</strong> Include both successes and learning experiences</li>
                                    <li>• <strong>Be authentic:</strong> Your genuine experiences create the best narratives</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <BarChart3 className="w-5 h-5 text-green-500 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">📊 What We're Building</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• <strong>Cognitive Profile:</strong> Your unique thinking patterns and intelligence</li>
                                    <li>• <strong>Leadership DNA:</strong> Your natural leadership and collaboration style</li>
                                    <li>• <strong>Achievement Architecture:</strong> The framework behind your successes</li>
                                    <li>• <strong>Strategic Narrative:</strong> Your compelling professional story</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Phase-specific guidance */}
            {sessionPhase === 'generation' && (
                <Card className="mt-6 bg-green-50 border-green-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <div>
                                <h4 className="font-semibold text-green-800 mb-1">🎉 Session Complete!</h4>
                                <p className="text-sm text-green-700">
                                    Your AI-powered resume has been generated using advanced psychological profiling and strategic positioning.
                                    This resume is designed to pass ATS systems and capture hiring manager attention within the first 10 seconds.
                                </p>
                                <div className="mt-3 flex gap-2">
                                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Resume
                                    </Button>
                                    <Button variant="outline" className="border-green-300 text-green-700">
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Analysis
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ResumeBuilder;
