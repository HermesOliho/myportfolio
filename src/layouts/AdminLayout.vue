<script setup lang="ts">
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import ToastContainer from '@/components/admin/ToastContainer.vue'
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-base-200 text-base-content">
    <AdminSidebar />
    <main class="flex-1 overflow-y-auto">
      <div class="p-6 min-h-full">
        <router-view />
      </div>
    </main>
    <ToastContainer />
  </div>
</template>
