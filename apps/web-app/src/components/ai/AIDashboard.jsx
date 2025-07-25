import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResumeUpload from './ResumeUpload';
import JobDescriptionInput from './JobDescriptionInput';
import ResumeAnalysis from './ResumeAnalysis';
import ResumeBuilderIntegrated from '../resume/ResumeBuilderIntegrated';
import ConversationalResumeBuilder from '../conversation/ConversationalResumeBuilder';
import { resumeService, jobService } from '@/services/resume';
import { FileText, Briefcase, BarChart3, AlertCircle, Palette, Check, Brain, Zap } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const AIDashboard = () => {
    const [resumes, setResumes] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [selectedResume, setSelectedResume] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [appliedTemplate, setAppliedTemplate] = useState(null);
    const [showTemplateNotification, setShowTemplateNotification] = useState(false);
    const [generatedResume, setGeneratedResume] = useState(null);
    const [activeTab, setActiveTab] = useState('upload');
    const location = useLocation();

    useEffect(() => {
        loadResumes();
        loadJobs();
        checkAppliedTemplate();

        // Check for tab parameter in URL
        const urlParams = new URLSearchParams(location.search);
        const tabParam = urlParams.get('tab');
        if (tabParam && ['upload', 'conversation', 'builder', 'analysis', 'history'].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [location]);

    const checkAppliedTemplate = () => {
        // Check if we came from template explorer with an applied template
        if (location.state?.templateApplied) {
            setAppliedTemplate(location.state.templateConfig);
            setShowTemplateNotification(true);
            setSuccess(`Template "${location.state.templateConfig.templateData.name}" with "${location.state.templateConfig.colorData.name}" colors applied successfully!`);

            // Hide notification after 5 seconds
            setTimeout(() => {
                setShowTemplateNotification(false);
            }, 5000);
        }

        // Check localStorage for applied template
        const storedTemplate = localStorage.getItem('appliedTemplate');
        if (storedTemplate) {
            try {
                const templateConfig = JSON.parse(storedTemplate);
                setAppliedTemplate(templateConfig);

                // Only show notification if it's recent (within 1 minute)
                const appliedAt = new Date(templateConfig.appliedAt);
                const now = new Date();
                const timeDiff = (now - appliedAt) / 1000 / 60; // minutes

                if (timeDiff < 1) {
                    setShowTemplateNotification(true);
                    setSuccess(`Template "${templateConfig.templateData.name}" is now active!`);

                    setTimeout(() => {
                        setShowTemplateNotification(false);
                    }, 5000);
                }
            } catch (error) {
                console.error('Failed to parse applied template:', error);
            }
        }
    };

    const loadResumes = async () => {
        try {
            const response = await resumeService.listResumes();
            setResumes(response.resumes || []);
        } catch (error) {
            console.error('Failed to load resumes:', error);
        }
    };

    const loadJobs = async () => {
        try {
            const response = await jobService.listJobs();
            setJobs(response.jobs || []);
        } catch (error) {
            console.error('Failed to load jobs:', error);
        }
    };

    const handleResumeUpload = async (response) => {
        setSuccess('Resume uploaded successfully!');
        setError('');
        await loadResumes();

        // Auto-select the uploaded resume
        if (response.resume_id) {
            setSelectedResume(response.resume_id);
        }
    };

    const handleJobSubmit = async (response) => {
        setSuccess('Job description processed successfully!');
        setError('');
        await loadJobs();

        // Auto-select the submitted job
        if (response.job_id) {
            setSelectedJob(response.job_id);
        }
    };

    const handleError = (errorMessage) => {
        setError(errorMessage);
        setSuccess('');
    };

    const analyzeResume = async () => {
        if (!selectedResume || !selectedJob) {
            setError('Please select both a resume and job description to analyze.');
            return;
        }

        setIsAnalyzing(true);
        setError('');
        try {
            const response = await resumeService.analyzeResume(selectedResume, selectedJob);
            setAnalysis(response);
            setSuccess('Analysis completed successfully!');
        } catch (error) {
            console.error('Analysis failed:', error);
            setError('Analysis failed. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getImprovements = async () => {
        if (!selectedResume || !selectedJob) {
            setError('Please select both a resume and job description to get improvements.');
            return;
        }

        setIsAnalyzing(true);
        setError('');
        try {
            const response = await resumeService.getResumeImprovement(selectedResume, selectedJob);
            setAnalysis(response);
            setSuccess('Improvement suggestions generated successfully!');
        } catch (error) {
            console.error('Improvement generation failed:', error);
            setError('Failed to generate improvements. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleResumeGenerated = async (resumeData) => {
        try {
            setGeneratedResume(resumeData);
            setSuccess(`Resume generated successfully for ${resumeData.name}! Switch to the Analysis tab to review.`);

            // Simulate adding the generated resume to the resumes list
            const newResume = {
                id: `generated_${Date.now()}`,
                filename: `${resumeData.name}_AI_Generated_Resume.pdf`,
                type: 'ai_generated',
                data: resumeData,
                created_at: new Date().toISOString()
            };

            setResumes(prev => [newResume, ...prev]);
            setSelectedResume(newResume.id);

            // Switch to analysis tab after a brief delay
            setTimeout(() => {
                setActiveTab('analysis');
            }, 2000);

        } catch (error) {
            console.error('Failed to handle generated resume:', error);
            setError('Failed to save generated resume. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 pt-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">AI-Powered Resume Optimizer</h1>
                <p className="text-gray-600">
                    Upload your resume and job description to get AI-powered analysis and improvement suggestions
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="text-red-700">{error}</span>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <span className="text-green-700">{success}</span>
                </div>
            )}

            {/* Applied Template Status */}
            {appliedTemplate && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: appliedTemplate.colorData.primary }}
                                >
                                    <Palette className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-blue-900">
                                        Template Applied: {appliedTemplate.templateData.name}
                                    </h3>
                                    <p className="text-sm text-blue-700">
                                        Color Scheme: {appliedTemplate.colorData.name} •
                                        Category: {appliedTemplate.templateData.category}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-green-600" />
                                <span className="text-sm text-green-700 font-medium">Active</span>
                            </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                            {appliedTemplate.templateData.features.map((feature, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                >
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="upload">Upload & Setup</TabsTrigger>
                    <TabsTrigger value="conversation">
                        <Brain className="w-4 h-4 mr-2" />
                        ROCKET Framework
                    </TabsTrigger>
                    <TabsTrigger value="builder">
                        <Zap className="w-4 h-4 mr-2" />
                        AI Resume Builder
                    </TabsTrigger>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <FileText className="h-5 w-5" />
                                    <span>Upload Resume</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResumeUpload
                                    onUploadSuccess={handleResumeUpload}
                                    onUploadError={handleError}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Briefcase className="h-5 w-5" />
                                    <span>Job Description</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <JobDescriptionInput
                                    onJobSubmit={handleJobSubmit}
                                    onError={handleError}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {(resumes.length > 0 || jobs.length > 0) && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Select Items for Analysis</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {resumes.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Resume:
                                        </label>
                                        <select
                                            value={selectedResume || ''}
                                            onChange={(e) => setSelectedResume(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="">Choose a resume...</option>
                                            {resumes.map((resume) => (
                                                <option key={resume.id} value={resume.id}>
                                                    {resume.filename || `Resume ${resume.id}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {jobs.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Job Description:
                                        </label>
                                        <select
                                            value={selectedJob || ''}
                                            onChange={(e) => setSelectedJob(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="">Choose a job description...</option>
                                            {jobs.map((job) => (
                                                <option key={job.id} value={job.id}>
                                                    {job.title || `Job ${job.id}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="flex space-x-3">
                                    <Button
                                        onClick={analyzeResume}
                                        disabled={!selectedResume || !selectedJob || isAnalyzing}
                                        className="flex-1"
                                    >
                                        {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={getImprovements}
                                        disabled={!selectedResume || !selectedJob || isAnalyzing}
                                        className="flex-1"
                                    >
                                        {isAnalyzing ? 'Generating...' : 'Get Improvements'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="conversation" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Brain className="h-5 w-5 text-blue-600" />
                                <span>🚀 ROCKET Framework - Career Acceleration Toolkit</span>
                            </CardTitle>
                            <p className="text-gray-600 mt-2">
                                Create a strategic, ATS-optimized resume using the ROCKET Framework methodology. 
                                ROCKET = <strong>R</strong>esults-<strong>O</strong>ptimized <strong>C</strong>areer <strong>K</strong>nowledge <strong>E</strong>nhancement <strong>T</strong>oolkit.
                                Uses CAR (Context-Action-Results) and REST (Results-Efficiency-Scope-Time) methods to position you as THE best choice.
                            </p>
                        </CardHeader>
                        <CardContent>
                            <ConversationalResumeBuilder onResumeGenerated={handleResumeGenerated} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="builder" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Zap className="h-5 w-5 text-blue-600" />
                                <span>AI-Powered Resume Builder</span>
                            </CardTitle>
                            <p className="text-gray-600 mt-2">
                                Create a professional resume from scratch using our AI-powered interview process.
                                Your generated resume will automatically be available for analysis.
                            </p>
                        </CardHeader>
                        <CardContent>
                            <ResumeBuilderIntegrated onResumeGenerated={handleResumeGenerated} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analysis" className="space-y-6">
                    {generatedResume && (
                        <Card className="border-green-200 bg-green-50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-green-900">
                                            AI Resume Generated: {generatedResume.name}
                                        </h3>
                                        <p className="text-sm text-green-700">
                                            Target Role: {generatedResume.role} • Generated: {new Date(generatedResume.generatedAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {analysis ? (
                        <ResumeAnalysis
                            score={analysis.score || 0}
                            details={analysis.details || 'No details available'}
                            commentary={analysis.commentary || 'No commentary available'}
                            improvements={analysis.improvements || []}
                        />
                    ) : (
                        <Card>
                            <CardContent className="text-center py-12">
                                <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Available</h3>
                                <p className="text-gray-500">
                                    Upload a resume and job description, then run an analysis to see results here.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="history" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Resume History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {resumes.length > 0 ? (
                                    <div className="space-y-2">
                                        {resumes.map((resume) => (
                                            <div key={resume.id} className="p-3 border rounded-lg">
                                                <p className="font-medium">{resume.filename || `Resume ${resume.id}`}</p>
                                                <p className="text-sm text-gray-500">
                                                    Uploaded: {new Date(resume.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No resumes uploaded yet</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Job History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {jobs.length > 0 ? (
                                    <div className="space-y-2">
                                        {jobs.map((job) => (
                                            <div key={job.id} className="p-3 border rounded-lg">
                                                <p className="font-medium">{job.title || `Job ${job.id}`}</p>
                                                <p className="text-sm text-gray-500">
                                                    Added: {new Date(job.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No job descriptions added yet</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AIDashboard;
