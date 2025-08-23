<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

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
    // On smaller screens, transition between 400 and 700 scroll
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

const press = ref([
  {
    title: 'Svampar - skogsbrukets dolda samarbetspartners',
    publication: 'Lantbrukspodden',
    publicationDate: '4 juli 2025',
    url: 'https://www.landlantbruk.se/skog-och-svamp-symbios-bakom-skogarnas-livskraft',
    icon: 'i-heroicons-radio',
    description: 'Under 50 års tid har forskaren Anders Dahlberg lockats av svamparnas liv, som oftast är osynligt ovan mark. I Lantbrukspodden guidar han oss till den febrila aktivitet som pågår under skogens mossa.'
  },
  {
    title: 'Svampen i din skog',
    publication: 'Sydved',
    publicationDate: '3 juli 2025',
    url: 'https://www.sydved.se/aktuellt/senaste-nytt/svampen-i-din-skog',
    icon: 'i-heroicons-newspaper',
    description: 'Visste du att svampen som växer i din skog hjälper träden att må bra? Det förklarar Anders Dahlberg, forskare i skogens mykologi vid Sveriges Lantbruksuniversitet.'
  },
  {
    title: 'Ny app avslöjar kilometerlånga nätverk - under dina fötter',
    publication: 'Sveriges Radio',
    publicationDate: '12 april 2025',
    url: 'https://www.sverigesradio.se/artikel/ny-app-avslojar-kilometerlanga-natverk-under-dina-fotter',
    icon: 'i-heroicons-radio',
    description: 'Sveriges Lantbruksuniversitetet lanserar i april en ny svamp-app. Den ska locka användaren till att upptäcka en dold värld under våra fötter.'
  },
  {
    title: 'Då stannar kantarellen',
    publication: 'Föreningen & tidningen Skogen',
    publicationDate: '2 april 2025',
    url: 'https://www.skogen.se/nyheter/da-stannar-kantarellen/',
    icon: 'i-heroicons-newspaper',
    description: 'Måste svampställena försvinna efter avverkning? Inte om man sparar träden där svamparna växer. En ny app visar hur svampar påverkas av skötselåtgärder. '
  },
  {
    title: 'Anders Dahlberg: Alternativa skogsbruksmetoders effekter på biologisk mångfald',
    publication: 'SLU Artdatabanken Youtube',
    publicationDate: '22 maj 2024',
    url: 'https://www.youtube.com/watch?v=2WKzPM3JlmQ',
    icon: 'i-heroicons-film',
    description: 'Vad säger forskning och erfarenheter om vad vi vet om arternas behov? Kommer något egentligen att förändras med de nya metoderna?'
  },
  {
    title: 'Svenska skogar myllrar av osynliga svampar',
    publication: 'Forskning.se',
    publicationDate: '5 september 2023',
    url: 'https://www.forskning.se/2023/09/05/svenska-skogar-myllrar-av-osynliga-svampar/',
    icon: 'i-heroicons-newspaper',
    description: 'Ser du svamp lite överallt i skogen? De är bara toppen av en värld av svampar som växer i marken, visar en dna-kartläggning.'
  },
])

</script>

<template>
  <div v-if="page">
    <div class="bg-neutral-50 border-b border-neutral-100">
      <UPageHero :ui="{
        container: 'pt-6 md:pt-24'
      }" :title="page.hero.title" :description="page.hero.description" :links="page.hero.links"
        orientation="horizontal">
        <template #title>
          <MDC :value="page.hero.title" class="*:leading-13 sm:*:leading-19 max-w-3xl mx-auto  " />
        </template>
        <template #description>
          <MDC :value="page.hero.description" class="*:leading-7  sm:*:leading-8 max-w-3xl mx-auto " />
        </template>

        <template #links>

        </template>

        <NuxtImg src="/images/boleto_small.png" width="1500" height="2100" quality="80" format="webp"
          class=" sm:-mt-90 -mb-32 -mt-10 sm:-mb-80" />

      </UPageHero>
    </div>
    <div class="page-section ">
      <!-- <UContainer class="text-center mx-auto max-w-5xl text-neutral-500 dark:text-neutral-400 text-md my-24">
        "Mykorrhizasvampar lever i symbios med träd. Det innebär att svamparna får sin energi från träden och i utbyte
        sköter de om trädens näringsförsörjning. <span class="hidden md:inline">Svamparnas mikroskopiskt tunna hyfer är
          om-
          och invuxna i trädens tunna rötter och förstorar trädens rotsystem tusenfalt.</span>"
        <div class="flex justify-center mt-4 page-section">
          <UUser name="Anders Dahlberg" description="Professor i mykologi" />
        </div>
      </UContainer> -->

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
        <NuxtImg src="/images/Adobe/Forestry Sweden Stock Photo.jpeg" width="1000" type="webp"
          class="rounded-md border border-neutral-200" />
      </UPageSection>
    </div>

    <!-- <UContainer>
      <div class="grid grid-cols-2 gap-24 my-24">
        <NuxtImg src="/images/Adobe/Forestry Sweden Stock Photo.jpeg" width="1000" type="webp" class="rounded-md " />
        <div class="">
          <h1 class="text-5xl font-semibold text-neutral-900 my-6">Vanliga frågor</h1>
          <UAccordion :items="questions" />
        </div>
      </div>

    </UContainer> -->




    <!-- <div class="page-section" id="testimonials">
      <UPageSection :headline="page.testimonials.headline" :title="page.testimonials.title"
        :description="page.testimonials.description" class="hidden sm:block">
        <Omsvampskog />

      </UPageSection>
    </div> -->

    <UPageSection title="Nyheter och pressklipp" description="Läs eller lyssna till ">
      <UPageColumns>
        <UPageCard variant="subtle"
          to="https://www.plockhugget.se/events/skogens-svampar-del-1-nedbrytarsvamparnas-mangfald-och-betydelse/"
          title="Skogens svampar - Del 1. Nedbrytarsvamparnas mångfald och betydelse"
          description="I denna första del om skogens svampar fokuserar Anders Dahlberg på svampar som är nedbrytare eller parasiter. Han kommer gå igenom vilka de är, vad de gör och hur skogsskötsel påverkar. Det kommer att finnas gott om tid för frågor."
          :ui="{ leadingIcon: 'size-10' }">
          <template #header>
            <div class="flex justify-between">
              <UIcon name="i-heroicons-calendar-date-range" class="text-4xl" />
              <UBadge label="Anmälan öppen" size="md" color="primary" variant="subtle" class="h-fit" />
            </div>

            <h1 class="text-sm mt-2">Webbinarium | 6 november kl 19-20.30 <br /> Plockhugget.se</h1>
          </template>
        </UPageCard>
        <UPageCard variant="subtle"
          to="https://www.plockhugget.se/events/skogens-svampar-del-2-mykorrhizasvamparnas-mangfald-och-betydelse/"
          title="Skogens svampar - Del 2. Mykorrhizasvamparnas mångfald och betydelse"
          description="På senare år har forskning bringat allt större klarhet i vilka mykorrhizasvamparna är och deras biologi, hur skogsskötsel påverkar och kan utformas för att ta hänsyn till dem, t ex genom hyggesfri skötsel. Detta är några av de frågor som vår föreläsare Anders Dahlberg kommer att beröra och det kommer att finnas gott om tid för frågor"
          :ui="{ leadingIcon: 'size-10' }"><template #header>
            <div class="flex justify-between">
              <UIcon name="i-heroicons-calendar-date-range" class="text-4xl" />
              <UBadge label="Anmälan öppen" size="md" color="primary" variant="subtle" class="h-fit" />
            </div>

            <h1 class="text-sm mt-2">Webbinarium | 9 december 2025 kl 9-10.30 <br /> Plockhugget.se</h1>
          </template></UPageCard>

        <UPageCard v-for="(article, index) in press" :key="index" variant="outline" :title="article.title"
          :description="article.description"
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
    <!-- <UPageSection :headline="page.testimonials.headline" :title="page.testimonials.title"
        :description="page.testimonials.description" orientation="horizontal" class="sm:hidden">
        <Omsvampskog />
      </UPageSection> -->

    <Finansiering />


  </div>
</template>

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
