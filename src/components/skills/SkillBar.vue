<script setup lang="ts">
import { computed } from 'vue'
import type { Skill } from '@/types/Skill'

interface Props {
  skill: Skill
  showLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showLabel: true,
})

const levelPercentage = computed(() => {
  return Math.min(Math.max(props.skill.level, 0), 100)
})

const levelColor = computed(() => {
  if (props.skill.level >= 80) return 'bg-linear-to-r from-emerald-500 to-green-500'
  if (props.skill.level >= 60) return 'bg-linear-to-r from-blue-500 to-cyan-500'
  if (props.skill.level >= 40) return 'bg-linear-to-r from-yellow-500 to-amber-500'
  return 'bg-linear-to-r from-slate-500 to-slate-600'
})
</script>

<template>
  <div class="mb-6">
    <div v-if="showLabel" class="flex justify-between items-center mb-2">
      <span class="text-sm font-semibold text-slate-900">{{ skill.name }}</span>
      <span class="text-sm font-semibold text-blue-600">{{ skill.level }}%</span>
    </div>
    <div class="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-sm">
      <div
        :class="[levelColor, 'h-3 rounded-full transition-all duration-700 shadow-md']"
        :style="{ width: `${levelPercentage}%` }"
      ></div>
    </div>
    <p v-if="skill.description" class="mt-2 text-sm text-slate-600 leading-relaxed">
      {{ skill.description }}
    </p>
  </div>
</template>
