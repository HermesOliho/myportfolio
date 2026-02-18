import { ref } from 'vue'
import { defineStore } from 'pinia'
import { dashboardService } from '@/services/admin/dashboardService'
import type { DashboardStats } from '@/types/Admin'
import type { ApiError } from '@/types/ApiResponse'

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const stats = ref<DashboardStats | null>(null)
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  // Actions
  async function fetchStats(): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      const response = await dashboardService.getStats()
      stats.value = response.data.data
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
    stats,
    loading,
    error,
    // Actions
    fetchStats,
    clearError,
  }
})
