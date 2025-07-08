<template>
    <UContainer>
      <UPage>
        <UPageHero title="Svampar" description="Här kan du ta reda på vilka mykorrhizasvampar som kan finns i en skog baserat på dels DNA-analyser av svampmycel i jordprover, dels vår samlade kunskap om var olika arters fruktkroppar förekommer.">
  <!-- <UPageHeader
      headline="Svampar"
      title="Utforska svampar i olika skogar"
      description="Här visualiserar vi baserat på den kunskap som finns hur olika former av trakthyggesbruk och hyggesfria metoder påverkar förekomsten av mykorrhizasvampar under en skogsgeneration.
"
    /> -->
     <!-- <template #top>
        <div
          class="absolute rounded-full dark:bg-(--ui-info) blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80" ></div>

        <StarsBg />
      </template> -->
    <!-- <template #headline><Icon name="i-lineicons-mushroom-1" class="size-10 text-primary-500" />
    </template> -->
      </UPageHero>
    </UPage>
    </UContainer>
    <USeparator />
    <div class="bg-neutral-50 dark:bg-neutral-800/40">
      <UContainer>
      <UPage>
      
        <UPageGrid class="my-8">


        <UBlogPost
title="Sök på miljö"
description="Sök på svenska skogsmiljöer för att se vilka mykorrhizasvampar som kan finnas där."
icon="i-healthicons-forest"
to="/mykorrhizasvampar/start"
class="cursor-pointer "
variant="outline"
image="/images/EDNA_bilder_skog/Norr_Tallskog_91_Lingon_grupp.png"
><NuxtImg src="/images/EDNA_bilder_skog/Norr_Tallskog_91_Lingon_grupp.png" width="500" height="300" format="webp" quality="80" class=" rounded-xl border border-neutral-100"/>
</UBlogPost>
<UBlogPost title="Svampkunskap" description="modul för svampkännedom lanseras i slutet av augusti 2025"/>
<div></div>

 
      <UBlogPost
title="Dokumentation"
description="Information om hur du använder artsidan och var underlaget kommer ifrån."
icon="i-heroicons-clipboard-document-list"
to="/svampardocs"
variant="outline"
/>
</UPageGrid>
        </UPage>
    
    </UContainer>
    </div>
  </template>
