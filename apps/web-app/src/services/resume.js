import ApiService from './api.js';

export class ResumeService {
    async uploadResume(file) {
        const formData = new FormData();
        formData.append('file', file);

        return ApiService.postFormData('/api/v1/resume/upload', formData);
    }

    async getResume(resumeId) {
        return ApiService.get(`/api/v1/resume/${resumeId}`);
    }

    async analyzeResume(resumeId, jobId) {
        return ApiService.post('/api/v1/resume/analyze', {
            resume_id: resumeId,
            job_id: jobId,
        });
    }

    async getResumeImprovement(resumeId, jobId) {
        return ApiService.post('/api/v1/resume/improvement', {
            resume_id: resumeId,
            job_id: jobId,
        });
    }

    async listResumes() {
        return ApiService.get('/api/v1/resume/list');
    }

    async deleteResume(resumeId) {
        return ApiService.delete(`/api/v1/resume/${resumeId}`);
    }
}

export class JobService {
    async uploadJobDescription(jobDescription) {
        return ApiService.post('/api/v1/job/upload', {
            job_description: jobDescription,
        });
    }

    async getJob(jobId) {
        return ApiService.get(`/api/v1/job/${jobId}`);
    }

    async listJobs() {
        return ApiService.get('/api/v1/job/list');
    }

    async deleteJob(jobId) {
        return ApiService.delete(`/api/v1/job/${jobId}`);
    }
}

export const resumeService = new ResumeService();
export const jobService = new JobService();
