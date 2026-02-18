export interface Skill {
  id: number
  name: string
  category: 'backend' | 'frontend' | 'devops' | 'tools'
  level: number
  display_order: number
  icon?: string
  description?: string
  years_experience?: number
  created_at: string
  updated_at: string
}

export interface SkillCategory {
  name: string
  skills: Skill[]
}
