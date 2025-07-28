/**
 * Performance optimization utilities for Enhanced UI v2.0
 * Provides 60fps animation targeting and hardware acceleration
 */

class PerformanceManager {
  constructor() {
    this.animationFrameId = null;
    this.observers = new Map();
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Monitor performance
    this.frameRate = 60;
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.averageFrameTime = 16.67; // Target 60fps
  }

  /**
   * Request animation frame with performance monitoring
   */
  requestOptimizedFrame(callback) {
    if (this.isReducedMotion) {
      // Skip animations for reduced motion preference
      callback();
      return;
    }

    this.animationFrameId = requestAnimationFrame((timestamp) => {
      const deltaTime = timestamp - this.lastFrameTime;
      this.lastFrameTime = timestamp;
      
      // Update performance metrics
      this.frameCount++;
      this.averageFrameTime = (this.averageFrameTime * 0.9) + (deltaTime * 0.1);
      
      // Adaptive performance - reduce quality if frames are dropping
      const isPerformanceLow = this.averageFrameTime > 20; // Worse than 50fps
      
      callback({
        timestamp,
        deltaTime,
        isPerformanceLow,
        currentFPS: 1000 / this.averageFrameTime
      });
    });

    return this.animationFrameId;
  }

  /**
   * Cancel animation frame
   */
  cancelOptimizedFrame() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Create intersection observer for performance optimization
   */
  createIntersectionObserver(callback, options = {}) {
    const defaultOptions = {
      root: null,
      rootMargin: '50px',
      threshold: [0, 0.1, 0.5, 1.0]
    };

    const observer = new IntersectionObserver(callback, {
      ...defaultOptions,
      ...options
    });

    const observerId = Math.random().toString(36).substr(2, 9);
    this.observers.set(observerId, observer);

    return {
      observer,
      id: observerId,
      cleanup: () => {
        observer.disconnect();
        this.observers.delete(observerId);
      }
    };
  }

  /**
   * Optimize scroll handling with throttling
   */
  createOptimizedScrollHandler(callback, throttleMs = 16) {
    let isThrottled = false;
    let lastScrollTop = 0;

    return (event) => {
      if (isThrottled) return;

      isThrottled = true;
      
      this.requestOptimizedFrame(() => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDirection = currentScrollTop > lastScrollTop ? 'down' : 'up';
        const scrollDelta = Math.abs(currentScrollTop - lastScrollTop);
        
        callback({
          event,
          scrollTop: currentScrollTop,
          scrollDirection,
          scrollDelta,
          isScrolling: scrollDelta > 0
        });

        lastScrollTop = currentScrollTop;
        
        setTimeout(() => {
          isThrottled = false;
        }, throttleMs);
      });
    };
  }

  /**
   * Enable hardware acceleration for element
   */
  enableHardwareAcceleration(element) {
    if (element && element.style) {
      element.style.transform = element.style.transform || 'translateZ(0)';
      element.style.willChange = 'transform';
    }
  }

  /**
   * Disable hardware acceleration to save memory
   */
  disableHardwareAcceleration(element) {
    if (element && element.style) {
      element.style.willChange = 'auto';
    }
  }

  /**
   * Batch DOM operations for better performance
   */
  batchDOMOperations(operations) {
    return new Promise((resolve) => {
      this.requestOptimizedFrame(() => {
        const results = operations.map(op => {
          try {
            return op();
          } catch (error) {
            console.warn('DOM operation failed:', error);
            return null;
          }
        });
        resolve(results);
      });
    });
  }

  /**
   * Get current performance metrics
   */
  getPerformanceMetrics() {
    return {
      averageFrameTime: this.averageFrameTime,
      currentFPS: Math.round(1000 / this.averageFrameTime),
      isReducedMotion: this.isReducedMotion,
      frameCount: this.frameCount,
      activeObservers: this.observers.size
    };
  }

  /**
   * Cleanup all performance monitoring
   */
  cleanup() {
    this.cancelOptimizedFrame();
    
    // Cleanup all observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Export singleton instance
export const performanceManager = new PerformanceManager();

// Utility functions
export const optimizeForMobile = () => {
  const isMobile = window.innerWidth <= 768;
  const isTouch = 'ontouchstart' in window;
  
  return {
    isMobile,
    isTouch,
    reducedAnimations: isMobile || performanceManager.isReducedMotion,
    optimizedScrolling: isMobile
  };
};

export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memory management utilities
export const memoryManager = {
  cleanupUnusedElements: () => {
    // Force garbage collection in dev mode
    if (window.gc && typeof window.gc === 'function') {
      window.gc();
    }
  },
  
  monitorMemoryUsage: () => {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576),
        total: Math.round(performance.memory.totalJSHeapSize / 1048576),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
      };
    }
    return null;
  }
};

export default performanceManager;