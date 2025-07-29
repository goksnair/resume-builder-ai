import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Wand2, 
  Eye, 
  RefreshCw, 
  Save, 
  Download,
  Zap,
  Settings,
  Type,
  Palette,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Loader,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';

// Enhanced UI v2.0 compatible components
const AIContentGeneration = () => {
  const [contentType, setContentType] = useState('summary');
  const [userInput, setUserInput] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState('live');
  const [generationSettings, setGenerationSettings] = useState({
    tone: 'professional',
    length: 'medium',
    creativity: 0.7,
    industry: 'technology'
  });
  const [generationHistory, setGenerationHistory] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [realTimePreview, setRealTimePreview] = useState(true);
  const previewRef = useRef(null);
  const textareaRef = useRef(null);

  // Content types with enhanced configurations
  const contentTypes = [
    { 
      id: 'summary', 
      label: 'Professional Summary', 
      icon: Type,
      placeholder: 'Enter key skills, experience, and career objectives...',
      description: 'Generate compelling professional summaries'
    },
    { 
      id: 'experience', 
      label: 'Work Experience', 
      icon: Sparkles,
      placeholder: 'Describe your role, responsibilities, and achievements...',
      description: 'Transform job descriptions into impactful bullet points'
    },
    { 
      id: 'skills', 
      label: 'Skills Section', 
      icon: Zap,
      placeholder: 'List your technical and soft skills...',
      description: 'Organize and enhance your skills presentation'
    },
    { 
      id: 'achievements', 
      label: 'Key Achievements', 
      icon: CheckCircle,
      placeholder: 'Describe your accomplishments and impact...',
      description: 'Quantify and highlight your career wins'
    }
  ];

  // Real-time content generation with AI
  const generateContent = useCallback(async (input, isRealTime = false) => {
    if (!input.trim() || input.length < 10) return;

    if (!isRealTime) setIsGenerating(true);

    try {
      // Simulate AI API call - Replace with actual API integration
      const response = await fetch('/api/v1/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content_type: contentType,
          input: input,
          settings: generationSettings,
          real_time: isRealTime
        })
      });

      if (!response.ok) throw new Error('Generation failed');

      const data = await response.json();
      
      if (isRealTime && realTimePreview) {
        setGeneratedContent(data.content);
      } else if (!isRealTime) {
        setGeneratedContent(data.content);
        setGenerationHistory(prev => [...prev, {
          id: Date.now(),
          type: contentType,
          input: input,
          output: data.content,
          timestamp: new Date().toISOString(),
          settings: { ...generationSettings }
        }]);
      }
    } catch (error) {
      console.error('Content generation error:', error);
    } finally {
      if (!isRealTime) setIsGenerating(false);
    }
  }, [contentType, generationSettings, realTimePreview]);

  // Real-time preview with debouncing
  useEffect(() => {
    if (!realTimePreview || !userInput.trim()) return;

    const debounceTimer = setTimeout(() => {
      generateContent(userInput, true);
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [userInput, generateContent, realTimePreview]);

  // Enhanced typing animation for generated content
  const TypewriterEffect = ({ text, speed = 30 }) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      if (currentIndex < text.length) {
        const timer = setTimeout(() => {
          setDisplayText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, speed);

        return () => clearTimeout(timer);
      }
    }, [currentIndex, text, speed]);

    useEffect(() => {
      setDisplayText('');
      setCurrentIndex(0);
    }, [text]);

    return (
      <div className="whitespace-pre-wrap font-medium text-gray-800 leading-relaxed">
        {displayText}
        {currentIndex < text.length && (
          <motion.span
            className="inline-block w-0.5 h-5 bg-blue-500 ml-1"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="glass-strong rounded-2xl p-8 mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Wand2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Content Generation
                </h1>
                <p className="text-gray-600 mt-1">Transform your ideas into compelling resume content</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={() => setShowSettings(!showSettings)}
                className="glass-button p-3 rounded-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                onClick={() => setRealTimePreview(!realTimePreview)}
                className={`glass-button p-3 rounded-xl ${realTimePreview ? 'bg-blue-100' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Content Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contentTypes.map((type) => (
              <motion.button
                key={type.id}
                onClick={() => setContentType(type.id)}
                className={`glass-subtle p-4 rounded-xl text-left transition-all duration-300 ${
                  contentType === type.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-white/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <type.icon className={`w-5 h-5 ${
                    contentType === type.id ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <span className="font-medium">{type.label}</span>
                </div>
                <p className="text-sm text-gray-600">{type.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              className="glass-medium rounded-2xl p-6 mb-8"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Generation Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                  <select
                    value={generationSettings.tone}
                    onChange={(e) => setGenerationSettings(prev => ({...prev, tone: e.target.value}))}
                    className="glass-input w-full p-3 rounded-lg"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="executive">Executive</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
                  <select
                    value={generationSettings.length}
                    onChange={(e) => setGenerationSettings(prev => ({...prev, length: e.target.value}))}
                    className="glass-input w-full p-3 rounded-lg"
                  >
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Creativity: {Math.round(generationSettings.creativity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={generationSettings.creativity}
                    onChange={(e) => setGenerationSettings(prev => ({...prev, creativity: parseFloat(e.target.value)}))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <select
                    value={generationSettings.industry}
                    onChange={(e) => setGenerationSettings(prev => ({...prev, industry: e.target.value}))}
                    className="glass-input w-full p-3 rounded-lg"
                  >
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="marketing">Marketing</option>
                    <option value="education">Education</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Generation Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            className="glass-medium rounded-2xl p-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center">
                <Type className="w-5 h-5 mr-2" />
                Input Content
              </h3>
              
              <div className="flex space-x-2">
                <motion.button
                  onClick={() => generateContent(userInput)}
                  disabled={isGenerating || !userInput.trim()}
                  className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isGenerating ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
                </motion.button>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={contentTypes.find(t => t.id === contentType)?.placeholder}
              className="glass-input w-full h-64 p-4 rounded-lg resize-none text-gray-800 placeholder-gray-500"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            />

            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span>{userInput.length} characters</span>
                <span>{userInput.split(/\s+/).filter(w => w.length > 0).length} words</span>
              </div>
              
              {realTimePreview && (
                <div className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                  Live Preview Active
                </div>
              )}
            </div>
          </motion.div>

          {/* Real-time Preview Section */}
          <motion.div
            className="glass-medium rounded-2xl p-6"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Generated Content
              </h3>
              
              <div className="flex space-x-2">
                <motion.button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="glass-button p-2 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </motion.button>
                
                <motion.button
                  className="glass-button p-2 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Save className="w-4 h-4" />
                </motion.button>
                
                <motion.button
                  className="glass-button p-2 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            <div 
              ref={previewRef}
              className="bg-white/50 rounded-lg p-4 min-h-64 border border-gray-200/50"
            >
              {generatedContent ? (
                isPlaying ? (
                  <TypewriterEffect text={generatedContent} speed={50} />
                ) : (
                  <div className="whitespace-pre-wrap font-medium text-gray-800 leading-relaxed">
                    {generatedContent}
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Generated content will appear here</p>
                    <p className="text-sm mt-1">Start typing to see real-time AI suggestions</p>
                  </div>
                </div>
              )}
            </div>

            {generatedContent && (
              <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <span>{generatedContent.length} characters</span>
                  <span>{generatedContent.split(/\s+/).filter(w => w.length > 0).length} words</span>
                </div>
                
                <div className="flex items-center text-blue-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Generated
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Generation History */}
        {generationHistory.length > 0 && (
          <motion.div
            className="glass-medium rounded-2xl p-6 mt-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <RefreshCw className="w-5 h-5 mr-2" />
              Generation History
            </h3>
            
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {generationHistory.slice(-5).reverse().map((item) => (
                <motion.div
                  key={item.id}
                  className="glass-subtle p-4 rounded-lg"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{item.type}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 truncate">{item.output}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AIContentGeneration;