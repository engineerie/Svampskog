<template>
      
    <div class="text-base/7">
        <UCard variant="subtle" class="mb-8">
            <template #header>
                <div class="text-2xl font-bold">Inga åtgärder</div>

            </template>
        <NuxtImg src="/images/ingen_åtgärd.png" width="800" height="500" format="webp" quality="80" class="mb-4  rounded-xl"/>

        <div class="text-md font-bold mt-3 mb-1">Beskrivning</div>

            Beståndet lämnas för fri utveckling tills vidare. Kan t ex vara en frivillig naturvårdsavsättning eller en skog med områdesskydd. 

            <div class="text-md font-bold mt-3 mb-1"> Påverkan på mykorrhizasvampar</div>
Samhället mykorrhizasvampar lever vidare med de arter som finns i skogen. Förekomst av matsvampar oftast bra i skogar som sköts på detta sätt. Rödlistade arter på platsen fortlever. Svamparnas mycelindivider i marken kan bli gamla som träd eller äldre, och växa och bli många m2 stora där det kontinuerligt finns träd. Sker plockhuggning av enstaka träd utspritt i beståndet har det minimal påverkan på förekomsten av mykorrhizasvampar. 
<template #footer>
    <UCollapsible class="flex flex-col gap-2 w-full">
    <UButton
    class="w-fit"
      label="Tidslinje"
      color="neutral"
      variant="ghost"
      trailing-icon="i-lucide-chevron-down"
      
    />

    <template #content>
      <Timeline framework="naturskydd" class="w-full"/>

        
    </template>
  </UCollapsible>
  <!-- <USeparator />
  <UCollapsible class="flex flex-col gap-2 w-48">
    <UButton
    class="w-fit"
      label="Diagram"
      color="neutral"
      variant="ghost"
      trailing-icon="i-lucide-chevron-down"
      
    />

    <template #content>
        <div class="h-48 bg-green-50" >

        </div>
    </template>
  </UCollapsible> -->
        </template>

</UCard>
<UCard variant="subtle" class="mb-8">
  <template #header>
    <div class="text-2xl font-bold">Trakthyggesbruk</div>
  </template>
  <NuxtImg src="/images/kalhygge.png" width="800" height="500" format="webp" quality="80" class="mb-4 rounded-xl"/>
  <div>
    <div class="text-md font-bold mt-3 mb-1">Beskrivning</div>

    Sedan 1950-talet det dominerande skogsskötselsystemet som går ut på att skapa likåldriga, större bestånd, trakter, med normalt ett trädslag. Hela beståndet behandlas samtidigt. Standardskötseln är: avverkning, markberedning, plantering, röjning, ett par gallringar och åter avverkning efter 60 till +100 år, beroende på bördighet och var i Sverige. Trakthuggning sker nästan uteslutande med kalavverkning och plantering, undantagsvis med fröträd som avverkas efter plantföryngring skett naturligt.
    <div class="text-md font-bold mt-3 mb-1">Påverkan på mykorrhizasvampar</div>
    Mykorrhizasvampar försvinner nästan helt efter avverkning eftersom de är beroende av sin symbios med träd. Svampmycel överlever på rötter av hänsynsträd, småplantor som lämnas med naturlig föryngring och längs skogskanter. Plantskoleplantor medför några få arter mykorrhizasvampar som ersätts med tiden av arter etablerade från sporer. Matsvampar saknas direkt efter avverkning men återkommer efter 10–20 år. Rödlistade arter är oftast för ovanliga för att spridas in och etableras.
  </div>
  <template #footer>    <UCollapsible class="flex flex-col gap-2 w-full">
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
  </UCollapsible></template>
</UCard>

<UAlert variant="subtle" class="mb-8" title="Med hyggesfria metoder räknas alla skogsskötselformer där skogsmarken alltid har ett trädskikt. 
"/>

<UCard variant="subtle" class="mb-8">
  <template #header >
  <div class="flex gap-2">
    <div class="text-2xl font-bold">Luckhuggning</div>
<UBadge label="Hyggesfritt" variant="subtle" size="lg"/>
  </div>

  </template>
  <NuxtImg src="/images/luckhuggning.png" width="800" height="500" format="webp" quality="80" class="mb-4 rounded-xl"/>
  <div>
    <div class="text-md font-bold mt-3 mb-1">Beskrivning</div>

    Innebär att träd avverkas i luckor med 20-50 m storlek vilket motsvarar luckor på ca 500–2 500 m2. När ny skog vuxit upp kan luckorna utvidgas eller nya luckor tas upp i beståndet. Systematiska former av luckhuggning är schackrutehuggning och kanthuggning. Luckhuggning fungerar även i enskiktad granskog. Luckor större än 2 500 m2 räknas som hyggen enligt Skogsstyrelsens definition.
    <div class="text-md font-bold mt-3 mb-1">Påverkan på mykorrhizasvampar</div>
    Som trakthygge i liten skala. Ett mellanting mellan kalhygge och blädning. Hur stor påverkan blir beror på luckornas storlek. Kanteffekten gör att mykorrhiazasvampar lever vidare i rötter från omgivande träd ca 10 meter in i luckorna. Med luckdiameter på högst 20 meter är påverkan mycket liten. Med större diameter tynar mykorrhizasvamparna bort och dör i mitten av luckorna. Återetablering av mykorrhizasvampar sker då som på hyggen, främst från sporer som sprids in från grannskapet. Möjligheten för mycel av förekommande ovanligare och rödlistade arter att fortleva i en skog är stor med små luckor och minskar med större luckor.
  </div>
  <template #footer>    <UCollapsible class="flex flex-col gap-2 w-full">
    <UButton
    class="w-fit"
      label="Tidslinje"
      color="neutral"
      variant="ghost"
      trailing-icon="i-lucide-chevron-down"
      
    />

    <template #content>
      <Timeline framework="luckhuggning" class="w-full"/>

        
    </template>
  </UCollapsible></template>
</UCard>

<UCard variant="subtle" class="mb-8">
  <template #header>
    <div class="flex gap-2">
    <div class="text-2xl font-bold">Överhållen skärm</div>
<UBadge label="Hyggesfritt" variant="subtle" size="lg"/>
  </div>
  </template>
  <NuxtImg src="/images/skärm.png" width="800" height="500" format="webp" quality="80" class="mb-4 rounded-xl"/>
  <div>
    <div class="text-md font-bold mt-3 mb-1">Beskrivning</div>

    Överhållen skärm innebär att antalet lämnade skyddande skärmträd är fler än vid en vanlig fröträdsställning och att de sparas längre än vid normalt skärmskogsbruk. Skärmträden avvecklas successivt i flera steg medan trädplantor etableras och växer till. För att räknas som en hyggesfri metod enligt Skogsstyrelses definition måste minst 25 träd per hektar lämnas att ingå i det nya beståndet. Tall och bok fungerar bra att föryngra under överhållen skärm. Gran är vindkänsligare och lämpar sig därför mindre bra.  Överhållen skärm kan vara ett bra val i skogar med naturvärden som vill ha ljus och värme.
    <div class="text-md font-bold mt-3 mb-1">Påverkan på mykorrhizasvampar</div>
    Troligen begränsad påverkan på mykorrhizasvampar.  De allra flesta mycelen kommer att fortleva i rötterna av skärmträden även om det blir färre fruktkroppar. Förmodligen kommer många av dessa mycel etableras på uppväxande naturligt etablerade trädplantorna. Bedömningen är därför att merparten av alla arter kommer att fortleva, även ovanligare och om det förekommer rödlistade arter. Under tiden med skärmträd och yngre träd är matsvampstillgången lägre.
  </div>
  <template #footer>    <UCollapsible class="flex flex-col gap-2 w-full">
    <UButton
    class="w-fit"
      label="Tidslinje"
      color="neutral"
      variant="ghost"
      trailing-icon="i-lucide-chevron-down"
      
    />

    <template #content>
      <Timeline framework="skärmträd" class="w-full"/>

        
    </template>
  </UCollapsible></template>
</UCard>

<UCard variant="subtle" class="mb-8">
  <template #header>
    <div class="flex gap-2">
    <div class="text-2xl font-bold">Blädning</div>
<UBadge label="Hyggesfritt" variant="subtle" size="lg"/>
  </div>
  </template>
  <NuxtImg src="/images/blädning.png" width="800" height="500" format="webp" quality="80" class="mb-4 rounded-xl"/>
  <div>
    <div class="text-md font-bold mt-3 mb-1">Beskrivning</div>

    Innebär ofta uttag om 20-30 procent av virkesvolymen med intervall på 15-30 år. Avverkning görs med målet att skapa och bibehålla en fullskiktad skog, det vill säga en skog med träd i alla storlekar. Därför fungerar blädning bäst med skuggtåliga trädslag, som gran och bok. Marken måste vara tillräckligt bördig, för att plantor och småträd ska klara att växa i det slutna beståndet. Blädning lämpar sig i skogar där man vill bevara en fuktigare och mer skyddad miljö.
    <div class="text-md font-bold mt-3 mb-1">Påverkan på mykorrhizasvampar</div>
    Påverkan på mykorrhizasvampar är förmodligen försumbar då förändringen av deras markmiljö är liten och det kontinuerligt finns levande trädrötter i princip överallt i skogen. I princip lever alla mycel av mykorrhizasvampar vidare efter en blädning. Ovanligare och rödlistade arter i beståndet kommer kunna finnas kvar. Mängden matsvampar är i stort sett opåverkad, men kan minska något några år direkt en blädning.
  </div>
  <template #footer>    <UCollapsible class="flex flex-col gap-2 w-full">
    <UButton
    class="w-fit"
      label="Tidslinje"
      color="neutral"
      variant="ghost"
      trailing-icon="i-lucide-chevron-down"
      
    />

    <template #content>
      <Timeline framework="blädning" class="w-full"/>

        
    </template>
  </UCollapsible></template>
</UCard>
</div>
</template>