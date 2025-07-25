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

    // Apply CSS custom properties for global styling
    root.style.setProperty('--template-primary', colors[0]);
    root.style.setProperty('--template-background', colors[1]);
    root.style.setProperty('--template-text', colors[2]);
    root.style.setProperty('--template-layout', template.preview.layout);

    // Add template-specific class to body
    document.body.className = document.body.className.replace(/template-\w+/g, '');
    document.body.classList.add(`template-${template.id}`);

    // Apply layout-specific styles
    if (template.preview.layout === 'two-column-header') {
      document.body.classList.add('two-column-layout');
    } else if (template.preview.layout === 'sidebar-left') {
      document.body.classList.add('sidebar-layout');
    } else {
      document.body.classList.add('single-column-layout');
    }
  };

  // Apply template globally
  const applyTemplate = (template) => {
    setSelectedTemplate(template);
    setAppliedTemplate(template);
    
    // Save to localStorage for persistence
    localStorage.setItem('appliedTemplate', JSON.stringify(template));
    
    // Apply styles immediately
    applyTemplateStyles(template);

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
    
    // Remove template classes
    document.body.className = document.body.className.replace(/template-\w+|layout-\w+/g, '');
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
