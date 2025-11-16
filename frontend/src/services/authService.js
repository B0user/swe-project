import { axiosPublic, axiosPrivate } from '../utils/axios'
import { API_ENDPOINTS, JWT_CONFIG } from '../config'

export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await axiosPublic.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
      const { user, accessToken, refreshToken } = response.data
      
      // Store tokens
      localStorage.setItem(JWT_CONFIG.ACCESS_TOKEN_KEY, accessToken)
      localStorage.setItem(JWT_CONFIG.REFRESH_TOKEN_KEY, refreshToken)
      
      return { success: true, user }
    } catch (error) {
      throw error
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await axiosPublic.post(API_ENDPOINTS.AUTH.REGISTER, userData)
      const { user, accessToken, refreshToken } = response.data
      
      // Store tokens
      localStorage.setItem(JWT_CONFIG.ACCESS_TOKEN_KEY, accessToken)
      localStorage.setItem(JWT_CONFIG.REFRESH_TOKEN_KEY, refreshToken)
      
      return { success: true, user }
    } catch (error) {
      throw error
    }
  },

  // Logout user
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem(JWT_CONFIG.REFRESH_TOKEN_KEY)
      if (refreshToken) {
        await axiosPrivate.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken })
      }
    } catch (error) {
      // Even if logout fails on server, clear local tokens
      console.error('Logout error:', error)
    } finally {
      // Clear tokens from localStorage
      localStorage.removeItem(JWT_CONFIG.ACCESS_TOKEN_KEY)
      localStorage.removeItem(JWT_CONFIG.REFRESH_TOKEN_KEY)
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await axiosPrivate.get('/auth/me')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Refresh access token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem(JWT_CONFIG.REFRESH_TOKEN_KEY)
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await axiosPublic.post(API_ENDPOINTS.AUTH.REFRESH, {
        refreshToken
      })

      const { accessToken, refreshToken: newRefreshToken } = response.data
      
      // Update tokens
      localStorage.setItem(JWT_CONFIG.ACCESS_TOKEN_KEY, accessToken)
      if (newRefreshToken) {
        localStorage.setItem(JWT_CONFIG.REFRESH_TOKEN_KEY, newRefreshToken)
      }

      return accessToken
    } catch (error) {
      // Refresh failed, clear tokens
      localStorage.removeItem(JWT_CONFIG.ACCESS_TOKEN_KEY)
      localStorage.removeItem(JWT_CONFIG.REFRESH_TOKEN_KEY)
      throw error
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const accessToken = localStorage.getItem(JWT_CONFIG.ACCESS_TOKEN_KEY)
    if (!accessToken) return false

    try {
      // Decode JWT to check expiry (basic check)
      const payload = JSON.parse(atob(accessToken.split('.')[1]))
      const now = Date.now() / 1000
      return payload.exp > now
    } catch (error) {
      return false
    }
  },

  // Get stored user data
  getStoredUser: () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  // Store user data
  storeUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user))
  },

  // Clear user data
  clearUserData: () => {
    localStorage.removeItem('user')
    localStorage.removeItem(JWT_CONFIG.ACCESS_TOKEN_KEY)
    localStorage.removeItem(JWT_CONFIG.REFRESH_TOKEN_KEY)
  }
}

export default authService
