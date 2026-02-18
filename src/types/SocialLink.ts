export interface SocialLink extends Record<string, unknown> {
  id: number
  platform: string
  url: string
  icon?: string
  created_at?: string
  updated_at?: string
}
