import React, { useState, useRef, useEffect } from 'react';
import {
    Send,
    Bot,
    User,
    Brain,
    Lightbulb,
    Clock,
    ChevronDown,
    Copy,
    ThumbsUp,
    ThumbsDown
} from 'lucide-react';

/**
 * Enhanced Conversation Interface for ROCKET Framework
 * 
 * Provides intelligent conversation experience with AI coaching,
 * personality insights, and progress tracking integration
 */
const ConversationInterface = ({
    messages = [],
    onSendMessage,
    isLoading = false,
    suggestions = [],
    processingMode = 'rocket',
    onModeChange,
    personalityAnalysis
}) => {
    const [inputValue, setInputValue] = useState('');
    const [isMultiline, setIsMultiline] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputValue.trim() || isLoading) return;

        onSendMessage(inputValue.trim(), processingMode);
        setInputValue('');
        setIsMultiline(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !isMultiline) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion);
        inputRef.current?.focus();
    };

    return (
        <div className="flex flex-col h-full max-h-[600px] bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Conversation Header */}
            <ConversationHeader
                processingMode={processingMode}
                onModeChange={onModeChange}
                personalityAnalysis={personalityAnalysis}
            />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <ConversationMessage
                        key={message.id}
                        message={message}
                        personalityAnalysis={personalityAnalysis}
                    />
                ))}

                {/* Loading indicator */}
                {isLoading && (
                    <div className="flex items-center gap-2 text-gray-500">
                        <Bot className="w-5 h-5" />
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                        <span className="text-sm">Analyzing your response...</span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Suggestions Area */}
            {suggestions.length > 0 && !isLoading && (
                <SuggestionsPanel
                    suggestions={suggestions}
                    onSuggestionClick={handleSuggestionClick}
                />
            )}

            {/* Input Area */}
            <ConversationInput
                value={inputValue}
                onChange={setInputValue}
                onSend={handleSendMessage}
                onKeyPress={handleKeyPress}
                isLoading={isLoading}
                isMultiline={isMultiline}
                onToggleMultiline={() => setIsMultiline(!isMultiline)}
                inputRef={inputRef}
                processingMode={processingMode}
            />
        </div>
    );
};

/**
 * Conversation Header with mode selection
 */
const ConversationHeader = ({ processingMode, onModeChange, personalityAnalysis }) => {
    const modes = [
        {
            id: 'rocket',
            label: 'ROCKET Builder',
            icon: Bot,
            color: 'text-blue-600',
            description: 'Career framework coaching'
        },
        {
            id: 'psychologist',
            label: 'Dr. Maya Insight',
            icon: Brain,
            color: 'text-purple-600',
            description: 'Personality analysis'
        },
        {
            id: 'general',
            label: 'General Chat',
            icon: User,
            color: 'text-gray-600',
            description: 'Open conversation'
        }
    ];

    const currentMode = modes.find(mode => mode.id === processingMode);

    return (
        <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <currentMode.icon className={`w-6 h-6 ${currentMode.color}`} />
                    <div>
                        <h3 className="font-semibold text-gray-900">{currentMode.label}</h3>
                        <p className="text-sm text-gray-600">{currentMode.description}</p>
                    </div>
                </div>

                {personalityAnalysis && (
                    <div className="flex items-center gap-2 text-sm text-purple-600">
                        <Brain className="w-4 h-4" />
                        <span>Analysis Ready</span>
                    </div>
                )}
            </div>

            {/* Mode Selection */}
            <div className="flex gap-2 mt-3">
                {modes.map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => onModeChange?.(mode.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${processingMode === mode.id
                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <mode.icon className="w-4 h-4" />
                        {mode.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

/**
 * Individual Message Component
 */
const ConversationMessage = ({ message, personalityAnalysis }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isUser = message.sender === 'user';
    const isAI = message.sender === 'ai';
    const isPsychologist = message.sender === 'psychologist';

    const getMessageIcon = () => {
        if (isUser) return User;
        if (isPsychologist) return Brain;
        return Bot;
    };

    const getMessageColor = () => {
        if (isUser) return 'text-blue-600';
        if (isPsychologist) return 'text-purple-600';
        return 'text-green-600';
    };

    const getMessageBg = () => {
        if (isUser) return 'bg-blue-50 border-blue-200';
        if (isPsychologist) return 'bg-purple-50 border-purple-200';
        return 'bg-green-50 border-green-200';
    };

    const Icon = getMessageIcon();

    return (
        <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getMessageBg()}`}>
                <Icon className={`w-4 h-4 ${getMessageColor()}`} />
            </div>

            {/* Message Content */}
            <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
                {/* Message Header */}
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                        {isUser ? 'You' : isPsychologist ? 'Dr. Maya Insight' : 'ROCKET AI'}
                    </span>
                    <span className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                </div>

                {/* Message Bubble */}
                <div className={`p-3 rounded-lg ${getMessageBg()}`}>
                    <p className="text-gray-900 whitespace-pre-wrap">{message.content}</p>
                </div>

                {/* Message Insights */}
                {message.insights && (
                    <MessageInsights
                        insights={message.insights}
                        isExpanded={isExpanded}
                        onToggle={() => setIsExpanded(!isExpanded)}
                    />
                )}

                {/* Personality Analysis Display */}
                {message.analysis && (
                    <PersonalityAnalysisDisplay analysis={message.analysis} />
                )}

                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-600">Suggested follow-ups:</p>
                        {message.suggestions.slice(0, 2).map((suggestion, index) => (
                            <div
                                key={index}
                                className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                            >
                                • {suggestion}
                            </div>
                        ))}
                    </div>
                )}

                {/* Message Actions */}
                {!isUser && (
                    <MessageActions message={message} />
                )}
            </div>
        </div>
    );
};

/**
 * Message Insights Display
 */
const MessageInsights = ({ insights, isExpanded, onToggle }) => {
    if (!insights) return null;

    return (
        <div className="mt-2">
            <button
                onClick={onToggle}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
            >
                <Lightbulb className="w-3 h-3" />
                <span>AI Insights</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            {isExpanded && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                    {insights.identified_skills && (
                        <div className="mb-2">
                            <span className="font-medium">Skills identified:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {insights.identified_skills.map((skill, index) => (
                                    <span key={index} className="px-2 py-1 bg-yellow-100 rounded">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {insights.story_coherence_score && (
                        <div>
                            <span className="font-medium">Story coherence:</span>
                            <span className="ml-1">{Math.round(insights.story_coherence_score)}%</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/**
 * Personality Analysis Display
 */
const PersonalityAnalysisDisplay = ({ analysis }) => {
    return (
        <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Personality Profile
            </h4>

            {analysis.dominant_traits && (
                <div className="space-y-2">
                    {analysis.dominant_traits.slice(0, 3).map((trait, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{trait.trait}</span>
                            <div className="flex items-center gap-2">
                                <div className="w-16 bg-purple-200 rounded-full h-2">
                                    <div
                                        className="bg-purple-600 h-2 rounded-full"
                                        style={{ width: `${trait.strength}%` }}
                                    />
                                </div>
                                <span className="text-xs text-purple-600">{trait.strength}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/**
 * Message Actions (copy, rate, etc.)
 */
const MessageActions = ({ message }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-2 mt-2">
            <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
            >
                <Copy className="w-3 h-3" />
                {copied ? 'Copied!' : 'Copy'}
            </button>

            <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                <ThumbsUp className="w-3 h-3" />
                Helpful
            </button>

            <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                <ThumbsDown className="w-3 h-3" />
                Not helpful
            </button>
        </div>
    );
};

/**
 * Suggestions Panel
 */
const SuggestionsPanel = ({ suggestions, onSuggestionClick }) => {
    return (
        <div className="border-t border-gray-200 p-3 bg-gray-50">
            <p className="text-sm font-medium text-gray-700 mb-2">Suggested responses:</p>
            <div className="space-y-2">
                {suggestions.slice(0, 3).map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => onSuggestionClick(suggestion)}
                        className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
};

/**
 * Conversation Input Component
 */
const ConversationInput = ({
    value,
    onChange,
    onSend,
    onKeyPress,
    isLoading,
    isMultiline,
    onToggleMultiline,
    inputRef,
    processingMode
}) => {
    const placeholder = {
        rocket: "Describe your experience, achievements, or career goals...",
        psychologist: "Share your thoughts, preferences, or work style...",
        general: "Ask anything about your career or resume..."
    }[processingMode] || "Type your message...";

    return (
        <div className="border-t border-gray-200 p-4">
            <div className="flex gap-3">
                <div className="flex-1">
                    {isMultiline ? (
                        <textarea
                            ref={inputRef}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onKeyPress={onKeyPress}
                            placeholder={placeholder}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={3}
                            disabled={isLoading}
                        />
                    ) : (
                        <input
                            ref={inputRef}
                            type="text"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onKeyPress={onKeyPress}
                            placeholder={placeholder}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isLoading}
                        />
                    )}
                </div>

                <button
                    onClick={onToggleMultiline}
                    className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title={isMultiline ? "Single line" : "Multi-line"}
                >
                    {isMultiline ? '−' : '+'}
                </button>

                <button
                    onClick={onSend}
                    disabled={isLoading || !value.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                    <Send className="w-4 h-4" />
                    Send
                </button>
            </div>

            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <span>{value.length} characters</span>
            </div>
        </div>
    );
};

export default ConversationInterface;
