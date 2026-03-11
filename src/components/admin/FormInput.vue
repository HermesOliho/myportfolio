<script setup lang="ts">
import { ref, computed } from 'vue'
import { CheckCircle, XCircle } from 'lucide-vue-next'

type ValidationRule = (value: string) => true | string

interface Props {
  label: string
  modelValue: string | undefined
  type?: 'text' | 'email' | 'password' | 'url' | 'number'
  placeholder?: string
  required?: boolean
  error?: string
  disabled?: boolean
  rules?: ValidationRule[]
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const touched = ref(false)

const validationError = computed(() => {
  if (!touched.value || !props.rules) return ''
  for (const rule of props.rules) {
    const result = rule(props.modelValue ?? '')
    if (result !== true) return result
  }
  return ''
})

const displayError = computed(() => props.error || validationError.value)

const isValid = computed(
  () => touched.value && !displayError.value && (props.modelValue?.length ?? 0) > 0,
)

const handleInput = (event: Event) => {
  touched.value = true
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = () => {
  touched.value = true
}
</script>

<template>
  <div class="form-control mb-6">
    <label class="label">
      <span class="label-text font-medium">
        {{ label }}
        <span v-if="required" class="text-error ml-0.5">*</span>
      </span>
    </label>
    <div class="relative">
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        @input="handleInput"
        @blur="handleBlur"
        :class="[
          'input input-bordered w-full pr-10',
          displayError ? 'input-error' : isValid ? 'input-success' : 'input-primary',
        ]"
      />
      <span class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <XCircle v-if="displayError" class="w-4 h-4 text-error" />
        <CheckCircle v-else-if="isValid" class="w-4 h-4 text-success" />
      </span>
    </div>
    <label v-if="displayError" class="label">
      <span class="label-text-alt text-error">{{ displayError }}</span>
    </label>
  </div>
</template>
