<!-- <script setup>
definePageMeta({ layout: 'mylayout' })
</script> -->

<template>
  <UContainer>
    <UPage>
        <template #left>
          <div >
          </div>
         
        </template>
        <template #right><div></div></template>
        <UPageHeader
      headline="Skogsskötsel"
      title="Se hur skogsskötsel påverkar svampar"
      description="Här visualiserar vi baserat på den kunskap som finns hur olika former av trakthyggesbruk och hyggesfria metoder påverkar förekomsten av mykorrhizasvampar under en skogsgeneration.
"
    />
    <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <UPageCard
        title="Skötselmetoder"
        description="Läs om skötselmetoder och hur de påverkar mykorrhizasvampar."
        to="/skogsskotsel/skotselmetoder"
        class="cursor-pointer"
        icon="mdi:saw-blade"
      />
     
      <UPageCard
        title="Interaktiv modell"
        description="Visar hur hänsynsträd, kantzoner och andra faktorer påverkar svampars överlevnad och återetablering efter avverkning."
        to="/skogsskotsel/modell"
        class="cursor-pointer"
        icon="i-material-symbols-interactive-space-outline-rounded"
      />
    
      <UPageCard
        title="Diagram och staplar"
        description="Utforska data för svampgrupper vid olika skogsåldrar och skogsbrukssätt."
        to="/skogsskotsel/diagram"
        class="cursor-pointer"
        icon="i-carbon-chart-line-smooth"
      />
      <UPageCard
      icon="i-heroicons-clipboard-document-list"

        title="Dokumentation"
        description="Se dokumentationen."
        to="/skogsskotsel/dokumentation"
        class="cursor-pointer"
      />
    </div>
      </UPage>
  
  </UContainer>
</template>