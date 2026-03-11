<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/admin/useAuthStore'
import { useAdminMessageStore } from '@/stores/admin/useAdminMessageStore'
import {
  LayoutDashboard,
  FolderKanban,
  BicepsFlexed,
  Link2,
  MessagesSquare,
  Settings2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const messageStore = useAdminMessageStore()

const collapsed = ref(false)
const isDark = ref(false)

onMounted(async () => {
  collapsed.value = localStorage.getItem('admin-sidebar-collapsed') === 'true'
  isDark.value = localStorage.getItem('admin-theme') === 'dark'
  applyTheme(isDark.value)

  // Load unread message count
  try {
    await messageStore.fetchMessages(1, 5)
  } catch {
    // silently ignore
  }
})

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
  localStorage.setItem('admin-sidebar-collapsed', String(collapsed.value))
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  applyTheme(isDark.value)
  localStorage.setItem('admin-theme', isDark.value ? 'dark' : 'light')
}

const applyTheme = (dark: boolean) => {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'corporate')
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    applyTheme(false)
    router.push('/admin/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const navItems = [
  { name: 'Dashboard', to: { name: 'admin-dashboard' }, icon: LayoutDashboard, match: '/admin/dashboard' },
  { name: 'Projects', to: { name: 'admin-projects' }, icon: FolderKanban, match: '/admin/projects' },
  { name: 'Skills', to: { name: 'admin-skills' }, icon: BicepsFlexed, match: '/admin/skills' },
  { name: 'Social Links', to: { name: 'admin-social-links' }, icon: Link2, match: '/admin/social-links' },
  { name: 'Messages', to: { name: 'admin-messages' }, icon: MessagesSquare, match: '/admin/messages', badge: 'unread' },
  { name: 'Settings', to: { name: 'admin-settings' }, icon: Settings2, match: '/admin/settings' },
]

const unreadCount = computed(() => messageStore.messages.filter((m) => !m.is_read).length)
</script>

<template>
  <aside
    :class="[
      'flex flex-col h-screen bg-base-100 border-r border-base-300 transition-all duration-300 shrink-0',
      collapsed ? 'w-16' : 'w-64',
    ]"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-4 border-b border-base-300 min-h-16">
      <Transition name="fade-slide">
        <span v-if="!collapsed" class="text-lg font-bold text-primary truncate">
          Admin Panel
        </span>
      </Transition>
      <button
        @click="toggleCollapsed"
        class="btn btn-ghost btn-sm btn-circle shrink-0"
        :title="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      >
        <ChevronLeft v-if="!collapsed" class="w-4 h-4" />
        <ChevronRight v-else class="w-4 h-4" />
      </button>
    </div>

    <!-- Nav Items -->
    <nav class="flex-1 py-4 overflow-y-auto overflow-x-hidden">
      <ul class="space-y-1 px-2">
        <li v-for="item in navItems" :key="item.name">
          <router-link
            :to="item.to"
            :class="[
              'flex items-center rounded-lg px-3 py-2.5 transition-colors group',
              collapsed ? 'justify-center' : 'gap-3',
              $route.path.startsWith(item.match)
                ? 'bg-primary text-primary-content'
                : 'hover:bg-base-200 text-base-content',
            ]"
            :title="collapsed ? item.name : undefined"
          >
            <div class="relative shrink-0">
              <component :is="item.icon" class="w-5 h-5" />
              <span
                v-if="item.badge === 'unread' && unreadCount > 0"
                class="absolute -top-1.5 -right-1.5 badge badge-error badge-xs text-xs"
              >
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </div>
            <Transition name="fade-slide">
              <span v-if="!collapsed" class="text-sm font-medium truncate">{{ item.name }}</span>
            </Transition>
            <Transition name="fade-slide">
              <span
                v-if="!collapsed && item.badge === 'unread' && unreadCount > 0"
                class="badge badge-error badge-sm ml-auto"
              >
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </Transition>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Footer -->
    <div class="border-t border-base-300 py-3 px-2 space-y-1">
      <!-- Theme Toggle -->
      <button
        @click="toggleTheme"
        :class="[
          'flex items-center rounded-lg px-3 py-2.5 w-full transition-colors hover:bg-base-200',
          collapsed ? 'justify-center' : 'gap-3',
        ]"
        :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <Moon v-if="!isDark" class="w-5 h-5 shrink-0" />
        <Sun v-else class="w-5 h-5 shrink-0" />
        <Transition name="fade-slide">
          <span v-if="!collapsed" class="text-sm font-medium">
            {{ isDark ? 'Light Mode' : 'Dark Mode' }}
          </span>
        </Transition>
      </button>

      <!-- User info -->
      <div
        v-if="!collapsed"
        class="flex items-center gap-3 px-3 py-2 rounded-lg bg-base-200"
      >
        <div class="avatar placeholder shrink-0">
          <div class="bg-primary text-primary-content rounded-full w-8">
            <span class="text-xs font-bold">{{ authStore.user?.name?.[0]?.toUpperCase() ?? 'A' }}</span>
          </div>
        </div>
        <div class="min-w-0">
          <p class="text-sm font-medium truncate">{{ authStore.user?.name ?? 'Admin' }}</p>
          <p class="text-xs text-base-content/60 truncate">{{ authStore.user?.email }}</p>
        </div>
      </div>

      <!-- Logout -->
      <button
        @click="handleLogout"
        :class="[
          'flex items-center rounded-lg px-3 py-2.5 w-full text-error transition-colors hover:bg-error/10',
          collapsed ? 'justify-center' : 'gap-3',
        ]"
        title="Logout"
      >
        <LogOut class="w-5 h-5 shrink-0" />
        <Transition name="fade-slide">
          <span v-if="!collapsed" class="text-sm font-medium">Logout</span>
        </Transition>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>
