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
  <div class="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50">
    <SectionWrapper max-width="2xl">
      <PageHeader
        title="Get In Touch"
        subtitle="Have a question or want to collaborate? I'd love to hear from you."
      />

      <BaseCard>
        <form @submit.prevent="submitForm" class="space-y-6">
          <div class="form-control">
            <label for="name" class="label font-semibold"> Full Name </label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              class="input input-bordered input-primary w-full"
              placeholder="John Doe"
            />
          </div>

          <div class="form-control">
            <label for="email" class="label font-semibold"> Email Address </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="input input-bordered input-primary w-full"
              placeholder="john@example.com"
            />
          </div>

          <div class="form-control">
            <label for="subject" class="label font-semibold"> Subject </label>
            <input
              id="subject"
              v-model="formData.subject"
              type="text"
              required
              class="input input-bordered input-primary w-full"
              placeholder="How can I help you?"
            />
          </div>

          <div class="form-control">
            <label for="message" class="label font-semibold"> Message </label>
            <textarea
              id="message"
              v-model="formData.message"
              required
              rows="6"
              class="textarea textarea-bordered textarea-primary w-full resize-none"
              placeholder="Tell me more about your project or inquiry..."
            ></textarea>
          </div>

          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            class="w-full"
            :loading="loading"
            :disabled="loading"
          >
            {{ loading ? 'Sending...' : 'Send Message' }}
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
