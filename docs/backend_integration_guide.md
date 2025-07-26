# Resume Builder Backend Integration Guide

## Overview
This guide outlines the backend integration for the AI-powered Resume Builder frontend.

## Frontend Features Implemented
✅ Resume Builder Component with real-time UI
✅ Auto-save functionality (mock)
✅ ATS analysis display
✅ AI content enhancement buttons
✅ Export functionality (mock)
✅ Custom hooks for state management
✅ API service layer ready for backend

## Backend Integration Points

### 1. API Service (/src/services/resumeAPI.js)
- All API calls are centralized in this service
- Currently using mock data for development
- Ready to connect to real endpoints at `http://localhost:8000`

### 2. Custom Hook (/src/hooks/useResumeBuilder.js)
- Manages all resume state and operations
- Handles auto-save, analysis, and enhancement
- Error handling and loading states included

### 3. Required Environment Variables
Add to `/apps/web-app/.env`:
```
VITE_API_URL=http://localhost:8000
```

## Backend Endpoints to Implement

### Resume CRUD
- POST /api/v1/resumes - Create resume
- GET /api/v1/resumes/{id} - Get resume
- PUT /api/v1/resumes/{id} - Update resume
- DELETE /api/v1/resumes/{id} - Delete resume
- GET /api/v1/users/{id}/resumes - List user resumes

### ATS Analysis
- POST /api/v1/analysis/ats - Analyze resume
- POST /api/v1/analysis/keywords - Get keyword suggestions

### AI Enhancement
- POST /api/v1/ai/enhance - Enhance content
- POST /api/v1/ai/generate-summary - Generate summary

### Export
- POST /api/v1/export/pdf - Export PDF
- POST /api/v1/export/docx - Export Word

## Next Steps
1. Set up FastAPI backend with endpoints
2. Implement PostgreSQL database
3. Add Ollama/OpenAI integration for AI features
4. Test full integration with frontend
5. Deploy and monitor

## Testing
- Frontend components are fully tested
- Mock data provides realistic responses
- Error handling implemented throughout
- Ready for backend handover