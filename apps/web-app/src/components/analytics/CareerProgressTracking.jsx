import React, { useState, useEffect } from 'react';
import { 
    Target, 
    TrendingUp, 
    Award, 
    Brain,
    Clock,
    CheckCircle,
    Circle,
    ArrowRight,
    Star,
    Trophy,
    Zap,
    BarChart3,
    Users,
    Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Career Progress Tracking Component
 * 
 * Integrates with ROCKET Framework to display:
 * - ROCKET Framework assessment progress
 * - Career development milestones and goals
 * - Industry benchmark comparisons
 * - Skill development recommendations
 */
const CareerProgressTracking = ({ data, userId }) => {
    const [selectedDimension, setSelectedDimension] = useState('results');
    const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
    const [timelineView, setTimelineView] = useState('6months');

    // ROCKET Framework dimensions with detailed information
    const rocketDimensions = {
        results: {
            name: 'Results',
            icon: Target,
            color: 'blue',
            description: 'Career achievements and quantifiable outcomes',
            score: data.rocketProgress.results,
            insights: [
                'Strong quantifiable achievement tracking',
                'Excellent ROI demonstration skills',
                'Clear business impact articulation'
            ],
            nextSteps: [
                'Add 2-3 more financial impact metrics',
                'Quantify team leadership outcomes',
                'Include customer satisfaction scores'
            ]
        },
        optimization: {
            name: 'Optimization',
            icon: TrendingUp,
            color: 'green',
            description: 'Professional development and growth areas',
            score: data.rocketProgress.optimization,
            insights: [
                'Active continuous learning approach',
                'Strategic skill development planning',
                'Process improvement mindset'
            ],
            nextSteps: [
                'Complete advanced certification',
                'Develop automation expertise',
                'Learn emerging technologies'
            ]
        },
        clarity: {
            name: 'Clarity',
            icon: Lightbulb,
            color: 'yellow',
            description: 'Communication style and value proposition',
            score: data.rocketProgress.clarity,
            insights: [
                'Clear professional communication',
                'Strong value proposition',
                'Consistent messaging across platforms'
            ],
            nextSteps: [
                'Refine elevator pitch',
                'Develop thought leadership content',
                'Enhance personal branding'
            ]
        },
        knowledge: {
            name: 'Knowledge',
            icon: Brain,
            color: 'purple',
            description: 'Industry expertise and skills assessment',
            score: data.rocketProgress.knowledge,
            insights: [
                'Deep technical expertise',
                'Industry-specific knowledge',
                'Cross-functional understanding'
            ],
            nextSteps: [
                'Stay current with industry trends',
                'Expand domain expertise',
                'Learn complementary skills'
            ]
        },
        efficiency: {
            name: 'Efficiency',
            icon: Zap,
            color: 'orange',
            description: 'Job search strategy and time management',
            score: data.rocketProgress.efficiency,
            insights: [
                'Organized approach to tasks',
                'Effective time management',
                'Strategic priority setting'
            ],
            nextSteps: [
                'Optimize job search process',
                'Automate routine tasks',
                'Improve workflow efficiency'
            ]
        },
        targeting: {
            name: 'Targeting',
            icon: Award,
            color: 'red',
            description: 'Career positioning and goal alignment',
            score: data.rocketProgress.targeting,
            insights: [
                'Clear career direction',
                'Strategic role targeting',
                'Market positioning awareness'
            ],
            nextSteps: [
                'Refine career goals',
                'Research target companies',
                'Network in target industry'
            ]
        }
    };

    /**
     * Calculate overall ROCKET score
     */
    const calculateOverallScore = () => {
        const scores = Object.values(data.rocketProgress);
        return scores.reduce((sum, score) => sum + score, 0) / scores.length;
    };

    /**
     * Get progress color based on score
     */
    const getProgressColor = (score) => {
        if (score >= 0.9) return 'text-green-600 bg-green-500';
        if (score >= 0.8) return 'text-blue-600 bg-blue-500';
        if (score >= 0.7) return 'text-yellow-600 bg-yellow-500';
        return 'text-red-600 bg-red-500';
    };

    /**
     * Get performance tier
     */
    const getPerformanceTier = (score) => {
        if (score >= 0.9) return { tier: 'Elite', icon: Trophy, color: 'text-yellow-600' };
        if (score >= 0.8) return { tier: 'Advanced', icon: Star, color: 'text-blue-600' };
        if (score >= 0.7) return { tier: 'Proficient', icon: Award, color: 'text-green-600' };
        return { tier: 'Developing', icon: Target, color: 'text-orange-600' };
    };

    const overallScore = calculateOverallScore();
    const tier = getPerformanceTier(overallScore);
    const TierIcon = tier.icon;

    return (
        <div className="space-y-8">
            {/* ROCKET Framework Overview */}
            <motion.div 
                className="glass-card-v2 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-premium-900 flex items-center gap-3">
                            🚀 ROCKET Framework Progress
                        </h2>
                        <p className="text-premium-600 mt-1">
                            Results-Optimized Career Knowledge Enhancement Toolkit
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center gap-2 mb-1">
                            <TierIcon className={`w-6 h-6 ${tier.color}`} />
                            <span className={`text-lg font-bold ${tier.color}`}>
                                {tier.tier}
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-premium-900">
                            {Math.round(overallScore * 100)}%
                        </div>
                        <div className="text-sm text-premium-600">Overall Score</div>
                    </div>
                </div>

                {/* ROCKET Dimensions Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Object.entries(rocketDimensions).map(([key, dimension]) => {
                        const Icon = dimension.icon;
                        const score = dimension.score;
                        const isSelected = selectedDimension === key;
                        
                        return (
                            <motion.div
                                key={key}
                                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                                    isSelected 
                                        ? 'bg-white/20 ring-2 ring-blue-500' 
                                        : 'bg-white/5 hover:bg-white/10'
                                }`}
                                onClick={() => setSelectedDimension(key)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="text-center space-y-2">
                                    <Icon className={`w-6 h-6 mx-auto text-${dimension.color}-600`} />
                                    <div className="text-sm font-medium text-premium-900">
                                        {dimension.name}
                                    </div>
                                    <div className="text-lg font-bold text-premium-900">
                                        {Math.round(score * 100)}%
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`bg-${dimension.color}-500 h-2 rounded-full transition-all duration-500`}
                                            style={{ width: `${score * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Detailed Dimension Analysis */}
            <AnimatePresence mode="wait">
                <motion.div 
                    key={selectedDimension}
                    className="glass-card-v2 p-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {(() => {
                        const dimension = rocketDimensions[selectedDimension];
                        const Icon = dimension.icon;
                        
                        return (
                            <>
                                <div className="flex items-center gap-3 mb-6">
                                    <Icon className={`w-6 h-6 text-${dimension.color}-600`} />
                                    <div>
                                        <h3 className="text-xl font-semibold text-premium-900">
                                            {dimension.name} Analysis
                                        </h3>
                                        <p className="text-premium-600">{dimension.description}</p>
                                    </div>
                                    <div className="ml-auto text-right">
                                        <div className="text-2xl font-bold text-premium-900">
                                            {Math.round(dimension.score * 100)}%
                                        </div>
                                        <div className={`text-sm px-2 py-1 rounded-full ${
                                            dimension.score >= 0.9 ? 'bg-green-100 text-green-700' :
                                            dimension.score >= 0.8 ? 'bg-blue-100 text-blue-700' :
                                            dimension.score >= 0.7 ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {dimension.score >= 0.9 ? 'Excellent' :
                                             dimension.score >= 0.8 ? 'Good' :
                                             dimension.score >= 0.7 ? 'Fair' : 'Needs Work'}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Current Insights */}
                                    <div>
                                        <h4 className="font-semibold text-premium-900 mb-3 flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            Current Strengths
                                        </h4>
                                        <div className="space-y-2">
                                            {dimension.insights.map((insight, index) => (
                                                <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                                                    <Star className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm text-green-800">{insight}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Next Steps */}
                                    <div>
                                        <h4 className="font-semibold text-premium-900 mb-3 flex items-center gap-2">
                                            <ArrowRight className="w-4 h-4 text-blue-600" />
                                            Development Opportunities
                                        </h4>
                                        <div className="space-y-2">
                                            {dimension.nextSteps.map((step, index) => (
                                                <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                                                    <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm text-blue-800">{step}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        );
                    })()}
                </motion.div>
            </AnimatePresence>

            {/* Career Milestones */}
            <motion.div 
                className="glass-card-v2 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-premium-900">
                        Career Development Milestones
                    </h3>
                    <div className="flex gap-2">
                        {['3months', '6months', '1year'].map((period) => (
                            <button
                                key={period}
                                onClick={() => setTimelineView(period)}
                                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                    timelineView === period
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                            >
                                {period === '3months' ? '3M' : period === '6months' ? '6M' : '1Y'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    {data.milestones.map((milestone, index) => {
                        const progressPercentage = (milestone.progress / milestone.target) * 100;
                        
                        return (
                            <div key={milestone.name} className="glass-card-v2 p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            milestone.progress >= milestone.target 
                                                ? 'bg-green-500 text-white' 
                                                : 'bg-blue-500 text-white'
                                        }`}>
                                            {milestone.progress >= milestone.target ? (
                                                <CheckCircle className="w-4 h-4" />
                                            ) : (
                                                <Clock className="w-4 h-4" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-premium-900">{milestone.name}</h4>
                                            <p className="text-sm text-premium-600">
                                                {milestone.progress}% complete • Target: {milestone.target}%
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-sm font-medium ${
                                            milestone.progress >= milestone.target 
                                                ? 'text-green-600' 
                                                : 'text-blue-600'
                                        }`}>
                                            {milestone.progress >= milestone.target ? 'Completed' : 'In Progress'}
                                        </div>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div 
                                            className={`h-3 rounded-full transition-all duration-1000 ${
                                                milestone.progress >= milestone.target 
                                                    ? 'bg-green-500' 
                                                    : 'bg-blue-500'
                                            }`}
                                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                                        />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xs font-medium text-white drop-shadow-md">
                                            {progressPercentage.toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Industry Benchmarks */}
            <motion.div 
                className="glass-card-v2 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h3 className="text-xl font-semibold text-premium-900 mb-6">
                    Industry Benchmark Comparison
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(data.industryBenchmarks).map(([metric, scores]) => (
                        <div key={metric} className="space-y-4">
                            <h4 className="font-medium text-premium-900 capitalize">
                                {metric.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            
                            {/* Your Score */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-premium-700">Your Score</span>
                                    <span className="font-semibold text-blue-600">{scores.you}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${scores.you}%` }}
                                    />
                                </div>
                            </div>

                            {/* Industry Average */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-premium-700">Industry Average</span>
                                    <span className="font-semibold text-gray-600">{scores.industry}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-gray-400 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${scores.industry}%` }}
                                    />
                                </div>
                            </div>

                            {/* Performance Indicator */}
                            <div className={`text-center p-2 rounded-lg ${
                                scores.you > scores.industry 
                                    ? 'bg-green-50 text-green-700' 
                                    : 'bg-yellow-50 text-yellow-700'
                            }`}>
                                <div className="flex items-center justify-center gap-1">
                                    {scores.you > scores.industry ? (
                                        <TrendingUp className="w-4 h-4" />
                                    ) : (
                                        <Target className="w-4 h-4" />
                                    )}
                                    <span className="text-sm font-medium">
                                        {scores.you > scores.industry 
                                            ? `+${scores.you - scores.industry}% above average`
                                            : `${scores.industry - scores.you}% below average`
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Skill Development Recommendations */}
            <motion.div 
                className="glass-card-v2 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <h3 className="text-xl font-semibold text-premium-900 mb-6">
                    Personalized Development Recommendations
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Skills to Develop */}
                    <div>
                        <h4 className="font-medium text-premium-900 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            Priority Skills Development
                        </h4>
                        <div className="space-y-3">
                            {[
                                { skill: 'Machine Learning', urgency: 'High', timeframe: '3 months' },
                                { skill: 'Cloud Architecture', urgency: 'Medium', timeframe: '6 months' },
                                { skill: 'Leadership', urgency: 'Medium', timeframe: '6 months' }
                            ].map((item, index) => (
                                <div key={index} className="p-3 bg-white/5 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-premium-900">{item.skill}</span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            item.urgency === 'High' 
                                                ? 'bg-red-100 text-red-700' 
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {item.urgency}
                                        </span>
                                    </div>
                                    <div className="text-sm text-premium-600">
                                        Target timeline: {item.timeframe}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Items */}
                    <div>
                        <h4 className="font-medium text-premium-900 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                            Immediate Action Items
                        </h4>
                        <div className="space-y-3">
                            {[
                                { action: 'Complete online ML certification', priority: 1 },
                                { action: 'Join professional tech community', priority: 2 },
                                { action: 'Start side project portfolio', priority: 3 }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                        {item.priority}
                                    </div>
                                    <span className="text-sm text-premium-700">{item.action}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CareerProgressTracking;