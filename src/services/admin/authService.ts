import type { AxiosResponse } from 'axios'
import api from '../api'
import type { LoginRequest, LoginResponse, AdminUser } from '@/types/Admin'
import type { ApiResponse } from '@/types/ApiResponse'

export const authService = {
  /**
   * Login admin user
   */
  async login(credentials: LoginRequest): Promise<AxiosResponse<ApiResponse<LoginResponse>>> {
    return api.post<ApiResponse<LoginResponse>>('/admin/login', credentials)
  },

  /**
   * Logout admin user
   */
  async logout(): Promise<AxiosResponse<ApiResponse<void>>> {
    return api.post<ApiResponse<void>>('/admin/logout')
  },

  /**
   * Get current authenticated admin user
   */
  async getMe(): Promise<AxiosResponse<ApiResponse<AdminUser>>> {
    return api.get<ApiResponse<AdminUser>>('/admin/me')
  },

  /**
   * Store authentication token in localStorage
   */
  setToken(token: string): void {
    localStorage.setItem('auth_token', token)
  },

  /**
   * Get authentication token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token')
  },

  /**
   * Remove authentication token from localStorage
   */
  removeToken(): void {
    localStorage.removeItem('auth_token')
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}
