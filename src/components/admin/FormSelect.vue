<script setup lang="ts">
interface Option {
  value: string | number
  label: string
}

interface Props {
  label: string
  modelValue: string | number
  options: Option[]
  placeholder?: string
  required?: boolean
  error?: string
  disabled?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="mb-4">
    <label class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      @change="handleChange"
      :class="[
        'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors',
        error
          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
        disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
      ]"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
