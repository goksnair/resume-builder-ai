import React, { useState, useEffect } from 'react';
import { 
    BarChart3, 
    TrendingUp, 
    Target, 
    Users, 
    Calendar, 
    Download, 
    Filter,
    Settings,
    RefreshCw,
    ChevronDown,
    Eye,
    PieChart,
    LineChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Analytics Components
import ResumePerformanceAnalytics from './ResumePerformanceAnalytics';
import CareerProgressTracking from './CareerProgressTracking';
import InteractiveDataVisualizations from './InteractiveDataVisualizations';
import DashboardCustomization from './DashboardCustomization';
import ExportManager from '../export/ExportManager';

// Services
import { analyticsAPI } from '../../services/analyticsAPI';

/**
 * Advanced Analytics Dashboard - Enhanced UI v2.0
 * 
 * Provides comprehensive insights and analytics for resume performance
 * Built with glass morphism design system and mobile responsiveness
 */
const AdvancedAnalyticsDashboard = ({ userId = 'demo_user_001' }) => {
    // Main dashboard state
    const [activeTab, setActiveTab] = useState('performance');
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [timeRange, setTimeRange] = useState('30d');
    const [refreshing, setRefreshing] = useState(false);
    
    // Customization state
    const [dashboardLayout, setDashboardLayout] = useState('default');
    const [showFilters, setShowFilters] = useState(false);
    const [exportModalOpen, setExportModalOpen] = useState(false);
    
    // Filter state
    const [filters, setFilters] = useState({
        dateRange: '30d',
        resumeType: 'all',
        jobCategory: 'all',
        atsSystem: 'all'
    });

    // Load dashboard data on mount
    useEffect(() => {
        loadDashboardData();
    }, [timeRange, filters]);

    /**
     * Load comprehensive analytics data
     */
    const loadDashboardData = async () => {
        setIsLoading(true);
        try {
            const data = await analyticsAPI.getDashboardData(userId, {
                timeRange,
                filters
            });
            setDashboardData(data);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            // Load mock data for demo
            setDashboardData(generateMockDashboardData());
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Refresh dashboard data
     */
    const refreshDashboard = async () => {
        setRefreshing(true);
        await loadDashboardData();
        setRefreshing(false);
    };

    /**
     * Generate mock dashboard data for demonstration
     */
    const generateMockDashboardData = () => ({
        overview: {
            totalResumes: 12,
            averageAtsScore: 87.4,
            jobMatchRate: 73.2,
            improvementTrend: 15.8
        },
        performance: {
            atsCompatibility: {
                workday: 89,
                greenhouse: 92,
                lever: 85,
                jobvite: 78,
                taleo: 82
            },
            jobMatching: {
                technology: 92,
                finance: 67,
                healthcare: 45,
                marketing: 78
            },
            skillsGap: [
                { skill: 'Machine Learning', current: 65, target: 85, priority: 'high' },
                { skill: 'Cloud Architecture', current: 78, target: 90, priority: 'medium' },
                { skill: 'Leadership', current: 82, target: 95, priority: 'medium' }
            ]
        },
        career: {
            rocketProgress: {
                results: 0.85,
                optimization: 0.72,
                clarity: 0.89,
                knowledge: 0.76,
                efficiency: 0.83,
                targeting: 0.79
            },
            milestones: [
                { name: 'Resume Optimization', progress: 85, target: 90 },
                { name: 'Skill Development', progress: 72, target: 85 },
                { name: 'Career Targeting', progress: 79, target: 90 }
            ],
            industryBenchmarks: {
                resumeQuality: { you: 87, industry: 75 },
                skillRelevance: { you: 92, industry: 78 },
                careerProgression: { you: 76, industry: 68 }
            }
        },
        trends: {
            monthlyPerformance: Array.from({ length: 12 }, (_, i) => ({
                month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
                atsScore: 75 + Math.random() * 20,
                jobMatches: 60 + Math.random() * 25,
                applications: Math.floor(Math.random() * 20) + 5
            }))
        }
    });

    // Navigation tabs configuration
    const navigationTabs = [
        {
            id: 'performance',
            label: 'Resume Performance',
            icon: BarChart3,
            description: 'ATS scores and job matching analytics'
        },
        {
            id: 'career',
            label: 'Career Progress',
            icon: TrendingUp,
            description: 'ROCKET Framework and development tracking'
        },
        {
            id: 'visualizations',
            label: 'Data Insights',
            icon: PieChart,
            description: 'Interactive charts and trend analysis'
        },
        {
            id: 'customization',
            label: 'Dashboard',
            icon: Settings,
            description: 'Layout and display preferences'
        }
    ];

    if (isLoading && !dashboardData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-premium-50 to-premium-100 flex items-center justify-center">
                <div className="glass-card-v2 p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-premium-700">Loading analytics dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-premium-50 to-premium-100">
            {/* Dashboard Header */}
            <div className="glass-nav-v2 sticky top-0 z-40 border-b border-white/20">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-premium-900 flex items-center gap-3">
                                <BarChart3 className="w-6 h-6 text-blue-600" />
                                Advanced Analytics Dashboard
                            </h1>
                            <p className="text-premium-600 mt-1">
                                Comprehensive resume performance and career insights
                            </p>
                        </div>
                        
                        {/* Header Actions */}
                        <div className="flex items-center gap-3">
                            {/* Time Range Selector */}
                            <div className="relative">
                                <select
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    className="glass-card-v2 px-4 py-2 text-sm font-medium text-premium-700 
                                             border-0 focus:ring-2 focus:ring-blue-500 rounded-lg
                                             appearance-none bg-white/10 backdrop-blur-sm"
                                >
                                    <option value="7d">Last 7 days</option>
                                    <option value="30d">Last 30 days</option>
                                    <option value="90d">Last 3 months</option>
                                    <option value="1y">Last year</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-premium-500 pointer-events-none" />
                            </div>

                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`btn-glass flex items-center gap-2 ${showFilters ? 'bg-blue-500/20' : ''}`}
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                            </button>

                            {/* Refresh Button */}
                            <button
                                onClick={refreshDashboard}
                                disabled={refreshing}
                                className="btn-glass flex items-center gap-2"
                            >
                                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>

                            {/* Export Button */}
                            <button
                                onClick={() => setExportModalOpen(true)}
                                className="btn-premium flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                        </div>
                    </div>

                    {/* Expandable Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-white/20"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-premium-700 mb-2">
                                            Resume Type
                                        </label>
                                        <select
                                            value={filters.resumeType}
                                            onChange={(e) => setFilters({...filters, resumeType: e.target.value})}
                                            className="glass-card-v2 w-full px-3 py-2 text-sm border-0 rounded-lg"
                                        >
                                            <option value="all">All Types</option>
                                            <option value="technical">Technical</option>
                                            <option value="creative">Creative</option>
                                            <option value="executive">Executive</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-premium-700 mb-2">
                                            Job Category
                                        </label>
                                        <select
                                            value={filters.jobCategory}
                                            onChange={(e) => setFilters({...filters, jobCategory: e.target.value})}
                                            className="glass-card-v2 w-full px-3 py-2 text-sm border-0 rounded-lg"
                                        >
                                            <option value="all">All Categories</option>
                                            <option value="technology">Technology</option>
                                            <option value="finance">Finance</option>
                                            <option value="healthcare">Healthcare</option>
                                            <option value="marketing">Marketing</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-premium-700 mb-2">
                                            ATS System
                                        </label>
                                        <select
                                            value={filters.atsSystem}
                                            onChange={(e) => setFilters({...filters, atsSystem: e.target.value})}
                                            className="glass-card-v2 w-full px-3 py-2 text-sm border-0 rounded-lg"
                                        >
                                            <option value="all">All Systems</option>
                                            <option value="workday">Workday</option>
                                            <option value="greenhouse">Greenhouse</option>
                                            <option value="lever">Lever</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            onClick={() => setFilters({
                                                dateRange: '30d',
                                                resumeType: 'all',
                                                jobCategory: 'all',
                                                atsSystem: 'all'
                                            })}
                                            className="btn-glass w-full"
                                        >
                                            Reset Filters
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Dashboard Overview Cards */}
            {dashboardData && (
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <motion.div 
                            className="glass-card-v2 p-6"
                            whileHover={{ y: -2 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-premium-600 text-sm font-medium">Total Resumes</p>
                                    <p className="text-2xl font-bold text-premium-900">
                                        {dashboardData.overview.totalResumes}
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-500/10 rounded-lg">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="glass-card-v2 p-6"
                            whileHover={{ y: -2 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-premium-600 text-sm font-medium">Avg ATS Score</p>
                                    <p className="text-2xl font-bold text-premium-900">
                                        {dashboardData.overview.averageAtsScore}%
                                    </p>
                                </div>
                                <div className="p-3 bg-green-500/10 rounded-lg">
                                    <Target className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="glass-card-v2 p-6"
                            whileHover={{ y: -2 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-premium-600 text-sm font-medium">Job Match Rate</p>
                                    <p className="text-2xl font-bold text-premium-900">
                                        {dashboardData.overview.jobMatchRate}%
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-500/10 rounded-lg">
                                    <Eye className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="glass-card-v2 p-6"
                            whileHover={{ y: -2 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-premium-600 text-sm font-medium">Improvement</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        +{dashboardData.overview.improvementTrend}%
                                    </p>
                                </div>
                                <div className="p-3 bg-orange-500/10 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="glass-card-v2 p-1 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                            {navigationTabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`p-4 rounded-lg transition-all duration-300 text-left ${
                                            isActive 
                                                ? 'bg-white/20 backdrop-blur-sm shadow-lg' 
                                                : 'hover:bg-white/10'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Icon className={`w-5 h-5 ${
                                                isActive ? 'text-blue-600' : 'text-premium-600'
                                            }`} />
                                            <span className={`font-medium ${
                                                isActive ? 'text-premium-900' : 'text-premium-700'
                                            }`}>
                                                {tab.label}
                                            </span>
                                        </div>
                                        <p className="text-sm text-premium-600">
                                            {tab.description}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[600px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {activeTab === 'performance' && (
                                    <ResumePerformanceAnalytics 
                                        data={dashboardData.performance}
                                        filters={filters}
                                        timeRange={timeRange}
                                    />
                                )}
                                
                                {activeTab === 'career' && (
                                    <CareerProgressTracking 
                                        data={dashboardData.career}
                                        userId={userId}
                                    />
                                )}
                                
                                {activeTab === 'visualizations' && (
                                    <InteractiveDataVisualizations 
                                        data={dashboardData}
                                        filters={filters}
                                    />
                                )}
                                
                                {activeTab === 'customization' && (
                                    <DashboardCustomization 
                                        isOpen={true}
                                        onClose={() => setActiveTab('performance')}
                                        currentConfig={dashboardLayout}
                                        onSave={(config) => {
                                            setDashboardLayout(config);
                                            setActiveTab('performance');
                                        }}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Export Manager Modal */}
            <ExportManager 
                isOpen={exportModalOpen}
                onClose={() => setExportModalOpen(false)}
                resumeData={dashboardData}
            />
        </div>
    );
};

export default AdvancedAnalyticsDashboard;