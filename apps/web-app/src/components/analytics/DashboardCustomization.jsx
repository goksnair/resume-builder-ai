import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { performanceManager } from '../../utils/performance';

/**
 * DashboardCustomization Component - Analytics Dashboard Personalization
 * Allows users to customize their analytics dashboard layout and preferences
 */
const DashboardCustomization = ({ isOpen, onClose, currentConfig = {}, onSave }) => {
  const { currentTheme } = useTheme();
  const [config, setConfig] = useState({
    layout: 'grid',
    widgets: {
      resumeViews: { enabled: true, position: 0, size: 'medium' },
      skillsAnalysis: { enabled: true, position: 1, size: 'large' },
      careerProgress: { enabled: true, position: 2, size: 'medium' },
      jobMatching: { enabled: true, position: 3, size: 'small' },
      performanceMetrics: { enabled: false, position: 4, size: 'medium' },
      industryTrends: { enabled: false, position: 5, size: 'large' }
    },
    preferences: {
      updateFrequency: 'realtime',
      chartStyle: 'modern',
      colorScheme: 'auto',
      animations: true,
      compactMode: false
    },
    ...currentConfig
  });

  const [activeTab, setActiveTab] = useState('layout');
  const [isDragging, setIsDragging] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState(null);

  // Available widgets configuration
  const availableWidgets = {
    resumeViews: {
      name: 'Resume Views',
      description: 'Track how many times your resume has been viewed',
      icon: '👁️',
      category: 'engagement'
    },
    skillsAnalysis: {
      name: 'Skills Analysis',
      description: 'Analyze your skills against market demand',
      icon: '🎯',
      category: 'analysis'
    },
    careerProgress: {
      name: 'Career Progress',
      description: 'Track your career development over time',
      icon: '📈',
      category: 'progress'
    },
    jobMatching: {
      name: 'Job Matching',
      description: 'See how well your resume matches job requirements',
      icon: '🎯',
      category: 'matching'
    },
    performanceMetrics: {
      name: 'Performance Metrics',
      description: 'Detailed performance analytics and insights',
      icon: '📊',
      category: 'metrics'
    },
    industryTrends: {
      name: 'Industry Trends',
      description: 'Stay updated with industry and market trends',
      icon: '🔮',
      category: 'trends'
    }
  };

  // Layout options
  const layoutOptions = {
    grid: { name: 'Grid Layout', description: 'Organized grid with equal spacing', icon: '⊞' },
    masonry: { name: 'Masonry Layout', description: 'Pinterest-style flowing layout', icon: '🧱' },
    list: { name: 'List Layout', description: 'Vertical list with full width', icon: '☰' },
    dashboard: { name: 'Dashboard Layout', description: 'Traditional dashboard with sections', icon: '📊' }
  };

  // Widget size options
  const sizeOptions = {
    small: { name: 'Small', width: '1 column', height: '200px' },
    medium: { name: 'Medium', width: '2 columns', height: '300px' },
    large: { name: 'Large', width: '3 columns', height: '400px' }
  };

  // Handle widget toggle
  const toggleWidget = (widgetId) => {
    setConfig(prev => ({
      ...prev,
      widgets: {
        ...prev.widgets,
        [widgetId]: {
          ...prev.widgets[widgetId],
          enabled: !prev.widgets[widgetId].enabled
        }
      }
    }));
  };

  // Handle widget size change
  const changeWidgetSize = (widgetId, size) => {
    setConfig(prev => ({
      ...prev,
      widgets: {
        ...prev.widgets,
        [widgetId]: {
          ...prev.widgets[widgetId],
          size
        }
      }
    }));
  };

  // Handle layout change
  const changeLayout = (layout) => {
    setConfig(prev => ({
      ...prev,
      layout
    }));
  };

  // Handle preference change
  const changePreference = (key, value) => {
    setConfig(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  // Handle drag start
  const handleDragStart = (e, widgetId) => {
    setIsDragging(true);
    setDraggedWidget(widgetId);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop
  const handleDrop = (e, targetWidgetId) => {
    e.preventDefault();
    
    if (draggedWidget && draggedWidget !== targetWidgetId) {
      setConfig(prev => {
        const widgets = { ...prev.widgets };
        const draggedPosition = widgets[draggedWidget].position;
        const targetPosition = widgets[targetWidgetId].position;
        
        widgets[draggedWidget].position = targetPosition;
        widgets[targetWidgetId].position = draggedPosition;
        
        return { ...prev, widgets };
      });
    }
    
    setIsDragging(false);
    setDraggedWidget(null);
  };

  // Handle save configuration
  const handleSave = () => {
    if (onSave) {
      onSave(config);
    }
    onClose();
  };

  // Reset to default configuration
  const handleReset = () => {
    setConfig({
      layout: 'grid',
      widgets: {
        resumeViews: { enabled: true, position: 0, size: 'medium' },
        skillsAnalysis: { enabled: true, position: 1, size: 'large' },
        careerProgress: { enabled: true, position: 2, size: 'medium' },
        jobMatching: { enabled: true, position: 3, size: 'small' },
        performanceMetrics: { enabled: false, position: 4, size: 'medium' },
        industryTrends: { enabled: false, position: 5, size: 'large' }
      },
      preferences: {
        updateFrequency: 'realtime',
        chartStyle: 'modern',
        colorScheme: 'auto',
        animations: true,
        compactMode: false
      }
    });
  };

  // Enable hardware acceleration for modal
  React.useEffect(() => {
    if (isOpen) {
      const modal = document.querySelector('.customization-modal');
      if (modal) {
        performanceManager.enableHardwareAcceleration(modal);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Get enabled widgets sorted by position
  const enabledWidgets = Object.entries(config.widgets)
    .filter(([_, widget]) => widget.enabled)
    .sort(([_, a], [__, b]) => a.position - b.position);

  return (
    <div className="customization-modal-overlay" onClick={onClose}>
      <div 
        className="customization-modal glass-moderate"
        onClick={e => e.stopPropagation()}
        style={{
          '--theme-primary': currentTheme.primary,
          '--theme-secondary': currentTheme.secondary,
          '--theme-accent': currentTheme.accent
        }}
      >
        {/* Header */}
        <div className="customization-header">
          <h2 className="customization-title">
            ⚙️ Customize Dashboard
          </h2>
          <button 
            className="customization-close-btn"
            onClick={onClose}
            aria-label="Close customization panel"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="customization-tabs">
          {[
            { id: 'layout', name: 'Layout', icon: '📐' },
            { id: 'widgets', name: 'Widgets', icon: '🧩' },
            { id: 'preferences', name: 'Preferences', icon: '⚙️' },
            { id: 'preview', name: 'Preview', icon: '👁️' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          
          {/* Layout Tab */}
          {activeTab === 'layout' && (
            <div className="layout-section">
              <h3 className="section-title">Choose Dashboard Layout</h3>
              <div className="layout-grid">
                {Object.entries(layoutOptions).map(([key, layout]) => (
                  <div
                    key={key}
                    className={`layout-card ${config.layout === key ? 'active' : ''}`}
                    onClick={() => changeLayout(key)}
                  >
                    <div className="layout-icon">{layout.icon}</div>
                    <div className="layout-details">
                      <h4 className="layout-name">{layout.name}</h4>
                      <p className="layout-description">{layout.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Widgets Tab */}
          {activeTab === 'widgets' && (
            <div className="widgets-section">
              <h3 className="section-title">Manage Widgets</h3>
              <div className="widgets-list">
                {Object.entries(availableWidgets).map(([widgetId, widget]) => {
                  const widgetConfig = config.widgets[widgetId];
                  return (
                    <div
                      key={widgetId}
                      className={`widget-item ${widgetConfig.enabled ? 'enabled' : 'disabled'}`}
                      draggable={widgetConfig.enabled}
                      onDragStart={(e) => handleDragStart(e, widgetId)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, widgetId)}
                    >
                      <div className="widget-info">
                        <div className="widget-icon">{widget.icon}</div>
                        <div className="widget-details">
                          <h4 className="widget-name">{widget.name}</h4>
                          <p className="widget-description">{widget.description}</p>
                        </div>
                      </div>
                      
                      <div className="widget-controls">
                        {widgetConfig.enabled && (
                          <select
                            value={widgetConfig.size}
                            onChange={(e) => changeWidgetSize(widgetId, e.target.value)}
                            className="size-select"
                          >
                            {Object.entries(sizeOptions).map(([size, info]) => (
                              <option key={size} value={size}>
                                {info.name} ({info.width})
                              </option>
                            ))}
                          </select>
                        )}
                        
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={widgetConfig.enabled}
                            onChange={() => toggleWidget(widgetId)}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="drag-help">
                💡 Drag enabled widgets to reorder them in your dashboard
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="preferences-section">
              <h3 className="section-title">Dashboard Preferences</h3>
              
              <div className="preferences-grid">
                {/* Update Frequency */}
                <div className="preference-item">
                  <label className="preference-label">Update Frequency:</label>
                  <select
                    value={config.preferences.updateFrequency}
                    onChange={(e) => changePreference('updateFrequency', e.target.value)}
                    className="preference-select"
                  >
                    <option value="realtime">Real-time</option>
                    <option value="hourly">Every Hour</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                {/* Chart Style */}
                <div className="preference-item">
                  <label className="preference-label">Chart Style:</label>
                  <select
                    value={config.preferences.chartStyle}
                    onChange={(e) => changePreference('chartStyle', e.target.value)}
                    className="preference-select"
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="minimal">Minimal</option>
                    <option value="detailed">Detailed</option>
                  </select>
                </div>

                {/* Color Scheme */}
                <div className="preference-item">
                  <label className="preference-label">Color Scheme:</label>
                  <select
                    value={config.preferences.colorScheme}
                    onChange={(e) => changePreference('colorScheme', e.target.value)}
                    className="preference-select"
                  >
                    <option value="auto">Auto (Theme)</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="colorful">Colorful</option>
                  </select>
                </div>

                {/* Animations */}
                <label className="preference-checkbox">
                  <input
                    type="checkbox"
                    checked={config.preferences.animations}
                    onChange={(e) => changePreference('animations', e.target.checked)}
                  />
                  <span className="preference-label">Enable Animations</span>
                </label>

                {/* Compact Mode */}
                <label className="preference-checkbox">
                  <input
                    type="checkbox"
                    checked={config.preferences.compactMode}
                    onChange={(e) => changePreference('compactMode', e.target.checked)}
                  />
                  <span className="preference-label">Compact Mode</span>
                </label>
              </div>
            </div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div className="preview-section">
              <h3 className="section-title">Dashboard Preview</h3>
              <div className={`dashboard-preview layout-${config.layout}`}>
                {enabledWidgets.map(([widgetId, widgetConfig]) => (
                  <div
                    key={widgetId}
                    className={`preview-widget size-${widgetConfig.size}`}
                  >
                    <div className="preview-widget-header">
                      <span className="preview-widget-icon">
                        {availableWidgets[widgetId].icon}
                      </span>
                      <span className="preview-widget-name">
                        {availableWidgets[widgetId].name}
                      </span>
                    </div>
                    <div className="preview-widget-content">
                      <div className="preview-chart"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="preview-info">
                <p>
                  <strong>Layout:</strong> {layoutOptions[config.layout].name} • 
                  <strong> Widgets:</strong> {enabledWidgets.length} enabled • 
                  <strong> Style:</strong> {config.preferences.chartStyle}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="customization-actions">
          <button
            className="btn btn-secondary"
            onClick={handleReset}
          >
            🔄 Reset to Default
          </button>
          <div className="action-group">
            <button
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
            >
              💾 Save Configuration
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .customization-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .customization-modal {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          width: 90%;
          max-width: 1000px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 24px;
          transform: translateZ(0);
        }

        .customization-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .customization-title {
          font-size: 24px;
          font-weight: 600;
          color: var(--theme-primary);
          margin: 0;
        }

        .customization-close-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }

        .customization-close-btn:hover {
          background: rgba(0, 0, 0, 0.1);
        }

        .customization-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 24px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 12px;
          padding: 4px;
        }

        .tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .tab-btn.active {
          background: white;
          color: var(--theme-primary);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .tab-icon {
          font-size: 16px;
        }

        .tab-content {
          min-height: 400px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--theme-secondary);
        }

        .layout-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .layout-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          border: 2px solid transparent;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .layout-card:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: translateY(-2px);
        }

        .layout-card.active {
          border-color: var(--theme-primary);
          background: rgba(37, 99, 235, 0.1);
        }

        .layout-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }

        .layout-name {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: var(--theme-secondary);
        }

        .layout-description {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .widgets-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .widget-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.5);
          transition: all 0.2s ease;
        }

        .widget-item:hover {
          background: rgba(255, 255, 255, 0.8);
        }

        .widget-item.enabled {
          border-color: var(--theme-primary);
          background: rgba(37, 99, 235, 0.05);
        }

        .widget-item.disabled {
          opacity: 0.6;
        }

        .widget-info {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .widget-icon {
          font-size: 24px;
        }

        .widget-name {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: var(--theme-secondary);
        }

        .widget-description {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .widget-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .size-select {
          padding: 6px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
          font-size: 14px;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.2s;
          border-radius: 24px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.2s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: var(--theme-primary);
        }

        input:checked + .toggle-slider:before {
          transform: translateX(24px);
        }

        .drag-help {
          text-align: center;
          font-size: 14px;
          color: #666;
          margin-top: 16px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 8px;
        }

        .preferences-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .preference-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .preference-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .preference-label {
          font-weight: 500;
          color: var(--theme-secondary);
        }

        .preference-select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: white;
          font-size: 14px;
        }

        .dashboard-preview {
          display: grid;
          gap: 16px;
          padding: 20px;
          background: rgba(0, 0, 0, 0.02);
          border-radius: 12px;
          border: 2px dashed #ddd;
        }

        .layout-grid .dashboard-preview {
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }

        .layout-masonry .dashboard-preview {
          columns: 3;
          column-gap: 16px;
        }

        .layout-list .dashboard-preview {
          grid-template-columns: 1fr;
        }

        .layout-dashboard .dashboard-preview {
          grid-template-columns: repeat(12, 1fr);
        }

        .preview-widget {
          background: white;
          border-radius: 8px;
          padding: 16px;
          border: 1px solid #e5e7eb;
          break-inside: avoid;
        }

        .size-small .preview-widget {
          height: 150px;
        }

        .size-medium .preview-widget {
          height: 200px;
        }

        .size-large .preview-widget {
          height: 300px;
        }

        .preview-widget-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-weight: 600;
          color: var(--theme-secondary);
        }

        .preview-widget-content {
          height: calc(100% - 40px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preview-chart {
          width: 80%;
          height: 60%;
          background: linear-gradient(45deg, var(--theme-primary), var(--theme-accent));
          border-radius: 4px;
          opacity: 0.3;
        }

        .preview-info {
          margin-top: 16px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 8px;
          font-size: 14px;
          color: #666;
        }

        .customization-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 20px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          margin-top: 24px;
        }

        .action-group {
          display: flex;
          gap: 12px;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .btn-primary {
          background: var(--theme-primary);
          color: white;
        }

        .btn-primary:hover {
          background: var(--theme-secondary);
          transform: translateY(-1px);
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .customization-modal {
            background: rgba(17, 24, 39, 0.95);
            color: white;
          }

          .layout-card, .widget-item {
            background: rgba(31, 41, 55, 0.5);
          }

          .layout-card:hover, .widget-item:hover {
            background: rgba(31, 41, 55, 0.8);
          }

          .dashboard-preview {
            background: rgba(31, 41, 55, 0.3);
          }

          .preview-widget {
            background: #374151;
            border-color: #4b5563;
            color: white;
          }

          .preference-select, .size-select {
            background: #374151;
            color: white;
            border-color: #4b5563;
          }
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .customization-modal {
            width: 95%;
            padding: 16px;
          }

          .customization-tabs {
            flex-direction: column;
          }

          .layout-grid {
            grid-template-columns: 1fr;
          }

          .preferences-grid {
            grid-template-columns: 1fr;
          }

          .customization-actions {
            flex-direction: column;
            gap: 12px;
          }

          .action-group {
            width: 100%;
          }

          .btn {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardCustomization;