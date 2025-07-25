# Technical Specifications

## Frontend (React + Vite)
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS + Radix UI
- **State Management**: React Hooks
- **API Client**: Fetch API with custom service layer
- **Type Safety**: Proptypes validation

## Backend (FastAPI)
- **Framework**: FastAPI
- **ORM**: SQLAlchemy
- **Validation**: Pydantic
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **AI Integration**: Ollama client
- **Documentation**: Auto-generated Swagger/OpenAPI

## AI Integration
- **Provider**: Ollama (local models)
- **Models**: Gemma3:4b (configurable)
- **Processing**: Local inference for privacy
- **Features**: Resume analysis, job matching, skills extraction

## API Endpoints
- `/ping` - Health check
- `/api/v1/resumes/upload` - Resume upload
- `/api/v1/resumes/improve` - Resume improvement
- `/api/v1/jobs` - Job management
- `/api/docs` - API documentation

## Development Environment
- **Node.js**: 16+
- **Python**: 3.8+
- **Package Managers**: npm, pip
- **Development Server**: Vite dev server + Uvicorn
- **Testing**: Custom integration test suite

## Deployment Configuration
- **Environment Variables**: Separated by service
- **CORS**: Configured for local development
- **Security**: Session middleware, input validation
- **Monitoring**: Health checks and status endpoints
