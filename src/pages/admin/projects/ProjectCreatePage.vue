<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminProjectStore } from '@/stores/admin/useAdminProjectStore'
import FormInput from '@/components/admin/FormInput.vue'
import FormTextarea from '@/components/admin/FormTextarea.vue'
import FormSelect from '@/components/admin/FormSelect.vue'
import type { AdminProjectFormData } from '@/types/Admin'

const router = useRouter()
const projectStore = useAdminProjectStore()

const formData = ref<AdminProjectFormData>({
  title: '',
  short_description: '',
  long_description: '',
  technologies: [],
  main_image: '',
  github_url: '',
  demo_url: '',
  status: 'draft',
  meta_title: '',
  meta_description: '',
})

const technologiesInput = ref('')
const errors = ref<Record<string, string[]>>({})

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
]

const addTechnology = () => {
  const tech = technologiesInput.value.trim()
  if (tech && !formData.value.technologies.includes(tech)) {
    formData.value.technologies.push(tech)
    technologiesInput.value = ''
  }
}

const removeTechnology = (tech: string) => {
  formData.value.technologies = formData.value.technologies.filter(t => t !== tech)
}

const handleSubmit = async () => {
  errors.value = {}
  
  try {
    await projectStore.createProject(formData.value)
    router.push('/admin/projects')
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'errors' in error) {
      errors.value = (error as { errors: Record<string, string[]> }).errors
    }
    console.error('Failed to create project:', error)
  }
}

const handleCancel = () => {
  router.push('/admin/projects')
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Create Project</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-white shadow rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="md:col-span-2">
          <FormInput
            v-model="formData.title"
            label="Title"
            :required="true"
            :error="errors.title?.[0]"
          />
        </div>

        <div class="md:col-span-2">
          <FormInput
            v-model="formData.short_description"
            label="Short Description"
            :required="true"
            :error="errors.short_description?.[0]"
          />
        </div>

        <div class="md:col-span-2">
          <FormTextarea
            v-model="formData.long_description"
            label="Long Description"
            :required="true"
            :rows="6"
            :error="errors.long_description?.[0]"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Technologies <span class="text-red-500">*</span>
          </label>
          <div class="flex gap-2 mb-2">
            <input
              v-model="technologiesInput"
              type="text"
              placeholder="Add technology (e.g., Vue.js)"
              @keypress.enter.prevent="addTechnology"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              @click="addTechnology"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tech in formData.technologies"
              :key="tech"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
              {{ tech }}
              <button
                type="button"
                @click="removeTechnology(tech)"
                class="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          </div>
          <p v-if="errors.technologies?.[0]" class="mt-1 text-sm text-red-600">
            {{ errors.technologies[0] }}
          </p>
        </div>

        <FormInput
          v-model="formData.main_image"
          label="Main Image URL"
          type="url"
          :required="true"
          :error="errors.main_image?.[0]"
        />

        <FormSelect
          v-model="formData.status"
          label="Status"
          :options="statusOptions"
          :required="true"
          :error="errors.status?.[0]"
        />

        <FormInput
          v-model="formData.github_url"
          label="GitHub URL"
          type="url"
          :error="errors.github_url?.[0]"
        />

        <FormInput
          v-model="formData.demo_url"
          label="Demo URL"
          type="url"
          :error="errors.demo_url?.[0]"
        />

        <FormInput
          v-model="formData.meta_title"
          label="Meta Title (SEO)"
          :error="errors.meta_title?.[0]"
        />

        <div class="md:col-span-2">
          <FormTextarea
            v-model="formData.meta_description"
            label="Meta Description (SEO)"
            :rows="3"
            :error="errors.meta_description?.[0]"
          />
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          @click="handleCancel"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="projectStore.loading"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="projectStore.loading">Creating...</span>
          <span v-else>Create Project</span>
        </button>
      </div>
    </form>
  </div>
</template>
