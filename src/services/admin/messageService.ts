import type { AxiosResponse } from 'axios'
import api from '../api'
import type { Message } from '@/types/Message'
import type { ApiResponse } from '@/types/ApiResponse'
import type { PaginatedResponse } from '@/types/Pagination'

export const messageService = {
  /**
   * Get all messages with pagination
   */
  async getAll(page = 1, perPage = 10): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Message>>>> {
    return api.get<ApiResponse<PaginatedResponse<Message>>>('/admin/messages', {
      params: { page, per_page: perPage }
    })
  },

  /**
   * Mark a message as read
   */
  async markAsRead(id: number): Promise<AxiosResponse<ApiResponse<Message>>> {
    return api.patch<ApiResponse<Message>>(`/admin/messages/${id}/read`)
  }
}
