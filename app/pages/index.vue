<template>
  <div v-if="page">
    <div class="bg-neutral-50 border-b border-neutral-100">
      <UPageHero :ui="{
        container: ''
      }" :title="page.hero.title" :description="page.hero.description" :links="page.hero.links"
        orientation="horizontal">
        <template #title>
          <MDC :value="page.hero.title" class="*:leading-13 sm:*:leading-19 max-w-3xl mx-auto  " />
        </template>
        <template #description>
          <MDC :value="page.hero.description" class="*:leading-7  sm:*:leading-8 max-w-3xl mx-auto " />
        </template>
        <NuxtImg src="/images/Landing/boleto_small.png" width="1500" height="2100" quality="80" format="webp"
          class=" sm:-mt-90 -mb-32 -mt-10 sm:-mb-80" />
      </UPageHero>
    </div>
    <div class="page-section ">
    </div>
    <div class="page-section">
      <UPageSection :title="page.sections[0].title" :description="page.sections[0].description"
        :orientation="page.sections[0].orientation" :reverse="page.sections[0].reverse" :links="page.sections[0].links">
        <template #links>
          <div class="flex space-x-2">
            <UButton v-for="(link, linkIndex) in page.sections[0].links" :key="linkIndex" variant="subtle" v-bind="link"
              size="xl" trailing />
          </div>
        </template>
        <LandingSpeciesGrid :filterEdible="true" />
      </UPageSection>
    </div>
    <div class="page-section">
      <UPageSection :title="page.sections[1].title" :description="page.sections[1].description"
        :orientation="page.sections[1].orientation" :links="page.sections[1].links">
        <template #links>
          <div class="flex space-x-2">
            <UButton v-for="(link, linkIndex) in page.sections[1].links" :key="linkIndex" variant="subtle" v-bind="link"
              size="xl" trailing />
          </div>
        </template>
        <NuxtImg src="/images/Landing/Stock Photo 563535222.jpeg" width="1000" type="webp"
          class="rounded-md border border-neutral-200" />
      </UPageSection>
    </div>
    <UPageSection title="Aktuellt & lästips"
      :ui="{ container: 'bg-neutral-50 lg:rounded-2xl ring ring-neutral-100 py-12 sm:py-16 lg:py-22 my-4 sm:my-8 lg:my-10', title: 'text-start lg:text-center', description: 'text-start lg:text-center text-pretty' }"
      description=" Läs om projektet i media, lyssna på poddar om skog och svamp eller anmäl dig till webbinarier.">
      <UPageColumns>
        <UPageCard class="ring-0 border border-muted bg-white hover:bg-transparent"
          to="https://www.plockhugget.se/events/skogens-svampar-del-1-nedbrytarsvamparnas-mangfald-och-betydelse/"
          title="Skogens svampar - Del 1. Nedbrytarsvamparnas mångfald och betydelse"
          description="I denna första del om skogens svampar fokuserar Anders Dahlberg på svampar som är nedbrytare eller parasiter."
          :ui="{ header: 'w-full' }">
          <template #header>
            <div class="flex justify-between">
              <UIcon name="i-heroicons-calendar-date-range" class="text-4xl" />
              <UBadge label="Anmälan öppen" size="md" color="primary" variant="subtle" class="h-fit" />
            </div>
            <h1 class="text-sm mt-2 flex w-full">Webbinarium | 6 november 2025 kl 19-20.30 <br /> Plockhugget.se</h1>
          </template>
        </UPageCard>
        <UPageCard class="ring-0 border border-muted bg-white hover:bg-transparent"
          to="https://www.plockhugget.se/events/skogens-svampar-del-2-mykorrhizasvamparnas-mangfald-och-betydelse/"
          title="Skogens svampar - Del 2. Mykorrhizasvamparnas mångfald och betydelse"
          description="På senare år har forskning bringat allt större klarhet i vilka mykorrhizasvamparna är och deras biologi, hur skogsskötsel påverkar och kan utformas för att ta hänsyn till dem."
          :ui="{ header: 'w-full' }"><template #header>
            <div class="flex justify-between">
              <UIcon name="i-heroicons-calendar-date-range" class="text-4xl" />
              <UBadge label="Anmälan öppen" size="md" color="primary" variant="subtle" class="h-fit" />
            </div>
            <h1 class="text-sm mt-2">Webbinarium | 9 december 2025 kl 9-10.30 <br /> Plockhugget.se</h1>
          </template></UPageCard>
        <UPageCard class="ring-0 border border-muted bg-white hover:bg-transparent"
          to="https://www.slu.se/om-slu/organisation/fakulteter/fakulteten-for-skogsvetenskap/samverkan/kompetensutveckling-for-ett-hallbart-skogsbruk/se-svampen-i-din-skog/"
          title="Webbinarium om Svampskog"
          description="Lär dig mer om skogens mykorrhizasvampar och hur skogsskötsel påverkar dem - och få en genomgång av hur du använder funktionerna i webbappen Svampskog."
          :ui="{ header: 'w-full' }">
          <template #header>
            <div class="flex justify-between">
              <UIcon name="i-heroicons-calendar-date-range" class="text-4xl" />
              <UBadge label="Anmäl intresse" size="md" color="info" variant="subtle" class="h-fit" />
            </div>
            <h1 class="text-sm mt-2 flex w-full">Webbinarium | Vår 2026 <br /> </h1>
          </template>
        </UPageCard>
        <UPageCard v-for="(article, index) in press" :key="index" :title="article.title" variant=""
          class="border border-muted bg-white hover:bg-transparent" :description="article.description"
          :ui="{ description: 'before:content-[open-quote] after:content-[close-quote]' }" :to="article.url">
          <template #header>
            <div class="flex justify-between">
              <UIcon :name="article.icon" class="text-4xl" />
            </div>
            <h1 class="text-sm mt-2">{{ article.publicationDate }} | {{ article.publication }}</h1>
          </template>
        </UPageCard>
      </UPageColumns>
    </UPageSection>
    <UPageSection title="Kommande innehåll"
      :ui="{ container: 'flex-col', title: 'text-start lg:text-center', description: 'text-start lg:text-center text-pretty' }"
      description="Svampskog.se vidareutvecklas stegvis. Här hittar du en översikt över planerade funktioner och material som publiceras under året.">
      <UTimeline :default-value="1" :items="timeline" size="3xl" orientation="vertical" :ui="{
        root: 'lg:flex-row lg:w-full',
        item: 'lg:flex-col',
        container: 'lg:flex-row',
        separator: 'lg:h-0.5 lg:w-auto',
        wrapper: 'lg:pe-8.5 lg:mt-0 lg:pb-0'
      }" />
    </UPageSection>
    <Finansiering />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { TimelineItem } from '@nuxt/ui'

function getMaxScroll() {
  return window.innerWidth < 768 ? 500 : 50; // Use a smaller max scroll value on mobile screens
}

const { data: page } = await useAsyncData('index', () => queryCollection('index').first())

useSeoMeta({
  titleTemplate: '',
  title: page.value?.title,
  ogTitle: page.value?.title,
  description: page.value?.description,
  ogDescription: page.value?.description
})

const heroOpacity = ref(0)

function handleScroll() {
  const scrollY = window.scrollY;
  if (window.innerWidth < 768) {
    if (scrollY < 300) {
      heroOpacity.value = 0;
    } else if (scrollY > 500) {
      heroOpacity.value = 0.7;
    } else {
      heroOpacity.value = ((scrollY - 300) / 200) * 0.7;
    }
  } else {
    const maxScroll = getMaxScroll();
    heroOpacity.value = Math.min((scrollY / maxScroll) * 0.7, 0.7);
  }
}


onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  const sections = document.querySelectorAll('.page-section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  sections.forEach(section => observer.observe(section));
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const timeline = ref<TimelineItem[]>([
  {
    date: 'Vår 2025',
    title: 'Mjuklansering',
    description: 'Mjuklansering i samband med Flora och faunavårds-konferansen 9 april. Ett öppet webbinarium om att använda Svampskog hölls den 23 april.',
    icon: 'i-hugeicons-plant-01',
  },
  {
    date: 'Sommar 2025',
    title: 'Mobilanpassning',
    description: 'Hemsidan utvecklas löpande och mobilanpassas under sommaren 2025.',
    icon: 'i-heroicons-sun',
  },
  {
    date: 'November 2025',
    title: 'Skogsskötsel',
    description: 'Information om skogsskötsel färdigställs och lanseras.',
    icon: 'i-hugeicons-tree-06',
  },
  {
    date: 'November 2025',
    title: 'Svampkunskap',
    description: 'Modul för svampkunskap med tillhörande lärarhandledning läggs upp på svampskog.se',
    icon: 'i-hugeicons-book-03',
  },
  {
    date: 'Vår 2026',
    title: 'Webbinarium',
    description: 'Webbinarium om svampar, skogssbruk och funktionerna på svampskog.se hålls.',
    icon: 'i-hugeicons-presentation-line-chart-01',
  },
])

const press = ref([
  {
    title: 'Då stannar kantarellen',
    publication: 'Föreningen & tidningen Skogen',
    publicationDate: '2 april 2025',
    url: 'https://www.skogen.se/nyheter/da-stannar-kantarellen/',
    icon: 'i-heroicons-newspaper',
    description: 'Måste svampställena försvinna efter avverkning? Inte om man sparar träden där svamparna växer. En ny app visar hur svampar påverkas av skötselåtgärder. '
  },
  {
    title: 'Ny teknik: Se svampen i din skog',
    publication: 'Skogsvärden',
    publicationDate: '2 oktober 2024',
    url: 'https://www.skogssallskapet.se/kunskapsbank/artiklar/2024-10-02-ny-teknik-se-svampen-i-din-skog.html',
    icon: 'i-heroicons-newspaper',
    description: ''
  },
  {
    title: 'Svamparnas rike - osynligt men viktigt',
    publication: 'Korta föreläsningar om svamp',
    publicationDate: '14 mars 2024',
    url: 'https://www.ksla.se/aktiviteter/svamparnas-rike-osynligt-men-viktigt/',
    icon: 'i-heroicons-film',
    description: 'Fyra presentationer på Kungliga Skogs- och lantbruksakademien'
  },
  {
    title: 'Så påverkar skogsbruket dina svampställen ',
    publication: 'Dagens Nyheter ',
    publicationDate: '3 september 2023',
    url: 'https://www.dn.se/sverige/sa-paverkar-skogsbruket-dina-svampstallen/',
    icon: 'i-heroicons-film',
    description: ''
  },
  {
    title: 'Sporen - en podd om svampar',
    publication: 'Anna Rosling - Spotify',
    publicationDate: '1 september 2023',
    url: 'https://open.spotify.com/show/77UlUrR6SbIrsyFBOLHC8c',
    icon: 'i-heroicons-radio',
    description: '6 avsnitt från hösten 2023 där Anna Rosling från Uppsala universitet och Hanna Johannesson på Kungliga vetenskapsakademien/Stockholms universitet pratar om svamp.'
  },
  {
    title: 'Viktigt samspel mellan träd och svamp',
    publication: 'Skogseko',
    publicationDate: 'nr 3 2022',
    url: 'https://e-tidning.skogseko.se/p/skogseko/skogseko-nr-3-2022/a/viktigt-samspel-mellan-trad-och-svamp/1525/587953/31172107',
    icon: 'i-heroicons-newspaper',
    description: ''
  },
])

</script>

<style>
.page-section {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
}

.page-section.in-view {
  opacity: 1;
  transform: translateY(0);
}

.boleto-img {
  opacity: 0;
  transform: translateY(300px);
  transition: opacity 2s ease-in-out 0.5s;
}

.description-section {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease-in-out 0.5s, transform 1.2s ease-in-out 0.5s;
}

.page-section.in-view .boleto-img {
  opacity: 1;
  transform: translateY(0);
}

.page-section.in-view .description-section {
  opacity: 1;
  transform: translateY(0);

}
</style>
