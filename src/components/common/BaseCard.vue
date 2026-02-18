<script setup lang="ts">
interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  shadow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  hover: true,
  shadow: true,
})

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const cardClasses = `
  bg-white rounded-lg border border-gray-200
  ${props.shadow ? 'shadow-md' : ''}
  ${props.hover ? 'transition-transform hover:scale-105 hover:shadow-lg' : ''}
  ${paddingClasses[props.padding]}
`
</script>

<template>
  <div :class="cardClasses">
    <slot></slot>
  </div>
</template>
