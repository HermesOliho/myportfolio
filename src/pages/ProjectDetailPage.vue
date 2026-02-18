<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { useProjectStore } from '@/stores/useProjectStore'
import SectionWrapper from '@/components/layout/SectionWrapper.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import Loader from '@/components/common/Loader.vue'

const route = useRoute()
const projectStore = useProjectStore()

const slug = computed(() => route.params.slug as string)

useHead({
  title: computed(() => projectStore.currentProject?.title || 'Project'),
  meta: computed(() => [
    {
      name: 'description',
      content: projectStore.currentProject?.meta_description || projectStore.currentProject?.short_description || '',
    },
  ]),
})

onMounted(async () => {
  try {
    await projectStore.fetchProjectBySlug(slug.value)
  } catch (error) {
    console.error('Error loading project:', error)
  }
})

function openUrl(url: string | undefined): void {
  if (url) {
    window.open(url, '_blank')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <SectionWrapper max-width="2xl">
      <div v-if="projectStore.loading" class="flex justify-center py-12">
        <Loader text="Loading project..." />
      </div>
      
      <div v-else-if="projectStore.currentProject" class="space-y-8">
        <!-- Header -->
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {{ projectStore.currentProject.title }}
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            {{ projectStore.currentProject.short_description }}
          </p>
        </div>
        
        <!-- Main Image -->
        <div class="overflow-hidden rounded-lg shadow-lg">
          <img
            :src="projectStore.currentProject.main_image"
            :alt="projectStore.currentProject.title"
            class="w-full h-auto"
          />
        </div>
        
        <!-- Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2">
            <BaseCard>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">About This Project</h2>
              <div class="prose max-w-none text-gray-700" v-html="projectStore.currentProject.long_description"></div>
            </BaseCard>
          </div>
          
          <!-- Sidebar -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Technologies -->
            <BaseCard>
              <h3 class="text-xl font-bold text-gray-900 mb-4">Technologies Used</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tech in projectStore.currentProject.technologies"
                  :key="tech"
                  class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {{ tech }}
                </span>
              </div>
            </BaseCard>
            
            <!-- Links -->
            <BaseCard>
              <h3 class="text-xl font-bold text-gray-900 mb-4">Links</h3>
              <div class="space-y-3">
                <BaseButton
                  v-if="projectStore.currentProject.demo_url"
                  variant="primary"
                  class="w-full"
                  @click="openUrl(projectStore.currentProject.demo_url)"
                >
                  View Live Demo
                </BaseButton>
                <BaseButton
                  v-if="projectStore.currentProject.github_url"
                  variant="outline"
                  class="w-full"
                  @click="openUrl(projectStore.currentProject.github_url)"
                >
                  View on GitHub
                </BaseButton>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>
      
      <div v-else-if="projectStore.error" class="text-center py-12">
        <p class="text-red-600 text-lg mb-4">{{ projectStore.error.message }}</p>
        <BaseButton variant="primary" @click="$router.push('/projects')">
          Back to Projects
        </BaseButton>
      </div>
    </SectionWrapper>
  </div>
</template>
