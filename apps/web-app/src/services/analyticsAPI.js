/**
 * Analytics API Service
 * Handles all analytics-related API calls and data processing
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://resume-builder-ai-production.up.railway.app';

class AnalyticsAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async fetchDashboardData() {
    try {
      // For now, return mock data until backend analytics are implemented
      return {
        resumePerformance: {
          atsScore: 92,
          compatibilityRate: 87,
          improvementSuggestions: 12,
          lastUpdated: new Date().toISOString()
        },
        careerProgress: {
          rocketScore: 85,
          completedAssessments: 3,
          skillsIdentified: 15,
          careerGoalsSet: 5
        },
        analytics: {
          viewsThisMonth: 1250,
          applicationsSubmitted: 23,
          interviewsScheduled: 8,
          successRate: 34.8
        },
        trends: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [65, 72, 68, 78, 85, 92]
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  async fetchResumeAnalytics(resumeId) {
    try {
      // Mock analytics data for resume performance
      return {
        atsCompatibility: {
          overall: 92,
          bySystem: {
            'Workday': 95,
            'Greenhouse': 89,
            'Lever': 93,
            'BambooHR': 91,
            'iCIMS': 88
          }
        },
        keywordMatching: {
          matched: 45,
          total: 52,
          percentage: 86.5,
          missing: ['Python', 'AWS', 'Kubernetes', 'GraphQL']
        },
        readabilityScore: 94,
        sectionScores: {
          'Professional Summary': 92,
          'Work Experience': 88,
          'Skills': 95,
          'Education': 85
        }
      };
    } catch (error) {
      console.error('Error fetching resume analytics:', error);
      throw error;
    }
  }

  async fetchCareerProgressData() {
    try {
      return {
        rocketFramework: {
          results: { score: 85, status: 'excellent' },
          optimization: { score: 72, status: 'good' },
          clarity: { score: 90, status: 'excellent' },
          knowledge: { score: 78, status: 'good' },
          efficiency: { score: 82, status: 'very good' },
          targeting: { score: 88, status: 'excellent' }
        },
        milestones: [
          { name: 'Profile Setup', completed: true, date: '2024-01-15' },
          { name: 'First Resume Analysis', completed: true, date: '2024-01-20' },
          { name: 'ROCKET Assessment', completed: true, date: '2024-02-01' },
          { name: 'Career Goals Setting', completed: false, date: null },
          { name: 'Industry Research', completed: false, date: null }
        ],
        skillsDevelopment: {
          technical: ['React', 'Node.js', 'Python', 'AWS'],
          soft: ['Leadership', 'Communication', 'Problem Solving'],
          industry: ['FinTech', 'Healthcare', 'E-commerce']
        }
      };
    } catch (error) {
      console.error('Error fetching career progress:', error);
      throw error;
    }
  }

  async fetchInteractiveChartData(chartType, timeRange = '6m') {
    try {
      const baseData = {
        '1m': { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], points: 4 },
        '3m': { labels: ['Jan', 'Feb', 'Mar'], points: 3 },
        '6m': { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], points: 6 },
        '1y': { labels: ['Q1', 'Q2', 'Q3', 'Q4'], points: 4 }
      };

      const range = baseData[timeRange] || baseData['6m'];

      switch (chartType) {
        case 'ats-performance':
          return {
            labels: range.labels,
            datasets: [{
              label: 'ATS Compatibility Score',
              data: this.generateTrendData(range.points, 75, 95),
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.3
            }]
          };

        case 'application-success':
          return {
            labels: range.labels,
            datasets: [{
              label: 'Success Rate (%)',
              data: this.generateTrendData(range.points, 25, 45),
              borderColor: 'rgb(16, 185, 129)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.3
            }]
          };

        case 'skill-development':
          return {
            labels: ['Technical', 'Leadership', 'Communication', 'Industry Knowledge', 'Problem Solving'],
            datasets: [{
              label: 'Skill Level',
              data: [85, 72, 88, 75, 90],
              backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(139, 92, 246, 0.8)'
              ]
            }]
          };

        default:
          return { labels: [], datasets: [] };
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      throw error;
    }
  }

  generateTrendData(points, min, max) {
    const data = [];
    let current = min + Math.random() * (max - min);
    
    for (let i = 0; i < points; i++) {
      // Add some realistic trend with small variations
      const change = (Math.random() - 0.5) * 10;
      current = Math.max(min, Math.min(max, current + change));
      data.push(Math.round(current));
    }
    
    return data;
  }

  async exportDashboardData(format = 'json', filters = {}) {
    try {
      const dashboardData = await this.fetchDashboardData();
      const resumeAnalytics = await this.fetchResumeAnalytics();
      const careerProgress = await this.fetchCareerProgressData();

      const exportData = {
        timestamp: new Date().toISOString(),
        filters,
        data: {
          dashboard: dashboardData,
          resume: resumeAnalytics,
          career: careerProgress
        }
      };

      if (format === 'csv') {
        return this.convertToCSV(exportData);
      }

      return exportData;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  convertToCSV(data) {
    // Simple CSV conversion for demo
    const headers = ['Metric', 'Value', 'Category'];
    const rows = [
      ['ATS Score', data.data.dashboard.resumePerformance.atsScore, 'Resume'],
      ['Compatibility Rate', data.data.dashboard.resumePerformance.compatibilityRate, 'Resume'],
      ['ROCKET Score', data.data.dashboard.careerProgress.rocketScore, 'Career'],
      ['Applications', data.data.dashboard.analytics.applicationsSubmitted, 'Analytics'],
      ['Success Rate', data.data.dashboard.analytics.successRate, 'Analytics']
    ];

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    return csvContent;
  }
}

export const analyticsAPI = new AnalyticsAPI();
export default analyticsAPI;