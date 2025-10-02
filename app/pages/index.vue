<script setup lang="ts">

const { data: page } = await useAsyncData('index', () => queryCollection('index').first())

useSeoMeta({
  titleTemplate: '',
  title: page.value?.title,
  ogTitle: page.value?.title,
  description: page.value?.description,
  ogDescription: page.value?.description
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
        <template #links>
          <UButton v-for="link in page.hero.links" :label="link.label" :icon="link.icon" :color="link.color"
            :variant="link.variant" :size="link.size" :to="link.to" :target="link.target" />
        </template>
        <Motion :initial="{
          opacity: 0,
          transform: 'translateY(10px)'
          // filter: 'blur(20px)'
        }" :animate="{
          opacity: 1,
          transform: 'translateY(0px)'
          // filter: 'blur(0px)'
        }" :transition="{
              duration: 0.5,
              delay: 0.2
            }">
          <NuxtImg src="/images/Landing/boleto_small.png" width="1500" height="2100" quality="80" format="webp"
            class=" sm:-mt-90 -mb-32 -mt-10 sm:-mb-80" />
        </Motion>

      </UPageHero>
    </div>
    <!-- <div class="page-section ">
    </div> -->
    <Motion :initial="{ opacity: 0, transform: 'translateY(20px)' }"
      :while-in-view="{ opacity: 1, transform: 'translateY(0)' }" :in-view-options="{ once: true }"
      :transition="{ duration: 0.6, delay: 0.3 }">

      <UPageSection v-if="page?.sections?.[0]" :title="page.sections[0].title"
        :description="page.sections[0].description" :headline="page.sections[0].headline"
        :orientation="page.sections[0].orientation" :reverse="page.sections[0].reverse" :links="page.sections[0].links">
        <LandingSpeciesGrid :filterEdible="true" />
      </UPageSection>
    </Motion>
    <Motion :initial="{ opacity: 0, transform: 'translateY(20px)' }"
      :while-in-view="{ opacity: 1, transform: 'translateY(0)' }" :in-view-options="{ once: true }"
      :transition="{ duration: 0.6, delay: 0.3 }">
      <UPageSection v-if="page?.sections?.[1]" :title="page.sections[1].title"
        :description="page.sections[1].description" :headline="page.sections[1].headline"
        :orientation="page.sections[1].orientation" :links="page.sections[1].links">
        <NuxtImg :src="page.sections[1].src" width="1000" type="webp" class="rounded-md border border-neutral-200" />
      </UPageSection>
    </Motion>
    <Motion :initial="{ opacity: 0, transform: 'translateY(20px)' }"
      :while-in-view="{ opacity: 1, transform: 'translateY(0)' }" :in-view-options="{ once: true }"
      :transition="{ duration: 0.6, delay: 0.3 }">
      <UPageSection v-if="page.press" :title="page.press.title" :description="page.press.description"
        :ui="{ container: 'bg-neutral-50 lg:rounded ring ring-neutral-100 py-12 sm:py-16 lg:py-20 my-4 sm:my-8 lg:my-10', title: 'text-start lg:text-center', description: 'text-start lg:text-center text-pretty' }">
        <UPageColumns>
          <Motion v-for="(article, index) in page.press.items" :key="index"
            :initial="{ opacity: 0, transform: 'translateY(20px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateY(0)' }" :in-view-options="{ once: true }"
            :transition="{ delay: 0.2 }">
            <UPageCard :title="article.title" class="ring-0 border border-muted bg-white hover:bg-transparent"
              :description="article.description"
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
          </Motion>
        </UPageColumns>
      </UPageSection>
    </Motion>
    <Motion :initial="{ opacity: 0, transform: 'translateY(20px)' }"
      :while-in-view="{ opacity: 1, transform: 'translateY(0)' }" :in-view-options="{ once: true }"
      :transition="{ duration: 0.6, delay: 0.3 }">
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
    </Motion>
    <Motion :initial="{ opacity: 0, transform: 'translateY(20px)' }"
      :while-in-view="{ opacity: 1, transform: 'translateY(0)' }" :in-view-options="{ once: true }"
      :transition="{ duration: 0.6, delay: 0.3 }">
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
    </Motion>
  </div>
</template>
