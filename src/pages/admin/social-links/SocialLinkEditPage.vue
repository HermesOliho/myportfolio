<script setup lang="ts">
import { useAdminSocialLinksStore } from '@/stores/admin/useAdminSocialLinksStore'
import type { SocialLink } from '@/types/SocialLink'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const newSocialLink = ref<Omit<SocialLink, 'id' | 'created_at' | 'updated_at'>>({
  platform: '',
  url: '',
  icon: '',
})

const socialLinksStore = useAdminSocialLinksStore()
const router = useRouter()
const route = useRoute()

const currentLink = ref<Omit<SocialLink, 'created_at' | 'updated_at'> | null>(null)

const handleSubmit = async () => {
  try {
    if (currentLink.value && route.params.id) {
      await socialLinksStore.updateSocialLink(
        parseInt(route.params.id as string, 10),
        currentLink.value,
      )
    } else {
      await socialLinksStore.createSocialLink(newSocialLink.value)
    }
    router.push({ name: 'admin-social-links' })
  } catch (error) {
    console.error('Failed to create social link:', error)
  }
}

onMounted(() => {
  let id = null
  if (route.params.id) {
    id = parseInt(route.params.id as string, 10)
  } else {
    id = null
  }
  if (id) {
    socialLinksStore
      .fetchSocialLinkById(id)
      .then(() => {
        if (socialLinksStore.currentSocialLink) {
          currentLink.value = socialLinksStore.currentSocialLink
        } else {
          console.error('Social link not found')
          router.push({ name: 'admin-social-links' })
        }
      })
      .catch((error) => {
        console.error('Failed to load social link:', error)
        router.push({ name: 'admin-social-links' })
      })
  }
})
</script>

<template>
  <h1 class="text-3xl font-bold mb-4">Edit Social Link</h1>
  <p class="text-base-content/70 mb-6">
    Update the details of an existing social media link in your portfolio.
  </p>
  <form class="bg-base-100 p-6 rounded-lg shadow" @submit.prevent="handleSubmit" v-if="currentLink">
    <div class="mb-4">
      <label for="platform" class="block text-sm font-medium mb-1">Platform</label>
      <input
        type="text"
        id="platform"
        class="input input-bordered w-full"
        placeholder="e.g., GitHub, LinkedIn"
        v-model="currentLink.platform"
      />
    </div>
    <div class="mb-4">
      <label for="url" class="block text-sm font-medium mb-1">URL</label>
      <input
        type="url"
        id="url"
        class="input input-bordered w-full"
        placeholder="e.g., https://github.com/username"
        v-model="currentLink.url"
      />
    </div>
    <div class="mb-4">
      <label for="icon" class="block text-sm font-medium mb-1">Icon URL (optional)</label>
      <input
        type="url"
        id="icon"
        class="input input-bordered w-full"
        placeholder="e.g., https://cdn-icons-png.flaticon.com/512/25/25231.png"
        v-model="currentLink.icon"
      />
    </div>
    <div class="flex justify-end">
      <button type="submit" class="btn btn-primary">Save Social Link</button>
    </div>
  </form>
</template>
