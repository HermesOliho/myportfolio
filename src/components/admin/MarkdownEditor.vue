<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import { Eye, PenLine } from 'lucide-vue-next'

interface Props {
  modelValue: string
  label?: string
  rows?: number
  required?: boolean
  error?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  rows: 8,
  placeholder: 'Write in Markdown...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const md = new MarkdownIt({ html: false, linkify: true, typographer: true })

const mode = ref<'edit' | 'preview'>('edit')
const rendered = ref('')

watch(
  () => props.modelValue,
  (val) => {
    rendered.value = md.render(val || '')
  },
  { immediate: true },
)

const handleInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}

const insertMarkdown = (before: string, after = '') => {
  const textarea = document.querySelector<HTMLTextAreaElement>('.md-editor-textarea')
  if (!textarea) return
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selected = props.modelValue.substring(start, end)
  const newVal =
    props.modelValue.substring(0, start) +
    before +
    selected +
    after +
    props.modelValue.substring(end)
  emit('update:modelValue', newVal)
}

const toolbar = [
  { label: 'B', title: 'Bold', action: () => insertMarkdown('**', '**') },
  { label: 'I', title: 'Italic', action: () => insertMarkdown('_', '_') },
  { label: 'H2', title: 'Heading', action: () => insertMarkdown('## ') },
  { label: '`', title: 'Inline code', action: () => insertMarkdown('`', '`') },
  { label: '🔗', title: 'Link', action: () => insertMarkdown('[', '](url)') },
  { label: '—', title: 'Divider', class: 'pointer-events-none opacity-30' },
  { label: '• List', title: 'Bullet list', action: () => insertMarkdown('- ') },
]

const charCount = computed(() => props.modelValue.length)
</script>

<template>
  <div class="form-control mb-6">
    <label v-if="label" class="label">
      <span class="label-text font-medium">
        {{ label }}
        <span v-if="required" class="text-error ml-0.5">*</span>
      </span>
      <span class="label-text-alt text-base-content/50">{{ charCount }} chars</span>
    </label>

    <!-- Toolbar + Mode Toggle -->
    <div class="flex items-center justify-between bg-base-200 border border-base-300 rounded-t-lg px-2 py-1 gap-1">
      <div class="flex gap-0.5">
        <button
          v-for="btn in toolbar"
          :key="btn.label"
          type="button"
          :title="btn.title"
          :class="['btn btn-ghost btn-xs font-mono', btn.class]"
          @click="btn.action?.()"
        >
          {{ btn.label }}
        </button>
      </div>
      <div class="join">
        <button
          type="button"
          :class="['btn btn-xs join-item', mode === 'edit' ? 'btn-primary' : 'btn-ghost']"
          @click="mode = 'edit'"
        >
          <PenLine class="w-3 h-3" /> Edit
        </button>
        <button
          type="button"
          :class="['btn btn-xs join-item', mode === 'preview' ? 'btn-primary' : 'btn-ghost']"
          @click="mode = 'preview'"
        >
          <Eye class="w-3 h-3" /> Preview
        </button>
      </div>
    </div>

    <!-- Editor -->
    <textarea
      v-show="mode === 'edit'"
      :value="modelValue"
      @input="handleInput"
      :rows="rows"
      :placeholder="placeholder"
      :required="required"
      :class="[
        'md-editor-textarea textarea textarea-bordered rounded-t-none w-full font-mono text-sm resize-y',
        error ? 'textarea-error' : 'textarea-primary',
      ]"
    />

    <!-- Preview -->
    <div
      v-show="mode === 'preview'"
      class="prose prose-sm max-w-none border border-base-300 rounded-b-lg p-4 min-h-32 bg-base-100"
      v-html="rendered"
    />

    <label v-if="error" class="label">
      <span class="label-text-alt text-error">{{ error }}</span>
    </label>
  </div>
</template>
