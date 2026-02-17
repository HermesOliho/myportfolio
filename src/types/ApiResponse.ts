export interface ApiResponse<T> {
  data: T
  message?: string
  status: 'success' | 'error'
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status: number
}
