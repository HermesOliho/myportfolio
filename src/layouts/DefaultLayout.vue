<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/projects' },
  { name: 'Contact', path: '/contact' },
]

const isActive = (path: string): boolean => {
  return route.path === path
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <router-link
              to="/"
              class="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              Portfolio
            </router-link>
          </div>
          
          <div class="flex gap-8">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              :class="[
                'text-base font-medium transition-colors',
                isActive(item.path)
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              ]"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8 mt-auto">
      <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <p class="text-gray-400">
            © {{ new Date().getFullYear() }} Portfolio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
