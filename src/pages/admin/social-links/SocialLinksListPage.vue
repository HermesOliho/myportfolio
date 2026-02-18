<script setup lang="ts">
import { useAdminSocialLinksStore } from '@/stores/admin/useAdminSocialLinksStore'
import type { SocialLink } from '@/types/SocialLink'
import { Edit, PlusCircle, Trash } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'

const socialLinks = ref<SocialLink[]>([])
const linkToDelete = ref<number | null>(null)

const socialLinksStore = useAdminSocialLinksStore()

const loadSocialLinks = async () => {
  try {
    await socialLinksStore.fetchSocialLinks()
    socialLinks.value = socialLinksStore.socialLinks
  } catch (error) {
    console.error('Failed to load social links:', error)
  }
}

const showConfirmDelete = (id: number) => {
  linkToDelete.value = id
  const modal = window.document.getElementById('deleteLinkModal') as HTMLDialogElement
  if (modal) {
    modal.showModal()
  }
}
const cancelDelete = () => {
  linkToDelete.value = null
  const modal = window.document.getElementById('deleteLinkModal') as HTMLDialogElement
  if (modal) {
    modal.close()
  }
}

const deleteSocialLink = async () => {
  if (linkToDelete.value !== null) {
    try {
      await socialLinksStore.deleteSocialLink(linkToDelete.value)
      await loadSocialLinks()
    } catch (error) {
      console.error('Failed to delete social link:', error)
    } finally {
      linkToDelete.value = null
      const modal = window.document.getElementById('deleteLinkModal') as HTMLDialogElement
      if (modal) {
        modal.close()
      }
    }
  }
}

onMounted(() => {
  loadSocialLinks()
})
</script>

<template>
  <div class="flex items-center justify-between gap-2">
    <h1 class="text-3xl font-bold mb-4">Social Links</h1>
    <router-link :to="{ name: 'admin-social-links-create' }" class="btn btn-sm btn-primary">
      <plus-circle class="w-5 h-5 mr-1" />
      Add Social Link
    </router-link>
  </div>
  <p class="text-base-content/70 mb-6">
    Manage your social media links displayed on your portfolio.
  </p>
  <div class="bg-base-100 p-6 rounded-lg shadow">
    <table class="table w-full">
      <thead>
        <tr>
          <th>Icon</th>
          <th>Platform</th>
          <th class="hidden lg:table-cell">URL</th>
          <th class="text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Example row, replace with dynamic data -->
        <tr v-for="link in socialLinks" :key="link.id">
          <td>
            <img :src="link.icon" :alt="link.platform" class="w-6 h-6" />
          </td>
          <td>{{ link.platform }}</td>
          <td class="hidden md:table-cell">
            <a :href="link.url" target="_blank" class="text-blue-500 hover:underline line-clamp-2">
              {{ link.url }}
            </a>
          </td>
          <td class="text-right">
            <router-link
              :to="{ name: 'admin-social-links-edit', params: { id: link.id } }"
              class="btn btn-sm btn-ghost btn-primary mr-2"
            >
              <Edit class="w-4 h-4 mr-1" />
              <span class="hidden lg:inline">Edit</span>
            </router-link>
            <button class="btn btn-sm btn-ghost btn-error" @click="showConfirmDelete(link.id)">
              <Trash class="w-4 h-4 mr-1" />
              <span class="hidden lg:inline">Delete</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Confirm delete modal -->
  <dialog id="deleteLinkModal" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <h3 class="text-lg font-bold">Delete Social Link</h3>
      <p class="py-4">Are you sure you want to delete this social link?</p>
      <div class="modal-action">
        <button class="btn btn-error" @click="deleteSocialLink">Yes, Delete</button>
        <button class="btn" @click="cancelDelete">Cancel</button>
      </div>
    </div>
  </dialog>
</template>
