<script setup lang="ts">
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
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg disabled:bg-blue-300 disabled:shadow-none',
  secondary:
    'bg-slate-600 text-white hover:bg-slate-700 shadow-md hover:shadow-lg disabled:bg-slate-300 disabled:shadow-none',
  outline:
    'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 disabled:border-blue-300 disabled:text-blue-300',
  ghost: 'text-blue-600 hover:bg-blue-50/50 disabled:text-blue-300',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
}

const buttonClasses = `
  inline-flex items-center justify-center
  font-semibold rounded-lg
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  disabled:cursor-not-allowed
  ${variantClasses[props.variant]}
  ${sizeClasses[props.size]}
`
</script>

<template>
  <button :type="type" :disabled="disabled || loading" :class="buttonClasses">
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <slot></slot>
  </button>
</template>
