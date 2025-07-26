import { useState, useEffect, useCallback, useRef } from 'react';
import resumeAPI from '../services/resumeAPI';

/**
 * Custom hook for resume management
 * 
 * Provides comprehensive resume state management including:
 * - Resume data state
 * - Auto-save functionality
 * - ATS analysis
 * - AI content enhancement
 * - Export functionality
 * - Error handling
 */
export const useResumeBuilder = (userId = 'demo-user', resumeId = null) => {
    // Resume data state
    const [resumeData, setResumeData] = useState({
        personalInfo: {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            linkedin: '',
            portfolio: ''
        },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        certifications: [],
        projects: []
    });

    // UI and operation states
    const [saveStatus, setSaveStatus] = useState('saved'); // saved, saving, unsaved, error
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState(null);
    const [lastSaved, setLastSaved] = useState(null);

    // Analysis results
    const [atsAnalysis, setATSAnalysis] = useState(null);
    const [keywordSuggestions, setKeywordSuggestions] = useState({});
    const [enhancementSuggestions, setEnhancementSuggestions] = useState({});

    // Auto-save management
    const saveTimeoutRef = useRef(null);
    const lastSaveDataRef = useRef(null);

    // Load existing resume on mount
    useEffect(() => {
        if (resumeId) {
            loadResume(resumeId);
        }
    }, [resumeId]);

    // Auto-save effect
    useEffect(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Check if data has actually changed
        const currentDataString = JSON.stringify(resumeData);
        if (lastSaveDataRef.current === currentDataString) {
            return;
        }

        setSaveStatus('unsaved');

        // Auto-save after 2 seconds of inactivity
        saveTimeoutRef.current = setTimeout(() => {
            if (resumeData.personalInfo.fullName || resumeData.summary) {
                handleAutoSave();
            }
        }, 2000);

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [resumeData]);

    // Auto-analysis effect
    useEffect(() => {
        if (resumeData.summary || resumeData.experience.length > 0) {
            const analysisTimeout = setTimeout(() => {
                performATSAnalysis();
            }, 3000);

            return () => clearTimeout(analysisTimeout);
        }
    }, [resumeData.summary, resumeData.experience]);

    // Resume CRUD operations
    const loadResume = async (id) => {
        try {
            setSaveStatus('loading');
            const result = await resumeAPI.getResume(id);

            if (result.success) {
                setResumeData(result.data.data);
                lastSaveDataRef.current = JSON.stringify(result.data.data);
                setSaveStatus('saved');
                setLastSaved(new Date(result.data.updated_at));
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            setError('Failed to load resume');
            setSaveStatus('error');
            console.error('Load resume error:', error);
        }
    };

    const handleAutoSave = async () => {
        try {
            setSaveStatus('saving');

            // Validate data before saving
            const validation = resumeAPI.validateResumeData(resumeData);
            if (!validation.isValid) {
                console.warn('Validation warnings:', validation.errors);
            }

            let result;
            if (resumeId) {
                result = await resumeAPI.updateResume(resumeId, resumeData);
            } else {
                result = await resumeAPI.createResume(resumeData, userId);
            }

            if (result.success) {
                setSaveStatus('saved');
                setLastSaved(new Date());
                lastSaveDataRef.current = JSON.stringify(resumeData);
                setError(null);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            setSaveStatus('error');
            setError('Auto-save failed');
            console.error('Auto-save error:', error);
        }
    };

    const saveResume = async () => {
        return await handleAutoSave();
    };

    // Data manipulation helpers
    const updateResumeData = useCallback((section, field, value, index = null) => {
        setResumeData(prev => {
            const updated = { ...prev };

            if (index !== null) {
                // Handle array fields (experience, education, etc.)
                if (!updated[section][index]) {
                    updated[section][index] = {};
                }
                updated[section][index] = { ...updated[section][index], [field]: value };
            } else if (typeof updated[section] === 'object' && !Array.isArray(updated[section])) {
                // Handle nested objects (personalInfo)
                updated[section] = { ...updated[section], [field]: value };
            } else {
                // Handle simple fields
                updated[section] = value;
            }

            return updated;
        });
    }, []);

    const addArrayItem = useCallback((section, defaultItem = {}) => {
        setResumeData(prev => ({
            ...prev,
            [section]: [...prev[section], defaultItem]
        }));
    }, []);

    const removeArrayItem = useCallback((section, index) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    }, []);

    const moveArrayItem = useCallback((section, fromIndex, toIndex) => {
        setResumeData(prev => {
            const items = [...prev[section]];
            const [movedItem] = items.splice(fromIndex, 1);
            items.splice(toIndex, 0, movedItem);
            return { ...prev, [section]: items };
        });
    }, []);

    // ATS Analysis
    const performATSAnalysis = async (jobDescription = null) => {
        try {
            setIsAnalyzing(true);
            const result = await resumeAPI.analyzeResume(resumeData, jobDescription);

            if (result.success) {
                setATSAnalysis(result.data);
            } else {
                console.error('ATS analysis failed:', result.error);
            }
        } catch (error) {
            console.error('ATS analysis error:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getKeywordSuggestions = async (section, content) => {
        try {
            const result = await resumeAPI.getKeywordSuggestions(section, content);

            if (result.success) {
                setKeywordSuggestions(prev => ({
                    ...prev,
                    [section]: result.data.suggestions
                }));
                return result.data.suggestions;
            }
        } catch (error) {
            console.error('Keyword suggestions error:', error);
            return [];
        }
    };

    // AI Content Enhancement
    const enhanceContent = async (section, content, context = {}) => {
        try {
            setIsEnhancing(true);
            const result = await resumeAPI.enhanceContent(section, content, context);

            if (result.success) {
                setEnhancementSuggestions(prev => ({
                    ...prev,
                    [section]: result.data
                }));
                return result.data;
            }
        } catch (error) {
            console.error('Content enhancement error:', error);
            return null;
        } finally {
            setIsEnhancing(false);
        }
    };

    const generateSummary = async (jobDescription = null) => {
        try {
            setIsEnhancing(true);
            const result = await resumeAPI.generateSummary(resumeData, jobDescription);

            if (result.success) {
                updateResumeData('summary', null, result.data.generated_summary);
                return result.data;
            }
        } catch (error) {
            console.error('Summary generation error:', error);
            return null;
        } finally {
            setIsEnhancing(false);
        }
    };

    // Export functionality
    const exportToPDF = async (templateId = null) => {
        try {
            setIsExporting(true);
            const result = await resumeAPI.exportToPDF(resumeData, templateId);

            if (result.success) {
                const filename = `${resumeData.personalInfo.fullName || 'Resume'}_${new Date().getTime()}.pdf`;
                resumeAPI.downloadFile(result.data, filename);
                return true;
            } else {
                setError('Failed to export PDF');
                return false;
            }
        } catch (error) {
            setError('Export failed');
            console.error('PDF export error:', error);
            return false;
        } finally {
            setIsExporting(false);
        }
    };

    const exportToWord = async (templateId = null) => {
        try {
            setIsExporting(true);
            const result = await resumeAPI.exportToWord(resumeData, templateId);

            if (result.success) {
                const filename = `${resumeData.personalInfo.fullName || 'Resume'}_${new Date().getTime()}.docx`;
                resumeAPI.downloadFile(result.data, filename);
                return true;
            } else {
                setError('Failed to export Word document');
                return false;
            }
        } catch (error) {
            setError('Export failed');
            console.error('Word export error:', error);
            return false;
        } finally {
            setIsExporting(false);
        }
    };

    // Utility functions
    const clearError = () => setError(null);

    const resetResume = () => {
        setResumeData({
            personalInfo: {
                fullName: '',
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                portfolio: ''
            },
            summary: '',
            experience: [],
            education: [],
            skills: [],
            certifications: [],
            projects: []
        });
        setATSAnalysis(null);
        setKeywordSuggestions({});
        setEnhancementSuggestions({});
        setSaveStatus('unsaved');
    };

    const getCompletionPercentage = () => {
        let completed = 0;
        let total = 0;

        // Personal info (required fields)
        if (resumeData.personalInfo.fullName) completed++;
        if (resumeData.personalInfo.email) completed++;
        total += 2;

        // Summary
        if (resumeData.summary && resumeData.summary.length > 50) completed++;
        total++;

        // Experience
        if (resumeData.experience.length > 0) completed++;
        total++;

        // Education
        if (resumeData.education.length > 0) completed++;
        total++;

        // Skills
        if (resumeData.skills.length > 0) completed++;
        total++;

        return Math.round((completed / total) * 100);
    };

    return {
        // Data
        resumeData,
        atsAnalysis,
        keywordSuggestions,
        enhancementSuggestions,

        // Status
        saveStatus,
        isAnalyzing,
        isEnhancing,
        isExporting,
        error,
        lastSaved,

        // Actions
        updateResumeData,
        addArrayItem,
        removeArrayItem,
        moveArrayItem,
        saveResume,
        loadResume,
        resetResume,

        // Analysis
        performATSAnalysis,
        getKeywordSuggestions,

        // AI Enhancement
        enhanceContent,
        generateSummary,

        // Export
        exportToPDF,
        exportToWord,

        // Utilities
        clearError,
        getCompletionPercentage
    };
};
