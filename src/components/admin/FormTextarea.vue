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
  <div class="form-control mb-6">
    <label class="label">
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
        'textarea textarea-bordered w-full resize-y',
        error ? 'textarea-error' : 'textarea-primary',
      ]"
    ></textarea>
    <label v-if="error" class="label">
      <span class="label-text-alt text-error">{{ error }}</span>
    </label>
  </div>
</template>
