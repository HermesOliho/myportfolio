<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdminMessageStore } from '@/stores/admin/useAdminMessageStore'
import { useToast } from '@/composables/useToast'
import MessageDetailModal from '@/components/admin/MessageDetailModal.vue'
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue'
import type { Message } from '@/types/Message'
import { Mail, MailOpen, Trash2, Eye, Inbox } from 'lucide-vue-next'

const messageStore = useAdminMessageStore()
const toast = useToast()

const currentPage = ref(1)
const filter = ref<'all' | 'read' | 'unread'>('all')
const selectedMessage = ref<Message | null>(null)
const showModal = ref(false)
const messageToDelete = ref<Message | null>(null)
const showDeleteConfirm = ref(false)

const filteredMessages = computed(() => {
  if (filter.value === 'read') return messageStore.messages.filter((m) => m.is_read)
  if (filter.value === 'unread') return messageStore.messages.filter((m) => !m.is_read)
  return messageStore.messages
})

onMounted(async () => {
  await loadMessages()
})

const loadMessages = async () => {
  try {
    await messageStore.fetchMessages(currentPage.value, 10)
  } catch {
    toast.error('Failed to load messages.')
  }
}

const openMessage = async (message: Message) => {
  selectedMessage.value = message
  showModal.value = true
  if (!message.is_read) {
    await handleMarkAsRead(message)
  }
}

const handleMarkAsRead = async (message: Message) => {
  try {
    await messageStore.markAsRead(message.id)
    toast.success('Message marked as read.')
  } catch {
    toast.error('Failed to mark message as read.')
  }
}

const confirmDelete = (message: Message) => {
  messageToDelete.value = message
  showDeleteConfirm.value = true
  showModal.value = false
}

const handleDeleteConfirmed = async () => {
  if (!messageToDelete.value) return
  showDeleteConfirm.value = false
  try {
    await messageStore.deleteMessage(messageToDelete.value.id)
    toast.success('Message deleted successfully.')
  } catch {
    toast.error('Failed to delete message.')
  } finally {
    messageToDelete.value = null
  }
}

const handlePageChange = async (page: number) => {
  currentPage.value = page
  await loadMessages()
}

const formatDate = (dateString: string) => {
  const diff = Date.now() - new Date(dateString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateString).toLocaleDateString()
}

const unreadCount = computed(() => messageStore.messages.filter((m) => !m.is_read).length)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold">Messages</h1>
        <p v-if="unreadCount > 0" class="text-sm text-base-content/60 mt-1">
          {{ unreadCount }} unread message{{ unreadCount > 1 ? 's' : '' }}
        </p>
      </div>

      <!-- Filters -->
      <div class="join">
        <button
          v-for="f in (['all', 'unread', 'read'] as const)"
          :key="f"
          :class="['btn btn-sm join-item capitalize', filter === f ? 'btn-primary' : 'btn-outline']"
          @click="filter = f"
        >
          {{ f }}
          <span v-if="f === 'unread' && unreadCount > 0" class="badge badge-error badge-sm ml-1">
            {{ unreadCount }}
          </span>
        </button>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="messageStore.loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="skeleton h-16 w-full rounded-xl" />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredMessages.length === 0"
      class="card bg-base-100 shadow flex flex-col items-center justify-center py-16 gap-4"
    >
      <Inbox class="w-12 h-12 text-base-content/30" />
      <p class="text-base-content/50 text-lg">No messages found</p>
    </div>

    <!-- Messages List -->
    <div v-else class="space-y-2">
      <div
        v-for="message in filteredMessages"
        :key="message.id"
        :class="[
          'card bg-base-100 shadow-sm border transition-all cursor-pointer',
          message.is_read
            ? 'border-base-300 opacity-80 hover:opacity-100'
            : 'border-primary/30 bg-primary/5 hover:bg-primary/10',
        ]"
        @click="openMessage(message)"
      >
        <div class="card-body py-4 px-5">
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-3 min-w-0">
              <div
                :class="[
                  'rounded-full p-2 shrink-0',
                  message.is_read ? 'bg-base-200' : 'bg-primary/20',
                ]"
              >
                <MailOpen v-if="message.is_read" class="w-4 h-4 text-base-content/50" />
                <Mail v-else class="w-4 h-4 text-primary" />
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-semibold text-sm">{{ message.name }}</span>
                  <span class="text-xs text-base-content/50">{{ message.email }}</span>
                  <span v-if="!message.is_read" class="badge badge-warning badge-xs">New</span>
                </div>
                <p class="text-sm font-medium truncate">{{ message.subject }}</p>
                <p class="text-xs text-base-content/60 truncate max-w-md">{{ message.message }}</p>
              </div>
            </div>
            <div class="flex flex-col items-end gap-2 shrink-0">
              <span class="text-xs text-base-content/50 whitespace-nowrap">
                {{ formatDate(message.created_at) }}
              </span>
              <div class="flex gap-1" @click.stop>
                <button
                  v-if="!message.is_read"
                  class="btn btn-ghost btn-xs"
                  title="Mark as read"
                  @click="handleMarkAsRead(message)"
                >
                  <MailOpen class="w-3.5 h-3.5" />
                </button>
                <button
                  class="btn btn-ghost btn-xs"
                  title="View message"
                  @click="openMessage(message)"
                >
                  <Eye class="w-3.5 h-3.5" />
                </button>
                <button
                  class="btn btn-ghost btn-xs text-error"
                  title="Delete"
                  @click="confirmDelete(message)"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="messageStore.pagination && messageStore.pagination.last_page > 1"
      class="flex justify-center mt-6"
    >
      <div class="join">
        <button
          class="join-item btn btn-sm"
          :disabled="messageStore.pagination.current_page <= 1"
          @click="handlePageChange(currentPage - 1)"
        >
          «
        </button>
        <button class="join-item btn btn-sm btn-active">
          Page {{ messageStore.pagination.current_page }} / {{ messageStore.pagination.last_page }}
        </button>
        <button
          class="join-item btn btn-sm"
          :disabled="messageStore.pagination.current_page >= messageStore.pagination.last_page"
          @click="handlePageChange(currentPage + 1)"
        >
          »
        </button>
      </div>
    </div>

    <!-- Detail Modal -->
    <MessageDetailModal
      :message="selectedMessage"
      :show="showModal"
      @close="showModal = false"
      @markAsRead="handleMarkAsRead"
      @delete="confirmDelete"
    />

    <!-- Delete Confirm Dialog -->
    <ConfirmDialog
      :show="showDeleteConfirm"
      title="Delete Message"
      :message="`Are you sure you want to delete the message from ${messageToDelete?.name}? This action cannot be undone.`"
      confirm-text="Delete"
      confirm-variant="danger"
      @confirm="handleDeleteConfirmed"
      @cancel="showDeleteConfirm = false; messageToDelete = null"
    />
  </div>
</template>
