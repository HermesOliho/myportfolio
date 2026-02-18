<script setup lang="ts">
import { useAdminSocialLinksStore } from '@/stores/admin/useAdminSocialLinksStore'
import type { SocialLink } from '@/types/SocialLink'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const newSocialLink = ref<Omit<SocialLink, 'id' | 'created_at' | 'updated_at'>>({
  platform: '',
  url: '',
  icon: '',
})

const socialLinksStore = useAdminSocialLinksStore()
const router = useRouter()

const handleSubmit = async () => {
  try {
    await socialLinksStore.createSocialLink(newSocialLink.value)
    router.push({ name: 'admin-social-links' })
  } catch (error) {
    console.error('Failed to create social link:', error)
  }
}
</script>

<template>
  <h1 class="text-3xl font-bold mb-4">Add a Social Link</h1>
  <p class="text-base-content/70 mb-6">
    Fill in the details to add a new social media link to your portfolio.
  </p>
  <form class="bg-base-100 p-6 rounded-lg shadow" @submit.prevent="handleSubmit">
    <div class="mb-4">
      <label for="platform" class="block text-sm font-medium mb-1">Platform</label>
      <input
        type="text"
        id="platform"
        class="input input-bordered w-full"
        placeholder="e.g., GitHub, LinkedIn"
        v-model="newSocialLink.platform"
      />
    </div>
    <div class="mb-4">
      <label for="url" class="block text-sm font-medium mb-1">URL</label>
      <input
        type="url"
        id="url"
        class="input input-bordered w-full"
        placeholder="e.g., https://github.com/username"
        v-model="newSocialLink.url"
      />
    </div>
    <div class="mb-4">
      <label for="icon" class="block text-sm font-medium mb-1">Icon URL (optional)</label>
      <input
        type="url"
        id="icon"
        class="input input-bordered w-full"
        placeholder="e.g., https://cdn-icons-png.flaticon.com/512/25/25231.png"
        v-model="newSocialLink.icon"
      />
    </div>
    <div class="flex justify-end">
      <button type="submit" class="btn btn-primary">Add Social Link</button>
    </div>
  </form>
</template>
