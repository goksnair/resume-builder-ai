/**
 * Resume API Service
 * 
 * Handles all resume-related API calls including:
 * - Resume CRUD operations
 * - ATS compatibility analysis
 * - AI-powered content suggestions
 * - Template management
 * - Export functionality
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ResumeAPIService {
    constructor() {
        this.baseURL = `${API_BASE_URL}/api/v1`;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
    }

    // Helper method for API calls
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.defaultHeaders,
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // Resume CRUD Operations
    async createResume(resumeData, userId) {
        try {
            const response = await this.makeRequest('/resumes', {
                method: 'POST',
                body: JSON.stringify({
                    user_id: userId,
                    data: resumeData,
                    created_at: new Date().toISOString()
                })
            });
            return { success: true, data: response };
        } catch (error) {
            console.error('Failed to create resume:', error);
            return { success: false, error: error.message };
        }
    }

    async getResume(resumeId) {
        try {
            const response = await this.makeRequest(`/resumes/${resumeId}`);
            return { success: true, data: response };
        } catch (error) {
            console.error('Failed to get resume:', error);
            return { success: false, error: error.message };
        }
    }

    async updateResume(resumeId, resumeData) {
        try {
            const response = await this.makeRequest(`/resumes/${resumeId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    data: resumeData,
                    updated_at: new Date().toISOString()
                })
            });
            return { success: true, data: response };
        } catch (error) {
            console.error('Failed to update resume:', error);
            return { success: false, error: error.message };
        }
    }

    async deleteResume(resumeId) {
        try {
            await this.makeRequest(`/resumes/${resumeId}`, {
                method: 'DELETE'
            });
            return { success: true };
        } catch (error) {
            console.error('Failed to delete resume:', error);
            return { success: false, error: error.message };
        }
    }

    async getUserResumes(userId) {
        try {
            const response = await this.makeRequest(`/users/${userId}/resumes`);
            return { success: true, data: response };
        } catch (error) {
            console.error('Failed to get user resumes:', error);
            return { success: false, error: error.message };
        }
    }

    // ATS Analysis
    async analyzeResume(resumeData, jobDescription = null) {
        try {
            const response = await this.makeRequest('/analysis/ats', {
                method: 'POST',
                body: JSON.stringify({
                    resume_data: resumeData,
                    job_description: jobDescription,
                    analysis_type: 'comprehensive'
                })
            });
            return { success: true, data: response };
        } catch (error) {
            console.error('Failed to analyze resume:', error);
            // Return mock data for development
            return this.getMockATSAnalysis();
        }
    }

    async getKeywordSuggestions(section, content, jobDescription = null) {
        try {
            const response = await this.makeRequest('/analysis/keywords', {
                method: 'POST',
                body: JSON.stringify({
                    section,
                    content,
                    job_description: jobDescription
                })
            });
            return { success: true, data: response };
        } catch (error) {
            console.error('Failed to get keyword suggestions:', error);
            return this.getMockKeywordSuggestions(section);
        }
    }

    // AI Content Enhancement
    async enhanceContent(section, content, context = {}) {
        try {
            const response = await this.makeRequest('/ai/enhance', {
                method: 'POST',
                body: JSON.stringify({
                    section,
                    content,
                    context,
                    enhancement_type: 'professional'
                })
            });
            return { success: true, data: response };
        } catch (error) {
            console.error('Failed to enhance content:', error);
            return this.getMockContentEnhancement(section, content);
        }
    }

    async generateSummary(resumeData, jobDescription = null) {
        try {
            const response = await this.makeRequest('/ai/generate-summary', {
                method: 'POST',
                body: JSON.stringify({
                    resume_data: resumeData,
                    job_description: jobDescription,
                    tone: 'professional'
                })
            });
            return { success: true, data: response };
        } catch (error) {
            console.error('Failed to generate summary:', error);
            return this.getMockSummaryGeneration();
        }
    }

    // Template Management
    async getTemplates(category = null) {
        try {
            const endpoint = category ? `/templates?category=${category}` : '/templates';
            const response = await this.makeRequest(endpoint);
            return { success: true, data: response };
        } catch (error) {
            console.error('Failed to get templates:', error);
            return this.getMockTemplates();
        }
    }

    async applyTemplate(resumeData, templateId) {
        try {
            const response = await this.makeRequest('/templates/apply', {
                method: 'POST',
                body: JSON.stringify({
                    resume_data: resumeData,
                    template_id: templateId
                })
            });
            return { success: true, data: response };
        } catch (error) {
            console.error('Failed to apply template:', error);
            return { success: false, error: error.message };
        }
    }

    // Export Functions
    async exportToPDF(resumeData, templateId = null) {
        try {
            const response = await fetch(`${this.baseURL}/export/pdf`, {
                method: 'POST',
                headers: this.defaultHeaders,
                body: JSON.stringify({
                    resume_data: resumeData,
                    template_id: templateId,
                    format: 'pdf'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to export PDF');
            }

            const blob = await response.blob();
            return { success: true, data: blob };
        } catch (error) {
            console.error('Failed to export PDF:', error);
            return { success: false, error: error.message };
        }
    }

    async exportToWord(resumeData, templateId = null) {
        try {
            const response = await fetch(`${this.baseURL}/export/docx`, {
                method: 'POST',
                headers: this.defaultHeaders,
                body: JSON.stringify({
                    resume_data: resumeData,
                    template_id: templateId,
                    format: 'docx'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to export Word document');
            }

            const blob = await response.blob();
            return { success: true, data: blob };
        } catch (error) {
            console.error('Failed to export Word:', error);
            return { success: false, error: error.message };
        }
    }

    // Mock Data Methods (for development without backend)
    getMockATSAnalysis() {
        return {
            success: true,
            data: {
                overall_score: Math.floor(Math.random() * 20) + 75, // 75-95
                breakdown: {
                    keywords: Math.floor(Math.random() * 15) + 80,
                    formatting: Math.floor(Math.random() * 10) + 85,
                    structure: Math.floor(Math.random() * 12) + 82,
                    length: Math.floor(Math.random() * 8) + 87
                },
                suggestions: [
                    "Add more industry-specific keywords related to your target role",
                    "Use bullet points for better readability and ATS parsing",
                    "Include quantifiable achievements with specific metrics",
                    "Ensure consistent formatting throughout the document",
                    "Add relevant skills mentioned in the job description"
                ],
                missing_keywords: [
                    "project management",
                    "data analysis",
                    "team leadership",
                    "stakeholder communication"
                ],
                strength_areas: [
                    "Technical skills well documented",
                    "Clear career progression shown",
                    "Good use of action verbs"
                ]
            }
        };
    }

    getMockKeywordSuggestions(section) {
        const suggestions = {
            summary: [
                "results-driven", "strategic thinking", "cross-functional collaboration",
                "process improvement", "stakeholder management"
            ],
            experience: [
                "spearheaded", "implemented", "optimized", "collaborated",
                "achieved", "delivered", "managed", "developed"
            ],
            skills: [
                "JavaScript", "React", "Node.js", "Python", "SQL",
                "Project Management", "Agile", "Git", "AWS"
            ]
        };

        return {
            success: true,
            data: {
                suggestions: suggestions[section] || [],
                priority_keywords: suggestions[section]?.slice(0, 3) || []
            }
        };
    }

    getMockContentEnhancement(section, content) {
        const enhancements = {
            summary: `Enhanced professional summary that highlights key achievements and career progression with quantifiable results and industry-specific terminology.`,
            experience: `• Spearheaded cross-functional initiatives that resulted in 25% improvement in operational efficiency
• Implemented data-driven strategies leading to $500K revenue increase year-over-year
• Collaborated with stakeholders to deliver high-impact projects ahead of schedule`
        };

        return {
            success: true,
            data: {
                enhanced_content: enhancements[section] || `Enhanced ${section} content with professional tone and industry best practices.`,
                improvements: [
                    "Added quantifiable metrics",
                    "Improved professional tone",
                    "Enhanced keyword density",
                    "Better action verb usage"
                ]
            }
        };
    }

    getMockSummaryGeneration() {
        return {
            success: true,
            data: {
                generated_summary: "Results-driven professional with 5+ years of experience in software development and project management. Proven track record of delivering high-impact solutions that drive business growth and operational efficiency. Expertise in full-stack development, team leadership, and stakeholder collaboration with a passion for innovative technology solutions.",
                tone: "professional",
                keywords_included: ["results-driven", "proven track record", "high-impact", "expertise"]
            }
        };
    }

    getMockTemplates() {
        return {
            success: true,
            data: [
                {
                    id: 'modern-tech',
                    name: 'Modern Tech Professional',
                    category: 'Technology',
                    preview_url: '/templates/previews/modern-tech.jpg',
                    ats_optimized: true
                },
                {
                    id: 'executive-classic',
                    name: 'Executive Classic',
                    category: 'Executive',
                    preview_url: '/templates/previews/executive-classic.jpg',
                    ats_optimized: true
                },
                {
                    id: 'creative-portfolio',
                    name: 'Creative Portfolio',
                    category: 'Creative',
                    preview_url: '/templates/previews/creative-portfolio.jpg',
                    ats_optimized: false
                }
            ]
        };
    }

    // Utility Methods
    downloadFile(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    validateResumeData(resumeData) {
        const required = ['personalInfo'];
        const errors = [];

        for (const field of required) {
            if (!resumeData[field]) {
                errors.push(`${field} is required`);
            }
        }

        if (resumeData.personalInfo && !resumeData.personalInfo.fullName) {
            errors.push('Full name is required');
        }

        if (resumeData.personalInfo && !resumeData.personalInfo.email) {
            errors.push('Email is required');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

// Create and export a singleton instance
const resumeAPI = new ResumeAPIService();
export default resumeAPI;
