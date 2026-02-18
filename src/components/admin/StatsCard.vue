<script setup lang="ts">
interface Props {
  title: string
  value: number | string
  icon?: string
  color?: 'blue' | 'green' | 'purple' | 'orange'
}

withDefaults(defineProps<Props>(), {
  color: 'blue'
})

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6 border border-gray-200">
    <div class="flex items-center">
      <div v-if="icon" :class="['flex-shrink-0 rounded-lg p-3', colorClasses[color]]">
        <span class="text-2xl">{{ icon }}</span>
      </div>
      <div :class="icon ? 'ml-4' : ''">
        <p class="text-sm font-medium text-gray-600">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ value }}</p>
      </div>
    </div>
  </div>
</template>
