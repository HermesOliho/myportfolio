<script setup lang="ts">
import BaseCard from '@/components/common/BaseCard.vue'
</script>

<template>
  <BaseCard padding="none" :hover="false">
    <div class="animate-pulse">
      <div class="bg-gray-300 h-48 w-full"></div>
      <div class="p-6 space-y-4">
        <div class="h-6 bg-gray-300 rounded w-3/4"></div>
        <div class="space-y-2">
          <div class="h-4 bg-gray-300 rounded"></div>
          <div class="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
        <div class="flex gap-2">
          <div class="h-6 bg-gray-300 rounded w-16"></div>
          <div class="h-6 bg-gray-300 rounded w-16"></div>
          <div class="h-6 bg-gray-300 rounded w-16"></div>
        </div>
        <div class="flex gap-2">
          <div class="h-9 bg-gray-300 rounded w-24"></div>
          <div class="h-9 bg-gray-300 rounded w-24"></div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
