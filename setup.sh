#!/bin/bash

# Resume Builder Setup Script
# This script sets up the development environment and installs dependencies
# Enhanced with progress tracking, timeouts, and failsafes

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
INSTALL_TIMEOUT=300  # 5 minutes timeout for installations
PROGRESS_INTERVAL=10 # Show progress every 10 seconds
LOG_FILE="setup.log"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

print_progress() {
    echo -e "${PURPLE}[PROGRESS]${NC} $1" | tee -a "$LOG_FILE"
}

print_debug() {
    echo -e "${CYAN}[DEBUG]${NC} $1" | tee -a "$LOG_FILE"
}

# Progress indicator function
show_progress() {
    local pid=$1
    local message=$2
    local count=0
    local spinner='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
    
    while kill -0 $pid 2>/dev/null; do
        printf "\r${PURPLE}[PROGRESS]${NC} %s %c" "$message" "${spinner:$count%10:1}"
        sleep 0.1
        ((count++))
        
        # Show detailed progress every PROGRESS_INTERVAL seconds
        if (( count % (PROGRESS_INTERVAL * 10) == 0 )); then
            printf "\n"
            print_progress "$message - Still running... (${count/10}s elapsed)"
        fi
    done
    printf "\n"
}

# Enhanced command execution with timeout and progress
run_with_timeout() {
    local timeout=$1
    local message=$2
    shift 2
    local cmd="$@"
    
    print_status "Starting: $message"
    print_debug "Command: $cmd"
    echo "$(date): Starting command: $cmd" >> "$LOG_FILE"
    
    # Run command in background
    $cmd >> "$LOG_FILE" 2>&1 &
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
            print_error "Command timed out after ${timeout}s: $message"
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
        print_success "Completed: $message"
    else
        print_error "Failed: $message (exit code: $exit_code)"
        echo "$(date): Command failed with exit code $exit_code" >> "$LOG_FILE"
        return $exit_code
    fi
    
    return 0
}

# Retry mechanism for critical operations
retry_operation() {
    local max_attempts=$1
    local delay=$2
    local operation_name=$3
    shift 3
    local cmd="$@"
    
    local attempt=1
    while [ $attempt -le $max_attempts ]; do
        print_status "Attempt $attempt/$max_attempts: $operation_name"
        
        if run_with_timeout $INSTALL_TIMEOUT "$operation_name" $cmd; then
            return 0
        else
            if [ $attempt -lt $max_attempts ]; then
                print_warning "Attempt $attempt failed. Retrying in ${delay}s..."
                sleep $delay
            else
                print_error "All $max_attempts attempts failed for: $operation_name"
                return 1
            fi
        fi
        ((attempt++))
    done
}

# System requirements check with installation options
check_and_install_requirements() {
    print_status "Checking system requirements..."
    
    # Check and install Homebrew first
    if ! command_exists brew; then
        print_warning "Homebrew not found. Installing Homebrew..."
        if retry_operation 2 5 "Installing Homebrew" /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"; then
            print_success "Homebrew installed successfully"
            # Add Homebrew to PATH for current session
            eval "$(/opt/homebrew/bin/brew shellenv)" 2>/dev/null || eval "$(/usr/local/bin/brew shellenv)" 2>/dev/null || true
        else
            print_error "Failed to install Homebrew. Please install manually."
            return 1
        fi
    fi
    
    # Update Homebrew
    print_status "Updating Homebrew..."
    if retry_operation 2 10 "Updating Homebrew" brew update; then
        print_success "Homebrew updated successfully"
    else
        print_warning "Homebrew update failed, continuing anyway..."
    fi
    
    # Check and install Node.js
    if ! command_exists node; then
        print_warning "Node.js not found. Installing via Homebrew..."
        if retry_operation 3 15 "Installing Node.js" brew install node; then
            print_success "Node.js installed successfully"
        else
            print_error "Failed to install Node.js via Homebrew"
            print_status "Trying alternative installation method..."
            
            # Fallback: Try installing Node.js directly
            if retry_operation 2 10 "Installing Node.js (alternative)" curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash && source ~/.bashrc && nvm install --lts; then
                print_success "Node.js installed via NVM"
            else
                print_error "All Node.js installation methods failed"
                return 1
            fi
        fi
    fi
    
    # Check and install other tools
    local tools=("python3" "curl" "make")
    for tool in "${tools[@]}"; do
        if ! command_exists $tool; then
            print_warning "$tool not found. Installing via Homebrew..."
            if retry_operation 2 10 "Installing $tool" brew install $tool; then
                print_success "$tool installed successfully"
            else
                print_warning "Failed to install $tool via Homebrew, but continuing..."
            fi
        else
            print_success "$tool is already installed"
        fi
    done
    
    return 0
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install Node.js dependencies with enhanced error handling
install_dependencies() {
    print_status "Installing Node.js dependencies with enhanced monitoring..."
    
    # Initialize log file
    echo "$(date): Starting dependency installation" > "$LOG_FILE"
    
    if [ ! -f "package.json" ]; then
        print_status "Creating package.json..."
        if retry_operation 2 5 "Creating package.json" npm init -y; then
            
            # Update package.json with project details
            print_status "Configuring package.json..."
            npm pkg set name="resume-builder" || print_warning "Failed to set name"
            npm pkg set description="A modern resume builder application" || print_warning "Failed to set description"
            npm pkg set main="src/index.jsx" || print_warning "Failed to set main"
            npm pkg set scripts.dev="vite" || print_warning "Failed to set dev script"
            npm pkg set scripts.build="vite build" || print_warning "Failed to set build script"
            npm pkg set scripts.preview="vite preview" || print_warning "Failed to set preview script"
            npm pkg set scripts.lint="eslint src --ext .js,.jsx,.ts,.tsx" || print_warning "Failed to set lint script"
            npm pkg set scripts.format="prettier --write src/" || print_warning "Failed to set format script"
        else
            print_error "Failed to create package.json"
            return 1
        fi
    fi
    
    # Clear npm cache before installation
    print_status "Clearing npm cache..."
    npm cache clean --force >> "$LOG_FILE" 2>&1 || print_warning "Cache clear failed"
    
    # Install development dependencies with retry and timeout
    print_status "Installing development dependencies..."
    local dev_deps="vite @vitejs/plugin-react eslint prettier"
    
    if retry_operation 3 20 "Installing dev dependencies" npm install --save-dev --no-audit --progress=true $dev_deps; then
        print_success "Development dependencies installed"
    else
        print_error "Failed to install development dependencies"
        print_status "Trying individual package installation..."
        
        for pkg in $dev_deps; do
            print_status "Installing $pkg individually..."
            if retry_operation 2 10 "Installing $pkg" npm install --save-dev --no-audit $pkg; then
                print_success "$pkg installed"
            else
                print_warning "$pkg installation failed, continuing..."
            fi
        done
    fi
    
    # Install runtime dependencies with retry and timeout
    print_status "Installing runtime dependencies..."
    local runtime_deps="react react-dom react-router-dom lucide-react"
    
    if retry_operation 3 20 "Installing runtime dependencies" npm install --no-audit --progress=true $runtime_deps; then
        print_success "Runtime dependencies installed"
    else
        print_error "Failed to install runtime dependencies"
        print_status "Trying individual package installation..."
        
        for pkg in $runtime_deps; do
            print_status "Installing $pkg individually..."
            if retry_operation 2 10 "Installing $pkg" npm install --no-audit $pkg; then
                print_success "$pkg installed"
            else
                print_warning "$pkg installation failed, continuing..."
            fi
        done
    fi
    
    # Verify installation
    print_status "Verifying installation..."
    if [ -d "node_modules" ] && [ -f "package-lock.json" ]; then
        local installed_count=$(ls node_modules 2>/dev/null | wc -l)
        print_success "Installation verified: $installed_count packages in node_modules"
        
        # Show package.json status
        if command_exists jq; then
            print_debug "Installed dependencies:"
            jq -r '.dependencies // {} | keys[]' package.json 2>/dev/null | sed 's/^/  - /' || true
            jq -r '.devDependencies // {} | keys[]' package.json 2>/dev/null | sed 's/^/  - dev: /' || true
        fi
    else
        print_warning "Installation verification failed - some packages may be missing"
    fi
    
    return 0
}

# Function to create project structure
create_project_structure() {
    print_status "Creating project structure..."
    
    # Create directories
    mkdir -p src/components
    mkdir -p src/pages
    mkdir -p src/hooks
    mkdir -p src/utils
    mkdir -p src/styles
    mkdir -p public
    mkdir -p docs
    
    # Create basic files if they don't exist
    if [ ! -f "src/index.js" ]; then
        cat > src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF
    fi
    
    if [ ! -f "src/App.jsx" ]; then
        cat > src/App.jsx << 'EOF'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
EOF
    fi
    
    if [ ! -f "src/pages/HomePage.jsx" ]; then
        cat > src/pages/HomePage.jsx << 'EOF'
import React from 'react';
import { FileText, Download, Edit } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="home-page">
      <header className="hero">
        <h1>Resume Builder</h1>
        <p>Create professional resumes in minutes</p>
        <button className="cta-button">
          <Edit size={20} />
          Start Building
        </button>
      </header>
      
      <section className="features">
        <div className="feature">
          <FileText size={48} />
          <h3>Professional Templates</h3>
          <p>Choose from a variety of modern, ATS-friendly templates</p>
        </div>
        <div className="feature">
          <Edit size={48} />
          <h3>Easy Editing</h3>
          <p>Intuitive drag-and-drop interface for quick customization</p>
        </div>
        <div className="feature">
          <Download size={48} />
          <h3>Export Options</h3>
          <p>Download your resume as PDF or share online</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
EOF
    fi
    
    if [ ! -f "src/styles/index.css" ]; then
        cat > src/styles/index.css << 'EOF'
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f8fafc;
  color: #334155;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
EOF
    fi
    
    if [ ! -f "src/styles/App.css" ]; then
        cat > src/styles/App.css << 'EOF'
.App {
  min-height: 100vh;
}

.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero {
  text-align: center;
  padding: 4rem 0;
}

.hero h1 {
  font-size: 3rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.25rem;
  color: #64748b;
  margin-bottom: 2rem;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cta-button:hover {
  background-color: #2563eb;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}

.feature {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.feature svg {
  color: #3b82f6;
  margin-bottom: 1rem;
}

.feature h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.feature p {
  color: #64748b;
  line-height: 1.6;
}
EOF
    fi
    
    if [ ! -f "index.html" ]; then
        cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Resume Builder</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.js"></script>
  </body>
</html>
EOF
    fi
    
    if [ ! -f "vite.config.js" ]; then
        cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist'
  }
})
EOF
    fi
    
    print_success "Project structure created successfully!"
}

# Function to start development server
start_dev_server() {
    print_status "Starting development server..."
    npm run dev
}

# Main setup function with comprehensive error handling
main() {
    print_status "Starting Resume Builder setup with enhanced monitoring..."
    print_status "Log file: $LOG_FILE"
    
    # Initialize log
    echo "=== Resume Builder Setup Log ===" > "$LOG_FILE"
    echo "Start time: $(date)" >> "$LOG_FILE"
    echo "System: $(uname -a)" >> "$LOG_FILE"
    echo "===============================" >> "$LOG_FILE"
    
    # Check and install system requirements
    if ! check_and_install_requirements; then
        print_error "System requirements check failed"
        print_status "Check the log file for details: $LOG_FILE"
        exit 1
    fi
    
    # Verify Node.js and npm are working
    if command_exists node && command_exists npm; then
        local node_version=$(node --version 2>/dev/null || echo "unknown")
        local npm_version=$(npm --version 2>/dev/null || echo "unknown")
        print_success "Node.js $node_version and npm $npm_version found!"
    else
        print_error "Node.js or npm not found after installation"
        print_status "Please check the installation and try again"
        exit 1
    fi
    
    # Create project structure
    if ! create_project_structure; then
        print_error "Project structure creation failed"
        exit 1
    fi
    
    # Install dependencies with enhanced monitoring
    if ! install_dependencies; then
        print_error "Dependency installation failed"
        print_status "You can try running the installation manually:"
        print_status "  npm install --save-dev vite @vitejs/plugin-react eslint prettier"
        print_status "  npm install react react-dom react-router-dom lucide-react"
        exit 1
    fi
    
    # Create .gitignore if it doesn't exist
    if [ ! -f ".gitignore" ]; then
        print_status "Creating .gitignore..."
        cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs/
*.log
setup.log

# Package manager files
package-lock.json
yarn.lock
EOF
        print_success ".gitignore created"
    fi
    
    # Final verification
    print_status "Running final verification..."
    if [ -f "package.json" ] && [ -d "node_modules" ] && [ -f "src/index.jsx" ]; then
        print_success "Setup completed successfully!"
        print_status "Project structure verified ✓"
        print_status "Dependencies installed ✓"
        print_status "Configuration files created ✓"
        
        echo ""
        print_status "Next steps:"
        print_status "  • Run 'npm run dev' to start the development server"
        print_status "  • Run 'make run-dev' for convenience"
        print_status "  • Check '$LOG_FILE' for detailed logs"
        echo ""
    else
        print_warning "Setup completed with some issues"
        print_status "Please check the log file: $LOG_FILE"
    fi
    
    # Check if --start-dev flag is passed
    if [[ "$1" == "--start-dev" ]]; then
        print_status "Starting development server as requested..."
        if retry_operation 2 5 "Starting development server" npm run dev; then
            print_success "Development server started successfully"
        else
            print_error "Failed to start development server"
            print_status "You can try starting it manually with: npm run dev"
        fi
    fi
}

# Run main function with all arguments
main "$@"
