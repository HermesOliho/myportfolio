<script setup lang="ts">
import { onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import { useProjectStore } from '@/stores/useProjectStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import SectionWrapper from '@/components/layout/SectionWrapper.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import SkeletonCard from '@/components/projects/SkeletonCard.vue'

const projectStore = useProjectStore()
const settingsStore = useSettingsStore()

useHead({
  title: 'Home - Portfolio',
  meta: [
    {
      name: 'description',
      content: 'Professional Full Stack Developer Portfolio',
    },
  ],
})

onMounted(async () => {
  try {
    await Promise.all([
      projectStore.fetchFeaturedProjects(3),
      settingsStore.fetchSettings(),
    ])
  } catch (error) {
    console.error('Error loading home page:', error)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <SectionWrapper spacing="lg" max-width="2xl">
      <div class="text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Full Stack Developer
        </h1>
        <p class="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Building modern web applications and SaaS products with cutting-edge technologies
        </p>
      </div>
    </SectionWrapper>

    <!-- Featured Projects Section -->
    <SectionWrapper max-width="xl">
      <PageHeader
        title="Featured Projects"
        subtitle="Check out some of my latest work"
      />
      
      <div v-if="projectStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonCard v-for="i in 3" :key="i" />
      </div>
      
      <div
        v-else-if="projectStore.featuredProjects.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <ProjectCard
          v-for="project in projectStore.featuredProjects"
          :key="project.id"
          :project="project"
        />
      </div>
      
      <div v-else class="text-center py-12">
        <p class="text-gray-600">No featured projects available.</p>
      </div>
      
      <div v-if="projectStore.error" class="text-center py-12">
        <p class="text-red-600 text-lg">{{ projectStore.error.message }}</p>
      </div>
    </SectionWrapper>
  </div>
</template>
