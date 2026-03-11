<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { UploadCloud, X, ImageIcon } from 'lucide-vue-next'

interface Props {
  modelValue?: File | null
  previewUrl?: string
  accept?: string
  maxSizeMb?: number
  label?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  accept: 'image/*',
  maxSizeMb: 5,
  label: 'Image',
})

const emit = defineEmits<{
  'update:modelValue': [file: File | null]
  'update:previewUrl': [url: string]
}>()

const isDragging = ref(false)
const localError = ref('')
const localPreview = ref(props.previewUrl ?? '')

const displayError = computed(() => props.error || localError.value)

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) processFile(file)
}

const handleFileInput = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) processFile(file)
}

const processFile = (file: File) => {
  localError.value = ''
  if (!file.type.startsWith('image/')) {
    localError.value = 'Only image files are allowed.'
    return
  }
  if (file.size > props.maxSizeMb * 1024 * 1024) {
    localError.value = `File size must be less than ${props.maxSizeMb}MB.`
    return
  }
  // Revoke previous object URL to avoid memory leaks
  if (localPreview.value && localPreview.value !== props.previewUrl) {
    URL.revokeObjectURL(localPreview.value)
  }
  const url = URL.createObjectURL(file)
  localPreview.value = url
  emit('update:modelValue', file)
  emit('update:previewUrl', url)
}

onUnmounted(() => {
  if (localPreview.value && localPreview.value !== props.previewUrl) {
    URL.revokeObjectURL(localPreview.value)
  }
})

const clearImage = () => {
  if (localPreview.value && localPreview.value !== props.previewUrl) {
    URL.revokeObjectURL(localPreview.value)
  }
  localPreview.value = ''
  emit('update:modelValue', null)
  localError.value = ''
}

const fileInputRef = ref<HTMLInputElement | null>(null)
const openFilePicker = () => fileInputRef.value?.click()
</script>

<template>
  <div class="form-control mb-6">
    <label v-if="label" class="label">
      <span class="label-text font-medium">{{ label }}</span>
    </label>

    <!-- Preview -->
    <div v-if="localPreview" class="mb-3 relative inline-block">
      <img
        :src="localPreview"
        alt="Preview"
        class="max-h-48 rounded-lg border border-base-300 object-contain"
      />
      <button
        type="button"
        @click="clearImage"
        class="btn btn-error btn-xs btn-circle absolute -top-2 -right-2"
        title="Remove image"
      >
        <X class="w-3 h-3" />
      </button>
    </div>

    <!-- Drop zone -->
    <div
      v-else
      :class="[
        'border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors',
        isDragging
          ? 'border-primary bg-primary/10'
          : displayError
            ? 'border-error bg-error/5'
            : 'border-base-300 hover:border-primary hover:bg-base-200',
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="openFilePicker"
    >
      <UploadCloud
        :class="['w-10 h-10', isDragging ? 'text-primary' : 'text-base-content/40']"
      />
      <div class="text-center">
        <p class="text-sm font-medium">Drag & drop an image here</p>
        <p class="text-xs text-base-content/60 mt-1">or click to browse</p>
        <p class="text-xs text-base-content/40 mt-1">
          <ImageIcon class="inline w-3 h-3 mr-1" />
          Max {{ maxSizeMb }}MB
        </p>
      </div>
    </div>

    <!-- Change button when preview exists -->
    <button
      v-if="localPreview"
      type="button"
      @click="openFilePicker"
      class="btn btn-outline btn-sm mt-2 w-fit"
    >
      <UploadCloud class="w-4 h-4" />
      Change image
    </button>

    <!-- Hidden file input -->
    <input
      ref="fileInputRef"
      type="file"
      :accept="accept"
      class="hidden"
      @change="handleFileInput"
    />

    <label v-if="displayError" class="label">
      <span class="label-text-alt text-error">{{ displayError }}</span>
    </label>
  </div>
</template>
