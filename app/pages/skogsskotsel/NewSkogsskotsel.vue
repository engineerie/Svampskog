<template>
    <div class="bg-neutral-50 flex-1">
        <div class="bg-white border-b border-neutral-200">
            <UContainer class="flex justify-between py-8 gap-8">
                <div v-for="method in methods" :key="method.id" @click="selectedId = method.id" :class="[
                    'w-full transition-all hover:opacity-100 border border-neutral-200 rounded-sm overflow-hidden h-fit shadow hover:shadow-md relative hover:border-neutral-300 cursor-pointer',
                    selectedId === null
                        ? 'opacity-100'
                        : (selectedId === method.id ? 'opacity-100' : 'opacity-40')
                ]">
                    <UBadge v-if="method.type" class="absolute top-2 right-2" :label="method.type" color="neutral"
                        variant="subtle" />
                    <NuxtImg :src="method.image" width="300" height="160" class=" w-full h-full" />
                    <h1 class="text-lg p-2 px-3 font-medium">{{ method.title }}</h1>
                </div>


            </UContainer>
        </div>

        <UContainer>
            <UPage>
                <template #right>
                    <placeholder />
                </template>
                <template #left>
                    <placeholder v-if="selectedMethod === null" />
                    <div v-else
                        :class="['w-full justify-center m-4 h-fit', selectedMethod === null ? 'hidden' : 'flex']">
                        <UButton label="Tillbaka till översikt" variant="outline" color="neutral"
                            @click="selectedId = null" icon="i-heroicons-arrow-left" />
                    </div>
                </template>
                <div v-if="selectedMethod === null">
                    <UPageHeader title="Se hur skogsskötsel påverkar svampar"
                        description="Lär dig om hur trakthyggesbruk och olika former av hyggesfria metoder kan påverka förekomsten av mykorrhizasvampar.">
                        <!-- <img src="public/images/skärm.png"
                    alt="Illustration" class="h-96 w-full rounded-md shadow " /> -->
                    </UPageHeader>

                </div>
                <div v-else>
                    <UPageHeader :title="selectedMethod.title" :description="selectedMethod.shortdescription">

                    </UPageHeader>


                </div>
            </UPage>
            <UPage>
                <template #left>
                    <UNavigationMenu v-if="selectedMethod === null" :items="pages" orientation="vertical" />
                    <placeholder v-else />
                </template>
                <div v-if="selectedMethod === null">
                    <div class="mt-8 gap-3">
                        <!-- <NuxtImg src="/images/Adobe/Forestry Sweden Image.jpeg" width="400" height="400" format="webp"
                            alt="Illustration" class=" rounded-md border border-neutral-200 " /> -->
                        <NuxtImg src="/images/Adobe/Forestry Sweden Image.jpeg" width="1000" height="300" format="webp"
                            alt="Illustration" class=" rounded-sm border border-neutral-200 " />
                    </div>
                    <h1 class="text-2xl my-6 font-bold text-neutral-900">Träd och svamp hänger ihop</h1>
                    <div class="text-base/8">
                        Mykorrhizasvampar lever i symbios med trädens rötter och hjälper dem att ta upp vatten och
                        näring ur marken. I
                        utbyte får svamparna socker från träden. Svamparnas mikroskopiskt tunna hyfer är om- och invuxna
                        i trädens
                        tunna rötter och förstorar trädens rotsystem tusenfalt. När träd avverkas försvinner
                        sockertillförseln och
                        svamparna dör om de
                        inte samtidigt är kopplade till andra rötter. <span class="font-bold">Grundprincipen är att
                            mykorrhizasvampar
                            överlever
                            där det finns
                            levande träd.</span> </div>
                    <div class="flex justify-between py-8 gap-4">
                        <div v-for="method in methods" :key="method.id" @click="selectedId = method.id" :class="[
                            'bg-white w-full transition-all hover:opacity-100 border border-neutral-200 rounded-sm overflow-hidden h-fit shadow hover:shadow-md relative hover:border-neutral-300 cursor-pointer',
                            selectedId === null
                                ? 'opacity-100'
                                : (selectedId === method.id ? 'opacity-100' : 'opacity-40')
                        ]">
                            <UBadge v-if="method.type" class="absolute top-2 right-2" :label="method.type"
                                color="neutral" variant="subtle" />
                            <NuxtImg :src="method.image" width="300" height="160" class=" w-full h-full" />
                            <h1 class="text-sm p-2 px-2 font-medium">{{ method.title }}</h1>
                        </div>


                    </div>
                    <TreeGrowthChart :chart-type="true" class="my-10" />
                    <div class="text-base/8 mt-4">
                        När nya träd växer upp sker återetablering främst genom sporer från
                        omgivande skog. Artantalet i den nya skogen kan vara lika stort som i den gamla, men
                        artsammansättningen
                        kommer se olika ut innan och
                        efter avverkning.
                        Vanliga arter återkommer, medan
                        ovanliga och skyddsvärda arter kan försvinna från skogen för alltid.
                    </div>
                    <h1 class="text-2xl font-bold text-neutral-900 mt-6 mb-4">Vanliga frågor</h1>
                    <UAccordion :items="questions" />
                </div>
                <div v-else>
                    <div class="text-base/8">
                        {{ selectedMethod?.description }} </div>
                    <div class="text-base/8">
                        <h1 class="text-2xl font-bold text-neutral-900 mt-6 mb-4">Påverkan på mykorrhizasvamp</h1>

                        {{ selectedMethod?.descriptionsvamp }}
                    </div>
                    <ForestryChartMain :parentSelectedFrameworks=[selectedMethod.id] />
                </div>

                <template #right></template>
            </UPage>
        </UContainer>
    </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem, AccordionItem } from '@nuxt/ui'
import { ref, computed } from 'vue'

interface Method {
    id: 'naturskydd' | 'trakthygge' | 'luckhuggning' | 'skärmträd' | 'blädning'
    title: string
    image: string
    shortdescription: string
    description: string
    descriptionsvamp: string
    type?: 'Hyggesfritt'
}

const selectedId = ref<Method['id'] | null>(null)
const selectedMethod = computed<Method | null>(() => methods.value.find(method => method.id === selectedId.value) ?? null)

const methods = ref<Method[]>([
    {
        id: 'naturskydd',
        title: 'Inga åtgärder',
        image: 'images/ingen_åtgärd.png',
        shortdescription: 'Orörd skog',
        description:
            'Beståndet lämnas för fri utveckling tills vidare. Kan t ex vara en frivillig naturvårdsavsättning eller en skog med områdesskydd.',
        descriptionsvamp:
            'Samhället mykorrhizasvampar lever vidare med de arter som finns i skogen. Förekomst av matsvampar oftast bra i skogar som sköts på detta sätt. Rödlistade arter på platsen fortlever. Svamparnas mycelindivider i marken kan bli gamla som träd eller äldre, och växa och bli många m2 stora där det kontinuerligt finns träd. Sker plockhuggning av enstaka träd utspritt i beståndet har det minimal påverkan på förekomsten av mykorrhizasvampar.',
    },
    {
        id: 'trakthygge',
        title: 'Trakthygge',
        image: 'images/kalhygge.png',
        shortdescription: 'Kalavverkning med hänsyn',
        description:
            'Sedan 1950-talet det dominerande skogsskötselsystemet som går ut på att skapa likåldriga, större bestånd, trakter, med normalt ett trädslag. Hela beståndet behandlas samtidigt. Standardskötseln är: avverkning, markberedning, plantering, röjning, ett par gallringar och åter avverkning efter 60 till +100 år, beroende på bördighet och var i Sverige. Trakthuggning sker nästan uteslutande med kalavverkning och plantering, undantagsvis med fröträd som avverkas efter plantföryngring skett naturligt.',
        descriptionsvamp:
            'Mykorrhizasvampar försvinner nästan helt efter avverkning eftersom de är beroende av sin symbios med träd. Svampmycel överlever på rötter av hänsynsträd, småplantor som lämnas med naturlig föryngring och längs skogskanter. Plantskoleplantor medför några få arter mykorrhizasvampar som ersätts med tiden av arter etablerade från sporer. Matsvampar saknas direkt efter avverkning men återkommer efter 10–20 år. Rödlistade arter är oftast för ovanliga för att spridas in och etableras.',
    },
    {
        id: 'luckhuggning',
        title: 'Luckhuggning',
        image: 'images/luckhuggning.png',
        shortdescription: 'Mindre ytor kalavverkas',
        type: 'Hyggesfritt',
        description:
            'Innebär att träd avverkas i luckor med 20–50 m storlek vilket motsvarar luckor på ca 500–2 500 m². När ny skog vuxit upp kan luckorna utvidgas eller nya luckor tas upp i beståndet. Systematiska former av luckhuggning är schackrutehuggning och kanthuggning. Luckhuggning fungerar även i enskiktad granskog. Luckor större än 2 500 m² räknas som hyggen enligt Skogsstyrelsens definition.',
        descriptionsvamp:
            'Som trakthygge i liten skala. Ett mellanting mellan kalhygge och blädning. Hur stor påverkan blir beror på luckornas storlek. Kanteffekten gör att mykorrhizasvampar lever vidare i rötter från omgivande träd ca 10 meter in i luckorna. Med luckdiameter på högst 20 meter är påverkan mycket liten. Med större diameter tynar mykorrhizasvamparna bort och dör i mitten av luckorna. Återetablering sker då som på hyggen, främst från sporer. Möjligheten för ovanligare och rödlistade arter att fortleva är stor med små luckor, men minskar med större.',
    },
    {
        id: 'skärmträd',
        title: 'Överhållen skärm',
        image: 'images/skärm.png',
        shortdescription: 'Avverkning i tre sted under 20 år ',
        type: 'Hyggesfritt',
        description:
            'Överhållen skärm innebär att antalet lämnade skyddande skärmträd är fler än vid en vanlig fröträdsställning och att de sparas längre än vid normalt skärmskogsbruk. Skärmträden avvecklas successivt i flera steg medan trädplantor etableras och växer till. För att räknas som en hyggesfri metod enligt Skogsstyrelsens definition måste minst 25 träd per hektar lämnas att ingå i det nya beståndet. Tall och bok fungerar bra att föryngra under överhållen skärm. Gran är vindkänsligare och lämpar sig därför mindre bra. Överhållen skärm kan vara ett bra val i skogar med naturvärden som vill ha ljus och värme.',
        descriptionsvamp:
            'Troligen begränsad påverkan på mykorrhizasvampar. De flesta mycelen kommer att fortleva i rötterna av skärmträden även om det blir färre fruktkroppar. Många av dessa mycel etableras troligen på uppväxande trädplantor. Merparten av alla arter, även ovanliga och rödlistade, kommer troligen fortleva. Matsvampstillgången kan vara lägre under tiden.',
    },
    {
        id: 'blädning',
        title: 'Blädning',
        image: 'images/blädning.png',
        shortdescription: 'Enstaka träd gallras',
        type: 'Hyggesfritt',
        description:
            'Innebär ofta uttag om 20–30 procent av virkesvolymen med intervall på 15–30 år. Avverkning görs med målet att skapa och bibehålla en fullskiktad skog, det vill säga en skog med träd i alla storlekar. Därför fungerar blädning bäst med skuggtåliga trädslag, som gran och bok. Marken måste vara tillräckligt bördig, för att plantor och småträd ska klara att växa i det slutna beståndet. Blädning lämpar sig i skogar där man vill bevara en fuktigare och mer skyddad miljö.',
        descriptionsvamp:
            'Påverkan på mykorrhizasvampar är förmodligen försumbar då förändringen av deras markmiljö är liten och det kontinuerligt finns levande trädrötter i princip överallt i skogen. I princip lever alla mycel vidare efter en blädning. Ovanliga och rödlistade arter i beståndet kommer kunna finnas kvar. Mängden matsvampar är i stort sett opåverkad, men kan minska något några år efter en blädning.',
    }
])

const pages = ref<NavigationMenuItem[]>([
    {
        label: 'Information som diagram',
        icon: 'i-heroicons-presentation-chart-line',
        badge: '',
    },
    {
        label: 'Help',
        icon: 'i-lucide-circle-help',
        disabled: false
    }
])

const questions = ref<AccordionItem[]>([
    {
        label: 'Vilka arter finns i min skog?',
        // icon: 'i-lucide-box',
        content: 'Vilka arter som finns beror på många faktorer, så som vilka träd som växer där, hur gammal skogen är och vad som växer på marken. Du kan söka efter arter baserat skogsmiljö här. '
    },
    {
        label: 'Kommer mit svampställe tillbaka efter avverkningen?',
        // icon: 'i-lucide-smile',
        content: 'Det kan finnas ca 200 olika arter mykorrhizsvampar i en uppvuxen skog'
    },
    {
        label: 'Hur påverka markberedningen?',
        // icon: 'i-lucide-swatch-book',
        content: 'Det är framförallt avverkningen i sig som påverkar mest, då sockertillförseln till svamparna stängs av. Så det mesta är redan dött när det är dags för markberedning'
    },

])
</script>