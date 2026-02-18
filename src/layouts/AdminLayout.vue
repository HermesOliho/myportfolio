<script setup lang="ts">
import AdminNavbar from '@/components/admin/AdminNavbar.vue'
</script>

<template>
  <div class="min-h-screen bg-base-200 text-base-content">
    <AdminNavbar />
    <main class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <router-view />
      </div>
    </main>
  </div>
</template>
