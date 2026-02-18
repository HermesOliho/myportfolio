<script setup lang="ts">
import { computed, onMounted } from 'vue'
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
const ownerName = computed(() => settingsStore.settings?.full_name || 'Portfolio Owner')
const ownerPhoto = computed(() => settingsStore.settings?.site_logo || '/profile-placeholder.svg')

function handleProfileImageError(event: Event): void {
  const target = event.target as HTMLImageElement
  target.src = '/profile-placeholder.svg'
}

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
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-20">
        <div class="flex justify-center lg:justify-end order-1 lg:order-2">
          <div class="relative">
            <div
              class="absolute -inset-2 rounded-3xl bg-linear-to-r from-blue-400/30 to-slate-300/40 blur-md"
            ></div>
            <img
              :src="ownerPhoto"
              :alt="ownerName"
              class="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl object-cover border border-slate-200 shadow-2xl"
              @error="handleProfileImageError"
            />
          </div>
        </div>

        <div class="text-center lg:text-left order-2 lg:order-1">
          <p class="text-blue-600 font-semibold mb-3">{{ ownerName }}</p>
          <h1
            class="text-5xl md:text-6xl font-bold bg-linear-to-r from-blue-600 via-blue-700 to-slate-900 bg-clip-text text-transparent mb-6 leading-tight"
          >
            {{ settingsStore.settings?.professional_title || 'Full Stack Developer' }}
          </h1>
          <p class="text-lg md:text-xl text-slate-600 mb-4 leading-relaxed">
            {{
              settingsStore.settings?.short_bio ||
              'Building modern web applications and SaaS products with cutting-edge technologies'
            }}
          </p>
          <div class="flex gap-4 justify-center lg:justify-start mt-8">
            <router-link to="/projects">
              <BaseButton variant="primary" size="lg"> View My Work </BaseButton>
            </router-link>
            <router-link to="/contact">
              <BaseButton variant="outline" size="lg"> Get In Touch </BaseButton>
            </router-link>
          </div>
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
