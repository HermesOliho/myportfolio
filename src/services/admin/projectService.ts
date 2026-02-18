import type { AxiosResponse } from 'axios'
import api from '../api'
import type { Project } from '@/types/Project'
import type { AdminProjectFormData } from '@/types/Admin'
import type { ApiResponse } from '@/types/ApiResponse'
import type { PaginatedResponse } from '@/types/Pagination'

export const adminProjectService = {
  /**
   * Get all projects (including drafts) with pagination
   */
  async getAll(page = 1, perPage = 10): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Project>>>> {
    return api.get<ApiResponse<PaginatedResponse<Project>>>('/admin/projects', {
      params: { page, per_page: perPage }
    })
  },

  /**
   * Get a single project by ID
   */
  async getById(id: number): Promise<AxiosResponse<ApiResponse<Project>>> {
    return api.get<ApiResponse<Project>>(`/admin/projects/${id}`)
  },

  /**
   * Create a new project
   */
  async create(data: AdminProjectFormData): Promise<AxiosResponse<ApiResponse<Project>>> {
    return api.post<ApiResponse<Project>>('/admin/projects', data)
  },

  /**
   * Update an existing project
   */
  async update(id: number, data: AdminProjectFormData): Promise<AxiosResponse<ApiResponse<Project>>> {
    return api.put<ApiResponse<Project>>(`/admin/projects/${id}`, data)
  },

  /**
   * Delete a project
   */
  async delete(id: number): Promise<AxiosResponse<ApiResponse<void>>> {
    return api.delete<ApiResponse<void>>(`/admin/projects/${id}`)
  }
}
