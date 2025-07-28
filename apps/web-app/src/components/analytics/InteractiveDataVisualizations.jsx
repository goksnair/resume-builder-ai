import React, { useState, useEffect, useRef } from 'react';
import { 
    BarChart3, 
    PieChart, 
    LineChart, 
    TrendingUp,
    Calendar,
    Filter,
    Download,
    Maximize2,
    Minimize2,
    Info,
    Target,
    Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Chart.js imports
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
    Filler
} from 'chart.js';
import { Bar, Line, Pie, Radar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
    Filler
);

/**
 * Interactive Data Visualizations Component
 * 
 * Provides interactive charts and data visualizations including:
 * - Dynamic charts using Chart.js
 * - Real-time performance metrics
 * - Comparative analysis dashboards
 * - Export capabilities for charts
 */
const InteractiveDataVisualizations = ({ data, filters }) => {
    const [selectedChart, setSelectedChart] = useState('performance-trends');
    const [expandedChart, setExpandedChart] = useState(null);
    const [chartSettings, setChartSettings] = useState({
        showDataLabels: true,
        showLegend: true,
        showGrid: true,
        animationEnabled: true
    });

    // Chart data processing
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        processChartData();
    }, [data, filters]);

    /**
     * Process raw data for chart visualization
     */
    const processChartData = () => {
        if (!data) return;

        // Performance Trends Line Chart
        const performanceTrends = {
            labels: data.trends.monthlyPerformance.map(item => item.month),
            datasets: [
                {
                    label: 'ATS Score',
                    data: data.trends.monthlyPerformance.map(item => item.atsScore),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgb(59, 130, 246)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                },
                {
                    label: 'Job Match Rate',
                    data: data.trends.monthlyPerformance.map(item => item.jobMatches),
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgb(34, 197, 94)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }
            ]
        };

        // ATS Compatibility Bar Chart
        const atsCompatibility = {
            labels: Object.keys(data.performance.atsCompatibility),
            datasets: [{
                label: 'ATS Compatibility Score',
                data: Object.values(data.performance.atsCompatibility),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(168, 85, 247, 0.8)'
                ],
                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(34, 197, 94)',
                    'rgb(251, 191, 36)',
                    'rgb(239, 68, 68)',
                    'rgb(168, 85, 247)'
                ],
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false
            }]
        };

        // Job Matching Pie Chart
        const jobMatching = {
            labels: Object.keys(data.performance.jobMatching),
            datasets: [{
                label: 'Job Match Distribution',
                data: Object.values(data.performance.jobMatching),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(34, 197, 94)',
                    'rgb(251, 191, 36)',
                    'rgb(239, 68, 68)'
                ],
                borderWidth: 2
            }]
        };

        // ROCKET Framework Radar
        const rocketRadar = {
            labels: ['Results', 'Optimization', 'Clarity', 'Knowledge', 'Efficiency', 'Targeting'],
            datasets: [{
                label: 'Your Score',
                data: [
                    data.career.rocketProgress.results * 100,
                    data.career.rocketProgress.optimization * 100,
                    data.career.rocketProgress.clarity * 100,
                    data.career.rocketProgress.knowledge * 100,
                    data.career.rocketProgress.efficiency * 100,
                    data.career.rocketProgress.targeting * 100
                ],
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: 'rgb(59, 130, 246)',
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(59, 130, 246)',
                borderWidth: 3,
                pointRadius: 6
            }, {
                label: 'Industry Average',
                data: [75, 68, 72, 70, 74, 69], // Mock industry averages
                backgroundColor: 'rgba(156, 163, 175, 0.1)',
                borderColor: 'rgb(156, 163, 175)',
                pointBackgroundColor: 'rgb(156, 163, 175)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(156, 163, 175)',
                borderWidth: 2,
                pointRadius: 4,
                borderDash: [5, 5]
            }]
        };

        // Skills Gap Doughnut
        const skillsGap = {
            labels: data.performance.skillsGap.map(skill => skill.skill),
            datasets: [{
                label: 'Current vs Target',
                data: data.performance.skillsGap.map(skill => skill.target - skill.current),
                backgroundColor: data.performance.skillsGap.map(skill => 
                    skill.priority === 'high' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(251, 191, 36, 0.8)'
                ),
                borderColor: data.performance.skillsGap.map(skill => 
                    skill.priority === 'high' ? 'rgb(239, 68, 68)' : 'rgb(251, 191, 36)'
                ),
                borderWidth: 2
            }]
        };

        setChartData({
            performanceTrends,
            atsCompatibility,
            jobMatching,
            rocketRadar,
            skillsGap
        });
    };

    /**
     * Chart configuration options
     */
    const getChartOptions = (type) => {
        const baseOptions = {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: chartSettings.animationEnabled ? 1000 : 0,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    display: chartSettings.showLegend,
                    position: 'top',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y || context.parsed}${type === 'percentage' ? '%' : ''}`;
                        }
                    }
                }
            }
        };

        switch (type) {
            case 'line':
                return {
                    ...baseOptions,
                    scales: {
                        x: {
                            display: chartSettings.showGrid,
                            grid: {
                                display: chartSettings.showGrid,
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        },
                        y: {
                            display: chartSettings.showGrid,
                            grid: {
                                display: chartSettings.showGrid,
                                color: 'rgba(0, 0, 0, 0.1)'
                            },
                            beginAtZero: true,
                            max: 100
                        }
                    },
                    elements: {
                        point: {
                            hoverRadius: 8
                        }
                    }
                };
            case 'bar':
                return {
                    ...baseOptions,
                    scales: {
                        x: {
                            display: chartSettings.showGrid,
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            display: chartSettings.showGrid,
                            grid: {
                                display: chartSettings.showGrid,
                                color: 'rgba(0, 0, 0, 0.1)'
                            },
                            beginAtZero: true,
                            max: 100
                        }
                    }
                };
            case 'radar':
                return {
                    ...baseOptions,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            },
                            angleLines: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            },
                            pointLabels: {
                                font: {
                                    size: 12,
                                    weight: '500'
                                }
                            }
                        }
                    }
                };
            default:
                return baseOptions;
        }
    };

    // Chart configurations
    const chartConfigs = [
        {
            id: 'performance-trends',
            title: 'Performance Trends',
            description: 'Monthly ATS scores and job matching trends',
            icon: LineChart,
            type: 'line',
            component: Line,
            data: chartData.performanceTrends,
            height: 300
        },
        {
            id: 'ats-compatibility',
            title: 'ATS System Compatibility',
            description: 'Compatibility scores across different ATS systems',
            icon: BarChart3,
            type: 'bar',
            component: Bar,
            data: chartData.atsCompatibility,
            height: 300
        },
        {
            id: 'job-matching',
            title: 'Job Match Distribution',
            description: 'Success rates across different industries',
            icon: PieChart,
            type: 'pie',
            component: Pie,
            data: chartData.jobMatching,
            height: 300
        },
        {
            id: 'rocket-analysis',
            title: 'ROCKET Framework Analysis',
            description: 'Comprehensive career assessment radar',
            icon: Target,
            type: 'radar',
            component: Radar,
            data: chartData.rocketRadar,
            height: 400
        },
        {
            id: 'skills-gap',
            title: 'Skills Gap Analysis',
            description: 'Priority areas for skill development',
            icon: Activity,
            type: 'doughnut',
            component: Doughnut,
            data: chartData.skillsGap,
            height: 300
        }
    ];

    /**
     * Export chart as image
     */
    const exportChart = (chartId) => {
        const canvas = document.querySelector(`#chart-${chartId} canvas`);
        if (canvas) {
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `${chartId}-chart.png`;
            link.href = url;
            link.click();
        }
    };

    return (
        <div className="space-y-6">
            {/* Chart Controls */}
            <motion.div 
                className="glass-card-v2 p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-premium-900">
                            Interactive Data Visualizations
                        </h3>
                        <p className="text-sm text-premium-600">
                            Explore your career analytics through dynamic charts and insights
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {/* Chart Settings */}
                        <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 text-sm text-premium-700">
                                <input
                                    type="checkbox"
                                    checked={chartSettings.showLegend}
                                    onChange={(e) => setChartSettings({
                                        ...chartSettings,
                                        showLegend: e.target.checked
                                    })}
                                    className="rounded border-gray-300"
                                />
                                Legend
                            </label>
                            <label className="flex items-center gap-2 text-sm text-premium-700">
                                <input
                                    type="checkbox"
                                    checked={chartSettings.showGrid}
                                    onChange={(e) => setChartSettings({
                                        ...chartSettings,
                                        showGrid: e.target.checked
                                    })}
                                    className="rounded border-gray-300"
                                />
                                Grid
                            </label>
                            <label className="flex items-center gap-2 text-sm text-premium-700">
                                <input
                                    type="checkbox"
                                    checked={chartSettings.animationEnabled}
                                    onChange={(e) => setChartSettings({
                                        ...chartSettings,
                                        animationEnabled: e.target.checked
                                    })}
                                    className="rounded border-gray-300"
                                />
                                Animation
                            </label>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Chart Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {chartConfigs.map((config, index) => {
                    const Icon = config.icon;
                    const ChartComponent = config.component;
                    const isExpanded = expandedChart === config.id;
                    
                    if (!config.data) return null;
                    
                    return (
                        <motion.div
                            key={config.id}
                            className={`glass-card-v2 p-4 ${isExpanded ? 'lg:col-span-2' : ''}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            layout
                        >
                            {/* Chart Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Icon className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <h4 className="font-semibold text-premium-900">
                                            {config.title}
                                        </h4>
                                        <p className="text-xs text-premium-600">
                                            {config.description}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => exportChart(config.id)}
                                        className="p-2 text-premium-600 hover:text-premium-800 hover:bg-white/10 rounded-lg transition-colors"
                                        title="Export Chart"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setExpandedChart(
                                            isExpanded ? null : config.id
                                        )}
                                        className="p-2 text-premium-600 hover:text-premium-800 hover:bg-white/10 rounded-lg transition-colors"
                                        title={isExpanded ? "Minimize" : "Expand"}
                                    >
                                        {isExpanded ? (
                                            <Minimize2 className="w-4 h-4" />
                                        ) : (
                                            <Maximize2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Chart Container */}
                            <div 
                                id={`chart-${config.id}`}
                                className="relative"
                                style={{ 
                                    height: isExpanded ? config.height + 100 : config.height 
                                }}
                            >
                                <ChartComponent
                                    data={config.data}
                                    options={getChartOptions(config.type)}
                                />
                            </div>

                            {/* Chart Insights */}
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-4 pt-4 border-t border-white/20"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Info className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm font-medium text-blue-800">
                                                    Key Insight
                                                </span>
                                            </div>
                                            <p className="text-xs text-blue-700">
                                                {getChartInsight(config.id)}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-green-50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <TrendingUp className="w-4 h-4 text-green-600" />
                                                <span className="text-sm font-medium text-green-800">
                                                    Trend
                                                </span>
                                            </div>
                                            <p className="text-xs text-green-700">
                                                {getChartTrend(config.id)}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-yellow-50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Target className="w-4 h-4 text-yellow-600" />
                                                <span className="text-sm font-medium text-yellow-800">
                                                    Action
                                                </span>
                                            </div>
                                            <p className="text-xs text-yellow-700">
                                                {getChartAction(config.id)}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Performance Summary */}
            <motion.div 
                className="glass-card-v2 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <h3 className="text-lg font-semibold text-premium-900 mb-4">
                    Data Summary & Recommendations
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {getSummaryMetrics().map((metric, index) => (
                        <div key={index} className="p-4 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <metric.icon className={`w-4 h-4 ${metric.color}`} />
                                <span className="text-sm font-medium text-premium-900">
                                    {metric.label}
                                </span>
                            </div>
                            <div className="text-xl font-bold text-premium-900 mb-1">
                                {metric.value}
                            </div>
                            <div className="text-xs text-premium-600">
                                {metric.description}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );

    /**
     * Helper functions for chart insights
     */
    function getChartInsight(chartId) {
        const insights = {
            'performance-trends': 'Your ATS scores have improved by 12% over the last quarter',
            'ats-compatibility': 'Greenhouse shows your highest compatibility at 92%',
            'job-matching': 'Technology sector offers the best match at 92%',
            'rocket-analysis': 'Clarity is your strongest ROCKET dimension at 89%',
            'skills-gap': 'Machine Learning shows the largest gap requiring attention'
        };
        return insights[chartId] || 'Data analysis in progress...';
    }

    function getChartTrend(chartId) {
        const trends = {
            'performance-trends': 'Steady upward trajectory with consistent growth',
            'ats-compatibility': 'Above-average performance across most systems',
            'job-matching': 'Strong alignment with tech and finance sectors',
            'rocket-analysis': 'Balanced profile with room for optimization growth',
            'skills-gap': 'High-priority skills identified for immediate focus'
        };
        return trends[chartId] || 'Trend analysis in progress...';
    }

    function getChartAction(chartId) {
        const actions = {
            'performance-trends': 'Continue current optimization strategies',
            'ats-compatibility': 'Improve Taleo compatibility with formatting changes',
            'job-matching': 'Explore healthcare sector opportunities',
            'rocket-analysis': 'Focus on optimization and efficiency improvements',
            'skills-gap': 'Prioritize ML certification within 3 months'
        };
        return actions[chartId] || 'Action plan being generated...';
    }

    function getSummaryMetrics() {
        return [
            {
                icon: TrendingUp,
                color: 'text-green-600',
                label: 'Growth Rate',
                value: '+15.8%',
                description: 'Overall improvement trend'
            },
            {
                icon: Target,
                color: 'text-blue-600',
                label: 'ATS Average',
                value: '87.4%',
                description: 'Across all systems'
            },
            {
                icon: Activity,
                color: 'text-purple-600',
                label: 'ROCKET Score',
                value: '81.2%',
                description: 'Overall framework rating'
            },
            {
                icon: Calendar,
                color: 'text-orange-600',
                label: 'Time to Goal',
                value: '3-4 mo',
                description: 'Estimated optimization timeline'
            }
        ];
    }
};

export default InteractiveDataVisualizations;