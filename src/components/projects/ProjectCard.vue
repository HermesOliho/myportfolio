<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/types/Project'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'

interface Props {
  project: Project
}

const props = defineProps<Props>()

const projectImage = computed(() => {
  return props.project.main_image || '/placeholder-project.jpg'
})

const projectUrl = computed(() => {
  return `/projects/${props.project.slug}`
})

function openDemoUrl(): void {
  if (props.project.demo_url) {
    window.open(props.project.demo_url, '_blank')
  }
}
</script>

<template>
  <BaseCard padding="none">
    <div class="overflow-hidden">
      <img
        :src="projectImage"
        :alt="project.title"
        class="w-full h-48 object-cover"
      />
    </div>
    <div class="p-6">
      <h3 class="text-xl font-bold text-gray-900 mb-2">{{ project.title }}</h3>
      <p class="text-gray-600 mb-4 line-clamp-3">{{ project.short_description }}</p>
      
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tech in project.technologies.slice(0, 3)"
          :key="tech"
          class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
        >
          {{ tech }}
        </span>
        <span
          v-if="project.technologies.length > 3"
          class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
        >
          +{{ project.technologies.length - 3 }} more
        </span>
      </div>
      
      <div class="flex gap-2">
        <BaseButton
          :variant="'primary'"
          size="sm"
          @click="$router.push(projectUrl)"
        >
          View Details
        </BaseButton>
        <BaseButton
          v-if="project.demo_url"
          variant="outline"
          size="sm"
          @click="openDemoUrl"
        >
          Live Demo
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>
