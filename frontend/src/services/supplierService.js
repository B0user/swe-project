/**
 * Supplier Service
 */

import { axiosPublic, axiosPrivate, handleApiError } from '../utils/axios'
import { API_ENDPOINTS } from '../config'

export const supplierService = {
  /**
   * Get all suppliers
   */
  getSuppliers: async (skip = 0, limit = 10, category = null, search = null) => {
    try {
      const params = { skip, limit }
      if (category) params.category = category
      if (search) params.search = search

      const response = await axiosPublic.get(API_ENDPOINTS.SUPPLIERS.LIST, { params })
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Get suppliers error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Get supplier by ID
   */
  getSupplier: async (id) => {
    try {
      const response = await axiosPublic.get(API_ENDPOINTS.SUPPLIERS.GET(id))
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Get supplier error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Send link request to supplier
   */
  sendLinkRequest: async (supplierId, userId, message = null) => {
    try {
      const response = await axiosPrivate.post(API_ENDPOINTS.SUPPLIERS.LINK_REQUEST, {
        supplier_id: supplierId,
        user_id: userId,
        message
      })
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Send link request error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Get user's link requests
   */
  getUserLinkRequests: async (userId, status = null) => {
    try {
      const params = {}
      if (status) params.status = status

      const response = await axiosPrivate.get(
        API_ENDPOINTS.SUPPLIERS.USER_REQUESTS(userId),
        { params }
      )
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Get user link requests error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Get supplier's link requests
   */
  getSupplierLinkRequests: async (supplierId, status = null) => {
    try {
      const params = {}
      if (status) params.status = status

      const response = await axiosPrivate.get(
        API_ENDPOINTS.SUPPLIERS.SUPPLIER_REQUESTS(supplierId),
        { params }
      )
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Get supplier link requests error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Update link request (accept/reject)
   */
  updateLinkRequest: async (requestId, status) => {
    try {
      const response = await axiosPrivate.put(
        API_ENDPOINTS.SUPPLIERS.UPDATE_REQUEST(requestId),
        { status }
      )
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Update link request error:', apiError)
      throw new Error(apiError.message)
    }
  }
}

export default supplierService
