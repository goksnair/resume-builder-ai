import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('ocean-blue');
  const [animationPreset, setAnimationPreset] = useState('smooth');
  const [glassIntensity, setGlassIntensity] = useState(3);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme definitions
  const themes = {
    'ocean-blue': {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#38bdf8',
      background: '#f0f9ff',
      surface: '#ffffff',
      text: '#0c4a6e'
    },
    'professional-dark': {
      primary: '#1f2937',
      secondary: '#374151',
      accent: '#6b7280',
      background: '#111827',
      surface: '#1f2937',
      text: '#f9fafb'
    },
    'modern-purple': {
      primary: '#7c3aed',
      secondary: '#8b5cf6',
      accent: '#a78bfa',
      background: '#faf5ff',
      surface: '#ffffff',
      text: '#581c87'
    },
    'emerald-green': {
      primary: '#059669',
      secondary: '#10b981',
      accent: '#34d399',
      background: '#ecfdf5',
      surface: '#ffffff',
      text: '#064e3b'
    },
    'sunset-orange': {
      primary: '#ea580c',
      secondary: '#f97316',
      accent: '#fb923c',
      background: '#fff7ed',
      surface: '#ffffff',
      text: '#9a3412'
    },
    'dark-mode': {
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      accent: '#60a5fa',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9'
    }
  };

  // Animation presets
  const animationPresets = {
    none: { duration: 0, easing: 'linear' },
    subtle: { duration: 200, easing: 'ease-out' },
    smooth: { duration: 300, easing: 'ease-in-out' },
    premium: { duration: 500, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    playful: { duration: 400, easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' }
  };

  // Load saved preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem('resume-builder-theme');
    const savedAnimation = localStorage.getItem('resume-builder-animation');
    const savedGlass = localStorage.getItem('resume-builder-glass');
    const savedDarkMode = localStorage.getItem('resume-builder-dark-mode');

    if (savedTheme) setTheme(savedTheme);
    if (savedAnimation) setAnimationPreset(savedAnimation);
    if (savedGlass) setGlassIntensity(parseInt(savedGlass));
    if (savedDarkMode) setIsDarkMode(JSON.parse(savedDarkMode));
  }, []);

  // Save preferences
  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('resume-builder-theme', newTheme);
  };

  const updateAnimationPreset = (preset) => {
    setAnimationPreset(preset);
    localStorage.setItem('resume-builder-animation', preset);
  };

  const updateGlassIntensity = (intensity) => {
    setGlassIntensity(intensity);
    localStorage.setItem('resume-builder-glass', intensity.toString());
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('resume-builder-dark-mode', JSON.stringify(newDarkMode));
  };

  // Get current theme colors
  const currentTheme = themes[isDarkMode ? 'dark-mode' : theme];
  const currentAnimation = animationPresets[animationPreset];

  const value = {
    theme,
    animationPreset,
    glassIntensity,
    isDarkMode,
    themes,
    animationPresets,
    currentTheme,
    currentAnimation,
    updateTheme,
    updateAnimationPreset,
    updateGlassIntensity,
    toggleDarkMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;