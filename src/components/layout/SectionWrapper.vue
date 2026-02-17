<script setup lang="ts">
interface Props {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  spacing?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  maxWidth: 'xl',
  spacing: 'md',
})

const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
}

const spacingClasses = {
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
}
</script>

<template>
  <section :class="[spacingClasses[spacing], 'w-full']">
    <div :class="[maxWidthClasses[maxWidth], 'mx-auto px-4 sm:px-6 lg:px-8']">
      <slot></slot>
    </div>
  </section>
</template>
