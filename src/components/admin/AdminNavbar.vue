<script setup lang="ts">
import { useAuthStore } from '@/stores/admin/useAuthStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

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
    <div class="w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="shrink-0 flex items-center">
            <h1 class="text-2xl! font-bold text-primary">
              Portfolio {{ authStore.user?.name || 'Admin' }}
            </h1>
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
