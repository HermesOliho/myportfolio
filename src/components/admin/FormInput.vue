<script setup lang="ts">
interface Props {
  label: string
  modelValue: string | undefined
  type?: 'text' | 'email' | 'password' | 'url' | 'number'
  placeholder?: string
  required?: boolean
  error?: string
  disabled?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="form-control mb-6">
    <label class="label">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :type="type || 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      @input="handleInput"
      :class="['input input-bordered w-full', error ? 'input-error' : 'input-primary']"
    />
    <label v-if="error" class="label">
      <span class="label-text-alt text-error">{{ error }}</span>
    </label>
  </div>
</template>
