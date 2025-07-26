import React from 'react';

class EnhancedErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorType: 'unknown',
            retryCount: 0
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        const errorType = this.categorizeError(error);

        this.setState({
            error: error,
            errorInfo: errorInfo,
            errorType: errorType
        });

        // Log error to console for debugging
        console.error('Error caught by enhanced boundary:', error, errorInfo);

        // Send error to monitoring service in production
        this.reportError(error, errorInfo, errorType);
    }

    categorizeError(error) {
        const message = error.message.toLowerCase();

        if (message.includes('chunk load failed') || message.includes('loading chunk')) {
            return 'chunk_load';
        } else if (message.includes('network error') || message.includes('fetch')) {
            return 'network';
        } else if (message.includes('has already been declared') || message.includes('duplicate')) {
            return 'duplicate_declaration';
        } else if (message.includes('cannot resolve module') || message.includes('module not found')) {
            return 'missing_module';
        } else if (message.includes('undefined') || message.includes('null')) {
            return 'null_reference';
        } else if (message.includes('hydration') || message.includes('hydrate')) {
            return 'hydration';
        }

        return 'unknown';
    }

    reportError(error, errorInfo, errorType) {
        // In production, this would send to a monitoring service
        const errorReport = {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            type: errorType,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            props: this.props
        };

        if (process.env.NODE_ENV === 'production') {
            // Send to monitoring service (e.g., Sentry, LogRocket, etc.)
            console.error('Production error reported:', errorReport);
        } else {
            console.warn('Development error detected:', errorReport);
        }
    }

    getErrorMessage(errorType) {
        switch (errorType) {
            case 'chunk_load':
                return {
                    title: 'Loading Issue',
                    message: 'There was a problem loading the application. This usually happens after an update.',
                    action: 'Please refresh the page to load the latest version.',
                    canRetry: true
                };
            case 'network':
                return {
                    title: 'Network Error',
                    message: 'Unable to connect to the server.',
                    action: 'Please check your internet connection and try again.',
                    canRetry: true
                };
            case 'duplicate_declaration':
                return {
                    title: 'Code Error',
                    message: 'There\'s a duplicate function declaration in the code.',
                    action: 'This is a development issue. Please contact support.',
                    canRetry: false
                };
            case 'missing_module':
                return {
                    title: 'Missing Component',
                    message: 'A required component could not be found.',
                    action: 'This is a development issue. Please contact support.',
                    canRetry: false
                };
            case 'null_reference':
                return {
                    title: 'Data Error',
                    message: 'Expected data is missing or invalid.',
                    action: 'Please refresh the page or try again later.',
                    canRetry: true
                };
            case 'hydration':
                return {
                    title: 'Rendering Error',
                    message: 'There was a mismatch in the application rendering.',
                    action: 'Please refresh the page.',
                    canRetry: true
                };
            default:
                return {
                    title: 'Unexpected Error',
                    message: 'Something unexpected happened.',
                    action: 'Please refresh the page or try again later.',
                    canRetry: true
                };
        }
    }

    handleRetry = () => {
        this.setState(prevState => ({
            hasError: false,
            error: null,
            errorInfo: null,
            errorType: 'unknown',
            retryCount: prevState.retryCount + 1
        }));
    }

    handleClearCache = () => {
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => caches.delete(name));
                window.location.reload(true);
            });
        } else {
            window.location.reload(true);
        }
    }

    render() {
        if (this.state.hasError) {
            const errorDetails = this.getErrorMessage(this.state.errorType);

            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6">
                        <div className="text-center">
                            <div className="text-red-500 text-6xl mb-4">⚠️</div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {errorDetails.title}
                            </h1>
                            <p className="text-gray-600 mb-2">
                                {errorDetails.message}
                            </p>
                            <p className="text-sm text-gray-500 mb-6">
                                {errorDetails.action}
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Refresh Page
                                </button>

                                {errorDetails.canRetry && this.state.retryCount < 3 && (
                                    <button
                                        onClick={this.handleRetry}
                                        className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                                    >
                                        Try Again ({3 - this.state.retryCount} attempts left)
                                    </button>
                                )}

                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    Go to Home
                                </button>

                                {this.state.errorType === 'chunk_load' && (
                                    <button
                                        onClick={this.handleClearCache}
                                        className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                                    >
                                        Clear Cache & Reload
                                    </button>
                                )}
                            </div>

                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <details className="mt-6 text-left">
                                    <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                                        Error Details (Development Only)
                                    </summary>
                                    <div className="mt-3 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-48">
                                        <div className="mb-2">
                                            <strong>Error Type:</strong> {this.state.errorType}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Message:</strong> {this.state.error.toString()}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Stack:</strong>
                                            <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                                        </div>
                                        <div>
                                            <strong>Component Stack:</strong>
                                            <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                                        </div>
                                    </div>
                                </details>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default EnhancedErrorBoundary;
