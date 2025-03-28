<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('index').first())

useSeoMeta({
  titleTemplate: '',
  title: page.value?.title,
  ogTitle: page.value?.title,
  description: page.value?.description,
  ogDescription: page.value?.description
})

// NEW CODE: add scroll-based opacity effect
import { ref, onMounted, onUnmounted } from 'vue'


function getMaxScroll() {
  return window.innerWidth < 768 ? 500 : 50; // Use a smaller max scroll value on mobile screens
}

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
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div v-if="page">
    <!-- <div class="absolute">
       <div class="relative hidden sm:block">
        <NuxtImg src="/images/hero2.png" 
        class=" shadow-md" height="500" width="800" format="webp" quality="80"/>
        <NuxtImg src="/images/hero1.png" class=" shadow-md absolute top-0" height="500" width="800" format="webp" quality="80" :style="{ opacity: heroOpacity }"/>
      </div>
      <div class="relative sm:hidden">
        <NuxtImg src="/images/hero2.png" 
        class=" shadow-md" height="600" width="500" format="webp" quality="80"/>
        <NuxtImg src="/images/hero1.png" class=" shadow-md absolute top-0"  height="600" width="500" format="webp" quality="80" :style="{ opacity: heroOpacity }"/>
      </div>
    </div> -->
   
    <UPageHero :title="page.hero.title" :description="page.hero.description" :links="page.hero.links" orientation="horizontal">
      <!-- <template #headline>
        <UButton icon="i-heroicons-arrow-right-20-solid" trailing label="Svampskog v.1 2025.04.09" variant="subtle" />
      </template> -->

      <template #top>
        <div
          class="absolute rounded-full dark:bg-(--ui-primary) blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80" />

        <!-- <StarsBg /> -->
      </template>
      <template #title>
        <MDC :value="page.hero.title" class="*:leading-11 sm:*:leading-19 max-w-3xl mx-auto " />
      </template>
     
      <NuxtImg src="/images/3Trees.png" class="rounded-xl border border-neutral-200 dark:border-neutral-700 shadow" width="600" height="400"/>
      <!-- <div class="relative hidden sm:block">
        <NuxtImg src="/images/hero2.png" 
        class="rounded-xl shadow-md" height="500" width="800" format="webp" quality="80"/>
        <NuxtImg src="/images/hero1.png" class="rounded-xl shadow-md absolute top-0" height="500" width="800" format="webp" quality="80" :style="{ opacity: heroOpacity }"/>
      </div>
      <div class="relative sm:hidden">
        <NuxtImg src="/images/hero2.png" 
        class="rounded-xl shadow-md" height="600" width="500" format="webp" quality="80"/>
        <NuxtImg src="/images/hero1.png" class="rounded-xl shadow-md absolute top-0"  height="600" width="500" format="webp" quality="80" :style="{ opacity: heroOpacity }"/>
      </div> -->
     
      <!-- <PromotionalVideo /> -->
    </UPageHero>

   

    <UPageSection v-for="(section, index) in page.sections" :key="index" :title="section.title"
      :description="section.description" :orientation="section.orientation" :reverse="section.reverse"
      :features="section.features" :links="section.links" :headline="section.headline">
      <template #links>
        <div class="flex space-x-2">
          <UButton 
            v-for="(link, linkIndex) in section.links" 
            :key="linkIndex" 
            variant="ghost"
            v-bind="link" 
            size="xl"
            trailing/>
        </div>
      </template>
      <!-- <UCard>
        <NuxtImg :src="section.src" />
      </UCard> -->
      <GrowingGrid/>
      <!-- <ImagePlaceholder /> -->
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