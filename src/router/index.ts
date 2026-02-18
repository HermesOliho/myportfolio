import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HomePage from '@/pages/HomePage.vue'
import ProjectsPage from '@/pages/ProjectsPage.vue'
import ProjectDetailPage from '@/pages/ProjectDetailPage.vue'
import ContactPage from '@/pages/ContactPage.vue'
import { authService } from '@/services/admin/authService'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomePage,
      },
      {
        path: 'projects',
        name: 'projects',
        component: ProjectsPage,
      },
      {
        path: 'projects/:slug',
        name: 'project-detail',
        component: ProjectDetailPage,
      },
      {
        path: 'contact',
        name: 'contact',
        component: ContactPage,
      },
    ],
  },
  // Admin routes
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/pages/admin/LoginPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: { name: 'admin-dashboard' },
      },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/pages/admin/DashboardPage.vue'),
      },
      {
        path: 'projects',
        name: 'admin-projects',
        component: () => import('@/pages/admin/projects/ProjectsListPage.vue'),
      },
      {
        path: 'projects/create',
        name: 'admin-projects-create',
        component: () => import('@/pages/admin/projects/ProjectCreatePage.vue'),
      },
      {
        path: 'projects/:id/edit',
        name: 'admin-projects-edit',
        component: () => import('@/pages/admin/projects/ProjectEditPage.vue'),
      },
      {
        path: 'skills',
        name: 'admin-skills',
        component: () => import('@/pages/admin/skills/SkillsListPage.vue'),
      },
      {
        path: 'skills/create',
        name: 'admin-skills-create',
        component: () => import('@/pages/admin/skills/SkillCreatePage.vue'),
      },
      {
        path: 'skills/:id/edit',
        name: 'admin-skills-edit',
        component: () => import('@/pages/admin/skills/SkillEditPage.vue'),
      },
      {
        path: 'messages',
        name: 'admin-messages',
        component: () => import('@/pages/admin/messages/MessagesListPage.vue'),
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import('@/pages/admin/settings/SettingsPage.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = authService.isAuthenticated()

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login if trying to access protected route while not authenticated
    next({ name: 'admin-login' })
  } else if (to.name === 'admin-login' && isAuthenticated) {
    // Redirect to dashboard if already authenticated and trying to access login
    next({ name: 'admin-dashboard' })
  } else {
    next()
  }
})

export default router
