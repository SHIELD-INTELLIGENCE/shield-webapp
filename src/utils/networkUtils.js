/**
 * Network utility functions for error handling and retry mechanisms
 */

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {Object} options - Configuration options
 * @param {number} options.maxRetries - Maximum number of retries
 * @param {number} options.initialDelay - Initial delay in milliseconds
 * @param {number} options.maxDelay - Maximum delay in milliseconds
 * @param {Function} options.onRetry - Callback function on retry
 * @returns {Promise<any>} - Result of the function
 */
export const retryWithBackoff = async (fn, options = {}) => {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    onRetry = () => {}
  } = options;

  let attempts = 0;

  const execute = async () => {
    try {
      return await fn();
    } catch (error) {
      attempts++;

      if (attempts >= maxRetries) {
        throw error;
      }

      const delay = Math.min(initialDelay * Math.pow(2, attempts - 1), maxDelay);
      
      // Add some randomness to prevent all clients retrying at the same time
      const jitter = delay * 0.2 * Math.random();
      const backoffDelay = delay + jitter;

      // Call the onRetry callback with the error and retry information
      onRetry({
        error,
        attempts,
        maxRetries,
        delay: backoffDelay,
        willRetry: true
      });

      await new Promise(resolve => setTimeout(resolve, backoffDelay));
      return execute();
    }
  };

  return execute();
};

/**
 * Check if the error is likely due to network connectivity issues
 * @param {Error} error - The error to check
 * @returns {boolean} - True if it's a network error, false otherwise
 */
export const isNetworkError = (error) => {
  // FirebaseError network-related error codes
  if (error.code) {
    return [
      'auth/network-request-failed',
      'auth/timeout',
      'storage/retry-limit-exceeded',
      'functions/deadline-exceeded',
      'functions/failed-precondition'
    ].includes(error.code);
  }

  // Check for typical network error messages
  const networkErrorMessages = [
    'Network Error',
    'Failed to fetch',
    'NetworkError',
    'network timeout',
    'net::ERR',
    'The network connection was lost'
  ];

  const errorMessage = error.message ? error.message.toLowerCase() : '';
  return networkErrorMessages.some(msg => 
    errorMessage.toLowerCase().includes(msg.toLowerCase())
  );
};

/**
 * Detect network connectivity changes
 * @param {Function} onOnline - Callback when browser goes online
 * @param {Function} onOffline - Callback when browser goes offline
 * @returns {Function} - Function to remove event listeners
 */
export const detectNetworkChanges = (onOnline, onOffline) => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

/**
 * Wrapper for fetch with timeout and retry
 * @param {string|Request} resource - Resource to fetch
 * @param {Object} options - Fetch options
 * @param {number} options.timeout - Timeout in milliseconds
 * @param {Object} options.retry - Retry options
 * @returns {Promise<Response>} - Fetch response
 */
export const fetchWithErrorHandling = async (resource, options = {}) => {
  const { timeout = 10000, retry = {}, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  const fetchFn = async () => {
    try {
      const response = await fetch(resource, {
        ...fetchOptions,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const error = new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        error.status = response.status;
        error.response = response;
        throw error;
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error(`Request timed out after ${timeout}ms`);
      }
      
      throw error;
    }
  };
  
  return retryWithBackoff(fetchFn, retry);
};