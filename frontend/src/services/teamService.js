/**
 * Team Service
 */

import { axiosPrivate, handleApiError } from '../utils/axios'
import { API_ENDPOINTS } from '../config'

export const teamService = {
  /**
   * Get all team members
   */
  getTeamMembers: async (supplierId, skip = 0, limit = 10) => {
    try {
      const params = { supplier_id: supplierId, skip, limit }
      const response = await axiosPrivate.get(API_ENDPOINTS.TEAM.LIST, { params })
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Get team members error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Get team member by ID
   */
  getTeamMember: async (id) => {
    try {
      const response = await axiosPrivate.get(API_ENDPOINTS.TEAM.GET(id))
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Get team member error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Add team member
   */
  addTeamMember: async (supplierId, userId, role = 'staff') => {
    try {
      const response = await axiosPrivate.post(API_ENDPOINTS.TEAM.ADD, {
        supplier_id: supplierId,
        user_id: userId,
        role
      })
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Add team member error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Update team member
   */
  updateTeamMember: async (id, role = null, isActive = null) => {
    try {
      const data = {}
      if (role !== null) data.role = role
      if (isActive !== null) data.is_active = isActive

      const response = await axiosPrivate.put(API_ENDPOINTS.TEAM.UPDATE(id), data)
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Update team member error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Remove team member
   */
  removeTeamMember: async (id) => {
    try {
      const response = await axiosPrivate.delete(API_ENDPOINTS.TEAM.REMOVE(id))
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Remove team member error:', apiError)
      throw new Error(apiError.message)
    }
  }
}

export default teamService
