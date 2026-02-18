<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminMessageStore } from '@/stores/admin/useAdminMessageStore'
import DataTable from '@/components/admin/DataTable.vue'
import type { Message } from '@/types/Message'

const messageStore = useAdminMessageStore()

const currentPage = ref(1)

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'subject', label: 'Subject' },
  { key: 'is_read', label: 'Status' },
  { key: 'created_at', label: 'Created' },
]

onMounted(async () => {
  await loadMessages()
})

const loadMessages = async () => {
  try {
    await messageStore.fetchMessages(currentPage.value, 10)
  } catch (error) {
    console.error('Failed to load messages:', error)
  }
}

const handleMarkAsRead = async (message: Message) => {
  try {
    await messageStore.markAsRead(message.id)
  } catch (error) {
    console.error('Failed to mark message as read:', error)
  }
}

const handlePageChange = async (page: number) => {
  currentPage.value = page
  await loadMessages()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Messages</h1>
    </div>

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <DataTable :columns="columns" :data="messageStore.messages" :loading="messageStore.loading">
        <template #cell-is_read="{ value }">
          <span
            :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              value
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            ]"
          >
            {{ value ? 'Read' : 'Unread' }}
          </span>
        </template>

        <template #cell-created_at="{ value }">
          {{ formatDate(value) }}
        </template>

        <template #actions="{ item }">
          <button
            v-if="!item.is_read"
            @click="handleMarkAsRead(item)"
            class="text-blue-600 hover:text-blue-900"
          >
            Mark as Read
          </button>
        </template>
      </DataTable>

      <!-- Pagination -->
      <div v-if="messageStore.pagination" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="handlePageChange(currentPage - 1)"
            :disabled="messageStore.pagination.current_page <= 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            @click="handlePageChange(currentPage + 1)"
            :disabled="messageStore.pagination.current_page >= messageStore.pagination.last_page"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ messageStore.pagination.from }}</span>
              to
              <span class="font-medium">{{ messageStore.pagination.to }}</span>
              of
              <span class="font-medium">{{ messageStore.pagination.total }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                @click="handlePageChange(currentPage - 1)"
                :disabled="messageStore.pagination.current_page <= 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                @click="handlePageChange(currentPage + 1)"
                :disabled="messageStore.pagination.current_page >= messageStore.pagination.last_page"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
