/**
 * Mock Mode Configuration
 * 
 * Set MOCK_MODE_ENABLED to true to use mock data instead of real API calls.
 * This allows you to test the full application without a backend connection.
 * 
 * When enabled, the application will automatically log you in as the Admin user.
 */

// Toggle this to enable/disable mock mode
export const MOCK_MODE_ENABLED = true;

// Simulated API delay in milliseconds (to simulate network latency)
export const MOCK_API_DELAY = 500;

/**
 * Simulate API delay for mock responses
 */
export const mockDelay = (ms: number = MOCK_API_DELAY): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Log mock mode status
 */
export const logMockMode = () => {
  if (MOCK_MODE_ENABLED) {
    console.log('🎭 MOCK MODE ENABLED - Using mock data, no backend calls will be made');
    console.log('👤 Auto-login as Admin enabled');
  }
};