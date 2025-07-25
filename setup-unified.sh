#!/bin/bash

# Enhanced Resume Builder with AI Integration Setup Script
# This script sets up both the React frontend and FastAPI backend
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
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

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    error "This script is designed for macOS. Please adapt for your OS."
    exit 1
fi

log "Starting Resume Builder AI Integration Setup..."

# Check system dependencies
log "Checking system dependencies..."

# Check Node.js
if ! command -v node &> /dev/null; then
    error "Node.js is not installed. Please install Node.js first."
    exit 1
fi
NODE_VERSION=$(node --version)
success "Node.js found: $NODE_VERSION"

# Check npm
if ! command -v npm &> /dev/null; then
    error "npm is not installed. Please install npm first."
    exit 1
fi
NPM_VERSION=$(npm --version)
success "npm found: $NPM_VERSION"

# Check Python3
if ! command -v python3 &> /dev/null; then
    error "Python3 is not installed. Please install Python3 first."
    exit 1
fi
PYTHON_VERSION=$(python3 --version)
success "Python3 found: $PYTHON_VERSION"

# Check pip3
if ! command -v pip3 &> /dev/null; then
    error "pip3 is not installed. Please install pip3 first."
    exit 1
fi
PIP_VERSION=$(pip3 --version)
success "pip3 found: $PIP_VERSION"

# Check or install Ollama
log "Checking Ollama installation..."
if ! command -v ollama &> /dev/null; then
    warning "Ollama not found. Installing Ollama..."
    if command -v brew &> /dev/null; then
        brew install ollama
        success "Ollama installed via Homebrew"
    else
        error "Homebrew not found. Please install Ollama manually from https://ollama.ai"
        exit 1
    fi
else
    OLLAMA_VERSION=$(ollama --version)
    success "Ollama found: $OLLAMA_VERSION"
fi

# Start Ollama service
log "Starting Ollama service..."
ollama serve &
OLLAMA_PID=$!
sleep 5

# Pull required AI models
log "Setting up AI models..."
log "Pulling llama3.2 model (this may take a while)..."
ollama pull llama3.2
success "llama3.2 model ready"

# Setup Frontend
log "Setting up React frontend..."
cd apps/web-app

# Install frontend dependencies
log "Installing frontend dependencies..."
npm install
success "Frontend dependencies installed"

# Setup Backend
log "Setting up FastAPI backend..."
cd ../backend

# Create Python virtual environment
log "Creating Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install backend dependencies
log "Installing backend dependencies..."
pip install -r requirements.txt
success "Backend dependencies installed"

# Setup database (if needed)
log "Setting up database..."
# Add database initialization commands here if needed

# Return to root directory
cd ../..

# Create unified start script
log "Creating unified start script..."
cat > start.sh << 'EOF'
#!/bin/bash

# Start script for Resume Builder with AI Integration
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Function to cleanup background processes
cleanup() {
    log "Shutting down services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

log "Starting Resume Builder AI Integration..."

# Start Ollama if not running
if ! pgrep -x "ollama" > /dev/null; then
    log "Starting Ollama service..."
    ollama serve &
    sleep 3
fi

# Start Backend
log "Starting FastAPI backend on port 8000..."
cd apps/backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ../..

# Wait for backend to start
sleep 5

# Start Frontend
log "Starting React frontend on port 3000..."
cd apps/web-app
npm run dev &
FRONTEND_PID=$!
cd ../..

success "All services started successfully!"
log "Frontend: http://localhost:3000"
log "Backend API: http://localhost:8000"
log "API Documentation: http://localhost:8000/docs"
log ""
log "Press Ctrl+C to stop all services"

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
EOF

chmod +x start.sh

# Create stop script
log "Creating stop script..."
cat > stop.sh << 'EOF'
#!/bin/bash

# Stop script for Resume Builder with AI Integration
log() {
    echo -e "\033[0;34m[$(date +'%Y-%m-%d %H:%M:%S')]\033[0m $1"
}

log "Stopping Resume Builder services..."

# Kill processes by port
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:8000 | xargs kill -9 2>/dev/null || true

# Kill Ollama if running
pkill -f "ollama serve" 2>/dev/null || true

log "All services stopped"
EOF

chmod +x stop.sh

# Create status check script
log "Creating status check script..."
cat > status.sh << 'EOF'
#!/bin/bash

# Status check script for Resume Builder with AI Integration
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

check_service() {
    local service=$1
    local port=$2
    local url=$3
    
    if curl -s "$url" > /dev/null 2>&1; then
        echo -e "$service: ${GREEN}Running${NC} (port $port)"
    else
        echo -e "$service: ${RED}Not running${NC} (port $port)"
    fi
}

echo "Resume Builder AI Integration - Service Status"
echo "=============================================="

check_service "Frontend" "3000" "http://localhost:3000"
check_service "Backend API" "8000" "http://localhost:8000/health"
check_service "Ollama" "11434" "http://localhost:11434"

echo ""
echo "Available endpoints:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:8000"
echo "- API Docs: http://localhost:8000/docs"
echo "- AI Dashboard: http://localhost:3000/ai"
EOF

chmod +x status.sh

# Update main Makefile
log "Updating Makefile..."
cat > Makefile << 'EOF'
.PHONY: setup start stop status install-deps clean help

# Enhanced Resume Builder with AI Integration Makefile

help: ## Show this help message
	@echo "Resume Builder AI Integration - Available Commands:"
	@echo "=================================================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: ## Run initial setup for both frontend and backend
	@echo "Running initial setup..."
	./setup.sh

start: ## Start all services (frontend, backend, AI)
	@echo "Starting all services..."
	./start.sh

stop: ## Stop all services
	@echo "Stopping all services..."
	./stop.sh

status: ## Check status of all services
	@echo "Checking service status..."
	./status.sh

install-deps: ## Install/update dependencies for both frontend and backend
	@echo "Installing frontend dependencies..."
	cd apps/web-app && npm install
	@echo "Installing backend dependencies..."
	cd apps/backend && source venv/bin/activate && pip install -r requirements.txt

clean: ## Clean build artifacts and dependencies
	@echo "Cleaning build artifacts..."
	rm -rf apps/web-app/node_modules
	rm -rf apps/web-app/dist
	rm -rf apps/backend/venv
	rm -rf apps/backend/__pycache__
	rm -rf apps/backend/.pytest_cache

dev-frontend: ## Start only the frontend in development mode
	cd apps/web-app && npm run dev

dev-backend: ## Start only the backend in development mode
	cd apps/backend && source venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

build: ## Build the frontend for production
	cd apps/web-app && npm run build

test: ## Run tests for both frontend and backend
	@echo "Running frontend tests..."
	cd apps/web-app && npm test || echo "No frontend tests configured"
	@echo "Running backend tests..."
	cd apps/backend && source venv/bin/activate && python -m pytest || echo "No backend tests configured"

logs: ## Show logs from running services
	@echo "Use 'make start' to see live logs"

ollama-models: ## Download and setup required AI models
	ollama pull llama3.2
	ollama pull mistral
	@echo "AI models ready"

docker-build: ## Build Docker containers (if Docker setup is added later)
	@echo "Docker setup not implemented yet"

docker-up: ## Start services with Docker (if Docker setup is added later)
	@echo "Docker setup not implemented yet"

update: ## Update all dependencies
	@echo "Updating frontend dependencies..."
	cd apps/web-app && npm update
	@echo "Updating backend dependencies..."
	cd apps/backend && source venv/bin/activate && pip install --upgrade -r requirements.txt

EOF

# Function to start development servers
start_dev_servers() {
    log "Starting development servers..."
    
    # Check if services are already running
    if lsof -i :8000 &> /dev/null; then
        warning "Backend already running on port 8000"
    fi
    
    if lsof -i :3000 &> /dev/null || lsof -i :3001 &> /dev/null || lsof -i :3002 &> /dev/null || lsof -i :3003 &> /dev/null; then
        warning "Frontend already running on one of the ports 3000-3003"
    fi
    
    log "Starting backend server on port 8000..."
    cd apps/backend
    source venv/bin/activate
    python -m app.main &
    BACKEND_PID=$!
    cd ../..
    
    log "Starting frontend server..."
    cd apps/web-app
    npm run dev &
    FRONTEND_PID=$!
    cd ../..
    
    log "Development servers started:"
    log "- Backend: http://localhost:8000"
    log "- Frontend: http://localhost:3000+ (check terminal for exact port)"
    log "- API Docs: http://localhost:8000/api/docs"
    
    log ""
    log "Press Ctrl+C to stop all servers"
    
    # Wait for Ctrl+C
    trap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit' INT
    wait $BACKEND_PID $FRONTEND_PID
}

# Parse command line arguments
if [[ "$1" == "--start" ]]; then
    start_dev_servers
elif [[ "$1" == "--help" ]]; then
    log "Usage: $0 [--start|--help]"
    log "  --start: Run setup and start development servers"
    log "  --help:  Show this help message"
fi

success "Setup completed successfully!"
log ""
log "Next steps:"
log "1. Run 'make start' to start all services"
log "2. Open http://localhost:3000 in your browser"
log "3. Navigate to the AI Dashboard at http://localhost:3000/ai"
log "4. Upload a resume and job description to test the AI features"
log ""
log "Available commands:"
log "- make start    : Start all services"
log "- make stop     : Stop all services"
log "- make status   : Check service status"
log "- make help     : Show all available commands"
