/**
 * Product Service
 */

import { axiosPublic, axiosPrivate, handleApiError } from '../utils/axios'
import { API_ENDPOINTS } from '../config'

export const productService = {
  /**
   * Get all products
   */
  getProducts: async (skip = 0, limit = 10, category = null, search = null) => {
    try {
      const params = { skip, limit }
      if (category) params.category = category
      if (search) params.search = search

      const response = await axiosPublic.get(API_ENDPOINTS.PRODUCTS.LIST, { params })
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Get products error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Get product by ID
   */
  getProduct: async (id) => {
    try {
      const response = await axiosPublic.get(API_ENDPOINTS.PRODUCTS.GET(id))
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Get product error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Create product (supplier only)
   */
  createProduct: async (productData) => {
    try {
      const response = await axiosPrivate.post(API_ENDPOINTS.PRODUCTS.CREATE, productData)
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Create product error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Update product (owner only)
   */
  updateProduct: async (id, productData) => {
    try {
      const response = await axiosPrivate.put(API_ENDPOINTS.PRODUCTS.UPDATE(id), productData)
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Update product error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Delete product (owner only)
   */
  deleteProduct: async (id) => {
    try {
      const response = await axiosPrivate.delete(API_ENDPOINTS.PRODUCTS.DELETE(id))
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Delete product error:', apiError)
      throw new Error(apiError.message)
    }
  }
}

export default productService
