// Performance optimization utilities for Enhanced UI v2.0

// Hardware acceleration utilities
export const enableHardwareAcceleration = (element) => {
  if (element) {
    element.style.transform = 'translateZ(0)';
    element.style.backfaceVisibility = 'hidden';
    element.style.perspective = '1000px';
  }
};

// Optimized animation frame management
export class AnimationManager {
  constructor() {
    this.animations = new Map();
    this.isRunning = false;
    this.frameId = null;
  }

  add(id, callback, options = {}) {
    this.animations.set(id, {
      callback,
      priority: options.priority || 0,
      lastFrame: 0,
      fps: options.fps || 60,
      frameInterval: 1000 / (options.fps || 60),
    });

    if (!this.isRunning) {
      this.start();
    }
  }

  remove(id) {
    this.animations.delete(id);
    
    if (this.animations.size === 0) {
      this.stop();
    }
  }

  start() {
    this.isRunning = true;
    this.tick();
  }

  stop() {
    this.isRunning = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }

  tick = (currentTime = performance.now()) => {
    if (!this.isRunning) return;

    // Sort animations by priority
    const sortedAnimations = Array.from(this.animations.entries())
      .sort(([, a], [, b]) => b.priority - a.priority);

    for (const [id, animation] of sortedAnimations) {
      const { callback, lastFrame, frameInterval } = animation;
      
      if (currentTime - lastFrame >= frameInterval) {
        try {
          callback(currentTime);
          animation.lastFrame = currentTime;
        } catch (error) {
          console.warn(`Animation ${id} error:`, error);
          this.remove(id);
        }
      }
    }

    this.frameId = requestAnimationFrame(this.tick);
  };
}

// Global animation manager instance
export const animationManager = new AnimationManager();

// Performance monitoring
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: 0,
      frameTime: 0,
      animationCount: 0,
      memoryUsage: 0,
    };
    
    this.frames = [];
    this.lastTime = performance.now();
    this.monitoring = false;
  }

  start() {
    this.monitoring = true;
    this.measure();
  }

  stop() {
    this.monitoring = false;
  }

  measure = () => {
    if (!this.monitoring) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    
    this.frames.push(deltaTime);
    
    // Keep only last 60 frames for FPS calculation
    if (this.frames.length > 60) {
      this.frames.shift();
    }

    // Calculate FPS
    const averageFrameTime = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
    this.metrics.fps = Math.round(1000 / averageFrameTime);
    this.metrics.frameTime = Math.round(averageFrameTime * 100) / 100;

    // Get memory usage if available
    if (performance.memory) {
      this.metrics.memoryUsage = Math.round(
        performance.memory.usedJSHeapSize / 1024 / 1024 * 100
      ) / 100;
    }

    // Count active animations
    this.metrics.animationCount = animationManager.animations.size;

    this.lastTime = currentTime;
    requestAnimationFrame(this.measure);
  };

  getMetrics() {
    return { ...this.metrics };
  }

  isPerformanceGood() {
    return this.metrics.fps >= 50 && this.metrics.frameTime <= 20;
  }
}

// Global performance monitor
export const performanceMonitor = new PerformanceMonitor();

// Optimized scroll handling
export class OptimizedScrollHandler {
  constructor() {
    this.callbacks = new Map();
    this.isScrolling = false;
    this.lastScrollY = window.scrollY;
    this.ticking = false;
  }

  add(id, callback, options = {}) {
    this.callbacks.set(id, {
      callback,
      throttle: options.throttle || 16, // ~60fps
      lastCall: 0,
    });

    if (this.callbacks.size === 1) {
      window.addEventListener('scroll', this.handleScroll, { passive: true });
    }
  }

  remove(id) {
    this.callbacks.delete(id);
    
    if (this.callbacks.size === 0) {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }

  handleScroll = () => {
    if (!this.ticking) {
      requestAnimationFrame(this.updateScroll);
      this.ticking = true;
    }
  };

  updateScroll = () => {
    const currentTime = performance.now();
    const scrollY = window.scrollY;
    const scrollDirection = scrollY > this.lastScrollY ? 'down' : 'up';

    for (const [id, handler] of this.callbacks) {
      if (currentTime - handler.lastCall >= handler.throttle) {
        try {
          handler.callback({
            scrollY,
            lastScrollY: this.lastScrollY,
            direction: scrollDirection,
            deltaY: scrollY - this.lastScrollY,
          });
          handler.lastCall = currentTime;
        } catch (error) {
          console.warn(`Scroll handler ${id} error:`, error);
        }
      }
    }

    this.lastScrollY = scrollY;
    this.ticking = false;
  };
}

// Global scroll handler
export const optimizedScrollHandler = new OptimizedScrollHandler();

// Debounce utility for performance
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle utility for performance
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

// Optimized intersection observer
export class OptimizedIntersectionObserver {
  constructor(options = {}) {
    this.observers = new Map();
    this.defaultOptions = {
      threshold: 0.1,
      rootMargin: '50px',
      ...options,
    };
  }

  observe(element, callback, options = {}) {
    const mergedOptions = { ...this.defaultOptions, ...options };
    const optionsKey = JSON.stringify(mergedOptions);
    
    if (!this.observers.has(optionsKey)) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const callback = entry.target._intersectionCallback;
          if (callback) {
            callback(entry);
          }
        });
      }, mergedOptions);
      
      this.observers.set(optionsKey, observer);
    }

    const observer = this.observers.get(optionsKey);
    element._intersectionCallback = callback;
    observer.observe(element);

    return () => this.unobserve(element, optionsKey);
  }

  unobserve(element, optionsKey = null) {
    if (optionsKey) {
      const observer = this.observers.get(optionsKey);
      if (observer) {
        observer.unobserve(element);
      }
    } else {
      // Unobserve from all observers
      for (const observer of this.observers.values()) {
        observer.unobserve(element);
      }
    }
    
    delete element._intersectionCallback;
  }

  disconnect() {
    for (const observer of this.observers.values()) {
      observer.disconnect();
    }
    this.observers.clear();
  }
}

// Global intersection observer
export const optimizedIntersectionObserver = new OptimizedIntersectionObserver();

// CSS animation optimization
export const optimizeCSSAnimations = () => {
  // Add CSS for optimized animations
  const style = document.createElement('style');
  style.textContent = `
    /* Hardware acceleration for all animated elements */
    .hardware-accelerate,
    [class*="animate-"],
    [class*="transition-"] {
      transform: translateZ(0);
      backface-visibility: hidden;
      perspective: 1000px;
      will-change: transform, opacity;
    }

    /* Optimize transforms */
    .optimize-transform {
      transform-style: preserve-3d;
    }

    /* Reduce motion for users who prefer it */
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }

    /* High performance mode */
    .performance-mode {
      will-change: auto;
    }

    .performance-mode * {
      will-change: auto;
    }
  `;
  
  if (!document.querySelector('#performance-optimizations')) {
    style.id = 'performance-optimizations';
    document.head.appendChild(style);
  }
};

// Adaptive performance
export class AdaptivePerformance {
  constructor() {
    this.performanceLevel = 'high';
    this.monitor = new PerformanceMonitor();
    this.checkInterval = null;
  }

  start() {
    this.monitor.start();
    this.checkInterval = setInterval(() => {
      this.adjustPerformance();
    }, 2000);
  }

  stop() {
    this.monitor.stop();
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }

  adjustPerformance() {
    const metrics = this.monitor.getMetrics();
    
    if (metrics.fps < 30 || metrics.frameTime > 33) {
      this.setPerformanceLevel('low');
    } else if (metrics.fps < 50 || metrics.frameTime > 20) {
      this.setPerformanceLevel('medium');
    } else {
      this.setPerformanceLevel('high');
    }
  }

  setPerformanceLevel(level) {
    if (this.performanceLevel === level) return;
    
    this.performanceLevel = level;
    document.body.className = document.body.className
      .replace(/performance-\w+/g, '')
      .trim();
    document.body.classList.add(`performance-${level}`);

    // Adjust animation settings based on performance
    const root = document.documentElement;
    switch (level) {
      case 'low':
        root.style.setProperty('--animation-duration', '0.1s');
        root.style.setProperty('--animation-easing', 'linear');
        break;
      case 'medium':
        root.style.setProperty('--animation-duration', '0.2s');
        root.style.setProperty('--animation-easing', 'ease');
        break;
      case 'high':
        root.style.setProperty('--animation-duration', '0.3s');
        root.style.setProperty('--animation-easing', 'cubic-bezier(0.4, 0, 0.2, 1)');
        break;
    }

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('performanceLevelChanged', {
      detail: { level, metrics: this.monitor.getMetrics() }
    }));
  }

  getPerformanceLevel() {
    return this.performanceLevel;
  }
}

// Global adaptive performance
export const adaptivePerformance = new AdaptivePerformance();

// Initialize performance optimizations
export const initializePerformanceOptimizations = () => {
  // Apply CSS optimizations
  optimizeCSSAnimations();
  
  // Start adaptive performance monitoring
  adaptivePerformance.start();
  
  // Enable hardware acceleration for key elements
  setTimeout(() => {
    const keyElements = document.querySelectorAll(
      '.glass-card, .btn-premium, .btn-glass, [class*="animate-"]'
    );
    keyElements.forEach(enableHardwareAcceleration);
  }, 100);

  // Log performance info
  if (process.env.NODE_ENV === 'development') {
    console.log('Enhanced UI v2.0 Performance Optimizations Initialized');
    
    // Performance debugging
    window.performanceDebug = {
      monitor: performanceMonitor,
      adaptive: adaptivePerformance,
      animationManager,
      getMetrics: () => performanceMonitor.getMetrics(),
    };
  }
};

// Cleanup function
export const cleanupPerformanceOptimizations = () => {
  animationManager.stop();
  performanceMonitor.stop();
  adaptivePerformance.stop();
  optimizedIntersectionObserver.disconnect();
};

export default {
  AnimationManager,
  PerformanceMonitor,
  OptimizedScrollHandler,
  OptimizedIntersectionObserver,
  AdaptivePerformance,
  animationManager,
  performanceMonitor,
  optimizedScrollHandler,
  optimizedIntersectionObserver,
  adaptivePerformance,
  debounce,
  throttle,
  enableHardwareAcceleration,
  optimizeCSSAnimations,
  initializePerformanceOptimizations,
  cleanupPerformanceOptimizations,
};