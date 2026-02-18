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
  <BaseCard padding="none" hover>
    <div class="overflow-hidden h-56 bg-linear-to-br from-slate-200 to-slate-300">
      <img
        :src="projectImage"
        :alt="project.title"
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
      />
    </div>
    <div class="p-6">
      <h3 class="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{{ project.title }}</h3>
      <p class="text-slate-600 mb-4 line-clamp-3 text-sm leading-relaxed">
        {{ project.short_description }}
      </p>

      <div class="flex flex-wrap gap-2 mb-5">
        <span
          v-for="tech in project.technologies.slice(0, 3)"
          :key="tech"
          class="px-3 py-1 bg-linear-to-r from-blue-50 to-blue-100 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
        >
          {{ tech }}
        </span>
        <span
          v-if="project.technologies.length > 3"
          class="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full"
        >
          +{{ project.technologies.length - 3 }}
        </span>
      </div>

      <div class="flex gap-3">
        <BaseButton variant="primary" size="sm" @click="$router.push(projectUrl)" class="flex-1">
          View Details
        </BaseButton>
        <BaseButton
          v-if="project.demo_url"
          variant="outline"
          size="sm"
          @click="openDemoUrl"
          class="flex-1"
        >
          Live Demo
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>
