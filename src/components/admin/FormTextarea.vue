<script setup lang="ts">
interface Props {
  label: string
  modelValue: string | undefined
  placeholder?: string
  required?: boolean
  error?: string
  disabled?: boolean
  rows?: number
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="mb-6">
    <label class="block text-sm font-semibold text-slate-900 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :rows="rows || 4"
      @input="handleInput"
      :class="[
        'w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 resize-vertical',
        error
          ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
          : 'border-slate-200 focus:ring-blue-500 focus:border-blue-500 bg-white',
        disabled ? 'bg-slate-100 cursor-not-allowed text-slate-500' : '',
      ]"
    ></textarea>
    <p v-if="error" class="mt-2 text-sm text-red-600 font-medium">{{ error }}</p>
  </div>
</template>
