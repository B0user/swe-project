/**
 * Order Service
 */

import { axiosPublic, axiosPrivate, handleApiError } from '../utils/axios'
import { API_ENDPOINTS } from '../config'

export const orderService = {
  /**
   * Get all orders
   */
  getOrders: async (skip = 0, limit = 10, status = null) => {
    try {
      const params = { skip, limit }
      if (status) params.status = status

      const response = await axiosPrivate.get(API_ENDPOINTS.ORDERS.LIST, { params })
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Get orders error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Get order by ID
   */
  getOrder: async (id) => {
    try {
      const response = await axiosPrivate.get(API_ENDPOINTS.ORDERS.GET(id))
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Get order error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Create order
   */
  createOrder: async (orderData) => {
    try {
      const response = await axiosPrivate.post(API_ENDPOINTS.ORDERS.CREATE, orderData)
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Create order error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Update order status (supplier or admin only)
   */
  updateOrderStatus: async (id, status, trackingNumber = null) => {
    try {
      const data = { status }
      if (trackingNumber) data.tracking_number = trackingNumber

      const response = await axiosPrivate.put(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), data)
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Update order status error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Cancel order (owner or admin only)
   */
  cancelOrder: async (id) => {
    try {
      const response = await axiosPrivate.put(API_ENDPOINTS.ORDERS.CANCEL(id))
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Cancel order error:', apiError)
      throw new Error(apiError.message)
    }
  }
}

export default orderService
