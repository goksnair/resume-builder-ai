import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TemplateProvider } from './contexts/TemplateContextStable';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import AIDashboard from './components/ai/AIDashboard';
import EnhancedAIDashboard from './components/rocket/EnhancedAIDashboard';
import TemplateExplorerPage from './components/ui/TemplateExplorer';
import ProfessionalTemplates from './components/templates/ProfessionalTemplatesStable';
import Navigation from './components/ui/Navigation';
import EnhancedNavigation from './components/ui/EnhancedNavigation';
import Breadcrumb from './components/ui/Breadcrumb';
import Footer from './components/ui/Footer';
import QuickActions from './components/ui/QuickActions';
import TemplateStatus from './components/ui/TemplateStatus';
import AdvancedAnalyticsDashboard from './components/analytics/AdvancedAnalyticsDashboard';
import ThemeSettings from './components/ui/ThemeSettings';
import PageTransition from './components/ui/PageTransition';
import './styles/App.css';
import './styles/template-global.css';
import './styles/enhanced-ui-v2.css';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TemplateProvider>
        <Router>
          <div className="App min-h-screen flex flex-col">
            <EnhancedNavigation />
            <Breadcrumb />
            <main className="flex-1">
              <PageTransition>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/ai" element={<EnhancedAIDashboard />} />
                  <Route path="/ai-legacy" element={<AIDashboard />} />
                  <Route path="/analytics" element={<AdvancedAnalyticsDashboard />} />
                  <Route path="/professional-templates" element={<ProfessionalTemplates />} />
                  {/* Redirect resume builder routes to AI dashboard */}
                  <Route path="/builder" element={<Navigate to="/ai?tab=builder" replace />} />
                  <Route path="/resume-builder" element={<Navigate to="/ai?tab=builder" replace />} />
                  {/* Admin routes - removed from user-facing navigation */}
                  <Route path="/admin/template-explorer" element={<TemplateExplorerPage />} />
                  <Route path="/admin/templates" element={<TemplateExplorerPage />} />
                  {/* Test route for debug */}
                  <Route path="/test" element={<div style={{ color: 'green', fontSize: '2rem' }}>Test Route Works!</div>} />
                </Routes>
              </PageTransition>
            </main>
            <Footer />
            <QuickActions />
            <TemplateStatus />
            <ThemeSettings />
          </div>
        </Router>
        </TemplateProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
