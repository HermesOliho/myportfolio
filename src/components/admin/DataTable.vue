<script setup lang="ts" generic="T extends Record<string, unknown>">
interface Column {
  key: string
  label: string
  sortable?: boolean
}

interface Props {
  columns: Column[]
  data: T[]
  loading?: boolean
}

defineProps<Props>()

defineSlots<{
  [key: `cell-${string}`]: (props: { item: T; value: unknown }) => unknown
  actions?: (props: { item: T }) => unknown
}>()
</script>

<template>
  <div class="overflow-x-auto rounded-box border border-base-300 bg-base-100">
    <table class="table table-zebra">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            scope="col"
            class="text-xs font-semibold uppercase tracking-wider text-base-content/70"
          >
            {{ column.label }}
          </th>
          <th
            v-if="$slots.actions"
            scope="col"
            class="text-right text-xs font-semibold uppercase tracking-wider text-base-content/70"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td
            :colspan="columns.length + ($slots.actions ? 1 : 0)"
            class="py-8 text-center text-sm text-base-content/70"
          >
            <div class="flex justify-center items-center">
              <span class="loading loading-spinner loading-md text-primary"></span>
              <span class="ml-2">Loading...</span>
            </div>
          </td>
        </tr>
        <tr v-else-if="data.length === 0">
          <td
            :colspan="columns.length + ($slots.actions ? 1 : 0)"
            class="py-8 text-center text-sm text-base-content/70"
          >
            No data available
          </td>
        </tr>
        <tr v-else v-for="(item, index) in data" :key="index">
          <td
            v-for="column in columns"
            :key="column.key"
            class="whitespace-nowrap text-sm text-base-content"
          >
            <slot :name="`cell-${column.key}`" :item="item" :value="item[column.key]">
              {{ item[column.key] }}
            </slot>
          </td>
          <td v-if="$slots.actions" class="whitespace-nowrap text-right text-sm font-medium">
            <slot name="actions" :item="item"></slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
