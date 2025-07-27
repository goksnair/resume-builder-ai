import React, { useState, useEffect } from 'react';

const ProgressIndicator = ({ currentPage, onStepClick }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Define the user journey steps
  const journeySteps = [
    {
      id: 'home',
      title: 'Welcome',
      description: 'Get started with Resume Builder AI',
      icon: '🏠',
      status: 'completed'
    },
    {
      id: 'builder',
      title: 'Upload & Build',
      description: 'Upload your resume and match with jobs',
      icon: '📝',
      status: 'pending'
    },
    {
      id: 'templates',
      title: 'Choose Template',
      description: 'Select from professional templates',
      icon: '📊',
      status: 'pending'
    },
    {
      id: 'analysis',
      title: 'AI Analysis',
      description: 'Get detailed insights and improvements',
      icon: '🧠',
      status: 'pending'
    },
    {
      id: 'rocket',
      title: 'ROCKET Framework',
      description: 'Complete your career psychology assessment',
      icon: '🚀',
      status: 'pending'
    }
  ];

  // Update step statuses based on current page
  const getUpdatedSteps = () => {
    const stepOrder = ['home', 'builder', 'templates', 'analysis', 'rocket'];
    const currentIndex = stepOrder.indexOf(currentPage);
    
    return journeySteps.map((step, index) => ({
      ...step,
      status: index <= currentIndex ? 'completed' : 
              index === currentIndex + 1 ? 'current' : 'pending'
    }));
  };

  const steps = getUpdatedSteps();
  const currentStepIndex = steps.findIndex(step => step.id === currentPage);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  // Animate progress bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercentage);
    }, 300);

    return () => clearTimeout(timer);
  }, [progressPercentage]);

  const getStepColor = (status) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-green-500',
          text: 'text-green-600',
          border: 'border-green-500',
          ring: 'ring-green-500/30'
        };
      case 'current':
        return {
          bg: 'bg-blue-500',
          text: 'text-blue-600',
          border: 'border-blue-500',
          ring: 'ring-blue-500/30'
        };
      default:
        return {
          bg: 'bg-gray-300',
          text: 'text-gray-400',
          border: 'border-gray-300',
          ring: 'ring-gray-300/20'
        };
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Progress Header */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-white mb-2">
          Your Career Transformation Journey
        </h3>
        <p className="text-white/70 text-sm">
          Complete each step to unlock your career potential
        </p>
        
        {/* Overall Progress Bar */}
        <div className="mt-4 w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 rounded-full transition-all duration-1000 ease-out shadow-lg"
            style={{ 
              width: `${animatedProgress}%`,
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
            }}
          />
        </div>
        
        {/* Progress Text */}
        <div className="mt-2 text-white/60 text-sm">
          Step {currentStepIndex + 1} of {steps.length} • {Math.round(progressPercentage)}% Complete
        </div>
      </div>

      {/* Step Indicators */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-white/20 -z-10" />
        <div 
          className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-green-400 to-blue-400 -z-10 transition-all duration-1000 ease-out"
          style={{ width: `${animatedProgress}%` }}
        />

        {/* Steps */}
        <div className="flex justify-between items-start">
          {steps.map((step, index) => {
            const colors = getStepColor(step.status);
            const isClickable = step.status !== 'pending';
            
            return (
              <div 
                key={step.id}
                className={`flex flex-col items-center space-y-2 ${
                  isClickable ? 'cursor-pointer group' : 'cursor-not-allowed'
                }`}
                onClick={() => isClickable && onStepClick && onStepClick(step.id)}
              >
                {/* Step Circle */}
                <div 
                  className={`relative w-12 h-12 rounded-full border-2 ${colors.border} ${colors.bg} 
                    flex items-center justify-center shadow-lg transition-all duration-300
                    ${isClickable ? 'group-hover:scale-110 group-hover:shadow-xl' : ''}
                    ${step.status === 'current' ? 'ring-4 ' + colors.ring + ' animate-pulse' : ''}
                  `}
                >
                  {step.status === 'completed' ? (
                    <span className="text-white text-lg">✓</span>
                  ) : (
                    <span className="text-lg">{step.icon}</span>
                  )}
                  
                  {/* Glow effect for current step */}
                  {step.status === 'current' && (
                    <div className="absolute inset-0 rounded-full bg-blue-400/30 animate-ping" />
                  )}
                </div>

                {/* Step Info */}
                <div className="text-center max-w-24">
                  <h4 className={`text-sm font-medium ${
                    step.status === 'pending' ? 'text-white/40' : 'text-white'
                  } transition-colors duration-300`}>
                    {step.title}
                  </h4>
                  <p className={`text-xs ${
                    step.status === 'pending' ? 'text-white/30' : 'text-white/60'
                  } mt-1 leading-tight`}>
                    {step.description}
                  </p>
                </div>

                {/* Status Badge */}
                {step.status === 'current' && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-medium animate-bounce">
                      Current
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Journey Stats */}
      <div className="mt-12 grid grid-cols-3 gap-4 text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">
            {steps.filter(s => s.status === 'completed').length}
          </div>
          <div className="text-white/60 text-sm">Steps Completed</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">
            {Math.round(progressPercentage)}%
          </div>
          <div className="text-white/60 text-sm">Journey Progress</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-400">
            {steps.length - steps.filter(s => s.status === 'completed').length}
          </div>
          <div className="text-white/60 text-sm">Steps Remaining</div>
        </div>
      </div>

      {/* Next Step CTA */}
      {currentStepIndex < steps.length - 1 && (
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <h4 className="text-white font-medium mb-2">Ready for the next step?</h4>
            <p className="text-white/70 text-sm mb-3">
              {steps[currentStepIndex + 1]?.description}
            </p>
            <button
              onClick={() => onStepClick && onStepClick(steps[currentStepIndex + 1]?.id)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Continue to {steps[currentStepIndex + 1]?.title}
            </button>
          </div>
        </div>
      )}

      {/* Completion Celebration */}
      {currentStepIndex === steps.length - 1 && (
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-lg p-6 border border-green-500/30">
            <div className="text-4xl mb-2">🎉</div>
            <h4 className="text-green-400 font-bold text-lg mb-2">
              Congratulations!
            </h4>
            <p className="text-white/80 text-sm">
              You've completed your career transformation journey. Your optimized resume is ready to help you land your dream job!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;