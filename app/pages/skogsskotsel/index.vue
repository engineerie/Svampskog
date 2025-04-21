<template>

  <div>

    <div class="hidden">  <NuxtImg src="/images/ingen_åtgärd.png" width="800" height="500" format="webp" quality="80" class="mt-12 rounded-xl"/>
        <NuxtImg src="/images/kalhygge.png" width="800" height="500" format="webp" quality="80" class="mt-12 rounded-xl"/>
        <NuxtImg src="/images/luckhuggning.png" width="800" height="500" format="webp" quality="80" class="mt-12 rounded-xl"/>
        <NuxtImg src="/images/skärm.png" width="800" height="500" format="webp" quality="80" class="mt-12 rounded-xl"/>
        <NuxtImg src="/images/blädning.png" width="800" height="500" format="webp" quality="80" class="mt-12 rounded-xl"/></div>


    <UContainer class="flex justify-between items-center w-full">
     <!-- Buttons for medium and larger screens -->
<div class="hidden sm:flex flex-wrap items-center w-full mt-2 gap-2">
  <UButton
    v-for="item in items"
    :key="item.value"
    :label="item.label"
    :color="activeTab === item.value ? 'primary' : 'neutral'"
    variant="ghost"
    size="sm"
    @click="activeTab = item.value"
  />
</div>

<!-- USelect for small screens with full width -->
<div class="block sm:hidden mt-2 w-full">
  <USelect v-model="activeTab" :items="items" option-label="label" option-value="value" class="w-full" />
</div>
    </UContainer>

    <UContainer v-if="activeTab === 'komigang'">
      <UPageHeader headline="Svampar" title="Manual" description="Information om hur du kan använda verktyget." />

     
<UPage>
  <template #left> <div><div class="text-neutral-500 mt-6 pr-4">Sidan uppdateras utförligt inom kort. 
  </div></div></template>
      <template #right> <div></div></template>
     

      
</UPage>

     
</UContainer>

    <UContainer v-else-if="activeTab === 'miljo'">
      <UPageHeader headline="Skogsskötsel" title="Skötselmetoder"
        description="Definitationer och bilder på de olika miljöerna." />
        <UPage>
          <template #right> <div></div></template>
          <template #left> <div></div></template>
          <infoSkogsskotsel />
        </UPage>
    </UContainer>
    <UContainer v-else-if="activeTab === 'dataunderlag'">
      <ForestryChartMain />
      <!-- <UPageHeader headline="Skogsskötsel" title="Dataunderlag"
        description="Information om var dataunderlaget kommer ifrån." /> -->
    </UContainer>
    <UContainer v-else-if="activeTab === 'dokumentation'">
   <UPageHeader headline="Skogsskötsel" title="Dokumentation"
        description="Information om var dataunderlaget kommer ifrån." /> 
    <UPage>
      <template #left><div><div class="text-neutral-500 mt-6">Text: Anders Dahlberg <br/> 9 april 2025</div><div class="text-neutral-500 mt-6 pr-4">Texten kommer kompletteras inom kort. 
      </div></div></template>
        <template #right><div></div></template>

      <skogDokumentation />
    </UPage>

      </UContainer>

    <div v-else-if="activeTab === 'dashboard'">

      <transition name="fade" mode="out-in">
        <UContainer v-if="!onboardingCompleted">
          <transition name="fade" mode="out-in">
          <div v-if="!showOnboarding" key="header-view">
            <UPageHeader
              headline="Kommer snart!"
              title="Modell för skogsskötsel"
              description="Här visualiserar vi baserat på den kunskap som finns hur
                    olika former av trakthyggesbruk och hyggesfria metoder
                    påverkar förekomsten av mykorrhizasvampar under en
                    skogsgeneration. Börja med att ange skogens historik och planerad skogskötsel för att ladda modellen"
            />
            <div class="mt-4">
              <UButton label="Välj skogshistorik" @click="showOnboarding = true" />
            </div>
          </div>

          <OnBoarding v-else key="onboarding-view" @go-to-model="onboardingCompleted = true" />
          </transition>
        </UContainer>
        <ModelC v-else />
      </transition>
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";

const activeTab = ref("dashboard");

const onboardingCompleted = ref(false);
const showOnboarding = ref(false);

const items = [
{ label: "Modell", value: "dashboard" },
{ label: "Skötselmetoder", value: "miljo" },
  { label: "Diagram och staplar", value: "dataunderlag" },
  { label: "Manual", value: "komigang" },
  { label: "Dokumentation", value: "dokumentation" },
 

];


definePageMeta({
  layout: 'mylayout'
})

</script>

<style scoped>
/* Fade transition for view changes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>