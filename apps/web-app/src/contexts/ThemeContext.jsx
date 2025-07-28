import React, { createContext, useContext, useState, useEffect } from 'react';

// Professional color palettes for Enhanced UI v2.0
const colorPalettes = {
  default: {
    name: 'Ocean Blue',
    primary: '#2563eb',
    secondary: '#7c3aed',
    accent: '#06b6d4',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
    glassBackground: 'rgba(255, 255, 255, 0.1)',
    glassBorder: 'rgba(255, 255, 255, 0.2)',
  },
  professional: {
    name: 'Professional Dark',
    primary: '#1f2937',
    secondary: '#374151',
    accent: '#3b82f6',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#d1d5db',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    gradient: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
    glassBackground: 'rgba(31, 41, 55, 0.1)',
    glassBorder: 'rgba(31, 41, 55, 0.2)',
  },
  modern: {
    name: 'Modern Purple',
    primary: '#8b5cf6',
    secondary: '#a855f7',
    accent: '#ec4899',
    background: '#ffffff',
    surface: '#faf5ff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    glassBackground: 'rgba(139, 92, 246, 0.1)',
    glassBorder: 'rgba(139, 92, 246, 0.2)',
  },
  emerald: {
    name: 'Emerald Green',
    primary: '#059669',
    secondary: '#10b981',
    accent: '#34d399',
    background: '#ffffff',
    surface: '#f0fdfa',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#d1fae5',
    success: '#059669',
    warning: '#f59e0b',
    error: '#ef4444',
    gradient: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
    glassBackground: 'rgba(5, 150, 105, 0.1)',
    glassBorder: 'rgba(5, 150, 105, 0.2)',
  },
  sunset: {
    name: 'Sunset Orange',
    primary: '#ea580c',
    secondary: '#fb923c',
    accent: '#fbbf24',
    background: '#ffffff',
    surface: '#fff7ed',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#fed7aa',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    gradient: 'linear-gradient(135deg, #ea580c 0%, #fbbf24 100%)',
    glassBackground: 'rgba(234, 88, 12, 0.1)',
    glassBorder: 'rgba(234, 88, 12, 0.2)',
  },
  dark: {
    name: 'Dark Mode',
    primary: '#3b82f6',
    secondary: '#6366f1',
    accent: '#8b5cf6',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    glassBackground: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
  },
};

// Animation presets
const animationPresets = {
  none: {
    name: 'No Animations',
    enabled: false,
    duration: 0,
    easing: 'linear',
  },
  subtle: {
    name: 'Subtle',
    enabled: true,
    duration: 200,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  smooth: {
    name: 'Smooth',
    enabled: true,
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  premium: {
    name: 'Premium',
    enabled: true,
    duration: 400,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  playful: {
    name: 'Playful',
    enabled: true,
    duration: 500,
    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
};

// Glass morphism intensity levels
const glassIntensity = {
  minimal: {
    name: 'Minimal',
    blur: 8,
    opacity: 0.05,
    borderOpacity: 0.1,
  },
  subtle: {
    name: 'Subtle',
    blur: 12,
    opacity: 0.08,
    borderOpacity: 0.15,
  },
  moderate: {
    name: 'Moderate',
    blur: 16,
    opacity: 0.1,
    borderOpacity: 0.2,
  },
  strong: {
    name: 'Strong',
    blur: 20,
    opacity: 0.15,
    borderOpacity: 0.25,
  },
  intense: {
    name: 'Intense',
    blur: 24,
    opacity: 0.2,
    borderOpacity: 0.3,
  },
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentPalette, setCurrentPalette] = useState('default');
  const [animationPreset, setAnimationPreset] = useState('smooth');
  const [glassLevel, setGlassLevel] = useState('moderate');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedPalette = localStorage.getItem('theme-palette');
    const savedAnimation = localStorage.getItem('theme-animation');
    const savedGlass = localStorage.getItem('theme-glass');
    const savedReducedMotion = localStorage.getItem('theme-reduced-motion');
    const savedHighContrast = localStorage.getItem('theme-high-contrast');

    if (savedPalette && colorPalettes[savedPalette]) {
      setCurrentPalette(savedPalette);
    }
    if (savedAnimation && animationPresets[savedAnimation]) {
      setAnimationPreset(savedAnimation);
    }
    if (savedGlass && glassIntensity[savedGlass]) {
      setGlassLevel(savedGlass);
    }
    if (savedReducedMotion) {
      setReducedMotion(JSON.parse(savedReducedMotion));
    }
    if (savedHighContrast) {
      setHighContrast(JSON.parse(savedHighContrast));
    }

    // Check system preferences
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersDark && !savedPalette) {
      setCurrentPalette('dark');
    }
    if (prefersReducedMotion) {
      setReducedMotion(true);
      setAnimationPreset('none');
    }
  }, []);

  // Apply theme to CSS variables
  useEffect(() => {
    const palette = colorPalettes[currentPalette];
    const animation = animationPresets[animationPreset];
    const glass = glassIntensity[glassLevel];

    const root = document.documentElement;

    // Apply color palette
    Object.entries(palette).forEach(([key, value]) => {
      if (key !== 'name') {
        root.style.setProperty(`--theme-${key}`, value);
      }
    });

    // Apply animation settings
    root.style.setProperty('--theme-duration', `${animation.duration}ms`);
    root.style.setProperty('--theme-easing', animation.easing);

    // Apply glass morphism settings
    root.style.setProperty('--glass-blur', `${glass.blur}px`);
    root.style.setProperty('--glass-opacity', glass.opacity.toString());
    root.style.setProperty('--glass-border-opacity', glass.borderOpacity.toString());

    // Apply accessibility settings
    if (reducedMotion || !animation.enabled) {
      root.style.setProperty('--theme-duration', '0ms');
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }

    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    // Apply theme class to body
    document.body.className = document.body.className
      .replace(/theme-\w+/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    document.body.classList.add(`theme-${currentPalette}`);

  }, [currentPalette, animationPreset, glassLevel, reducedMotion, highContrast]);

  // Save preferences to localStorage
  const savePreferences = () => {
    localStorage.setItem('theme-palette', currentPalette);
    localStorage.setItem('theme-animation', animationPreset);
    localStorage.setItem('theme-glass', glassLevel);
    localStorage.setItem('theme-reduced-motion', JSON.stringify(reducedMotion));
    localStorage.setItem('theme-high-contrast', JSON.stringify(highContrast));
  };

  useEffect(() => {
    savePreferences();
  }, [currentPalette, animationPreset, glassLevel, reducedMotion, highContrast]);

  const changeColorPalette = (paletteKey) => {
    if (colorPalettes[paletteKey]) {
      setCurrentPalette(paletteKey);
    }
  };

  const changeAnimationPreset = (presetKey) => {
    if (animationPresets[presetKey]) {
      setAnimationPreset(presetKey);
    }
  };

  const changeGlassLevel = (levelKey) => {
    if (glassIntensity[levelKey]) {
      setGlassLevel(levelKey);
    }
  };

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  const resetToDefaults = () => {
    setCurrentPalette('default');
    setAnimationPreset('smooth');
    setGlassLevel('moderate');
    setReducedMotion(false);
    setHighContrast(false);
  };

  const getCurrentPalette = () => colorPalettes[currentPalette];
  const getCurrentAnimation = () => animationPresets[animationPreset];
  const getCurrentGlass = () => glassIntensity[glassLevel];

  const value = {
    // Current settings
    currentPalette,
    animationPreset,
    glassLevel,
    reducedMotion,
    highContrast,

    // Available options
    colorPalettes,
    animationPresets,
    glassIntensity,

    // Change functions
    changeColorPalette,
    changeAnimationPreset,
    changeGlassLevel,
    toggleReducedMotion,
    toggleHighContrast,
    resetToDefaults,

    // Getters
    getCurrentPalette,
    getCurrentAnimation,
    getCurrentGlass,

    // Utilities
    savePreferences,

    // Quick access to current theme values
    colors: getCurrentPalette(),
    animation: getCurrentAnimation(),
    glass: getCurrentGlass(),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;