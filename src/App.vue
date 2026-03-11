<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  const theme = localStorage.getItem('admin-theme')
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
  }
})
</script>

<template>
  <div class="min-h-screen bg-base-100 text-base-content">
    <router-view />
  </div>
</template>

<style>
@import './assets/main.css';
</style>
