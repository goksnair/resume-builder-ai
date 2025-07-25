import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Brain, Palette, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white mt-16">
            <div className="container mx-auto px-6 py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Resume Builder AI</h3>
                                <p className="text-xs text-gray-400">Powered by Intelligence</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Create professional resumes with AI-powered optimization and modern design templates.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="font-semibold mb-4">Navigation</h4>
                        <div className="space-y-2">
                            <Link to="/" className="flex items-center text-gray-400 hover:text-white transition-colors">
                                <FileText className="w-4 h-4 mr-2" />
                                Home
                            </Link>
                            <Link to="/ai" className="flex items-center text-gray-400 hover:text-white transition-colors">
                                <Brain className="w-4 h-4 mr-2" />
                                AI Analysis
                            </Link>
                            <Link to="/templates" className="flex items-center text-gray-400 hover:text-white transition-colors">
                                <Palette className="w-4 h-4 mr-2" />
                                Templates
                            </Link>
                        </div>
                    </div>

                    {/* Features */}
                    <div>
                        <h4 className="font-semibold mb-4">Features</h4>
                        <div className="space-y-2 text-gray-400 text-sm">
                            <div>🤖 AI-Powered Analysis</div>
                            <div>🎨 18+ Modern Templates</div>
                            <div>📊 ATS Optimization</div>
                            <div>📱 Responsive Design</div>
                            <div>⚡ Real-time Preview</div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold mb-4">Connect</h4>
                        <div className="space-y-2">
                            <a href="#" className="flex items-center text-gray-400 hover:text-white transition-colors">
                                <Github className="w-4 h-4 mr-2" />
                                GitHub
                            </a>
                            <a href="#" className="flex items-center text-gray-400 hover:text-white transition-colors">
                                <Twitter className="w-4 h-4 mr-2" />
                                Twitter
                            </a>
                            <a href="#" className="flex items-center text-gray-400 hover:text-white transition-colors">
                                <Mail className="w-4 h-4 mr-2" />
                                Contact
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                        © 2025 Resume Builder AI. Built with AI and modern design principles.
                    </p>
                    <div className="flex space-x-6 mt-4 sm:mt-0">
                        <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                            Privacy
                        </Link>
                        <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                            Terms
                        </Link>
                        <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                            Support
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
