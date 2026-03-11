<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminProjectStore } from '@/stores/admin/useAdminProjectStore'
import { useToast } from '@/composables/useToast'
import FormInput from '@/components/admin/FormInput.vue'
import FormSelect from '@/components/admin/FormSelect.vue'
import ImageUpload from '@/components/admin/ImageUpload.vue'
import MarkdownEditor from '@/components/admin/MarkdownEditor.vue'
import type { AdminProjectFormData } from '@/types/Admin'
import { X } from 'lucide-vue-next'

const router = useRouter()
const projectStore = useAdminProjectStore()
const toast = useToast()

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
  formData.value.technologies = formData.value.technologies.filter((t) => t !== tech)
}

const handleSubmit = async () => {
  errors.value = {}
  try {
    await projectStore.createProject(formData.value)
    toast.success('Project created successfully!')
    router.push('/admin/projects')
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'errors' in error) {
      errors.value = (error as { errors: Record<string, string[]> }).errors
    }
    toast.error('Failed to create project.')
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
      <h1 class="text-3xl font-bold">Create Project</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="card bg-base-100 shadow">
      <div class="card-body space-y-2">
        <!-- Basic Info Section -->
        <h2 class="text-lg font-semibold border-b border-base-300 pb-2 mb-4">Basic Information</h2>

        <FormInput
          v-model="formData.title"
          label="Title"
          :required="true"
          :error="errors.title?.[0]"
        />

        <FormInput
          v-model="formData.short_description"
          label="Short Description"
          :required="true"
          :error="errors.short_description?.[0]"
        />

        <MarkdownEditor
          v-model="formData.long_description"
          label="Long Description"
          :required="true"
          :error="errors.long_description?.[0]"
        />

        <!-- Technologies -->
        <div class="form-control mb-6">
          <label class="label">
            <span class="label-text font-medium">Technologies <span class="text-error">*</span></span>
          </label>
          <div class="flex gap-2 mb-3">
            <input
              v-model="technologiesInput"
              type="text"
              placeholder="Add technology (e.g. Vue.js)"
              @keypress.enter.prevent="addTechnology"
              class="input input-bordered input-primary flex-1"
            />
            <button type="button" @click="addTechnology" class="btn btn-primary">Add</button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tech in formData.technologies"
              :key="tech"
              class="badge badge-primary badge-lg gap-2"
            >
              {{ tech }}
              <button type="button" @click="removeTechnology(tech)" class="hover:text-error">
                <X class="w-3 h-3" />
              </button>
            </span>
          </div>
          <p v-if="errors.technologies?.[0]" class="mt-1 text-sm text-error">
            {{ errors.technologies[0] }}
          </p>
        </div>

        <!-- Image & Status Section -->
        <h2 class="text-lg font-semibold border-b border-base-300 pb-2 mb-4">Media & Status</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ImageUpload
              label="Main Image"
              :error="errors.main_image?.[0]"
              @update:previewUrl="(url) => (formData.main_image = url)"
            />
            <FormInput
              v-model="formData.main_image"
              label="Or enter image URL"
              type="url"
              placeholder="https://..."
              :error="errors.main_image?.[0]"
            />
          </div>

          <div class="space-y-2">
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
          </div>
        </div>

        <!-- SEO Section -->
        <h2 class="text-lg font-semibold border-b border-base-300 pb-2 mb-4 mt-4">SEO</h2>

        <FormInput
          v-model="formData.meta_title"
          label="Meta Title"
          :error="errors.meta_title?.[0]"
        />
        <FormInput
          v-model="formData.meta_description"
          label="Meta Description"
          :error="errors.meta_description?.[0]"
        />

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-base-300">
          <button type="button" @click="handleCancel" class="btn btn-ghost">Cancel</button>
          <button type="submit" :disabled="projectStore.loading" class="btn btn-primary">
            <span v-if="projectStore.loading" class="loading loading-spinner loading-sm" />
            <span v-else>Create Project</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
