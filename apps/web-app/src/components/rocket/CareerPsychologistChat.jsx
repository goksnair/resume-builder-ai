import React, { useState } from 'react';
import {
    Brain,
    Users,
    MessageCircle,
    TrendingUp,
    Target,
    Award,
    Lightbulb,
    Eye,
    Heart,
    Zap
} from 'lucide-react';

/**
 * Career Psychologist Chat Interface
 * 
 * Specialized interface for Dr. Maya Insight personality analysis
 * and psychological career coaching
 */
const CareerPsychologistChat = ({
    personalityAnalysis,
    onRequestAnalysis,
    isAnalyzing = false,
    conversationHistory = []
}) => {
    const [activeSection, setActiveSection] = useState('overview');

    if (!personalityAnalysis && !isAnalyzing) {
        return <PersonalityAnalysisPrompt onRequestAnalysis={onRequestAnalysis} />;
    }

    if (isAnalyzing) {
        return <AnalysisInProgress />;
    }

    return (
        <div className="space-y-6">
            {/* Dr. Maya Insight Header */}
            <PsychologistHeader />

            {/* Analysis Navigation */}
            <AnalysisNavigation
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                personalityAnalysis={personalityAnalysis}
            />

            {/* Analysis Content */}
            <AnalysisContent
                activeSection={activeSection}
                personalityAnalysis={personalityAnalysis}
                conversationHistory={conversationHistory}
            />
        </div>
    );
};

/**
 * Dr. Maya Insight Header
 */
const PsychologistHeader = () => {
    return (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <Brain className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-purple-900">Dr. Maya Insight</h2>
                    <p className="text-purple-700">Career Psychology Specialist</p>
                    <p className="text-sm text-purple-600 mt-1">
                        AI-powered personality analysis for career optimization
                    </p>
                </div>
            </div>
        </div>
    );
};

/**
 * Analysis Navigation Tabs
 */
const AnalysisNavigation = ({ activeSection, onSectionChange, personalityAnalysis }) => {
    const sections = [
        {
            id: 'overview',
            label: 'Personality Overview',
            icon: Eye,
            available: !!personalityAnalysis
        },
        {
            id: 'traits',
            label: 'Dominant Traits',
            icon: Target,
            available: !!personalityAnalysis?.dominant_traits
        },
        {
            id: 'workstyle',
            label: 'Work Style',
            icon: Users,
            available: !!personalityAnalysis?.work_style
        },
        {
            id: 'recommendations',
            label: 'Career Recommendations',
            icon: Lightbulb,
            available: !!personalityAnalysis?.career_recommendations
        }
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
                <button
                    key={section.id}
                    onClick={() => section.available && onSectionChange(section.id)}
                    disabled={!section.available}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${activeSection === section.id
                            ? 'bg-purple-100 text-purple-700 border-purple-300'
                            : section.available
                                ? 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                                : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                        }`}
                >
                    <section.icon className="w-4 h-4" />
                    {section.label}
                </button>
            ))}
        </div>
    );
};

/**
 * Analysis Content Display
 */
const AnalysisContent = ({ activeSection, personalityAnalysis, conversationHistory }) => {
    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return <PersonalityOverview analysis={personalityAnalysis} />;
            case 'traits':
                return <DominantTraits traits={personalityAnalysis?.dominant_traits} />;
            case 'workstyle':
                return <WorkStyleAnalysis workStyle={personalityAnalysis?.work_style} />;
            case 'recommendations':
                return <CareerRecommendations recommendations={personalityAnalysis?.career_recommendations} />;
            default:
                return <PersonalityOverview analysis={personalityAnalysis} />;
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            {renderContent()}
        </div>
    );
};

/**
 * Personality Overview Section
 */
const PersonalityOverview = ({ analysis }) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-purple-600" />
                    Personality Summary
                </h3>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-gray-800 leading-relaxed">
                        {analysis?.personality_summary || 'No summary available yet.'}
                    </p>
                </div>
            </div>

            {/* Confidence Score */}
            {analysis?.confidence_score && (
                <div>
                    <h4 className="font-medium text-gray-900 mb-2">Analysis Confidence</h4>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-purple-600 h-3 rounded-full transition-all duration-1000"
                                style={{ width: `${analysis.confidence_score * 100}%` }}
                            />
                        </div>
                        <span className="text-sm font-medium text-purple-600">
                            {Math.round(analysis.confidence_score * 100)}%
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        Based on conversation depth and response patterns
                    </p>
                </div>
            )}

            {/* Analysis Date */}
            {analysis?.analysis_date && (
                <div className="text-sm text-gray-500">
                    Analysis completed: {new Date(analysis.analysis_date).toLocaleString()}
                </div>
            )}
        </div>
    );
};

/**
 * Dominant Traits Display
 */
const DominantTraits = ({ traits = [] }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Dominant Personality Traits
            </h3>

            <div className="grid gap-4">
                {traits.map((trait, index) => (
                    <TraitCard key={index} trait={trait} rank={index + 1} />
                ))}
            </div>

            {traits.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No traits analyzed yet. Continue the conversation for better insights.</p>
                </div>
            )}
        </div>
    );
};

/**
 * Individual Trait Card
 */
const TraitCard = ({ trait, rank }) => {
    const getTraitIcon = (traitName) => {
        const iconMap = {
            'Analytical': TrendingUp,
            'Leadership': Users,
            'Innovation': Lightbulb,
            'Communication': MessageCircle,
            'Empathy': Heart,
            'Drive': Zap
        };
        return iconMap[traitName] || Award;
    };

    const getStrengthColor = (strength) => {
        if (strength >= 80) return 'text-green-600 bg-green-50 border-green-200';
        if (strength >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
        if (strength >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-gray-600 bg-gray-50 border-gray-200';
    };

    const Icon = getTraitIcon(trait.trait);

    return (
        <div className={`rounded-lg border p-4 ${getStrengthColor(trait.strength)}`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="font-semibold">{trait.trait}</h4>
                        <span className="text-xs opacity-75">#{rank} Dominant Trait</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold">{trait.strength}%</div>
                    <div className="text-xs opacity-75">Strength</div>
                </div>
            </div>

            <p className="text-sm opacity-90">{trait.description}</p>

            {/* Strength Bar */}
            <div className="mt-3">
                <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                    <div
                        className="bg-current h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${trait.strength}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

/**
 * Work Style Analysis
 */
const WorkStyleAnalysis = ({ workStyle }) => {
    if (!workStyle) {
        return (
            <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Work style analysis not available yet.</p>
            </div>
        );
    }

    const styleCategories = [
        {
            key: 'collaboration_preference',
            label: 'Collaboration Style',
            icon: Users,
            value: workStyle.collaboration_preference
        },
        {
            key: 'communication_style',
            label: 'Communication',
            icon: MessageCircle,
            value: workStyle.communication_style
        },
        {
            key: 'problem_solving_approach',
            label: 'Problem Solving',
            icon: Lightbulb,
            value: workStyle.problem_solving_approach
        },
        {
            key: 'leadership_style',
            label: 'Leadership Style',
            icon: Target,
            value: workStyle.leadership_style
        }
    ];

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Work Style Profile
            </h3>

            <div className="grid gap-4">
                {styleCategories.map((category) => (
                    <div key={category.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-3">
                            <category.icon className="w-5 h-5 text-purple-600" />
                            <span className="font-medium text-gray-900">{category.label}</span>
                        </div>
                        <span className="text-purple-700 font-semibold">{category.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * Career Recommendations
 */
const CareerRecommendations = ({ recommendations = [] }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-purple-600" />
                Career Recommendations
            </h3>

            <div className="space-y-3">
                {recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <p className="text-gray-800">{recommendation}</p>
                    </div>
                ))}
            </div>

            {recommendations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <Lightbulb className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Career recommendations will appear after personality analysis.</p>
                </div>
            )}
        </div>
    );
};

/**
 * Personality Analysis Prompt
 */
const PersonalityAnalysisPrompt = ({ onRequestAnalysis }) => {
    return (
        <div className="text-center py-12">
            <div className="max-w-md mx-auto">
                <Brain className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Ready for Personality Analysis?
                </h3>
                <p className="text-gray-600 mb-6">
                    Dr. Maya Insight can analyze your conversation patterns to provide personalized
                    career insights and personality-driven recommendations.
                </p>
                <button
                    onClick={onRequestAnalysis}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
                >
                    <Brain className="w-5 h-5" />
                    Start Personality Analysis
                </button>
                <p className="text-sm text-gray-500 mt-3">
                    Analysis takes about 2-3 minutes based on your conversation history
                </p>
            </div>
        </div>
    );
};

/**
 * Analysis In Progress
 */
const AnalysisInProgress = () => {
    return (
        <div className="text-center py-12">
            <div className="max-w-md mx-auto">
                <div className="relative">
                    <Brain className="w-16 h-16 mx-auto mb-4 text-purple-600 animate-pulse" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" />
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Dr. Maya is Analyzing...
                </h3>
                <p className="text-gray-600 mb-4">
                    Processing your conversation patterns and personality indicators
                </p>
                <div className="flex justify-center space-x-1 mb-4">
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <p className="text-sm text-gray-500">
                    This usually takes 2-3 minutes...
                </p>
            </div>
        </div>
    );
};

export default CareerPsychologistChat;
