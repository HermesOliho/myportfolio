<script setup lang="ts">
import FileInput from '@/components/admin/FileInput.vue'
import FormInput from '@/components/admin/FormInput.vue'
import FormTextarea from '@/components/admin/FormTextarea.vue'
import { getBackendUrl } from '@/helpers/getBackendUrl'
import { useAdminSettingStore } from '@/stores/admin/useAdminSettingStore'
import type { AdminSettingsFormData } from '@/types/Admin'
import { PencilIcon, XIcon } from 'lucide-vue-next'
import { onMounted, ref, watch } from 'vue'

const settingStore = useAdminSettingStore()

const formData = ref<AdminSettingsFormData>({
  profile_picture: undefined,
  full_name: '',
  professional_title: '',
  short_bio: '',
  full_bio: '',
  email: '',
  phone: '',
  location: '',
  global_meta_title: '',
  global_meta_description: '',
})

const phoneInput = ref('')
const locationInput = ref('')
// const profilePictureInput = useTemplateRef('profile-picture-input')

const errors = ref<Record<string, string[]>>({})
const loading = ref(true)

const clickOnPictureInput = () => {
  const input = document.querySelector(
    '#profilePictureInput input[type="file"]',
  ) as HTMLInputElement
  input?.click()
}

const resetProfilePicture = () => {
  formData.value.profile_picture = undefined
  const picturePreviwer = document.getElementById('profilePicturePreview') as HTMLImageElement
  picturePreviwer.src = getBackendUrl() + settingStore.settings?.profile_picture
}

onMounted(async () => {
  try {
    await settingStore.fetchSettings()
    if (settingStore.settings) {
      formData.value = {
        full_name: settingStore.settings.full_name,
        professional_title: settingStore.settings.professional_title,
        short_bio: settingStore.settings.short_bio,
        full_bio: settingStore.settings.full_bio,
        email: settingStore.settings.email,
        phone: settingStore.settings.phone || '',
        location: settingStore.settings.location || '',
        global_meta_title: settingStore.settings.global_meta_title,
        global_meta_description: settingStore.settings.global_meta_description,
      }
      phoneInput.value = settingStore.settings.phone || ''
      locationInput.value = settingStore.settings.location || ''
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  } finally {
    loading.value = false
  }
})

watch(
  () => formData.value.profile_picture,
  () => {
    const newImage = formData.value.profile_picture
    if (newImage) {
      const picturePreviwer = document.getElementById('profilePicturePreview') as HTMLImageElement
      picturePreviwer.src = URL.createObjectURL(newImage)
    }
  },
)

const handleSubmit = async () => {
  errors.value = {}

  formData.value.phone = phoneInput.value || undefined
  formData.value.location = locationInput.value || undefined

  try {
    await settingStore.updateSettings(formData.value)
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'errors' in error) {
      errors.value = (error as { errors: Record<string, string[]> }).errors
    }
    console.error('Failed to update settings:', error)
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Settings</h1>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="bg-white shadow rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="md:col-span-2">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
        </div>

        <!-- Profile Picture previewer -->
        <div class="md:col-span-2 flex items-center justify-center p-2">
          <div class="w-56 h-56 relative">
            <img
              id="profilePicturePreview"
              :src="getBackendUrl() + settingStore.settings?.profile_picture"
              alt="My profile picture"
              class="object-cover rounded-full"
            />
            <button
              v-if="formData.profile_picture"
              class="btn btn-square btn-error absolute bottom-0 left-2"
              title="Réinitialiser la photo de profil"
              @click="resetProfilePicture"
            >
              <XIcon class="w-4 h-4" />
            </button>
            <button
              class="btn btn-square btn-primary absolute bottom-0 right-2"
              @click="clickOnPictureInput"
            >
              <PencilIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="md:col-span-2 hidden">
          <FileInput
            id="profilePictureInput"
            v-model="formData.profile_picture"
            label="Profile Picture"
            type="file"
            :error="errors.profile_picture?.[0]"
          />
        </div>

        <FormInput
          v-model="formData.full_name"
          label="Full Name"
          :required="true"
          :error="errors.full_name?.[0]"
        />

        <FormInput
          v-model="formData.professional_title"
          label="Professional Title"
          :required="true"
          :error="errors.professional_title?.[0]"
        />

        <div class="md:col-span-2">
          <FormInput
            v-model="formData.short_bio"
            label="Short Bio"
            :required="true"
            :error="errors.short_bio?.[0]"
          />
        </div>

        <div class="md:col-span-2">
          <FormTextarea
            v-model="formData.full_bio"
            label="Full Bio"
            :required="true"
            :rows="6"
            :error="errors.full_bio?.[0]"
          />
        </div>

        <div class="md:col-span-2">
          <h2 class="text-lg font-semibold text-gray-900 mb-4 mt-4">Contact Information</h2>
        </div>

        <FormInput
          v-model="formData.email"
          label="Email"
          type="email"
          :required="true"
          :error="errors.email?.[0]"
        />

        <FormInput v-model="phoneInput" label="Phone" :error="errors.phone?.[0]" />

        <div class="md:col-span-2">
          <FormInput v-model="locationInput" label="Location" :error="errors.location?.[0]" />
        </div>

        <div class="md:col-span-2">
          <h2 class="text-lg font-semibold text-gray-900 mb-4 mt-4">SEO Settings</h2>
        </div>

        <div class="md:col-span-2">
          <FormInput
            v-model="formData.global_meta_title"
            label="Global Meta Title"
            :required="true"
            :error="errors.global_meta_title?.[0]"
          />
        </div>

        <div class="md:col-span-2">
          <FormTextarea
            v-model="formData.global_meta_description"
            label="Global Meta Description"
            :required="true"
            :rows="3"
            :error="errors.global_meta_description?.[0]"
          />
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          type="submit"
          :disabled="settingStore.loading"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="settingStore.loading">Updating...</span>
          <span v-else>Update Settings</span>
        </button>
      </div>
    </form>
  </div>
</template>
