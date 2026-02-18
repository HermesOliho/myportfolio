export interface Message extends Record<string, unknown> {
  id: number
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
  updated_at: string
}
