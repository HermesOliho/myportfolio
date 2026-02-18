<script setup lang="ts">
import { computed, onMounted } from 'vue'
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
const ownerEmail = computed(() => settingsStore.settings?.email || 'contact@example.com')
const ownerPhoto = computed(() => settingsStore.settings?.site_logo || '/profile-placeholder.svg')

const isActive = (path: string): boolean => {
  return route.path === path
}

function handleProfileImageError(event: Event): void {
  const target = event.target as HTMLImageElement
  target.src = '/profile-placeholder.svg'
}

onMounted(async () => {
  if (!settingsStore.settings) {
    try {
      await settingsStore.fetchSettings()
    } catch (error) {
      console.error('Error loading settings in layout:', error)
    }
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-base-100 text-base-content">
    <!-- Navigation -->
    <nav
      class="navbar sticky top-0 z-40 border-b border-base-300 bg-base-100/90 backdrop-blur-md px-0"
    >
      <div class="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <router-link
              to="/"
              class="flex items-center gap-3 text-2xl font-bold text-primary transition-all duration-200"
            >
              <img
                :src="ownerPhoto"
                :alt="ownerName"
                class="w-10 h-10 rounded-full object-cover border border-base-300 shadow-sm"
                @error="handleProfileImageError"
              />
              <span>{{ ownerName }}</span>
            </router-link>
          </div>

          <div class="menu menu-horizontal px-1 gap-2">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              :class="[
                'btn btn-ghost btn-sm text-base font-medium transition-all duration-200',
                isActive(item.path)
                  ? 'btn-active text-primary'
                  : 'text-base-content/80 hover:text-primary',
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
    <footer
      class="footer footer-horizontal border-t border-base-300 bg-base-200 text-base-content py-12 mt-20"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <img
                :src="ownerPhoto"
                :alt="ownerName"
                class="w-11 h-11 rounded-full object-cover border border-base-300"
                @error="handleProfileImageError"
              />
              <h3 class="text-lg font-bold">{{ ownerName }}</h3>
            </div>
            <p class="text-base-content/70">
              Building amazing web experiences with modern technologies
            </p>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-base-content mb-4">Quick Links</h4>
            <ul class="space-y-2">
              <li v-for="item in navItems" :key="item.path">
                <router-link :to="item.path" class="link link-hover text-base-content/70">
                  {{ item.name }}
                </router-link>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-base-content mb-4">Connect</h4>
            <div class="space-y-2 text-base-content/70">
              <p>
                Email:
                <a :href="`mailto:${ownerEmail}`" class="link link-primary">{{ ownerEmail }}</a>
              </p>
            </div>
          </div>
        </div>
        <div class="border-t border-base-300 pt-8">
          <p class="text-base-content/70 text-center">
            © {{ new Date().getFullYear() }} {{ ownerName }}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
