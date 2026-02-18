<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <div class="mb-12 text-center">
    <h2
      class="text-5xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4"
    >
      {{ title }}
    </h2>
    <p v-if="subtitle" class="text-xl text-slate-600 max-w-2xl mx-auto">
      {{ subtitle }}
    </p>
  </div>
</template>
