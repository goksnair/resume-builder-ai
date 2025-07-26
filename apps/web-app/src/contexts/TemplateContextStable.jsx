import React, { createContext, useContext, useState, useEffect } from 'react';

// Template Context
const TemplateContext = createContext();

// Template Provider Component
export const TemplateProvider = ({ children }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [appliedTemplate, setAppliedTemplate] = useState(null);

    // Apply template for resume building (not website theming)
    const applyTemplate = (template) => {
        console.log('Template selected for resume building:', template.name);
        setSelectedTemplate(template);
        setAppliedTemplate(template);

        // Save to localStorage for resume building context
        localStorage.setItem('selectedResumeTemplate', JSON.stringify(template));

        return true;
    };

    // Reset template selection
    const resetTemplate = () => {
        setSelectedTemplate(null);
        setAppliedTemplate(null);
        localStorage.removeItem('selectedResumeTemplate');
    };

    // Load saved template from localStorage on mount
    useEffect(() => {
        const savedTemplate = localStorage.getItem('selectedResumeTemplate');
        if (savedTemplate) {
            try {
                const template = JSON.parse(savedTemplate);
                setAppliedTemplate(template);
                setSelectedTemplate(template);
            } catch (error) {
                console.error('Error loading saved template:', error);
            }
        }
    }, []);

    // Get template colors for resume preview
    const getTemplateColors = () => {
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
