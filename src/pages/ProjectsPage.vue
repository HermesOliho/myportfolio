<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useHead } from '@vueuse/head'
import { useProjectStore } from '@/stores/useProjectStore'
import SectionWrapper from '@/components/layout/SectionWrapper.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import SkeletonCard from '@/components/projects/SkeletonCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const projectStore = useProjectStore()
const currentPage = ref(1)

useHead({
  title: 'Projects - Portfolio',
  meta: [
    {
      name: 'description',
      content: 'Browse all my projects and work',
    },
  ],
})

onMounted(async () => {
  await loadProjects()
})

async function loadProjects(page = 1): Promise<void> {
  currentPage.value = page
  try {
    await projectStore.fetchProjects(page)
  } catch (error) {
    console.error('Error loading projects:', error)
  }
}

async function nextPage(): Promise<void> {
  if (projectStore.pagination && currentPage.value < projectStore.pagination.last_page) {
    await loadProjects(currentPage.value + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

async function prevPage(): Promise<void> {
  if (currentPage.value > 1) {
    await loadProjects(currentPage.value - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <SectionWrapper max-width="xl">
      <PageHeader
        title="All Projects"
        subtitle="Explore my complete portfolio of work"
      />
      
      <div v-if="projectStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonCard v-for="i in 6" :key="i" />
      </div>
      
      <div
        v-else-if="projectStore.projects.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <ProjectCard
          v-for="project in projectStore.projects"
          :key="project.id"
          :project="project"
        />
      </div>
      
      <div v-else class="text-center py-12">
        <p class="text-gray-600">No projects found.</p>
      </div>
      
      <!-- Pagination -->
      <div
        v-if="projectStore.pagination && projectStore.pagination.last_page > 1"
        class="flex justify-center items-center gap-4 mt-8"
      >
        <BaseButton
          variant="outline"
          :disabled="currentPage === 1 || projectStore.loading"
          @click="prevPage"
        >
          Previous
        </BaseButton>
        <span class="text-gray-600">
          Page {{ currentPage }} of {{ projectStore.pagination.last_page }}
        </span>
        <BaseButton
          variant="outline"
          :disabled="currentPage === projectStore.pagination.last_page || projectStore.loading"
          @click="nextPage"
        >
          Next
        </BaseButton>
      </div>
    </SectionWrapper>
  </div>
</template>
