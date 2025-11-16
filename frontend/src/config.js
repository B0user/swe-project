// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout'
  },
  
  // Consumer endpoints
  CONSUMER: {
    DASHBOARD: '/consumer/dashboard',
    SEARCH_ITEMS: '/consumer/items/search',
    SEARCH_SUPPLIERS: '/consumer/suppliers/search',
    LINK_REQUESTS: '/consumer/link-requests',
    CHAT: '/consumer/chat',
    ORDERS: '/consumer/orders',
    CHECKOUT: '/consumer/checkout'
  },
  
  // Supplier endpoints
  SUPPLIER: {
    DASHBOARD: '/supplier/dashboard',
    TEAM: '/supplier/team',
    ITEMS: '/supplier/items',
    LINK_REQUESTS: '/supplier/link-requests'
  }
}

// JWT Configuration
export const JWT_CONFIG = {
  ACCESS_TOKEN_KEY: 'accessToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes before expiry
  REFRESH_THRESHOLD: 15 * 60 * 1000 // 15 minutes before expiry to refresh
}

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'Supply Chain Platform',
  VERSION: '1.0.0',
  DEFAULT_PAGE_SIZE: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'gif', 'webp']
}

// Development/Environment flags
export const ENV = {
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD
}
