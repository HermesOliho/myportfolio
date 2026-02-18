<script setup lang="ts">
import {
  BicepsFlexed,
  FolderKanban,
  LayoutDashboard,
  MessagesSquare,
  Settings2,
} from 'lucide-vue-next'
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = (path: string): boolean => {
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="hidden sm:ml-8 sm:flex sm:space-x-2 tabs tabs-lift" role="tablist">
    <!-- Dashboard route -->
    <router-link
      key="admin-dashboard"
      :to="{ name: 'admin-dashboard' }"
      :class="['tab bg-base-100', isActive('admin-dashboard') ? 'tab-active' : '']"
    >
      <layout-dashboard class="w-5 h-5 mr-1 text-secondary" />
      Dashboard
    </router-link>
    <!-- Projects  -->
    <router-link
      key="admin-projects"
      :to="{ name: 'admin-projects' }"
      :class="['tab bg-base-100', isActive('admin-projects') ? 'tab-active' : '']"
    >
      <folder-kanban class="w-5 h-5 mr-1 text-secondary" />
      Projects
    </router-link>
    <!-- Skills  -->
    <router-link
      key="admin-skills"
      :to="{ name: 'admin-skills' }"
      :class="['tab bg-base-100', isActive('admin-skills') ? 'tab-active' : '']"
    >
      <biceps-flexed class="w-5 h-5 mr-1 text-secondary" />
      Skills
    </router-link>
    <!-- Messages  -->
    <router-link
      key="admin-messages"
      :to="{ name: 'admin-messages' }"
      :class="['tab bg-base-100', isActive('admin-messages') ? 'tab-active' : '']"
    >
      <messages-square class="w-5 h-5 mr-1 text-secondary" />
      Messages
    </router-link>
    <!-- Settings  -->
    <router-link
      key="admin-settings"
      :to="{ name: 'admin-settings' }"
      :class="['tab bg-base-100', isActive('admin-settings') ? 'tab-active' : '']"
    >
      <settings2 class="w-5 h-5 mr-1 text-secondary" />
      Settings
    </router-link>
  </div>
</template>
