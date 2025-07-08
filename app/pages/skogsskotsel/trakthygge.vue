<template>
    


    <div class="text-2xl font-bold">Trakthyggesbruk</div>
 
  <NuxtImg src="/images/kalhygge.png" width="400" height="250" format="webp" quality="80" class="mb-4 rounded-xl"/>
  <div>
    <div class="text-md font-bold mt-3 mb-1">Beskrivning</div>

    Sedan 1950-talet det dominerande skogsskötselsystemet som går ut på att skapa likåldriga, större bestånd, trakter, med normalt ett trädslag. Hela beståndet behandlas samtidigt. Standardskötseln är: avverkning, markberedning, plantering, röjning, ett par gallringar och åter avverkning efter 60 till +100 år, beroende på bördighet och var i Sverige. Trakthuggning sker nästan uteslutande med kalavverkning och plantering, undantagsvis med fröträd som avverkas efter plantföryngring skett naturligt.
    <div class="text-md font-bold mt-3 mb-1">Påverkan på mykorrhizasvampar</div>
    Mykorrhizasvampar försvinner nästan helt efter avverkning eftersom de är beroende av sin symbios med träd. Svampmycel överlever på rötter av hänsynsträd, småplantor som lämnas med naturlig föryngring och längs skogskanter. Plantskoleplantor medför några få arter mykorrhizasvampar som ersätts med tiden av arter etablerade från sporer. Matsvampar saknas direkt efter avverkning men återkommer efter 10–20 år. Rödlistade arter är oftast för ovanliga för att spridas in och etableras.
  </div>
     <UCollapsible class="flex flex-col gap-2 w-full">
    <UButton
    class="w-fit"
      label="Tidslinje"
      color="neutral"
      variant="ghost"
      trailing-icon="i-lucide-chevron-down"
      
    />

    <template #content>
      <Timeline framework="trakthygge" class="w-full"/>

        
    </template>
  </UCollapsible>
</template>

<script setup>
definePageMeta({ layout: 'skogsskotsel' })

</script>