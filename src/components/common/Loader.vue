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
      :class="[sizeClasses[size], 'animate-spin rounded-full border-4 border-gray-200 border-t-blue-600']"
    ></div>
    <p v-if="text" class="text-gray-600">{{ text }}</p>
  </div>
</template>
