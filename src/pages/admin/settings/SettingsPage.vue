<script setup lang="ts">
import ImageUpload from '@/components/admin/ImageUpload.vue'
import FormInput from '@/components/admin/FormInput.vue'
import FormTextarea from '@/components/admin/FormTextarea.vue'
import { useToast } from '@/composables/useToast'
import { getBackendUrl } from '@/helpers/getBackendUrl'
import { useAdminSettingStore } from '@/stores/admin/useAdminSettingStore'
import type { AdminSettingsFormData } from '@/types/Admin'
import { onMounted, ref, watch } from 'vue'
import { KeyRound, User, MapPin, Search } from 'lucide-vue-next'

const settingStore = useAdminSettingStore()
const toast = useToast()

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
const profilePreviewUrl = ref('')
const errors = ref<Record<string, string[]>>({})
const loading = ref(true)

// Password change
const passwordForm = ref({ current_password: '', new_password: '', confirm_password: '' })
const passwordErrors = ref<Record<string, string>>({})
const savingPassword = ref(false)

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
      profilePreviewUrl.value = settingStore.settings.profile_picture
        ? getBackendUrl() + settingStore.settings.profile_picture
        : ''
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
    toast.error('Failed to load settings.')
  } finally {
    loading.value = false
  }
})

watch(
  () => formData.value.profile_picture,
  (file) => {
    if (file) {
      profilePreviewUrl.value = URL.createObjectURL(file)
    }
  },
)

const handleSubmit = async () => {
  errors.value = {}
  formData.value.phone = phoneInput.value || undefined
  formData.value.location = locationInput.value || undefined

  try {
    await settingStore.updateSettings(formData.value)
    toast.success('Settings updated successfully!')
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'errors' in error) {
      errors.value = (error as { errors: Record<string, string[]> }).errors
    }
    toast.error('Failed to update settings.')
    console.error('Failed to update settings:', error)
  }
}

const handlePasswordSubmit = async () => {
  passwordErrors.value = {}

  if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
    passwordErrors.value.confirm_password = 'Passwords do not match.'
    return
  }
  if (passwordForm.value.new_password.length < 8) {
    passwordErrors.value.new_password = 'Password must be at least 8 characters.'
    return
  }

  savingPassword.value = true
  try {
    // Password change endpoint - placeholder, implement when backend supports it
    toast.info('Password change feature coming soon.')
  } catch {
    toast.error('Failed to change password.')
  } finally {
    savingPassword.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold">Settings</h1>
      <p class="text-base-content/60 mt-1">Manage your portfolio configuration</p>
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="skeleton h-32 w-full rounded-xl" />
    </div>

    <template v-else>
      <!-- Profile Picture Section -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title text-lg flex items-center gap-2">
            <User class="w-5 h-5 text-primary" />
            Profile Picture
          </h2>
          <div class="flex flex-col sm:flex-row items-start gap-6">
            <div class="shrink-0">
              <div class="avatar">
                <div class="w-32 h-32 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                  <img
                    v-if="profilePreviewUrl"
                    :src="profilePreviewUrl"
                    alt="Profile picture"
                    class="object-cover"
                  />
                  <div v-else class="bg-primary/20 flex items-center justify-center w-full h-full rounded-full">
                    <User class="w-12 h-12 text-primary/50" />
                  </div>
                </div>
              </div>
            </div>
            <div class="flex-1 w-full">
              <ImageUpload
                v-model="formData.profile_picture"
                :preview-url="profilePreviewUrl"
                label="Upload new profile picture"
                :error="errors.profile_picture?.[0]"
                :max-size-mb="2"
                @update:previewUrl="(url) => (profilePreviewUrl = url)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Personal Information -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title text-lg flex items-center gap-2">
            <User class="w-5 h-5 text-primary" />
            Personal Information
          </h2>
          <form @submit.prevent="handleSubmit" class="space-y-0">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6">
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
                  :rows="5"
                  :error="errors.full_bio?.[0]"
                />
              </div>
            </div>

            <h2 class="text-base font-semibold mt-2 mb-2 flex items-center gap-2">
              <MapPin class="w-4 h-4 text-primary" />
              Contact Information
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6">
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
            </div>

            <div class="flex justify-end pt-4 border-t border-base-300 mt-2">
              <button type="submit" :disabled="settingStore.loading" class="btn btn-primary">
                <span v-if="settingStore.loading" class="loading loading-spinner loading-sm" />
                <span v-else>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- SEO Settings -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title text-lg flex items-center gap-2">
            <Search class="w-5 h-5 text-primary" />
            SEO Settings
          </h2>
          <form @submit.prevent="handleSubmit" class="space-y-0">
            <FormInput
              v-model="formData.global_meta_title"
              label="Global Meta Title"
              :required="true"
              :error="errors.global_meta_title?.[0]"
            />
            <FormTextarea
              v-model="formData.global_meta_description"
              label="Global Meta Description"
              :required="true"
              :rows="3"
              :error="errors.global_meta_description?.[0]"
            />
            <div class="flex justify-end pt-4 border-t border-base-300 mt-2">
              <button type="submit" :disabled="settingStore.loading" class="btn btn-primary">
                <span v-if="settingStore.loading" class="loading loading-spinner loading-sm" />
                <span v-else>Save SEO Settings</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Change Password -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title text-lg flex items-center gap-2">
            <KeyRound class="w-5 h-5 text-primary" />
            Change Password
          </h2>
          <form @submit.prevent="handlePasswordSubmit" class="space-y-0">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-x-6">
              <FormInput
                v-model="passwordForm.current_password"
                label="Current Password"
                type="password"
                :required="true"
                :error="passwordErrors.current_password"
              />
              <FormInput
                v-model="passwordForm.new_password"
                label="New Password"
                type="password"
                :required="true"
                :error="passwordErrors.new_password"
              />
              <FormInput
                v-model="passwordForm.confirm_password"
                label="Confirm New Password"
                type="password"
                :required="true"
                :error="passwordErrors.confirm_password"
              />
            </div>
            <div class="flex justify-end pt-4 border-t border-base-300 mt-2">
              <button type="submit" :disabled="savingPassword" class="btn btn-outline btn-primary">
                <span v-if="savingPassword" class="loading loading-spinner loading-sm" />
                <span v-else>Change Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </template>
  </div>
</template>
