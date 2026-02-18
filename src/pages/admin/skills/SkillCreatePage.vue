<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminSkillStore } from '@/stores/admin/useAdminSkillStore'
import FormInput from '@/components/admin/FormInput.vue'
import FormSelect from '@/components/admin/FormSelect.vue'
import type { AdminSkillFormData } from '@/types/Admin'

const router = useRouter()
const skillStore = useAdminSkillStore()

const formData = ref<AdminSkillFormData>({
  name: '',
  category: 'backend',
  level: 50,
  display_order: 0,
  icon: '',
})

const levelInput = ref('50')
const displayOrderInput = ref('0')
const iconInput = ref('')
const errors = ref<Record<string, string[]>>({})

const categoryOptions = [
  { value: 'backend', label: 'Backend' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'devops', label: 'DevOps' },
  { value: 'tools', label: 'Tools' },
]

const handleSubmit = async () => {
  errors.value = {}
  
  formData.value.level = Number(levelInput.value)
  formData.value.display_order = Number(displayOrderInput.value)
  formData.value.icon = iconInput.value || undefined
  
  try {
    await skillStore.createSkill(formData.value)
    router.push('/admin/skills')
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'errors' in error) {
      errors.value = (error as { errors: Record<string, string[]> }).errors
    }
    console.error('Failed to create skill:', error)
  }
}

const handleCancel = () => {
  router.push('/admin/skills')
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Create Skill</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-white shadow rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="md:col-span-2">
          <FormInput
            v-model="formData.name"
            label="Name"
            :required="true"
            :error="errors.name?.[0]"
          />
        </div>

        <FormSelect
          v-model="formData.category"
          label="Category"
          :options="categoryOptions"
          :required="true"
          :error="errors.category?.[0]"
        />

        <FormInput
          v-model="levelInput"
          label="Level (1-100)"
          type="number"
          :required="true"
          :error="errors.level?.[0]"
        />

        <FormInput
          v-model="displayOrderInput"
          label="Display Order"
          type="number"
          :required="true"
          :error="errors.display_order?.[0]"
        />

        <FormInput
          v-model="iconInput"
          label="Icon"
          :error="errors.icon?.[0]"
        />
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
          :disabled="skillStore.loading"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="skillStore.loading">Creating...</span>
          <span v-else>Create Skill</span>
        </button>
      </div>
    </form>
  </div>
</template>
