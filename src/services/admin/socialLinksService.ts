import type { ApiResponse } from '@/types/ApiResponse'
import type { AxiosResponse } from 'axios'
import api from '../api'
import type { SocialLink } from '@/types/SocialLink'

export const socialLinksService = {
  /**
   * Fetch all social links   */
  async fetchSocialLinks(): Promise<AxiosResponse<ApiResponse<SocialLink[]>>> {
    return api.get<ApiResponse<SocialLink[]>>('/admin/social-links')
  },
  /**
   * Fetch a single social link by ID
   */
  async fetchSocialLinkById(id: number): Promise<AxiosResponse<ApiResponse<SocialLink>>> {
    return api.get<ApiResponse<SocialLink>>(`/admin/social-links/${id}`)
  },
  /**
   * Create a new social link
   */
  async createSocialLink(
    data: Partial<SocialLink>,
  ): Promise<AxiosResponse<ApiResponse<SocialLink>>> {
    return api.post<ApiResponse<SocialLink>>('/admin/social-links', data)
  },

  /**
   * Update an existing social link
   */
  async updateSocialLink(
    id: number,
    data: Partial<SocialLink>,
  ): Promise<AxiosResponse<ApiResponse<SocialLink>>> {
    return api.put<ApiResponse<SocialLink>>(`/admin/social-links/${id}`, data)
  },

  /**
   * Delete a social link
   */
  async deleteSocialLink(id: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return api.delete<ApiResponse<null>>(`/admin/social-links/${id}`)
  },
}
