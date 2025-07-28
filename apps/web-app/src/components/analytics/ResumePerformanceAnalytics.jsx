import React, { useState, useEffect } from 'react';
import { 
    Target, 
    TrendingUp, 
    TrendingDown, 
    AlertCircle, 
    CheckCircle,
    Zap,
    Users,
    Activity,
    ChevronRight,
    Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Resume Performance Analytics Component
 * 
 * Displays comprehensive analytics for resume performance including:
 * - ATS compatibility scores across different systems
 * - Job match percentiles and success rates
 * - Skills gap analysis and recommendations
 * - Resume optimization metrics and trends
 */
const ResumePerformanceAnalytics = ({ data, filters, timeRange }) => {
    const [selectedMetric, setSelectedMetric] = useState('ats');
    const [showRecommendations, setShowRecommendations] = useState(true);
    const [expandedSystem, setExpandedSystem] = useState(null);

    // Mock additional data for demonstration
    const [detailedMetrics, setDetailedMetrics] = useState({
        atsOptimization: {
            keywordDensity: 0.016,
            sectionStructure: 0.92,
            formatting: 0.88,
            length: 0.95,
            readability: 0.84
        },
        jobMatchAnalysis: {
            skillAlignment: 0.87,
            experienceMatch: 0.79,
            roleRelevance: 0.92,
            industryFit: 0.73
        },
        performanceTrends: {
            lastWeek: { ats: 85, jobMatch: 71 },
            lastMonth: { ats: 82, jobMatch: 68 },
            lastQuarter: { ats: 78, jobMatch: 65 }
        }
    });

    /**
     * Calculate improvement percentage
     */
    const calculateImprovement = (current, previous) => {
        if (!previous) return 0;
        return ((current - previous) / previous * 100).toFixed(1);
    };

    /**
     * Get performance status color
     */
    const getPerformanceColor = (score) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 80) return 'text-blue-600';
        if (score >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    /**
     * Get performance badge
     */
    const getPerformanceBadge = (score) => {
        if (score >= 90) return { label: 'Excellent', color: 'bg-green-500/10 text-green-700' };
        if (score >= 80) return { label: 'Good', color: 'bg-blue-500/10 text-blue-700' };
        if (score >= 70) return { label: 'Fair', color: 'bg-yellow-500/10 text-yellow-700' };
        return { label: 'Needs Improvement', color: 'bg-red-500/10 text-red-700' };
    };

    return (
        <div className="space-y-8">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ATS Compatibility Overview */}
                <motion.div 
                    className="glass-card-v2 p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-premium-900">ATS Compatibility</h3>
                        <Target className="w-5 h-5 text-blue-600" />
                    </div>
                    
                    <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-premium-900">
                            {Math.round(Object.values(data.atsCompatibility).reduce((a, b) => a + b, 0) / Object.keys(data.atsCompatibility).length)}%
                        </div>
                        <div className="text-sm text-premium-600">Average Score</div>
                    </div>

                    {/* Mini ATS Scores */}
                    <div className="space-y-2">
                        {Object.entries(data.atsCompatibility).slice(0, 3).map(([system, score]) => (
                            <div key={system} className="flex items-center justify-between">
                                <span className="text-sm text-premium-700 capitalize">{system}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${score}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-premium-900">{score}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Job Matching Overview */}
                <motion.div 
                    className="glass-card-v2 p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-premium-900">Job Matching</h3>
                        <Users className="w-5 h-5 text-green-600" />
                    </div>
                    
                    <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-premium-900">
                            {Math.round(Object.values(data.jobMatching).reduce((a, b) => a + b, 0) / Object.keys(data.jobMatching).length)}%
                        </div>
                        <div className="text-sm text-premium-600">Match Rate</div>
                    </div>

                    {/* Top Industries */}
                    <div className="space-y-2">
                        {Object.entries(data.jobMatching)
                            .sort(([,a], [,b]) => b - a)
                            .slice(0, 3)
                            .map(([industry, score]) => (
                            <div key={industry} className="flex items-center justify-between">
                                <span className="text-sm text-premium-700 capitalize">{industry}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-green-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${score}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-premium-900">{score}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Skills Gap Analysis */}
                <motion.div 
                    className="glass-card-v2 p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-premium-900">Skills Gap</h3>
                        <Zap className="w-5 h-5 text-orange-600" />
                    </div>
                    
                    <div className="space-y-3">
                        {data.skillsGap.slice(0, 3).map((skill, index) => {
                            const gap = skill.target - skill.current;
                            const gapPercentage = (gap / skill.target) * 100;
                            
                            return (
                                <div key={skill.skill} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-premium-700">
                                            {skill.skill}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            skill.priority === 'high' 
                                                ? 'bg-red-100 text-red-700' 
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {skill.priority}
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${(skill.current / skill.target) * 100}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-premium-600 mt-1">
                                            <span>Current: {skill.current}%</span>
                                            <span>Target: {skill.target}%</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Detailed ATS Analysis */}
            <motion.div 
                className="glass-card-v2 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-premium-900">
                        ATS System Compatibility Details
                    </h3>
                    <div className="text-sm text-premium-600">
                        Click on a system for detailed analysis
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(data.atsCompatibility).map(([system, score]) => {
                        const badge = getPerformanceBadge(score);
                        const isExpanded = expandedSystem === system;
                        
                        return (
                            <motion.div
                                key={system}
                                className={`glass-card-v2 p-4 cursor-pointer transition-all duration-300 ${
                                    isExpanded ? 'ring-2 ring-blue-500' : 'hover:bg-white/10'
                                }`}
                                onClick={() => setExpandedSystem(isExpanded ? null : system)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${
                                            score >= 90 ? 'bg-green-500' :
                                            score >= 80 ? 'bg-blue-500' :
                                            score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`} />
                                        <span className="font-medium text-premium-900 capitalize">
                                            {system}
                                        </span>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 text-premium-500 transition-transform ${
                                        isExpanded ? 'rotate-90' : ''
                                    }`} />
                                </div>

                                <div className="mb-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-2xl font-bold text-premium-900">
                                            {score}%
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${badge.color}`}>
                                            {badge.label}
                                        </span>
                                    </div>
                                    
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full transition-all duration-500 ${
                                                score >= 90 ? 'bg-green-500' :
                                                score >= 80 ? 'bg-blue-500' :
                                                score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                            style={{ width: `${score}%` }}
                                        />
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="border-t border-white/20 pt-3 space-y-2"
                                        >
                                            <div className="flex justify-between text-sm">
                                                <span className="text-premium-600">Keyword Density</span>
                                                <span className="text-premium-900">
                                                    {(detailedMetrics.atsOptimization.keywordDensity * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-premium-600">Structure</span>
                                                <span className="text-premium-900">
                                                    {Math.round(detailedMetrics.atsOptimization.sectionStructure * 100)}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-premium-600">Formatting</span>
                                                <span className="text-premium-900">
                                                    {Math.round(detailedMetrics.atsOptimization.formatting * 100)}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-premium-600">Readability</span>
                                                <span className="text-premium-900">
                                                    {Math.round(detailedMetrics.atsOptimization.readability * 100)}%
                                                </span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Performance Trends */}
            <motion.div 
                className="glass-card-v2 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <h3 className="text-xl font-semibold text-premium-900 mb-6">
                    Performance Trends
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* ATS Trend */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-600" />
                            <h4 className="font-medium text-premium-900">ATS Performance</h4>
                        </div>
                        
                        <div className="space-y-3">
                            {[
                                { period: 'This Week', score: detailedMetrics.performanceTrends.lastWeek.ats },
                                { period: 'Last Month', score: detailedMetrics.performanceTrends.lastMonth.ats },
                                { period: 'Last Quarter', score: detailedMetrics.performanceTrends.lastQuarter.ats }
                            ].map((item, index) => {
                                const improvement = index === 0 ? 
                                    calculateImprovement(item.score, detailedMetrics.performanceTrends.lastMonth.ats) :
                                    index === 1 ?
                                    calculateImprovement(item.score, detailedMetrics.performanceTrends.lastQuarter.ats) :
                                    null;
                                
                                return (
                                    <div key={item.period} className="flex items-center justify-between">
                                        <span className="text-sm text-premium-600">{item.period}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-premium-900">{item.score}%</span>
                                            {improvement && (
                                                <span className={`text-xs flex items-center gap-1 ${
                                                    improvement > 0 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {improvement > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                    {Math.abs(improvement)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Job Match Trend */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-green-600" />
                            <h4 className="font-medium text-premium-900">Job Matching</h4>
                        </div>
                        
                        <div className="space-y-3">
                            {[
                                { period: 'This Week', score: detailedMetrics.performanceTrends.lastWeek.jobMatch },
                                { period: 'Last Month', score: detailedMetrics.performanceTrends.lastMonth.jobMatch },
                                { period: 'Last Quarter', score: detailedMetrics.performanceTrends.lastQuarter.jobMatch }
                            ].map((item, index) => {
                                const improvement = index === 0 ? 
                                    calculateImprovement(item.score, detailedMetrics.performanceTrends.lastMonth.jobMatch) :
                                    index === 1 ?
                                    calculateImprovement(item.score, detailedMetrics.performanceTrends.lastQuarter.jobMatch) :
                                    null;
                                
                                return (
                                    <div key={item.period} className="flex items-center justify-between">
                                        <span className="text-sm text-premium-600">{item.period}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-premium-900">{item.score}%</span>
                                            {improvement && (
                                                <span className={`text-xs flex items-center gap-1 ${
                                                    improvement > 0 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {improvement > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                    {Math.abs(improvement)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Optimization Recommendations */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-orange-600" />
                            <h4 className="font-medium text-premium-900">Quick Wins</h4>
                        </div>
                        
                        <div className="space-y-3">
                            {[
                                { action: 'Add 3-5 more quantified achievements', impact: '+12%' },
                                { action: 'Optimize keyword density for Tech roles', impact: '+8%' },
                                { action: 'Improve section structure consistency', impact: '+6%' }
                            ].map((rec, index) => (
                                <div key={index} className="p-3 bg-white/5 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-premium-700 mb-1">{rec.action}</p>
                                            <span className="text-xs font-medium text-green-600">
                                                Expected: {rec.impact} improvement
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Actionable Recommendations */}
            <AnimatePresence>
                {showRecommendations && (
                    <motion.div 
                        className="glass-card-v2 p-6 border-l-4 border-blue-500"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-premium-900">
                                Performance Optimization Recommendations
                            </h3>
                            <button
                                onClick={() => setShowRecommendations(false)}
                                className="text-premium-500 hover:text-premium-700"
                            >
                                ×
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <h4 className="font-medium text-premium-800 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-600" />
                                    High Priority
                                </h4>
                                <div className="space-y-2">
                                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                        <p className="text-sm font-medium text-red-800">
                                            Low Taleo compatibility (78%)
                                        </p>
                                        <p className="text-xs text-red-600 mt-1">
                                            Remove tables and complex formatting for better parsing
                                        </p>
                                    </div>
                                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <p className="text-sm font-medium text-yellow-800">
                                            Healthcare industry match below 50%
                                        </p>
                                        <p className="text-xs text-yellow-600 mt-1">
                                            Add healthcare-specific keywords and certifications
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-medium text-premium-800 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    Optimization Opportunities
                                </h4>
                                <div className="space-y-2">
                                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-sm font-medium text-blue-800">
                                            Enhance quantifiable achievements
                                        </p>
                                        <p className="text-xs text-blue-600 mt-1">
                                            Add more metrics, percentages, and dollar amounts
                                        </p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                        <p className="text-sm font-medium text-green-800">
                                            Excellent Technology matching (92%)
                                        </p>
                                        <p className="text-xs text-green-600 mt-1">
                                            Maintain current tech keyword strategy
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResumePerformanceAnalytics;