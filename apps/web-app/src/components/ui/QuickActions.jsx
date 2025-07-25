import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Plus,
    Brain,
    Palette,
    Home,
    X,
    Zap
} from 'lucide-react';

const QuickActions = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const quickActions = [
        {
            path: '/',
            label: 'Home',
            icon: Home,
            color: 'bg-gray-600 hover:bg-gray-700',
            show: location.pathname !== '/'
        },
        {
            path: '/builder',
            label: 'Resume Builder',
            icon: Zap,
            color: 'bg-green-600 hover:bg-green-700',
            show: !location.pathname.includes('/builder')
        },
        {
            path: '/ai',
            label: 'AI Analysis',
            icon: Brain,
            color: 'bg-blue-600 hover:bg-blue-700',
            show: location.pathname !== '/ai'
        },
        {
            path: '/templates',
            label: 'Templates',
            icon: Palette,
            color: 'bg-purple-600 hover:bg-purple-700',
            show: location.pathname !== '/templates' && location.pathname !== '/professional-templates'
        },
        {
            path: '/professional-templates',
            label: 'Professional',
            icon: Palette,
            color: 'bg-orange-600 hover:bg-orange-700',
            show: location.pathname !== '/professional-templates' && location.pathname !== '/templates'
        }
    ];

    const visibleActions = quickActions.filter(action => action.show);

    if (visibleActions.length === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Action buttons */}
            {isOpen && (
                <div className="mb-4 space-y-3">
                    {visibleActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <Link
                                key={action.path}
                                to={action.path}
                                onClick={() => setIsOpen(false)}
                                className="block"
                                style={{
                                    animation: `fadeInUp 0.3s ease-out ${index * 0.1}s both`
                                }}
                            >
                                <Button
                                    size="lg"
                                    className={`${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 w-full`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{action.label}</span>
                                </Button>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Main toggle button */}
            <Button
                size="lg"
                className={`${isOpen
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full w-14 h-14 p-0`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <Zap className="w-6 h-6" />
                )}
            </Button>

            <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
};

export default QuickActions;
