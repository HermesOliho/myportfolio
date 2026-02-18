<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  text: 'Loading...',
})

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
}
</script>

<template>
  <div class="flex flex-col items-center justify-center space-y-4">
    <div
      :class="[
        sizeClasses[size],
        'animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 shadow-lg',
      ]"
    ></div>
    <p v-if="text" class="text-slate-600 font-medium text-lg">{{ text }}</p>
  </div>
</template>
