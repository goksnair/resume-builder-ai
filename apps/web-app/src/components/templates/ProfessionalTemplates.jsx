import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
    Briefcase,
    Code,
    Users,
    BarChart3,
    Palette,
    Zap,
    Heart,
    DollarSign,
    Shield,
    Microscope,
    PieChart,
    MessageSquare,
    Rocket,
    Building,
    Target,
    Crown,
    Download,
    Eye,
    Star,
    ArrowRight,
    CheckCircle,
    Copy,
    Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfessionalTemplates = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const navigate = useNavigate();

    // Debug logging
    console.log('ProfessionalTemplates component mounted');

    // Professional template categories with job-specific designs
    const templateCategories = {
        'tech': {
            label: 'Technology',
            icon: <Code className="w-5 h-5" />,
            color: 'bg-blue-50 text-blue-700 border-blue-200'
        },
        'product': {
            label: 'Product & Strategy',
            icon: <Rocket className="w-5 h-5" />,
            color: 'bg-purple-50 text-purple-700 border-purple-200'
        },
        'executive': {
            label: 'Executive & Leadership',
            icon: <Crown className="w-5 h-5" />,
            color: 'bg-gold-50 text-gold-700 border-gold-200'
        },
        'operations': {
            label: 'Operations & Consulting',
            icon: <BarChart3 className="w-5 h-5" />,
            color: 'bg-green-50 text-green-700 border-green-200'
        },
        'creative': {
            label: 'Design & Creative',
            icon: <Palette className="w-5 h-5" />,
            color: 'bg-pink-50 text-pink-700 border-pink-200'
        },
        'finance': {
            label: 'Finance & Business',
            icon: <DollarSign className="w-5 h-5" />,
            color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        }
    };

    const professionalTemplates = [
        // Technology Templates
        {
            id: 'software-engineer-modern',
            name: 'Software Engineer - Modern',
            category: 'tech',
            jobTitle: 'Software Engineer',
            description: 'Clean, technical layout optimized for ATS and engineering managers. Perfect for FAANG applications.',
            features: ['GitHub integration', 'Technical skills matrix', 'Project showcase', 'ATS-optimized'],
            preview: 'software-engineer-modern.jpg',
            rating: 4.9,
            downloads: 12453,
            level: 'All Levels',
            color: 'blue',
            tags: ['Technical', 'Modern', 'ATS-Friendly', 'GitHub'],
            optimizedFor: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple']
        },
        {
            id: 'senior-engineer-executive',
            name: 'Senior Engineer - Executive',
            category: 'tech',
            jobTitle: 'Senior Software Engineer',
            description: 'Executive-style template for senior engineers targeting leadership roles. Emphasizes architecture and team impact.',
            features: ['Architecture focus', 'Leadership metrics', 'Team impact', 'Technology strategy'],
            preview: 'senior-engineer-executive.jpg',
            rating: 4.8,
            downloads: 8231,
            level: 'Senior',
            color: 'indigo',
            tags: ['Leadership', 'Architecture', 'Executive', 'Strategy'],
            optimizedFor: ['Staff Engineer', 'Principal Engineer', 'Engineering Manager']
        },
        {
            id: 'fullstack-creative',
            name: 'Full-Stack - Creative',
            category: 'tech',
            jobTitle: 'Full-Stack Developer',
            description: 'Visually striking template that showcases both technical skills and design sensibility.',
            features: ['Portfolio integration', 'Skills visualization', 'Project timeline', 'Design focus'],
            preview: 'fullstack-creative.jpg',
            rating: 4.7,
            downloads: 6892,
            level: 'Mid-Level',
            color: 'purple',
            tags: ['Creative', 'Portfolio', 'Full-Stack', 'Visual'],
            optimizedFor: ['Startups', 'Design-Forward Companies', 'Creative Agencies']
        },

        // Product & Strategy Templates
        {
            id: 'product-manager-strategic',
            name: 'Product Manager - Strategic',
            category: 'product',
            jobTitle: 'Product Manager',
            description: 'Strategy-focused template highlighting product impact, user metrics, and business outcomes.',
            features: ['Metrics dashboard', 'Product impact', 'User focus', 'Business outcomes'],
            preview: 'product-manager-strategic.jpg',
            rating: 4.9,
            downloads: 15234,
            level: 'All Levels',
            color: 'purple',
            tags: ['Strategic', 'Metrics', 'User-Focused', 'Business'],
            optimizedFor: ['FAANG', 'Unicorn Startups', 'Enterprise', 'SaaS Companies']
        },
        {
            id: 'senior-pm-executive',
            name: 'Senior PM - Executive',
            category: 'product',
            jobTitle: 'Senior Product Manager',
            description: 'Executive presentation for senior PMs targeting director-level roles. Emphasizes strategy and vision.',
            features: ['Strategic vision', 'Executive summary', 'P&L impact', 'Market analysis'],
            preview: 'senior-pm-executive.jpg',
            rating: 4.8,
            downloads: 9876,
            level: 'Senior+',
            color: 'violet',
            tags: ['Executive', 'Strategy', 'Vision', 'P&L'],
            optimizedFor: ['Director Roles', 'VP Product', 'CPO Track']
        },
        {
            id: 'product-analyst-data',
            name: 'Product Analyst - Data-Driven',
            category: 'product',
            jobTitle: 'Product Analyst',
            description: 'Analytics-focused template showcasing data expertise and product insights.',
            features: ['Data visualization', 'Analytics focus', 'SQL showcase', 'Insight stories'],
            preview: 'product-analyst-data.jpg',
            rating: 4.6,
            downloads: 5432,
            level: 'Entry-Mid',
            color: 'blue',
            tags: ['Data', 'Analytics', 'SQL', 'Insights'],
            optimizedFor: ['Data-Driven Companies', 'Analytics Teams', 'Product Analytics']
        },

        // Executive & Leadership Templates
        {
            id: 'chief-of-staff-executive',
            name: 'Chief of Staff - Executive',
            category: 'executive',
            jobTitle: 'Chief of Staff',
            description: 'Premium executive template designed for C-suite adjacency. Emphasizes strategic thinking and execution.',
            features: ['Executive summary', 'Strategic initiatives', 'Cross-functional leadership', 'Board readiness'],
            preview: 'chief-of-staff-executive.jpg',
            rating: 5.0,
            downloads: 3421,
            level: 'Executive',
            color: 'gold',
            tags: ['Executive', 'Strategic', 'Leadership', 'C-Suite'],
            optimizedFor: ['Fortune 500', 'Unicorns', 'Growth Companies', 'C-Suite Roles']
        },
        {
            id: 'operations-director',
            name: 'Operations Director - Strategic',
            category: 'executive',
            jobTitle: 'Director of Operations',
            description: 'Leadership-focused template for operations executives. Highlights process optimization and team leadership.',
            features: ['Process optimization', 'Team leadership', 'Operational metrics', 'Strategic planning'],
            preview: 'operations-director.jpg',
            rating: 4.8,
            downloads: 4231,
            level: 'Director+',
            color: 'emerald',
            tags: ['Operations', 'Leadership', 'Process', 'Strategic'],
            optimizedFor: ['Operations Leadership', 'COO Track', 'Process Excellence']
        },

        // Operations & Consulting Templates
        {
            id: 'management-consultant',
            name: 'Management Consultant - Premium',
            category: 'operations',
            jobTitle: 'Management Consultant',
            description: 'Prestigious consulting template optimized for MBB and top-tier firms. Emphasizes analytical rigor.',
            features: ['Case study format', 'Analytical framework', 'Client impact', 'Prestige focus'],
            preview: 'management-consultant.jpg',
            rating: 4.9,
            downloads: 8765,
            level: 'All Levels',
            color: 'slate',
            tags: ['Consulting', 'Analytical', 'Premium', 'Case Studies'],
            optimizedFor: ['McKinsey', 'BCG', 'Bain', 'Big 4', 'Top-Tier Consulting']
        },
        {
            id: 'business-analyst-strategic',
            name: 'Business Analyst - Strategic',
            category: 'operations',
            jobTitle: 'Business Analyst',
            description: 'Analysis-focused template highlighting process improvement and strategic recommendations.',
            features: ['Process analysis', 'Strategic recommendations', 'Data insights', 'Business impact'],
            preview: 'business-analyst-strategic.jpg',
            rating: 4.7,
            downloads: 6543,
            level: 'Entry-Mid',
            color: 'blue',
            tags: ['Analysis', 'Process', 'Strategic', 'Business'],
            optimizedFor: ['Corporate Strategy', 'Process Improvement', 'Business Operations']
        },

        // Creative & Design Templates  
        {
            id: 'ux-designer-portfolio',
            name: 'UX Designer - Portfolio',
            category: 'creative',
            jobTitle: 'UX Designer',
            description: 'Portfolio-integrated template showcasing design process and user-centered thinking.',
            features: ['Design portfolio', 'Process showcase', 'User research', 'Prototyping'],
            preview: 'ux-designer-portfolio.jpg',
            rating: 4.8,
            downloads: 7892,
            level: 'All Levels',
            color: 'pink',
            tags: ['Portfolio', 'UX', 'Design Process', 'User Research'],
            optimizedFor: ['Design Studios', 'Product Companies', 'UX Teams']
        },
        {
            id: 'marketing-creative',
            name: 'Marketing Manager - Creative',
            category: 'creative',
            jobTitle: 'Marketing Manager',
            description: 'Brand-focused template highlighting creative campaigns and marketing impact.',
            features: ['Campaign showcase', 'Brand focus', 'Creative metrics', 'Growth marketing'],
            preview: 'marketing-creative.jpg',
            rating: 4.6,
            downloads: 5234,
            level: 'Mid-Senior',
            color: 'orange',
            tags: ['Marketing', 'Creative', 'Campaigns', 'Brand'],
            optimizedFor: ['Brand Marketing', 'Creative Agencies', 'Growth Marketing']
        },

        // Finance & Business Templates
        {
            id: 'financial-analyst-quant',
            name: 'Financial Analyst - Quantitative',
            category: 'finance',
            jobTitle: 'Financial Analyst',
            description: 'Numbers-focused template for finance professionals. Emphasizes analytical skills and business impact.',
            features: ['Financial modeling', 'Quantitative analysis', 'Business metrics', 'Excel expertise'],
            preview: 'financial-analyst-quant.jpg',
            rating: 4.7,
            downloads: 4567,
            level: 'All Levels',
            color: 'green',
            tags: ['Finance', 'Quantitative', 'Modeling', 'Analytics'],
            optimizedFor: ['Investment Banking', 'Corporate Finance', 'Financial Planning']
        },
        {
            id: 'investment-banker-prestige',
            name: 'Investment Banker - Prestige',
            category: 'finance',
            jobTitle: 'Investment Banker',
            description: 'High-impact template for competitive finance roles. Emphasizes deal experience and financial acumen.',
            features: ['Deal experience', 'Financial metrics', 'Transaction history', 'Prestige format'],
            preview: 'investment-banker-prestige.jpg',
            rating: 4.9,
            downloads: 3456,
            level: 'All Levels',
            color: 'emerald',
            tags: ['Investment Banking', 'Deals', 'Prestige', 'Finance'],
            optimizedFor: ['Bulge Bracket', 'Investment Banking', 'Private Equity', 'M&A']
        }
    ];

    // Filter templates based on category and search
    const filteredTemplates = professionalTemplates.filter(template => {
        const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const handleApplyTemplate = (template) => {
        // Store template selection
        localStorage.setItem('selectedProfessionalTemplate', JSON.stringify(template));

        // Navigate to Resume Builder or AI Dashboard
        navigate('/resume-builder', {
            state: {
                templateSelected: true,
                templateInfo: template
            }
        });
    };

    const getColorClasses = (color) => {
        const colorMap = {
            blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100',
            purple: 'border-purple-200 bg-purple-50 hover:bg-purple-100',
            indigo: 'border-indigo-200 bg-indigo-50 hover:bg-indigo-100',
            violet: 'border-violet-200 bg-violet-50 hover:bg-violet-100',
            pink: 'border-pink-200 bg-pink-50 hover:bg-pink-100',
            orange: 'border-orange-200 bg-orange-50 hover:bg-orange-100',
            green: 'border-green-200 bg-green-50 hover:bg-green-100',
            emerald: 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100',
            gold: 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100',
            slate: 'border-slate-200 bg-slate-50 hover:bg-slate-100'
        };
        return colorMap[color] || colorMap.blue;
    };

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                            <Briefcase className="w-8 h-8 text-blue-600" />
                            Professional Templates
                        </h1>
                        <p className="text-xl text-gray-600 mt-2">
                            Job-specific resume templates crafted by hiring experts and optimized for ATS systems
                        </p>
                    </div>
                    <div className="text-right">
                        <Badge variant="secondary" className="text-lg px-4 py-2">
                            {filteredTemplates.length} Templates
                        </Badge>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by role, company, or skill..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <Button
                        variant={selectedCategory === 'all' ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory('all')}
                        className="flex items-center gap-2"
                    >
                        All Templates
                    </Button>
                    {Object.entries(templateCategories).map(([key, category]) => (
                        <Button
                            key={key}
                            variant={selectedCategory === key ? 'default' : 'outline'}
                            onClick={() => setSelectedCategory(key)}
                            className={`flex items-center gap-2 ${selectedCategory === key ? '' : category.color}`}
                        >
                            {category.icon}
                            {category.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                    <Card
                        key={template.id}
                        className={`group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 ${getColorClasses(template.color)}`}
                        onClick={() => setSelectedTemplate(template)}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {template.name}
                                    </CardTitle>
                                    <p className="text-sm text-gray-600 font-medium">{template.jobTitle}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm font-medium">{template.rating}</span>
                                </div>
                            </div>

                            {/* Template Preview */}
                            <div className="relative aspect-[3/4] bg-gray-100 rounded-lg mb-3 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
                                    <div className="text-center">
                                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-xs text-gray-500">Preview</p>
                                    </div>
                                </div>
                                <div className="absolute top-2 right-2">
                                    <Badge variant="secondary" className="text-xs">
                                        {template.level}
                                    </Badge>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                            {/* Key Features */}
                            <div className="space-y-2 mb-3">
                                <div className="flex flex-wrap gap-1">
                                    {template.tags.slice(0, 3).map((tag) => (
                                        <Badge key={tag} variant="secondary" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Optimized For */}
                            <div className="mb-3">
                                <p className="text-xs font-medium text-gray-700 mb-1">Optimized for:</p>
                                <p className="text-xs text-gray-600">{template.optimizedFor.slice(0, 2).join(', ')}</p>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                <span className="flex items-center gap-1">
                                    <Download className="w-3 h-3" />
                                    {template.downloads.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    Preview
                                </span>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                            <div className="flex gap-2">
                                <Button
                                    className="flex-1"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleApplyTemplate(template);
                                    }}
                                >
                                    Use Template
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Preview functionality
                                    }}
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* No Results */}
            {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No templates found</h3>
                    <p className="text-gray-500">Try adjusting your search criteria or browse all categories</p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('all');
                        }}
                    >
                        Clear Filters
                    </Button>
                </div>
            )}

            {/* Selected Template Modal/Details */}
            {selectedTemplate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{selectedTemplate.name}</h3>
                                    <p className="text-lg text-gray-600">{selectedTemplate.jobTitle}</p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedTemplate(null)}
                                >
                                    Close
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Template Preview */}
                                <div>
                                    <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-4">
                                        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center rounded-lg">
                                            <div className="text-center">
                                                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                                                <p className="text-sm text-gray-500">Template Preview</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Template Details */}
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                                        <p className="text-gray-600">{selectedTemplate.description}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Key Features</h4>
                                        <ul className="space-y-1">
                                            {selectedTemplate.features.map((feature, index) => (
                                                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Optimized For</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedTemplate.optimizedFor.map((company) => (
                                                <Badge key={company} variant="secondary">
                                                    {company}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedTemplate.tags.map((tag) => (
                                                <Badge key={tag} variant="outline">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <div className="flex gap-3">
                                            <Button
                                                className="flex-1"
                                                onClick={() => handleApplyTemplate(selectedTemplate)}
                                            >
                                                Use This Template
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                            <Button variant="outline">
                                                <Copy className="w-4 h-4 mr-2" />
                                                Copy Link
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfessionalTemplates;
