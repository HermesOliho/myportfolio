import type { AxiosResponse } from 'axios'
import api from '../api'
import type { AdminSettingsFormData } from '@/types/Admin'
import type { Settings } from '@/types/Settings'
import type { ApiResponse } from '@/types/ApiResponse'

export const adminSettingService = {
  /**
   * Get current settings
   */
  async get(): Promise<AxiosResponse<ApiResponse<Settings>>> {
    return api.get<ApiResponse<Settings>>('/admin/settings')
  },

  /**
   * Update settings
   */
  async update(data: AdminSettingsFormData): Promise<AxiosResponse<ApiResponse<Settings>>> {
    return api.put<ApiResponse<Settings>>('/admin/settings', data)
  }
}
