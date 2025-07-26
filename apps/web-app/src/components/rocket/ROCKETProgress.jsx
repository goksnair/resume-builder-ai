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
 * Displays real-time progress for the ROCKET Framework completion
 * including Personal Story, Experience Mining, Quantification, and Overall Score
 * 
 * @param {Object} progress - Progress data from ROCKET session
 * @param {Object} components_status - Status of individual components
 * @returns {JSX.Element} Progress dashboard
 */
const ROCKETProgress = ({
    progress = {
        story_completion: 0,
        experience_mining: 0,
        quantification_rate: 0,
        overall_score: 0
    },
    components_status = {
        personal_story: false,
        experiences_count: 0,
        quantified_achievements: 0,
        session_active: false
    }
}) => {
    const progressCards = [
        {
            id: 'story',
            title: 'Personal Story',
            progress: progress.story_completion,
            icon: Target,
            description: 'Career narrative clarity',
            color: 'blue',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            progressColor: 'bg-blue-500'
        },
        {
            id: 'mining',
            title: 'Experience Mining',
            progress: progress.experience_mining,
            icon: TrendingUp,
            description: 'Achievement extraction',
            color: 'green',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
            progressColor: 'bg-green-500'
        },
        {
            id: 'quantification',
            title: 'Quantification',
            progress: progress.quantification_rate,
            icon: BarChart3,
            description: 'Results with numbers',
            color: 'purple',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
            progressColor: 'bg-purple-500'
        },
        {
            id: 'overall',
            title: 'Overall ROCKET',
            progress: progress.overall_score,
            icon: CheckCircle,
            description: 'Framework completion',
            color: 'orange',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600',
            progressColor: 'bg-orange-500'
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

            {/* Progress Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {progressCards.map((card) => (
                    <ProgressCard
                        key={card.id}
                        {...card}
                    />
                ))}
            </div>

            {/* Component Status Indicators */}
            <ComponentStatusIndicators status={components_status} />
        </div>
    );
};

/**
 * Individual Progress Card Component
 */
const ProgressCard = ({
    title,
    progress,
    icon: Icon,
    description,
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
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <Icon className={`w-6 h-6 ${textColor}`} />
                <span className={`text-2xl font-bold ${textColor}`}>
                    {Math.round(progress)}%
                </span>
            </div>

            {/* Title and Description */}
            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600 mb-4">{description}</p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`${progressColor} h-2 rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${animatedProgress}%` }}
                />
            </div>
        </div>
    );
};

/**
 * Component Status Indicators
 */
const ComponentStatusIndicators = ({ status }) => {
    const indicators = [
        {
            label: 'Personal Story',
            value: status.personal_story ? 'Complete' : 'Pending',
            icon: FileText,
            status: status.personal_story ? 'success' : 'pending'
        },
        {
            label: 'Experiences Captured',
            value: `${status.experiences_count} experiences`,
            icon: Brain,
            status: status.experiences_count > 0 ? 'success' : 'pending'
        },
        {
            label: 'Quantified Achievements',
            value: `${status.quantified_achievements} achievements`,
            icon: BarChart3,
            status: status.quantified_achievements > 0 ? 'success' : 'pending'
        },
        {
            label: 'Session Duration',
            value: status.session_active ? 'Active' : 'Not Started',
            icon: Clock,
            status: status.session_active ? 'active' : 'pending'
        }
    ];

    const getStatusStyles = (status) => {
        switch (status) {
            case 'success':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'active':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'pending':
            default:
                return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-gray-600" />
                Framework Components Status
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {indicators.map((indicator, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md border ${getStatusStyles(indicator.status)}`}
                    >
                        <indicator.icon className="w-4 h-4" />
                        <div>
                            <p className="text-xs font-medium">{indicator.label}</p>
                            <p className="text-xs opacity-75">{indicator.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ROCKETProgress;
