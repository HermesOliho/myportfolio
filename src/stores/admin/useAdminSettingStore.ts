import { ref } from 'vue'
import { defineStore } from 'pinia'
import { adminSettingService } from '@/services/admin/settingService'
import type { Settings } from '@/types/Settings'
import type { AdminSettingsFormData } from '@/types/Admin'
import type { ApiError } from '@/types/ApiResponse'

export const useAdminSettingStore = defineStore('adminSetting', () => {
  // State
  const settings = ref<Settings | null>(null)
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  // Actions
  async function fetchSettings(): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      const response = await adminSettingService.get()
      settings.value = response.data.data
    } catch (err) {
      error.value = err as ApiError
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateSettings(data: AdminSettingsFormData): Promise<Settings> {
    loading.value = true
    error.value = null
    
    try {
      const response = await adminSettingService.update(data)
      settings.value = response.data.data
      return settings.value
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
    updateSettings,
    clearError,
  }
})
