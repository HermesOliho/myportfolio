export interface Settings {
  id: number
  // Legacy fields (may be deprecated)
  site_title: string
  site_description: string
  site_logo?: string
  contact_email: string
  github_url?: string
  linkedin_url?: string
  twitter_url?: string
  footer_text?: string
  meta_keywords?: string
  // Portfolio owner information
  full_name: string
  professional_title: string
  short_bio: string
  full_bio: string
  email: string
  phone?: string
  location?: string
  // Global SEO settings
  global_meta_title: string
  global_meta_description: string
  created_at: string
  updated_at: string
}
