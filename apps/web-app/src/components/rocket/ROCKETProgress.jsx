import React from 'react';
import {
    Target,
    TrendingUp,
    BarChart3,
    CheckCircle,
    Brain,
    FileText,
    Clock,
    Zap
} from 'lucide-react';

/**
 * ROCKETProgress Component
 * 
 * Displays real-time progress for the complete ROCKET Framework:
 * R - Results: Career achievement and quantifiable outcomes
 * O - Optimization: Professional development and growth areas  
 * C - Clarity: Communication style and value proposition
 * K - Knowledge: Industry expertise and skills assessment
 * E - Efficiency: Job search strategy and time management
 * T - Targeting: Career positioning and goal alignment
 * 
 * @param {Object} rocketScores - ROCKET component scores (0-1 scale)
 * @param {string} currentPhase - Current conversation phase
 * @param {number} completionPercentage - Overall completion percentage
 * @param {Object} sessionStats - Session statistics
 * @returns {JSX.Element} Comprehensive ROCKET progress dashboard
 */
const ROCKETProgress = ({
    rocketScores = {
        results: 0,
        optimization: 0,
        clarity: 0,
        knowledge: 0,
        efficiency: 0,
        targeting: 0,
        overall: 0
    },
    currentPhase = 'introduction',
    completionPercentage = 0,
    sessionStats = {
        totalInteractions: 0,
        sessionDuration: '0 minutes',
        qualityScore: 0
    }
}) => {
    const rocketComponents = [
        {
            id: 'results',
            title: 'Results',
            subtitle: 'R',
            progress: rocketScores.results * 100,
            icon: Target,
            description: 'Career achievements & quantifiable outcomes',
            weight: '25%',
            color: 'blue',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            progressColor: 'bg-blue-500'
        },
        {
            id: 'optimization',
            title: 'Optimization',
            subtitle: 'O',
            progress: rocketScores.optimization * 100,
            icon: TrendingUp,
            description: 'Professional development & growth areas',
            weight: '15%',
            color: 'green',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
            progressColor: 'bg-green-500'
        },
        {
            id: 'clarity',
            title: 'Clarity',
            subtitle: 'C',
            progress: rocketScores.clarity * 100,
            icon: Brain,
            description: 'Communication style & value proposition',
            weight: '20%',
            color: 'purple',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
            progressColor: 'bg-purple-500'
        },
        {
            id: 'knowledge',
            title: 'Knowledge',
            subtitle: 'K',
            progress: rocketScores.knowledge * 100,
            icon: FileText,
            description: 'Industry expertise & skills assessment',
            weight: '20%',
            color: 'indigo',
            bgColor: 'bg-indigo-50',
            textColor: 'text-indigo-600',
            progressColor: 'bg-indigo-500'
        },
        {
            id: 'efficiency',
            title: 'Efficiency',
            subtitle: 'E',
            progress: rocketScores.efficiency * 100,
            icon: Clock,
            description: 'Job search strategy & time management',
            weight: '10%',
            color: 'orange',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600',
            progressColor: 'bg-orange-500'
        },
        {
            id: 'targeting',
            title: 'Targeting',
            subtitle: 'T',
            progress: rocketScores.targeting * 100,
            icon: BarChart3,
            description: 'Career positioning & goal alignment',
            weight: '10%',
            color: 'pink',
            bgColor: 'bg-pink-50',
            textColor: 'text-pink-600',
            progressColor: 'bg-pink-500'
        }
    ];

    return (
        <div className="mb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-blue-600" />
                        ROCKET Framework Progress
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Results-Optimized Career Knowledge Enhancement Toolkit
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${components_status.session_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm text-gray-600">
                        {components_status.session_active ? 'Active Session' : 'Ready to Start'}
                    </span>
                </div>
            </div>

            {/* Overall Score Display */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Overall ROCKET Score</h3>
                        <p className="text-blue-100">Weighted composite score based on all components</p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-bold">{Math.round(rocketScores.overall * 100)}%</div>
                        <div className="text-blue-200">Complete</div>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="bg-blue-500 bg-opacity-30 rounded-full h-3">
                        <div 
                            className="bg-white rounded-full h-3 transition-all duration-1000"
                            style={{ width: `${rocketScores.overall * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* ROCKET Components Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {rocketComponents.map((component) => (
                    <ROCKETComponentCard
                        key={component.id}
                        {...component}
                    />
                ))}
            </div>

            {/* Phase Progress & Session Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PhaseProgressCard currentPhase={currentPhase} completionPercentage={completionPercentage} />
                <SessionStatsCard stats={sessionStats} />
            </div>
        </div>
    );
};

/**
 * ROCKET Component Card - Enhanced version for individual ROCKET components
 */
const ROCKETComponentCard = ({
    title,
    subtitle,
    progress,
    icon: Icon,
    description,
    weight,
    bgColor,
    textColor,
    progressColor
}) => {
    const [animatedProgress, setAnimatedProgress] = React.useState(0);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedProgress(progress);
        }, 200);
        return () => clearTimeout(timer);
    }, [progress]);

    return (
        <div className={`${bgColor} rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all duration-300`}>
            {/* Header with ROCKET letter */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${textColor.replace('text-', 'bg-').replace('-600', '-100')} rounded-full flex items-center justify-center`}>
                        <span className={`text-lg font-bold ${textColor}`}>{subtitle}</span>
                    </div>
                    <Icon className={`w-5 h-5 ${textColor}`} />
                </div>
                <div className="text-right">
                    <span className={`text-2xl font-bold ${textColor}`}>
                        {Math.round(progress)}%
                    </span>
                    <div className="text-xs text-gray-500">{weight} weight</div>
                </div>
            </div>

            {/* Title and Description */}
            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600 mb-4">{description}</p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                    className={`${progressColor} h-3 rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${animatedProgress}%` }}
                />
            </div>
        </div>
    );
};

/**
 * Phase Progress Card
 */
const PhaseProgressCard = ({ currentPhase, completionPercentage }) => {
    const phases = [
        { id: 'introduction', label: 'Introduction', icon: '👋' },
        { id: 'story_extraction', label: 'Story Extraction', icon: '📖' },
        { id: 'car_analysis', label: 'CAR Analysis', icon: '🔍' },
        { id: 'rest_quantification', label: 'REST Quantification', icon: '📊' },
        { id: 'psychologist_insight', label: 'Psychology Insight', icon: '🧠' },
        { id: 'completion', label: 'Completion', icon: '✅' }
    ];

    const currentPhaseIndex = phases.findIndex(phase => phase.id === currentPhase);

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Conversation Phase Progress
            </h3>
            
            <div className="space-y-3">
                {phases.map((phase, index) => (
                    <div key={phase.id} className={`flex items-center gap-3 p-2 rounded ${
                        index === currentPhaseIndex ? 'bg-blue-50 border border-blue-200' : ''
                    }`}>
                        <span className="text-lg">{phase.icon}</span>
                        <span className={`flex-1 text-sm ${
                            index === currentPhaseIndex ? 'font-medium text-blue-900' : 
                            index < currentPhaseIndex ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                            {phase.label}
                        </span>
                        {index < currentPhaseIndex && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        {index === currentPhaseIndex && (
                            <div className="w-4 h-4 border-2 border-blue-500 rounded-full border-t-transparent animate-spin" />
                        )}
                    </div>
                ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span className="font-medium">{Math.round(completionPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${completionPercentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

/**
 * Session Statistics Card
 */
const SessionStatsCard = ({ stats }) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Session Statistics
            </h3>
            
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Interactions</span>
                    <span className="font-medium">{stats.totalInteractions}</span>
                </div>
                
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Session Duration</span>
                    <span className="font-medium">{stats.sessionDuration}</span>
                </div>
                
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Quality Score</span>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{Math.round(stats.qualityScore * 100)}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${stats.qualityScore * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                        {stats.totalInteractions >= 10 ? '🎯 Excellent engagement' :
                         stats.totalInteractions >= 5 ? '👍 Good progress' :
                         '📈 Keep going for better insights'}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ROCKETProgress;
