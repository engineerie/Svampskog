<template>
  <UContainer>

    <UPage>
      <div class="snap-y snap-proximity scroll-smooth">


        <UPageHero :ui="{ container: 'lg:py-24', title: 'sm:text-6xl', headline: 'text-neutral' }" title="Träd och svamp är beroende av varandra 
" headline="Hur påverkar olika skogsskötsel svampar?" description="
Lär dig hur trakthyggesbruk och olika former av hygesfria metoder kan påverka förekomsten av mykorrhizasvampar">
        </UPageHero>
        <!-- <Transition name="">
      <div v-if="!selectedMethod">
             <h1 class="text-4xl font-semibold leading-loose">Skogsskötsel</h1>
      <p class="text-xl">Här försöker vi att visualisera hur trakthyggesbruk och olika former av hyggesfria metoder kan påverka förekomsten av mykorrhizasvampar under en skogsgeneration. Informationen baseras på sammanställda forskningsresultat, bl a från ett samarbete med Markinventeringen och Riksskogstaxeringen.</p>

      </div>
      </Transition> -->
        <div class="mt-4 md:mt-8 snap-start ">
          <!-- IF single method selected: show 1 col + 4 col description -->


          <!-- ELSE: show all methods with TransitionGroup -->
          <TransitionGroup tag="div" name="list" class="grid md:grid-cols-5 gap-4">
            <!-- Images (1–5 or just 1 if selected) -->
            <div v-for="method in displayedMethods" :key="method.title" class=" relative group overflow-hidden
           rounded-sm 
           transform transition duration-300 ease-in-out
           hover:scale-100" @click="selectMethod(method)"
              :class="!selectedMethod ? 'cursor-pointer' : 'cursor-default'">
              <NuxtImg :src="`/images/${method.image}`" width="250" height="400" format="webp" quality="80" class="hidden md:block border border-neutral-200/60 rounded-sm transition-transform duration-300 ease-in-out
             " />
              <NuxtImg :src="`/images/${method.image}`" width="400" height="150" format="webp" quality="80" class=" md:hidden border border-neutral-200/60 rounded-sm transition-transform duration-300 ease-in-out
             " />
              <div v-if="!selectedMethod" class="absolute inset-0 rounded-sm
             bg-gradient-to-t from-black/40 to-transparent
             pointer-events-none z-10 group-hover:opacity-50 transition-all"></div>
              <div v-if="!selectedMethod" class="absolute bottom-0 left-0 right-0
             px-4 py-2 text-white text-2xl font-semibold
             z-20 ">
                {{ method.title }}
              </div>
            </div>

            <!-- Description block (spans 4 cols) -->
            <div v-if="selectedMethod" :key="`${selectedMethod.title}-desc`"
              class="md:col-span-4 md:p-4 md:pt-0 relative">
              <UButton size="xl" color="neutral" variant="soft" icon="i-heroicons-x-mark" @click="close"
                class="absolute top-0 right-0 rounded-full" aria-label="Stäng beskrivning">
              </UButton>
              <div class="text-3xl font-semibold mb-4">{{ selectedMethod.title }}</div>
              <p class="text-lg leading-relaxed text-neutral-600">
                {{ selectedMethod.description }}
              </p>
              <div>
                <p class="text-xl font-semibold mt-10 mb-4">Påverkan på mykorrhizasvampar</p>
                <p class="text-lg leading-relaxed text-neutral-600">
                  {{ selectedMethod.descriptionsvamp }}
                </p>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </UPage>
  </UContainer>

  <div v-if="selectedMethod">
    <UContainer class="flex justify-end mt-8">
      <UModal v-model:open="open" fullscreen v-if="showModel" :ui="{ header: 'hidden', body: 'p-0 sm:px-0 sm:py-0' }">
        <UButton size="xl" label="Helskärm med jämförelsefunktion" color="neutral" variant="subtle" class="mt-4 mr-2" />

        <template #body>
          <ModelC @close="open = false" />
        </template>
      </UModal>
      <UButton @click="toggleShowModel" size="xl" variant="solid" class="mt-4" color="neutral">
        {{ showModel
          ? 'Dölj modell'
          : 'Visa modell för hur ' + selectedMethod.title + ' påverkar mykorrhizasvampar över tid'
        }}
      </UButton>




    </UContainer>

    <Transition name="fade">
      <div v-if="showModel" ref="modelSRef">
        <ModelS :current-framework="selectedFrameworksProp[0]" class="w-full mb-4" />
      </div>
    </Transition>
  </div>

  <USeparator class="mt-4" />
  <!-- 2) Fyr-kolumners-layout för annotations.json -->

  <div class="bg-neutral-50 dark:bg-neutral-800 pb-4 pt-2 flex-1 relative min-h-96 overflow-y-hidden">
    <!-- <UContainer class="relative"> 
          <UButton size="xl" @click="grid = !grid" color="neutral" variant="subtle" class="absolute top-3 right-8 z-50">
            {{ grid ? 'Visa diagram' : 'Visa dynamiker' }}
          </UButton>
       </UContainer> -->

    <Transition name="slide" mode="out-in">
      <div :key="grid ? (intro ? 0 : 1) : 2" class="w-full ">
        <SkogsskotselIntro v-if="intro" />
        <!-- <SvampskogDynamikerFooter v-else-if="grid" /> -->
        <UContainer v-else>
          <ForestryChartMain :parentSelectedFrameworks="selectedFrameworksProp" />
        </UContainer>
      </div>
    </Transition>
  </div>

</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import { useOnboardingStore } from '~/stores/onboardingStore'

const open = ref(false)
const onboardingStore = useOnboardingStore()
const methodToFrameworkIndex: Record<string, number> = {
  'Inga åtgärder': 0,
  'Trakthygge': 1,
  'Luckhuggning': 2,
  'Överhållen skärm': 3,
  'Blädning': 4
}
definePageMeta({ layout: 'skogsskotsel' })

const fullFrameworks = ['naturskydd', 'trakthygge', 'luckhuggning', 'blädning', 'skärmträd']

const frameworkMapping: Record<string, string> = {
  'Inga åtgärder': 'naturskydd',
  'Trakthygge': 'trakthygge',
  'Luckhuggning': 'luckhuggning',
  'Överhållen skärm': 'skärmträd',
  'Blädning': 'blädning'
}

const selectedFrameworksProp = computed(() =>
  selectedMethod.value
    ? [frameworkMapping[selectedMethod.value.title]]
    : fullFrameworks
)

const methods = [
  {
    title: 'Inga åtgärder',
    image: 'ingen_åtgärd.png',
    description:
      'Beståndet lämnas för fri utveckling tills vidare. Kan t ex vara en frivillig naturvårdsavsättning eller en skog med områdesskydd.',
    descriptionsvamp:
      'Samhället mykorrhizasvampar lever vidare med de arter som finns i skogen. Förekomst av matsvampar oftast bra i skogar som sköts på detta sätt. Rödlistade arter på platsen fortlever. Svamparnas mycelindivider i marken kan bli gamla som träd eller äldre, och växa och bli många m2 stora där det kontinuerligt finns träd. Sker plockhuggning av enstaka träd utspritt i beståndet har det minimal påverkan på förekomsten av mykorrhizasvampar.',
  },
  {
    title: 'Trakthygge',
    image: 'kalhygge.png',
    description:
      'Sedan 1950-talet det dominerande skogsskötselsystemet som går ut på att skapa likåldriga, större bestånd, trakter, med normalt ett trädslag. Hela beståndet behandlas samtidigt. Standardskötseln är: avverkning, markberedning, plantering, röjning, ett par gallringar och åter avverkning efter 60 till +100 år, beroende på bördighet och var i Sverige. Trakthuggning sker nästan uteslutande med kalavverkning och plantering, undantagsvis med fröträd som avverkas efter plantföryngring skett naturligt.',
    descriptionsvamp:
      'Mykorrhizasvampar försvinner nästan helt efter avverkning eftersom de är beroende av sin symbios med träd. Svampmycel överlever på rötter av hänsynsträd, småplantor som lämnas med naturlig föryngring och längs skogskanter. Plantskoleplantor medför några få arter mykorrhizasvampar som ersätts med tiden av arter etablerade från sporer. Matsvampar saknas direkt efter avverkning men återkommer efter 10–20 år. Rödlistade arter är oftast för ovanliga för att spridas in och etableras.',
  },
  {
    title: 'Luckhuggning',
    image: 'luckhuggning.png',
    description:
      'Innebär att träd avverkas i luckor med 20–50 m storlek vilket motsvarar luckor på ca 500–2 500 m². När ny skog vuxit upp kan luckorna utvidgas eller nya luckor tas upp i beståndet. Systematiska former av luckhuggning är schackrutehuggning och kanthuggning. Luckhuggning fungerar även i enskiktad granskog. Luckor större än 2 500 m² räknas som hyggen enligt Skogsstyrelsens definition.',
    descriptionsvamp:
      'Som trakthygge i liten skala. Ett mellanting mellan kalhygge och blädning. Hur stor påverkan blir beror på luckornas storlek. Kanteffekten gör att mykorrhizasvampar lever vidare i rötter från omgivande träd ca 10 meter in i luckorna. Med luckdiameter på högst 20 meter är påverkan mycket liten. Med större diameter tynar mykorrhizasvamparna bort och dör i mitten av luckorna. Återetablering sker då som på hyggen, främst från sporer. Möjligheten för ovanligare och rödlistade arter att fortleva är stor med små luckor, men minskar med större.',
  },
  {
    title: 'Överhållen skärm',
    image: 'skärm.png',
    description:
      'Överhållen skärm innebär att antalet lämnade skyddande skärmträd är fler än vid en vanlig fröträdsställning och att de sparas längre än vid normalt skärmskogsbruk. Skärmträden avvecklas successivt i flera steg medan trädplantor etableras och växer till. För att räknas som en hyggesfri metod enligt Skogsstyrelsens definition måste minst 25 träd per hektar lämnas att ingå i det nya beståndet. Tall och bok fungerar bra att föryngra under överhållen skärm. Gran är vindkänsligare och lämpar sig därför mindre bra. Överhållen skärm kan vara ett bra val i skogar med naturvärden som vill ha ljus och värme.',
    descriptionsvamp:
      'Troligen begränsad påverkan på mykorrhizasvampar. De flesta mycelen kommer att fortleva i rötterna av skärmträden även om det blir färre fruktkroppar. Många av dessa mycel etableras troligen på uppväxande trädplantor. Merparten av alla arter, även ovanliga och rödlistade, kommer troligen fortleva. Matsvampstillgången kan vara lägre under tiden.',
  },
  {
    title: 'Blädning',
    image: 'blädning.png',
    description:
      'Innebär ofta uttag om 20–30 procent av virkesvolymen med intervall på 15–30 år. Avverkning görs med målet att skapa och bibehålla en fullskiktad skog, det vill säga en skog med träd i alla storlekar. Därför fungerar blädning bäst med skuggtåliga trädslag, som gran och bok. Marken måste vara tillräckligt bördig, för att plantor och småträd ska klara att växa i det slutna beståndet. Blädning lämpar sig i skogar där man vill bevara en fuktigare och mer skyddad miljö.',
    descriptionsvamp:
      'Påverkan på mykorrhizasvampar är förmodligen försumbar då förändringen av deras markmiljö är liten och det kontinuerligt finns levande trädrötter i princip överallt i skogen. I princip lever alla mycel vidare efter en blädning. Ovanliga och rödlistade arter i beståndet kommer kunna finnas kvar. Mängden matsvampar är i stort sett opåverkad, men kan minska något några år efter en blädning.',
  }
]

// Reaktiv array som TransitionGroup loopar över
const displayedMethods = ref([...methods])

// Vilken metod är vald (för beskrivningspanelen)
const selectedMethod = ref(null)
const grid = ref(false)
const showModel = ref(false)
const modelSRef = ref<HTMLDivElement | null>(null)

async function toggleShowModel() {
  showModel.value = !showModel.value
  await nextTick()
  if (showModel.value && modelSRef.value) {
    modelSRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
  } else if (!showModel.value) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

async function selectMethod(method) {
  // 1) Få den klickade att flytta in i kolumn 1
  displayedMethods.value = [method]
  // 2) Vänta en tick så att Vue kan animera “move”-transition
  await nextTick()
  // 3) Visa beskrivningen först när flytten pågår
  selectedMethod.value = method
  // Short delay before smooth scrolling to top
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 300)
  onboardingStore.selectedFramework = methodToFrameworkIndex[method.title]
}

async function close() {
  // 1) Dölj beskrivningen (fade-out sker här)
  selectedMethod.value = null
  showModel.value = false;
  onboardingStore.selectedFramework = null
  // 2) Vänta en tick så att fade-out hinner köras
  await nextTick()
  // 3) Sätt tillbaka alla fem – Vue animerar den enda bilden tillbaka till sin ursprungliga plats
  displayedMethods.value = [...methods]
}
</script>

<style scoped>
/* 1) .list-move: only animate transform when an element changes column */
.list-move {
  transition: transform 0.5s ease;
  transition-delay: 0.05s;
}

/* 2) .list-leave-active: remove from layout (absolute) and fade out only */
.list-leave-active {
  position: absolute;
  transition: opacity 0s ease;
}

/* 3) .list-leave-to: end state of fade-out (fully transparent) */
.list-leave-to {
  opacity: 0;
}

/* (Optional) If you want a fade-in when new items appear, keep these: */
.list-enter-active {
  transition: opacity 0.3s ease;
  transition-delay: 0.3s;
}

.list-enter-from {
  opacity: 0;
  transition-delay: 0.3s;
}

/* Fade-animation för beskrivningspanelen */
.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease-out;
}

/* Slide transition: horizontal slide in/out */
.slide-enter-from {
  opacity: 0;
  transform: translateX(200px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-200px);
}
</style>