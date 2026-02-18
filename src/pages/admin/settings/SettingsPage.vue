<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminSettingStore } from '@/stores/admin/useAdminSettingStore'
import FormInput from '@/components/admin/FormInput.vue'
import FormTextarea from '@/components/admin/FormTextarea.vue'
import type { AdminSettingsFormData } from '@/types/Admin'

const settingStore = useAdminSettingStore()

const formData = ref<AdminSettingsFormData>({
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
const errors = ref<Record<string, string>>({})
const loading = ref(true)

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

const handleSubmit = async () => {
  errors.value = {}
  
  formData.value.phone = phoneInput.value || undefined
  formData.value.location = locationInput.value || undefined
  
  try {
    await settingStore.updateSettings(formData.value)
  } catch (error: any) {
    if (error.errors) {
      errors.value = error.errors
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

        <FormInput
          v-model="phoneInput"
          label="Phone"
          :error="errors.phone?.[0]"
        />

        <div class="md:col-span-2">
          <FormInput
            v-model="locationInput"
            label="Location"
            :error="errors.location?.[0]"
          />
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
