<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/admin/useDashboardStore'
import { useAdminMessageStore } from '@/stores/admin/useAdminMessageStore'
import StatsCard from '@/components/admin/StatsCard.vue'
import { FolderKanban, BicepsFlexed, Mail, MailOpen, Plus, Settings2, Link2 } from 'lucide-vue-next'

const dashboardStore = useDashboardStore()
const messageStore = useAdminMessageStore()

onMounted(async () => {
  try {
    await Promise.all([
      dashboardStore.fetchStats(),
      messageStore.fetchMessages(1, 5),
    ])
  } catch (error) {
    console.error('Failed to load dashboard:', error)
  }
})

const recentMessages = computed(() => messageStore.messages.slice(0, 5))

const formatDate = (dateString: string) => {
  const diff = Date.now() - new Date(dateString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const quickActions = [
  { label: 'New Project', to: { name: 'admin-projects-create' }, icon: FolderKanban, desc: 'Add a new project to your portfolio' },
  { label: 'Add Skill', to: { name: 'admin-skills-create' }, icon: BicepsFlexed, desc: 'Add a skill to your profile' },
  { label: 'Messages', to: { name: 'admin-messages' }, icon: Mail, desc: 'Check contact form submissions' },
  { label: 'Settings', to: { name: 'admin-settings' }, icon: Settings2, desc: 'Update your portfolio configuration' },
  { label: 'Social Links', to: { name: 'admin-social-links-create' }, icon: Link2, desc: 'Add a social link' },
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-bold">Dashboard</h1>
      <p class="text-base-content/60 mt-1">Welcome back! Here's what's happening.</p>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="dashboardStore.loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="skeleton h-32 rounded-xl" />
    </div>

    <!-- Error -->
    <div v-else-if="dashboardStore.error" class="alert alert-error">
      <p>{{ dashboardStore.error.message }}</p>
    </div>

    <!-- Stats -->
    <div v-else-if="dashboardStore.stats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatsCard
        title="Total Projects"
        :value="dashboardStore.stats.total_projects"
        icon="💼"
        color="blue"
      />
      <StatsCard
        title="Total Skills"
        :value="dashboardStore.stats.total_skills"
        icon="🛠️"
        color="green"
      />
      <StatsCard
        title="Unread Messages"
        :value="dashboardStore.stats.unread_messages"
        icon="📧"
        color="orange"
      />
    </div>

    <!-- Quick Actions -->
    <div class="card bg-base-100 shadow">
      <div class="card-body">
        <h2 class="card-title text-xl mb-4 flex items-center gap-2">
          <Plus class="w-5 h-5 text-primary" />
          Quick Actions
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <router-link
            v-for="action in quickActions"
            :key="action.label"
            :to="action.to"
            class="flex items-center gap-3 p-4 rounded-xl border border-base-300 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div class="bg-primary/10 rounded-lg p-2 group-hover:bg-primary/20 transition-colors">
              <component :is="action.icon" class="w-5 h-5 text-primary" />
            </div>
            <div>
              <p class="font-semibold text-sm">{{ action.label }}</p>
              <p class="text-xs text-base-content/60">{{ action.desc }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Recent Messages -->
    <div class="card bg-base-100 shadow">
      <div class="card-body">
        <div class="flex items-center justify-between mb-4">
          <h2 class="card-title text-xl flex items-center gap-2">
            <Mail class="w-5 h-5 text-primary" />
            Recent Messages
          </h2>
          <router-link to="/admin/messages" class="btn btn-ghost btn-xs">View all →</router-link>
        </div>

        <div v-if="messageStore.loading" class="space-y-2">
          <div v-for="i in 3" :key="i" class="skeleton h-12 w-full rounded-lg" />
        </div>

        <div v-else-if="recentMessages.length === 0" class="text-center py-6 text-base-content/50">
          No messages yet.
        </div>

        <div v-else class="space-y-2">
          <router-link
            v-for="msg in recentMessages"
            :key="msg.id"
            to="/admin/messages"
            :class="[
              'flex items-center gap-3 p-3 rounded-lg transition-colors',
              msg.is_read ? 'hover:bg-base-200' : 'bg-primary/5 hover:bg-primary/10',
            ]"
          >
            <div :class="['rounded-full p-1.5', msg.is_read ? 'bg-base-200' : 'bg-primary/20']">
              <MailOpen v-if="msg.is_read" class="w-3.5 h-3.5 text-base-content/50" />
              <Mail v-else class="w-3.5 h-3.5 text-primary" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="text-sm font-medium">{{ msg.name }}</span>
                <span v-if="!msg.is_read" class="badge badge-warning badge-xs">New</span>
              </div>
              <p class="text-xs text-base-content/60 truncate">{{ msg.subject }}</p>
            </div>
            <span class="text-xs text-base-content/40 shrink-0">
              {{ formatDate(msg.created_at) }}
            </span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
