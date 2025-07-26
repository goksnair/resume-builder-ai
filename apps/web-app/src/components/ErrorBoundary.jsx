import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error Boundary caught an error:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
                        <p className="text-gray-600 mb-4">
                            The application encountered an error. Please refresh the page or contact support.
                        </p>
                        <details className="mb-4">
                            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                Technical Details
                            </summary>
                            <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono">
                                <div className="mb-2">
                                    <strong>Error:</strong> {this.state.error && this.state.error.toString()}
                                </div>
                                <div>
                                    <strong>Stack:</strong> {this.state.errorInfo.componentStack}
                                </div>
                            </div>
                        </details>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
