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

</script>

<template>
  <div v-if="page">
    <div class="bg-neutral-50 border-b border-neutral-100">
      <UPageHero :ui="{
        container: ''
      }" :title="page.hero.title" :description="page.hero.description" :links="page.hero.links"
        orientation="horizontal">
        <template #headline v-if="page.hero.headline.label">
          <NuxtLink :to="page.hero.headline.to">
            <UBadge :icon="page.hero.headline.icon" :label="page.hero.headline.label" :color="page.hero.headline.color"
              variant="subtle" size="lg" trailing :ui="{ base: 'rounded-full' }" />
          </NuxtLink>

        </template>
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
      <UPageSection v-if="page?.sections?.[0]" :title="page.sections[0].title"
        :description="page.sections[0].description" :orientation="page.sections[0].orientation"
        :reverse="page.sections[0].reverse" :links="page.sections[0].links">
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
      <UPageSection v-if="page?.sections?.[1]" :title="page.sections[1].title"
        :description="page.sections[1].description" :orientation="page.sections[1].orientation"
        :links="page.sections[1].links">
        <template #links>
          <div class="flex space-x-2">
            <UButton v-for="(link, linkIndex) in page.sections[1].links" :key="linkIndex" variant="subtle" v-bind="link"
              size="xl" trailing />
          </div>
        </template>
        <NuxtImg :src="page.sections[1].src" width="1000" type="webp" class="rounded-md border border-neutral-200" />
      </UPageSection>
    </div>
    <UPageSection v-if="page.press" :title="page.press.title" :description="page.press.description"
      :ui="{ container: 'bg-neutral-50 lg:rounded-2xl ring ring-neutral-100 py-12 sm:py-16 lg:py-22 my-4 sm:my-8 lg:my-10', title: 'text-start lg:text-center', description: 'text-start lg:text-center text-pretty' }">
      <UPageColumns>
        <UPageCard v-for="(article, index) in page.press.items" :key="index" :title="article.title"
          class="ring-0 border border-muted bg-white hover:bg-transparent" :description="article.description"
          :ui="{ description: 'before:content-[open-quote] after:content-[close-quote]', header: 'w-full' }"
          :to="article.url">
          <template #header>
            <div class="flex justify-between">
              <UIcon v-if="article.icon" :name="article.icon" class="text-4xl" />
              <UBadge v-if="article.badge" :label="article.badge.label" size="md"
                :color="article.badge.color || 'neutral'" variant="subtle" class="h-fit" />
            </div>
            <h1 class="text-sm mt-2">{{ article.publicationDate }} | {{ article.publication }}</h1>
          </template>
        </UPageCard>
      </UPageColumns>
    </UPageSection>
    <UPageSection v-if="page.timeline" :title="page.timeline.title" :description="page.timeline.description"
      :ui="{ container: 'flex-col', title: 'text-start lg:text-center', description: 'text-start lg:text-center text-pretty' }">
      <UTimeline :default-value="1" :items="page.timeline.items" size="3xl" orientation="vertical" :ui="{
        root: 'lg:flex-row lg:w-full',
        item: 'lg:flex-col',
        container: 'lg:flex-row',
        separator: 'lg:h-0.5 lg:w-auto',
        wrapper: 'lg:pe-8.5 lg:mt-0 lg:pb-0'
      }" />
    </UPageSection>
    <Finansiering>
      <template v-if="page.financing" #headline>
        <h1 class="text-lg text-center font-semibold text-neutral-900 my-12 sm:my-18">
          {{ page.financing.headline }}
        </h1>
      </template>
      <template v-if="page.financing" #logos>
        <NuxtImg v-for="(logo, index) in page.financing.logos" :key="index" :src="logo.src" :alt="logo.alt || ''"
          :height="logo.height" :width="logo.width" />
      </template>
      <template v-if="page.financing" #details>
        <li v-for="(note, index) in page.financing.notes" :key="index">
          {{ note }}
        </li>
      </template>
    </Finansiering>
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
