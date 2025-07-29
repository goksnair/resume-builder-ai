import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { performanceManager } from '../../utils/performance';

/**
 * ExportManager Component - Resume Export Functionality
 * Provides multiple export formats with preview capabilities
 */
const ExportManager = ({ isOpen, onClose, resumeData = null }) => {
  const { currentTheme } = useTheme();
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportOptions, setExportOptions] = useState({
    includePhoto: true,
    includeReferences: false,
    colorScheme: 'professional',
    pageSize: 'A4',
    fontSize: 'medium'
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Export format configurations
  const exportFormats = {
    pdf: {
      name: 'PDF Document',
      description: 'Professional PDF suitable for email and printing',
      icon: '📄',
      size: 'Optimized (~200KB)',
      compatibility: 'Universal'
    },
    docx: {
      name: 'Word Document',
      description: 'Editable Word document for further customization',
      icon: '📝',
      size: 'Editable (~150KB)',
      compatibility: 'Microsoft Office'
    },
    html: {
      name: 'Web Page',
      description: 'Interactive HTML version for online portfolios',
      icon: '🌐',
      size: 'Interactive (~50KB)',
      compatibility: 'All Browsers'
    },
    png: {
      name: 'Image',
      description: 'High-quality image for social media and previews',
      icon: '🖼️',
      size: 'High-res (~500KB)',
      compatibility: 'Universal'
    }
  };

  // Color scheme options
  const colorSchemes = {
    professional: { name: 'Professional', primary: '#2563eb', accent: '#1e40af' },
    modern: { name: 'Modern', primary: '#7c3aed', accent: '#5b21b6' },
    warm: { name: 'Warm', primary: '#ea580c', accent: '#c2410c' },
    fresh: { name: 'Fresh', primary: '#059669', accent: '#047857' },
    classic: { name: 'Classic', primary: '#374151', accent: '#111827' }
  };

  // Handle export process
  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export progress
      const steps = [
        { progress: 20, message: 'Preparing resume data...' },
        { progress: 40, message: 'Applying formatting...' },
        { progress: 60, message: 'Generating preview...' },
        { progress: 80, message: 'Optimizing output...' },
        { progress: 100, message: 'Export complete!' }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setExportProgress(step.progress);
      }

      // Mock export functionality - in production this would call the backend API
      const exportData = {
        format: exportFormat,
        options: exportOptions,
        resumeData: resumeData || {
          name: 'John Doe',
          title: 'Software Engineer',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567'
        },
        timestamp: new Date().toISOString()
      };

      // Create download link (mock implementation)
      const filename = `resume_${exportData.resumeData.name.toLowerCase().replace(' ', '_')}.${exportFormat}`;
      console.log('Export completed:', { filename, exportData });

      // In production, this would trigger actual file download
      alert(`Export completed! File: ${filename}\n\nThis is a demo - actual file download would happen here.`);

    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  // Handle option changes
  const handleOptionChange = (option, value) => {
    setExportOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  // Enable hardware acceleration for modal
  React.useEffect(() => {
    if (isOpen) {
      const modal = document.querySelector('.export-modal');
      if (modal) {
        performanceManager.enableHardwareAcceleration(modal);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="export-modal-overlay" onClick={onClose}>
      <div 
        className="export-modal glass-moderate"
        onClick={e => e.stopPropagation()}
        style={{
          '--theme-primary': currentTheme.primary,
          '--theme-secondary': currentTheme.secondary,
          '--theme-accent': currentTheme.accent
        }}
      >
        {/* Header */}
        <div className="export-header">
          <h2 className="export-title">
            📤 Export Resume
          </h2>
          <button 
            className="export-close-btn"
            onClick={onClose}
            aria-label="Close export manager"
          >
            ✕
          </button>
        </div>

        {/* Export Format Selection */}
        <div className="export-section">
          <h3 className="section-title">Choose Export Format</h3>
          <div className="format-grid">
            {Object.entries(exportFormats).map(([key, format]) => (
              <div
                key={key}
                className={`format-card ${exportFormat === key ? 'active' : ''}`}
                onClick={() => setExportFormat(key)}
              >
                <div className="format-icon">{format.icon}</div>
                <div className="format-details">
                  <h4 className="format-name">{format.name}</h4>
                  <p className="format-description">{format.description}</p>
                  <div className="format-meta">
                    <span className="format-size">{format.size}</span>
                    <span className="format-compatibility">{format.compatibility}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div className="export-section">
          <h3 className="section-title">Export Options</h3>
          
          <div className="options-grid">
            {/* Include Photo */}
            <label className="option-item">
              <input
                type="checkbox"
                checked={exportOptions.includePhoto}
                onChange={e => handleOptionChange('includePhoto', e.target.checked)}
              />
              <span className="option-label">Include Profile Photo</span>
            </label>

            {/* Include References */}
            <label className="option-item">
              <input
                type="checkbox"
                checked={exportOptions.includeReferences}
                onChange={e => handleOptionChange('includeReferences', e.target.checked)}
              />
              <span className="option-label">Include References</span>
            </label>

            {/* Color Scheme */}
            <div className="option-group">
              <label className="option-label">Color Scheme:</label>
              <select
                value={exportOptions.colorScheme}
                onChange={e => handleOptionChange('colorScheme', e.target.value)}
                className="option-select"
              >
                {Object.entries(colorSchemes).map(([key, scheme]) => (
                  <option key={key} value={key}>{scheme.name}</option>
                ))}
              </select>
            </div>

            {/* Page Size (for PDF/DOCX) */}
            {(exportFormat === 'pdf' || exportFormat === 'docx') && (
              <div className="option-group">
                <label className="option-label">Page Size:</label>
                <select
                  value={exportOptions.pageSize}
                  onChange={e => handleOptionChange('pageSize', e.target.value)}
                  className="option-select"
                >
                  <option value="A4">A4 (210 × 297 mm)</option>
                  <option value="Letter">Letter (8.5 × 11 in)</option>
                  <option value="Legal">Legal (8.5 × 14 in)</option>
                </select>
              </div>
            )}

            {/* Font Size */}
            <div className="option-group">
              <label className="option-label">Font Size:</label>
              <select
                value={exportOptions.fontSize}
                onChange={e => handleOptionChange('fontSize', e.target.value)}
                className="option-select"
              >
                <option value="small">Small (10pt)</option>
                <option value="medium">Medium (11pt)</option>
                <option value="large">Large (12pt)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="export-section">
          <h3 className="section-title">Preview</h3>
          <div className="export-preview">
            <div className="preview-placeholder">
              <div className="preview-icon">👁️</div>
              <p>Resume preview will appear here</p>
              <p className="preview-details">
                Format: {exportFormats[exportFormat].name} • 
                Color: {colorSchemes[exportOptions.colorScheme].name} • 
                Size: {exportOptions.pageSize}
              </p>
            </div>
          </div>
        </div>

        {/* Export Progress */}
        {isExporting && (
          <div className="export-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${exportProgress}%` }}
              ></div>
            </div>
            <p className="progress-text">
              Exporting... {exportProgress}%
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="export-actions">
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary export-btn"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <span className="btn-spinner">⏳</span>
                Exporting...
              </>
            ) : (
              <>
                📤 Export {exportFormats[exportFormat].name}
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .export-modal-overlay {
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

        .export-modal {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 24px;
          transform: translateZ(0);
        }

        .export-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .export-title {
          font-size: 24px;
          font-weight: 600;
          color: var(--theme-primary);
          margin: 0;
        }

        .export-close-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }

        .export-close-btn:hover {
          background: rgba(0, 0, 0, 0.1);
        }

        .export-section {
          margin-bottom: 32px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--theme-secondary);
        }

        .format-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .format-card {
          display: flex;
          align-items: center;
          padding: 16px;
          border: 2px solid transparent;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .format-card:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: translateY(-2px);
        }

        .format-card.active {
          border-color: var(--theme-primary);
          background: rgba(37, 99, 235, 0.1);
        }

        .format-icon {
          font-size: 32px;
          margin-right: 16px;
        }

        .format-details {
          flex: 1;
        }

        .format-name {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: var(--theme-secondary);
        }

        .format-description {
          font-size: 14px;
          color: #666;
          margin: 0 0 8px 0;
        }

        .format-meta {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #888;
        }

        .options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .option-item {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .option-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .option-label {
          font-weight: 500;
          color: var(--theme-secondary);
        }

        .option-select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: white;
          font-size: 14px;
        }

        .export-preview {
          border: 2px dashed #ddd;
          border-radius: 12px;
          padding: 32px;
          text-align: center;
          background: rgba(255, 255, 255, 0.5);
        }

        .preview-placeholder {
          color: #666;
        }

        .preview-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .preview-details {
          font-size: 14px;
          color: #888;
          margin-top: 8px;
        }

        .export-progress {
          margin-bottom: 24px;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--theme-primary);
          transition: width 0.3s ease;
        }

        .progress-text {
          text-align: center;
          margin-top: 8px;
          font-size: 14px;
          color: var(--theme-secondary);
        }

        .export-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding-top: 16px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
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

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .btn-primary {
          background: var(--theme-primary);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: var(--theme-secondary);
          transform: translateY(-1px);
        }

        .btn-spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .export-modal {
            background: rgba(17, 24, 39, 0.95);
            color: white;
          }

          .format-card {
            background: rgba(31, 41, 55, 0.5);
          }

          .format-card:hover {
            background: rgba(31, 41, 55, 0.8);
          }

          .export-preview {
            background: rgba(31, 41, 55, 0.5);
          }

          .option-select {
            background: #374151;
            color: white;
            border-color: #4b5563;
          }
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .export-modal {
            width: 95%;
            padding: 16px;
          }

          .format-grid {
            grid-template-columns: 1fr;
          }

          .options-grid {
            grid-template-columns: 1fr;
          }

          .export-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default ExportManager;