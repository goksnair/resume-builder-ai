import React from 'react';
import { useTemplate } from '../../contexts/TemplateContext';
import { Palette, X, CheckCircle } from 'lucide-react';

const TemplateStatus = () => {
  const { appliedTemplate, isTemplateApplied, resetTemplate } = useTemplate();

  if (!isTemplateApplied) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div 
        className="bg-white border-2 rounded-lg shadow-lg p-3 max-w-xs"
        style={{ borderColor: appliedTemplate.preview.colors[0] }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: appliedTemplate.preview.colors[0] }}
            ></div>
            <span className="text-sm font-medium text-gray-900">Template Active</span>
          </div>
          <button
            onClick={resetTemplate}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            title="Reset Template"
          >
            <X className="w-3 h-3 text-gray-500" />
          </button>
        </div>
        
        <div className="text-xs text-gray-600 mb-2">
          <div className="font-medium">{appliedTemplate.name}</div>
          <div className="flex items-center gap-1 mt-1">
            <CheckCircle className="w-3 h-3 text-green-600" />
            <span>Applied globally</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-xs">
          <Palette className="w-3 h-3" style={{ color: appliedTemplate.preview.colors[0] }} />
          <span className="text-gray-500">
            {appliedTemplate.preview.layout} layout
          </span>
        </div>
      </div>
    </div>
  );
};

export default TemplateStatus;
