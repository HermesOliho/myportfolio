import type { AxiosResponse } from 'axios'
import api from './api'
import type { Skill, SkillCategory } from '@/types/Skill'
import type { ApiResponse } from '@/types/ApiResponse'

export const skillService = {
  /**
   * Get all skills
   */
  async getAll(): Promise<AxiosResponse<ApiResponse<Skill[]>>> {
    return api.get<ApiResponse<Skill[]>>('/skills')
  },

  /**
   * Get skills grouped by category
   */
  async getByCategory(): Promise<AxiosResponse<ApiResponse<SkillCategory[]>>> {
    return api.get<ApiResponse<SkillCategory[]>>('/skills/by-category')
  },

  /**
   * Get a single skill by ID
   */
  async getById(id: number): Promise<AxiosResponse<ApiResponse<Skill>>> {
    return api.get<ApiResponse<Skill>>(`/skills/${id}`)
  }
}
