import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@radix-ui/react-progress';
import { Loader2, Circle, Square, Triangle } from 'lucide-react';

// Glass morphism skeleton loader
export const SkeletonGlass = ({ className = '', height = 'h-4', width = 'w-full' }) => {
  return (
    <div className={`skeleton-glass ${height} ${width} ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};

// Card skeleton with glass effect
export const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={`glass-card-v2 p-6 space-y-4 ${className}`}>
      <div className="flex items-center space-x-4">
        <SkeletonGlass className="rounded-full" height="h-12" width="w-12" />
        <div className="space-y-2 flex-1">
          <SkeletonGlass height="h-4" width="w-3/4" />
          <SkeletonGlass height="h-3" width="w-1/2" />
        </div>
      </div>
      <div className="space-y-3">
        <SkeletonGlass height="h-3" width="w-full" />
        <SkeletonGlass height="h-3" width="w-5/6" />
        <SkeletonGlass height="h-3" width="w-4/6" />
      </div>
      <div className="flex space-x-2">
        <SkeletonGlass height="h-8" width="w-20" className="rounded-lg" />
        <SkeletonGlass height="h-8" width="w-24" className="rounded-lg" />
      </div>
    </div>
  );
};

// Advanced progress bar with glass effect
export const ProgressGlass = ({ 
  value = 0, 
  max = 100, 
  className = '',
  showPercentage = true,
  animated = true,
}) => {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <div className={`space-y-2 ${className}`}>
      {showPercentage && (
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress</span>
          <motion.span
            key={percentage}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {percentage}%
          </motion.span>
        </div>
      )}
      <div className="progress-glass">
        <motion.div
          className="progress-glass-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: animated ? 0.8 : 0,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      </div>
    </div>
  );
};

// Animated spinner variations
export const SpinnerGlass = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <motion.div
        className={`glass-button rounded-full ${sizeClasses[size]} flex items-center justify-center`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <Loader2 className="w-3/4 h-3/4 text-blue-500" />
      </motion.div>
    </div>
  );
};

// Geometric loading animation
export const GeometricLoader = ({ className = '' }) => {
  const shapes = [
    { Icon: Circle, delay: 0 },
    { Icon: Square, delay: 0.2 },
    { Icon: Triangle, delay: 0.4 },
  ];

  return (
    <div className={`flex space-x-2 items-center ${className}`}>
      {shapes.map(({ Icon, delay }, index) => (
        <motion.div
          key={index}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay,
            ease: 'easeInOut',
          }}
          className="glass-button p-2 rounded-lg"
        >
          <Icon className="w-4 h-4 text-blue-500" />
        </motion.div>
      ))}
    </div>
  );
};

// Dot pulse loader
export const DotPulseLoader = ({ className = '', dotCount = 3 }) => {
  return (
    <div className={`flex space-x-1 items-center ${className}`}>
      {Array.from({ length: dotCount }).map((_, index) => (
        <motion.div
          key={index}
          className="w-2 h-2 bg-blue-500 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// Loading overlay with glass effect
export const LoadingOverlay = ({ 
  isVisible = false, 
  message = 'Loading...', 
  className = '',
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
      style={{
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="glass-card-v2 p-8 max-w-sm mx-4 text-center"
      >
        <div className="mb-4">
          <SpinnerGlass size="lg" />
        </div>
        <p className="text-gray-700 font-medium">{message}</p>
      </motion.div>
    </motion.div>
  );
};

// Step progress indicator
export const StepProgress = ({ 
  steps = [], 
  currentStep = 0, 
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id || index}>
          <div className="flex flex-col items-center space-y-2">
            <motion.div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                ${index <= currentStep
                  ? 'bg-blue-500 text-white'
                  : 'glass-button text-gray-500'
                }
              `}
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: index === currentStep ? 1.1 : 1,
                transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
              }}
            >
              {index < currentStep ? (
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              ) : (
                index + 1
              )}
            </motion.div>
            <span className={`text-xs font-medium ${
              index <= currentStep ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {step.label}
            </span>
          </div>
          
          {index < steps.length - 1 && (
            <div className="flex-1 h-0.5 mx-4 bg-gray-200 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-blue-500"
                initial={{ scaleX: 0 }}
                animate={{ 
                  scaleX: index < currentStep ? 1 : 0,
                  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
                }}
                style={{ transformOrigin: 'left' }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Shimmer effect for text loading
export const TextShimmer = ({ 
  lines = 3, 
  className = '',
  widths = ['w-full', 'w-3/4', 'w-1/2'],
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonGlass
          key={index}
          height="h-4"
          width={widths[index] || 'w-full'}
          className="rounded"
        />
      ))}
    </div>
  );
};

// Pulsing loader for buttons
export const ButtonLoader = ({ 
  isLoading = false, 
  children, 
  className = '',
  loadingText = 'Loading...',
}) => {
  return (
    <motion.button
      className={`btn-premium relative overflow-hidden ${className}`}
      disabled={isLoading}
      animate={{
        scale: isLoading ? 0.98 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      <motion.span
        animate={{
          opacity: isLoading ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
      
      {isLoading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-2">
            <DotPulseLoader dotCount={3} />
            <span className="text-sm">{loadingText}</span>
          </div>
        </motion.div>
      )}
    </motion.button>
  );
};

export default {
  SkeletonGlass,
  CardSkeleton,
  ProgressGlass,
  SpinnerGlass,
  GeometricLoader,
  DotPulseLoader,
  LoadingOverlay,
  StepProgress,
  TextShimmer,
  ButtonLoader,
};