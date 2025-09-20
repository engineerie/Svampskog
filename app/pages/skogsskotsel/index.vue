<template>
    <div class=" dark:bg-neutral-900/40 flex-1">
        <UContainer class="w-full px-0">
            <UPageHero :links="links" :ui="{ container: 'lg:py-24', title: 'sm:text-6xl', headline: 'text-neutral' }"
                title="Hur påverkas svampar av skogsskötsel?
" description="
Lär dig hur trakthyggesbruk och olika former av hygesfria metoder kan påverka förekomsten av mykorrhizasvampar"
                orientation="horizontal">
                <NuxtImg src="/images/Adobe/Stock Photo 563535222.jpeg" width="700" format="webp" alt="Illustration"
                    class=" rounded ring ring-neutral-300 " />
                <template #links>
                    <UModal fullscreen>
                        <UChip color="warning" size="2xl">
                            <UButton label="Visa modell för påverkan över tid" size="xl" color="neutral"
                                icon="i-material-symbols-interactive-space" />
                        </UChip>
                        <template #content>
                            <!-- <UAlert title="Denna funktion lanseras i November." color="warning"
                                icon="i-fluent-emoji-high-contrast-construction" /> -->
                            <ModelC />
                        </template>
                    </UModal>
                </template>
            </UPageHero>
        </UContainer>

        <UContainer class="w-full flex justify-between py-8 gap-8 overflow-scroll lg:overflow-hidden">
            <div v-for="method in methods" :key="method.id" class="relative">
                <UButton v-if="selectedId === method.id" icon="i-heroicons-x-mark"
                    class="absolute -top-2 -right-2 rounded-full z-10" variant="outline" color="neutral"
                    @click="selectedId = null" />

                <div @click="selectedId = method.id" :class="[
                    'shrink-0 lg:shrink w-58 lg:w-full bg-white transition-all hover:opacity-100 border border-neutral-200 overflow-hidden rounded h-fit shadow hover:shadow-md relative hover:border-neutral-300 cursor-pointer',
                    selectedId === null
                        ? 'opacity-30'
                        : (selectedId === method.id ? 'opacity-100' : 'opacity-30')
                ]">

                    <UBadge v-if="method.type" class="absolute top-2 left-2" :label="method.type" color="neutral"
                        variant="subtle" />
                    <NuxtImg :src="method.image" width="300" height="160" class=" w-full h-full" />
                    <h1 class="text-lg p-2 px-3 font-medium">{{ method.title }}</h1>
                </div>
            </div>
        </UContainer>

        <div class="w-full bg-neutral-50 border-t border-muted">


            <UContainer class="w-full px-0 pb-8 pt-2 sm:pt-8">


                <div class="flex justify-center w-full group">
                    <div v-if="selectedMethod === null" class="w-full mx-auto">
                        <UCarousel :ui="{ prev: 'ml-8 hidden group-hover:flex', next: 'mr-8 hidden group-hover:flex' }"
                            v-slot="{ item }" :items="items" class="w-full mx-auto mb-8" arrows dots>

                            <UPageCTA :title="item.title"
                                :ui="{ root: 'mx-3 lg:mx-8 my-1', container: 'border-none py-8', title: 'lg:text-5xl/14 font-medium' }"
                                :description="item.description" orientation="horizontal">
                                <div class="border-none flex justify-center ">
                                    <NuxtImg :src="item.img"
                                        :class="['rounded ', { 'ring ring-neutral-200 shadow': !item.noBorder }]"
                                        height="400" />
                                </div>
                            </UPageCTA>

                        </UCarousel>
                    </div>
                    <div v-else class="p-4">
                        <UTabs :ui="{ list: 'w-fit' }" :items="tabs" color="neutral" size="md" class="w-full mx-auto"
                            variant="pill">
                            <template #text>
                                <UPageSection
                                    :ui="{ headline: 'text-neutral', root: '', container: 'py-4 px-2 lg:py-8', title: 'lg:text-5xl/14 font-medium' }"
                                    orientation="horizontal" :title="selectedMethod.title"
                                    :description="selectedMethod.description">
                                    <UCard class="lg:text-lg -mx-1 p-1 lg:mx-0">
                                        <h1 class="mb-4 text-2xl font-semibold">Påverkan på mykorrhizasvampar
                                        </h1>
                                        {{ selectedMethod.descriptionsvamp }}
                                    </UCard>
                                </UPageSection>
                            </template>
                            <template #diagram>
                                <UAlert title="Denna funktion lanseras i November." color="warning"
                                    icon="i-fluent-emoji-high-contrast-construction" />
                                <!-- <h1
                                class="text-3xl tracking-tight lg:text-5xl font-medium text-neutral-900 my-4 mx-2 lg:mt-8 mb-2">
                                {{
                                    selectedMethod.title
                                }}
                            </h1>
                            <ForestryChartMain :parentSelectedFrameworks=[selectedMethod.id]
                                currentStartskog="naturskog" /> -->
                            </template>
                            <template #timeline>
                                <h1
                                    class="text-3xl tracking-tight lg:text-5xl font-medium text-neutral-900 my-4 mx-2 lg:my-8 mb-2">
                                    {{
                                        selectedMethod.title }}
                                </h1>
                                <UTimeline :items="timelineItems" size="3xs"
                                    :ui="{ indicator: 'bg-neutral-200/50 ', separator: 'bg-neutral-200/50', description: 'p-3 mt-2 bg-neutral-200/50 rounded text-default' }">
                                    <template #title="{ item }">
                                        <span class="font-semibold">{{ item.tid }}</span>
                                    </template>
                                    <template #description="{ item }">
                                        <div class="gap-2 lg:flex space-y-2 lg:space-y-0">
                                            <img :src="item.thumb" class="rounded w-80" />
                                            <UAlert color="neutral" variant="subtle" title="" :description="item.skog"
                                                class="h-fit" />
                                            <UAlert color="neutral" variant="outline" title="Mykorrhizasvamp"
                                                :description="item.svamp" class="h-fit" />
                                        </div>
                                    </template>
                                </UTimeline>
                            </template>
                        </UTabs>
                    </div>
                </div>

            </UContainer>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TabsItem } from '@nuxt/ui'
import type { TimelineItem } from '@nuxt/ui'
import { img } from '#build/ui-pro/prose'
import { pageSection } from '#build/ui-pro'

const normalizeTimeToken = (t: string | number) => {
    const s = String(t).trim().toLowerCase()
    if (s.includes('efter')) return 'efter'
    if (s.includes('innan')) return 'fore'
    if (s.includes('före') || s.includes('fore')) return 'fore'
    const nums = s.replace(/[^0-9]/g, '')
    return nums || s
}

const makeThumbSrc = (atgard: string, tid: string | number, startskog: string) => {
    const slug = (v: string) => v
        .trim()
        .normalize('NFD')
        .replace(/å/gi, 'a')
        .replace(/ä/gi, 'a')
        .replace(/ö/gi, 'o')
        .replace(/\p{Diacritic}+/gu, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '')

    const fileName = `${slug(atgard)}_${normalizeTimeToken(String(tid))}_visa_visa_${slug(startskog)}.webp`
    return `/images/thumbnails/${fileName}`
}

const { data: rawTimeline } = await useFetch<any[]>('/timeline.json')

const timelineItems = computed<any[]>(() => {
    const list = rawTimeline.value ?? []
    const method = selectedMethod.value?.id
    if (!method) return []
    return list
        .filter((e: any) => e.startskog === 'naturskog' && e.atgard === method)
        .map((e: any) => ({
            tid: e.tid,
            skog: e.skog,
            svamp: e.svamp,
            thumb: makeThumbSrc(e.atgard, e.tid, e.startskog)
        }))
})

const tabs = ref<TabsItem[]>([
    {
        label: 'Text',
        icon: 'i-heroicons-book-open',
        slot: 'text' as const
    },
    {
        label: 'Diagram',
        icon: 'i-heroicons-presentation-chart-line',
        slot: 'diagram' as const
    },
    {
        label: 'Tidslinje',
        icon: 'i-heroicons-list-bullet',
        slot: 'timeline' as const
    }
])

const items = ref([
    {
        title: 'Träd och svampar är beroende av varandra',
        description: 'Alla träds finrötter, ofta mer än hundratusen per kvadratmeter, är om- och invuxna av mykorrhizasvampars mycel. Svamparnas tunna hyfer sträcker likt en diskborste ut sig från rotspetsarna och förstorar trädens rotsystem hundrafalt och mer.',
        img: '/images/DavidReed.jpg'
    },
    {
        title: 'Fler och äldre träd ger mer mykorrhiza',
        description: 'Mängden träd avgör hur mycket mykorrhizasvampar det finns. Små och få träd ger mindre och fler och större träd ger större mängd och aktivitet av svamparna. Äldre skogar har också fler olika arter än yngre skogar.',
        img: '/images/MushrommTreeDiagram4.jpg',
        noBorder: true,
    },
    {
        title: 'När träden avverkas försvinner svamparna',
        description: 'När träden avverkas upphör sockerflödet till rötterna. Då tynar mykorrhizasvamparna bort och dör. Ett trakthygge innebär att omkring 95% av mängden mykorrhizasvampar försvinner.',
        img: '/images/Stock Image 481542412.jpeg'
    },
    {
        title: 'Svamparna överlever vid levande rötter',
        description: 'Mykorrhizasvampar kan bara överleva där det finns levande trädrötter - till exempel längs skogskanter, vid hänsynsträd eller på småplantor.',
        img: '/images/Skogsbruk.png'
    },
    {
        title: 'Vanliga svampar kommer tillbaka',
        description: 'Efter avverkning återvänder de vanligaste svamparna. De kan antingen överleva i marken eller spridas in med sporer från närliggande skog. Ovanliga arter lyckas sällan återetablera sig.',
        img: '/images/Spores Image.jpeg'
    },
    {
        title: 'Val av skogsskötsel påverkar',
        description: 'Vid trakthygge försvinner de flesta arterna och mängden mykorrhiza minskar kraftigt. Med hyggesfria metoder blir påverkan betydligt mindre, eftersom det hela tiden finns många träd. Svampställen och ovanliga arter på platsen kan då fortleva.',
        img: '/images/TraktBlad.png'
    },
    {
        title: 'Hur kan man gynna mykorrhizasvampar?',
        description: 'Så här gör man om man vill måna om de mykorrhizasvampar som finns i en skog. 1) Spara skogsområdet. 2) Låt skogen bli äldre - då kan svamparna fortleva längre. 3) Välj hyggesfria metoder. 4) Om skogen kallavverkas - lämna väl tilltagna grupper med hänsynsträd.',
        img: '/images/Mushroom Images.jpeg'
    },
])

const links = ref([
    {
        label: 'Visa modell för påverkan över tid ',
        icon: 'i-material-symbols-interactive-space',
        color: 'neutral',
    },
])

interface Method {
    id: 'naturskydd' | 'trakthygge' | 'luckhuggning' | 'skärmträd' | 'blädning' | 'allmänt'
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
</script>