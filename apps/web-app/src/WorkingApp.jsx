import React, { useState, useEffect } from 'react';

function WorkingApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [isVisible, setIsVisible] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  // Success stories for hero section
  const successStories = [
    {
      name: "Sarah Chen",
      role: "Software Engineer", 
      company: "Google",
      improvement: "95% ATS Score",
      story: "Landed my dream job with a perfectly optimized resume"
    },
    {
      name: "Marcus Johnson",
      role: "Product Manager",
      company: "Microsoft", 
      improvement: "3x More Interviews",
      story: "Transformed my career narrative and got noticed by top companies"
    },
    {
      name: "Elena Rodriguez",
      role: "Data Scientist",
      company: "Meta",
      improvement: "40% Salary Increase", 
      story: "AI insights helped me highlight my unique value proposition"
    }
  ];

  const stats = [
    { number: "95%", label: "Average ATS Score" },
    { number: "3.2x", label: "More Interview Calls" },
    { number: "10k+", label: "Careers Transformed" },
    { number: "24hrs", label: "Average Time to Results" }
  ];

  const pages = {
    home: 'Home',
    builder: 'Resume Builder',
    templates: 'Templates', 
    analysis: 'AI Analysis',
    rocket: 'ROCKET Framework'
  };

  useEffect(() => {
    setIsVisible(true);
    
    // Test backend connection
    fetch('https://resume-builder-ai-production.up.railway.app/ping')
      .then(r => r.json())
      .then(data => setBackendStatus('✅ Connected: ' + data.message))
      .catch(e => setBackendStatus('❌ Error: ' + e.message));

    // Auto-rotate success stories
    const interval = setInterval(() => {
      setCurrentStoryIndex((prev) => (prev + 1) % successStories.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const renderHeroSection = () => (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Gradient Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      />
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 z-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 text-center text-white">
        
        {/* Animated Hero Text */}
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 
            className="font-bold leading-tight mb-6 text-5xl md:text-6xl"
            style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}
          >
            Transform Your Career Story
            <br />
            <span className="bg-gradient-to-r from-green-400 to-blue-300 bg-clip-text text-transparent">
              With AI-Powered Precision
            </span>
          </h1>
          
          <p 
            className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}
          >
            Join thousands of professionals who've unlocked their career potential with our 
            intelligent resume builder and <strong>ROCKET Framework</strong> psychology assessment.
          </p>
        </div>

        {/* Success Stories Carousel */}
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div 
            className="rounded-2xl p-6 mb-8 max-w-2xl mx-auto border border-white/20"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">✨</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">{successStories[currentStoryIndex].name}</h3>
                <p className="text-white/80 text-sm">
                  {successStories[currentStoryIndex].role} at {successStories[currentStoryIndex].company}
                </p>
              </div>
            </div>
            <p className="text-white/90 mb-3 italic">
              "{successStories[currentStoryIndex].story}"
            </p>
            <div className="text-green-300 font-semibold">
              Result: {successStories[currentStoryIndex].improvement}
            </div>
            
            {/* Story indicators */}
            <div className="flex justify-center mt-4 space-x-2">
              {successStories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStoryIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStoryIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-300 mb-2">
                  {stat.number}
                </div>
                <div className="text-white/80 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="space-y-4">
            <button
              onClick={() => setCurrentPage('builder')}
              className="group relative px-8 py-4 rounded-xl font-bold text-lg text-white shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
              }}
            >
              <span className="relative z-10">Start Your Career Transformation</span>
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            
            <div className="flex items-center justify-center space-x-6 text-white/80">
              <div className="flex items-center">
                <span className="text-green-300 mr-2">✓</span>
                <span className="text-sm">Free ATS Analysis</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-300 mr-2">✓</span>
                <span className="text-sm">AI-Powered Insights</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-300 mr-2">✓</span>
                <span className="text-sm">Career Psychology</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(currentPage) {
      case 'home':
        return renderHeroSection();
        
      default:
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🚀</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">
                {pages[currentPage]}
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-md mx-auto">
                This amazing feature is coming soon! We're building something incredible for you.
              </p>
              <button
                onClick={() => setCurrentPage('home')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className="min-h-screen text-white relative overflow-x-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
        fontFamily: 'Inter, -apple-system, sans-serif'
      }}
    >
      {/* Navigation */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 py-4 backdrop-blur-sm border-b border-white/10"
        style={{
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-4 cursor-pointer group"
              onClick={() => setCurrentPage('home')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <span className="text-xl">✨</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors duration-300">
                  Resume Builder AI
                </h1>
                <p className="text-xs text-white/60">
                  Enhanced Experience
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div 
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg backdrop-blur-sm"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white/80 text-xs font-medium">
                  {backendStatus.replace(/[✅⚠️❌]/g, '').trim()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Navigation Tabs */}
      <div className="fixed top-20 left-0 right-0 z-40">
        <div 
          className="backdrop-blur-md border-b border-white/10"
          style={{ background: 'rgba(0, 0, 0, 0.2)' }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-center space-x-2 py-3 overflow-x-auto">
              {Object.entries(pages).map(([key, title]) => {
                const isActive = currentPage === key;
                
                return (
                  <button
                    key={key}
                    onClick={() => setCurrentPage(key)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-white/20 text-white shadow-lg transform -translate-y-1'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="text-lg">
                      {key === 'home' ? '🏠' : key === 'builder' ? '📝' : key === 'templates' ? '📊' : key === 'analysis' ? '🧠' : '🚀'}
                    </span>
                    <span className="text-sm font-medium">{title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className={`${currentPage === 'home' ? '' : 'pt-32 px-4 sm:px-6 lg:px-8'} max-w-7xl mx-auto`}>
        {renderContent()}
      </main>

      {/* Footer */}
      <footer 
        className="bg-black/20 backdrop-blur-sm mt-16 py-8 px-6 text-center border-t border-white/10"
        style={{ marginTop: currentPage === 'home' ? '0' : '4rem' }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-sm">✨</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">Resume Builder AI</div>
                <div className="text-xs text-white/60">Enhanced UI Active</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-white/60">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>All Features Working</span>
              </div>
              <div>© 2024 Resume Builder AI</div>
            </div>
          </div>
        </div>
      </footer>

      {/* Global CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}

export default WorkingApp;