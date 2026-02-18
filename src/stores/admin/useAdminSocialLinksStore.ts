import { socialLinksService } from '@/services/admin/socialLinksService'
import type { ApiError } from '@/types/ApiResponse'
import type { SocialLink } from '@/types/SocialLink'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminSocialLinksStore = defineStore('adminSocialLinks', () => {
  // State
  const socialLinks = ref<SocialLink[]>([])
  const currentSocialLink = ref<SocialLink | null>(null)
  const loading = ref(false)
  const error = ref<ApiError | null>(null)
  // Actions
  async function fetchSocialLinks(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const response = await socialLinksService.fetchSocialLinks()
      socialLinks.value = response.data.data
    } catch (err) {
      error.value = err as ApiError
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchSocialLinkById(id: number): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const response = await socialLinksService.fetchSocialLinkById(id)
      currentSocialLink.value = response.data.data || null
    } catch (err) {
      error.value = err as ApiError
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createSocialLink(data: Partial<SocialLink>): Promise<SocialLink> {
    loading.value = true
    error.value = null
    try {
      const response = await socialLinksService.createSocialLink(data)
      const newLink = response.data.data
      socialLinks.value.unshift(newLink)
      return newLink
    } catch (err) {
      error.value = err as ApiError
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateSocialLink(id: number, data: Partial<SocialLink>): Promise<SocialLink> {
    loading.value = true
    error.value = null
    try {
      const response = await socialLinksService.updateSocialLink(id, data)
      const updatedLink = response.data.data
      const index = socialLinks.value.findIndex((link) => link.id === id)
      if (index !== -1) {
        socialLinks.value[index] = updatedLink
      }
      return updatedLink
    } catch (err) {
      error.value = err as ApiError
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteSocialLink(id: number): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await socialLinksService.deleteSocialLink(id)
      const index = socialLinks.value.findIndex((link) => link.id === id)
      if (index !== -1) {
        socialLinks.value.splice(index, 1)
      }
      if (currentSocialLink.value?.id === id) {
        currentSocialLink.value = null
      }
    } catch (err) {
      error.value = err as ApiError
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    socialLinks,
    currentSocialLink,
    loading,
    error,
    fetchSocialLinks,
    fetchSocialLinkById,
    createSocialLink,
    updateSocialLink,
    deleteSocialLink,
  }
})
