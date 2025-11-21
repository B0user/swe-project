import { axiosPublic, axiosPrivate, handleApiError } from '../utils/axios'
import { API_ENDPOINTS, JWT_CONFIG } from '../config'

export const authService = {
  /**
   * Register new user
   */
  register: async (email, password, full_name, role = 'consumer') => {
    try {
      const response = await axiosPublic.post(API_ENDPOINTS.AUTH.REGISTER, {
        email,
        password,
        full_name,
        role
      })

      const { access_token, user } = response.data

      // Store user data and token
      localStorage.setItem(JWT_CONFIG.ACCESS_TOKEN_KEY, access_token || '')
      localStorage.setItem('user', JSON.stringify(user || response.data))

      return { success: true, user: user || response.data }
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Registration error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Login user
   */
  login: async (email, password) => {
    try {
      // Backend uses form-encoded data for /token endpoint
      const formData = new URLSearchParams()
      formData.append('username', email)
      formData.append('password', password)

      const response = await axiosPublic.post(API_ENDPOINTS.AUTH.LOGIN, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      const { access_token, user } = response.data

      // Store token and user data
      localStorage.setItem(JWT_CONFIG.ACCESS_TOKEN_KEY, access_token)
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      }

      return { success: true, user, token: access_token }
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Login error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      localStorage.removeItem(JWT_CONFIG.ACCESS_TOKEN_KEY)
      localStorage.removeItem('user')
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async () => {
    try {
      const response = await axiosPrivate.get(API_ENDPOINTS.USERS.ME)
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Get user error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    const token = localStorage.getItem(JWT_CONFIG.ACCESS_TOKEN_KEY)
    if (!token) return false

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Date.now() / 1000
      return payload.exp > now
    } catch (error) {
      return false
    }
  },

  /**
   * Get stored user data
   */
  getStoredUser: () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  /**
   * Store user data
   */
  storeUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user))
  },

  /**
   * Clear user data
   */
  clearUserData: () => {
    localStorage.removeItem('user')
    localStorage.removeItem(JWT_CONFIG.ACCESS_TOKEN_KEY)
  },

  /**
   * Get token
   */
  getToken: () => {
    return localStorage.getItem(JWT_CONFIG.ACCESS_TOKEN_KEY)
  }
}

export default authService
