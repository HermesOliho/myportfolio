import type { AxiosResponse } from 'axios'
import api from './api'
import type { ContactFormData, ContactResponse } from '@/types/Contact'
import type { ApiResponse } from '@/types/ApiResponse'

export const contactService = {
  /**
   * Submit contact form
   */
  async submit(data: ContactFormData): Promise<AxiosResponse<ApiResponse<ContactResponse>>> {
    return api.post<ApiResponse<ContactResponse>>('/contact', data)
  }
}
