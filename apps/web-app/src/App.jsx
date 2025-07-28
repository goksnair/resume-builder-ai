import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { TemplateProvider } from './contexts/TemplateContextStable';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import AIDashboard from './components/ai/AIDashboard';
import EnhancedAIDashboard from './components/rocket/EnhancedAIDashboard';
import TemplateExplorerPage from './components/ui/TemplateExplorer';
import ProfessionalTemplates from './components/templates/ProfessionalTemplatesStable';
import { EnhancedNavigation, EnhancedBreadcrumb } from './components/ui/EnhancedNavigation';
import Footer from './components/ui/Footer';
import QuickActions from './components/ui/QuickActions';
import TemplateStatus from './components/ui/TemplateStatus';
import PageTransition from './components/ui/PageTransition';
import { SkipToContent, KeyboardNavigationProvider } from './components/ui/AccessibilityEnhancements';
import { FloatingActionButton } from './components/ui/InteractiveElements';
import ThemeSettings from './components/ui/ThemeSettings';
import { AccessibilityPanel } from './components/ui/AccessibilityEnhancements';
import { initializePerformanceOptimizations, cleanupPerformanceOptimizations } from './utils/performance';
import { Settings, Accessibility } from 'lucide-react';
import './styles/App.css';
import './styles/template-global.css';

// Enhanced Layout wrapper component with v2.0 features
function AppLayout({ children }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [themeSettingsOpen, setThemeSettingsOpen] = useState(false);
  const [accessibilityPanelOpen, setAccessibilityPanelOpen] = useState(false);

  if (isHomePage) {
    // Home page has its own full-screen layout with enhanced features
    return (
      <div className="min-h-screen">
        <SkipToContent />
        <PageTransition variant="scale">
          {children}
        </PageTransition>
        
        {/* Floating Action Buttons for Home Page */}
        <FloatingActionButton
          position="bottom-right"
          onClick={() => setThemeSettingsOpen(true)}
          className="mr-20"
        >
          <Settings className="w-5 h-5" />
        </FloatingActionButton>
        
        <FloatingActionButton
          position="bottom-right"
          onClick={() => setAccessibilityPanelOpen(true)}
        >
          <Accessibility className="w-5 h-5" />
        </FloatingActionButton>

        <ThemeSettings 
          isOpen={themeSettingsOpen} 
          onClose={() => setThemeSettingsOpen(false)} 
        />
        
        <AccessibilityPanel 
          isOpen={accessibilityPanelOpen} 
          onClose={() => setAccessibilityPanelOpen(false)} 
        />
      </div>
    );
  }

  // Enhanced standard layout for other pages
  return (
    <div className="min-h-screen bg-gradient-to-br from-premium-50 to-premium-100">
      <SkipToContent />
      <EnhancedNavigation />
      <EnhancedBreadcrumb />
      
      <main id="main-content" className="container mx-auto px-4 py-8">
        <PageTransition variant="slideUp">
          {children}
        </PageTransition>
      </main>
      
      <Footer />
      <QuickActions />
      <TemplateStatus />
      
      {/* Enhanced Floating Action Buttons */}
      <FloatingActionButton
        position="bottom-right"
        onClick={() => setThemeSettingsOpen(true)}
        className="mr-20"
      >
        <Settings className="w-5 h-5" />
      </FloatingActionButton>
      
      <FloatingActionButton
        position="bottom-right"
        onClick={() => setAccessibilityPanelOpen(true)}
      >
        <Accessibility className="w-5 h-5" />
      </FloatingActionButton>

      <ThemeSettings 
        isOpen={themeSettingsOpen} 
        onClose={() => setThemeSettingsOpen(false)} 
      />
      
      <AccessibilityPanel 
        isOpen={accessibilityPanelOpen} 
        onClose={() => setAccessibilityPanelOpen(false)} 
      />
    </div>
  );
}

function App() {
  // Initialize Enhanced UI v2.0 performance optimizations
  useEffect(() => {
    initializePerformanceOptimizations();
    
    return () => {
      cleanupPerformanceOptimizations();
    };
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TemplateProvider>
          <KeyboardNavigationProvider>
            <Router>
              <AppLayout>
                <AnimatePresence mode="wait">
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
                    
                    {/* Test route for Enhanced UI v2.0 components */}
                    <Route path="/test" element={
                      <div className="p-8 space-y-6">
                        <h1 className="text-3xl font-bold text-premium-900">
                          Enhanced UI v2.0 Test Page
                        </h1>
                        <div className="glass-card-v2 p-6">
                          <p className="text-premium-700">
                            All Enhanced UI v2.0 components are working! ✨
                          </p>
                        </div>
                      </div>
                    } />
                  </Routes>
                </AnimatePresence>
              </AppLayout>
            </Router>
          </KeyboardNavigationProvider>
        </TemplateProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
