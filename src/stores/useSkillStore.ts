import { ref } from 'vue'
import { defineStore } from 'pinia'
import { skillService } from '@/services/skillService'
import type { Skill, SkillCategory } from '@/types/Skill'
import type { ApiError } from '@/types/ApiResponse'

export const useSkillStore = defineStore('skill', () => {
  // State
  const skills = ref<Skill[]>([])
  const skillsByCategory = ref<SkillCategory[]>([])
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  // Actions
  async function fetchSkills(): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      const response = await skillService.getAll()
      skills.value = response.data.data
    } catch (err) {
      error.value = err as ApiError
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchSkillsByCategory(): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      const response = await skillService.getByCategory()
      skillsByCategory.value = response.data.data
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
    skillsByCategory,
    loading,
    error,
    // Actions
    fetchSkills,
    fetchSkillsByCategory,
    clearError,
  }
})
