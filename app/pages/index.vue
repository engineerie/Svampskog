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
    <UPageHero :title="page.hero.title" :description="page.hero.description" :links="page.hero.links">
      <template #headline>
        <UButton icon="i-heroicons-arrow-right-20-solid" trailing label="Svampskog v.1 2025.04.09" variant="subtle" />
      </template>

      <template #top>
        <div
          class="absolute rounded-full dark:bg-(--ui-primary) blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80" />

        <!-- <StarsBg /> -->
      </template>
      <template #title>
        <MDC :value="page.hero.title" class="*:leading-11 sm:*:leading-19 max-w-3xl mx-auto text-4xl sm:text-7xl" />
      </template>
      <PromotionalVideo />
    </UPageHero>

    <UPageSection v-for="(section, index) in page.sections" :key="index" :title="section.title"
      :description="section.description" :orientation="section.orientation" :reverse="section.reverse"
      :features="section.features" :links="section.links" :headline="section.headline">
      <!-- <UButton :label="section.button" /> -->
      <!-- <UCard>
        <NuxtImg :src="section.src" />
      </UCard> -->

      <ImagePlaceholder />
    </UPageSection>

    <UPageSection :title="page.features.title" :description="page.features.description"
      :headline="page.features.headline">
      <UPageGrid>
        <UPageCard v-for="(item, index) in page.features.items" :key="index" v-bind="item" />
      </UPageGrid>
    </UPageSection>

    <UPageSection id="testimonials" :headline="page.testimonials.headline" :title="page.testimonials.title"
      :description="page.testimonials.description">
      <UPageColumns class="xl:columns-4">
        <UPageCard v-for="(testimonial, index) in page.testimonials.items" :key="index" variant="subtle"
          :description="testimonial.quote"
          :ui="{ description: 'before:content-[open-quote] after:content-[close-quote]' }">
          <template #footer>
            <UUser v-bind="testimonial.user" size="lg" />
          </template>
        </UPageCard>
      </UPageColumns>
    </UPageSection>

    <USeparator />

    <!-- <UPageCTA v-bind="page.cta" variant="naked" class="overflow-hidden">
      <div
        class="absolute rounded-full dark:bg-(--ui-primary) blur-[250px] size-40 sm:size-50 transform -translate-x-1/2 left-1/2 -translate-y-80" />

      <StarsBg />
    </UPageCTA> -->
  </div>
</template>

<style scoped>
.landing-section {
  z-index: 0;
  position: relative;
  background: radial-gradient(35.36% 35.36% at 100% 25%,
      #0000 66%,
      #e5e5e5 68% 70%,
      #0000 72%) 21px 21px / calc(2 * 21px) calc(2 * 21px),
    radial-gradient(35.36% 35.36% at 0 75%,
      #0000 66%,
      #e5e5e5 68% 70%,
      #0000 72%) 21px 21px / calc(2 * 21px) calc(2 * 21px),
    radial-gradient(35.36% 35.36% at 100% 25%,
      #0000 66%,
      #e5e5e5 68% 70%,
      #0000 72%) 0 0 / calc(2 * 21px) calc(2 * 21px),
    radial-gradient(35.36% 35.36% at 0 75%,
      #0000 66%,
      #e5e5e5 68% 70%,
      #0000 72%) 0 0 / calc(2 * 21px) calc(2 * 21px),
    repeating-conic-gradient(#f5f5f5 0 25%, #0000 0 50%) 0 0 / calc(2 * 21px) calc(2 * 21px),
    radial-gradient(#0000 66%, #e5e5e5 68% 70%, #0000 72%) 0 calc(21px / 2) / 21px 21px #f5f5f5;
}

.dark .landing-section {
  z-index: 0;
  background: radial-gradient(35.36% 35.36% at 100% 25%,
      #0000 66%,
      #404040 68% 70%,
      #0000 72%) 21px 21px / calc(2 * 21px) calc(2 * 21px),
    radial-gradient(35.36% 35.36% at 0 75%,
      #0000 66%,
      #404040 68% 70%,
      #0000 72%) 21px 21px / calc(2 * 21px) calc(2 * 21px),
    radial-gradient(35.36% 35.36% at 100% 25%,
      #0000 66%,
      #404040 68% 70%,
      #0000 72%) 0 0 / calc(2 * 21px) calc(2 * 21px),
    radial-gradient(35.36% 35.36% at 0 75%,
      #0000 66%,
      #404040 68% 70%,
      #0000 72%) 0 0 / calc(2 * 21px) calc(2 * 21px),
    repeating-conic-gradient(#171717 0 25%, #0000 0 50%) 0 0 / calc(2 * 21px) calc(2 * 21px),
    radial-gradient(#0000 66%, #404040 68% 70%, #0000 72%) 0 calc(21px / 2) / 21px 21px #171717;
}
</style>