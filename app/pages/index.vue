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
    <div class="fixed top-0 left-0 w-full h-60 pointer-events-none z-10 bg-gradient-to-b from-white/60 to-transparent dark:from-black/80 dark:to-transparent"></div>
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
    <div class="page-section">
    <UPageHero :ui="{
      container: 'pt-6 md:pt-24'
    }" :title="page.hero.title" :description="page.hero.description" :links="page.hero.links" orientation="horizontal">
      <template #headline >
        <UButton variant="subtle" color="warning" icon="i-fluent-emoji-high-contrast-construction">

    <span class="whitespace-normal ">
      Utvecklingsarbete och dokumentation pågår 
    </span>
  </UButton>      </template> 

      <!-- <template #top>
        <div
          class="absolute rounded-full dark:bg-(--ui-primary) blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80" ></div>

        <StarsBg />
      </template> -->
      <template #title>
        <MDC :value="page.hero.title" class="*:leading-13 sm:*:leading-19 max-w-3xl mx-auto page-section " />
      </template>
      <template #description>
<MDC :value="page.hero.description" class="*:leading-7  sm:*:leading-8 max-w-3xl mx-auto description-section"/>
      </template>

      <template #links >

      </template>
      
      <NuxtImg src="/images/boleto_small.png" width="1500" height="2100" quality="80" format="webp" class="boleto-img sm:-mt-90 -mb-32 -mt-10 sm:-mb-80" />

      <!-- <NuxtImg src="/images/3Trees.png" class="rounded-xl border border-neutral-200 dark:border-neutral-700 shadow" width="600" height="400"/> -->
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
  </div>
  <div class="page-section ">
    <!-- <UPageSection
      description="Mykorrhizasvampar är svampar som lever i symbios med träd. Symbiosen innebär att svamparna får sin energi från träden. I utbyte sköter de om trädens näringsförsörjning. Svamparnas mikroskopiskt tunna hyfer är om- och invuxna i trädens tunna rötter och förstorar trädens rotsystem tusenfalt. "
      :features="svampinfo"
      orientation="vertical"
      class=""
    >     
   
  </UPageSection> -->
    <UContainer class="text-center mx-auto max-w-5xl text-neutral-500 dark:text-neutral-400 text-md my-24">
      "Mykorrhizasvampar lever i symbios med träd vilket innebär att svamparna får sin energi från träden och I utbyte sköter de om trädens näringsförsörjning. <span class="hidden md:inline">Svamparnas mikroskopiskt tunna hyfer är om- och invuxna i trädens tunna rötter och förstorar trädens rotsystem tusenfalt.</span>" 
      
<div class="flex justify-center mt-4 page-section">
<UUser
    name="Anders Dahlberg"
    description="Professor i mykologi"
  
  />
</div>
      
    </UContainer>

  </div>
  <!-- :features="page.sections[0].features" -->
  <div class="page-section">
    <UPageSection 
      :title="page.sections[0].title"
      :description="page.sections[0].description"
      :orientation="page.sections[0].orientation"
      :reverse="page.sections[0].reverse"
    
      :links="page.sections[0].links"
      :headline="page.sections[0].headline">
      <template #links>
        <div class="flex space-x-2">
          <UButton 
            v-for="(link, linkIndex) in page.sections[0].links" 
            :key="linkIndex" 
            variant="subtle"
            v-bind="link" 
            size="xl"
            trailing/>
        </div>
      </template>
      
      <LandingSpeciesGrid :filterEdible="true"/>
    </UPageSection>
  </div>
  <!-- :features="page.sections[1].features" -->
  <div class="page-section">
    <UPageSection 
      :title="page.sections[1].title"
      :description="page.sections[1].description"
      :orientation="page.sections[1].orientation"
      
      
      :links="page.sections[1].links"
      :headline="page.sections[1].headline">
      <template #links>
        <div class="flex space-x-2">
          <UButton 
            v-for="(link, linkIndex) in page.sections[1].links" 
            :key="linkIndex" 
            variant="subtle"
            v-bind="link" 
            size="xl"
            trailing/>
        </div>
      </template>
      <LandingForestry />
    </UPageSection>
  </div>

  <div class="page-section" id="testimonials">
    <UPageSection :headline="page.testimonials.headline" :title="page.testimonials.title"
      :description="page.testimonials.description" class="hidden sm:block">
      <Omsvampskog />
      
    </UPageSection>
      <UPageSection :headline="page.testimonials.headline" :title="page.testimonials.title"
      :description="page.testimonials.description" orientation="horizontal" class="sm:hidden">
      <Omsvampskog />

  </UPageSection>
  <Finansiering />

  </div>

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
.description-section{
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease-in-out 0.5s, transform 1.2s ease-in-out 0.5s;
}

.page-section.in-view .boleto-img {
  opacity: 1;
  transform: translateY(0);
}

.page-section.in-view .description-section{
  opacity: 1;
  transform: translateY(0);

}
</style>
