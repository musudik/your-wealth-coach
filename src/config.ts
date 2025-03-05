/**
 * Application configuration
 */

// API configuration
export const API_CONFIG = {
  // Base URL for the financial advice API
  API_URL: 'https://api.example.com/financial-advice',
  
  // API key for authentication (replace with your actual key in production)
  API_KEY: 'your_api_key_here',
  
  // Whether to use the real API or mock data
  USE_MOCK_API: true,
  
  // Timeout for API requests in milliseconds
  TIMEOUT: 10000,
};

// Feature flags
export const FEATURES = {
  // Enable/disable the chatbot feature
  CHATBOT_ENABLED: true,
  
  // Enable/disable saving chat history
  SAVE_CHAT_HISTORY: false,
};

// Theme configuration
export const THEME = {
  // Primary colors
  PRIMARY: '#003366',
  SECONDARY: '#00d084',
  
  // Text colors
  TEXT_DARK: '#1a1a1a',
  TEXT_LIGHT: '#ffffff',
  TEXT_MUTED: '#6b7280',
  
  // Background colors
  BG_LIGHT: '#f9fafb',
  BG_DARK: '#003366',
  
  // Font settings
  FONT_FAMILY: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
};

// Export default configuration object
export default {
  API: API_CONFIG,
  FEATURES,
  THEME,
  
  // Application metadata
  APP_NAME: 'Your Wealth Coach',
  APP_VERSION: '1.0.0',
  CONTACT_EMAIL: 'support@yourwealthcoach.com',
}; 