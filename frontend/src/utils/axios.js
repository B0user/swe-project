import axios from 'axios'
import { API_BASE_URL, JWT_CONFIG } from '../config'

// Create axios instance for public requests (no auth required)
export const axiosPublic = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
})

// Create axios instance for private requests (requires JWT auth)
export const axiosPrivate = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
})

// Request interceptor for private requests - add auth token
axiosPrivate.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(JWT_CONFIG.ACCESS_TOKEN_KEY)
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for private requests - handle token refresh
axiosPrivate.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem(JWT_CONFIG.REFRESH_TOKEN_KEY)
        if (refreshToken) {
          const response = await axiosPublic.post('/auth/refresh', {
            refreshToken
          })

          const { accessToken, refreshToken: newRefreshToken } = response.data

          // Update tokens in localStorage
          localStorage.setItem(JWT_CONFIG.ACCESS_TOKEN_KEY, accessToken)
          if (newRefreshToken) {
            localStorage.setItem(JWT_CONFIG.REFRESH_TOKEN_KEY, newRefreshToken)
          }

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return axiosPrivate(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem(JWT_CONFIG.ACCESS_TOKEN_KEY)
        localStorage.removeItem(JWT_CONFIG.REFRESH_TOKEN_KEY)
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Helper function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response
    return {
      message: data.message || 'Server error occurred',
      status,
      data
    }
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'Network error. Please check your connection.',
      status: 0,
      data: null
    }
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1,
      data: null
    }
  }
}

// Helper function to create API service
export const createApiService = (endpoint) => {
  return {
    get: (params) => axiosPrivate.get(endpoint, { params }),
    getById: (id) => axiosPrivate.get(`${endpoint}/${id}`),
    post: (data) => axiosPrivate.post(endpoint, data),
    put: (id, data) => axiosPrivate.put(`${endpoint}/${id}`, data),
    patch: (id, data) => axiosPrivate.patch(`${endpoint}/${id}`, data),
    delete: (id) => axiosPrivate.delete(`${endpoint}/${id}`),
  }
}

export default axiosPrivate
