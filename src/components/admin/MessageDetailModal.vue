<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '@/types/Message'
import { X, Mail, User, Calendar, Tag, MailOpen } from 'lucide-vue-next'

interface Props {
  message: Message | null
  show: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  markAsRead: [message: Message]
  delete: [message: Message]
  reply: [message: Message]
}>()

const formattedDate = computed(() => {
  if (!props.message) return ''
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(props.message.created_at))
})

const relativeDate = computed(() => {
  if (!props.message) return ''
  const diff = Date.now() - new Date(props.message.created_at).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} minute${mins > 1 ? 's' : ''} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`
  return formattedDate.value
})

const replyMailto = computed(() => {
  if (!props.message) return ''
  const subject = encodeURIComponent(`Re: ${props.message.subject}`)
  return `mailto:${props.message.email}?subject=${subject}`
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show && message"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="emit('close')" />

        <!-- Modal -->
        <div class="relative z-10 w-full max-w-2xl bg-base-100 rounded-2xl shadow-2xl overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-base-300 bg-base-200">
            <div class="flex items-center gap-2">
              <span
                :class="[
                  'badge badge-sm',
                  message.is_read ? 'badge-ghost' : 'badge-warning',
                ]"
              >
                {{ message.is_read ? 'Read' : 'Unread' }}
              </span>
              <h2 class="text-lg font-semibold truncate max-w-sm">{{ message.subject }}</h2>
            </div>
            <button class="btn btn-ghost btn-sm btn-circle" @click="emit('close')">
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Metadata -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 px-6 py-4 bg-base-50 border-b border-base-300 text-sm">
            <div class="flex items-center gap-2 text-base-content/70">
              <User class="w-4 h-4 shrink-0 text-primary" />
              <span class="font-medium">{{ message.name }}</span>
            </div>
            <div class="flex items-center gap-2 text-base-content/70">
              <Mail class="w-4 h-4 shrink-0 text-primary" />
              <a :href="`mailto:${message.email}`" class="link link-hover truncate">
                {{ message.email }}
              </a>
            </div>
            <div class="flex items-center gap-2 text-base-content/70">
              <Tag class="w-4 h-4 shrink-0 text-primary" />
              <span>{{ message.subject }}</span>
            </div>
            <div class="flex items-center gap-2 text-base-content/70">
              <Calendar class="w-4 h-4 shrink-0 text-primary" />
              <span :title="formattedDate">{{ relativeDate }}</span>
            </div>
          </div>

          <!-- Body -->
          <div class="px-6 py-5 max-h-80 overflow-y-auto">
            <p class="text-base-content whitespace-pre-wrap leading-relaxed">{{ message.message }}</p>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-base-300 bg-base-200">
            <div class="flex gap-2">
              <a
                :href="replyMailto"
                class="btn btn-primary btn-sm gap-2"
                @click="emit('reply', message)"
              >
                <Mail class="w-4 h-4" />
                Reply
              </a>
              <button
                v-if="!message.is_read"
                class="btn btn-outline btn-sm gap-2"
                @click="emit('markAsRead', message)"
              >
                <MailOpen class="w-4 h-4" />
                Mark as Read
              </button>
            </div>
            <button
              class="btn btn-error btn-outline btn-sm gap-2"
              @click="emit('delete', message)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative {
  transform: scale(0.95) translateY(-10px);
}

.modal-leave-to .relative {
  transform: scale(0.95) translateY(-10px);
}
</style>
