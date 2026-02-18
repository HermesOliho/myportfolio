<script setup lang="ts">
import AdminNavbar from '@/components/admin/AdminNavbar.vue'
import AdminTabs from '@/components/admin/AdminTabs.vue'
</script>

<template>
  <div class="min-h-screen bg-base-200 text-base-content">
    <AdminNavbar />
    <main class="py-6">
      <div class="bg-base-100 backdrop-blur-md border-b border-base-300 mb-6 p-2">
        <AdminTabs class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4" />
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <router-view />
        </div>
      </div>
    </main>
  </div>
</template>
