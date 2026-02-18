import type { AxiosResponse } from 'axios'
import api from '../api'
import type { DashboardStats } from '@/types/Admin'
import type { ApiResponse } from '@/types/ApiResponse'

export const dashboardService = {
  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<AxiosResponse<ApiResponse<DashboardStats>>> {
    return api.get<ApiResponse<DashboardStats>>('/admin/dashboard')
  }
}
