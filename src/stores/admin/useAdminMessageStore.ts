import { ref } from 'vue'
import { defineStore } from 'pinia'
import { messageService } from '@/services/admin/messageService'
import type { Message } from '@/types/Message'
import type { PaginatedResponse } from '@/types/Pagination'
import type { ApiError } from '@/types/ApiResponse'

export const useAdminMessageStore = defineStore('adminMessage', () => {
  // State
  const messages = ref<Message[]>([])
  const pagination = ref<PaginatedResponse<Message>['meta'] | null>(null)
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  // Actions
  async function fetchMessages(page = 1, perPage = 10): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      const response = await messageService.getAll(page, perPage)
      const paginatedData = response.data.data
      messages.value = paginatedData.data
      pagination.value = paginatedData.meta
    } catch (err) {
      error.value = err as ApiError
      throw err
    } finally {
      loading.value = false
    }
  }

  async function markAsRead(id: number): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      const response = await messageService.markAsRead(id)
      const updatedMessage = response.data.data
      const index = messages.value.findIndex(m => m.id === id)
      if (index !== -1) {
        messages.value[index] = updatedMessage
      }
    } catch (err) {
      error.value = err as ApiError
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError(): void {
    error.value = null
  }

  return {
    // State
    messages,
    pagination,
    loading,
    error,
    // Actions
    fetchMessages,
    markAsRead,
    clearError,
  }
})
