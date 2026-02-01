import React, { Component } from 'react';
import PropTypes from 'prop-types';
/**
 * Error Boundary component to catch and handle JavaScript errors anywhere in the child component tree.
 * Prevents the entire app from crashing when an error occurs in a component.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  /**
   * Update state when an error is caught
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Log error details when component catches an error
   */
  componentDidCatch(error, errorInfo) {
    this.setState({
      errorInfo
    });
    
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Error info:', errorInfo);
    
    // You could send the error to your analytics or error tracking service here
    // Example: logErrorToService(error, errorInfo);
    
    // Call the onError prop if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Reset the error state to allow the component to try rendering again
   */
  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    // Call the onReset prop if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      // Render custom fallback UI if provided
      if (fallback) {
        return typeof fallback === 'function'
          ? fallback({ error, resetErrorBoundary: this.resetErrorBoundary })
          : fallback;
      }

      // Default error UI
      return (
        <div className="shield-error-boundary" role="alert">
          <h2>Something went wrong</h2>
          <p>
            An unexpected error occurred. Our team has been notified and we're working on fixing the issue.
          </p>
          {error && process.env.NODE_ENV === 'development' && (
            <details className="error-details">
              <summary>Error Details</summary>
              <p>{error.toString()}</p>
            </details>
          )}
          <button
            className="bw-btn mt-4"
            onClick={this.resetErrorBoundary}
          >
            Try Again
          </button>
        </div>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  onError: PropTypes.func,
  onReset: PropTypes.func
};

export default ErrorBoundary;