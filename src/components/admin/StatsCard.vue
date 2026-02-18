<script setup lang="ts">
interface Props {
  title: string
  value: number | string
  icon?: string
  color?: 'blue' | 'green' | 'purple' | 'orange'
}

withDefaults(defineProps<Props>(), {
  color: 'blue',
})

const colorClasses = {
  blue: 'bg-linear-to-br from-blue-50 to-blue-100 text-blue-600',
  green: 'bg-linear-to-br from-green-50 to-emerald-100 text-green-600',
  purple: 'bg-linear-to-br from-purple-50 to-violet-100 text-purple-600',
  orange: 'bg-linear-to-br from-orange-50 to-amber-100 text-orange-600',
}
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-lg border border-slate-200/50 p-6 hover:shadow-2xl transition-all duration-300"
  >
    <div class="flex items-center">
      <div v-if="icon" :class="['shrink-0 rounded-xl p-3', colorClasses[color]]">
        <span class="text-3xl">{{ icon }}</span>
      </div>
      <div :class="icon ? 'ml-4' : ''">
        <p class="text-sm font-semibold text-slate-600 uppercase tracking-wide">{{ title }}</p>
        <p class="text-3xl font-bold text-slate-900 mt-2">{{ value }}</p>
      </div>
    </div>
  </div>
</template>
