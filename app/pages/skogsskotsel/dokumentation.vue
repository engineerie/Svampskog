<template>
    <UContainer>
     
      <UPage>
        <template #left>
          <div class="text-neutral-500 mt-6">
        
          </div>
   
        </template>
        <template #right><div></div></template>
        <UPageHeader
        headline="Skogsskötsel"
        title="Dokumentation"
        description="Information om var dataunderlaget kommer ifrån."
      />
        <skogDokumentation />
      </UPage>
    </UContainer>
  </template>
  
  <script setup>
  definePageMeta({ layout: 'mylayout' })
  </script>