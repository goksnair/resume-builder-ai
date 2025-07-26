import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTemplate } from '../../contexts/TemplateContext';
import { Button } from './button';
import {
    Home,
    Brain,
    Palette,
    FileText,
    Zap,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';

const Navigation = () => {
    const location = useLocation();
    const { appliedTemplate, isTemplateApplied, getTemplateColors } = useTemplate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const templateColors = getTemplateColors();

    const navItems = [
        {
            path: '/',
            label: 'Home',
            icon: Home,
            description: 'Main dashboard'
        },
        {
            path: '/builder',
            label: 'Resume Builder',
            icon: FileText,
            description: 'AI-powered resume creation'
        },
        {
            path: '/ai',
            label: 'AI Analysis',
            icon: Brain,
            description: 'Resume optimization'
        },
        {
            path: '/professional-templates',
            label: 'Professional Templates',
            icon: Zap,
            description: 'Job-specific templates'
        }
    ];

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav
            className={`border-b sticky top-0 z-40 backdrop-blur-sm ${isTemplateApplied ? 'template-aware-nav' : 'bg-white/95 border-gray-200'}`}
            style={isTemplateApplied ? {
                backgroundColor: templateColors.background,
                borderBottomColor: templateColors.primary
            } : {}}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <Link to="/" className="flex items-center space-x-3">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={isTemplateApplied ? {
                                background: `linear-gradient(135deg, ${templateColors.primary} 0%, ${templateColors.primary}CC 100%)`
                            } : {
                                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
                            }}
                        >
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <h1
                                className="text-xl font-bold"
                                style={isTemplateApplied ? { color: templateColors.text } : { color: '#1f2937' }}
                            >
                                Resume Builder AI
                            </h1>
                            <p className="text-xs text-gray-500">
                                {isTemplateApplied ? `Using ${appliedTemplate.name}` : 'Powered by Intelligence'}
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);

                            return (
                                <Link key={item.path} to={item.path}>
                                    <Button
                                        variant={active ? "default" : "ghost"}
                                        className={`flex items-center space-x-2`}
                                        style={active && isTemplateApplied ? {
                                            backgroundColor: templateColors.primary,
                                            color: 'white'
                                        } : active ? {
                                            backgroundColor: '#2563eb',
                                            color: 'white'
                                        } : isTemplateApplied ? {
                                            color: templateColors.text
                                        } : {}}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Quick Actions */}
                    <div className="hidden md:flex items-center space-x-3">
                        {!isActive('/templates') && (
                            <Link to="/templates">
                                <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                                    <Palette className="w-4 h-4 mr-2" />
                                    Browse Templates
                                </Button>
                            </Link>
                        )}
                        {!isActive('/ai') && (
                            <Link to="/ai">
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                    <Brain className="w-4 h-4 mr-2" />
                                    AI Analysis
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <div className="space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.path);

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${active
                                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}>
                                            <Icon className="w-5 h-5" />
                                            <div>
                                                <div className="font-medium">{item.label}</div>
                                                <div className="text-sm text-gray-500">{item.description}</div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Mobile Quick Actions */}
                        <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
                            <Link to="/templates" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button variant="outline" className="w-full justify-start">
                                    <Palette className="w-4 h-4 mr-2" />
                                    Browse Templates
                                </Button>
                            </Link>
                            <Link to="/ai" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                                    <Brain className="w-4 h-4 mr-2" />
                                    AI Analysis
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;
