import React, { useState, useEffect } from 'react';

const EnhancedNavigation = ({
  currentPage,
  onPageChange,
  backendStatus,
  pages
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Progress calculation based on pages completed
  const calculateProgress = () => {
    const pageOrder = ['home', 'builder', 'templates', 'analysis', 'rocket'];
    const currentIndex = pageOrder.indexOf(currentPage);
    const totalSteps = pageOrder.length;
    const completedSteps = Math.max(0, currentIndex);
    return Math.round((completedSteps / (totalSteps - 1)) * 100);
  };

  const progress = calculateProgress();

  // Handle scroll effect for floating navigation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Page icons and descriptions
  const pageConfig = {
    home: { icon: '🏠', description: 'Dashboard', color: '#667eea' },
    builder: { icon: '📝', description: 'Build Resume', color: '#4CAF50' },
    templates: { icon: '📊', description: 'Templates', color: '#9C27B0' },
    analysis: { icon: '🧠', description: 'AI Analysis', color: '#2196F3' },
    rocket: { icon: '🚀', description: 'ROCKET Framework', color: '#E91E63' }
  };

  // Connection status indicator
  const getStatusColor = (status) => {
    if (status.includes('✅')) return '#4CAF50';
    if (status.includes('⚠️')) return '#FF9800';
    if (status.includes('❌')) return '#F44336';
    return '#9E9E9E';
  };

  const getStatusDot = (status) => {
    if (status.includes('✅')) return 'bg-green-400';
    if (status.includes('⚠️')) return 'bg-yellow-400';
    if (status.includes('❌')) return 'bg-red-400';
    return 'bg-gray-400';
  };

  return (
    <>
      {/* Top Navigation Bar - Floating Glass Morphism */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          isScrolled 
            ? 'py-2 backdrop-blur-xl bg-black/20 shadow-2xl' 
            : 'py-4 backdrop-blur-sm bg-black/10'
        }`}
        style={{
          borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.1)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            
            {/* Logo and Brand */}
            <div 
              className="flex items-center space-x-4 cursor-pointer group"
              onClick={() => onPageChange('home')}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <span className="text-xl">✨</span>
                </div>
                {/* Floating connection status dot */}
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusDot(backendStatus)} ring-2 ring-white/20 animate-pulse`} />
              </div>
              
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors duration-300">
                  Resume Builder AI
                </h1>
                <p className="text-xs text-white/60">
                  Powered by Intelligence
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="text-white/80 text-sm font-medium">
                Journey Progress
              </div>
              <div className="relative w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-white/60 text-sm">
                {progress}%
              </div>
            </div>

            {/* Backend Status */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
                <div className={`w-2 h-2 rounded-full ${getStatusDot(backendStatus)} animate-pulse`} />
                <span className="text-white/80 text-xs font-medium">
                  {backendStatus.replace(/[✅⚠️❌]/g, '').trim()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Navigation Tabs - Enhanced Design */}
      <div 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled ? 'mt-16' : 'mt-20'
        }`}
      >
        <div className="backdrop-blur-md bg-black/20 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-center space-x-2 py-3 overflow-x-auto">
              {Object.entries(pages).map(([key, title]) => {
                const config = pageConfig[key];
                const isActive = currentPage === key;
                
                return (
                  <button
                    key={key}
                    onClick={() => onPageChange(key)}
                    onMouseEnter={() => setHoveredItem(key)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`group relative flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    style={{
                      transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                      boxShadow: isActive 
                        ? `0 8px 32px ${config.color}40, 0 4px 16px ${config.color}20`
                        : hoveredItem === key 
                          ? '0 4px 16px rgba(255,255,255,0.1)'
                          : 'none'
                    }}
                  >
                    {/* Background gradient for active state */}
                    {isActive && (
                      <div 
                        className="absolute inset-0 rounded-xl opacity-30"
                        style={{
                          background: `linear-gradient(135deg, ${config.color}40 0%, ${config.color}20 100%)`
                        }}
                      />
                    )}
                    
                    {/* Icon */}
                    <span className="text-lg relative z-10">
                      {config.icon}
                    </span>
                    
                    {/* Title */}
                    <span className="relative z-10 text-sm font-medium">
                      {title}
                    </span>
                    
                    {/* Hover tooltip */}
                    {hoveredItem === key && !isActive && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black/80 text-white text-xs rounded-md whitespace-nowrap">
                        {config.description}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black/80" />
                      </div>
                    )}
                    
                    {/* Active indicator line */}
                    {isActive && (
                      <div 
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 rounded-full"
                        style={{ backgroundColor: config.color }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Progress Indicator */}
      <div className="lg:hidden fixed top-20 left-0 right-0 z-30 bg-black/20 backdrop-blur-sm px-6 py-2">
        <div className="flex items-center justify-center space-x-3">
          <span className="text-white/60 text-xs">Progress:</span>
          <div className="flex-1 max-w-32 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-white/60 text-xs">{progress}%</span>
        </div>
      </div>

      {/* Spacer for fixed navigation */}
      <div className={`${isScrolled ? 'h-28' : 'h-32'} lg:h-28 transition-all duration-500`} />
    </>
  );
};

export default EnhancedNavigation;