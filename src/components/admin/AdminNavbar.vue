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
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-xl font-bold text-gray-900">Portfolio Admin</h1>
          </div>
          <div class="hidden sm:ml-8 sm:flex sm:space-x-4">
            <router-link
              v-for="item in navigation"
              :key="item.path"
              :to="item.path"
              :class="[
                'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive(item.path)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <span class="mr-2">{{ item.icon }}</span>
              {{ item.name }}
            </router-link>
          </div>
        </div>
        <div class="flex items-center">
          <span class="text-sm text-gray-700 mr-4">{{ authStore.user?.name || 'Admin' }}</span>
          <button
            @click="handleLogout"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
