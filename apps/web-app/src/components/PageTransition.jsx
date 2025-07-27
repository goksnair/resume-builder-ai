import React, { useState, useEffect } from 'react';

const PageTransition = ({ 
  children, 
  currentPage, 
  isTransitioning, 
  onTransitionComplete 
}) => {
  const [displayedPage, setDisplayedPage] = useState(currentPage);
  const [animationState, setAnimationState] = useState('idle'); // idle, exiting, entering

  useEffect(() => {
    if (isTransitioning) {
      // Start exit animation
      setAnimationState('exiting');
      
      const exitTimer = setTimeout(() => {
        // Update the page content
        setDisplayedPage(currentPage);
        setAnimationState('entering');
        
        const enterTimer = setTimeout(() => {
          setAnimationState('idle');
          onTransitionComplete && onTransitionComplete();
        }, 300);

        return () => clearTimeout(enterTimer);
      }, 300);

      return () => clearTimeout(exitTimer);
    }
  }, [isTransitioning, currentPage, onTransitionComplete]);

  const getTransitionStyles = () => {
    const baseStyles = {
      transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    };

    switch (animationState) {
      case 'exiting':
        return {
          ...baseStyles,
          opacity: 0,
          transform: 'translateY(20px) scale(0.98)',
          filter: 'blur(4px)'
        };
      case 'entering':
        return {
          ...baseStyles,
          opacity: 0,
          transform: 'translateY(-20px) scale(1.02)',
          filter: 'blur(4px)'
        };
      case 'idle':
      default:
        return {
          ...baseStyles,
          opacity: 1,
          transform: 'translateY(0) scale(1)',
          filter: 'blur(0px)'
        };
    }
  };

  return (
    <div 
      style={getTransitionStyles()}
      className="w-full min-h-screen"
    >
      {children}
    </div>
  );
};

// Enhanced Page Container with micro-interactions
const EnhancedPageContainer = ({ 
  children, 
  pageId, 
  title, 
  description,
  className = '',
  showBackButton = false,
  onBack
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredElements, setHoveredElements] = useState(new Set());

  useEffect(() => {
    // Stagger the entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleMouseEnter = (elementId) => {
    setHoveredElements(prev => new Set([...prev, elementId]));
  };

  const handleMouseLeave = (elementId) => {
    setHoveredElements(prev => {
      const newSet = new Set(prev);
      newSet.delete(elementId);
      return newSet;
    });
  };

  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles specific to each page */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/5 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Page Header */}
      <div className={`transition-all duration-700 delay-100 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {(title || showBackButton) && (
          <div className="flex items-center justify-between mb-8">
            <div>
              {title && (
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-white/70 text-lg">
                  {description}
                </p>
              )}
            </div>
            
            {showBackButton && (
              <button
                onClick={onBack}
                onMouseEnter={() => handleMouseEnter('back-button')}
                onMouseLeave={() => handleMouseLeave('back-button')}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 text-white/80 hover:text-white backdrop-blur-sm border border-white/10 hover:border-white/30"
                style={{
                  transform: hoveredElements.has('back-button') ? 'translateX(-4px)' : 'translateX(0)',
                }}
              >
                <span>←</span>
                <span>Back</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Page Content with staggered animation */}
      <div className={`transition-all duration-700 delay-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}>
        {children}
      </div>

      {/* Page-specific floating action button */}
      <div className={`fixed bottom-8 right-8 transition-all duration-700 delay-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-16'
      }`}>
        <div className="group">
          <button
            onMouseEnter={() => handleMouseEnter('fab')}
            onMouseLeave={() => handleMouseLeave('fab')}
            className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
            style={{
              transform: hoveredElements.has('fab') 
                ? 'translateY(-2px) scale(1.1)' 
                : 'translateY(0) scale(1)',
            }}
          >
            <span className="text-xl">💡</span>
          </button>
          
          {/* Tooltip */}
          <div className={`absolute bottom-16 right-0 bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
            hoveredElements.has('fab') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            Need help?
          </div>
        </div>
      </div>

      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

// Loading transition component
const LoadingTransition = ({ isVisible, message = "Loading..." }) => {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20">
        <div className="w-12 h-12 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white font-medium">{message}</p>
      </div>
    </div>
  );
};

// Micro-interaction components
const InteractiveCard = ({ 
  children, 
  className = '', 
  onClick,
  hoverEffect = 'lift',
  disabled = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const getHoverStyles = () => {
    if (disabled) return {};
    
    const baseTransition = 'transition-all duration-300 ease-out';
    
    switch (hoverEffect) {
      case 'lift':
        return {
          transform: isPressed 
            ? 'translateY(1px) scale(0.98)' 
            : isHovered 
              ? 'translateY(-4px) scale(1.02)' 
              : 'translateY(0) scale(1)',
          boxShadow: isHovered 
            ? '0 20px 40px rgba(0,0,0,0.3)' 
            : '0 4px 20px rgba(0,0,0,0.1)'
        };
      case 'glow':
        return {
          transform: isPressed ? 'scale(0.98)' : isHovered ? 'scale(1.02)' : 'scale(1)',
          filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
          boxShadow: isHovered 
            ? '0 0 30px rgba(59, 130, 246, 0.4)' 
            : '0 4px 20px rgba(0,0,0,0.1)'
        };
      case 'scale':
        return {
          transform: isPressed ? 'scale(0.95)' : isHovered ? 'scale(1.05)' : 'scale(1)'
        };
      default:
        return {};
    }
  };

  return (
    <div
      className={`${baseTransition} ${className} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      style={getHoverStyles()}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => !disabled && setIsHovered(false)}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => !disabled && setIsPressed(false)}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </div>
  );
};

export { 
  PageTransition, 
  EnhancedPageContainer, 
  LoadingTransition, 
  InteractiveCard 
};