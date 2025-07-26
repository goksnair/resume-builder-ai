import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
    Palette,
    Monitor,
    Smartphone,
    Eye,
    Zap,
    Sparkles,
    Brush,
    Brain,
    FileText,
    Star,
    ArrowLeft,
    Check,
    Copy
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Simple Badge component inline
const Badge = ({ children, variant = 'default', className = '' }) => {
    const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
    const variants = {
        default: 'bg-gray-100 text-gray-800',
        secondary: 'bg-gray-100 text-gray-600',
        success: 'bg-green-100 text-green-800',
    };
    const variantStyles = variants[variant] || variants.default;
    return (
        <span className={`${baseStyles} ${variantStyles} ${className}`}>
            {children}
        </span>
    );
};

const TemplateExplorerPage = () => {
    const [selectedTemplate, setSelectedTemplate] = useState('modern-saas');
    const [selectedColorScheme, setSelectedColorScheme] = useState('cool-tech');
    const [viewMode, setViewMode] = useState('desktop');
    const [isApplying, setIsApplying] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    // Function to apply the selected template
    const handleApplyTemplate = () => {
        try {
            setIsApplying(true);

            // Store template configuration in localStorage
            const templateConfig = {
                template: selectedTemplate,
                colorScheme: selectedColorScheme,
                templateData: templates[selectedTemplate],
                colorData: colorSchemes[selectedColorScheme],
                appliedAt: new Date().toISOString()
            };

            localStorage.setItem('appliedTemplate', JSON.stringify(templateConfig));

            // Show success state
            setTimeout(() => {
                setIsApplying(false);
                setShowSuccess(true);

                // Navigate to AI dashboard after 1.5 seconds
                setTimeout(() => {
                    navigate('/ai', { state: { templateApplied: true, templateConfig } });
                }, 1500);
            }, 1000);
        } catch (error) {
            console.error('Error applying template:', error);
            setIsApplying(false);
            // Could add error state here if needed
        }
    };

    // Function to copy template configuration
    const handleCopyConfig = () => {
        try {
            const templateConfig = {
                template: selectedTemplate,
                colorScheme: selectedColorScheme,
                templateData: templates[selectedTemplate],
                colorData: colorSchemes[selectedColorScheme]
            };

            navigator.clipboard.writeText(JSON.stringify(templateConfig, null, 2));

            // Show temporary success feedback
            const originalText = document.querySelector('.copy-button-text');
            if (originalText) {
                originalText.textContent = 'Copied!';
                setTimeout(() => {
                    originalText.textContent = 'Copy Config';
                }, 2000);
            }
        } catch (error) {
            console.error('Error copying config:', error);
            // Fallback: could show an error message
        }
    };

    const templates = {
        'modern-saas': {
            name: 'Modern SaaS',
            description: 'Clean, professional design inspired by Linear, Notion, and Stripe',
            category: 'Professional',
            popularity: 95,
            features: ['Clean Typography', 'Subtle Animations', 'Professional Feel'],
        },
        'creative-bold': {
            name: 'Creative Bold',
            description: 'Visual-heavy design inspired by Dribbble, Behance',
            category: 'Creative',
            popularity: 87,
            features: ['Bold Colors', 'Visual Impact', 'Creative Elements'],
        },
        'ai-futuristic': {
            name: 'AI Futuristic',
            description: 'Tech-forward design inspired by OpenAI, Anthropic',
            category: 'Technology',
            popularity: 92,
            features: ['Futuristic', 'AI-themed', 'Dark Mode'],
        },
        'minimal-elegant': {
            name: 'Minimal Elegant',
            description: 'Clean and sophisticated design inspired by Apple',
            category: 'Minimal',
            popularity: 89,
            features: ['Minimal', 'Elegant', 'Sophisticated'],
        },
        'glassmorphism': {
            name: 'Glassmorphism',
            description: 'Trendy glass effect design inspired by iOS and modern web apps',
            category: 'Modern',
            popularity: 91,
            features: ['Glass Effects', 'Blur Backdrop', 'Transparency'],
        },
        'neuomorphism': {
            name: 'Neuomorphism',
            description: 'Soft UI design with realistic depth and tactile feel',
            category: 'Modern',
            popularity: 85,
            features: ['Soft Shadows', 'Tactile Feel', 'Depth'],
        },
        'web3-crypto': {
            name: 'Web3 & Crypto',
            description: 'Blockchain-inspired design with neon accents and dark themes',
            category: 'Technology',
            popularity: 88,
            features: ['Neon Accents', 'Crypto Themes', 'Gradients'],
        },
        'nordic-minimal': {
            name: 'Nordic Minimal',
            description: 'Scandinavian design principles with clean lines and nature tones',
            category: 'Minimal',
            popularity: 93,
            features: ['Nature Tones', 'Clean Lines', 'Scandinavian'],
        },
        'brutalist-modern': {
            name: 'Brutalist Modern',
            description: 'Bold typography and geometric shapes inspired by contemporary art',
            category: 'Creative',
            popularity: 79,
            features: ['Bold Typography', 'Geometric', 'Artistic'],
        },
        'wellness-organic': {
            name: 'Wellness & Organic',
            description: 'Calming design inspired by health and wellness platforms',
            category: 'Lifestyle',
            popularity: 86,
            features: ['Calming Colors', 'Organic Shapes', 'Wellness'],
        },
        'micro-interactions': {
            name: 'Micro Interactions',
            description: 'Subtle animations and hover effects inspired by Stripe and Linear',
            category: 'Interactive',
            popularity: 94,
            features: ['Subtle Animations', 'Micro Interactions', 'Smooth Transitions'],
        },
        'data-visualization': {
            name: 'Data Visualization',
            description: 'Chart-heavy design inspired by analytics dashboards',
            category: 'Professional',
            popularity: 90,
            features: ['Data Focus', 'Charts & Graphs', 'Analytics'],
        },
        'magazine-editorial': {
            name: 'Magazine Editorial',
            description: 'Typography-focused design inspired by Vogue and Medium',
            category: 'Editorial',
            popularity: 87,
            features: ['Editorial Layout', 'Typography Focus', 'Clean Reading'],
        },
        'startup-portfolio': {
            name: 'Startup Portfolio',
            description: 'Y-Combinator inspired minimalist startup aesthetic',
            category: 'Startup',
            popularity: 92,
            features: ['Startup Feel', 'Bold Headlines', 'Growth Focus'],
        },
        'luxury-premium': {
            name: 'Luxury Premium',
            description: 'High-end design inspired by luxury brands like Tesla and Apple',
            category: 'Luxury',
            popularity: 89,
            features: ['Premium Feel', 'Luxury Aesthetics', 'Refined'],
        },
        'artistic-creative': {
            name: 'Artistic Creative',
            description: 'Portfolio-style design inspired by Behance and creative agencies',
            category: 'Creative',
            popularity: 85,
            features: ['Artistic Layout', 'Creative Freedom', 'Visual Portfolio'],
        },
        'sustainable-eco': {
            name: 'Sustainable Eco',
            description: 'Earth-friendly design inspired by environmental organizations',
            category: 'Eco',
            popularity: 83,
            features: ['Earth Tones', 'Sustainable Theme', 'Organic Elements'],
        },
        'fintech-professional': {
            name: 'FinTech Professional',
            description: 'Finance-focused design inspired by Robinhood and modern banks',
            category: 'Finance',
            popularity: 91,
            features: ['Financial Focus', 'Trust Building', 'Data Security'],
        },
    };

    const colorSchemes = {
        'cool-tech': {
            name: 'Cool Tech',
            description: 'Professional blue and purple tones',
            primary: '#3B82F6',
            secondary: '#8B5CF6',
            accent: '#06D6A0',
            background: '#F8FAFC',
            dark: '#1E293B',
        },
        'warm-energy': {
            name: 'Warm Energy',
            description: 'Vibrant amber and red energy',
            primary: '#F59E0B',
            secondary: '#EF4444',
            accent: '#8B5CF6',
            background: '#FFFBEB',
            dark: '#92400E',
        },
        'ai-future': {
            name: 'AI Future',
            description: 'Dark futuristic with neon accents',
            primary: '#A855F7',
            secondary: '#06B6D4',
            accent: '#F97316',
            background: '#0F172A',
            light: '#F8FAFC',
        },
        'monochrome': {
            name: 'Monochrome',
            description: 'Elegant black and white',
            primary: '#000000',
            secondary: '#6B7280',
            accent: '#9CA3AF',
            background: '#FFFFFF',
            dark: '#000000',
        },
        'glass-blue': {
            name: 'Glass Blue',
            description: 'Frosted glass effect with blue tones',
            primary: '#0EA5E9',
            secondary: '#3B82F6',
            accent: '#8B5CF6',
            background: 'rgba(248, 250, 252, 0.8)',
            dark: '#0F172A',
        },
        'neo-soft': {
            name: 'Neo Soft',
            description: 'Soft neuomorphic grays and whites',
            primary: '#64748B',
            secondary: '#94A3B8',
            accent: '#3B82F6',
            background: '#F1F5F9',
            dark: '#334155',
        },
        'crypto-neon': {
            name: 'Crypto Neon',
            description: 'Neon green and purple for crypto themes',
            primary: '#10B981',
            secondary: '#A855F7',
            accent: '#F59E0B',
            background: '#111827',
            light: '#F9FAFB',
        },
        'nordic-nature': {
            name: 'Nordic Nature',
            description: 'Scandinavian nature-inspired palette',
            primary: '#059669',
            secondary: '#0891B2',
            accent: '#D97706',
            background: '#F0FDF4',
            dark: '#064E3B',
        },
        'brutalist-contrast': {
            name: 'Brutalist Contrast',
            description: 'High-contrast bold colors',
            primary: '#DC2626',
            secondary: '#000000',
            accent: '#FBBF24',
            background: '#FFFFFF',
            dark: '#1F2937',
        },
        'wellness-sage': {
            name: 'Wellness Sage',
            description: 'Calming sage and earth tones',
            primary: '#84CC16',
            secondary: '#22C55E',
            accent: '#F59E0B',
            background: '#F7FEE7',
            dark: '#365314',
        },
        'micro-blue': {
            name: 'Micro Blue',
            description: 'Soft blues with interactive highlights',
            primary: '#3B82F6',
            secondary: '#06B6D4',
            accent: '#8B5CF6',
            background: '#F8FAFC',
            dark: '#1E293B',
        },
        'data-insights': {
            name: 'Data Insights',
            description: 'Professional analytics color palette',
            primary: '#6366F1',
            secondary: '#10B981',
            accent: '#F59E0B',
            background: '#FAFAFA',
            dark: '#374151',
        },
        'editorial-classic': {
            name: 'Editorial Classic',
            description: 'Classic editorial black and white with red accent',
            primary: '#000000',
            secondary: '#4B5563',
            accent: '#DC2626',
            background: '#FFFFFF',
            dark: '#111827',
        },
        'startup-orange': {
            name: 'Startup Orange',
            description: 'Bold orange and blue startup energy',
            primary: '#F97316',
            secondary: '#3B82F6',
            accent: '#10B981',
            background: '#FFF7ED',
            dark: '#1F2937',
        },
        'luxury-gold': {
            name: 'Luxury Gold',
            description: 'Premium gold and charcoal elegance',
            primary: '#D97706',
            secondary: '#374151',
            accent: '#6B7280',
            background: '#FFFBEB',
            dark: '#1F2937',
        },
        'artistic-rainbow': {
            name: 'Artistic Rainbow',
            description: 'Creative multi-color gradient palette',
            primary: '#8B5CF6',
            secondary: '#F59E0B',
            accent: '#EF4444',
            background: '#FAFAFA',
            dark: '#1F2937',
        },
        'eco-forest': {
            name: 'Eco Forest',
            description: 'Natural forest green and earth tones',
            primary: '#059669',
            secondary: '#65A30D',
            accent: '#D97706',
            background: '#F0FDF4',
            dark: '#064E3B',
        },
        'fintech-navy': {
            name: 'FinTech Navy',
            description: 'Professional navy with trust-building blues',
            primary: '#1E40AF',
            secondary: '#3B82F6',
            accent: '#10B981',
            background: '#F8FAFC',
            dark: '#1E293B',
        },
    };

    const PreviewComponent = ({ template, colorScheme }) => {
        const colors = colorSchemes[colorScheme];
        const isLight = colorScheme !== 'ai-future';

        if (template === 'modern-saas') {
            return (
                <div
                    className="p-8 rounded-xl transition-all duration-500 hover:scale-[1.02]"
                    style={{
                        backgroundColor: colors.background,
                        color: isLight ? colors.dark : (colors.light || '#FFFFFF'),
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }}
                >
                    <div className="space-y-8">
                        <header className="text-center">
                            <div className="flex justify-center mb-4">
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                    style={{
                                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                                    }}
                                >
                                    <Brain className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold mb-3" style={{ color: colors.primary }}>
                                Resume Builder AI
                            </h1>
                            <p className="text-lg opacity-80 max-w-md mx-auto">
                                Professional resumes powered by intelligent design
                            </p>
                        </header>

                        <div className="grid grid-cols-2 gap-6">
                            <div
                                className="p-6 rounded-xl border hover:shadow-lg transition-all duration-300"
                                style={{
                                    backgroundColor: isLight ? 'white' : (colors.dark || '#1F2937'),
                                    borderColor: colors.secondary + '30'
                                }}
                            >
                                <Brain className="w-10 h-10 mb-4" style={{ color: colors.accent }} />
                                <h3 className="font-semibold text-lg mb-2">AI Analysis</h3>
                                <p className="text-sm opacity-70">Smart optimization for ATS systems</p>
                            </div>
                            <div
                                className="p-6 rounded-xl border hover:shadow-lg transition-all duration-300"
                                style={{
                                    backgroundColor: isLight ? 'white' : (colors.dark || '#1F2937'),
                                    borderColor: colors.secondary + '30'
                                }}
                            >
                                <FileText className="w-10 h-10 mb-4" style={{ color: colors.primary }} />
                                <h3 className="font-semibold text-lg mb-2">Templates</h3>
                                <p className="text-sm opacity-70">Professional designs that work</p>
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                className="px-8 py-4 rounded-xl font-semibold text-white hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                style={{
                                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                                }}
                            >
                                Start Building Now →
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        if (template === 'creative-bold') {
            return (
                <div
                    className="p-8 rounded-xl relative overflow-hidden hover:scale-[1.02] transition-all duration-500"
                    style={{
                        background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15, ${colors.accent}15)`,
                        color: isLight ? colors.dark : (colors.light || '#FFFFFF'),
                        border: `2px solid ${colors.primary}30`
                    }}
                >
                    <div className="relative z-10 space-y-8">
                        <header className="text-center">
                            <div className="flex justify-center mb-6">
                                <div
                                    className="w-20 h-20 rounded-full flex items-center justify-center"
                                    style={{
                                        background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`
                                    }}
                                >
                                    <Sparkles className="w-10 h-10 text-white" />
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold mb-3">
                                <span
                                    className="bg-gradient-to-r bg-clip-text text-transparent"
                                    style={{
                                        backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                                    }}
                                >
                                    Creative Resume AI
                                </span>
                            </h1>
                            <p className="text-lg font-medium">
                                Where creativity meets intelligence ✨
                            </p>
                        </header>

                        <div className="grid grid-cols-3 gap-4">
                            {[colors.primary, colors.secondary, colors.accent].map((color, i) => (
                                <div
                                    key={i}
                                    className="h-24 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer"
                                    style={{ backgroundColor: color + '20', border: `2px solid ${color}40` }}
                                >
                                    <div
                                        className="w-12 h-12 rounded-full shadow-lg animate-pulse"
                                        style={{ backgroundColor: color }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="text-center">
                            <button
                                className="px-10 py-5 rounded-full font-bold text-white text-lg shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
                                style={{
                                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`
                                }}
                            >
                                Create Magic ✨
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        if (template === 'ai-futuristic') {
            return (
                <div
                    className="p-8 rounded-xl relative overflow-hidden hover:scale-[1.02] transition-all duration-500"
                    style={{
                        backgroundColor: colors.background,
                        color: colors.light || colors.dark,
                        border: `1px solid ${colors.primary}50`,
                        boxShadow: `0 0 30px ${colors.primary}20`
                    }}
                >
                    <div className="space-y-8">
                        <header className="text-center">
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div
                                        className="w-16 h-16 rounded-full animate-pulse border-2"
                                        style={{
                                            backgroundColor: colors.primary + '30',
                                            borderColor: colors.primary
                                        }}
                                    />
                                    <div
                                        className="absolute inset-0 w-16 h-16 rounded-full animate-ping opacity-20"
                                        style={{ backgroundColor: colors.secondary }}
                                    />
                                    <div className="absolute inset-4 w-8 h-8 rounded-full bg-white" />
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold mb-3 font-mono tracking-wide">
                                <span style={{ color: colors.primary }}>AI.RESUME</span>
                                <span style={{ color: colors.secondary }}>.BUILD</span>
                            </h1>
                            <p className="text-sm font-mono opacity-90 tracking-wider">
                                &gt; POWERED_BY_NEURAL_NETWORKS.exe
                            </p>
                        </header>

                        <div className="space-y-4">
                            <div
                                className="p-4 rounded-lg border-l-4 bg-opacity-20 hover:bg-opacity-30 transition-all duration-300"
                                style={{
                                    borderLeftColor: colors.accent,
                                    backgroundColor: colors.accent + '20'
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-3 h-3 rounded-full animate-pulse"
                                        style={{ backgroundColor: colors.accent }}
                                    />
                                    <span className="font-mono text-sm">NEURAL_ANALYSIS: 97.3% COMPLETE</span>
                                </div>
                            </div>
                            <div
                                className="p-4 rounded-lg border-l-4 bg-opacity-20 hover:bg-opacity-30 transition-all duration-300"
                                style={{
                                    borderLeftColor: colors.secondary,
                                    backgroundColor: colors.secondary + '20'
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-3 h-3 rounded-full animate-pulse"
                                        style={{ backgroundColor: colors.secondary }}
                                    />
                                    <span className="font-mono text-sm">OPTIMIZATION: ACTIVE</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                className="px-8 py-4 rounded-lg border-2 font-mono text-sm hover:bg-opacity-20 transition-all duration-300 hover:shadow-lg"
                                style={{
                                    borderColor: colors.primary,
                                    color: colors.primary,
                                    backgroundColor: colors.primary + '10',
                                    boxShadow: `0 0 20px ${colors.primary}30`
                                }}
                            >
                                &gt; INITIATE_ANALYSIS.exe
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        if (template === 'minimal-elegant') {
            return (
                <div
                    className="p-12 rounded-2xl hover:scale-[1.02] transition-all duration-500"
                    style={{
                        backgroundColor: colors.background,
                        color: isLight ? colors.dark : (colors.light || '#FFFFFF'),
                        border: `1px solid ${colors.secondary}20`
                    }}
                >
                    <div className="space-y-12 max-w-md mx-auto">
                        <header className="text-center">
                            <div className="w-1 h-16 mx-auto mb-8" style={{ backgroundColor: colors.primary }} />
                            <h1 className="text-3xl font-light mb-4 tracking-wide" style={{ color: colors.primary }}>
                                Resume Builder
                            </h1>
                            <p className="text-base opacity-70 font-light leading-relaxed">
                                Elegant simplicity meets professional excellence
                            </p>
                        </header>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 hover:bg-opacity-5 hover:bg-black transition-all duration-300 rounded-lg">
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: colors.accent }}
                                />
                                <span className="font-light">AI-powered optimization</span>
                            </div>
                            <div className="flex items-center gap-4 p-4 hover:bg-opacity-5 hover:bg-black transition-all duration-300 rounded-lg">
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: colors.primary }}
                                />
                                <span className="font-light">Minimal, clean design</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                className="px-8 py-3 font-light tracking-wide border hover:bg-opacity-5 hover:bg-black transition-all duration-300"
                                style={{
                                    borderColor: colors.primary,
                                    color: colors.primary
                                }}
                            >
                                Begin
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // Add preview components for new templates
        if (template === 'micro-interactions') {
            return (
                <div
                    className="p-8 rounded-xl hover:scale-[1.02] transition-all duration-500"
                    style={{
                        backgroundColor: colors.background,
                        color: isLight ? colors.dark : (colors.light || '#FFFFFF'),
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                    }}
                >
                    <div className="space-y-8">
                        <header className="text-center">
                            <div className="flex justify-center mb-4">
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center hover:rotate-12 transition-transform duration-300"
                                    style={{ backgroundColor: colors.primary }}
                                >
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <h1 className="text-3xl font-semibold mb-2" style={{ color: colors.primary }}>
                                Interactive Resume
                            </h1>
                            <p className="text-gray-600">Hover, click, and engage</p>
                        </header>

                        <div className="grid grid-cols-2 gap-4">
                            <div
                                className="p-4 rounded-lg border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                style={{
                                    backgroundColor: isLight ? 'white' : colors.dark,
                                    borderColor: colors.secondary + '30'
                                }}
                            >
                                <div className="w-8 h-8 rounded mb-3 hover:scale-110 transition-transform duration-200" style={{ backgroundColor: colors.accent }} />
                                <h3 className="font-medium mb-1">Smooth Animations</h3>
                                <p className="text-sm opacity-70">Delightful micro-interactions</p>
                            </div>
                            <div
                                className="p-4 rounded-lg border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                style={{
                                    backgroundColor: isLight ? 'white' : colors.dark,
                                    borderColor: colors.secondary + '30'
                                }}
                            >
                                <div className="w-8 h-8 rounded mb-3 hover:scale-110 transition-transform duration-200" style={{ backgroundColor: colors.primary }} />
                                <h3 className="font-medium mb-1">Interactive Elements</h3>
                                <p className="text-sm opacity-70">Engaging user experience</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (template === 'data-visualization') {
            return (
                <div
                    className="p-8 rounded-xl"
                    style={{
                        backgroundColor: colors.background,
                        color: isLight ? colors.dark : (colors.light || '#FFFFFF')
                    }}
                >
                    <div className="space-y-6">
                        <header className="text-center mb-8">
                            <h1 className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>
                                Analytics Dashboard
                            </h1>
                            <p className="text-gray-600">Data-driven resume insights</p>
                        </header>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: colors.primary + '10' }}>
                                <div className="text-2xl font-bold" style={{ color: colors.primary }}>94%</div>
                                <div className="text-sm text-gray-600">ATS Score</div>
                            </div>
                            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: colors.secondary + '10' }}>
                                <div className="text-2xl font-bold" style={{ color: colors.secondary }}>127</div>
                                <div className="text-sm text-gray-600">Skills</div>
                            </div>
                            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: colors.accent + '10' }}>
                                <div className="text-2xl font-bold" style={{ color: colors.accent }}>8.5</div>
                                <div className="text-sm text-gray-600">Years Exp</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Frontend Development</span>
                                <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                                    <div className="h-2 rounded-full" style={{ backgroundColor: colors.primary, width: '90%' }} />
                                </div>
                                <span className="text-sm">90%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Data Analysis</span>
                                <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                                    <div className="h-2 rounded-full" style={{ backgroundColor: colors.secondary, width: '75%' }} />
                                </div>
                                <span className="text-sm">75%</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (template === 'magazine-editorial') {
            return (
                <div
                    className="p-12 rounded-xl"
                    style={{
                        backgroundColor: colors.background,
                        color: isLight ? colors.dark : (colors.light || '#FFFFFF')
                    }}
                >
                    <div className="max-w-2xl mx-auto">
                        <header className="mb-12">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-1" style={{ backgroundColor: colors.accent }} />
                                <span className="text-sm uppercase tracking-wider opacity-70">Professional Profile</span>
                            </div>
                            <h1 className="text-5xl font-light leading-tight mb-4" style={{ color: colors.primary }}>
                                Editorial
                                <br />
                                <span className="font-bold">Resume</span>
                            </h1>
                            <p className="text-xl leading-relaxed opacity-80">
                                Typography-focused design that tells your story with elegance and clarity.
                            </p>
                        </header>

                        <div className="space-y-8">
                            <div className="border-l-2 pl-6" style={{ borderColor: colors.secondary }}>
                                <h3 className="text-lg font-semibold mb-2">Experience Highlights</h3>
                                <p className="leading-relaxed text-gray-600">
                                    Crafted compelling narratives that showcase professional achievements with editorial precision.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 pt-8 border-t" style={{ borderColor: colors.secondary + '30' }}>
                                <div>
                                    <h4 className="font-medium mb-2" style={{ color: colors.accent }}>Education</h4>
                                    <p className="text-sm opacity-70">Master of Design</p>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2" style={{ color: colors.accent }}>Skills</h4>
                                    <p className="text-sm opacity-70">Editorial Design, Typography</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (template === 'startup-portfolio') {
            return (
                <div
                    className="p-8 rounded-xl"
                    style={{
                        backgroundColor: colors.background,
                        color: isLight ? colors.dark : (colors.light || '#FFFFFF')
                    }}
                >
                    <div className="space-y-8">
                        <header className="text-left">
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-3 h-3 rounded-full animate-pulse"
                                    style={{ backgroundColor: colors.accent }}
                                />
                                <span className="text-sm font-medium uppercase tracking-wide" style={{ color: colors.secondary }}>
                                    Building the Future
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold mb-3" style={{ color: colors.primary }}>
                                Startup Founder
                            </h1>
                            <p className="text-lg text-gray-600 mb-6">
                                0 → 1 builder with a track record of turning ideas into reality
                            </p>

                            <div className="flex gap-4 mb-8">
                                <div className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: colors.primary + '15', color: colors.primary }}>
                                    📈 Growth Hacking
                                </div>
                                <div className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: colors.secondary + '15', color: colors.secondary }}>
                                    🚀 Product Launch
                                </div>
                            </div>
                        </header>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-lg hover:shadow-md transition-shadow" style={{ backgroundColor: isLight ? 'white' : colors.dark }}>
                                <div>
                                    <h3 className="font-semibold">AI SaaS Platform</h3>
                                    <p className="text-sm opacity-70">Founder & CEO • 2023-Present</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium" style={{ color: colors.accent }}>$2M ARR</div>
                                    <div className="text-xs opacity-70">50K+ users</div>
                                </div>
                            </div>
                        </div>

                        <button
                            className="w-full py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
                            style={{
                                backgroundColor: colors.primary,
                                color: 'white'
                            }}
                        >
                            Let's Build Together →
                        </button>
                    </div>
                </div>
            );
        }

        if (template === 'luxury-premium') {
            return (
                <div
                    className="p-12 rounded-2xl"
                    style={{
                        backgroundColor: colors.background,
                        color: isLight ? colors.dark : (colors.light || '#FFFFFF'),
                        border: `1px solid ${colors.secondary}20`
                    }}
                >
                    <div className="max-w-lg mx-auto text-center space-y-10">
                        <header>
                            <div className="flex justify-center mb-8">
                                <div
                                    className="w-20 h-20 rounded-full border-4 flex items-center justify-center"
                                    style={{ borderColor: colors.primary + '30' }}
                                >
                                    <div
                                        className="w-12 h-12 rounded-full"
                                        style={{ backgroundColor: colors.primary }}
                                    />
                                </div>
                            </div>
                            <h1 className="text-4xl font-light mb-4 tracking-wide" style={{ color: colors.primary }}>
                                PREMIUM
                            </h1>
                            <div className="w-24 h-0.5 mx-auto mb-6" style={{ backgroundColor: colors.accent }} />
                            <p className="text-lg leading-relaxed opacity-80">
                                Sophisticated professional profile crafted with luxury aesthetics and refined elegance.
                            </p>
                        </header>

                        <div className="space-y-6">
                            <div className="p-6 border rounded-xl hover:shadow-lg transition-all duration-300" style={{ borderColor: colors.secondary + '20' }}>
                                <div className="text-2xl mb-2" style={{ color: colors.accent }}>✦</div>
                                <h3 className="font-semibold mb-2">Executive Excellence</h3>
                                <p className="text-sm opacity-70 leading-relaxed">
                                    Premium positioning for C-level professionals
                                </p>
                            </div>
                        </div>

                        <button
                            className="px-12 py-4 border-2 font-medium tracking-wide hover:shadow-lg transition-all duration-300"
                            style={{
                                borderColor: colors.primary,
                                color: colors.primary,
                                backgroundColor: 'transparent'
                            }}
                        >
                            DISCOVER MORE
                        </button>
                    </div>
                </div>
            );
        }

        if (template === 'artistic-creative') {
            return (
                <div
                    className="p-8 rounded-xl relative overflow-hidden"
                    style={{
                        background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10, ${colors.accent}10)`,
                        color: isLight ? colors.dark : (colors.light || '#FFFFFF')
                    }}
                >
                    <div className="relative z-10 space-y-8">
                        <header className="text-center">
                            <div className="flex justify-center mb-6">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: colors.primary }} />
                                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: colors.secondary }} />
                                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: colors.accent }} />
                                    <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: colors.primary + '60' }} />
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold mb-3">
                                <span style={{ color: colors.primary }}>Creative</span>{' '}
                                <span style={{ color: colors.secondary }}>Portfolio</span>
                            </h1>
                            <p className="text-lg opacity-80">Where art meets profession</p>
                        </header>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div
                                    className="h-24 rounded-xl relative overflow-hidden hover:scale-105 transition-transform duration-300"
                                    style={{ background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})` }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                                        PROJECT 1
                                    </div>
                                </div>
                                <div
                                    className="h-16 rounded-xl relative overflow-hidden hover:scale-105 transition-transform duration-300"
                                    style={{ background: `linear-gradient(45deg, ${colors.accent}, ${colors.primary})` }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center text-white font-medium text-sm">
                                        DESIGN WORK
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="font-bold text-lg" style={{ color: colors.secondary }}>
                                    Visual Artist & Designer
                                </h3>
                                <p className="text-sm opacity-70 leading-relaxed">
                                    Creating impactful visual experiences through innovative design and artistic expression.
                                </p>
                                <div className="flex gap-2 flex-wrap mt-4">
                                    {['Art Direction', 'Branding', 'Digital Design'].map((skill, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 rounded-full text-xs font-medium"
                                            style={{
                                                backgroundColor: [colors.primary, colors.secondary, colors.accent][i] + '20',
                                                color: [colors.primary, colors.secondary, colors.accent][i]
                                            }}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (template === 'sustainable-eco') {
            return (
                <div
                    className="p-8 rounded-xl"
                    style={{
                        backgroundColor: colors.background,
                        color: isLight ? colors.dark : (colors.light || '#FFFFFF')
                    }}
                >
                    <div className="space-y-8">
                        <header className="text-center">
                            <div className="flex justify-center mb-6">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center border-4"
                                    style={{
                                        backgroundColor: colors.primary + '20',
                                        borderColor: colors.primary + '40'
                                    }}
                                >
                                    <span className="text-2xl">🌱</span>
                                </div>
                            </div>
                            <h1 className="text-3xl font-semibold mb-3" style={{ color: colors.primary }}>
                                Sustainable Professional
                            </h1>
                            <p className="text-gray-600 leading-relaxed">
                                Committed to environmental responsibility and sustainable business practices
                            </p>
                        </header>

                        <div className="space-y-4">
                            <div
                                className="p-4 rounded-lg border-l-4"
                                style={{
                                    backgroundColor: colors.primary + '10',
                                    borderLeftColor: colors.primary
                                }}
                            >
                                <h3 className="font-semibold mb-1" style={{ color: colors.primary }}>
                                    🌍 Environmental Impact
                                </h3>
                                <p className="text-sm opacity-80">
                                    Led initiatives resulting in 40% carbon footprint reduction
                                </p>
                            </div>

                            <div
                                className="p-4 rounded-lg border-l-4"
                                style={{
                                    backgroundColor: colors.secondary + '10',
                                    borderLeftColor: colors.secondary
                                }}
                            >
                                <h3 className="font-semibold mb-1" style={{ color: colors.secondary }}>
                                    ♻️ Circular Economy
                                </h3>
                                <p className="text-sm opacity-80">
                                    Developed sustainable supply chain solutions
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                className="px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300"
                                style={{
                                    backgroundColor: colors.primary,
                                    color: 'white'
                                }}
                            >
                                🌿 Connect for Change
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        if (template === 'fintech-professional') {
            return (
                <div
                    className="p-8 rounded-xl"
                    style={{
                        backgroundColor: colors.background,
                        color: isLight ? colors.dark : (colors.light || '#FFFFFF'),
                        border: `1px solid ${colors.primary}20`
                    }}
                >
                    <div className="space-y-8">
                        <header className="text-center">
                            <div className="flex justify-center mb-4">
                                <div
                                    className="w-14 h-14 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: colors.primary }}
                                >
                                    <span className="text-white text-xl font-bold">₿</span>
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold mb-3" style={{ color: colors.primary }}>
                                FinTech Professional
                            </h1>
                            <p className="text-gray-600">
                                Building the future of financial technology
                            </p>
                        </header>

                        <div className="grid grid-cols-2 gap-4">
                            <div
                                className="p-4 rounded-lg border text-center hover:shadow-md transition-shadow"
                                style={{
                                    backgroundColor: isLight ? 'white' : colors.dark,
                                    borderColor: colors.secondary + '30'
                                }}
                            >
                                <div className="text-2xl font-bold mb-1" style={{ color: colors.secondary }}>
                                    $50M+
                                </div>
                                <div className="text-sm opacity-70">Transactions Processed</div>
                            </div>

                            <div
                                className="p-4 rounded-lg border text-center hover:shadow-md transition-shadow"
                                style={{
                                    backgroundColor: isLight ? 'white' : colors.dark,
                                    borderColor: colors.accent + '30'
                                }}
                            >
                                <div className="text-2xl font-bold mb-1" style={{ color: colors.accent }}>
                                    99.9%
                                </div>
                                <div className="text-sm opacity-70">System Uptime</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
                                <span className="text-sm">Blockchain & DeFi Expertise</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.secondary }} />
                                <span className="text-sm">Risk Management & Compliance</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }} />
                                <span className="text-sm">Payment Systems Architecture</span>
                            </div>
                        </div>

                        <button
                            className="w-full py-3 rounded-lg font-semibold border hover:shadow-lg transition-all duration-300"
                            style={{
                                borderColor: colors.primary,
                                color: colors.primary,
                                backgroundColor: 'transparent'
                            }}
                        >
                            🔒 Secure Connection
                        </button>
                    </div>
                </div>
            );
        }

        // Missing template previews - adding them now
        if (template === 'glassmorphism') {
            return (
                <div
                    className="p-8 rounded-2xl relative overflow-hidden backdrop-blur-lg hover:scale-[1.02] transition-all duration-500"
                    style={{
                        background: `linear-gradient(135deg, ${colors.background}80, ${colors.primary}10, ${colors.secondary}10)`,
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${colors.primary}30`,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }}
                >
                    <div className="relative z-10 space-y-8">
                        <header className="text-center">
                            <div className="flex justify-center mb-6">
                                <div
                                    className="w-16 h-16 rounded-2xl backdrop-blur-md flex items-center justify-center border"
                                    style={{
                                        background: `linear-gradient(135deg, ${colors.primary}40, ${colors.secondary}40)`,
                                        borderColor: colors.primary + '50'
                                    }}
                                >
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold mb-3" style={{ color: colors.primary }}>
                                Glass Resume
                            </h1>
                            <p className="text-lg opacity-80">
                                Modern glassmorphism design with depth and transparency
                            </p>
                        </header>

                        <div className="grid grid-cols-2 gap-6">
                            <div
                                className="p-6 rounded-xl backdrop-blur-md border hover:shadow-lg transition-all duration-300"
                                style={{
                                    background: `linear-gradient(135deg, ${colors.background}60, ${colors.primary}20)`,
                                    borderColor: colors.secondary + '30'
                                }}
                            >
                                <div className="w-10 h-10 rounded-lg mb-4 backdrop-blur-sm" style={{ backgroundColor: colors.accent + '60' }} />
                                <h3 className="font-semibold text-lg mb-2">Frosted Glass</h3>
                                <p className="text-sm opacity-70">Beautiful transparency effects</p>
                            </div>
                            <div
                                className="p-6 rounded-xl backdrop-blur-md border hover:shadow-lg transition-all duration-300"
                                style={{
                                    background: `linear-gradient(135deg, ${colors.background}60, ${colors.secondary}20)`,
                                    borderColor: colors.accent + '30'
                                }}
                            >
                                <div className="w-10 h-10 rounded-lg mb-4 backdrop-blur-sm" style={{ backgroundColor: colors.primary + '60' }} />
                                <h3 className="font-semibold text-lg mb-2">Modern Depth</h3>
                                <p className="text-sm opacity-70">Layered visual hierarchy</p>
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                className="px-8 py-4 rounded-xl font-semibold text-white backdrop-blur-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 border"
                                style={{
                                    background: `linear-gradient(135deg, ${colors.primary}80, ${colors.secondary}80)`,
                                    borderColor: colors.primary + '50'
                                }}
                            >
                                Experience Glass Design ✨
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        if (template === 'neuomorphism') {
            return (
                <div
                    className="p-8 rounded-3xl hover:scale-[1.02] transition-all duration-500"
                    style={{
                        backgroundColor: colors.background,
                        color: isLight ? colors.dark : (colors.light || '#FFFFFF'),
                        boxShadow: `inset 8px 8px 16px ${colors.background}40, inset -8px -8px 16px ${colors.background}80, 8px 8px 32px rgba(0,0,0,0.1)`
                    }}
                >
                    <div className="space-y-8">
                        <header className="text-center">
                            <div className="flex justify-center mb-6">
                                <div
                                    className="w-20 h-20 rounded-full flex items-center justify-center"
                                    style={{
                                        backgroundColor: colors.background,
                                        boxShadow: `8px 8px 16px ${colors.background}60, -8px -8px 16px ${colors.background}80`
                                    }}
                                >
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center"
                                        style={{
                                            backgroundColor: colors.primary,
                                            boxShadow: `inset 4px 4px 8px ${colors.primary}80, inset -4px -4px 8px ${colors.primary}40`
                                        }}
                                    >
                                        <Brain className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold mb-3" style={{ color: colors.primary }}>
                                Neuro Resume
                            </h1>
                            <p className="text-lg opacity-80">
                                Soft, tactile design that feels real
                            </p>
                        </header>

                        <div className="space-y-4">
                            <div
                                className="p-6 rounded-2xl hover:shadow-inner transition-all duration-300"
                                style={{
                                    backgroundColor: colors.background,
                                    boxShadow: `inset 6px 6px 12px ${colors.background}60, inset -6px -6px 12px ${colors.background}80`
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                                        style={{
                                            backgroundColor: colors.background,
                                            boxShadow: `4px 4px 8px ${colors.background}60, -4px -4px 8px ${colors.background}80`
                                        }}
                                    >
                                        <FileText className="w-6 h-6" style={{ color: colors.secondary }} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Soft UI Elements</h3>
                                        <p className="text-sm opacity-70">Pressed and embossed effects</p>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="p-6 rounded-2xl hover:shadow-inner transition-all duration-300"
                                style={{
                                    backgroundColor: colors.background,
                                    boxShadow: `inset 6px 6px 12px ${colors.background}60, inset -6px -6px 12px ${colors.background}80`
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                                        style={{
                                            backgroundColor: colors.background,
                                            boxShadow: `4px 4px 8px ${colors.background}60, -4px -4px 8px ${colors.background}80`
                                        }}
                                    >
                                        <Star className="w-6 h-6" style={{ color: colors.accent }} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Tactile Experience</h3>
                                        <p className="text-sm opacity-70">Physical-like interactions</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                className="px-10 py-4 rounded-2xl font-semibold hover:shadow-inner transition-all duration-300"
                                style={{
                                    backgroundColor: colors.background,
                                    color: colors.primary,
                                    boxShadow: `6px 6px 12px ${colors.background}60, -6px -6px 12px ${colors.background}80`
                                }}
                            >
                                Touch & Feel
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        if (template === 'web3-crypto') {
            return (
                <div
                    className="p-8 rounded-xl relative overflow-hidden hover:scale-[1.02] transition-all duration-500"
                    style={{
                        background: `linear-gradient(135deg, ${colors.background}, ${colors.primary}10, ${colors.secondary}20)`,
                        color: colors.light || colors.dark,
                        border: `1px solid ${colors.primary}50`,
                        boxShadow: `0 0 40px ${colors.primary}20`
                    }}
                >
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-4 right-4 w-32 h-32 rounded-full" style={{ background: `radial-gradient(circle, ${colors.accent}40, transparent)` }} />
                        <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full" style={{ background: `radial-gradient(circle, ${colors.secondary}40, transparent)` }} />
                    </div>

                    <div className="relative z-10 space-y-8">
                        <header className="text-center">
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div
                                        className="w-16 h-16 rounded-lg flex items-center justify-center border-2 animate-pulse"
                                        style={{
                                            background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                                            borderColor: colors.accent
                                        }}
                                    >
                                        <span className="text-white text-2xl font-bold">₿</span>
                                    </div>
                                    <div
                                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 border-white animate-bounce"
                                        style={{ backgroundColor: colors.accent }}
                                    />
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold mb-3 font-mono">
                                <span style={{ color: colors.primary }}>WEB3</span>
                                <span style={{ color: colors.secondary }}>.RESUME</span>
                            </h1>
                            <p className="text-lg font-mono opacity-90">
                                Decentralized • Trustless • Future-Ready
                            </p>
                        </header>

                        <div className="grid grid-cols-2 gap-6">
                            <div
                                className="p-4 rounded-lg border border-opacity-30 hover:shadow-lg transition-all duration-300"
                                style={{
                                    background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}10)`,
                                    borderColor: colors.primary
                                }}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: colors.accent }} />
                                    <span className="font-mono text-sm">BLOCKCHAIN</span>
                                </div>
                                <p className="text-xs opacity-80">Verified credentials on-chain</p>
                            </div>

                            <div
                                className="p-4 rounded-lg border border-opacity-30 hover:shadow-lg transition-all duration-300"
                                style={{
                                    background: `linear-gradient(135deg, ${colors.secondary}20, ${colors.accent}10)`,
                                    borderColor: colors.secondary
                                }}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: colors.primary }} />
                                    <span className="font-mono text-sm">DeFi READY</span>
                                </div>
                                <p className="text-xs opacity-80">Smart contract expertise</p>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4">
                            <button
                                className="px-6 py-3 rounded-lg border-2 font-mono text-sm hover:shadow-lg transition-all duration-300"
                                style={{
                                    borderColor: colors.primary,
                                    color: colors.primary,
                                    background: `linear-gradient(135deg, ${colors.primary}10, transparent)`
                                }}
                            >
                                CONNECT WALLET
                            </button>
                            <button
                                className="px-6 py-3 rounded-lg font-mono text-sm text-white hover:shadow-lg transition-all duration-300"
                                style={{
                                    background: `linear-gradient(135deg, ${colors.secondary}, ${colors.accent})`
                                }}
                            >
                                MINT NFT
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        if (template === 'nordic-minimal') {
            return (
                <div
                    className="p-12 rounded-2xl hover:scale-[1.02] transition-all duration-500"
                    style={{
                        backgroundColor: colors.background,
                        color: isLight ? colors.dark : (colors.light || '#FFFFFF')
                    }}
                >
                    <div className="max-w-lg mx-auto space-y-10">
                        <header className="text-center">
                            <div className="flex justify-center mb-8">
                                <div className="relative">
                                    <div
                                        className="w-20 h-20 rounded-full border-2 flex items-center justify-center"
                                        style={{ borderColor: colors.primary + '30' }}
                                    >
                                        <div className="text-3xl">🌲</div>
                                    </div>
                                    <div
                                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white"
                                        style={{ backgroundColor: colors.accent }}
                                    />
                                </div>
                            </div>
                            <h1 className="text-3xl font-light mb-4 tracking-wide" style={{ color: colors.primary }}>
                                Nordic Professional
                            </h1>
                            <p className="text-lg leading-relaxed opacity-80 font-light">
                                Scandinavian simplicity meets professional excellence
                            </p>
                        </header>

                        <div className="space-y-8">
                            <div className="flex items-start gap-6">
                                <div
                                    className="w-1 h-16 rounded-full"
                                    style={{ backgroundColor: colors.secondary }}
                                />
                                <div>
                                    <h3 className="font-medium text-lg mb-2" style={{ color: colors.secondary }}>
                                        Design Philosophy
                                    </h3>
                                    <p className="text-sm leading-relaxed opacity-80">
                                        Less is more. Clean lines, natural colors, and functional beauty
                                        inspired by Scandinavian design principles.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 py-6">
                                <div className="text-center">
                                    <div
                                        className="w-3 h-3 rounded-full mx-auto mb-3"
                                        style={{ backgroundColor: colors.primary }}
                                    />
                                    <span className="text-xs font-light tracking-wide">MINIMAL</span>
                                </div>
                                <div className="text-center">
                                    <div
                                        className="w-3 h-3 rounded-full mx-auto mb-3"
                                        style={{ backgroundColor: colors.secondary }}
                                    />
                                    <span className="text-xs font-light tracking-wide">NATURAL</span>
                                </div>
                                <div className="text-center">
                                    <div
                                        className="w-3 h-3 rounded-full mx-auto mb-3"
                                        style={{ backgroundColor: colors.accent }}
                                    />
                                    <span className="text-xs font-light tracking-wide">FUNCTIONAL</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center pt-4">
                            <button
                                className="px-10 py-3 border font-light tracking-wide hover:shadow-md transition-all duration-300"
                                style={{
                                    borderColor: colors.primary,
                                    color: colors.primary,
                                    backgroundColor: 'transparent'
                                }}
                            >
                                Explore Design
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        if (template === 'brutalist-modern') {
            return (
                <div
                    className="p-8 rounded-none relative overflow-hidden hover:scale-[1.02] transition-all duration-500 border-4"
                    style={{
                        backgroundColor: colors.background,
                        color: isLight ? colors.dark : (colors.light || '#FFFFFF'),
                        borderColor: colors.primary
                    }}
                >
                    <div className="space-y-8">
                        <header>
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h1 className="text-5xl font-black leading-none mb-2" style={{ color: colors.primary }}>
                                        BRUTAL
                                    </h1>
                                    <h2 className="text-2xl font-black" style={{ color: colors.secondary }}>
                                        RESUME
                                    </h2>
                                </div>
                                <div
                                    className="w-16 h-16 border-4 flex items-center justify-center font-black text-xl"
                                    style={{
                                        borderColor: colors.accent,
                                        color: colors.accent
                                    }}
                                >
                                    #1
                                </div>
                            </div>
                            <div
                                className="h-2 w-32"
                                style={{ backgroundColor: colors.accent }}
                            />
                        </header>

                        <div className="space-y-6">
                            <div
                                className="p-6 border-4 relative"
                                style={{
                                    backgroundColor: colors.primary + '10',
                                    borderColor: colors.primary
                                }}
                            >
                                <div
                                    className="absolute top-0 left-0 px-2 py-1 text-xs font-black text-white"
                                    style={{ backgroundColor: colors.primary }}
                                >
                                    EXPERIENCE
                                </div>
                                <div className="pt-4">
                                    <h3 className="text-xl font-black mb-2" style={{ color: colors.primary }}>
                                        SENIOR DEVELOPER
                                    </h3>
                                    <p className="font-bold text-sm">
                                        TECH CORP • 2020-2024
                                    </p>
                                </div>
                            </div>

                            <div
                                className="p-6 border-4 relative"
                                style={{
                                    backgroundColor: colors.secondary + '10',
                                    borderColor: colors.secondary
                                }}
                            >
                                <div
                                    className="absolute top-0 left-0 px-2 py-1 text-xs font-black text-white"
                                    style={{ backgroundColor: colors.secondary }}
                                >
                                    SKILLS
                                </div>
                                <div className="pt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-black" style={{ color: colors.secondary }}>
                                                95%
                                            </div>
                                            <div className="text-xs font-bold">JAVASCRIPT</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-black" style={{ color: colors.accent }}>
                                                90%
                                            </div>
                                            <div className="text-xs font-bold">REACT</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            className="w-full py-4 border-4 font-black text-lg hover:shadow-lg transition-all duration-300"
                            style={{
                                backgroundColor: colors.accent,
                                borderColor: colors.primary,
                                color: 'white'
                            }}
                        >
                            HIRE NOW!
                        </button>
                    </div>
                </div>
            );
        }

        if (template === 'wellness-organic') {
            return (
                <div
                    className="p-10 rounded-3xl hover:scale-[1.02] transition-all duration-500"
                    style={{
                        backgroundColor: colors.background,
                        color: isLight ? colors.dark : (colors.light || '#FFFFFF'),
                        boxShadow: '0 20px 60px rgba(0,0,0,0.05)'
                    }}
                >
                    <div className="max-w-md mx-auto space-y-8 text-center">
                        <header>
                            <div className="flex justify-center mb-6">
                                <div
                                    className="w-24 h-24 rounded-full flex items-center justify-center relative"
                                    style={{
                                        background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`
                                    }}
                                >
                                    <div className="text-4xl">🌿</div>
                                    <div
                                        className="absolute inset-0 rounded-full border-2 border-dashed animate-spin"
                                        style={{
                                            borderColor: colors.accent + '40',
                                            animationDuration: '8s'
                                        }}
                                    />
                                </div>
                            </div>
                            <h1 className="text-3xl font-medium mb-4" style={{ color: colors.primary }}>
                                Wellness Professional
                            </h1>
                            <p className="text-lg leading-relaxed opacity-80">
                                Nurturing growth through mindful practice and holistic well-being
                            </p>
                        </header>

                        <div className="space-y-6">
                            <div
                                className="p-6 rounded-2xl hover:shadow-lg transition-all duration-300"
                                style={{
                                    background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)`
                                }}
                            >
                                <div className="text-2xl mb-3">🧘‍♀️</div>
                                <h3 className="font-semibold text-lg mb-2" style={{ color: colors.primary }}>
                                    Mindful Leadership
                                </h3>
                                <p className="text-sm leading-relaxed opacity-80">
                                    Integrating wellness principles into professional environments for sustainable growth.
                                </p>
                            </div>

                            <div
                                className="p-6 rounded-2xl hover:shadow-lg transition-all duration-300"
                                style={{
                                    background: `linear-gradient(135deg, ${colors.secondary}10, ${colors.accent}10)`
                                }}
                            >
                                <div className="text-2xl mb-3">🌱</div>
                                <h3 className="font-semibold text-lg mb-2" style={{ color: colors.secondary }}>
                                    Organic Growth
                                </h3>
                                <p className="text-sm leading-relaxed opacity-80">
                                    Cultivating authentic relationships and sustainable business practices.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4">
                            <button
                                className="px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300"
                                style={{
                                    backgroundColor: colors.primary,
                                    color: 'white'
                                }}
                            >
                                🌸 Connect
                            </button>
                            <button
                                className="px-8 py-3 rounded-full border-2 font-medium hover:shadow-lg transition-all duration-300"
                                style={{
                                    borderColor: colors.secondary,
                                    color: colors.secondary,
                                    backgroundColor: 'transparent'
                                }}
                            >
                                🍃 Learn More
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="p-8 rounded-xl bg-gray-100">
                <div className="text-center text-gray-500">
                    <p>Template preview for {template}</p>
                    <p className="text-sm">Coming soon...</p>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Success notification */}
            {showSuccess && (
                <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right">
                    <Check className="w-5 h-5" />
                    <span>Template applied successfully! Redirecting to AI Dashboard...</span>
                </div>
            )}

            <div className="container mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Explorer</h1>
                    <p className="text-gray-600">
                        Choose from {Object.keys(templates).length} unique, modern resume templates.
                        Each template is designed for different industries and professional styles.
                    </p>
                </div>
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Template Selection */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Brush className="w-5 h-5" />
                                    Templates
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {Object.entries(templates).map(([key, template]) => (
                                    <div
                                        key={key}
                                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${selectedTemplate === key
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        onClick={() => setSelectedTemplate(key)}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-semibold text-sm">{template.name}</h3>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 text-yellow-500" />
                                                <span className="text-xs text-gray-500">{template.popularity}%</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-600 mb-3">{template.description}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {template.features.slice(0, 2).map((feature, i) => (
                                                <Badge key={i} variant="secondary">
                                                    {feature}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Color Scheme Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Palette className="w-5 h-5" />
                                    Color Schemes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {Object.entries(colorSchemes).map(([key, scheme]) => (
                                    <div
                                        key={key}
                                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${selectedColorScheme === key
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        onClick={() => setSelectedColorScheme(key)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium text-sm">{scheme.name}</h4>
                                            <div className="flex gap-1">
                                                <div
                                                    className="w-3 h-3 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: scheme.primary }}
                                                />
                                                <div
                                                    className="w-3 h-3 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: scheme.secondary }}
                                                />
                                                <div
                                                    className="w-3 h-3 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: scheme.accent }}
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-600">{scheme.description}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Preview Area */}
                    <div className="lg:col-span-2">
                        <Card className="h-full">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="w-5 h-5" />
                                        Live Preview
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant={viewMode === 'desktop' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setViewMode('desktop')}
                                        >
                                            <Monitor className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant={viewMode === 'mobile' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setViewMode('mobile')}
                                        >
                                            <Smartphone className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className={`${viewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
                                    <PreviewComponent
                                        template={selectedTemplate}
                                        colorScheme={selectedColorScheme}
                                    />
                                </div>

                                {/* Template Info */}
                                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-semibold mb-2">Template Details</h4>
                                            <ul className="text-sm text-gray-600 space-y-1">
                                                <li>• Category: {templates[selectedTemplate]?.category}</li>
                                                <li>• Popularity: {templates[selectedTemplate]?.popularity}%</li>
                                                <li>• Features: {templates[selectedTemplate]?.features.join(', ')}</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-2">Color Scheme</h4>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-4 h-4 rounded border"
                                                        style={{ backgroundColor: colorSchemes[selectedColorScheme]?.primary }}
                                                    />
                                                    Primary: {colorSchemes[selectedColorScheme]?.primary}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-4 h-4 rounded border"
                                                        style={{ backgroundColor: colorSchemes[selectedColorScheme]?.secondary }}
                                                    />
                                                    Secondary: {colorSchemes[selectedColorScheme]?.secondary}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-4 h-4 rounded border"
                                                        style={{ backgroundColor: colorSchemes[selectedColorScheme]?.accent }}
                                                    />
                                                    Accent: {colorSchemes[selectedColorScheme]?.accent}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Action Panel */}
                <div className="mt-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">Ready to Apply?</h3>
                                    <p className="text-gray-600">
                                        Current selection: <span className="font-medium">{templates[selectedTemplate]?.name}</span> with <span className="font-medium">{colorSchemes[selectedColorScheme]?.name}</span> colors
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={handleCopyConfig}
                                    >
                                        <Copy className="w-4 h-4 mr-2" />
                                        <span className="copy-button-text">Copy Config</span>
                                    </Button>
                                    <Button
                                        size="lg"
                                        className="bg-blue-600 hover:bg-blue-700"
                                        onClick={handleApplyTemplate}
                                        disabled={isApplying || showSuccess}
                                    >
                                        {isApplying ? (
                                            <>
                                                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Applying...
                                            </>
                                        ) : showSuccess ? (
                                            <>
                                                <Check className="w-4 h-4 mr-2" />
                                                Applied Successfully!
                                            </>
                                        ) : (
                                            <>
                                                <Zap className="w-4 h-4 mr-2" />
                                                Apply This Design
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TemplateExplorerPage;
