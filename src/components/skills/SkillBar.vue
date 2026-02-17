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
  if (props.skill.level >= 80) return 'bg-green-500'
  if (props.skill.level >= 60) return 'bg-blue-500'
  if (props.skill.level >= 40) return 'bg-yellow-500'
  return 'bg-gray-500'
})
</script>

<template>
  <div class="mb-4">
    <div v-if="showLabel" class="flex justify-between mb-2">
      <span class="text-sm font-medium text-gray-700">{{ skill.name }}</span>
      <span class="text-sm text-gray-600">{{ skill.level }}%</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2.5">
      <div
        :class="[levelColor, 'h-2.5 rounded-full transition-all duration-500']"
        :style="{ width: `${levelPercentage}%` }"
      ></div>
    </div>
    <p v-if="skill.description" class="mt-2 text-sm text-gray-600">
      {{ skill.description }}
    </p>
  </div>
</template>
