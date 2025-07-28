import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.05,
  },
};

const pageTransition = {
  type: 'tween',
  ease: [0.4, 0, 0.2, 1],
  duration: 0.4,
};

// Slide variants for different directions
const slideVariants = {
  slideLeft: {
    initial: { x: 300, opacity: 0 },
    in: { x: 0, opacity: 1 },
    out: { x: -300, opacity: 0 },
  },
  slideRight: {
    initial: { x: -300, opacity: 0 },
    in: { x: 0, opacity: 1 },
    out: { x: 300, opacity: 0 },
  },
  slideUp: {
    initial: { y: 300, opacity: 0 },
    in: { y: 0, opacity: 1 },
    out: { y: -300, opacity: 0 },
  },
  slideDown: {
    initial: { y: -300, opacity: 0 },
    in: { y: 0, opacity: 1 },
    out: { y: 300, opacity: 0 },
  },
};

// Scale variants
const scaleVariants = {
  initial: {
    scale: 0.8,
    opacity: 0,
    rotateX: -15,
  },
  in: {
    scale: 1,
    opacity: 1,
    rotateX: 0,
  },
  out: {
    scale: 1.1,
    opacity: 0,
    rotateX: 15,
  },
};

// Main PageTransition component
const PageTransition = ({ 
  children, 
  variant = 'default',
  duration = 0.4,
  className = '',
  exitBeforeEnter = true,
}) => {
  const location = useLocation();

  const getVariants = () => {
    switch (variant) {
      case 'slideLeft':
        return slideVariants.slideLeft;
      case 'slideRight':
        return slideVariants.slideRight;
      case 'slideUp':
        return slideVariants.slideUp;
      case 'slideDown':
        return slideVariants.slideDown;
      case 'scale':
        return scaleVariants;
      default:
        return pageVariants;
    }
  };

  const transition = {
    type: 'tween',
    ease: [0.4, 0, 0.2, 1],
    duration,
  };

  return (
    <AnimatePresence mode={exitBeforeEnter ? 'wait' : 'sync'}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={getVariants()}
        transition={transition}
        className={`hardware-accelerate ${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Stagger animation for lists
export const StaggerContainer = ({ children, className = '', delay = 0.1 }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`hardware-accelerate ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Individual stagger item
export const StaggerItem = ({ children, className = '' }) => {
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'tween',
        ease: [0.4, 0, 0.2, 1],
        duration: 0.4,
      },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      className={`hardware-accelerate ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Fade transition component
export const FadeTransition = ({ children, duration = 0.3, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="hardware-accelerate"
    >
      {children}
    </motion.div>
  );
};

// Micro-interactions for hover effects
export const HoverScale = ({ 
  children, 
  scale = 1.05, 
  duration = 0.2,
  className = '',
}) => {
  return (
    <motion.div
      whileHover={{ 
        scale,
        transition: { duration, ease: [0.4, 0, 0.2, 1] }
      }}
      whileTap={{ scale: 0.95 }}
      className={`hardware-accelerate cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Floating animation
export const FloatingElement = ({ 
  children, 
  duration = 3,
  intensity = 10,
  className = '',
}) => {
  return (
    <motion.div
      animate={{
        y: [-intensity, intensity, -intensity],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`hardware-accelerate ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Pulse animation
export const PulseElement = ({ 
  children, 
  scale = [1, 1.05, 1],
  duration = 2,
  className = '',
}) => {
  return (
    <motion.div
      animate={{
        scale,
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`hardware-accelerate ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Reveal animation on scroll
export const RevealOnScroll = ({ 
  children, 
  direction = 'up',
  distance = 50,
  duration = 0.6,
  className = '',
}) => {
  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return { y: distance, opacity: 0 };
      case 'down':
        return { y: -distance, opacity: 0 };
      case 'left':
        return { x: distance, opacity: 0 };
      case 'right':
        return { x: -distance, opacity: 0 };
      default:
        return { y: distance, opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialTransform()}
      whileInView={{ 
        x: 0, 
        y: 0, 
        opacity: 1,
        transition: {
          duration,
          ease: [0.4, 0, 0.2, 1],
        }
      }}
      viewport={{ once: true, margin: '-50px' }}
      className={`hardware-accelerate ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;