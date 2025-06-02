<template>
    <UContainer>
      <UPage>
  
      <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <UPageCard
title="Sök på miljö"
description="Sök på svenska skogsmiljöer för att se vilka mykorrhizasvampar som kan finnas där."
icon="i-healthicons-forest-outline"
to="/mykorrhizasvampar/start"
class="cursor-pointer "
variant="ghost"
><NuxtImg src="/images/EDNA_bilder_skog/Norr_Tallskog_91_Lingon_grupp.png" width="500" height="300" format="webp" quality="80" class=" rounded-xl border border-neutral-100"/>
</UPageCard>
       <div></div>
       <div></div>
 
      <UPageCard
title="Dokumentation"
description="Information om hur du använder artsidan och var underlaget kommer ifrån."
icon="i-heroicons-clipboard-document-list"
to="/svampardocs"
variant="ghost"

/>
      </div>
        </UPage>
    
    </UContainer>
  </template>
