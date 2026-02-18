<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

interface Props {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  visible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 3000,
  visible: false,
})

const emit = defineEmits<{
  close: []
}>()

const show = ref(props.visible)
let timer: number | null = null

const typeClasses = {
  success:
    'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-900 shadow-lg',
  error: 'bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 text-red-900 shadow-lg',
  warning:
    'bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-500 text-yellow-900 shadow-lg',
  info: 'bg-gradient-to-r from-blue-50 to-sky-50 border-l-4 border-blue-500 text-blue-900 shadow-lg',
}

const iconPaths = {
  success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  warning:
    'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}

watch(
  () => props.visible,
  (newVal) => {
    show.value = newVal
    if (newVal && props.duration > 0) {
      startTimer()
    }
  },
)

onMounted(() => {
  if (props.visible && props.duration > 0) {
    startTimer()
  }
})

function startTimer(): void {
  if (timer) clearTimeout(timer)
  timer = window.setTimeout(() => {
    closeToast()
  }, props.duration)
}

function closeToast(): void {
  show.value = false
  emit('close')
}
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="show"
      :class="[
        typeClasses[type],
        'fixed top-4 right-4 z-50 flex items-start gap-3 p-4 rounded-xl max-w-md',
      ]"
    >
      <svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          :d="iconPaths[type]"
        />
      </svg>
      <p class="flex-1 text-sm font-medium">{{ message }}</p>
      <button @click="closeToast" class="shrink-0 hover:opacity-70 transition-opacity">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </Transition>
</template>
