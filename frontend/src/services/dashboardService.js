/**
 * Dashboard Service
 */

import { axiosPrivate, handleApiError } from '../utils/axios'
import { API_ENDPOINTS } from '../config'

export const dashboardService = {
  /**
   * Get consumer dashboard
   */
  getConsumerDashboard: async (userId) => {
    try {
      const response = await axiosPrivate.get(API_ENDPOINTS.DASHBOARD.CONSUMER(userId))
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Get consumer dashboard error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Get supplier dashboard
   */
  getSupplierDashboard: async (supplierId) => {
    try {
      const response = await axiosPrivate.get(API_ENDPOINTS.DASHBOARD.SUPPLIER(supplierId))
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Get supplier dashboard error:', apiError)
      throw new Error(apiError.message)
    }
  }
}

export default dashboardService
