import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTemplate } from '../../contexts/TemplateContextStable';
import {
    Briefcase,
    Code,
    Users,
    BarChart3,
    Download,
    Eye,
    Star,
    X,
    FileText,
    CheckCircle
} from 'lucide-react';

const ProfessionalTemplates = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [previewTemplate, setPreviewTemplate] = useState(null);

    const templateCategories = [
        { id: 'all', label: 'All Templates', icon: <Briefcase className="w-4 h-4" /> },
        { id: 'tech', label: 'Technology', icon: <Code className="w-4 h-4" /> },
        { id: 'product', label: 'Product & Strategy', icon: <Users className="w-4 h-4" /> },
        { id: 'business', label: 'Business & Operations', icon: <BarChart3 className="w-4 h-4" /> }
    ];

    const templates = [
        {
            id: 'software-engineer-modern',
            name: 'Software Engineer - Modern',
            category: 'tech',
            description: 'Clean, technical layout optimized for ATS and engineering managers.',
            rating: 4.9,
            downloads: 12453,
            level: 'All Levels'
        },
        {
            id: 'product-manager-executive',
            name: 'Product Manager - Executive',
            category: 'product',
            description: 'Strategic template focusing on product vision and cross-functional leadership.',
            rating: 4.8,
            downloads: 8231,
            level: 'Senior'
        },
        {
            id: 'business-analyst-modern',
            name: 'Business Analyst - Modern',
            category: 'business',
            description: 'Data-driven template highlighting analytical skills and business impact.',
            rating: 4.7,
            downloads: 6542,
            level: 'Mid-Senior'
        },
        {
            id: 'marketing-creative',
            name: 'Marketing Creative',
            category: 'business',
            description: 'Visual template perfect for marketing professionals and creatives.',
            rating: 4.6,
            downloads: 5234,
            level: 'All Levels'
        },
        {
            id: 'finance-professional',
            name: 'Finance Professional',
            category: 'business',
            description: 'Conservative, professional template for finance and accounting roles.',
            rating: 4.8,
            downloads: 4832,
            level: 'All Levels'
        },
        {
            id: 'data-scientist-analytics',
            name: 'Data Scientist - Analytics',
            category: 'tech',
            description: 'Technical template showcasing data science and analytical capabilities.',
            rating: 4.9,
            downloads: 7231,
            level: 'All Levels'
        }
    ];

    const filteredTemplates = selectedCategory === 'all'
        ? templates
        : templates.filter(template => template.category === selectedCategory);

    const handlePreview = (templateId) => {
        const template = templates.find(t => t.id === templateId);
        if (template) {
            setPreviewTemplate(template);
        }
    };

    const handleDownload = (templateId, format = 'pdf') => {
        const template = templates.find(t => t.id === templateId);
        if (template) {
            alert(`Download ${format.toUpperCase()} for "${template.name}" - Implementation coming soon!`);
        }
    };

    const handleUseTemplate = (templateId) => {
        navigate(`/ai?template=${templateId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <Briefcase className="w-8 h-8 text-blue-600" />
                        Professional Resume Templates
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Job-specific resume templates crafted by hiring experts and optimized for ATS systems
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {templateCategories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${selectedCategory === category.id
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                                }`}
                        >
                            {category.icon}
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.length > 0 ? (
                        filteredTemplates.map((template) => (
                            <div key={template.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Template Preview */}
                                <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                                    <div className="text-center">
                                        <Briefcase className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">Preview Available</p>
                                    </div>
                                </div>

                                {/* Template Info */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                                            {template.name}
                                        </h3>
                                        <div className="flex items-center gap-1 text-sm text-yellow-600">
                                            <Star className="w-4 h-4 fill-current" />
                                            {template.rating}
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-4">
                                        {template.description}
                                    </p>

                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                        <span>{template.level}</span>
                                        <span>{template.downloads.toLocaleString()} downloads</span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handlePreview(template.id)}
                                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Preview
                                        </button>
                                        <button
                                            onClick={() => handleDownload(template.id, 'pdf')}
                                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </button>
                                        <button
                                            onClick={() => handleUseTemplate(template.id)}
                                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                                        >
                                            <FileText className="w-4 h-4" />
                                            Use
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No templates found</h3>
                            <p className="text-gray-500">
                                No templates found for the selected category.
                            </p>
                        </div>
                    )}
                </div>

                {/* Preview Modal */}
                {previewTemplate && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {previewTemplate.name}
                                    </h2>
                                    <button
                                        onClick={() => setPreviewTemplate(null)}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Preview Area */}
                                    <div className="bg-gray-50 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
                                        <div className="text-center">
                                            <Briefcase className="w-24 h-24 text-blue-600 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {previewTemplate.name}
                                            </h3>
                                            <p className="text-gray-600">Preview coming soon</p>
                                        </div>
                                    </div>

                                    {/* Template Details */}
                                    <div>
                                        <div className="mb-6">
                                            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                                            <p className="text-gray-600">{previewTemplate.description}</p>
                                        </div>

                                        <div className="mb-6">
                                            <h4 className="font-medium text-gray-900 mb-2">Template Stats</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center p-3 bg-gray-50 rounded">
                                                    <div className="flex items-center justify-center gap-1 text-yellow-600 mb-1">
                                                        <Star className="w-4 h-4 fill-current" />
                                                        <span className="font-semibold">{previewTemplate.rating}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-600">Rating</p>
                                                </div>
                                                <div className="text-center p-3 bg-gray-50 rounded">
                                                    <div className="text-blue-600 font-semibold mb-1">
                                                        {previewTemplate.downloads.toLocaleString()}
                                                    </div>
                                                    <p className="text-xs text-gray-600">Downloads</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleDownload(previewTemplate.id, 'pdf')}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                <Download className="w-4 h-4" />
                                                Download PDF
                                            </button>
                                            <button
                                                onClick={() => handleUseTemplate(previewTemplate.id)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                            >
                                                <FileText className="w-4 h-4" />
                                                Use with AI
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfessionalTemplates;
