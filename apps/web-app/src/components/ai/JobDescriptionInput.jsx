import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { jobService } from '@/services/resume';

const JobDescriptionInput = ({ onJobSubmit, onError }) => {
    const [jobDescription, setJobDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!jobDescription.trim()) {
            onError?.('Please enter a job description.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await jobService.uploadJobDescription(jobDescription);
            onJobSubmit?.(response);
            setJobDescription('');
        } catch (error) {
            console.error('Job description submission failed:', error);
            onError?.(error.message || 'Failed to process job description.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full space-y-4">
            <div>
                <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description
                </label>
                <textarea
                    id="job-description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    disabled={isSubmitting}
                />
            </div>

            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                    {jobDescription.length} characters
                </span>
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !jobDescription.trim()}
                >
                    {isSubmitting ? 'Processing...' : 'Analyze Job Description'}
                </Button>
            </div>
        </div>
    );
};

export default JobDescriptionInput;
