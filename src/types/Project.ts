export interface Project {
  id: number
  title: string
  slug: string
  short_description: string
  long_description: string
  technologies: string[]
  main_image: string
  github_url?: string
  demo_url?: string
  status: 'draft' | 'published'
  meta_title?: string
  meta_description?: string
  published_at?: string
  created_at: string
  updated_at: string
}
