<template>
  <div class="flex items-start gap-4 my-3">
    <UIcon :name="icon" class="shrink-0 size-5 mt-1" :class="colorClass" />
    <div class="min-w-0 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  icon?: string
  color?: string
}>(), {
  icon: 'i-heroicons-check-circle',
  color: 'text-neutral-700'
})

const colorClass = computed(() => props.color || 'text-neutral-700')
</script>
