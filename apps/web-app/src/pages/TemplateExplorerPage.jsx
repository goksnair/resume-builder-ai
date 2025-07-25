import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    Check,
    Copy,
    Star,
    ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/template-explorer.css';

const TemplateExplorerPage = () => {
    const [selectedTemplate, setSelectedTemplate] = useState('modern-saas');
    const [selectedColorScheme, setSelectedColorScheme] = useState('cool-tech');
    const [viewMode, setViewMode] = useState('desktop');
    const [appliedTemplate, setAppliedTemplate] = useState(null);

    const templates = {
        'modern-saas': {
            name: 'Modern SaaS',
            description: 'Clean, professional design inspired by Linear, Notion, and Stripe',
            category: 'Professional',
            popularity: 95,
            features: ['Clean Typography', 'Subtle Animations', 'Professional Feel', 'SaaS-like'],
            preview: 'modern-saas-preview',
            colors: ['cool-tech', 'professional', 'warm-energy']
        },
        'creative-bold': {
            name: 'Creative Bold',
            description: 'Visual-heavy design inspired by Dribbble, Behance, and creative platforms',
            category: 'Creative',
            popularity: 87,
            features: ['Bold Colors', 'Visual Impact', 'Creative Elements', 'Artistic'],
            preview: 'creative-bold-preview',
            colors: ['warm-energy', 'ai-future', 'cool-tech']
        },
        'ai-futuristic': {
            name: 'AI Futuristic',
            description: 'Tech-forward design inspired by OpenAI, Anthropic, and AI platforms',
            category: 'Technology',
            popularity: 92,
            features: ['Futuristic', 'AI-themed', 'Dark Mode', 'Tech-forward'],
            preview: 'ai-futuristic-preview',
            colors: ['ai-future', 'cool-tech', 'cyber-neon']
        },
        'minimal-elegant': {
            name: 'Minimal Elegant',
            description: 'Clean and sophisticated design inspired by Apple and premium brands',
            category: 'Minimal',
            popularity: 89,
            features: ['Minimal', 'Elegant', 'Sophisticated', 'Premium'],
            preview: 'minimal-elegant-preview',
            colors: ['professional', 'cool-tech', 'monochrome']
        },
        'dashboard-pro': {
            name: 'Dashboard Pro',
            description: 'Data-focused design with charts and analytics visualization',
            category: 'Analytics',
            popularity: 78,
            features: ['Data Viz', 'Analytics', 'Charts', 'Professional'],
            preview: 'dashboard-pro-preview',
            colors: ['cool-tech', 'professional', 'data-viz']
        },
        'startup-energy': {
            name: 'Startup Energy',
            description: 'Dynamic and energetic design for modern startups and entrepreneurs',
            category: 'Startup',
            popularity: 84,
            features: ['Dynamic', 'Energetic', 'Modern', 'Startup-like'],
            preview: 'startup-energy-preview',
            colors: ['warm-energy', 'neon-bright', 'cool-tech']
        }
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
            gradient: 'from-blue-50 to-indigo-100'
        },
        'warm-energy': {
            name: 'Warm Energy',
            description: 'Vibrant amber and red energy',
            primary: '#F59E0B',
            secondary: '#EF4444',
            accent: '#8B5CF6',
            background: '#FFFBEB',
            dark: '#92400E',
            gradient: 'from-amber-50 to-orange-100'
        },
        'professional': {
            name: 'Professional',
            description: 'Conservative corporate colors',
            primary: '#1E40AF',
            secondary: '#64748B',
            accent: '#10B981',
            background: '#F1F5F9',
            dark: '#0F172A',
            gradient: 'from-slate-50 to-blue-50'
        },
        'ai-future': {
            name: 'AI Future',
            description: 'Dark futuristic with neon accents',
            primary: '#A855F7',
            secondary: '#06B6D4',
            accent: '#F97316',
            background: '#0F172A',
            light: '#F8FAFC',
            gradient: 'from-slate-900 to-purple-900'
        },
        'cyber-neon': {
            name: 'Cyber Neon',
            description: 'High-contrast cyberpunk aesthetics',
            primary: '#00F5FF',
            secondary: '#FF1493',
            accent: '#00FF00',
            background: '#000012',
            light: '#FFFFFF',
            gradient: 'from-black to-slate-900'
        },
        'monochrome': {
            name: 'Monochrome',
            description: 'Elegant black and white',
            primary: '#000000',
            secondary: '#6B7280',
            accent: '#9CA3AF',
            background: '#FFFFFF',
            dark: '#000000',
            gradient: 'from-white to-gray-50'
        },
        'data-viz': {
            name: 'Data Viz',
            description: 'Analytics-focused color palette',
            primary: '#1F77B4',
            secondary: '#FF7F0E',
            accent: '#2CA02C',
            background: '#F9FAFB',
            dark: '#1F2937',
            gradient: 'from-blue-50 to-indigo-50'
        },
        'neon-bright': {
            name: 'Neon Bright',
            description: 'Electric and vibrant colors',
            primary: '#FF0080',
            secondary: '#00FF80',
            accent: '#8000FF',
            background: '#FAFAFA',
            dark: '#0A0A0A',
            gradient: 'from-pink-50 to-green-50'
        }
    };

    const PreviewComponent = ({ template, colorScheme, className = '' }) => {
        const colors = colorSchemes[colorScheme];
        const isLight = !['ai-future', 'cyber-neon'].includes(colorScheme);

        const baseStyles = {
            '--primary': colors.primary,
            '--secondary': colors.secondary,
            '--accent': colors.accent,
            '--background': colors.background,
            '--foreground': isLight ? colors.dark : (colors.light || '#FFFFFF'),
        };

        if (template === 'modern-saas') {
            return (
                <div
                    className={`p-8 rounded-xl ${className} transition-all duration-500 hover:scale-[1.02]`}
                    style={{
                        ...baseStyles,
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
                    className={`p-8 rounded-xl relative overflow-hidden ${className} hover:scale-[1.02] transition-all duration-500`}
                    style={{
                        background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15, ${colors.accent}15)`,
                        color: isLight ? colors.dark : (colors.light || '#FFFFFF'),
                        border: `2px solid ${colors.primary}30`
                    }}
                >
                    <div className="relative z-10 space-y-8">
                        <header className="text-center">
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div
                                        className="w-20 h-20 rounded-full flex items-center justify-center"
                                        style={{
                                            background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`
                                        }}
                                    >
                                        <Sparkles className="w-10 h-10 text-white" />
                                    </div>
                                    <div
                                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full animate-pulse"
                                        style={{ backgroundColor: colors.accent }}
                                    />
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

                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-10 animate-spin-slow">
                        <div
                            className="w-full h-full rounded-full"
                            style={{ background: `linear-gradient(45deg, ${colors.primary}, transparent)` }}
                        />
                    </div>
                </div>
            );
        }

        if (template === 'ai-futuristic') {
            return (
                <div
                    className={`p-8 rounded-xl relative overflow-hidden ${className} hover:scale-[1.02] transition-all duration-500`}
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
                    className={`p-12 rounded-2xl ${className} hover:scale-[1.02] transition-all duration-500`}
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

        // Default template preview
        return (
            <div className={`p-8 rounded-xl bg-gray-100 ${className}`}>
                <div className="text-center text-gray-500">
                    <p>Template preview for {template}</p>
                    <p className="text-sm">Coming soon...</p>
                </div>
            </div>
        );
    };

    const applyTemplate = () => {
        setAppliedTemplate({ template: selectedTemplate, colorScheme: selectedColorScheme });
        // Here you would typically dispatch an action to update the global theme
        console.log('Applying template:', selectedTemplate, 'with color scheme:', selectedColorScheme);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                                <ArrowLeft className="w-5 h-5" />
                                Back to App
                            </Link>
                            <div className="w-px h-6 bg-gray-300" />
                            <h1 className="text-2xl font-bold text-gray-900">Template Explorer</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            {appliedTemplate && (
                                <Badge variant="success" className="bg-green-100 text-green-800">
                                    <Check className="w-4 h-4 mr-1" />
                                    Template Applied
                                </Badge>
                            )}
                            <Button onClick={applyTemplate} className="bg-blue-600 hover:bg-blue-700">
                                Apply Template
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
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
                                                <Badge key={i} variant="secondary" className="text-xs">
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
                                        className="w-full"
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
                                    <Button variant="outline" onClick={() => {
                                        navigator.clipboard.writeText(`Template: ${selectedTemplate}, Colors: ${selectedColorScheme}`);
                                    }}>
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy Config
                                    </Button>
                                    <Button onClick={applyTemplate} size="lg" className="bg-blue-600 hover:bg-blue-700">
                                        <Zap className="w-4 h-4 mr-2" />
                                        Apply This Design
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
