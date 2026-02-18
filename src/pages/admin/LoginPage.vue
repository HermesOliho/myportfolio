<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/admin/useAuthStore'
import FormInput from '@/components/admin/FormInput.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''
  
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    })
    
    // Redirect to dashboard on success
    router.push('/admin/dashboard')
  } catch (error: any) {
    errorMessage.value = error.message || 'Login failed. Please check your credentials.'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Portfolio Admin
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sign in to manage your portfolio
        </p>
      </div>
      
      <form class="mt-8 space-y-6 bg-white p-8 rounded-lg shadow" @submit.prevent="handleSubmit">
        <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <span class="text-red-400">⚠️</span>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
            </div>
          </div>
        </div>

        <FormInput
          v-model="email"
          label="Email address"
          type="email"
          placeholder="admin@example.com"
          required
        />

        <FormInput
          v-model="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          required
        />

        <div>
          <button
            type="submit"
            :disabled="authStore.loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="authStore.loading" class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Signing in...
            </span>
            <span v-else>Sign in</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
