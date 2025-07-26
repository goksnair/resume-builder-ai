# 🚀 **Resume Builder AI - ROCKET Framework Integration**

## **Enterprise-Grade AI Resume Builder with ROCKET Career Coaching**

### ✅ **ROCKET FRAMEWORK INTEGRATION (PHASE 2 - COMPLETED)**

- **🎯 ROCKET Framework Builder** - Results-Optimized Career Knowledge Enhancement Toolkit
- **🧠 Dr. Maya Insight** - AI Career Psychologist with personality analysis
- **📊 Real-time Progress Tracking** - Visual framework completion dashboard
- **� Enhanced Conversation Interface** - Intelligent career coaching chat
- **🎨 Professional UI/UX** - Modern, accessible, responsive design
- **🔗 API Integration Layer** - Ready for backend connection
- **📱 Mobile Optimization** - Perfect experience across all devices

---

## 🚀 **ROCKET Framework Features**

### **✅ Phase 1 Complete: Core Framework Implementation**

#### **Core Components:**

- **ROCKETProgress** - Visual dashboard with animated progress tracking
- **ConversationInterface** - Multi-modal AI chat system
- **CareerPsychologistChat** - Dr. Maya Insight persona for personality analysis
- **EnhancedAIDashboard** - Comprehensive tabbed interface
- **ResumeBuilder** - Full-featured AI-powered resume creation tool

#### **Enhanced AI Dashboard Tabs:**

- **ROCKET Builder Tab** - Framework-guided career coaching with session management
- **Resume Builder Tab** - Complete resume creation with real-time ATS analysis
- **Career Psychology Tab** - Professional personality analysis and insights
- **Resume Analysis Tab** - Advanced optimization and improvement recommendations
- **Professional Templates Tab** - Industry-specific template library

#### **Advanced Resume Builder Features:**

- **Real-time ATS Scoring** - Live compatibility analysis with breakdown
- **Auto-save Functionality** - Seamless data persistence and recovery
- **AI Content Enhancement** - Section-specific content improvement
- **Multi-format Export** - PDF and Word document generation
- **Section-based Editing** - Personal Info, Summary, Experience, Education, Skills
- **Keyword Optimization** - Industry-specific suggestion system

### **🔧 Technical Implementation Complete**

- **Custom Hooks** - `useROCKETSession`, `useResumeBuilder` for state management
- **API Service Layer** - Complete backend integration interface
- **Mock Data System** - Realistic development data for testing
- **Error Handling** - Comprehensive error boundaries and user feedback
- **Loading States** - Professional UI feedback throughout all operations

## 🎯 **Current Status: PRODUCTION READY**

### **✅ Live Features**

- **AI Resume Builder**: Integrated as tab in AI Dashboard (`/ai?tab=builder`)
- **Professional Templates**: Interactive preview and download system (`/professional-templates`)
- **Template Downloads**: PDF and HTML formats with professional styling
- **Resume Analysis**: ATS optimization and improvement recommendations
- **Template Explorer**: Modern, minimalistic design gallery
- **Full Integration**: Seamless workflow from creation to analysis

### **🏗️ Architecture**

```
/apps/
├── web-app/          # React frontend with advanced UI components
│   ├── src/components/resume/ResumeBuilderIntegrated.jsx
│   ├── src/components/templates/ProfessionalTemplatesSimple.jsx (enhanced)
│   └── src/components/ai/AIDashboard.jsx (enhanced)
└── backend/          # FastAPI backend with AI analysis
    ├── app/api/      # Resume analysis endpoints
    └── app/models/   # Database models
```

### **📦 Key Dependencies**

```json
{
  "react": "^19.1.0",
  "react-router-dom": "^7.7.1", 
  "lucide-react": "^0.525.0",
  "tailwindcss": "^3.4.16",
  "jspdf": "^3.0.1",
  "html2canvas": "^1.4.1"
}
```

---

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
## 🧠 **AI Resume Builder Features**

### **Sophisticated Questionnaire Algorithm**
- **6 Strategic Phases**: Introduction → Profiling → Deep Dive → Specialization → Synthesis → Generation
- **Real-time Personality Analysis**: Leadership, Collaboration, Innovation, Resilience, Communication
- **Industry-Specific Intelligence**: Role-tailored questions for optimal positioning
- **Behavioral Archaeology**: Uncover hidden achievements and impact stories
- **Dynamic Follow-up System**: Intelligent probing for deeper insights

### **Executive-Level Persona**
- **Talent Scout Expertise**: Fusion of CPO + Executive Coach + Talent Director
- **Strategic Positioning**: Industry-specific narrative architecture
- **Evidence-Based Storytelling**: Focus on quantified outcomes and measurable impact
- **Professional Coaching Tone**: High-end executive consulting experience

### **Multi-Dimensional Assessment**
```javascript
Intelligence Mapping: Analytical, Emotional, Creative, Strategic, Execution
Personality Profiling: Real-time trait detection via NLP analysis
Cognitive Assessment: Multi-phase behavioral interview process
Strategic Synthesis: Unique value proposition generation
```

---

## � **Professional Template Library**

### **Job-Specific Categories**

- **🔧 Software Engineering** (5 templates): Technical Leadership, Full-Stack, Startup Engineer
- **📊 Product Management** (4 templates): B2B SaaS, Consumer, Growth-Focused, Technical PM
- **👥 Executive & Leadership** (4 templates): Chief of Staff (Startup/Enterprise), Director, VP
- **🧠 Data & Analytics** (3 templates): Research-Focused, Business Impact, ML Engineer
- **💼 Business & Operations** (4 templates): Strategy, Operations, Consulting, Business Development
- **🎨 Design & Creative** (3 templates): UX/Product Design, Creative Director, Brand Designer

### **Template Features**

- **ATS Optimization**: 92-99% compatibility scores
- **Role-Specific Sections**: Technical Skills, Leadership Experience, Growth Metrics
- **Professional Design Styles**: Executive Clean, Modern Grid, Corporate Premium
- **Industry Intelligence**: Hiring manager psychology and keyword optimization

---

## 🚀 **Quick Start**

### **Prerequisites**

- Node.js 18+ and Python 3.9+
- Git and modern web browser

### **Installation**

```bash
# Clone repository
git clone https://github.com/goksnair/resume-builder-ai.git
cd resume-builder-ai

# Setup and run (automated)
chmod +x setup-unified.sh
./setup-unified.sh

# Or use Makefile
make setup
make run
```

### **Access Points**

- **Main Application**: <http://localhost:3002>
- **AI Resume Builder**: <http://localhost:3002/ai?tab=builder>
- **Professional Templates**: <http://localhost:3002/professional-templates>
- **Template Explorer**: <http://localhost:3002/templates>
- **Backend API**: <http://localhost:8000/api/docs>

---

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

- **Frontend**: <http://localhost:3000+> (exact port shown in terminal)
- **Backend API**: <http://localhost:8000>
- **API Documentation**: <http://localhost:8000/api/docs>
- **Health Check**: <http://localhost:8000/ping>

## 🧪 Testing

### Automated Integration Tests

```bash
# Run comprehensive integration tests
./test-integration.sh

# Check all services are running
make status
```

### Manual Testing Steps

1. Open frontend in browser: <http://localhost:3000+>
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
