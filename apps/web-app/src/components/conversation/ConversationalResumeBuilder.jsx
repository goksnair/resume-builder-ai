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
    Download,
    BookOpen,
    Activity
} from 'lucide-react';

const ConversationalResumeBuilder = ({ onResumeGenerated }) => {
    const [messages, setMessages] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [currentPhase, setCurrentPhase] = useState('introduction');
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [resumePreview, setResumePreview] = useState(null);
    const [followUpStrategy, setFollowUpStrategy] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        initializeConversation();
    }, []);

    useEffect(() => {
        if (sessionId) {
            fetchResumePreview();
        }
    }, [sessionId, messages]);

    const initializeConversation = async () => {
        try {
            const response = await fetch('/api/v1/conversation/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: null })
            });

            if (response.ok) {
                const data = await response.json();
                setSessionId(data.session_id);
                setCurrentPhase(data.phase);
                
                const welcomeMessage = {
                    id: 1,
                    type: 'ai',
                    content: data.message,
                    timestamp: new Date(),
                    phase: data.phase
                };
                setMessages([welcomeMessage]);
                setProgressPercentage(10);
            }
        } catch (error) {
            console.error('Failed to initialize conversation:', error);
        }
    };

    const fetchResumePreview = async () => {
        if (!sessionId) return;
        
        try {
            const response = await fetch(`/api/v1/conversation/${sessionId}/resume-preview`);
            if (response.ok) {
                const preview = await response.json();
                setResumePreview(preview);
            }
        } catch (error) {
            console.error('Failed to fetch resume preview:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!currentInput.trim() || !sessionId) return;

        const userMessage = {
            id: messages.length + 1,
            type: 'user',
            content: currentInput,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);
        
        const userInputCopy = currentInput;
        setCurrentInput('');

        try {
            const response = await fetch('/api/v1/conversation/respond', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: sessionId,
                    user_input: userInputCopy
                })
            });

            if (response.ok) {
                const data = await response.json();
                
                const aiMessage = {
                    id: messages.length + 2,
                    type: 'ai',
                    content: data.message,
                    timestamp: new Date(),
                    phase: data.phase
                };

                setMessages(prev => [...prev, aiMessage]);
                setCurrentPhase(data.phase);
                setProgressPercentage(data.progress_percentage);
                setFollowUpStrategy(data.follow_up_strategy);
                
                // Notify parent if resume is completed
                if (data.phase === 'review' && onResumeGenerated && resumePreview) {
                    onResumeGenerated({
                        name: resumePreview.name,
                        role: resumePreview.target_role,
                        generatedAt: new Date()
                    });
                }
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const getPhaseLabel = () => {
        const phaseLabels = {
            'introduction': 'Introduction',
            'story_discovery': 'Story Discovery',
            'achievement_mining': 'Achievement Mining',
            'quantification': 'Quantification',
            'optimization': 'Optimization',
            'synthesis': 'Resume Synthesis',
            'review': 'Complete'
        };
        return phaseLabels[currentPhase] || 'In Progress';
    };

    const getPhaseIcon = () => {
        const icons = {
            'introduction': <Users className="w-4 h-4" />,
            'story_discovery': <BookOpen className="w-4 h-4" />,
            'achievement_mining': <Award className="w-4 h-4" />,
            'quantification': <BarChart3 className="w-4 h-4" />,
            'optimization': <Target className="w-4 h-4" />,
            'synthesis': <Sparkles className="w-4 h-4" />,
            'review': <CheckCircle className="w-4 h-4" />
        };
        return icons[currentPhase] || <Activity className="w-4 h-4" />;
    };

    const getFollowUpBadge = () => {
        if (!followUpStrategy) return null;
        
        const strategies = {
            'quantification_probe': { label: 'Needs Numbers', color: 'bg-orange-100 text-orange-800' },
            'confidence_boost': { label: 'Confidence Boost', color: 'bg-green-100 text-green-800' },
            'clarification': { label: 'Needs Clarity', color: 'bg-blue-100 text-blue-800' },
            'depth_exploration': { label: 'More Detail', color: 'bg-purple-100 text-purple-800' },
            'proceed': { label: 'On Track', color: 'bg-emerald-100 text-emerald-800' }
        };
        
        const strategy = strategies[followUpStrategy];
        if (!strategy) return null;
        
        return (
            <Badge className={`${strategy.color} text-xs`}>
                {strategy.label}
            </Badge>
        );
    };

    return (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Conversation Interface */}
            <div className="lg:col-span-2">
                {/* Progress Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            {getPhaseIcon()}
                            <span className="text-sm font-medium text-gray-700">{getPhaseLabel()}</span>
                            {getFollowUpBadge()}
                        </div>
                        <span className="text-sm text-gray-500">{progressPercentage.toFixed(0)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Chat Interface */}
                <Card className="h-[600px] flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="w-5 h-5 text-blue-600" />
                            ROCKET Framework - Career Acceleration Toolkit
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-lg p-4 ${message.type === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-50 text-gray-900 border'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {message.type === 'ai' && (
                                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Bot className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                            {message.content}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 opacity-70">
                                        <span className="text-xs">
                                            {message.timestamp.toLocaleTimeString()}
                                        </span>
                                        {message.phase && (
                                            <Badge variant="outline" className="text-xs">
                                                {getPhaseLabel()}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-gray-50 border rounded-lg p-4 max-w-[85%]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
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
                                placeholder="Share your experiences and achievements..."
                                className="flex-1"
                                disabled={isTyping || currentPhase === 'review'}
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={!currentInput.trim() || isTyping || currentPhase === 'review'}
                                size="sm"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Framework Tips */}
                <Card className="mt-4">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 text-orange-500 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-gray-900 mb-1">ROCKET Framework Tips</h4>
                                <p className="text-sm text-gray-600">
                                    🚀 <strong>CAR Method:</strong> Context (situation), Action (what you did), Results (measurable impact)
                                    <br />
                                    📊 <strong>REST Framework:</strong> Results, Efficiency, Scope, Time - quantify everything!
                                    <br />
                                    🎯 <strong>Be Specific:</strong> Use numbers, percentages, timelines, and business outcomes.
                                    <br />
                                    ⚡ <strong>ROCKET Power:</strong> Results-Optimized Career Knowledge Enhancement Toolkit
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Live Resume Preview */}
            <div className="lg:col-span-1">
                <Card className="sticky top-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Eye className="w-5 h-5 text-green-600" />
                            Live Resume Preview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {resumePreview ? (
                            <>
                                {/* Header */}
                                <div className="text-center border-b pb-4">
                                    <h2 className="text-xl font-bold text-gray-900">{resumePreview.name}</h2>
                                    <p className="text-gray-600 font-medium">{resumePreview.target_role}</p>
                                </div>

                                {/* Progress Scores */}
                                <div className="space-y-3">
                                    <h3 className="font-medium text-gray-900">Framework Scores</h3>
                                    {Object.entries(resumePreview.progress_scores || {}).map(([key, score]) => (
                                        <div key={key} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="capitalize">{key.replace('_', ' ')}</span>
                                                <span>{(score * 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                <div
                                                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                                    style={{ width: `${score * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Resume Summary */}
                                {resumePreview.summary && (
                                    <div className="space-y-2">
                                        <h3 className="font-medium text-gray-900">Professional Summary</h3>
                                        <div className="text-sm text-gray-700 space-y-1">
                                            {resumePreview.summary.bullets.map((bullet, index) => (
                                                <p key={index} className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                                    {bullet}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Work Experiences */}
                                {resumePreview.experiences && resumePreview.experiences.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="font-medium text-gray-900">Work Experience</h3>
                                        <div className="space-y-3">
                                            {resumePreview.experiences.map((exp, index) => (
                                                <div key={index} className="text-sm border-l-2 border-blue-200 pl-3">
                                                    <div className="font-medium">{exp.title || 'Position'}</div>
                                                    <div className="text-gray-600">{exp.company || 'Company'}</div>
                                                    {exp.car_structure && (
                                                        <div className="mt-1 text-xs text-gray-500">
                                                            <div><strong>Context:</strong> {exp.car_structure.context}</div>
                                                            <div><strong>Results:</strong> {exp.car_structure.results}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Skills */}
                                {resumePreview.skills && resumePreview.skills.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="font-medium text-gray-900">Skills</h3>
                                        <div className="flex flex-wrap gap-1">
                                            {resumePreview.skills.map((skill, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p className="text-sm">Your resume will appear here as we build it together...</p>
                            </div>
                        )}

                        {/* Download Button */}
                        {resumePreview && currentPhase === 'review' && (
                            <Button className="w-full mt-4" variant="default">
                                <Download className="w-4 h-4 mr-2" />
                                Download Resume
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ConversationalResumeBuilder;