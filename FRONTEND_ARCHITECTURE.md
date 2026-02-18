# Vue 3 + TypeScript Portfolio Frontend - Architecture Documentation

## 📋 Overview

This is a professional Vue 3 + TypeScript portfolio frontend built with strict type safety and modern best practices. The application follows a scalable, maintainable architecture suitable for production environments.

## 🏗 Architecture

### Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript (strict mode)** - Type-safe development
- **Vite** - Next-generation frontend tooling
- **Vue Router** - Official routing library
- **Pinia** - State management with TypeScript support
- **Axios** - HTTP client with full typing
- **TailwindCSS** - Utility-first CSS framework
- **@vueuse/head** - Document head management for SEO
- **ESLint + Prettier** - Code quality and formatting

### Project Structure

```
src/
├── assets/                 # Static assets (CSS, images)
│   └── main.css           # TailwindCSS imports
├── components/            # Reusable Vue components
│   ├── common/           # Base/shared components
│   │   ├── BaseButton.vue
│   │   ├── BaseCard.vue
│   │   └── Loader.vue
│   ├── layout/           # Layout components
│   │   ├── PageHeader.vue
│   │   └── SectionWrapper.vue
│   ├── projects/         # Project-specific components
│   │   ├── ProjectCard.vue
│   │   └── SkeletonCard.vue
│   ├── skills/           # Skill-specific components
│   │   └── SkillBar.vue
│   └── ui/              # UI components
│       └── ToastNotification.vue
├── composables/          # Vue composables (reusable composition functions)
├── layouts/             # Layout templates
│   └── DefaultLayout.vue
├── pages/               # Page components
│   ├── HomePage.vue
│   ├── ProjectsPage.vue
│   ├── ProjectDetailPage.vue
│   └── ContactPage.vue
├── router/              # Vue Router configuration
│   └── index.ts
├── services/            # API services
│   ├── api.ts          # Axios instance & interceptors
│   ├── projectService.ts
│   ├── skillService.ts
│   ├── settingsService.ts
│   └── contactService.ts
├── stores/              # Pinia stores
│   ├── useProjectStore.ts
│   ├── useSkillStore.ts
│   └── useSettingsStore.ts
├── types/               # TypeScript type definitions
│   ├── Project.ts
│   ├── Skill.ts
│   ├── Settings.ts
│   ├── ApiResponse.ts
│   ├── Pagination.ts
│   └── Contact.ts
├── utils/               # Utility functions
├── App.vue             # Root component
└── main.ts             # Application entry point
```

## 🔧 Configuration

### TypeScript Strict Mode

TypeScript strict mode is enabled in `tsconfig.app.json`:

```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true
}
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_TITLE=Portfolio
```

## 🔌 API Integration

### API Service Layer

All API calls are centralized in the `services/` directory. Each service provides typed methods for interacting with backend endpoints.

**Example: projectService.ts**

```typescript
import type { AxiosResponse } from 'axios'
import api from './api'
import type { Project } from '@/types/Project'
import type { ApiResponse } from '@/types/ApiResponse'

export const projectService = {
  async getAll(): Promise<AxiosResponse<ApiResponse<Project[]>>> {
    return api.get<ApiResponse<Project[]>>('/projects')
  },
  
  async getBySlug(slug: string): Promise<AxiosResponse<ApiResponse<Project>>> {
    return api.get<ApiResponse<Project>>(`/projects/${slug}`)
  }
}
```

### Axios Configuration

The base Axios instance (`services/api.ts`) includes:

- Base URL configuration from environment variables
- Request/response interceptors
- Error handling
- Authentication token management

## 📦 State Management (Pinia)

### Store Structure

Each Pinia store follows this pattern:

```typescript
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Project } from '@/types/Project'
import type { ApiError } from '@/types/ApiResponse'

export const useProjectStore = defineStore('project', () => {
  // State
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  // Actions
  async function fetchProjects(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      // API call
    } catch (err) {
      error.value = err as ApiError
    } finally {
      loading.value = false
    }
  }

  return { projects, loading, error, fetchProjects }
})
```

### Available Stores

- **useProjectStore** - Manages project data, featured projects, and project details
- **useSkillStore** - Manages skills and skill categories
- **useSettingsStore** - Manages site-wide settings

## 🎨 Component Library

### Common Components

#### BaseButton
Reusable button with variants (primary, secondary, outline, ghost) and sizes (sm, md, lg).

```vue
<BaseButton variant="primary" size="md" :loading="isLoading">
  Click Me
</BaseButton>
```

#### BaseCard
Card container with configurable padding, hover effects, and shadows.

```vue
<BaseCard padding="md" :hover="true">
  <h3>Card Title</h3>
  <p>Card content</p>
</BaseCard>
```

#### Loader
Loading spinner with customizable size and text.

```vue
<Loader size="lg" text="Loading data..." />
```

### Layout Components

#### SectionWrapper
Container with responsive padding and max-width constraints.

```vue
<SectionWrapper max-width="xl" spacing="lg">
  <!-- Content -->
</SectionWrapper>
```

#### PageHeader
Consistent page header with title and optional subtitle.

```vue
<PageHeader 
  title="Page Title" 
  subtitle="Optional description"
/>
```

### Project Components

- **ProjectCard** - Display project information in a card format
- **SkeletonCard** - Loading skeleton for project cards

### Skill Components

- **SkillBar** - Progress bar for skill proficiency levels

### UI Components

- **ToastNotification** - Toast notifications with different types (success, error, warning, info)

## 🛣 Routing

Routes are defined in `src/router/index.ts` with the following structure:

- `/` - Home page with featured projects
- `/projects` - All projects list with pagination
- `/projects/:slug` - Individual project detail page
- `/contact` - Contact form page

### Route Configuration

```typescript
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'home', component: HomePage },
      { path: 'projects', name: 'projects', component: ProjectsPage },
      { path: 'projects/:slug', name: 'project-detail', component: ProjectDetailPage },
      { path: 'contact', name: 'contact', component: ContactPage },
    ],
  },
]
```

## 🔍 SEO

SEO is handled using `@vueuse/head` for dynamic meta tags:

```vue
<script setup lang="ts">
import { useHead } from '@vueuse/head'

useHead({
  title: 'Page Title',
  meta: [
    { name: 'description', content: 'Page description' },
  ],
})
</script>
```

## 📝 Type Definitions

### Core Types

#### Project
```typescript
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
```

#### ApiResponse
```typescript
export interface ApiResponse<T> {
  data: T
  message?: string
  status: 'success' | 'error'
}
```

## 🚀 Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Type Check

```bash
npm run type-check
```

### Lint & Format

```bash
npm run lint
npm run format
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## ✅ Best Practices

1. **Type Safety**: All components, services, and stores are fully typed
2. **No `any` types**: Strict TypeScript configuration prevents implicit any
3. **Composition API**: Using Vue 3 Composition API with `<script setup>`
4. **Separation of Concerns**: Clear separation between UI, logic, and data layers
5. **Reusable Components**: Component library approach for consistency
6. **Error Handling**: Centralized error handling in API service and stores
7. **Loading States**: All async operations manage loading states
8. **Responsive Design**: TailwindCSS utilities for responsive layouts

## 🔒 Security

- CSRF protection should be implemented on the backend
- Authentication tokens stored in localStorage (consider httpOnly cookies for production)
- Input validation on all form submissions
- XSS protection via Vue's built-in escaping
- API error responses properly sanitized

## 📚 Additional Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Vue Router Documentation](https://router.vuejs.org/)

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Ensure all TypeScript types are properly defined
3. Run linting and type-check before committing
4. Write meaningful commit messages
5. Test changes locally before pushing

## 📄 License

See LICENSE file for details.
