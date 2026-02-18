export interface AdminUser {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AdminUser
  expires_at?: string
}

export interface DashboardStats {
  total_projects: number
  total_skills: number
  unread_messages: number
}

export interface AdminProjectFormData {
  title: string
  short_description: string
  long_description: string
  technologies: string[]
  main_image: string
  github_url?: string
  demo_url?: string
  status: 'draft' | 'published'
  meta_title?: string
  meta_description?: string
}

export interface AdminSkillFormData {
  name: string
  category: 'backend' | 'frontend' | 'devops' | 'tools'
  level: number
  display_order: number
  icon?: string
}

export interface AdminSettingsFormData {
  full_name: string
  professional_title: string
  short_bio: string
  full_bio: string
  email: string
  phone?: string
  location?: string
  global_meta_title: string
  global_meta_description: string
}
