import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResumeUpload from './ResumeUpload';
import JobDescriptionInput from './JobDescriptionInput';
import ResumeAnalysis from './ResumeAnalysis';
import { resumeService, jobService } from '@/services/resume';
import { FileText, Briefcase, BarChart3, AlertCircle } from 'lucide-react';

const AIDashboard = () => {
    const [resumes, setResumes] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [selectedResume, setSelectedResume] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadResumes();
        loadJobs();
    }, []);

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

    return (
        <div className="container mx-auto p-6 space-y-6">
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

            <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upload">Upload & Setup</TabsTrigger>
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

                <TabsContent value="analysis" className="space-y-6">
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
