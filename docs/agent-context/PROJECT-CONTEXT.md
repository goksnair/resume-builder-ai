# Resume Builder AI - Agent Context

## Project Overview
This is a comprehensive AI-powered resume builder that unifies a React frontend with a FastAPI backend, featuring local AI processing using Ollama.

## Key Conversation Points & Decisions

### Initial Requirements
- Unify Resume Builder (React) and Resume-Matcher (FastAPI) projects
- Implement AI-powered ATS analysis
- Use local AI processing for privacy
- Create modern UI with professional templates
- Ensure robust setup and monitoring

### Architecture Decisions Made
1. **Microservices Structure**: Separated frontend and backend into `/apps` directory
2. **Technology Stack**: React + Vite + TailwindCSS + Radix UI + FastAPI + Ollama
3. **AI Integration**: Local Ollama models instead of external APIs for privacy
4. **Database**: SQLite for development, PostgreSQL-ready for production
5. **Development Tools**: Comprehensive Makefile, setup scripts, and testing

### Key Implementation Details
- Frontend runs on port 3000+ (auto-detected)
- Backend runs on port 8000
- CORS configured for cross-origin requests
- Environment variables properly separated
- Automated setup and testing scripts

### File Structure
```
apps/
├── web-app/          # React frontend
└── backend/          # FastAPI backend
setup-unified.sh      # Main setup script
test-integration.sh   # Integration testing
Makefile             # Development commands
```

### Important Commands
```bash
make start-all       # Start all services
make status         # Check service status
./test-integration.sh # Run tests
make stop-all       # Stop services
```

### Known Working Configuration
- All integration tests passing
- Frontend-backend communication working
- AI endpoints configured and accessible
- Database connections established

### Future Enhancement Areas
1. Docker containerization
2. Production deployment
3. Additional AI models
4. Extended resume templates
5. User authentication system

## For Future Agents
This project is fully functional and ready for:
- Feature additions
- Production deployment
- Scaling improvements
- UI/UX enhancements
- AI model upgrades

All setup is automated via scripts, and comprehensive testing is available.
