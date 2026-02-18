<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/admin/useAuthStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const navigation = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
  { name: 'Projects', path: '/admin/projects', icon: '💼' },
  { name: 'Skills', path: '/admin/skills', icon: '🛠️' },
  { name: 'Messages', path: '/admin/messages', icon: '📧' },
  { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
]

const isActive = (path: string): boolean => {
  return route.path.startsWith(path)
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/admin/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<template>
  <nav class="navbar bg-base-100 border-b border-base-300 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="shrink-0 flex items-center">
            <h1 class="text-xl font-bold text-primary">Portfolio Admin</h1>
          </div>
          <div class="hidden sm:ml-8 sm:flex sm:space-x-2">
            <router-link
              v-for="item in navigation"
              :key="item.path"
              :to="item.path"
              :class="[
                'btn btn-ghost btn-sm normal-case text-sm font-medium',
                isActive(item.path) ? 'btn-active text-primary' : 'text-base-content/70',
              ]"
            >
              <span class="mr-2">{{ item.icon }}</span>
              {{ item.name }}
            </router-link>
          </div>
        </div>
        <div class="flex items-center">
          <span class="text-sm text-base-content/70 mr-4">{{
            authStore.user?.name || 'Admin'
          }}</span>
          <button @click="handleLogout" class="btn btn-error btn-sm normal-case">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>
