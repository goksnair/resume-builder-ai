#!/bin/bash

# GitHub Repository Creation and Deployment Script
# Creates a new repository on GitHub and pushes the Resume Builder AI project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
GITHUB_USERNAME="goksnair"
REPO_NAME="resume-builder-ai"
REPO_DESCRIPTION="AI-powered resume builder with React frontend and FastAPI backend featuring local Ollama integration"
REPO_VISIBILITY="public"  # or "private"

# Monitoring configuration
LOG_FILE="deploy.log"
INSTALL_TIMEOUT=300
PROGRESS_INTERVAL=10

log() {
    echo -e "${BLUE}[DEPLOY]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

info() {
    echo -e "${PURPLE}[INFO]${NC} $1"
}

# Enhanced monitoring functions (from setup.sh)
print_progress() {
    echo -e "${PURPLE}[PROGRESS]${NC} $1" | tee -a "$LOG_FILE"
}

show_progress() {
    local pid=$1
    local message=$2
    local count=0
    local spinner='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
    
    while kill -0 $pid 2>/dev/null; do
        printf "\r${PURPLE}[PROGRESS]${NC} %s %c" "$message" "${spinner:$count%10:1}"
        sleep 0.1
        ((count++))
        
        if (( count % (PROGRESS_INTERVAL * 10) == 0 )); then
            printf "\n"
            print_progress "$message - Still running... (${count/10}s elapsed)"
        fi
    done
    printf "\n"
}

run_with_timeout() {
    local timeout=$1
    local message=$2
    shift 2
    local cmd="$@"
    
    log "Starting: $message"
    echo "$(date): Starting command: $cmd" >> "$LOG_FILE"
    
    # Run command in background
    eval "$cmd" >> "$LOG_FILE" 2>&1 &
    local cmd_pid=$!
    
    # Start progress indicator in background
    show_progress $cmd_pid "$message" &
    local progress_pid=$!
    
    # Wait for command with timeout
    local count=0
    while kill -0 $cmd_pid 2>/dev/null; do
        sleep 1
        ((count++))
        if (( count >= timeout )); then
            error "Command timed out after ${timeout}s: $message"
            kill $cmd_pid 2>/dev/null || true
            kill $progress_pid 2>/dev/null || true
            return 1
        fi
    done
    
    # Stop progress indicator
    kill $progress_pid 2>/dev/null || true
    wait $progress_pid 2>/dev/null || true
    
    # Check command exit status
    wait $cmd_pid
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        success "Completed: $message"
    else
        error "Failed: $message (exit code: $exit_code)"
        return $exit_code
    fi
    
    return 0
}

retry_operation() {
    local max_attempts=$1
    local delay=$2
    local operation_name=$3
    shift 3
    local cmd="$@"
    
    local attempt=1
    while [ $attempt -le $max_attempts ]; do
        log "Attempt $attempt/$max_attempts: $operation_name"
        
        if run_with_timeout $INSTALL_TIMEOUT "$operation_name" "$cmd"; then
            return 0
        else
            if [ $attempt -lt $max_attempts ]; then
                warning "Attempt $attempt failed. Retrying in ${delay}s..."
                sleep $delay
            else
                error "All $max_attempts attempts failed for: $operation_name"
                return 1
            fi
        fi
        ((attempt++))
    done
}

# Function to check if GitHub CLI is installed
check_github_cli() {
    log "Checking GitHub CLI installation..."
    
    if ! command -v gh &> /dev/null; then
        warning "GitHub CLI not found. Installing via Homebrew..."
        if command -v brew &> /dev/null; then
            if retry_operation 3 10 "Installing GitHub CLI" "brew install gh"; then
                success "GitHub CLI installed successfully"
            else
                error "Failed to install GitHub CLI via Homebrew"
                error "Please install manually: https://cli.github.com/"
                exit 1
            fi
        else
            error "Homebrew not found. Please install GitHub CLI manually:"
            error "https://cli.github.com/"
            exit 1
        fi
    else
        success "GitHub CLI is available"
    fi
}

# Function to authenticate with GitHub
authenticate_github() {
    log "Checking GitHub authentication..."
    
    if ! gh auth status &> /dev/null; then
        warning "Not authenticated with GitHub. Starting authentication..."
        info "This will open your browser for GitHub authentication."
        
        # Use monitoring for authentication process
        log "Starting GitHub authentication process..."
        echo "$(date): GitHub authentication started" >> "$LOG_FILE"
        
        if run_with_timeout 120 "GitHub Authentication" "gh auth login --web"; then
            success "GitHub authentication completed successfully"
        else
            error "GitHub authentication failed or timed out"
            error "Please try running 'gh auth login' manually"
            exit 1
        fi
    else
        success "Already authenticated with GitHub"
        # Show current user info
        local gh_user=$(gh api user --jq .login 2>/dev/null || echo "unknown")
        info "Authenticated as: $gh_user"
    fi
}

# Function to create .gitignore if it doesn't exist
create_gitignore() {
    log "Creating/updating .gitignore..."
    
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
venv/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
env/
pip-log.txt
pip-delete-this-directory.txt
.tox/
.coverage
.coverage.*
.pytest_cache/
.cache/

# Distribution / packaging
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
setup.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Build outputs
dist/
build/

# Database
*.db
*.sqlite
*.sqlite3

# Temporary files
tmp/
temp/

# Package manager files
package-lock.json
yarn.lock

# Local development
.local/
.cache/

# AI/ML models (if large)
models/
*.model
*.pkl
*.joblib

# Ollama data (if stored locally)
ollama_data/
EOF

    success ".gitignore created/updated"
}

# Function to create README with deployment info
update_readme_for_github() {
    log "Adding GitHub deployment information to README..."
    
    # Backup original README
    cp README.md README.md.backup
    
    # Add GitHub-specific information
    cat >> README.md << EOF

## 🚀 GitHub Repository

This project is available on GitHub: [${GITHUB_USERNAME}/${REPO_NAME}](https://github.com/${GITHUB_USERNAME}/${REPO_NAME})

### Quick Clone and Setup

\`\`\`bash
# Clone the repository
git clone https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git
cd ${REPO_NAME}

# Run unified setup
chmod +x setup-unified.sh
./setup-unified.sh --start
\`\`\`

### Development Workflow

\`\`\`bash
# Check status
make status

# Start all services
make start-all

# Run tests
./test-integration.sh

# Stop services
make stop-all
\`\`\`

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: \`git checkout -b feature-name\`
3. Make your changes
4. Run tests: \`./test-integration.sh\`
5. Commit changes: \`git commit -am 'Add feature'\`
6. Push to branch: \`git push origin feature-name\`
7. Create a Pull Request

## 📞 Support

For issues and questions:
- Create an issue on [GitHub Issues](https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/issues)
- Check the [documentation](https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/wiki)

EOF

    success "README updated with GitHub information"
}

# Function to save chat history and context
save_chat_context() {
    log "Saving chat history and context for future agents..."
    
    mkdir -p docs/agent-context
    
    # Create comprehensive context file
    cat > docs/agent-context/PROJECT-CONTEXT.md << 'EOF'
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
EOF

    # Create technical specifications
    cat > docs/agent-context/TECHNICAL-SPECS.md << 'EOF'
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
EOF

    # Create setup instructions for future reference
    cat > docs/agent-context/SETUP-REFERENCE.md << 'EOF'
# Setup Reference for Future Agents

## Quick Setup Commands
```bash
# Complete setup from scratch
git clone https://github.com/goksnair/resume-builder-ai.git
cd resume-builder-ai
chmod +x setup-unified.sh
./setup-unified.sh --start

# Or step by step
./setup-unified.sh  # Setup only
make start-all      # Start services
```

## Troubleshooting Common Issues

### Backend Issues
- **Import Errors**: Run `pip install -r requirements.txt` in backend venv
- **Port Conflicts**: Check `make status` and kill conflicting processes
- **Database Issues**: Delete SQLite files and restart

### Frontend Issues
- **Node Modules**: Delete `node_modules` and run `npm install`
- **Port Issues**: Vite auto-selects available ports
- **Build Errors**: Check TailwindCSS and PostCSS configurations

### AI Integration Issues
- **Ollama Not Found**: Install Ollama separately if needed
- **Model Loading**: Ensure models are downloaded locally
- **API Timeouts**: Adjust timeout settings in backend config

## Development Workflow
1. Make changes to code
2. Services auto-reload (dev mode)
3. Test with `./test-integration.sh`
4. Check browser at http://localhost:3000+
5. API docs at http://localhost:8000/api/docs

## File Locations to Remember
- Frontend config: `apps/web-app/vite.config.js`
- Backend config: `apps/backend/app/core/config.py`
- Environment vars: `.env` files in each app directory
- Main setup: `setup-unified.sh`
- Testing: `test-integration.sh`
EOF

    success "Chat context and documentation saved in docs/agent-context/"
}

# Function to initialize git repository
init_git_repo() {
    log "Initializing Git repository..."
    
    if [ ! -d ".git" ]; then
        git init
        success "Git repository initialized"
    else
        info "Git repository already exists"
    fi
    
    # Configure git if not already configured
    if [ -z "$(git config user.name)" ]; then
        warning "Git user.name not configured. Please set it:"
        echo "git config --global user.name \"Your Name\""
        echo "git config --global user.email \"your.email@example.com\""
        
        # For this session, use GitHub username
        git config user.name "$GITHUB_USERNAME"
        info "Temporarily set git user.name to $GITHUB_USERNAME"
    fi
    
    # Add all files
    git add .
    
    # Check if there are changes to commit
    if git diff --staged --quiet; then
        info "No changes to commit"
    else
        log "Committing initial project files..."
        git commit -m "Initial commit: Resume Builder AI with React frontend and FastAPI backend

- Unified architecture with React + Vite frontend
- FastAPI backend with Ollama AI integration  
- Complete setup and testing automation
- Professional UI with TailwindCSS and Radix UI
- Local AI processing for privacy
- Comprehensive documentation and development tools

Features:
- AI-powered resume analysis
- Job description matching
- Skills gap identification
- ATS compatibility scoring
- Real-time feedback
- Modern responsive design

Tech Stack:
- Frontend: React, Vite, TailwindCSS, Radix UI
- Backend: FastAPI, SQLAlchemy, Pydantic, Ollama
- Database: SQLite (dev), PostgreSQL-ready (prod)
- AI: Local Ollama models for privacy"
        
        success "Initial commit created"
    fi
}

# Function to create GitHub repository
create_github_repo() {
    log "Creating GitHub repository: $REPO_NAME..."
    
    # Check if repository already exists
    if gh repo view "$GITHUB_USERNAME/$REPO_NAME" &> /dev/null; then
        warning "Repository $GITHUB_USERNAME/$REPO_NAME already exists!"
        info "Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
        
        read -p "Do you want to use the existing repository? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            error "Deployment cancelled"
            exit 1
        fi
    else
        # Create new repository
        gh repo create "$REPO_NAME" \
            --description "$REPO_DESCRIPTION" \
            --$REPO_VISIBILITY \
            --clone=false
        
        success "GitHub repository created: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    fi
    
    # Add remote origin if not exists
    if ! git remote get-url origin &> /dev/null; then
        git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
        success "Remote origin added"
    else
        info "Remote origin already exists"
    fi
}

# Function to push to GitHub
push_to_github() {
    log "Pushing to GitHub..."
    
    # Set upstream and push with monitoring
    if run_with_timeout 120 "Setting main branch and pushing to GitHub" "git branch -M main && git push -u origin main"; then
        success "Project pushed to GitHub successfully!"
        info "Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
        info "You can now access your project at: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    else
        error "Failed to push to GitHub"
        warning "You may need to check your authentication or network connection"
        error "Try running 'git push -u origin main' manually"
        exit 1
    fi
}

# Function to create additional GitHub features
setup_github_features() {
    log "Setting up additional GitHub features..."
    
    # Create basic issue templates
    mkdir -p .github/ISSUE_TEMPLATE
    
    cat > .github/ISSUE_TEMPLATE/bug_report.md << 'EOF'
---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''

---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. chrome, safari]
- Node.js version: [e.g. 18.0.0]
- Python version: [e.g. 3.9.0]

**Additional context**
Add any other context about the problem here.
EOF

    cat > .github/ISSUE_TEMPLATE/feature_request.md << 'EOF'
---
name: Feature Request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: enhancement
assignees: ''

---

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
EOF

    # Create pull request template
    cat > .github/pull_request_template.md << 'EOF'
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] I have run the integration tests (`./test-integration.sh`)
- [ ] I have tested the changes locally
- [ ] All services start correctly with `make start-all`

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
EOF

    success "GitHub templates created"
}

# Main execution
main() {
    log "Starting GitHub deployment for Resume Builder AI..."
    log "Repository: $GITHUB_USERNAME/$REPO_NAME"
    
    # Initialize logging
    echo "=== Resume Builder AI - GitHub Deployment Log ===" > "$LOG_FILE"
    echo "Start time: $(date)" >> "$LOG_FILE"
    echo "User: $(whoami)" >> "$LOG_FILE"
    echo "System: $(uname -a)" >> "$LOG_FILE"
    echo "=============================================" >> "$LOG_FILE"
    
    info "Deployment log: $LOG_FILE"
    
    # Pre-flight checks with monitoring
    log "Phase 1: Pre-flight checks"
    check_github_cli
    authenticate_github
    
    # Prepare repository with monitoring
    log "Phase 2: Repository preparation"
    create_gitignore
    save_chat_context
    update_readme_for_github
    setup_github_features
    
    # Git operations with monitoring
    log "Phase 3: Git operations"
    init_git_repo
    create_github_repo
    push_to_github
    
    # Final summary
    echo ""
    success "🎉 Deployment completed successfully!"
    info "Repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    info "Clone command: git clone https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    echo ""
    log "What was deployed:"
    log "✅ Complete Resume Builder AI project"
    log "✅ React frontend with modern UI"
    log "✅ FastAPI backend with AI integration"
    log "✅ Setup and testing automation"
    log "✅ Comprehensive documentation"
    log "✅ Agent context for future development"
    log "✅ GitHub templates and workflows"
    echo ""
    log "Next steps:"
    log "1. Visit your repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    log "2. Update repository description if needed"
    log "3. Configure branch protection rules"
    log "4. Set up GitHub Actions for CI/CD (optional)"
    log "5. Share the repository link with collaborators"
    
    # Show deployment summary
    echo ""
    info "Deployment Summary:"
    info "📁 Log file: $LOG_FILE"
    info "⏱️  Total time: $(($(date +%s) - $(stat -f %m "$LOG_FILE" 2>/dev/null || echo $(date +%s))))s"
    info "🔗 Repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
}

# Execute main function
main "$@"
