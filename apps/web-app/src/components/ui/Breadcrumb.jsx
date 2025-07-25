import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = () => {
    const location = useLocation();

    const pathSegments = location.pathname.split('/').filter(Boolean);

    const breadcrumbItems = [
        { path: '/', label: 'Home', icon: Home }
    ];

    // Add current page based on path
    if (pathSegments.length > 0) {
        const currentPath = pathSegments[0];
        switch (currentPath) {
            case 'builder':
                breadcrumbItems.push({ path: '/builder', label: 'Resume Builder' });
                break;
            case 'resume-builder':
                breadcrumbItems.push({ path: '/resume-builder', label: 'Resume Builder' });
                break;
            case 'ai':
                breadcrumbItems.push({ path: '/ai', label: 'AI Analysis' });
                break;
            case 'templates':
                breadcrumbItems.push({ path: '/templates', label: 'Template Explorer' });
                break;
            case 'professional-templates':
                breadcrumbItems.push({ path: '/professional-templates', label: 'Professional Templates' });
                break;
            default:
                breadcrumbItems.push({ path: `/${currentPath}`, label: currentPath });
        }
    }

    // Don't show breadcrumbs on home page
    if (location.pathname === '/') {
        return null;
    }

    return (
        <nav className="bg-gray-50 border-b px-6 py-3">
            <div className="container mx-auto">
                <ol className="flex items-center space-x-2 text-sm">
                    {breadcrumbItems.map((item, index) => {
                        const isLast = index === breadcrumbItems.length - 1;
                        const Icon = item.icon;

                        return (
                            <li key={item.path} className="flex items-center">
                                {index > 0 && (
                                    <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                                )}
                                {isLast ? (
                                    <span className="flex items-center text-gray-900 font-medium">
                                        {Icon && <Icon className="w-4 h-4 mr-1" />}
                                        {item.label}
                                    </span>
                                ) : (
                                    <Link
                                        to={item.path}
                                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        {Icon && <Icon className="w-4 h-4 mr-1" />}
                                        {item.label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>
        </nav>
    );
};

export default Breadcrumb;
