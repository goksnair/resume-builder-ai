import React, { useState, useContext, createContext } from 'react';

// Simple fallback tabs implementation without external dependencies
const TabsContext = createContext();

export const Tabs = ({ children, value, onValueChange, className = '', ...props }) => {
    const [activeTab, setActiveTab] = useState(value);

    const handleValueChange = (newValue) => {
        setActiveTab(newValue);
        if (onValueChange) {
            onValueChange(newValue);
        }
    };

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab: handleValueChange }}>
            <div className={`tabs-container ${className}`} {...props}>
                {children}
            </div>
        </TabsContext.Provider>
    );
};

export const TabsList = ({ children, className = '', ...props }) => {
    return (
        <div
            role="tablist"
            className={`flex border-b border-gray-200 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export const TabsTrigger = ({ children, value, className = '', disabled = false, ...props }) => {
    const { activeTab, setActiveTab } = useContext(TabsContext);
    const isActive = activeTab === value;

    const handleClick = () => {
        if (!disabled) {
            setActiveTab(value);
        }
    };

    return (
        <button
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${value}`}
            id={`tab-${value}`}
            disabled={disabled}
            onClick={handleClick}
            className={`
                px-4 py-2 text-sm font-medium border-b-2 transition-colors
                ${isActive
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    );
};

export const TabsContent = ({ children, value, className = '', ...props }) => {
    const { activeTab } = useContext(TabsContext);
    const isActive = activeTab === value;

    if (!isActive) {
        return null;
    }

    return (
        <div
            role="tabpanel"
            id={`tabpanel-${value}`}
            aria-labelledby={`tab-${value}`}
            className={`focus:outline-none ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
