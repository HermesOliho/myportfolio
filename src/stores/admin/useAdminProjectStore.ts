import { ref } from 'vue'
import { defineStore } from 'pinia'
import { adminProjectService } from '@/services/admin/projectService'
import type { Project } from '@/types/Project'
import type { AdminProjectFormData } from '@/types/Admin'
import type { PaginatedResponse } from '@/types/Pagination'
import type { ApiError } from '@/types/ApiResponse'

export const useAdminProjectStore = defineStore('adminProject', () => {
  // State
  const projects = ref<Project[]>([])
  const currentProject = ref<Project | null>(null)
  const pagination = ref<PaginatedResponse<Project>['meta'] | null>(null)
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  // Actions
  async function fetchProjects(page = 1, perPage = 10): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      const response = await adminProjectService.getAll(page, perPage)
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

  async function fetchProjectById(id: number): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      const response = await adminProjectService.getById(id)
      currentProject.value = response.data.data
    } catch (err) {
      error.value = err as ApiError
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createProject(data: AdminProjectFormData): Promise<Project> {
    loading.value = true
    error.value = null
    
    try {
      const response = await adminProjectService.create(data)
      const project = response.data.data
      projects.value.unshift(project)
      return project
    } catch (err) {
      error.value = err as ApiError
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProject(id: number, data: AdminProjectFormData): Promise<Project> {
    loading.value = true
    error.value = null
    
    try {
      const response = await adminProjectService.update(id, data)
      const project = response.data.data
      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        projects.value[index] = project
      }
      if (currentProject.value?.id === id) {
        currentProject.value = project
      }
      return project
    } catch (err) {
      error.value = err as ApiError
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteProject(id: number): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      await adminProjectService.delete(id)
      projects.value = projects.value.filter(p => p.id !== id)
      if (currentProject.value?.id === id) {
        currentProject.value = null
      }
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
    pagination,
    loading,
    error,
    // Actions
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
    clearError,
  }
})
