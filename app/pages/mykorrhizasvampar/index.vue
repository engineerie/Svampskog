<template>
    <UContainer>
      <UPage>
        <UPageHero title="Svampar" description="Här kan du ta reda på vilka mykorrhizasvampar som kan finns i en skog baserat på dels DNA-analyser av svampmycel i jordprover, dels vår samlade kunskap om var olika arters fruktkroppar förekommer."/>
  <!-- <UPageHeader
      headline="Svampar"
      title="Utforska svampar i olika skogar"
      description="Här visualiserar vi baserat på den kunskap som finns hur olika former av trakthyggesbruk och hyggesfria metoder påverkar förekomsten av mykorrhizasvampar under en skogsgeneration.
"
    /> -->
      
        <UPageGrid class="mt-8">


        <UPageCard
title="Sök på miljö"
description="Sök på svenska skogsmiljöer för att se vilka mykorrhizasvampar som kan finnas där."
icon="i-healthicons-forest-outline"
to="/mykorrhizasvampar/start"
class="cursor-pointer "
variant="outline"
><NuxtImg src="/images/EDNA_bilder_skog/Norr_Tallskog_91_Lingon_grupp.png" width="500" height="300" format="webp" quality="80" class=" rounded-xl border border-neutral-100"/>
</UPageCard>
       <div></div>
       <div></div>
 
      <UPageCard
title="Dokumentation"
description="Information om hur du använder artsidan och var underlaget kommer ifrån."
icon="i-heroicons-clipboard-document-list"
to="/svampardocs"
variant="outline"

/>
</UPageGrid>
        </UPage>
    
    </UContainer>
  </template>
