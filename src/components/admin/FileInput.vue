<script setup lang="ts">
import { ref, watch } from 'vue'
interface Props {
  label: string
  modelValue: File | undefined
  type?: 'file'
  placeholder?: string
  required?: boolean
  error?: string
  disabled?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: File]
}>()

const fileInput = ref<HTMLInputElement | null>(null)

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue && fileInput.value) {
      fileInput.value.value = ''
    }
  },
)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    emit('update:modelValue', target.files[0])
  }
}
</script>

<template>
  <div class="form-control mb-6">
    <label class="label">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      ref="fileInput"
      :type="type || 'file'"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      @input="handleInput"
      :class="['file-input w-full', error ? 'input-error' : 'input-primary']"
    />
    <label v-if="error" class="label">
      <span class="label-text-alt text-error">{{ error }}</span>
    </label>
  </div>
</template>
