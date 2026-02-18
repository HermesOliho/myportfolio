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
  bg-white rounded-xl border border-slate-200/50
  ${props.shadow ? 'shadow-lg' : ''}
  ${props.hover ? 'transition-all duration-300 hover:shadow-2xl hover:border-slate-300/80' : ''}
  ${paddingClasses[props.padding]}
`
</script>

<template>
  <div :class="cardClasses">
    <slot></slot>
  </div>
</template>
