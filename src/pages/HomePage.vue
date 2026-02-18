<script setup lang="ts">
import { onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import { useProjectStore } from '@/stores/useProjectStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import SectionWrapper from '@/components/layout/SectionWrapper.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import SkeletonCard from '@/components/projects/SkeletonCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'

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
    await Promise.all([projectStore.fetchFeaturedProjects(3), settingsStore.fetchSettings()])
  } catch (error) {
    console.error('Error loading home page:', error)
  }
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <SectionWrapper spacing="lg" max-width="4xl">
      <div class="text-center py-20">
        <h1
          class="text-6xl md:text-7xl font-bold bg-linear-to-r from-blue-600 via-blue-700 to-slate-900 bg-clip-text text-transparent mb-6 leading-tight"
        >
          {{ settingsStore.settings?.professional_title || 'Full Stack Developer' }}
        </h1>
        <p class="text-xl md:text-2xl text-slate-600 mb-4 max-w-3xl mx-auto leading-relaxed">
          {{
            settingsStore.settings?.short_bio ||
            'Building modern web applications and SaaS products with cutting-edge technologies'
          }}
        </p>
        <div class="flex gap-4 justify-center mt-8">
          <router-link to="/projects">
            <BaseButton variant="primary" size="lg"> View My Work </BaseButton>
          </router-link>
          <router-link to="/contact">
            <BaseButton variant="outline" size="lg"> Get In Touch </BaseButton>
          </router-link>
        </div>
      </div>
    </SectionWrapper>

    <!-- Featured Projects Section -->
    <div class="bg-linear-to-b from-slate-50 to-white py-20">
      <SectionWrapper max-width="4xl">
        <PageHeader title="Featured Work" subtitle="A selection of projects I'm proud of" />

        <div
          v-if="projectStore.loading"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
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
          <p class="text-slate-600 text-lg">No featured projects available yet.</p>
        </div>

        <div v-if="projectStore.error" class="text-center py-12">
          <p class="text-red-600 text-lg">{{ projectStore.error.message }}</p>
        </div>

        <div class="flex justify-center mt-12">
          <router-link to="/projects">
            <BaseButton variant="outline" size="lg"> View All Projects → </BaseButton>
          </router-link>
        </div>
      </SectionWrapper>
    </div>
  </div>
</template>
