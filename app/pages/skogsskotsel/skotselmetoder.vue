<template>
    <UContainer>
      
      <UPage>
        <template #left><div></div></template>
        <template #right><div></div></template>
        <UPageHeader
        class="mb-4"
        headline="Skogsskötsel"
        title="Skötselmetoder"
        description="Läs om olika skötselmetoder och deras påverkan på mykorrhizasvampar."
      />
        <infoSkogsskotsel />
      </UPage>
    </UContainer>
  </template>
  
  <script setup>
  definePageMeta({ layout: 'mylayout' })
  </script>