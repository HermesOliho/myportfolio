<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import { CheckCircle, Info, TriangleAlert, XCircle, X } from 'lucide-vue-next'

const { toasts, removeToast } = useToast()

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: TriangleAlert,
  info: Info,
}

const alertClasses = {
  success: 'alert-success',
  error: 'alert-error',
  warning: 'alert-warning',
  info: 'alert-info',
}
</script>

<template>
  <Teleport to="body">
    <div class="toast toast-end toast-bottom z-[9999] max-w-sm w-full">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['alert shadow-lg', alertClasses[toast.type]]"
        >
          <component :is="icons[toast.type]" class="w-5 h-5 shrink-0" />
          <span class="text-sm">{{ toast.message }}</span>
          <button class="btn btn-ghost btn-xs btn-circle ml-auto" @click="removeToast(toast.id)">
            <X class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
