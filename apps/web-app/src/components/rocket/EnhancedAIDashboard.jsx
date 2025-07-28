import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// Use dynamic imports for better error handling
import {
    Target,
    Brain,
    TrendingUp,
    User,
    Zap,
    FileText,
    BarChart3,
    Clock
} from 'lucide-react';

// ROCKET Framework components
import ROCKETProgress from './ROCKETProgress';
import ConversationInterface from './ConversationInterface';
import CareerPsychologistChat from './CareerPsychologistChat';
import ResumeBuilder from './ResumeBuilder';
import CompleteROCKETFramework from './CompleteROCKETFramework';

// Custom hooks
import { useROCKETSession } from '../../hooks/useROCKETSession';

// Simple tabs implementation
const Tabs = ({ children, value, onValueChange, className = '' }) => {
    const [activeTab, setActiveTab] = useState(value);

    React.useEffect(() => {
        setActiveTab(value);
    }, [value]);

    const handleValueChange = (newValue) => {
        setActiveTab(newValue);
        if (onValueChange) {
            onValueChange(newValue);
        }
    };

    return (
        <div className={`tabs-container ${className}`}>
            {React.Children.map(children, child =>
                React.cloneElement(child, { activeTab, onValueChange: handleValueChange })
            )}
        </div>
    );
};

const TabsList = ({ children, activeTab, onValueChange, className = '' }) => {
    return (
        <div className={`flex border-b border-gray-200 bg-gray-50 ${className}`}>
            {React.Children.map(children, child =>
                React.cloneElement(child, { activeTab, onValueChange })
            )}
        </div>
    );
};

const TabsTrigger = ({ children, value, activeTab, onValueChange, className = '' }) => {
    const isActive = activeTab === value;

    return (
        <button
            onClick={() => onValueChange(value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${isActive
                    ? 'border-blue-500 text-blue-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } ${className}`}
        >
            {children}
        </button>
    );
};

const TabsContent = ({ children, value, activeTab, className = '' }) => {
    if (activeTab !== value) return null;

    return (
        <div className={`mt-4 ${className}`}>
            {children}
        </div>
    );
};

/**
 * Enhanced AI Dashboard with ROCKET Framework Integration
 * 
 * Combines existing resume analysis with new ROCKET career coaching
 * and personality analysis features
 */
const EnhancedAIDashboard = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'rocket-builder');
    const [processingMode, setProcessingMode] = useState('rocket');

    // Mock user ID - replace with actual authentication
    const userId = 'user_demo_001';

    // ROCKET session management
    const {
        session,
        isSessionActive,
        isLoading,
        error,
        messages,
        progress,
        componentsStatus,
        personalityAnalysis,
        isAnalyzing,
        startSession,
        sendMessage,
        requestPersonalityAnalysis,
        clearError,
        resetSession
    } = useROCKETSession(userId);

    // Update URL when tab changes
    useEffect(() => {
        setSearchParams({ tab: activeTab });
    }, [activeTab, setSearchParams]);

    // Auto-start session when entering ROCKET builder
    useEffect(() => {
        if (activeTab === 'rocket-builder' && !session && !isLoading) {
            startSession('integrated');
        }
    }, [activeTab, session, isLoading, startSession]);

    const handleTabChange = (newTab) => {
        setActiveTab(newTab);

        // Auto-switch processing mode based on tab
        if (newTab === 'psychologist') {
            setProcessingMode('psychologist');
        } else if (newTab === 'rocket-builder') {
            setProcessingMode('rocket');
        } else {
            setProcessingMode('general');
        }
    };

    const handleSendMessage = async (message, mode) => {
        const success = await sendMessage(message, mode);
        if (!success && error) {
            console.error('Message failed:', error);
        }
    };

    const handleRequestAnalysis = async () => {
        const success = await requestPersonalityAnalysis();
        if (success) {
            setActiveTab('psychologist');
        }
    };

    const tabConfig = [
        {
            id: 'rocket-builder',
            label: 'ROCKET Builder',
            icon: Target,
            description: 'Career framework coaching',
            color: 'text-blue-600'
        },
        {
            id: 'resume-builder',
            label: 'Resume Builder',
            icon: FileText,
            description: 'AI-powered resume creation',
            color: 'text-indigo-600'
        },
        {
            id: 'psychologist',
            label: 'Career Psychology',
            icon: Brain,
            description: 'Personality analysis',
            color: 'text-purple-600'
        },
        {
            id: 'analysis',
            label: 'Resume Analysis',
            icon: TrendingUp,
            description: 'Resume optimization',
            color: 'text-green-600'
        },
        {
            id: 'templates',
            label: 'Templates',
            icon: User,
            description: 'Professional templates',
            color: 'text-orange-600'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <Zap className="w-10 h-10 text-blue-600" />
                        AI Career Dashboard
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Powered by the ROCKET Framework - Your comprehensive career development companion
                    </p>
                </div>

                {/* ROCKET Progress - Always visible when session active */}
                {isSessionActive && (
                    <ROCKETProgress
                        progress={progress}
                        components_status={componentsStatus}
                    />
                )}

                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <p className="text-red-700">{error}</p>
                            <button
                                onClick={clearError}
                                className="text-red-600 hover:text-red-800"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Content Tabs */}
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    {/* Tab Navigation */}
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
                        {tabConfig.map((tab) => (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className="flex items-center gap-2 p-3"
                            >
                                <tab.icon className={`w-4 h-4 ${tab.color}`} />
                                <div className="text-left hidden sm:block">
                                    <div className="font-medium">{tab.label}</div>
                                    <div className="text-xs text-gray-500">{tab.description}</div>
                                </div>
                                <div className="block sm:hidden font-medium">{tab.label}</div>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* ROCKET Builder Tab - Complete Framework */}
                    <TabsContent value="rocket-builder" className="space-y-6">
                        <CompleteROCKETFramework
                            apiUrl="https://resume-builder-ai-production.up.railway.app"
                            onComplete={(results) => {
                                console.log('ROCKET Framework completed:', results);
                                // Handle completion - could save to database, export, etc.
                            }}
                            initialMode="integrated"
                        />
                    </TabsContent>

                    {/* Resume Builder Tab */}
                    <TabsContent value="resume-builder" className="space-y-6">
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <ResumeBuilder
                                onAnalyze={(resumeData) => {
                                    // Handle resume analysis
                                    console.log('Analyzing resume:', resumeData);
                                }}
                                analysisResults={null}
                                isAnalyzing={false}
                                rocketSession={session}
                            />
                        </div>
                    </TabsContent>

                    {/* Career Psychology Tab */}
                    <TabsContent value="psychologist" className="space-y-6">
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                            <CareerPsychologistChat
                                personalityAnalysis={personalityAnalysis}
                                onRequestAnalysis={handleRequestAnalysis}
                                isAnalyzing={isAnalyzing}
                                conversationHistory={messages}
                            />
                        </div>
                    </TabsContent>

                    {/* Resume Analysis Tab (Existing functionality) */}
                    <TabsContent value="analysis" className="space-y-6">
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                                Resume Analysis
                            </h2>
                            <div className="text-center py-12 text-gray-500">
                                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-semibold mb-2">Resume Analysis Coming Soon</h3>
                                <p>Upload your resume for detailed analysis and optimization suggestions.</p>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Templates Tab (Link to existing) */}
                    <TabsContent value="templates" className="space-y-6">
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                                <User className="w-6 h-6 text-orange-600" />
                                Professional Templates
                            </h2>
                            <div className="text-center py-12">
                                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-semibold mb-2">Professional Resume Templates</h3>
                                <p className="text-gray-600 mb-6">
                                    Access job-specific resume templates optimized for ATS systems.
                                </p>
                                <a
                                    href="/professional-templates"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                                >
                                    <FileText className="w-4 h-4" />
                                    Browse Templates
                                </a>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Session Status Bar */}
                {isSessionActive && (
                    <SessionStatusBar
                        session={session}
                        messageCount={messages.length}
                        progress={progress}
                        onEndSession={resetSession}
                    />
                )}
            </div>
        </div>
    );
};

/**
 * Session Start Prompt
 */
const SessionStartPrompt = ({ onStartSession }) => {
    return (
        <div className="text-center py-12">
            <Target className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Start Your ROCKET Journey
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Begin building your career narrative with our AI-powered framework that helps you
                identify, articulate, and quantify your professional achievements.
            </p>
            <button
                onClick={onStartSession}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
                <Zap className="w-5 h-5" />
                Start ROCKET Session
            </button>
        </div>
    );
};

/**
 * Session Status Bar
 */
const SessionStatusBar = ({ session, messageCount, progress, onEndSession }) => {
    const [sessionDuration, setSessionDuration] = useState(0);

    useEffect(() => {
        if (!session?.created_at) return;

        const startTime = new Date(session.created_at);
        const interval = setInterval(() => {
            const now = new Date();
            const duration = Math.floor((now - startTime) / 1000);
            setSessionDuration(duration);
        }, 1000);

        return () => clearInterval(interval);
    }, [session?.created_at]);

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg border border-gray-200 shadow-lg p-4 max-w-sm">
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">Session Active</h4>
                <button
                    onClick={onEndSession}
                    className="text-xs text-gray-500 hover:text-gray-700"
                >
                    End Session
                </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                    <div className="text-lg font-bold text-blue-600">{Math.round(progress.overall_score)}%</div>
                    <div className="text-xs text-gray-600">Progress</div>
                </div>
                <div>
                    <div className="text-lg font-bold text-green-600">{messageCount}</div>
                    <div className="text-xs text-gray-600">Messages</div>
                </div>
                <div>
                    <div className="text-lg font-bold text-purple-600 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(sessionDuration)}
                    </div>
                    <div className="text-xs text-gray-600">Duration</div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedAIDashboard;
