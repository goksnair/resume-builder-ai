import React from 'react';

const Badge = ({ children, variant = 'default', className = '', ...props }) => {
    const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';

    const variants = {
        default: 'bg-gray-100 text-gray-800',
        secondary: 'bg-gray-100 text-gray-600',
        success: 'bg-green-100 text-green-800',
        destructive: 'bg-red-100 text-red-800',
        outline: 'border border-gray-200 text-gray-800'
    };

    const variantStyles = variants[variant] || variants.default;

    return (
        <span
            className={`${baseStyles} ${variantStyles} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
};

export { Badge };
