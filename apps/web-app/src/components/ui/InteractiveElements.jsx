import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useHover, useFocus } from '@react-aria/interactions';
import { useFocusRing } from '@react-aria/focus';

// Enhanced button with micro-interactions
export const InteractiveButton = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  hapticFeedback = true,
  glowEffect = true,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const buttonRef = useRef(null);

  // Motion values for advanced interactions
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  const { hoverProps, isHovered } = useHover({ isDisabled: disabled });
  const { focusProps, isFocused } = useFocus({});
  const { isFocusVisible, focusProps: focusRingProps } = useFocusRing();

  // Haptic feedback simulation
  const triggerHaptic = () => {
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10); // Light haptic feedback
    }
  };

  const handleMouseMove = (event) => {
    if (!buttonRef.current || disabled) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((event.clientX - centerX) / 5);
    y.set((event.clientY - centerY) / 5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = (event) => {
    triggerHaptic();
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    
    if (onClick && !disabled && !loading) {
      onClick(event);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  const variantClasses = {
    primary: 'btn-premium',
    secondary: 'btn-glass',
    ghost: 'glass-button border-transparent hover:border-glass-300',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}
        relative overflow-hidden font-medium rounded-xl transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isFocusVisible ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${glowEffect && (isHovered || isFocused) ? 'shadow-glow-blue' : ''}
      `}
      style={{
        perspective: 1000,
      }}
      disabled={disabled || loading}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      {...hoverProps}
      {...focusProps}
      {...focusRingProps}
      {...props}
      
      // Framer Motion props
      animate={{
        scale: isPressed ? 0.95 : isHovered ? 1.05 : 1,
        rotateX: disabled ? 0 : rotateX,
        rotateY: disabled ? 0 : rotateY,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
        animate={{
          opacity: isHovered ? 0.2 : 0,
          x: isHovered ? ['0%', '200%'] : '0%',
        }}
        transition={{
          duration: 0.6,
          ease: 'easeInOut',
        }}
      />

      {/* Ripple effect */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 bg-white rounded-xl"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      )}

      <span className="relative z-10 flex items-center justify-center space-x-2">
        {loading ? (
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : null}
        {children}
      </span>
    </motion.button>
  );
};

// Floating Action Button with magnetic effect
export const FloatingActionButton = ({
  children,
  onClick,
  position = 'bottom-right',
  magnetic = true,
  className = '',
  ...props
}) => {
  const buttonRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    if (!magnetic || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const maxDistance = 100;
    const distance = Math.sqrt(
      Math.pow(event.clientX - centerX, 2) + Math.pow(event.clientY - centerY, 2)
    );

    if (distance < maxDistance) {
      const strength = 1 - distance / maxDistance;
      setMousePosition({
        x: (event.clientX - centerX) * strength * 0.3,
        y: (event.clientY - centerY) * strength * 0.3,
      });
    } else {
      setMousePosition({ x: 0, y: 0 });
    }
  };

  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6',
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`
        ${positionClasses[position]} ${className}
        w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full
        shadow-lg hover:shadow-xl z-50 glass-card-v2
      `}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
      onClick={onClick}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      {...props}
    >
      <div className="flex items-center justify-center">
        {children}
      </div>
    </motion.button>
  );
};

// Card with tilt effect
export const TiltCard = ({
  children,
  tiltStrength = 15,
  className = '',
  onClick,
  ...props
}) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-300, 300], [tiltStrength, -tiltStrength]);
  const rotateY = useTransform(x, [-300, 300], [-tiltStrength, tiltStrength]);

  const handleMouseMove = (event) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`glass-card-v2 cursor-pointer ${className}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ z: 50 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      {...props}
    >
      <div style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </motion.div>
  );
};

// Interactive toggle switch
export const InteractiveToggle = ({
  checked = false,
  onChange,
  size = 'md',
  color = 'blue',
  disabled = false,
  label,
  description,
  className = '',
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const sizes = {
    sm: { width: 'w-8', height: 'h-4', dot: 'w-3 h-3' },
    md: { width: 'w-11', height: 'h-6', dot: 'w-4 h-4' },
    lg: { width: 'w-14', height: 'h-7', dot: 'w-5 h-5' },
  };

  const colors = {
    blue: checked ? 'bg-blue-500' : 'bg-gray-300',
    green: checked ? 'bg-green-500' : 'bg-gray-300',
    purple: checked ? 'bg-purple-500' : 'bg-gray-300',
    red: checked ? 'bg-red-500' : 'bg-gray-300',
  };

  const handleToggle = () => {
    if (disabled) return;
    
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    
    if (onChange) {
      onChange(!checked);
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <motion.button
        className={`
          ${sizes[size].width} ${sizes[size].height} ${colors[color]}
          relative rounded-full transition-all duration-200 focus:ring-2 focus:ring-offset-2
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={handleToggle}
        disabled={disabled}
        whileTap={{ scale: isPressed ? 0.95 : 1 }}
        style={{ focusRingColor: color }}
      >
        <motion.div
          className={`
            ${sizes[size].dot} bg-white rounded-full shadow-sm absolute top-0.5
          `}
          animate={{
            x: checked ? (size === 'sm' ? 16 : size === 'md' ? 20 : 28) : 2,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        />
      </motion.button>

      {(label || description) && (
        <div className="flex-1">
          {label && (
            <div className="font-medium text-gray-900">{label}</div>
          )}
          {description && (
            <div className="text-sm text-gray-600">{description}</div>
          )}
        </div>
      )}
    </div>
  );
};

// Magnetic hover effect component
export const MagneticHover = ({
  children,
  strength = 0.3,
  distance = 100,
  className = '',
  ...props
}) => {
  const elementRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseDistance = Math.sqrt(
      Math.pow(event.clientX - centerX, 2) + Math.pow(event.clientY - centerY, 2)
    );

    if (mouseDistance < distance) {
      const magnetStrength = 1 - mouseDistance / distance;
      setPosition({
        x: (event.clientX - centerX) * strength * magnetStrength,
        y: (event.clientY - centerY) * strength * magnetStrength,
      });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={elementRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={position}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Pulse animation component
export const PulseElement = ({
  children,
  intensity = 1.05,
  duration = 2,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, intensity, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default {
  InteractiveButton,
  FloatingActionButton,
  TiltCard,
  InteractiveToggle,
  MagneticHover,
  PulseElement,
};