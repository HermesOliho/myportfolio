<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSettingsStore } from '@/stores/useSettingsStore'

const route = useRoute()
const settingsStore = useSettingsStore()

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/projects' },
  { name: 'Contact', path: '/contact' },
]

const ownerName = computed(() => settingsStore.settings?.full_name || 'Portfolio')

const isActive = (path: string): boolean => {
  return route.path === path
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-linear-to-b from-slate-50 via-white to-slate-50">
    <!-- Navigation -->
    <nav class="sticky top-0 z-40 border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <router-link
              to="/"
              class="text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              {{ ownerName }}
            </router-link>
          </div>

          <div class="flex gap-8">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              :class="[
                'text-base font-medium transition-all duration-200 relative',
                isActive(item.path) ? 'text-blue-600' : 'text-slate-700 hover:text-blue-600',
              ]"
            >
              {{ item.name }}
              <div
                v-if="isActive(item.path)"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-600 to-transparent"
              />
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
    <footer
      class="border-t border-slate-200/50 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-12 mt-20"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 class="text-lg font-bold mb-4">{{ ownerName }}</h3>
            <p class="text-slate-400">Building amazing web experiences with modern technologies</p>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-slate-200 mb-4">Quick Links</h4>
            <ul class="space-y-2">
              <li v-for="item in navItems" :key="item.path">
                <router-link
                  :to="item.path"
                  class="text-slate-400 hover:text-white transition-colors duration-200"
                >
                  {{ item.name }}
                </router-link>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-slate-200 mb-4">Connect</h4>
            <div class="space-y-2 text-slate-400">
              <p>
                Email:
                <a
                  href="mailto:contact@example.com"
                  class="text-blue-400 hover:text-blue-300 transition-colors"
                  >contact@example.com</a
                >
              </p>
            </div>
          </div>
        </div>
        <div class="border-t border-slate-700 pt-8">
          <p class="text-slate-400 text-center">
            © {{ new Date().getFullYear() }} {{ ownerName }}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
