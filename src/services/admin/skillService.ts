import type { AxiosResponse } from 'axios'
import api from '../api'
import type { Skill } from '@/types/Skill'
import type { AdminSkillFormData } from '@/types/Admin'
import type { ApiResponse } from '@/types/ApiResponse'
import type { PaginatedResponse } from '@/types/Pagination'

export const adminSkillService = {
  /**
   * Get all skills with pagination
   */
  async getAll(page = 1, perPage = 20): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Skill>>>> {
    return api.get<ApiResponse<PaginatedResponse<Skill>>>('/admin/skills', {
      params: { page, per_page: perPage }
    })
  },

  /**
   * Get a single skill by ID
   */
  async getById(id: number): Promise<AxiosResponse<ApiResponse<Skill>>> {
    return api.get<ApiResponse<Skill>>(`/admin/skills/${id}`)
  },

  /**
   * Create a new skill
   */
  async create(data: AdminSkillFormData): Promise<AxiosResponse<ApiResponse<Skill>>> {
    return api.post<ApiResponse<Skill>>('/admin/skills', data)
  },

  /**
   * Update an existing skill
   */
  async update(id: number, data: AdminSkillFormData): Promise<AxiosResponse<ApiResponse<Skill>>> {
    return api.put<ApiResponse<Skill>>(`/admin/skills/${id}`, data)
  },

  /**
   * Delete a skill
   */
  async delete(id: number): Promise<AxiosResponse<ApiResponse<void>>> {
    return api.delete<ApiResponse<void>>(`/admin/skills/${id}`)
  }
}
