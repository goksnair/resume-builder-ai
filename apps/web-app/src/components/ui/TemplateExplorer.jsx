import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTemplate } from '../../contexts/TemplateContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    Palette,
    Monitor,
    Smartphone,
    Eye,
    Zap,
    Sparkles,
    Brush,
    BarChart3,
    Brain,
    FileText,
    Download,
    Settings
} from 'lucide-react';

const TemplateExplorer = () => {
    const navigate = useNavigate();
    const { applyTemplate: applyWebsiteTheme } = useTemplate();
    const [selectedTemplate, setSelectedTemplate] = useState('modern-saas');
    const [selectedColorScheme, setSelectedColorScheme] = useState('cool-tech');
    const [viewMode, setViewMode] = useState('desktop');
    const [isApplying, setIsApplying] = useState(false);

    const templates = {
        'modern-saas': {
            name: 'Modern SaaS',
            description: 'Clean, professional, like Linear or Notion',
            preview: 'modern-saas-preview',
            colors: ['cool-tech', 'warm-energy', 'professional']
        },
        'creative-bold': {
            name: 'Creative Bold',
            description: 'Visual-heavy, like Dribbble or Behance',
            preview: 'creative-bold-preview',
            colors: ['warm-energy', 'ai-future', 'cool-tech']
        },
        'ai-futuristic': {
            name: 'AI Futuristic',
            description: 'Tech-forward, like OpenAI or Anthropic',
            preview: 'ai-futuristic-preview',
            colors: ['ai-future', 'cool-tech', 'professional']
        },
        'minimal-elegant': {
            name: 'Minimal Elegant',
            description: 'Clean and sophisticated, like Apple',
            preview: 'minimal-elegant-preview',
            colors: ['professional', 'cool-tech', 'warm-energy']
        }
    };

    const colorSchemes = {
        'cool-tech': {
            name: 'Cool Tech',
            primary: '#3B82F6',
            secondary: '#8B5CF6',
            accent: '#06D6A0',
            background: '#F8FAFC',
            dark: '#1E293B'
        },
        'warm-energy': {
            name: 'Warm Energy',
            primary: '#F59E0B',
            secondary: '#EF4444',
            accent: '#8B5CF6',
            background: '#FFFBEB',
            dark: '#92400E'
        },
        'professional': {
            name: 'Professional',
            primary: '#1E40AF',
            secondary: '#64748B',
            accent: '#10B981',
            background: '#F1F5F9',
            dark: '#0F172A'
        },
        'ai-future': {
            name: 'AI Future',
            primary: '#A855F7',
            secondary: '#06B6D4',
            accent: '#F97316',
            background: '#0F172A',
            light: '#F8FAFC'
        }
    };

    const handleApplyDesign = () => {
        setIsApplying(true);
        
        const selectedTemplateData = templates[selectedTemplate];
        const selectedColors = colorSchemes[selectedColorScheme];
        
        // Create a theme object for the website
        const websiteTheme = {
            id: `${selectedTemplate}-${selectedColorScheme}`,
            name: `${selectedTemplateData.name} - ${selectedColors.name}`,
            category: 'ui-theme',
            description: `${selectedTemplateData.description} with ${selectedColors.name} color scheme`,
            preview: {
                sections: ['Website UI', 'Navigation', 'Components', 'Layout'],
                layout: selectedTemplate,
                colors: [selectedColors.primary, selectedColors.background, selectedColors.dark || selectedColors.light],
                features: ['Website Theme', 'Global Styling', 'UI/UX Design', 'Color Scheme'],
                uiTheme: {
                    name: `${selectedTemplateData.name} ${selectedColors.name}`,
                    primaryGradient: `linear-gradient(135deg, ${selectedColors.primary} 0%, ${selectedColors.secondary} 100%)`,
                    cardStyle: selectedTemplate,
                    buttonStyle: selectedTemplate === 'minimal-elegant' ? 'rounded-sm' : 'rounded-lg',
                    fontWeight: selectedTemplate === 'creative-bold' ? 'bold' : 'medium',
                    templateType: 'ui-theme' // Mark this as a UI theme, not a resume template
                }
            }
        };

        // Apply the website theme
        const success = applyWebsiteTheme(websiteTheme);
        
        if (success) {
            // Show success feedback
            const notification = document.createElement('div');
            notification.className = 'template-notification';
            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 20px; height: 20px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        ✓
                    </div>
                    <div>
                        <div style="font-weight: bold;">Website Theme Applied!</div>
                        <div style="font-size: 0.9em; opacity: 0.9;">${websiteTheme.name}</div>
                    </div>
                </div>
            `;
            document.body.appendChild(notification);

            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
                setIsApplying(false);
            }, 3000);

            // Optional: Navigate to another page to see the theme in action
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } else {
            setIsApplying(false);
        }
    };

    const PreviewComponent = ({ template, colorScheme, className = '' }) => {
        const colors = colorSchemes[colorScheme];
        const isLight = colorScheme !== 'ai-future';

        const getTemplateStyles = () => {
            const base = {
                '--primary': colors.primary,
                '--secondary': colors.secondary,
                '--accent': colors.accent,
                '--background': colors.background,
                '--foreground': isLight ? colors.dark : colors.light,
            };

            return base;
        };

        if (template === 'modern-saas') {
            return (
                <div
                    className={`p-6 rounded-lg ${className}`}
                    style={{
                        ...getTemplateStyles(),
                        backgroundColor: colors.background,
                        color: isLight ? colors.dark : colors.light
                    }}
                >
                    <div className="space-y-6">
                        <header className="text-center">
                            <h1 className="text-4xl font-bold mb-2" style={{ color: colors.primary }}>
                                AI Resume Builder
                            </h1>
                            <p className="text-lg opacity-80">
                                Professional resumes powered by AI
                            </p>
                        </header>

                        <div className="grid grid-cols-2 gap-4">
                            <div
                                className="p-4 rounded-lg border"
                                style={{
                                    backgroundColor: isLight ? 'white' : colors.dark,
                                    borderColor: colors.secondary + '30'
                                }}
                            >
                                <Brain className="w-8 h-8 mb-2" style={{ color: colors.accent }} />
                                <h3 className="font-semibold">AI Analysis</h3>
                                <p className="text-sm opacity-70">Smart optimization</p>
                            </div>
                            <div
                                className="p-4 rounded-lg border"
                                style={{
                                    backgroundColor: isLight ? 'white' : colors.dark,
                                    borderColor: colors.secondary + '30'
                                }}
                            >
                                <FileText className="w-8 h-8 mb-2" style={{ color: colors.primary }} />
                                <h3 className="font-semibold">Templates</h3>
                                <p className="text-sm opacity-70">Professional designs</p>
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                className="px-6 py-3 rounded-lg font-medium"
                                style={{
                                    backgroundColor: colors.primary,
                                    color: 'white'
                                }}
                            >
                                Start Building
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        if (template === 'creative-bold') {
            return (
                <div
                    className={`p-6 rounded-lg relative overflow-hidden ${className}`}
                    style={{
                        background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`,
                        color: isLight ? colors.dark : colors.light
                    }}
                >
                    <div className="relative z-10 space-y-6">
                        <header className="text-center">
                            <div className="flex justify-center mb-4">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: colors.accent }}
                                >
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Creative Resume AI
                            </h1>
                            <p className="text-lg">
                                Where creativity meets intelligence
                            </p>
                        </header>

                        <div className="grid grid-cols-3 gap-3">
                            {[colors.primary, colors.secondary, colors.accent].map((color, i) => (
                                <div
                                    key={i}
                                    className="h-20 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: color + '30' }}
                                >
                                    <div
                                        className="w-8 h-8 rounded-full"
                                        style={{ backgroundColor: color }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="text-center">
                            <button
                                className="px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r transform hover:scale-105 transition-transform"
                                style={{
                                    backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
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
                    className={`p-6 rounded-lg relative ${className}`}
                    style={{
                        backgroundColor: colors.background,
                        color: colors.light || colors.dark,
                        border: `1px solid ${colors.primary}30`
                    }}
                >
                    <div className="space-y-6">
                        <header className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="relative">
                                    <div
                                        className="w-12 h-12 rounded-full animate-pulse"
                                        style={{ backgroundColor: colors.primary }}
                                    />
                                    <div
                                        className="absolute inset-0 w-12 h-12 rounded-full animate-ping opacity-20"
                                        style={{ backgroundColor: colors.secondary }}
                                    />
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold mb-2 font-mono">
                                <span style={{ color: colors.primary }}>AI.RESUME</span>
                                <span style={{ color: colors.secondary }}>.BUILD</span>
                            </h1>
                            <p className="text-sm font-mono opacity-80">
                                &gt; Powered by advanced neural networks
                            </p>
                        </header>

                        <div className="space-y-3">
                            <div
                                className="p-3 rounded border-l-4 bg-opacity-10"
                                style={{
                                    borderLeftColor: colors.accent,
                                    backgroundColor: colors.accent
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-2 h-2 rounded-full animate-pulse"
                                        style={{ backgroundColor: colors.accent }}
                                    />
                                    <span className="font-mono text-sm">Neural analysis: 95.7%</span>
                                </div>
                            </div>
                            <div
                                className="p-3 rounded border-l-4 bg-opacity-10"
                                style={{
                                    borderLeftColor: colors.secondary,
                                    backgroundColor: colors.secondary
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-2 h-2 rounded-full animate-pulse"
                                        style={{ backgroundColor: colors.secondary }}
                                    />
                                    <span className="font-mono text-sm">Optimization: Complete</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                className="px-6 py-3 rounded border font-mono text-sm hover:bg-opacity-20 transition-all"
                                style={{
                                    borderColor: colors.primary,
                                    color: colors.primary,
                                    backgroundColor: colors.primary + '10'
                                }}
                            >
                                INITIATE_ANALYSIS.exe
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        if (template === 'minimal-elegant') {
            return (
                <div
                    className={`p-8 rounded-lg ${className}`}
                    style={{
                        backgroundColor: colors.background,
                        color: colors.dark
                    }}
                >
                    <div className="space-y-8">
                        <header className="text-center">
                            <h1 className="text-5xl font-light mb-2" style={{ color: colors.dark }}>
                                Resume
                            </h1>
                            <div
                                className="w-16 h-px mx-auto mb-4"
                                style={{ backgroundColor: colors.primary }}
                            />
                            <p className="text-sm uppercase tracking-wider opacity-60">
                                Crafted with precision
                            </p>
                        </header>

                        <div className="grid grid-cols-3 gap-8">
                            <div className="text-center">
                                <div
                                    className="w-8 h-8 mx-auto mb-3 rounded-full"
                                    style={{ backgroundColor: colors.primary + '20' }}
                                >
                                    <FileText
                                        className="w-4 h-4 m-2"
                                        style={{ color: colors.primary }}
                                    />
                                </div>
                                <h3 className="font-medium text-sm">Design</h3>
                            </div>
                            <div className="text-center">
                                <div
                                    className="w-8 h-8 mx-auto mb-3 rounded-full"
                                    style={{ backgroundColor: colors.accent + '20' }}
                                >
                                    <Brain
                                        className="w-4 h-4 m-2"
                                        style={{ color: colors.accent }}
                                    />
                                </div>
                                <h3 className="font-medium text-sm">Intelligence</h3>
                            </div>
                            <div className="text-center">
                                <div
                                    className="w-8 h-8 mx-auto mb-3 rounded-full"
                                    style={{ backgroundColor: colors.secondary + '20' }}
                                >
                                    <Download
                                        className="w-4 h-4 m-2"
                                        style={{ color: colors.secondary }}
                                    />
                                </div>
                                <h3 className="font-medium text-sm">Export</h3>
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                className="px-8 py-2 border text-sm font-medium hover:bg-black hover:text-white transition-all duration-300"
                                style={{
                                    borderColor: colors.dark,
                                    color: colors.dark
                                }}
                            >
                                Begin
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return <div>Template not found</div>;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        UI/UX Template Explorer
                    </h1>
                    <p className="text-lg text-gray-600">
                        Explore different design directions for Resume Builder AI
                    </p>
                </header>

                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Template Selection */}
                    <div className="lg:col-span-1">
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
                                        className={`p-3 rounded cursor-pointer border-2 transition-all ${selectedTemplate === key
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        onClick={() => setSelectedTemplate(key)}
                                    >
                                        <h3 className="font-medium">{template.name}</h3>
                                        <p className="text-sm text-gray-600">{template.description}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="mt-4">
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
                                        className={`p-3 rounded cursor-pointer border-2 transition-all ${selectedColorScheme === key
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        onClick={() => setSelectedColorScheme(key)}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="flex gap-1">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: scheme.primary }}
                                                />
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: scheme.secondary }}
                                                />
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: scheme.accent }}
                                                />
                                            </div>
                                            <span className="font-medium text-sm">{scheme.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Preview Area */}
                    <div className="lg:col-span-3">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="w-5 h-5" />
                                        Live Preview
                                    </CardTitle>
                                    <div className="flex gap-2">
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
                                <div className={`mx-auto ${viewMode === 'mobile' ? 'max-w-sm' : 'max-w-2xl'}`}>
                                    <PreviewComponent
                                        template={selectedTemplate}
                                        colorScheme={selectedColorScheme}
                                        className="transition-all duration-300"
                                    />
                                </div>

                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-medium mb-2">Current Selection:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="secondary">
                                            {templates[selectedTemplate].name}
                                        </Badge>
                                        <Badge variant="outline">
                                            {colorSchemes[selectedColorScheme].name}
                                        </Badge>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <Button 
                                            className="flex-1"
                                            onClick={handleApplyDesign}
                                            disabled={isApplying}
                                        >
                                            {isApplying ? 'Applying...' : 'Apply This Design'}
                                        </Button>
                                        <Button variant="outline">
                                            Customize Further
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateExplorer;
