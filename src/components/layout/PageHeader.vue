<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <div class="mb-8 text-center">
    <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ title }}</h1>
    <p v-if="subtitle" class="text-xl text-gray-600">{{ subtitle }}</p>
  </div>
</template>
