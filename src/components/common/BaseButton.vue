<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
})

const variantClasses = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
}

const sizeClasses = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
}

const buttonClasses = computed(() => {
  return ['btn font-semibold normal-case', variantClasses[props.variant], sizeClasses[props.size]]
})
</script>

<template>
  <button :type="type" :disabled="disabled || loading" :class="buttonClasses">
    <span v-if="loading" class="loading loading-spinner loading-sm"></span>
    <slot></slot>
  </button>
</template>
