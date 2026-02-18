import { ref } from 'vue'
import { defineStore } from 'pinia'
import { authService } from '@/services/admin/authService'
import type { AdminUser, LoginRequest } from '@/types/Admin'
import type { ApiError } from '@/types/ApiResponse'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<AdminUser | null>(null)
  const token = ref<string | null>(authService.getToken())
  const loading = ref(false)
  const error = ref<ApiError | null>(null)
  const isAuthenticated = ref(authService.isAuthenticated())

  // Actions
  async function login(credentials: LoginRequest): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      const response = await authService.login(credentials)
      const { token: authToken, user: authUser } = response.data.data
      
      token.value = authToken
      user.value = authUser
      isAuthenticated.value = true
      
      authService.setToken(authToken)
    } catch (err) {
      error.value = err as ApiError
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      await authService.logout()
    } catch (err) {
      error.value = err as ApiError
    } finally {
      token.value = null
      user.value = null
      isAuthenticated.value = false
      authService.removeToken()
      loading.value = false
    }
  }

  async function fetchUser(): Promise<void> {
    if (!token.value) {
      return
    }

    loading.value = true
    error.value = null
    
    try {
      const response = await authService.getMe()
      user.value = response.data.data
      isAuthenticated.value = true
    } catch (err) {
      error.value = err as ApiError
      // If fetching user fails, clear authentication
      token.value = null
      user.value = null
      isAuthenticated.value = false
      authService.removeToken()
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError(): void {
    error.value = null
  }

  function initAuth(): void {
    const storedToken = authService.getToken()
    if (storedToken) {
      token.value = storedToken
      isAuthenticated.value = true
    }
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    isAuthenticated,
    // Actions
    login,
    logout,
    fetchUser,
    clearError,
    initAuth,
  }
})
