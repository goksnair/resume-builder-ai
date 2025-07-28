import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Palette, 
  Zap, 
  Eye, 
  Volume2, 
  VolumeX,
  Contrast,
  RotateCcw,
  Check,
  X,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { HoverScale } from './PageTransition';

const ThemeSettings = ({ isOpen, onClose }) => {
  const {
    currentPalette,
    animationPreset,
    glassLevel,
    reducedMotion,
    highContrast,
    colorPalettes,
    animationPresets,
    glassIntensity,
    changeColorPalette,
    changeAnimationPreset,
    changeGlassLevel,
    toggleReducedMotion,
    toggleHighContrast,
    resetToDefaults,
    colors,
  } = useTheme();

  const [activeTab, setActiveTab] = useState('colors');

  const tabs = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'animations', label: 'Animations', icon: Zap },
    { id: 'glass', label: 'Glass Effects', icon: Eye },
    { id: 'accessibility', label: 'Accessibility', icon: Contrast },
  ];

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
      >
        <motion.div
          className="glass-card-v2 w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-glass-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg glass-button">
                  <Settings className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Theme Settings</h2>
                  <p className="text-sm text-gray-600">Customize your Enhanced UI v2.0 experience</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <HoverScale>
                  <button
                    onClick={resetToDefaults}
                    className="glass-button p-2 rounded-lg text-gray-600 hover:text-blue-600"
                    title="Reset to defaults"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </HoverScale>
                
                <HoverScale>
                  <button
                    onClick={onClose}
                    className="glass-button p-2 rounded-lg text-gray-600 hover:text-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </HoverScale>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-4 flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-blue-500 text-white shadow-glow-blue' 
                        : 'glass-button hover:bg-glass-200'
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-96">
            <AnimatePresence mode="wait">
              {activeTab === 'colors' && (
                <motion.div
                  key="colors"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-semibold mb-4">Color Palettes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(colorPalettes).map(([key, palette]) => (
                      <motion.div
                        key={key}
                        className={`
                          glass-card p-4 cursor-pointer transition-all duration-200
                          ${currentPalette === key 
                            ? 'ring-2 ring-blue-500 bg-blue-50' 
                            : 'hover:bg-glass-100'
                          }
                        `}
                        onClick={() => changeColorPalette(key)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium">{palette.name}</span>
                          {currentPalette === key && (
                            <Check className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        
                        <div className="flex space-x-2 mb-3">
                          <div 
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: palette.primary }}
                          />
                          <div 
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: palette.secondary }}
                          />
                          <div 
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: palette.accent }}
                          />
                        </div>
                        
                        <div 
                          className="h-2 rounded-full"
                          style={{ background: palette.gradient }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'animations' && (
                <motion.div
                  key="animations"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-semibold mb-4">Animation Presets</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(animationPresets).map(([key, preset]) => (
                      <motion.div
                        key={key}
                        className={`
                          glass-card p-4 cursor-pointer transition-all duration-200
                          ${animationPreset === key 
                            ? 'ring-2 ring-blue-500 bg-blue-50' 
                            : 'hover:bg-glass-100'
                          }
                        `}
                        onClick={() => changeAnimationPreset(key)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{preset.name}</span>
                          {animationPreset === key && (
                            <Check className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3">
                          Duration: {preset.duration}ms
                        </div>
                        
                        <motion.div
                          className="w-full h-2 bg-blue-500 rounded-full"
                          animate={{ scaleX: [0, 1] }}
                          transition={{ 
                            duration: preset.duration / 1000,
                            ease: preset.easing,
                            repeat: Infinity,
                            repeatDelay: 1,
                          }}
                          style={{ transformOrigin: 'left' }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'glass' && (
                <motion.div
                  key="glass"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-semibold mb-4">Glass Morphism Intensity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(glassIntensity).map(([key, glass]) => (
                      <motion.div
                        key={key}
                        className={`
                          cursor-pointer transition-all duration-200 p-4 rounded-2xl border
                          ${glassLevel === key 
                            ? 'ring-2 ring-blue-500' 
                            : ''
                          }
                        `}
                        style={{
                          background: `rgba(255, 255, 255, ${glass.opacity})`,
                          backdropFilter: `blur(${glass.blur}px)`,
                          border: `1px solid rgba(255, 255, 255, ${glass.borderOpacity})`,
                        }}
                        onClick={() => changeGlassLevel(key)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{glass.name}</span>
                          {glassLevel === key && (
                            <Check className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          Blur: {glass.blur}px • Opacity: {(glass.opacity * 100).toFixed(0)}%
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'accessibility' && (
                <motion.div
                  key="accessibility"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-semibold mb-4">Accessibility Options</h3>
                  <div className="space-y-4">
                    {/* Reduced Motion */}
                    <div className="glass-card p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {reducedMotion ? (
                            <VolumeX className="w-5 h-5 text-gray-600" />
                          ) : (
                            <Volume2 className="w-5 h-5 text-blue-600" />
                          )}
                          <div>
                            <h4 className="font-medium">Reduced Motion</h4>
                            <p className="text-sm text-gray-600">
                              Minimize animations for better accessibility
                            </p>
                          </div>
                        </div>
                        
                        <motion.button
                          onClick={toggleReducedMotion}
                          className={`
                            relative w-12 h-6 rounded-full transition-colors duration-200
                            ${reducedMotion ? 'bg-blue-500' : 'bg-gray-300'}
                          `}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            animate={{
                              x: reducedMotion ? 24 : 4,
                            }}
                            transition={{ duration: 0.2 }}
                          />
                        </motion.button>
                      </div>
                    </div>

                    {/* High Contrast */}
                    <div className="glass-card p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Contrast className={`w-5 h-5 ${highContrast ? 'text-blue-600' : 'text-gray-600'}`} />
                          <div>
                            <h4 className="font-medium">High Contrast</h4>
                            <p className="text-sm text-gray-600">
                              Increase contrast for better visibility
                            </p>
                          </div>
                        </div>
                        
                        <motion.button
                          onClick={toggleHighContrast}
                          className={`
                            relative w-12 h-6 rounded-full transition-colors duration-200
                            ${highContrast ? 'bg-blue-500' : 'bg-gray-300'}
                          `}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            animate={{
                              x: highContrast ? 24 : 4,
                            }}
                            transition={{ duration: 0.2 }}
                          />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-glass-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Current theme: <span className="font-medium">{colors.name}</span>
              </div>
              
              <div className="flex space-x-3">
                <motion.button
                  onClick={onClose}
                  className="btn-glass px-4 py-2 text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  onClick={onClose}
                  className="btn-premium px-4 py-2 text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Apply Changes
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ThemeSettings;