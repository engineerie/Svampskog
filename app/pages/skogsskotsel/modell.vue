<template>
    <transition name="fade" mode="out-in">
      <UContainer v-if="!onboardingCompleted">
        <OnBoarding @go-to-model="onboardingCompleted = true" />
      </UContainer>
      <ModelC v-else />
    </transition>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  const onboardingCompleted = ref(false)
  definePageMeta({ layout: 'mylayout' })
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active { transition: opacity 0.3s ease-in-out; }
  .fade-enter-from,
  .fade-leave-to { opacity: 0; }
  </style>