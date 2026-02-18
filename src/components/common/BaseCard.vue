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
  sm: 'card-body p-4',
  md: 'card-body p-6',
  lg: 'card-body p-8',
}

const cardClasses = `
  card bg-base-100 border border-base-300/60 rounded-2xl
  ${props.shadow ? 'shadow-lg' : ''}
  ${props.hover ? 'transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5' : ''}
`
</script>

<template>
  <div :class="cardClasses">
    <slot v-if="padding === 'none'"></slot>
    <div v-else :class="paddingClasses[padding]">
      <slot></slot>
    </div>
  </div>
</template>
