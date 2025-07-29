# 🤖 CLAUDE AGENT ORCHESTRATION SYSTEM
## Resume Builder AI - Autonomous Development Configuration

This repository uses an autonomous multi-agent development system powered by Claude Code. All agents work collaboratively to develop features continuously without manual intervention.

---

## 🏗️ **AGENT SYSTEM ARCHITECTURE**

### **Active Agents**
- **Master Orchestrator**: Task coordination, context management, auto-restart handling
- **UI/UX Agent**: React development, Enhanced UI v2.0, theme system, performance optimization
- **Backend Agent**: FastAPI endpoints, database management, AI service integration
- **QA Agent**: Testing, validation, code quality, integration testing
- **DevOps Agent**: Deployment, CI/CD, infrastructure, production monitoring

### **Autonomous Operation Protocols**
- **Usage Reset Auto-Restart**: System automatically restarts at Claude usage resets (3:30 PM IST)
- **Context Preservation**: All agent states and task queues preserved across resets
- **Independent Task Execution**: Agents work on non-dependent tasks when others are blocked
- **Special Privileges**: Auto-approval for mundane tasks, user confirmation only for critical security decisions

---

## 🎯 **CURRENT PROJECT STATUS**

### **Phase 2: Enhanced UI v2.0 + Analytics (85% Complete)**
**✅ COMPLETED FEATURES:**
- EnhancedNavigation with glass morphism effects
- ThemeSettings with 6 professional themes  
- AdvancedAnalyticsDashboard with Chart.js integration
- ThemeContext with localStorage persistence
- Performance optimization utilities (60fps targeting)
- Build system ready (859KB production build)

**🔄 IN PROGRESS:**
- ExportManager component for resume export functionality
- DashboardCustomization for analytics personalization
- Production deployment of fixed Phase 2 features

**📋 PENDING:**
- Phase 3: Advanced AI Features
- Phase 4: Enterprise Features

---

## 🛠️ **DEVELOPMENT STANDARDS**

### **Code Quality Requirements**
- **TypeScript**: Full type safety, no `any` types
- **Testing**: 90%+ test coverage for new code
- **Performance**: 60fps animations, Lighthouse score >90
- **Accessibility**: WCAG 2.1 AA compliance
- **Security**: No secrets in code, dependency scanning

### **React Development Patterns**
- **React 19.1.0** with modern hooks and patterns
- **Component Architecture**: Reusable, composable components
- **State Management**: React Context for global state, local state for components
- **Styling**: Enhanced UI v2.0 with glass morphism, responsive design
- **Performance**: Hardware acceleration, lazy loading, code splitting

### **API Development Standards**
- **FastAPI** with async/await patterns
- **Database**: SQLAlchemy with PostgreSQL
- **Authentication**: Secure session management
- **Validation**: Pydantic models for request/response validation
- **Error Handling**: Comprehensive error responses with proper HTTP status codes

---

## ⚡ **AUTONOMOUS OPERATION CONFIGURATION**

### **Auto-Restart System**
```bash
# Start autonomous system
./scripts/start-autonomous-system.sh

# Monitor usage and handle resets (every 5 hours)
./scripts/usage-monitor.sh start
```

**Reset Cycle Configuration:**
- **Frequency**: Every 5 hours (not fixed time)
- **Detection**: Automatic detection of usage resets
- **Examples**: If last reset was 10:30 PM IST, next reset at 3:30 AM IST
- **Auto-Restart**: System automatically restarts within 1 minute of reset
- **Context Preservation**: All agent states and tasks preserved across resets

### **Agent Memory System**
- **Shared Context**: `agent-memory/shared-context.json`
- **Agent States**: `agent-memory/agent-states/`
- **Task Queues**: `agent-memory/task-queues/`
- **Context Snapshots**: `agent-memory/context-snapshots/`

### **Task Distribution Protocol**
- **High Priority**: Security fixes, production issues, critical bugs
- **Medium Priority**: New features, performance improvements, testing
- **Low Priority**: Documentation, refactoring, minor enhancements

---

## 🚀 **DEPLOYMENT CONFIGURATION**

### **Production URLs**
- **Frontend**: https://tranquil-frangipane-ceffd4.netlify.app
- **Backend**: https://resume-builder-ai-production.up.railway.app
- **Repository**: https://github.com/goksnair/resume-builder-ai.git

### **Build & Deployment**
- **Frontend Build**: `apps/web-app/dist/` (859KB ready for deployment)
- **Backend**: FastAPI with full feature set ready for Railway deployment
- **Environment**: Production environment variables configured

### **Quality Gates**
- [ ] All tests passing
- [ ] Build successful (<1MB bundle size)
- [ ] No console errors or warnings
- [ ] Performance metrics meet requirements
- [ ] Security scans pass

---

## 🎨 **ENHANCED UI v2.0 SPECIFICATIONS**

### **Theme System (6 Professional Themes)**
- Modern Blue, Elegant Purple, Warm Orange, Fresh Green, Deep Navy, Classic Gray
- Glass morphism effects with 5 intensity levels
- Dark mode support with automatic system detection
- Smooth theme transitions with hardware acceleration

### **Performance Optimization**
- **Target**: 60fps animations consistently
- **Hardware Acceleration**: GPU-accelerated transforms
- **Bundle Optimization**: Code splitting, lazy loading
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1

### **Accessibility Standards**
- **WCAG 2.1 AA** compliance mandatory
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Color Contrast**: 4.5:1 minimum ratio

---

## 📊 **ANALYTICS DASHBOARD FEATURES**

### **Data Visualization**
- **Chart.js Integration**: Interactive charts and graphs
- **Real-time Updates**: Live data refresh capabilities
- **Export Options**: PDF, PNG, CSV export formats
- **Customization**: User-configurable dashboard layouts

### **Analytics API**
- **Mock Data Service**: `services/analyticsAPI.js`
- **Backend Integration**: Ready for real analytics data
- **Performance Metrics**: Response time tracking
- **Error Handling**: Graceful error states and retry logic

---

## 🔐 **SECURITY PROTOCOLS**

### **Development Security**
- **No Secrets**: Never commit API keys, passwords, or sensitive data
- **Dependency Scanning**: Regular security audits of npm packages
- **Input Validation**: All user inputs validated and sanitized
- **HTTPS Only**: All production traffic over HTTPS

### **Production Security**
- **Environment Variables**: Secure configuration management
- **CORS Policy**: Restricted cross-origin requests
- **Rate Limiting**: API rate limiting implemented
- **Security Headers**: Comprehensive security headers

---

## 💡 **AGENT BEHAVIOR GUIDELINES**

### **Autonomous Decision Making**
**✅ PROCEED WITHOUT CONFIRMATION:**
- Code formatting and linting fixes
- Dependency updates and security patches
- Performance optimizations within established patterns
- Test case additions and improvements
- Documentation updates and improvements
- Bug fixes for non-critical issues

**⚠️ WAIT FOR USER CONFIRMATION:**
- Major architectural changes
- New feature specifications
- Security-sensitive modifications
- Database schema changes
- External service integrations
- Production deployment of major changes

### **Error Recovery Protocols**
- **Automatic Retry**: 3 attempts for transient failures
- **Rollback Mechanism**: Automatic rollback for failed deployments
- **Alternative Approaches**: Try different methods when primary fails
- **Context Preservation**: Maintain context during error states
- **Escalation**: Alert user only for critical system issues

### **Quality Assurance**
- **Continuous Testing**: Run tests before any deployment
- **Performance Monitoring**: Track metrics and respond to degradation
- **Code Review**: Multi-agent validation of changes
- **Integration Testing**: Ensure components work together
- **User Experience**: Maintain smooth, intuitive user interactions

---

## 🔄 **CONTEXT MANAGEMENT**

### **Memory Preservation**
- **Cross-Session**: Important context preserved across Claude sessions
- **Agent Coordination**: Shared knowledge between specialized agents
- **Task Continuity**: Task queues maintained during interruptions
- **Progress Tracking**: Development progress tracked and resumed

### **Auto-Compact Strategy**
- **Trigger**: When context window approaches 90% capacity
- **Preserve**: Critical project information, current task states, recent changes
- **Summarize**: Historical conversations, completed tasks, resolved issues
- **Maintain**: Agent capabilities, project structure, quality requirements

---

## ✅ **SUCCESS METRICS**

### **Operational Metrics**
- **Uptime**: 99.9% autonomous operation without manual intervention
- **Response Time**: <30 seconds for task assignment and coordination
- **Context Preservation**: 100% context retention across usage resets
- **Task Completion**: 95% automated task completion rate

### **Development Metrics**
- **Code Quality**: Zero critical issues in production deployments
- **Test Coverage**: >90% test coverage maintained automatically
- **Performance**: All performance targets met consistently
- **Security**: Zero security vulnerabilities in production

### **User Experience Metrics**
- **Load Time**: <2 seconds initial page load
- **Animation Performance**: Consistent 60fps across all interactions
- **Accessibility**: 100% WCAG 2.1 AA compliance
- **Mobile Experience**: Seamless responsive design across all devices

---

**🎯 CURRENT FOCUS**: Complete Phase 2 deployment and remaining features (ExportManager, DashboardCustomization) while maintaining autonomous development workflow and preparing for Phase 3 advanced AI features.