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
  <div class="form-control mb-6">
    <label class="label">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      @change="handleChange"
      :class="['select select-bordered w-full', error ? 'select-error' : 'select-primary']"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <label v-if="error" class="label">
      <span class="label-text-alt text-error">{{ error }}</span>
    </label>
  </div>
</template>
