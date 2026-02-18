<script setup lang="ts">
import { onMounted } from 'vue'
import { useDashboardStore } from '@/stores/admin/useDashboardStore'
import StatsCard from '@/components/admin/StatsCard.vue'

const dashboardStore = useDashboardStore()

onMounted(async () => {
  try {
    await dashboardStore.fetchStats()
  } catch (error) {
    console.error('Failed to load dashboard stats:', error)
  }
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

    <div v-if="dashboardStore.loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">Loading dashboard...</span>
    </div>

    <div v-else-if="dashboardStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-800">{{ dashboardStore.error.message }}</p>
    </div>

    <div v-else-if="dashboardStore.stats" class="grid grid-cols-1 md:grid-cols-3 gap-6">
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

    <div class="mt-8 bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <router-link
          to="/admin/projects/create"
          class="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-colors"
        >
          <span class="text-2xl mr-3">➕</span>
          <div>
            <p class="font-medium text-gray-900">Create New Project</p>
            <p class="text-sm text-gray-600">Add a new project to your portfolio</p>
          </div>
        </router-link>
        <router-link
          to="/admin/skills/create"
          class="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-colors"
        >
          <span class="text-2xl mr-3">✨</span>
          <div>
            <p class="font-medium text-gray-900">Add New Skill</p>
            <p class="text-sm text-gray-600">Add a skill to your profile</p>
          </div>
        </router-link>
        <router-link
          to="/admin/messages"
          class="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-colors"
        >
          <span class="text-2xl mr-3">📧</span>
          <div>
            <p class="font-medium text-gray-900">View Messages</p>
            <p class="text-sm text-gray-600">Check contact form submissions</p>
          </div>
        </router-link>
        <router-link
          to="/admin/settings"
          class="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-colors"
        >
          <span class="text-2xl mr-3">⚙️</span>
          <div>
            <p class="font-medium text-gray-900">Portfolio Settings</p>
            <p class="text-sm text-gray-600">Update your portfolio configuration</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
