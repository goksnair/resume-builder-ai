import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, MoreVertical } from 'lucide-react';

// Swipeable card stack for mobile
export const SwipeableCards = ({ 
  cards = [], 
  onSwipe, 
  className = '',
  swipeThreshold = 100,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitX, setExitX] = useState(0);

  const handleDragEnd = (event, info) => {
    const threshold = swipeThreshold;
    
    if (info.offset.x > threshold) {
      // Swipe right
      setExitX(1000);
      if (onSwipe) onSwipe('right', cards[currentIndex], currentIndex);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
        setExitX(0);
      }, 200);
    } else if (info.offset.x < -threshold) {
      // Swipe left
      setExitX(-1000);
      if (onSwipe) onSwipe('left', cards[currentIndex], currentIndex);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
        setExitX(0);
      }, 200);
    }
  };

  return (
    <div className={`relative h-96 w-full overflow-hidden ${className}`}>
      {cards.map((card, index) => {
        const isActive = index === currentIndex;
        const isNext = index === (currentIndex + 1) % cards.length;
        
        return (
          <motion.div
            key={card.id || index}
            className="absolute inset-0 glass-card-v2 p-6 cursor-grab active:cursor-grabbing"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{
              scale: isActive ? 1 : isNext ? 0.95 : 0.9,
              opacity: isActive ? 1 : isNext ? 0.7 : 0,
              zIndex: isActive ? 2 : isNext ? 1 : 0,
              y: isActive ? 0 : isNext ? 10 : 20,
            }}
            exit={{ x: exitX, opacity: 0 }}
            drag={isActive ? 'x' : false}
            dragConstraints={{ left: -200, right: 200 }}
            onDragEnd={handleDragEnd}
            whileDrag={{ 
              scale: 1.05,
              rotateZ: 5,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
          >
            {card.content || (
              <div>
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-gray-600">{card.description}</p>
              </div>
            )}

            {/* Swipe indicators */}
            {isActive && (
              <>
                <motion.div
                  className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0 }}
                  whileDrag={(event, info) => ({
                    opacity: Math.max(0, Math.min(1, info.offset.x / 100)),
                  })}
                >
                  <div className="text-green-600 font-bold text-xl">ACCEPT</div>
                </motion.div>
                
                <motion.div
                  className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0 }}
                  whileDrag={(event, info) => ({
                    opacity: Math.max(0, Math.min(1, -info.offset.x / 100)),
                  })}
                >
                  <div className="text-red-600 font-bold text-xl">REJECT</div>
                </motion.div>
              </>
            )}
          </motion.div>
        );
      })}

      {/* Card indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {cards.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Pull-to-refresh component
export const PullToRefresh = ({ 
  children, 
  onRefresh, 
  threshold = 100,
  className = '',
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, threshold], [0, 1]);
  const scale = useTransform(y, [0, threshold], [0.8, 1]);

  const handleDrag = (event, info) => {
    if (info.offset.y > 0) {
      setPullDistance(info.offset.y);
    }
  };

  const handleDragEnd = async (event, info) => {
    if (info.offset.y > threshold && !isRefreshing) {
      setIsRefreshing(true);
      if (onRefresh) {
        await onRefresh();
      }
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      }, 1000);
    } else {
      setPullDistance(0);
    }
  };

  return (
    <motion.div
      className={`relative ${className}`}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.3, bottom: 0 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      style={{ y }}
    >
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full
                   glass-card px-4 py-2 rounded-b-xl"
        style={{ opacity, scale }}
      >
        <div className="flex items-center space-x-2">
          <motion.div
            className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
            animate={{
              rotate: isRefreshing ? 360 : 0,
            }}
            transition={{
              duration: 1,
              repeat: isRefreshing ? Infinity : 0,
              ease: 'linear',
            }}
          />
          <span className="text-sm font-medium text-blue-600">
            {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
          </span>
        </div>
      </motion.div>

      {children}
    </motion.div>
  );
};

// Swipeable navigation tabs
export const SwipeableTabs = ({ 
  tabs = [], 
  activeTab = 0, 
  onTabChange,
  className = '',
}) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const containerRef = useRef(null);

  const handleDragEnd = (event, info) => {
    const threshold = 50;
    
    if (info.offset.x > threshold && currentTab > 0) {
      // Swipe right - previous tab
      const newTab = currentTab - 1;
      setCurrentTab(newTab);
      if (onTabChange) onTabChange(newTab);
    } else if (info.offset.x < -threshold && currentTab < tabs.length - 1) {
      // Swipe left - next tab
      const newTab = currentTab + 1;
      setCurrentTab(newTab);
      if (onTabChange) onTabChange(newTab);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Tab headers */}
      <div className="flex space-x-1 mb-4 glass-nav p-1 rounded-xl">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id || index}
            className={`
              flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${currentTab === index 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'text-gray-600 hover:text-blue-600'
              }
            `}
            onClick={() => {
              setCurrentTab(index);
              if (onTabChange) onTabChange(index);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {tab.icon && <tab.icon className="w-4 h-4 mr-2 inline" />}
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div
        ref={containerRef}
        className="relative overflow-hidden"
        drag="x"
        dragConstraints={{ left: -100, right: 100 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        <motion.div
          className="flex"
          animate={{ x: `-${currentTab * 100}%` }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        >
          {tabs.map((tab, index) => (
            <div
              key={tab.id || index}
              className="w-full flex-shrink-0 px-4"
            >
              {tab.content}
            </div>
          ))}
        </motion.div>

        {/* Swipe indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {tabs.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentTab ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Touch-friendly drawer
export const TouchDrawer = ({ 
  isOpen = false, 
  onClose, 
  children, 
  position = 'bottom',
  className = '',
}) => {
  const [dragY, setDragY] = useState(0);
  const y = useMotionValue(0);

  const handleDrag = (event, info) => {
    setDragY(info.offset.y);
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.y > 100) {
      // Close drawer if dragged down enough
      if (onClose) onClose();
    }
    setDragY(0);
  };

  const positions = {
    bottom: {
      initial: { y: '100%' },
      animate: { y: isOpen ? 0 : '100%' },
      drag: 'y',
      dragConstraints: { top: 0, bottom: 300 },
    },
    top: {
      initial: { y: '-100%' },
      animate: { y: isOpen ? 0 : '-100%' },
      drag: 'y',
      dragConstraints: { top: -300, bottom: 0 },
    },
    left: {
      initial: { x: '-100%' },
      animate: { x: isOpen ? 0 : '-100%' },
      drag: 'x',
      dragConstraints: { left: -300, right: 0 },
    },
    right: {
      initial: { x: '100%' },
      animate: { x: isOpen ? 0 : '100%' },
      drag: 'x',
      dragConstraints: { left: 0, right: 300 },
    },
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <motion.div
        className={`
          fixed z-50 glass-card-v2 ${className}
          ${position === 'bottom' ? 'bottom-0 left-0 right-0 rounded-t-3xl' : ''}
          ${position === 'top' ? 'top-0 left-0 right-0 rounded-b-3xl' : ''}
          ${position === 'left' ? 'left-0 top-0 bottom-0 rounded-r-3xl' : ''}
          ${position === 'right' ? 'right-0 top-0 bottom-0 rounded-l-3xl' : ''}
        `}
        initial={positions[position].initial}
        animate={positions[position].animate}
        exit={positions[position].initial}
        drag={positions[position].drag}
        dragConstraints={positions[position].dragConstraints}
        dragElastic={0.2}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        style={{ y }}
      >
        {/* Drag handle */}
        {(position === 'bottom' || position === 'top') && (
          <div className="flex justify-center p-4">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>
        )}

        {(position === 'left' || position === 'right') && (
          <div className="flex justify-center items-center h-full p-4">
            <div className="w-1.5 h-12 bg-gray-300 rounded-full" />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </>
  );
};

// Long press component
export const LongPress = ({ 
  children, 
  onLongPress, 
  delay = 500,
  className = '',
  ...props 
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const timeoutRef = useRef(null);

  const handleTouchStart = () => {
    setIsPressed(true);
    timeoutRef.current = setTimeout(() => {
      if (onLongPress) onLongPress();
      // Haptic feedback for long press
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }, delay);
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <motion.div
      className={`select-none ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      animate={{
        scale: isPressed ? 0.95 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      {...props}
    >
      {children}
      
      {/* Progress indicator for long press */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 border-2 border-blue-500 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="h-full bg-blue-500 bg-opacity-20 rounded-lg"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: delay / 1000, ease: 'linear' }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

// Responsive breakpoint hook
export const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState('lg');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('sm');
      else if (width < 768) setBreakpoint('md');
      else if (width < 1024) setBreakpoint('lg');
      else if (width < 1280) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: ['lg', 'xl', '2xl'].includes(breakpoint),
  };
};

export default {
  SwipeableCards,
  PullToRefresh,
  SwipeableTabs,
  TouchDrawer,
  LongPress,
  useResponsive,
};