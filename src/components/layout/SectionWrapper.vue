<script setup lang="ts">
interface Props {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'full'
  spacing?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  maxWidth: 'lg',
  spacing: 'md',
})

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  full: 'max-w-full',
}

const spacingClasses = {
  sm: 'py-8',
  md: 'py-16',
  lg: 'py-24',
}
</script>

<template>
  <section :class="[spacingClasses[spacing], 'w-full']">
    <div :class="[maxWidthClasses[maxWidth], 'mx-auto px-4 sm:px-6 lg:px-8']">
      <slot></slot>
    </div>
  </section>
</template>
