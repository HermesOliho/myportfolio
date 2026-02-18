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
  <div class="mb-6">
    <label class="block text-sm font-semibold text-slate-900 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      @change="handleChange"
      :class="[
        'w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-200',
        error
          ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
          : 'border-slate-200 focus:ring-blue-500 focus:border-blue-500 bg-white',
        disabled ? 'bg-slate-100 cursor-not-allowed text-slate-500' : '',
      ]"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="mt-2 text-sm text-red-600 font-medium">{{ error }}</p>
  </div>
</template>
