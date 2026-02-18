<script setup lang="ts">
import BaseCard from '@/components/common/BaseCard.vue'
</script>

<template>
  <BaseCard padding="none" :hover="false">
    <div class="animate-pulse">
      <div class="bg-linear-to-r from-slate-200 to-slate-300 h-56 w-full rounded-t-xl"></div>
      <div class="p-6 space-y-4">
        <div class="h-7 bg-linear-to-r from-slate-200 to-slate-300 rounded-lg w-3/4"></div>
        <div class="space-y-3">
          <div class="h-4 bg-linear-to-r from-slate-200 to-slate-300 rounded-lg"></div>
          <div class="h-4 bg-linear-to-r from-slate-200 to-slate-300 rounded-lg w-5/6"></div>
        </div>
        <div class="flex gap-2">
          <div class="h-6 bg-linear-to-r from-slate-200 to-slate-300 rounded-full w-16"></div>
          <div class="h-6 bg-linear-to-r from-slate-200 to-slate-300 rounded-full w-16"></div>
          <div class="h-6 bg-linear-to-r from-slate-200 to-slate-300 rounded-full w-16"></div>
        </div>
        <div class="flex gap-3 pt-2">
          <div class="h-10 bg-linear-to-r from-slate-200 to-slate-300 rounded-lg flex-1"></div>
          <div class="h-10 bg-linear-to-r from-slate-200 to-slate-300 rounded-lg flex-1"></div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
