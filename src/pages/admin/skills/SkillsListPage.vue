<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminSkillStore } from '@/stores/admin/useAdminSkillStore'
import DataTable from '@/components/admin/DataTable.vue'
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue'
import type { Skill } from '@/types/Skill'

const router = useRouter()
const skillStore = useAdminSkillStore()

const showDeleteDialog = ref(false)
const skillToDelete = ref<Skill | null>(null)
const currentPage = ref(1)

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'level', label: 'Level' },
  { key: 'display_order', label: 'Order' },
]

onMounted(async () => {
  await loadSkills()
})

const loadSkills = async () => {
  try {
    await skillStore.fetchSkills(currentPage.value, 20)
  } catch (error) {
    console.error('Failed to load skills:', error)
  }
}

const handleEdit = (skill: Skill) => {
  router.push(`/admin/skills/${skill.id}/edit`)
}

const confirmDelete = (skill: Skill) => {
  skillToDelete.value = skill
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!skillToDelete.value) return
  
  try {
    await skillStore.deleteSkill(skillToDelete.value.id)
    showDeleteDialog.value = false
    skillToDelete.value = null
  } catch (error) {
    console.error('Failed to delete skill:', error)
  }
}

const handlePageChange = async (page: number) => {
  currentPage.value = page
  await loadSkills()
}

const hasPrevPage = computed(() => {
  return skillStore.pagination ? skillStore.pagination.current_page > 1 : false
})

const hasNextPage = computed(() => {
  return skillStore.pagination
    ? skillStore.pagination.current_page < skillStore.pagination.last_page
    : false
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Skills</h1>
      <router-link
        to="/admin/skills/create"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <span class="mr-2">➕</span>
        Create Skill
      </router-link>
    </div>

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <DataTable :columns="columns" :data="skillStore.skills" :loading="skillStore.loading">
        <template #cell-category="{ value }">
          <span
            :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              value === 'frontend' ? 'bg-blue-100 text-blue-800' :
              value === 'backend' ? 'bg-green-100 text-green-800' :
              value === 'devops' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            ]"
          >
            {{ value }}
          </span>
        </template>

        <template #cell-level="{ value }">
          <div class="flex items-center">
            <div class="w-24 bg-gray-200 rounded-full h-2">
              <div
                :style="{ width: `${value}%` }"
                class="bg-blue-600 h-2 rounded-full"
              ></div>
            </div>
            <span class="ml-2 text-sm text-gray-600">{{ value }}%</span>
          </div>
        </template>

        <template #actions="{ item }">
          <button
            @click="handleEdit(item)"
            class="text-blue-600 hover:text-blue-900 mr-4"
          >
            Edit
          </button>
          <button
            @click="confirmDelete(item)"
            class="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </template>
      </DataTable>

      <!-- Pagination -->
      <div v-if="skillStore.pagination" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="handlePageChange(currentPage - 1)"
            :disabled="!hasPrevPage"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            @click="handlePageChange(currentPage + 1)"
            :disabled="!hasNextPage"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ skillStore.pagination.from }}</span>
              to
              <span class="font-medium">{{ skillStore.pagination.to }}</span>
              of
              <span class="font-medium">{{ skillStore.pagination.total }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                @click="handlePageChange(currentPage - 1)"
                :disabled="!hasPrevPage"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                @click="handlePageChange(currentPage + 1)"
                :disabled="!hasNextPage"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <ConfirmDialog
      :show="showDeleteDialog"
      title="Delete Skill"
      message="Are you sure you want to delete this skill? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="handleDelete"
      @cancel="showDeleteDialog = false"
    />
  </div>
</template>
