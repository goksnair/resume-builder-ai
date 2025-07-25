import React from 'react';
import { useTemplate } from '../../contexts/TemplateContext';
import { Palette, X, CheckCircle, Zap } from 'lucide-react';

const TemplateStatus = () => {
    const { appliedTemplate, isTemplateApplied, resetTemplate, getTemplateColors } = useTemplate();
    const templateColors = getTemplateColors();

    if (!isTemplateApplied) return null;

    return (
        <div className="fixed top-4 right-4 z-50">
            <div
                className="template-status-indicator bg-white border-3 rounded-xl shadow-2xl p-4 max-w-sm transition-all duration-300 hover:scale-105 hover:shadow-3xl"
                style={{ 
                    borderColor: templateColors.primary,
                    background: `linear-gradient(135deg, ${templateColors.background} 0%, white 100%)`
                }}
            >
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                            style={{ 
                                background: `linear-gradient(135deg, ${templateColors.primary} 0%, ${templateColors.primary}CC 100%)` 
                            }}
                        >
                            <Palette className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <span className="text-sm font-bold text-gray-900">Template Active</span>
                            <div className="flex items-center gap-1 mt-1">
                                <Zap className="w-3 h-3 text-green-600" />
                                <span className="text-xs text-green-600 font-medium">Live Theme Applied</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={resetTemplate}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 ml-2"
                        title="Reset to Default Theme"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                <div className="mb-3">
                    <div className="font-bold text-base" style={{ color: templateColors.primary }}>
                        {appliedTemplate.name}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                        {appliedTemplate.preview.uiTheme?.name || 'Professional'} Theme
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                        <div 
                            className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: templateColors.primary }}
                        ></div>
                        <span className="text-gray-500 capitalize">
                            {appliedTemplate.preview.layout.replace('-', ' ')} layout
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span className="text-green-600 font-medium">Active</span>
                    </div>
                </div>

                {/* Theme Preview Bar */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Color Scheme:</span>
                        <div className="flex gap-1">
                            {appliedTemplate.preview.colors.map((color, index) => (
                                <div
                                    key={index}
                                    className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                                    style={{ backgroundColor: color }}
                                    title={`Color ${index + 1}: ${color}`}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateStatus;
