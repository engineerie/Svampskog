<!-- app/layouts/TabsLayout.vue -->
<template>
    <div class="mx-6">
      <!-- Tabs Header -->
      <div class=" flex items-center gap-2 my-2">
        <UButton
          v-for="tab in tabs"
          :key="tab.value"
          :label="tab.label"
          :color="activeTab === tab.value ? 'primary' : 'neutral'"
          variant="ghost"
          size="sm"
          @click="activeTab = tab.value"
        />
      </div>
  
      <!-- Content Slot; the activeTab is passed as a slot prop -->
      <div class=" pt-4">
        <slot :activeTab="activeTab" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const props = defineProps({
    tabs: {
      type: Array,
      default: () => []
    },
    defaultTab: {
      type: String,
      default: ''
    }
  })
  
  const activeTab = ref(
    props.defaultTab || (props.tabs.length > 0 ? props.tabs[0].value : '')
  )
  
  // In case the defaultTab prop changes from the parent
  watch(() => props.defaultTab, (newVal) => {
    if (newVal) activeTab.value = newVal
  })
  </script>
  