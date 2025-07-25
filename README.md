# Resume Builder AI

A comprehensive, AI-powered resume builder that combines professional templates with intelligent ATS analysis. Built with React frontend and FastAPI backend for a complete resume optimization experience.

## 🌟 Features

### Frontend (React + Vite)
- 🎨 **Professional Templates** - Modern, ATS-friendly resume templates
- ✏️ **Intuitive Interface** - Drag-and-drop editing with live preview
- 📄 **Export Options** - PDF download and online sharing
- 📱 **Responsive Design** - Perfect on all devices
- 🚀 **Fast Performance** - Lightning-fast with Vite

### Backend (FastAPI + AI)
- 🤖 **AI-Powered Analysis** - Resume optimization using local Ollama models
- 📊 **ATS Scoring** - Intelligent matching against job descriptions
- 🔍 **Skills Gap Analysis** - Identify missing skills and improvements
- � **Real-time Feedback** - Instant suggestions for resume enhancement
- 🔒 **Privacy-First** - All AI processing happens locally

### Unified Features
- 🔄 **Seamless Integration** - Frontend and backend work together
- 🎯 **Job Matching** - Upload job descriptions for targeted optimization
- 📝 **Smart Suggestions** - AI-generated improvements and keywords
- ⚡ **Live Analysis** - Real-time feedback as you edit

## 🚀 Quick Start

### Prerequisites

- macOS with Homebrew (auto-installed if missing)
- Node.js 16+ (auto-installed)
- Python 3.8+ (auto-installed)
- Git (for cloning)

### One-Command Setup

```bash
# Clone and setup everything
git clone <your-repo-url> resume-builder-ai
cd resume-builder-ai
chmod +x setup-unified.sh
./setup-unified.sh --start
```

### Alternative Setup Methods

#### Method 1: Enhanced Unified Setup (Recommended)

```bash
# Complete setup with both frontend and backend
./setup-unified.sh

# Start all services
make start-all
```

#### Method 2: Step-by-Step Setup

```bash
# 1. Setup frontend
cd apps/web-app
npm install
npm run dev

# 2. Setup backend (in new terminal)
cd apps/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m app.main
```

#### Method 3: Using Makefile Commands

```bash
# Check service status
make status

# Start all services
make start-all

# Stop all services
make stop-all

# Run integration tests
make test-integration
```

If you just need to install system dependencies:

```bash
# Install system requirements with monitoring
make install-system

# This installs: Homebrew, Node.js, Python3, curl, make
```

## 🚨 Enhanced Installation Features

### Real-time Monitoring
- **Progress indicators** with spinners and timestamps
- **Live feedback** every 10 seconds during installation
- **Automatic timeout detection** (5-minute limit per operation)
- **Silent operation protection** (terminates after 2 minutes of no output)

### Failsafe Mechanisms
- **Automatic retry** for failed installations (up to 3 attempts)
- **Alternative installation methods** when primary methods fail
- **Individual package installation** as fallback
- **Process termination** for hung installations

### Comprehensive Logging
- **Detailed logs** in `setup.log` and `monitor.log`
- **Real-time log viewing** with `make monitor-logs`
- **Timestamped entries** for debugging
- **Error tracking** and recovery suggestions

### Troubleshooting Commands

If installation issues occur:

```bash
# Force clean and restart everything
make force-clean
make troubleshoot

# Monitor live installation progress
make monitor-logs

# Check installation logs
cat setup.log
cat monitor.log
```

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Available Scripts

### npm scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint on the source code
- `npm run format` - Format code with Prettier

### Makefile commands

- `make help` - Show all available commands
- `make setup` - Run initial project setup and install dependencies
- `make install` - Install/update dependencies
- `make clean` - Clean build artifacts and node_modules
- `make build` - Build the project for production
- `make run-dev` - Start the development server
- `make run-prod` - Start the production server (after build)
- `make lint` - Run ESLint on the source code
- `make format` - Format code with Prettier
- `make test` - Run tests (when implemented)
- `make deploy` - Deploy to production (when configured)

## Project Structure

```
resume-builder/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── styles/           # CSS styles
│   ├── App.jsx           # Main App component
│   └── index.js          # Application entry point
├── docs/                 # Documentation
├── setup.sh              # Setup script
├── Makefile              # Make commands
├── vite.config.js        # Vite configuration
├── package.json          # Node.js dependencies and scripts
└── README.md             # This file
```

## Development

### Starting Development

After setup, start the development server:

```bash
npm run dev
# or
make run-dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

To build the project for production:

```bash
npm run build
# or
make build
```

The built files will be in the `dist/` directory.

### Code Formatting and Linting

Format your code:

```bash
npm run format
# or
make format
```

Run the linter:

```bash
npm run lint
# or
make lint
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Technologies Used

- **React** - Frontend framework
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Roadmap

- [ ] Template gallery with multiple design options
- [ ] Drag-and-drop resume builder interface
- [ ] PDF export functionality
- [ ] Online resume sharing
- [ ] Real-time collaboration
- [ ] Resume analytics and tips
- [ ] Integration with job boards
- [ ] Mobile app versions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please [open an issue](../../issues) on GitHub.

---

**Happy resume building! 🎉**

## 🏗️ Architecture

The Resume Builder AI uses a modern microservices architecture:

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│                 │◄───────────────►│                 │
│   React Frontend│                 │  FastAPI Backend│
│   (Port 3000+)  │                 │   (Port 8000)   │
│                 │                 │                 │
└─────────────────┘                 └─────────────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │                 │
                                    │  Ollama AI      │
                                    │  (Local Models) │
                                    │                 │
                                    └─────────────────┘
```

### Components

- **Frontend**: React + Vite + TailwindCSS + Radix UI
- **Backend**: FastAPI + SQLAlchemy + Pydantic
- **AI Engine**: Ollama (local LLM models)
- **Database**: SQLite (development) / PostgreSQL (production)
- **API Documentation**: Swagger/OpenAPI

## 🌐 Service URLs

Once running, access these services:

- **Frontend**: http://localhost:3000+ (exact port shown in terminal)
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/docs
- **Health Check**: http://localhost:8000/ping

## 🧪 Testing

### Automated Integration Tests

```bash
# Run comprehensive integration tests
./test-integration.sh

# Check all services are running
make status
```

### Manual Testing Steps

1. Open frontend in browser: http://localhost:3000+
2. Navigate to the AI Dashboard
3. Upload a sample resume file
4. Enter a job description
5. Click "Analyze Resume" to test AI integration
6. Verify real-time feedback and suggestions

## 🚀 GitHub Repository

This project is available on GitHub: [goksnair/resume-builder-ai](https://github.com/goksnair/resume-builder-ai)

### Quick Clone and Setup

```bash
# Clone the repository
git clone https://github.com/goksnair/resume-builder-ai.git
cd resume-builder-ai

# Run unified setup
chmod +x setup-unified.sh
./setup-unified.sh --start
```

### Development Workflow

```bash
# Check status
make status

# Start all services
make start-all

# Run tests
./test-integration.sh

# Stop services
make stop-all
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `./test-integration.sh`
5. Commit changes: `git commit -am 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Create a Pull Request

## 📞 Support

For issues and questions:
- Create an issue on [GitHub Issues](https://github.com/goksnair/resume-builder-ai/issues)
- Check the [documentation](https://github.com/goksnair/resume-builder-ai/wiki)

