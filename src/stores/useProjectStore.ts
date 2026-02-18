import { ref } from 'vue'
import { defineStore } from 'pinia'
import { projectService } from '@/services/projectService'
import type { Project } from '@/types/Project'
import type { PaginatedResponse } from '@/types/Pagination'
import type { ApiError } from '@/types/ApiResponse'

export const useProjectStore = defineStore('project', () => {
  // State
  const projects = ref<Project[]>([])
  const currentProject = ref<Project | null>(null)
  const featuredProjects = ref<Project[]>([])
  const pagination = ref<PaginatedResponse<Project>['meta'] | null>(null)
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  // Actions
  async function fetchProjects(page = 1, perPage = 10): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      const response = await projectService.getAll(page, perPage)
      const paginatedData = response.data.data
      projects.value = paginatedData.data
      pagination.value = paginatedData.meta
    } catch (err) {
      error.value = err as ApiError
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchProjectBySlug(slug: string): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      const response = await projectService.getBySlug(slug)
      currentProject.value = response.data.data
    } catch (err) {
      error.value = err as ApiError
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchFeaturedProjects(limit = 3): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      const response = await projectService.getFeatured(limit)
      featuredProjects.value = response.data.data
    } catch (err) {
      error.value = err as ApiError
      throw err
    } finally {
      loading.value = false
    }
  }

  async function searchProjects(query: string, page = 1): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      const response = await projectService.search(query, page)
      const paginatedData = response.data.data
      projects.value = paginatedData.data
      pagination.value = paginatedData.meta
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
    projects,
    currentProject,
    featuredProjects,
    pagination,
    loading,
    error,
    // Actions
    fetchProjects,
    fetchProjectBySlug,
    fetchFeaturedProjects,
    searchProjects,
    clearError,
  }
})
