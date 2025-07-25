# Resume Builder Makefile
# Provides convenient commands for development and deployment
# Enhanced with monitoring and failsafe mechanisms

.PHONY: help setup install clean build run-dev run-prod lint format test deploy install-deps install-system monitor

# Default target
help:
	@echo "Resume Builder - Available Commands:"
	@echo ""
	@echo "  setup           - Run initial project setup and install dependencies"
	@echo "  install-system  - Install system requirements (Homebrew, Node.js, etc.)"
	@echo "  install-deps    - Install Node.js dependencies only"
	@echo "  install         - Alias for install-deps"
	@echo "  clean           - Clean build artifacts and node_modules"
	@echo "  build           - Build the project for production"
	@echo "  run-dev         - Start the development server"
	@echo "  run-prod        - Start the production server (after build)"
	@echo "  lint            - Run ESLint on the source code"
	@echo "  format          - Format code with Prettier"
	@echo "  test            - Run tests (when implemented)"
	@echo "  deploy          - Deploy to production (when configured)"
	@echo "  monitor         - Monitor installation/build processes"
	@echo ""
	@echo "Troubleshooting Commands:"
	@echo "  install-system  - Install system dependencies via Homebrew"
	@echo "  monitor-logs    - Show live log output"
	@echo "  force-clean     - Force clean everything and restart"
	@echo ""
	@echo "Example usage:"
	@echo "  make setup        # Initial setup with monitoring"
	@echo "  make install-system # Install system requirements"
	@echo "  make run-dev      # Start development server"

# Enhanced setup with monitoring
setup:
	@echo "🚀 Setting up Resume Builder with enhanced monitoring..."
	chmod +x setup.sh monitor.sh
	./setup.sh

# Install system requirements
install-system:
	@echo "🔧 Installing system requirements..."
	@echo "This will install: Homebrew, Node.js, Python3, curl, make"
	@./monitor.sh run "brew update && brew install node python3 curl make" "System Installation" "system-install.log" || \
	(echo "❌ System installation failed. Trying individual installations..."; \
	 ./monitor.sh run "brew install node" "Node.js Installation" "node-install.log"; \
	 ./monitor.sh run "brew install python3" "Python3 Installation" "python-install.log"; \
	 ./monitor.sh run "brew install curl" "curl Installation" "curl-install.log"; \
	 ./monitor.sh run "brew install make" "make Installation" "make-install.log")

# Install Node.js dependencies with monitoring
install-deps:
	@echo "📦 Installing Node.js dependencies with monitoring..."
	@if [ ! -f "package.json" ]; then \
		echo "Creating package.json..."; \
		npm init -y; \
	fi
	@./monitor.sh run "npm install --save-dev vite @vitejs/plugin-react eslint prettier" "Dev Dependencies" "dev-deps.log" && \
	 ./monitor.sh run "npm install react react-dom react-router-dom lucide-react" "Runtime Dependencies" "runtime-deps.log" || \
	(echo "❌ Bulk installation failed. Trying individual package installation..."; \
	 echo "Installing packages one by one..."; \
	 for pkg in vite @vitejs/plugin-react eslint prettier; do \
		echo "Installing $$pkg..."; \
		./monitor.sh run "npm install --save-dev $$pkg" "$$pkg Installation" "$$pkg.log" || echo "⚠️  $$pkg failed"; \
	 done; \
	 for pkg in react react-dom react-router-dom lucide-react; do \
		echo "Installing $$pkg..."; \
		./monitor.sh run "npm install $$pkg" "$$pkg Installation" "$$pkg.log" || echo "⚠️  $$pkg failed"; \
	 done)

# Install dependencies (alias)
install: install-deps

# Clean build artifacts with enhanced options
clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf dist/
	rm -rf node_modules/
	rm -f package-lock.json

# Force clean everything
force-clean:
	@echo "🧹 Force cleaning everything..."
	rm -rf dist/
	rm -rf node_modules/
	rm -f package-lock.json
	rm -f *.log
	npm cache clean --force

# Build for production with monitoring
build:
	@echo "🏗️  Building for production..."
	@./monitor.sh run "npm run build" "Production Build" "build.log"

# Start development server with monitoring
run-dev:
	@echo "🔥 Starting development server..."
	@echo "Server will be available at http://localhost:3000"
	@./monitor.sh run "npm run dev" "Development Server" "dev-server.log"

# Start production server (preview) with monitoring
run-prod: build
	@echo "🌟 Starting production server..."
	@./monitor.sh run "npm run preview" "Production Server" "prod-server.log"

# Run linter with monitoring
lint:
	@echo "🔍 Running ESLint..."
	@./monitor.sh run "npm run lint" "ESLint" "lint.log"

# Format code with monitoring
format:
	@echo "✨ Formatting code..."
	@./monitor.sh run "npm run format" "Prettier" "format.log"

# Monitor installation processes
monitor:
	@echo "📊 Starting installation monitor..."
	@echo "Available options:"
	@echo "  make monitor-logs    - Show live log output"
	@echo "  ./monitor.sh help    - Show monitor help"

# Show live logs
monitor-logs:
	@echo "📊 Showing live log output (Ctrl+C to stop)..."
	@./monitor.sh tail setup.log

# Run tests (placeholder for when tests are added)
test:
	@echo "🧪 Running tests..."
	@echo "Tests not yet implemented. Add your test command here."

# Deploy (placeholder for deployment configuration)
deploy: build
	@echo "🚀 Deploying to production..."
	@echo "Deployment not yet configured. Add your deployment commands here."

# Quick development workflow
dev: setup run-dev

# Production workflow  
prod: clean install build run-prod

# Troubleshooting workflow
troubleshoot:
	@echo "🔧 Running troubleshooting workflow..."
	@echo "1. Checking system requirements..."
	@make install-system
	@echo "2. Force cleaning..."
	@make force-clean
	@echo "3. Installing dependencies..."
	@make install-deps
	@echo "4. Testing build..."
	@make build

# Unified development commands
start-all:
	@echo "🚀 Starting all services (backend + frontend)..."
	@echo "Backend will start on http://localhost:8000"
	@echo "Frontend will start on http://localhost:3000+"
	@echo "Press Ctrl+C to stop all services"
	./setup-unified.sh --start

start-backend:
	@echo "🔧 Starting backend server..."
	cd apps/backend && source venv/bin/activate && python -m app.main

start-frontend:
	@echo "🎨 Starting frontend server..."
	cd apps/web-app && npm run dev

stop-all:
	@echo "🛑 Stopping all services..."
	@pkill -f "python -m app.main" || true
	@pkill -f "vite" || true
	@echo "All services stopped"

status:
	@echo "📊 Service Status:"
	@echo "Backend (port 8000):"
	@lsof -i :8000 || echo "  Not running"
	@echo "Frontend (ports 3000-3003):"
	@lsof -i :3000 || echo "  Port 3000: Not running"
	@lsof -i :3001 || echo "  Port 3001: Not running"
	@lsof -i :3002 || echo "  Port 3002: Not running"
	@lsof -i :3003 || echo "  Port 3003: Not running"

test-integration:
	@echo "🧪 Testing integration..."
	@echo "Testing backend health..."
	@curl -s http://localhost:8000/ping || echo "Backend not responding"
	@echo ""
	@echo "Testing frontend..."
	@curl -s http://localhost:3000 -o /dev/null || curl -s http://localhost:3001 -o /dev/null || curl -s http://localhost:3002 -o /dev/null || curl -s http://localhost:3003 -o /dev/null || echo "Frontend not responding"
