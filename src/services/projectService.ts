import type { AxiosResponse } from 'axios'
import api from './api'
import type { Project } from '@/types/Project'
import type { ApiResponse } from '@/types/ApiResponse'
import type { PaginatedResponse } from '@/types/Pagination'

export const projectService = {
  /**
   * Get all published projects with optional pagination
   */
  async getAll(page = 1, perPage = 10): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Project>>>> {
    return api.get<ApiResponse<PaginatedResponse<Project>>>('/projects', {
      params: { page, per_page: perPage, status: 'published' }
    })
  },

  /**
   * Get a single project by slug
   */
  async getBySlug(slug: string): Promise<AxiosResponse<ApiResponse<Project>>> {
    return api.get<ApiResponse<Project>>(`/projects/${slug}`)
  },

  /**
   * Get a single project by ID
   */
  async getById(id: number): Promise<AxiosResponse<ApiResponse<Project>>> {
    return api.get<ApiResponse<Project>>(`/projects/${id}`)
  },

  /**
   * Get featured projects
   */
  async getFeatured(limit = 3): Promise<AxiosResponse<ApiResponse<Project[]>>> {
    return api.get<ApiResponse<Project[]>>('/projects/featured', {
      params: { limit }
    })
  },

  /**
   * Search projects by query
   */
  async search(query: string, page = 1): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Project>>>> {
    return api.get<ApiResponse<PaginatedResponse<Project>>>('/projects/search', {
      params: { q: query, page }
    })
  }
}
