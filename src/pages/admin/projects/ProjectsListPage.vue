<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminProjectStore } from '@/stores/admin/useAdminProjectStore'
import DataTable from '@/components/admin/DataTable.vue'
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue'
import type { Project } from '@/types/Project'

const router = useRouter()
const projectStore = useAdminProjectStore()

const showDeleteDialog = ref(false)
const projectToDelete = ref<Project | null>(null)
const currentPage = ref(1)

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'status', label: 'Status' },
  { key: 'technologies', label: 'Technologies' },
  { key: 'created_at', label: 'Created' },
]

onMounted(async () => {
  await loadProjects()
})

const loadProjects = async () => {
  try {
    await projectStore.fetchProjects(currentPage.value, 10)
  } catch (error) {
    console.error('Failed to load projects:', error)
  }
}

const handleEdit = (project: Project) => {
  router.push(`/admin/projects/${project.id}/edit`)
}

const confirmDelete = (project: Project) => {
  projectToDelete.value = project
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!projectToDelete.value) return
  
  try {
    await projectStore.deleteProject(projectToDelete.value.id)
    showDeleteDialog.value = false
    projectToDelete.value = null
  } catch (error) {
    console.error('Failed to delete project:', error)
  }
}

const handlePageChange = async (page: number) => {
  currentPage.value = page
  await loadProjects()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const hasPrevPage = computed(() => {
  return projectStore.pagination ? projectStore.pagination.current_page > 1 : false
})

const hasNextPage = computed(() => {
  return projectStore.pagination
    ? projectStore.pagination.current_page < projectStore.pagination.last_page
    : false
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Projects</h1>
      <router-link
        to="/admin/projects/create"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <span class="mr-2">➕</span>
        Create Project
      </router-link>
    </div>

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <DataTable :columns="columns" :data="projectStore.projects" :loading="projectStore.loading">
        <template #cell-status="{ value }">
          <span
            :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              value === 'published'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            ]"
          >
            {{ value }}
          </span>
        </template>

        <template #cell-technologies="{ value }">
          <div class="flex flex-wrap gap-1">
            <span
              v-for="tech in (value as string[]).slice(0, 3)"
              :key="tech"
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
            >
              {{ tech }}
            </span>
            <span v-if="(value as string[]).length > 3" class="text-xs text-gray-500">
              +{{ (value as string[]).length - 3 }} more
            </span>
          </div>
        </template>

        <template #cell-created_at="{ value }">
          {{ formatDate(value as string) }}
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
      <div v-if="projectStore.pagination" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
              <span class="font-medium">{{ projectStore.pagination.from }}</span>
              to
              <span class="font-medium">{{ projectStore.pagination.to }}</span>
              of
              <span class="font-medium">{{ projectStore.pagination.total }}</span>
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
      title="Delete Project"
      message="Are you sure you want to delete this project? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="handleDelete"
      @cancel="showDeleteDialog = false"
    />
  </div>
</template>
