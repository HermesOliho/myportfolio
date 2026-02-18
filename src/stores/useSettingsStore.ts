import { ref } from 'vue'
import { defineStore } from 'pinia'
import { settingsService } from '@/services/settingsService'
import type { Settings } from '@/types/Settings'
import type { ApiError } from '@/types/ApiResponse'

export const useSettingsStore = defineStore('settings', () => {
  // State
  const settings = ref<Settings | null>(null)
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  // Actions
  async function fetchSettings(): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      const response = await settingsService.get()
      settings.value = response.data.data
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
    settings,
    loading,
    error,
    // Actions
    fetchSettings,
    clearError,
  }
})
