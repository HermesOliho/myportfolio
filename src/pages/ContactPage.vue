<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@vueuse/head'
import { contactService } from '@/services/contactService'
import type { ContactFormData } from '@/types/Contact'
import SectionWrapper from '@/components/layout/SectionWrapper.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import ToastNotification from '@/components/ui/ToastNotification.vue'

useHead({
  title: 'Contact - Portfolio',
  meta: [
    {
      name: 'description',
      content: 'Get in touch with me',
    },
  ],
})

const formData = ref<ContactFormData>({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const loading = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

async function submitForm(): Promise<void> {
  loading.value = true
  try {
    const response = await contactService.submit(formData.value)
    toastMessage.value = response.data.data.message
    toastType.value = 'success'
    showToast.value = true
    
    // Reset form
    formData.value = {
      name: '',
      email: '',
      subject: '',
      message: '',
    }
  } catch {
    toastMessage.value = 'Failed to send message. Please try again.'
    toastType.value = 'error'
    showToast.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <SectionWrapper max-width="lg">
      <PageHeader
        title="Get In Touch"
        subtitle="Have a question or want to work together?"
      />
      
      <BaseCard>
        <form @submit.prevent="submitForm" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your name"
            />
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>
          
          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              id="subject"
              v-model="formData.subject"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What's this about?"
            />
          </div>
          
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              v-model="formData.message"
              required
              rows="6"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your message..."
            ></textarea>
          </div>
          
          <BaseButton
            type="submit"
            variant="primary"
            class="w-full"
            :loading="loading"
            :disabled="loading"
          >
            Send Message
          </BaseButton>
        </form>
      </BaseCard>
    </SectionWrapper>
    
    <ToastNotification
      :visible="showToast"
      :message="toastMessage"
      :type="toastType"
      @close="showToast = false"
    />
  </div>
</template>
