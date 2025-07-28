import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFocusRing, useFocusManager } from '@react-aria/focus';
import { useHover, usePress } from '@react-aria/interactions';
import { 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff, 
  Type, 
  Contrast,
  MousePointer,
  Keyboard,
} from 'lucide-react';

// Screen reader announcement component
export const ScreenReaderAnnouncement = ({ message, priority = 'polite' }) => {
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};

// Skip to content link
export const SkipToContent = ({ targetId = 'main-content' }) => {
  return (
    <motion.a
      href={`#${targetId}`}
      className="
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
        z-50 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium
        focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      "
      initial={{ y: -50, opacity: 0 }}
      whileFocus={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      Skip to main content
    </motion.a>
  );
};

// Accessible button with proper ARIA attributes
export const AccessibleButton = ({
  children,
  onClick,
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  ...props
}) => {
  const { focusProps, isFocusVisible } = useFocusRing();
  const { hoverProps, isHovered } = useHover({ isDisabled: disabled });
  const { pressProps, isPressed } = usePress({ 
    onPress: onClick,
    isDisabled: disabled || loading,
  });

  const [announcement, setAnnouncement] = useState('');

  const handleClick = () => {
    if (loading) {
      setAnnouncement('Loading, please wait');
    } else if (onClick) {
      onClick();
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-h-[32px]',
    md: 'px-4 py-2 text-base min-h-[40px]',
    lg: 'px-6 py-3 text-lg min-h-[48px]',
  };

  const variantClasses = {
    primary: 'btn-premium',
    secondary: 'btn-glass',
    ghost: 'glass-button',
  };

  return (
    <>
      <motion.button
        className={`
          ${variantClasses[variant]} ${sizeClasses[size]} ${className}
          font-medium rounded-xl transition-all duration-200 relative
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isFocusVisible ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
          ${isHovered && !disabled ? 'shadow-glow-blue' : ''}
        `}
        disabled={disabled || loading}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-disabled={disabled}
        aria-busy={loading}
        animate={{
          scale: isPressed && !disabled ? 0.95 : 1,
        }}
        transition={{ duration: 0.1 }}
        {...focusProps}
        {...hoverProps}
        {...pressProps}
        {...props}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </motion.button>

      {announcement && (
        <ScreenReaderAnnouncement message={announcement} />
      )}
    </>
  );
};

// Accessible form input with proper labeling
export const AccessibleInput = ({
  label,
  id,
  type = 'text',
  error,
  description,
  required = false,
  className = '',
  ...props
}) => {
  const errorId = error ? `${id}-error` : undefined;
  const descriptionId = description ? `${id}-description` : undefined;
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {description && (
        <p id={descriptionId} className="text-sm text-gray-600">
          {description}
        </p>
      )}

      <motion.input
        id={id}
        type={type}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ')}
        className={`
          w-full px-4 py-2 border rounded-lg transition-all duration-200
          glass-card bg-white/50 backdrop-blur-sm
          ${error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:ring-blue-500'
          }
          ${isFocusVisible ? 'ring-2 ring-offset-2' : ''}
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        animate={{
          scale: isFocusVisible ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
        {...focusProps}
        {...props}
      />

      {error && (
        <motion.p
          id={errorId}
          className="text-sm text-red-600 flex items-center space-x-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          role="alert"
          aria-live="polite"
        >
          <span>⚠</span>
          <span>{error}</span>
        </motion.p>
      )}
    </div>
  );
};

// Accessible modal with focus management
export const AccessibleModal = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  initialFocus,
}) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const focusManager = useFocusManager();

  useEffect(() => {
    if (isOpen) {
      // Trap focus within modal
      const modal = modalRef.current;
      if (modal) {
        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (initialFocus && initialFocus.current) {
          initialFocus.current.focus();
        } else if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose, initialFocus]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
        }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <motion.div
          ref={modalRef}
          className={`glass-card-v2 w-full max-w-lg mx-4 p-6 ${className}`}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 id="modal-title" className="text-xl font-bold text-gray-900">
              {title}
            </h2>
            
            <AccessibleButton
              ref={closeButtonRef}
              onClick={onClose}
              variant="ghost"
              size="sm"
              ariaLabel="Close modal"
              className="p-2"
            >
              ✕
            </AccessibleButton>
          </div>

          <div>{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Keyboard navigation helper
export const KeyboardNavigationProvider = ({ children }) => {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Tab') {
        setIsKeyboardUser(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  useEffect(() => {
    if (isKeyboardUser) {
      document.body.classList.add('keyboard-user');
    } else {
      document.body.classList.remove('keyboard-user');
    }
  }, [isKeyboardUser]);

  return <>{children}</>;
};

// Accessibility settings panel
export const AccessibilityPanel = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNav: true,
  });

  const [announcement, setAnnouncement] = useState('');

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Apply settings
    switch (key) {
      case 'highContrast':
        document.body.classList.toggle('high-contrast', value);
        setAnnouncement(value ? 'High contrast mode enabled' : 'High contrast mode disabled');
        break;
      case 'largeText':
        document.body.classList.toggle('large-text', value);
        setAnnouncement(value ? 'Large text enabled' : 'Large text disabled');
        break;
      case 'reducedMotion':
        document.body.classList.toggle('reduce-motion', value);
        setAnnouncement(value ? 'Reduced motion enabled' : 'Reduced motion disabled');
        break;
      default:
        break;
    }
  };

  const accessibilityOptions = [
    {
      key: 'highContrast',
      label: 'High Contrast',
      description: 'Increase contrast for better visibility',
      icon: Contrast,
    },
    {
      key: 'largeText',
      label: 'Large Text',
      description: 'Increase text size throughout the app',
      icon: Type,
    },
    {
      key: 'reducedMotion',
      label: 'Reduced Motion',
      description: 'Minimize animations and transitions',
      icon: Eye,
    },
    {
      key: 'screenReader',
      label: 'Screen Reader Optimized',
      description: 'Enhanced support for screen readers',
      icon: Volume2,
    },
    {
      key: 'keyboardNav',
      label: 'Enhanced Keyboard Navigation',
      description: 'Improved keyboard navigation indicators',
      icon: Keyboard,
    },
  ];

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Accessibility Settings"
      className="max-w-2xl"
    >
      <div className="space-y-6">
        <p className="text-gray-600">
          Customize the interface to better suit your accessibility needs.
        </p>

        <div className="space-y-4">
          {accessibilityOptions.map((option) => {
            const Icon = option.icon;
            const isEnabled = settings[option.key];

            return (
              <div key={option.key} className="glass-card p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isEnabled ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div>
                      <h3 className="font-medium text-gray-900">{option.label}</h3>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>

                  <motion.button
                    className={`
                      relative w-12 h-6 rounded-full transition-colors duration-200
                      ${isEnabled ? 'bg-blue-500' : 'bg-gray-300'}
                    `}
                    onClick={() => handleSettingChange(option.key, !isEnabled)}
                    aria-label={`Toggle ${option.label}`}
                    aria-pressed={isEnabled}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      animate={{
                        x: isEnabled ? 24 : 4,
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <AccessibleButton
            onClick={onClose}
            variant="primary"
            className="w-full"
          >
            Save Settings
          </AccessibleButton>
        </div>
      </div>

      {announcement && (
        <ScreenReaderAnnouncement message={announcement} />
      )}
    </AccessibleModal>
  );
};

// Focus trap utility
export const FocusTrap = ({ children, isActive = true }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (isActive && containerRef.current) {
      const container = containerRef.current;
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleKeyDown = (event) => {
        if (event.key === 'Tab') {
          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      container.addEventListener('keydown', handleKeyDown);

      return () => {
        container.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isActive]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
};

export default {
  ScreenReaderAnnouncement,
  SkipToContent,
  AccessibleButton,
  AccessibleInput,
  AccessibleModal,
  KeyboardNavigationProvider,
  AccessibilityPanel,
  FocusTrap,
};