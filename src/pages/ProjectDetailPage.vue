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
      content:
        projectStore.currentProject?.meta_description ||
        projectStore.currentProject?.short_description ||
        '',
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
  <div class="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50">
    <SectionWrapper max-width="4xl">
      <div v-if="projectStore.loading" class="flex justify-center py-20">
        <Loader text="Loading project..." />
      </div>

      <div v-else-if="projectStore.currentProject" class="space-y-12">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1
            class="text-5xl md:text-6xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4 leading-tight"
          >
            {{ projectStore.currentProject.title }}
          </h1>
          <p class="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {{ projectStore.currentProject.short_description }}
          </p>
        </div>

        <!-- Main Image -->
        <div class="overflow-hidden rounded-2xl shadow-2xl">
          <img
            :src="projectStore.currentProject.main_image"
            :alt="projectStore.currentProject.title"
            class="w-full h-auto hover:scale-105 transition-transform duration-300"
          />
        </div>

        <!-- Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2">
            <BaseCard>
              <h2 class="text-3xl font-bold text-slate-900 mb-6">About This Project</h2>
              <div
                class="prose prose-slate max-w-none text-slate-700"
                v-html="projectStore.currentProject.long_description"
              ></div>
            </BaseCard>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Technologies -->
            <BaseCard>
              <h3 class="text-xl font-bold text-slate-900 mb-4">Technologies</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tech in projectStore.currentProject.technologies"
                  :key="tech"
                  class="px-3 py-2 bg-linear-to-r from-blue-50 to-blue-100 text-blue-700 text-sm font-medium rounded-full border border-blue-200"
                >
                  {{ tech }}
                </span>
              </div>
            </BaseCard>

            <!-- Links -->
            <BaseCard>
              <h3 class="text-xl font-bold text-slate-900 mb-4">Links</h3>
              <div class="space-y-3">
                <BaseButton
                  v-if="projectStore.currentProject.demo_url"
                  variant="primary"
                  size="md"
                  class="w-full"
                  @click="openUrl(projectStore.currentProject.demo_url)"
                >
                  View Live Demo
                </BaseButton>
                <BaseButton
                  v-if="projectStore.currentProject.github_url"
                  variant="outline"
                  size="md"
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

      <div v-else-if="projectStore.error" class="text-center py-20">
        <p class="text-red-600 text-lg mb-6">{{ projectStore.error.message }}</p>
        <BaseButton variant="primary" size="lg" @click="$router.push('/projects')">
          ← Back to Projects
        </BaseButton>
      </div>
    </SectionWrapper>
  </div>
</template>
