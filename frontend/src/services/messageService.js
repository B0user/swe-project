/**
 * Message Service
 */

import { axiosPrivate, handleApiError } from '../utils/axios'
import { API_ENDPOINTS } from '../config'

export const messageService = {
  /**
   * Get all conversations for user
   */
  getConversations: async (userId, skip = 0, limit = 10) => {
    try {
      const params = { user_id: userId, skip, limit }
      const response = await axiosPrivate.get(API_ENDPOINTS.MESSAGES.CONVERSATIONS, { params })
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Get conversations error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Get conversation by ID
   */
  getConversation: async (id) => {
    try {
      const response = await axiosPrivate.get(API_ENDPOINTS.MESSAGES.GET_CONVERSATION(id))
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Get conversation error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Get messages in conversation
   */
  getMessages: async (conversationId, skip = 0, limit = 50) => {
    try {
      const params = { skip, limit }
      const response = await axiosPrivate.get(
        API_ENDPOINTS.MESSAGES.GET_MESSAGES(conversationId),
        { params }
      )
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Get messages error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Create new conversation
   */
  createConversation: async (user1Id, user2Id) => {
    try {
      const response = await axiosPrivate.post(API_ENDPOINTS.MESSAGES.CONVERSATIONS, {
        user1_id: user1Id,
        user2_id: user2Id
      })
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Create conversation error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Send message
   */
  sendMessage: async (conversationId, senderId, content) => {
    try {
      const response = await axiosPrivate.post(API_ENDPOINTS.MESSAGES.SEND, {
        conversation_id: conversationId,
        sender_id: senderId,
        content
      })
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Send message error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Get message by ID
   */
  getMessage: async (id) => {
    try {
      const response = await axiosPrivate.get(API_ENDPOINTS.MESSAGES.GET(id))
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Get message error:', apiError)
      throw new Error(apiError.message)
    }
  },

  /**
   * Delete message
   */
  deleteMessage: async (id) => {
    try {
      const response = await axiosPrivate.delete(API_ENDPOINTS.MESSAGES.DELETE(id))
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Delete message error:', apiError)
      throw new Error(apiError.message)
    }
  }
}

export default messageService
