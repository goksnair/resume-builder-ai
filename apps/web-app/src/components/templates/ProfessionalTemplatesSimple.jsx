import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTemplate } from '../../contexts/TemplateContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
    const { applyTemplate, appliedTemplate, isTemplateApplied } = useTemplate();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [downloadStatus, setDownloadStatus] = useState({});
    const [downloadMenuOpen, setDownloadMenuOpen] = useState({});

    console.log('ProfessionalTemplates component rendering', { appliedTemplate, isTemplateApplied });

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
            level: 'All Levels',
            preview: {
                sections: ['Contact', 'Summary', 'Technical Skills', 'Experience', 'Projects', 'Education'],
                layout: 'single-column',
                colors: ['#2563eb', '#f8fafc', '#1e293b'],
                features: ['ATS-friendly', 'Clean typography', 'Skills matrix', 'Project highlights']
            },
            sampleContent: {
                name: 'Alex Johnson',
                title: 'Senior Software Engineer',
                summary: 'Experienced full-stack developer with 5+ years building scalable web applications...',
                skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
                experience: [{
                    company: 'Tech Corp',
                    role: 'Senior Software Engineer',
                    duration: '2022 - Present',
                    achievements: ['Led development of microservices architecture', 'Improved system performance by 40%']
                }]
            }
        },
        {
            id: 'product-manager-executive',
            name: 'Product Manager - Executive',
            category: 'product',
            description: 'Strategic template focusing on product vision and cross-functional leadership.',
            rating: 4.8,
            downloads: 8231,
            level: 'Senior',
            preview: {
                sections: ['Header', 'Executive Summary', 'Core Competencies', 'Professional Experience', 'Key Achievements', 'Education'],
                layout: 'two-column-header',
                colors: ['#7c3aed', '#f3f4f6', '#374151'],
                features: ['Executive design', 'Metrics focus', 'Leadership emphasis', 'Strategic positioning']
            },
            sampleContent: {
                name: 'Sarah Chen',
                title: 'Senior Product Manager',
                summary: 'Strategic product leader with 7+ years driving product vision and go-to-market...',
                skills: ['Product Strategy', 'User Research', 'Data Analysis', 'Cross-functional Leadership'],
                experience: [{
                    company: 'Innovation Labs',
                    role: 'Senior Product Manager',
                    duration: '2021 - Present',
                    achievements: ['Launched 3 major products with $5M+ revenue', 'Led team of 12 across engineering and design']
                }]
            }
        },
        {
            id: 'business-analyst-modern',
            name: 'Business Analyst - Modern',
            category: 'business',
            description: 'Data-driven template highlighting analytical skills and business impact.',
            rating: 4.7,
            downloads: 6543,
            level: 'Mid-Level',
            preview: {
                sections: ['Personal Info', 'Professional Summary', 'Skills & Tools', 'Work Experience', 'Certifications', 'Education'],
                layout: 'sidebar-left',
                colors: ['#059669', '#ecfdf5', '#1f2937'],
                features: ['Data visualization', 'Metrics emphasis', 'Clean design', 'Professional layout']
            },
            sampleContent: {
                name: 'Michael Rodriguez',
                title: 'Business Analyst',
                summary: 'Detail-oriented analyst with 4+ years translating business requirements...',
                skills: ['SQL', 'Tableau', 'Excel', 'Process Improvement', 'Stakeholder Management'],
                experience: [{
                    company: 'Business Solutions Inc',
                    role: 'Business Analyst',
                    duration: '2020 - Present',
                    achievements: ['Automated reporting processes saving 20 hours/week', 'Identified $500K cost savings opportunity']
                }]
            }
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

    const handleDownload = async (templateId, format = 'pdf') => {
        const template = templates.find(t => t.id === templateId);
        if (!template) return;

        // Set downloading status
        setDownloadStatus(prev => ({ ...prev, [templateId]: 'downloading' }));

        try {
            if (format === 'pdf') {
                await downloadAsPDF(template);
            } else {
                await downloadAsHTML(template);
            }

            // Set success status
            setDownloadStatus(prev => ({ ...prev, [templateId]: 'success' }));

            // Reset status after 3 seconds
            setTimeout(() => {
                setDownloadStatus(prev => ({ ...prev, [templateId]: null }));
            }, 3000);

        } catch (error) {
            console.error('Download failed:', error);
            setDownloadStatus(prev => ({ ...prev, [templateId]: 'error' }));
            setTimeout(() => {
                setDownloadStatus(prev => ({ ...prev, [templateId]: null }));
            }, 3000);
        }
    };

    const downloadAsPDF = async (template) => {
        // Create a temporary div with the resume content
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '0';
        tempDiv.style.width = '800px';
        tempDiv.style.background = 'white';
        tempDiv.style.padding = '40px';
        tempDiv.style.fontFamily = 'Arial, sans-serif';

        tempDiv.innerHTML = generateResumeHTML(template, true);
        document.body.appendChild(tempDiv);

        // Wait for fonts to load
        await new Promise(resolve => setTimeout(resolve, 500));

        // Convert to canvas and then to PDF
        const canvas = await html2canvas(tempDiv, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
        });

        // Remove temporary div
        document.body.removeChild(tempDiv);

        // Create PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`${template.name.replace(/\s+/g, '-').toLowerCase()}-template.pdf`);
    };

    const downloadAsHTML = async (template) => {
        // Simulate download process
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Create a simple HTML template for download
        const htmlContent = generateResumeHTML(template);

        // Create blob and download
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}-template.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const generateResumeHTML = (template, forPDF = false) => {
        const { sampleContent } = template;
        const containerStyle = forPDF ? 'width: 800px; font-family: Arial, sans-serif; background: white; padding: 0;' : '';

        return `
${!forPDF ? '<!DOCTYPE html>\n<html>\n<head>\n    <meta charset="UTF-8">\n    <title>' + template.name + ' - Resume Template</title>\n    <style>' : ''}
        ${!forPDF ? 'body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f8fafc; }' : ''}
        .resume { 
            ${forPDF ? containerStyle : 'max-width: 800px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 0 20px rgba(0,0,0,0.1);'}
        }
        .header { 
            text-align: center; 
            border-bottom: 3px solid ${template.preview.colors[0]}; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
        }
        .name { 
            font-size: ${forPDF ? '2.2em' : '2.5em'}; 
            font-weight: bold; 
            color: ${template.preview.colors[2]}; 
            margin-bottom: 10px; 
            line-height: 1.2;
        }
        .title { 
            font-size: ${forPDF ? '1.1em' : '1.2em'}; 
            color: ${template.preview.colors[0]}; 
            margin-bottom: 20px; 
            font-weight: 500;
        }
        .section { 
            margin-bottom: ${forPDF ? '25px' : '30px'}; 
            page-break-inside: avoid;
        }
        .section-title { 
            font-size: ${forPDF ? '1.2em' : '1.3em'}; 
            font-weight: bold; 
            color: ${template.preview.colors[2]}; 
            border-bottom: 2px solid ${template.preview.colors[0]}; 
            padding-bottom: 8px; 
            margin-bottom: 15px; 
        }
        .summary { 
            line-height: 1.6; 
            color: #4b5563; 
            text-align: justify;
        }
        .skills { 
            display: flex; 
            flex-wrap: wrap; 
            gap: ${forPDF ? '8px' : '10px'}; 
        }
        .skill { 
            background: ${template.preview.colors[0]}; 
            color: white; 
            padding: ${forPDF ? '6px 12px' : '8px 15px'}; 
            border-radius: 20px; 
            font-size: ${forPDF ? '0.85em' : '0.9em'}; 
            font-weight: 500;
        }
        .experience-item { 
            margin-bottom: 20px; 
            page-break-inside: avoid;
        }
        .company { 
            font-weight: bold; 
            color: ${template.preview.colors[2]}; 
            font-size: ${forPDF ? '1.05em' : '1.1em'}; 
        }
        .role { 
            color: ${template.preview.colors[0]}; 
            font-weight: 600; 
            margin: 3px 0;
        }
        .duration { 
            color: #6b7280; 
            font-size: 0.9em; 
            font-style: italic;
        }
        .achievement { 
            margin: 8px 0; 
            color: #4b5563; 
            line-height: 1.5;
        }
        .contact-info {
            text-align: center;
            margin-bottom: 10px;
            color: #6b7280;
            font-size: 0.9em;
        }
        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, ${template.preview.colors[0]}, transparent);
            margin: 20px 0;
        }
${!forPDF ? '    </style>\n</head>\n<body>' : ''}
    <div class="resume">
        <div class="header">
            <div class="name">${sampleContent.name}</div>
            <div class="title">${sampleContent.title}</div>
            <div class="contact-info">
                📧 ${sampleContent.name.toLowerCase().replace(' ', '.')}@email.com | 📱 (555) 123-4567 | 💼 linkedin.com/in/${sampleContent.name.toLowerCase().replace(' ', '')}
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">Professional Summary</div>
            <div class="summary">${sampleContent.summary} Proven track record of delivering high-impact solutions and driving measurable business results through innovative approaches and collaborative leadership.</div>
        </div>
        
        <div class="divider"></div>
        
        <div class="section">
            <div class="section-title">Core Competencies</div>
            <div class="skills">
                ${sampleContent.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
            </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="section">
            <div class="section-title">Professional Experience</div>
            ${sampleContent.experience.map(exp => `
                <div class="experience-item">
                    <div class="company">${exp.company}</div>
                    <div class="role">${exp.role}</div>
                    <div class="duration">${exp.duration}</div>
                    ${exp.achievements.map(achievement => `<div class="achievement">• ${achievement}</div>`).join('')}
                    <div class="achievement">• Collaborated with cross-functional teams to deliver exceptional results</div>
                    <div class="achievement">• Implemented best practices and innovative solutions to optimize processes</div>
                </div>
            `).join('')}
        </div>
        
        <div class="divider"></div>
        
        <div class="section">
            <div class="section-title">Education & Certifications</div>
            <div class="experience-item">
                <div class="company">University of Excellence</div>
                <div class="role">Bachelor of Science in Computer Science</div>
                <div class="duration">2018 - 2022</div>
                <div class="achievement">• Graduated Magna Cum Laude with 3.8 GPA</div>
                <div class="achievement">• Relevant coursework: Data Structures, Algorithms, Software Engineering</div>
            </div>
        </div>
    </div>
${!forPDF ? '</body>\n</html>' : ''}`;
    };

    const handleApplyTemplate = (templateId) => {
        const template = templates.find(t => t.id === templateId);
        if (template) {
            const success = applyTemplate(template);
            if (success) {
                // Add visual feedback
                const notification = document.createElement('div');
                notification.className = 'template-indicator';
                notification.textContent = `✓ ${template.name} Applied`;
                document.body.appendChild(notification);
                
                // Remove notification after 3 seconds
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 3000);
                
                // Add template-applied class to body for styling
                document.body.classList.add('template-applied');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <Briefcase className="w-8 h-8 text-blue-600" />
                        Professional Templates
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
                    {filteredTemplates.map((template) => (
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
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handlePreview(template.id)}
                                        className="flex-1 flex items-center justify-center gap-1 px-2 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm"
                                    >
                                        <Eye className="w-3 h-3" />
                                        Preview
                                    </button>
                                    <button
                                        onClick={() => handleApplyTemplate(template.id)}
                                        className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-md transition-colors text-sm ${
                                            appliedTemplate?.id === template.id
                                                ? 'bg-green-600 text-white'
                                                : 'bg-purple-600 text-white hover:bg-purple-700'
                                        }`}
                                    >
                                        {appliedTemplate?.id === template.id ? (
                                            <>
                                                <CheckCircle className="w-3 h-3" />
                                                Applied
                                            </>
                                        ) : (
                                            <>
                                                <Briefcase className="w-3 h-3" />
                                                Apply
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleDownload(template.id)}
                                        disabled={downloadStatus[template.id] === 'downloading'}
                                        className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-md transition-colors text-sm ${
                                            downloadStatus[template.id] === 'downloading'
                                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                                : downloadStatus[template.id] === 'success'
                                                    ? 'bg-green-600 text-white'
                                                    : downloadStatus[template.id] === 'error'
                                                        ? 'bg-red-600 text-white'
                                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                    >
                                        {downloadStatus[template.id] === 'downloading' ? (
                                            <>
                                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span className="hidden sm:inline">Download</span>
                                            </>
                                        ) : downloadStatus[template.id] === 'success' ? (
                                            <>
                                                <CheckCircle className="w-3 h-3" />
                                                <span className="hidden sm:inline">Downloaded</span>
                                            </>
                                        ) : downloadStatus[template.id] === 'error' ? (
                                            <>
                                                <X className="w-3 h-3" />
                                                <span className="hidden sm:inline">Failed</span>
                                            </>
                                        ) : (
                                            <>
                                                <Download className="w-3 h-3" />
                                                <span className="hidden sm:inline">Download</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No templates message */}
                {filteredTemplates.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No templates found for this category.</p>
                    </div>
                )}

                {/* Call to Action */}
                <div className="mt-16 text-center">
                    <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Ready to Build Your Resume?
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Use our AI-powered resume builder to create a personalized resume that stands out.
                        </p>
                        <button
                            onClick={() => navigate('/ai?tab=builder')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
                        >
                            Start AI Resume Builder
                        </button>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {previewTemplate && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setPreviewTemplate(null);
                            setDownloadMenuOpen({});
                        }
                    }}
                >
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{previewTemplate.name}</h2>
                                <p className="text-gray-600 mt-1">{previewTemplate.description}</p>
                            </div>
                            <button
                                onClick={() => setPreviewTemplate(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Template Preview */}
                                <div className="order-2 lg:order-1">
                                    <h3 className="text-lg font-semibold mb-4">Template Preview</h3>
                                    <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50 min-h-96">
                                        <div className="bg-white rounded shadow-sm p-6 max-w-sm mx-auto">
                                            {/* Header */}
                                            <div className="text-center mb-4 pb-3 border-b-2" style={{ borderColor: previewTemplate.preview.colors[0] }}>
                                                <h4 className="text-xl font-bold" style={{ color: previewTemplate.preview.colors[2] }}>
                                                    {previewTemplate.sampleContent.name}
                                                </h4>
                                                <p className="text-sm" style={{ color: previewTemplate.preview.colors[0] }}>
                                                    {previewTemplate.sampleContent.title}
                                                </p>
                                            </div>

                                            {/* Summary */}
                                            <div className="mb-3">
                                                <h5 className="text-sm font-semibold mb-1" style={{ color: previewTemplate.preview.colors[2] }}>
                                                    Summary
                                                </h5>
                                                <p className="text-xs text-gray-600 leading-relaxed">
                                                    {previewTemplate.sampleContent.summary}
                                                </p>
                                            </div>

                                            {/* Skills */}
                                            <div className="mb-3">
                                                <h5 className="text-sm font-semibold mb-2" style={{ color: previewTemplate.preview.colors[2] }}>
                                                    Skills
                                                </h5>
                                                <div className="flex flex-wrap gap-1">
                                                    {previewTemplate.sampleContent.skills.slice(0, 4).map((skill, index) => (
                                                        <span
                                                            key={index}
                                                            className="text-xs px-2 py-1 rounded text-white"
                                                            style={{ backgroundColor: previewTemplate.preview.colors[0] }}
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Experience */}
                                            <div>
                                                <h5 className="text-sm font-semibold mb-1" style={{ color: previewTemplate.preview.colors[2] }}>
                                                    Experience
                                                </h5>
                                                <div className="text-xs">
                                                    <p className="font-medium">{previewTemplate.sampleContent.experience[0].company}</p>
                                                    <p style={{ color: previewTemplate.preview.colors[0] }}>{previewTemplate.sampleContent.experience[0].role}</p>
                                                    <p className="text-gray-500">{previewTemplate.sampleContent.experience[0].duration}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Template Details */}
                                <div className="order-1 lg:order-2">
                                    <h3 className="text-lg font-semibold mb-4">Template Details</h3>

                                    {/* Features */}
                                    <div className="mb-6">
                                        <h4 className="font-medium text-gray-900 mb-2">Key Features</h4>
                                        <div className="space-y-2">
                                            {previewTemplate.preview.features.map((feature, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                    <span className="text-sm text-gray-700">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sections */}
                                    <div className="mb-6">
                                        <h4 className="font-medium text-gray-900 mb-2">Resume Sections</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {previewTemplate.preview.sections.map((section, index) => (
                                                <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                                    {section}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stats */}
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
                                        <div className="flex-1 relative">
                                            {downloadStatus[previewTemplate.id] === 'downloading' ? (
                                                <button
                                                    disabled
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-400 text-white rounded-md cursor-not-allowed"
                                                >
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Downloading...
                                                </button>
                                            ) : downloadStatus[previewTemplate.id] === 'success' ? (
                                                <button
                                                    disabled
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-md"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Downloaded
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => setDownloadMenuOpen(prev => ({ ...prev, [previewTemplate.id]: !prev[previewTemplate.id] }))}
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Download Template
                                                    </button>
                                                    {downloadMenuOpen[previewTemplate.id] && (
                                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                                            <button
                                                                onClick={() => {
                                                                    handleDownload(previewTemplate.id, 'pdf');
                                                                    setDownloadMenuOpen(prev => ({ ...prev, [previewTemplate.id]: false }));
                                                                }}
                                                                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                                                            >
                                                                <FileText className="w-4 h-4 text-red-600" />
                                                                Download as PDF
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    handleDownload(previewTemplate.id, 'html');
                                                                    setDownloadMenuOpen(prev => ({ ...prev, [previewTemplate.id]: false }));
                                                                }}
                                                                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 border-t"
                                                            >
                                                                <Code className="w-4 h-4 text-blue-600" />
                                                                Download as HTML
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleApplyTemplate(previewTemplate.id)}
                                            className={`flex items-center gap-2 px-4 py-3 rounded-md transition-colors ${
                                                appliedTemplate?.id === previewTemplate.id
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-purple-600 text-white hover:bg-purple-700'
                                            }`}
                                        >
                                            {appliedTemplate?.id === previewTemplate.id ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4" />
                                                    Template Applied
                                                </>
                                            ) : (
                                                <>
                                                    <Briefcase className="w-4 h-4" />
                                                    Apply Template Globally
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setPreviewTemplate(null);
                                                navigate('/ai?tab=builder');
                                            }}
                                            className="flex items-center gap-2 px-4 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                                        >
                                            <FileText className="w-4 h-4" />
                                            Use with AI Builder
                                        </button>
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
