// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/register',
    LOGIN: '/token',
    LOGOUT: '/logout'
  },
  
  // User endpoints
  USERS: {
    LIST: '/users',
    GET: (id) => `/users/${id}`,
    ME: '/users/me',
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`
  },
  
  // Product endpoints
  PRODUCTS: {
    LIST: '/products',
    GET: (id) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`
  },
  
  // Order endpoints
  ORDERS: {
    LIST: '/orders',
    GET: (id) => `/orders/${id}`,
    CREATE: '/orders',
    UPDATE_STATUS: (id) => `/orders/${id}/status`,
    CANCEL: (id) => `/orders/${id}/cancel`
  },
  
  // Supplier endpoints
  SUPPLIERS: {
    LIST: '/suppliers',
    GET: (id) => `/suppliers/${id}`,
    LINK_REQUEST: '/suppliers/link-request',
    USER_REQUESTS: (id) => `/suppliers/link-requests/user/${id}`,
    SUPPLIER_REQUESTS: (id) => `/suppliers/link-requests/supplier/${id}`,
    UPDATE_REQUEST: (id) => `/suppliers/link-requests/${id}`
  },
  
  // Message endpoints
  MESSAGES: {
    CONVERSATIONS: '/messages/conversations',
    GET_CONVERSATION: (id) => `/messages/conversations/${id}`,
    GET_MESSAGES: (id) => `/messages/conversations/${id}/messages`,
    SEND: '/messages',
    GET: (id) => `/messages/${id}`,
    DELETE: (id) => `/messages/${id}`
  },
  
  // Team endpoints
  TEAM: {
    LIST: '/team/members',
    GET: (id) => `/team/members/${id}`,
    ADD: '/team/members',
    UPDATE: (id) => `/team/members/${id}`,
    REMOVE: (id) => `/team/members/${id}`
  },
  
  // Dashboard endpoints
  DASHBOARD: {
    CONSUMER: (id) => `/dashboard/consumer/${id}`,
    SUPPLIER: (id) => `/dashboard/supplier/${id}`
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
