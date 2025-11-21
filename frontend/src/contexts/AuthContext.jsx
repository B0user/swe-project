import React, { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check for existing session
    const savedUser = authService.getStoredUser()
    if (savedUser && authService.isAuthenticated()) {
      setUser(savedUser)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      setLoading(true)
      const result = await authService.login(email, password)
      setUser(result.user)
      return result
    } catch (err) {
      const errorMsg = err.message || 'Login failed'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (email, password, full_name, role = 'consumer') => {
    try {
      setError(null)
      setLoading(true)
      const result = await authService.register(email, password, full_name, role)
      setUser(result.user)
      return result
    } catch (err) {
      const errorMsg = err.message || 'Registration failed'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await authService.logout()
      setUser(null)
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    isAuthenticated: !!user && authService.isAuthenticated(),
    userType: user?.role // 'consumer', 'supplier', or 'admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
