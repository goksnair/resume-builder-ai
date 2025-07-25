import React, { createContext, useContext, useState, useEffect } from 'react';

// Template Context
const TemplateContext = createContext();

// Template Provider Component
export const TemplateProvider = ({ children }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [appliedTemplate, setAppliedTemplate] = useState(null);

    // Load saved template from localStorage on mount
    useEffect(() => {
        const savedTemplate = localStorage.getItem('appliedTemplate');
        if (savedTemplate) {
            try {
                const template = JSON.parse(savedTemplate);
                setAppliedTemplate(template);
                setSelectedTemplate(template);
                applyTemplateStyles(template);
            } catch (error) {
                console.error('Error loading saved template:', error);
            }
        }
    }, []);

    // Apply template styles to the document
    const applyTemplateStyles = (template) => {
        if (!template || !template.preview) return;

        const root = document.documentElement;
        const colors = template.preview.colors;
        const uiTheme = template.preview.uiTheme;

        // Apply CSS custom properties for global styling
        root.style.setProperty('--template-primary', colors[0]);
        root.style.setProperty('--template-background', colors[1]);
        root.style.setProperty('--template-text', colors[2]);
        root.style.setProperty('--template-layout', template.preview.layout);

        // Apply UI theme properties if available
        if (uiTheme) {
            root.style.setProperty('--template-gradient', uiTheme.primaryGradient);
            root.style.setProperty('--template-card-style', uiTheme.cardStyle);
            root.style.setProperty('--template-button-style', uiTheme.buttonStyle);
            root.style.setProperty('--template-font-weight', uiTheme.fontWeight);
            root.style.setProperty('--template-theme-name', `"${uiTheme.name}"`);
        }

        // Add template-specific class to body
        document.body.className = document.body.className.replace(/template-\w+(-\w+)*/g, '');
        document.body.classList.add(`template-${template.id}`);
        
        // Add role-specific styling class
        if (template.category) {
            document.body.classList.add(`role-${template.category}`);
        }

        // Apply layout-specific styles
        document.body.className = document.body.className.replace(/layout-\w+(-\w+)*/g, '');
        if (template.preview.layout === 'two-column-header') {
            document.body.classList.add('layout-two-column');
        } else if (template.preview.layout === 'sidebar-left') {
            document.body.classList.add('layout-sidebar');
        } else if (template.preview.layout === 'creative-grid') {
            document.body.classList.add('layout-creative');
        } else if (template.preview.layout === 'finance-structured') {
            document.body.classList.add('layout-structured');
        } else if (template.preview.layout === 'data-visual') {
            document.body.classList.add('layout-visual');
        } else {
            document.body.classList.add('layout-single-column');
        }

        // Apply UI theme class if available
        if (uiTheme) {
            document.body.classList.add(`ui-${uiTheme.cardStyle}`);
        }
    };

    // Apply template globally
    const applyTemplate = (template) => {
        setSelectedTemplate(template);
        
        // Only apply website styling for UI themes, not resume templates
        if (template.category === 'ui-theme' || template.preview?.uiTheme?.templateType === 'ui-theme') {
            setAppliedTemplate(template);
            // Save to localStorage for persistence
            localStorage.setItem('appliedTemplate', JSON.stringify(template));
            // Apply styles immediately
            applyTemplateStyles(template);
        } else {
            // For resume templates, don't change website theme
            console.log('Resume template selected (no website theme change):', template.name);
        }

        return true;
    };

    // Reset to default template
    const resetTemplate = () => {
        setSelectedTemplate(null);
        setAppliedTemplate(null);
        localStorage.removeItem('appliedTemplate');

        // Reset styles
        const root = document.documentElement;
        root.style.removeProperty('--template-primary');
        root.style.removeProperty('--template-background');
        root.style.removeProperty('--template-text');
        root.style.removeProperty('--template-layout');
        root.style.removeProperty('--template-gradient');
        root.style.removeProperty('--template-card-style');
        root.style.removeProperty('--template-button-style');
        root.style.removeProperty('--template-font-weight');
        root.style.removeProperty('--template-theme-name');

        // Remove template classes
        document.body.className = document.body.className.replace(/template-\w+(-\w+)*|layout-\w+(-\w+)*|role-\w+|ui-\w+(-\w+)*/g, '');
    };

    // Get current template colors for components
    const getTemplateColors = () => {
        if (appliedTemplate && appliedTemplate.preview) {
            return {
                primary: appliedTemplate.preview.colors[0],
                background: appliedTemplate.preview.colors[1],
                text: appliedTemplate.preview.colors[2],
            };
        }
        return {
            primary: '#2563eb', // Default blue
            background: '#f8fafc',
            text: '#1e293b',
        };
    };

    const value = {
        selectedTemplate,
        appliedTemplate,
        applyTemplate,
        resetTemplate,
        getTemplateColors,
        isTemplateApplied: !!appliedTemplate,
    };

    return (
        <TemplateContext.Provider value={value}>
            {children}
        </TemplateContext.Provider>
    );
};

// Custom hook to use template context
export const useTemplate = () => {
    const context = useContext(TemplateContext);
    if (!context) {
        throw new Error('useTemplate must be used within a TemplateProvider');
    }
    return context;
};

// HOC to inject template styling
export const withTemplateStyles = (Component) => {
    return function TemplateStyledComponent(props) {
        const { getTemplateColors, appliedTemplate } = useTemplate();
        const colors = getTemplateColors();

        return (
            <div
                className="template-styled-component"
                style={{
                    '--current-primary': colors.primary,
                    '--current-background': colors.background,
                    '--current-text': colors.text,
                }}
            >
                <Component {...props} templateColors={colors} appliedTemplate={appliedTemplate} />
            </div>
        );
    };
};
