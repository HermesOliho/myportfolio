import { ref } from 'vue'
import { defineStore } from 'pinia'
import { adminSkillService } from '@/services/admin/skillService'
import type { Skill } from '@/types/Skill'
import type { AdminSkillFormData } from '@/types/Admin'
import type { PaginatedResponse } from '@/types/Pagination'
import type { ApiError } from '@/types/ApiResponse'

export const useAdminSkillStore = defineStore('adminSkill', () => {
  // State
  const skills = ref<Skill[]>([])
  const currentSkill = ref<Skill | null>(null)
  const pagination = ref<PaginatedResponse<Skill>['meta'] | null>(null)
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  // Actions
  async function fetchSkills(page = 1, perPage = 20): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      const response = await adminSkillService.getAll(page, perPage)
      const paginatedData = response.data.data
      skills.value = paginatedData.data
      pagination.value = paginatedData.meta
    } catch (err) {
      error.value = err as ApiError
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchSkillById(id: number): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      const response = await adminSkillService.getById(id)
      currentSkill.value = response.data.data
    } catch (err) {
      error.value = err as ApiError
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createSkill(data: AdminSkillFormData): Promise<Skill> {
    loading.value = true
    error.value = null
    
    try {
      const response = await adminSkillService.create(data)
      const skill = response.data.data
      skills.value.unshift(skill)
      return skill
    } catch (err) {
      error.value = err as ApiError
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateSkill(id: number, data: AdminSkillFormData): Promise<Skill> {
    loading.value = true
    error.value = null
    
    try {
      const response = await adminSkillService.update(id, data)
      const skill = response.data.data
      const index = skills.value.findIndex(s => s.id === id)
      if (index !== -1) {
        skills.value[index] = skill
      }
      if (currentSkill.value?.id === id) {
        currentSkill.value = skill
      }
      return skill
    } catch (err) {
      error.value = err as ApiError
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteSkill(id: number): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      await adminSkillService.delete(id)
      skills.value = skills.value.filter(s => s.id !== id)
      if (currentSkill.value?.id === id) {
        currentSkill.value = null
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
    skills,
    currentSkill,
    pagination,
    loading,
    error,
    // Actions
    fetchSkills,
    fetchSkillById,
    createSkill,
    updateSkill,
    deleteSkill,
    clearError,
  }
})
