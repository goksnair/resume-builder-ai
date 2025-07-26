import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TemplateProvider } from './contexts/TemplateContextStable';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import AIDashboard from './components/ai/AIDashboard';
import EnhancedAIDashboard from './components/rocket/EnhancedAIDashboard';
import TemplateExplorerPage from './components/ui/TemplateExplorer';
import ProfessionalTemplates from './components/templates/ProfessionalTemplatesStable';
import Navigation from './components/ui/Navigation';
import Breadcrumb from './components/ui/Breadcrumb';
import Footer from './components/ui/Footer';
import QuickActions from './components/ui/QuickActions';
import TemplateStatus from './components/ui/TemplateStatus';
import './styles/App.css';
import './styles/template-global.css';

function App() {
  return (
    <ErrorBoundary>
      <TemplateProvider>
        <Router>
          <div className="App min-h-screen flex flex-col">
            <Navigation />
            <Breadcrumb />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/ai" element={<EnhancedAIDashboard />} />
                <Route path="/ai-legacy" element={<AIDashboard />} />
                <Route path="/professional-templates" element={<ProfessionalTemplates />} />
                {/* Redirect resume builder routes to AI dashboard */}
                <Route path="/builder" element={<Navigate to="/ai?tab=builder" replace />} />
                <Route path="/resume-builder" element={<Navigate to="/ai?tab=builder" replace />} />
                {/* Admin routes - removed from user-facing navigation */}
                <Route path="/admin/template-explorer" element={<TemplateExplorerPage />} />
                <Route path="/admin/templates" element={<TemplateExplorerPage />} />
              </Routes>
            </main>
            <Footer />
            <QuickActions />
            <TemplateStatus />
          </div>
        </Router>
      </TemplateProvider>
    </ErrorBoundary>
  );
}

export default App;
