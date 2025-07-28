import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Brain, 
  Palette, 
  FileText, 
  Zap, 
  Menu, 
  X, 
  ChevronRight,
  Search,
  Bell,
  User,
  Settings,
  ArrowLeft,
} from 'lucide-react';
import { HoverScale } from './PageTransition';
import { useTemplate } from '../../contexts/TemplateContextStable';

// Enhanced breadcrumb component
export const EnhancedBreadcrumb = ({ className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    
    const breadcrumbMap = {
      '': 'Home',
      'ai': 'AI Dashboard',
      'builder': 'Resume Builder',
      'professional-templates': 'Professional Templates',
      'admin': 'Admin',
      'template-explorer': 'Template Explorer',
    };

    return [
      { label: 'Home', path: '/', icon: Home },
      ...pathnames.map((name, index) => {
        const path = `/${pathnames.slice(0, index + 1).join('/')}`;
        return {
          label: breadcrumbMap[name] || name.charAt(0).toUpperCase() + name.slice(1),
          path,
          icon: name === 'ai' ? Brain : name === 'builder' ? FileText : null,
        };
      }),
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <motion.nav
      className={`glass-nav-v2 px-4 py-3 ${className}`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto">
        <div className="flex items-center space-x-2">
          {breadcrumbs.length > 1 && (
            <motion.button
              onClick={() => navigate(-1)}
              className="glass-button p-2 rounded-lg mr-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.button>
          )}
          
          <ol className="flex items-center space-x-2">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.path} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                )}
                
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {index === breadcrumbs.length - 1 ? (
                    <span className="flex items-center space-x-1 text-blue-600 font-medium">
                      {crumb.icon && <crumb.icon className="w-4 h-4" />}
                      <span>{crumb.label}</span>
                    </span>
                  ) : (
                    <Link
                      to={crumb.path}
                      className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      {crumb.icon && <crumb.icon className="w-4 h-4" />}
                      <span>{crumb.label}</span>
                    </Link>
                  )}
                </motion.div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </motion.nav>
  );
};

// Enhanced navigation with glass morphism
export const EnhancedNavigation = () => {
  const location = useLocation();
  const { appliedTemplate, isTemplateApplied, getTemplateColors } = useTemplate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  const templateColors = getTemplateColors();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: Home,
      description: 'Main dashboard',
    },
    {
      path: '/ai',
      label: 'AI Dashboard',
      icon: Brain,
      description: 'AI-powered resume tools',
    },
    {
      path: '/professional-templates',
      label: 'Templates',
      icon: Zap,
      description: 'Professional templates',
    },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav
      className={`
        glass-nav-v2 sticky top-0 z-50 transition-all duration-300
        ${isScrolled ? 'scrolled shadow-lg' : ''}
        ${isTemplateApplied ? 'template-aware-nav' : ''}
      `}
      style={isTemplateApplied ? {
        backgroundColor: `${templateColors.background}dd`,
        borderBottomColor: templateColors.primary,
      } : {}}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-3">
            <HoverScale scale={1.1}>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center glass-button"
                style={isTemplateApplied ? {
                  background: `linear-gradient(135deg, ${templateColors.primary} 0%, ${templateColors.primary}cc 100%)`,
                } : {
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                }}
              >
                <FileText className="w-5 h-5 text-white" />
              </div>
            </HoverScale>
            
            <div className="hidden sm:block">
              <motion.h1
                className="text-xl font-bold"
                style={isTemplateApplied ? { color: templateColors.text } : { color: '#1f2937' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Resume Builder AI
              </motion.h1>
              <motion.p
                className="text-xs text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {isTemplateApplied ? `Using ${appliedTemplate.name}` : 'Enhanced UI v2.0'}
              </motion.p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <Link to={item.path}>
                    <motion.div
                      className={`
                        flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                        ${active 
                          ? 'glass-button bg-blue-500 text-white shadow-glow-blue' 
                          : 'glass-button hover:bg-glass-200'
                        }
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={active && isTemplateApplied ? {
                        backgroundColor: templateColors.primary,
                        color: 'white',
                      } : {}}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Search */}
            <HoverScale>
              <motion.button
                className="glass-button p-2 rounded-lg"
                onClick={() => setSearchOpen(!searchOpen)}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-5 h-5" />
              </motion.button>
            </HoverScale>

            {/* Notifications */}
            <HoverScale>
              <motion.button
                className="glass-button p-2 rounded-lg relative"
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </motion.button>
            </HoverScale>

            {/* User Menu */}
            <HoverScale>
              <motion.button
                className="glass-button p-2 rounded-lg"
                whileTap={{ scale: 0.95 }}
              >
                <User className="w-5 h-5" />
              </motion.button>
            </HoverScale>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              className="glass-button p-2 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              className="absolute top-full left-0 right-0 glass-card-v2 m-4 p-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search features, templates, or help..."
                  className="flex-1 bg-transparent border-none outline-none placeholder-gray-400"
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden absolute top-full left-0 right-0 glass-card-v2 m-4 p-4"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-3">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className={`
                          flex items-center space-x-3 p-3 rounded-lg transition-all duration-200
                          ${active 
                            ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                            : 'text-gray-600 hover:bg-gray-50'
                          }
                        `}>
                          <Icon className="w-5 h-5" />
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div className="text-sm text-gray-500">{item.description}</div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Mobile Actions */}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <button className="w-full text-left p-3 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center space-x-3">
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center space-x-3">
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center space-x-3">
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default EnhancedNavigation;