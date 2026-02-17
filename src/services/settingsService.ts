import type { AxiosResponse } from 'axios'
import api from './api'
import type { Settings } from '@/types/Settings'
import type { ApiResponse } from '@/types/ApiResponse'

export const settingsService = {
  /**
   * Get site settings
   */
  async get(): Promise<AxiosResponse<ApiResponse<Settings>>> {
    return api.get<ApiResponse<Settings>>('/settings')
  }
}
