// ErrorBoundary.jsx — catches errors, shows gentle message
import { Component } from 'react';
import { RefreshCw, Heart } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Could send to error reporting service
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-calm-light flex items-center justify-center mb-5">
            <Heart className="text-calm" size={28} strokeWidth={1.5} />
          </div>

          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Something glitched.
          </h2>
          <p className="text-text-secondary text-base max-w-sm mb-6 leading-relaxed">
            Take a breath — it's not you. Something unexpected happened on our end.
            Try refreshing and we'll pick up right where you left off.
          </p>

          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl
              font-medium hover:bg-primary-dark transition-colors shadow-soft"
          >
            <RefreshCw size={16} />
            Refresh and try again
          </button>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="mt-6 text-left text-xs text-red-600 bg-red-50 rounded-lg p-4
              max-w-xl overflow-auto border border-red-100">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
