import React from 'react';
import EnhancedHeroSection from './components/EnhancedHeroSection';
import EnhancedNavigation from './components/EnhancedNavigation';
import ProgressIndicator from './components/ProgressIndicator';

function TestApp() {
  const [currentPage, setCurrentPage] = React.useState('home');
  const [backendStatus, setBackendStatus] = React.useState('✅ Connected: API Ready');

  const pages = {
    home: 'Home',
    builder: 'Resume Builder', 
    templates: 'Templates',
    analysis: 'AI Analysis',
    rocket: 'ROCKET Framework'
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderContent = () => {
    switch(currentPage) {
      case 'home':
        return (
          <div style={{ marginTop: '-6rem', marginLeft: '-2rem', marginRight: '-2rem' }}>
            <EnhancedHeroSection 
              onGetStarted={() => handlePageChange('builder')}
            />
            
            <div style={{ 
              background: 'rgba(0,0,0,0.2)', 
              padding: '3rem 2rem',
              textAlign: 'center'
            }}>
              <ProgressIndicator 
                currentPage={currentPage}
                onStepClick={handlePageChange}
              />
            </div>
          </div>
        );
      
      default:
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">
                {pages[currentPage]}
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Feature coming soon! This page is under development.
              </p>
              <button
                onClick={() => handlePageChange('home')}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className="min-h-screen text-white font-sans relative overflow-x-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
        fontFamily: 'Inter, -apple-system, sans-serif'
      }}
    >
      <EnhancedNavigation
        currentPage={currentPage}
        onPageChange={handlePageChange}
        backendStatus={backendStatus}
        pages={pages}
      />

      <main className={`${currentPage === 'home' ? 'p-0' : 'px-4 sm:px-6 lg:px-8'} max-w-7xl mx-auto`}>
        {renderContent()}
      </main>

      <footer className="bg-black/20 backdrop-blur-sm mt-16 py-8 px-6 text-center border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-sm">✨</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">Resume Builder AI</div>
                <div className="text-xs text-white/60">Enhanced UI Testing</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-white/60">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>Enhanced Features Active</span>
              </div>
              <div>© 2024 Resume Builder AI</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default TestApp;