<!-- <script setup>
definePageMeta({ layout: 'mylayout' })
</script> -->

<template>
  <UContainer>
    
    <UPage>
    
        <!-- <UPageHero title="Skogsskötsel" description="Här visualiserar vi baserat på den kunskap som finns hur olika former av trakthyggesbruk och hyggesfria metoder påverkar förekomsten av mykorrhizasvampar under en skogsgeneration.
">  
</UPageHero> -->
        <!-- <UPageHeader
      headline="Skogsskötsel"
      title="Se hur skogsskötsel påverkar svampar"
      description="Här visualiserar vi baserat på den kunskap som finns hur olika former av trakthyggesbruk och hyggesfria metoder påverkar förekomsten av mykorrhizasvampar under en skogsgeneration.
"
    /> -->
</UPage>
</UContainer>
<USeparator />
<div class="bg-neutral-50 dark:bg-neutral-800/40">
   <UContainer>
    
    <UPage>
      <UPageGrid class="my-8">
      <UBlogPost
        title="Skötselmetoder"
        description="Läs om skötselmetoder och hur de påverkar mykorrhizasvampar."
        to="/skogsskotsel/skotselmetoder"
        class="cursor-pointer"
        icon="mdi:saw-blade"
        variant="outline"
        orientation="vertical"
        image="/images/skärm.png"
      />
     
      <!-- <UBlogPost
        title="Interaktiv modell"
        description="Visar hur hänsynsträd, kantzoner och andra faktorer påverkar svampars överlevnad och återetablering efter avverkning."
        to="/skogsskotsel/modell"
        class="cursor-pointer"
        icon="i-material-symbols-interactive-space-outline-rounded"
        variant="outline"
        orientation="vertical"
        image="/images/LandningSkogsbruk/trakthygge_efter_visa_visa_produktionsskog_.png"
      ><NuxtImg src="/images/LandningSkogsbruk/trakthygge_efter_visa_visa_produktionsskog_.png" width="500" height="300" format="webp" quality="80" class=" rounded-xl border border-neutral-100"/>
    </UBlogPost> -->
    
      <!-- <UBlogPost
        title="Diagram och staplar"
        description="Utforska data för svampgrupper vid olika skogsåldrar och skogsbrukssätt."
        to="/skogsskotsel/diagram"
        class="cursor-pointer"
        icon="i-carbon-chart-line-smooth"
        variant="outline"

        orientation="vertical"
image="/images/diagram.png"
      ><NuxtImg src="/images/diagram.png" width="500" height="300" format="webp" quality="80" class=" rounded-xl border border-neutral-100"/>
    </UBlogPost> -->
      <UBlogPost
      icon="i-heroicons-clipboard-document-list"

        title="Dokumentation"
        description="Se dokumentationen."
        to="/skogsskotsel/dokumentation"
        class="cursor-pointer grow-0"
        variant="outline"
        orientation="vertical"

      />
    </UPageGrid>
      </UPage>
  
  </UContainer>
</div>
   
</template>