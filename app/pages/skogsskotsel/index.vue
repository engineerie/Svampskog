<template>

  <div>

    <UContainer class="flex justify-between items-center w-full">
      <!-- <UButton label="Välj miljö" class="h-fit"/>
         <UTabs
      v-model="activeTab"
      :items="items"
      variant="link"
      color="neutral"
      class="py-1 w-fit"
    /> -->
      <div class="flex items-center w-full mt-2 gap-2">



        <UButton v-if="items.length" :label="items[3].label"
          :color="activeTab === items[3].value ? 'primary' : 'neutral'" variant="ghost" size="sm"
          @click="activeTab = items[3].value" />
        <div class="flex gap-2">
          <UButton v-for="item in items.slice(0, 3)" :key="item.value" :label="item.label"
            :color="activeTab === item.value ? 'primary' : 'neutral'" variant="ghost" size="sm"
            @click="activeTab = item.value" />
        </div>
      </div>
    </UContainer>

    <UContainer v-if="activeTab === 'komigang'">
      <UPageHeader headline="Skogsskötsel" title="Guide" description="Information om hur du kan använda verktyget." />


      <div class="mt-4">
        <ul class="space-y-4">
          <li class="">
            Välj skogsmiljö genom att ange

            <Icon name="material-symbols:location-on-outline" class="size-5 text-fuchsia-500 -mb-1" />
            Var i Sverige (för närvarande begränsat till norr och söder),

            <Icon name="lucide:trees" class="size-5 text-green-500 -mb-1" />
            Skogstyp (vilka träd som dominerar),

            <Icon name="carbon:crop-growth" class="size-5 text-violet-500 -mb-1" />
            Skogsålder (trädens ålder) och

            <Icon name="fluent-emoji-high-contrast:herb" class="size-5 text-teal-500 -mb-1" />
            Fältskikt (vilken vegetation som växer på marken).
          </li>
          <li>
            Klicka på respektive kategori för att göra dina val, eller
            använd knappen
            <div
              class="inline-flex mx-1 items-center rounded-full ring-1 ring-neutral-200 w-fit text-sm py-1 pl-4 pr-3 gap-1 bg-neutral-50 text-neutral-950">
              <span>Visa kombinationsvy</span>
              <Icon name="mdi:chevron-down" class="size-5" />
            </div>
            för att se alla alternativ som radioknappar.
            <!-- <UAlert
                  class="my-2"
                  icon="i-heroicons-information-circle"
                  color="warning"
                  variant="subtle"
                  title="Det är nödvändigt att göra val i alla kategorier."
                /> -->
          </li>
          <li class="">
            Du kan också klicka på
            <div
              class="inline-flex mx-1 items-center rounded-full ring-1 ring-neutral-200 w-fit text-sm py-1 pl-4 pr-3 gap-1 bg-neutral-50 text-neutral-950">
              <span>Markinventeringsdata</span>
              <Icon name="mdi:lock-open" class="size-4" />
            </div>
            för att begränsa urvalet till miljöer där det finns data från
            markinventeringen.
            <!-- <UAlert
                  class="my-2"
                  icon="i-heroicons-light-bulb"
                  color="success"
                  variant="subtle"
                  title="Om val är inaktiverade kan det hjälpa att avvmarkera redan gjorda val."
                /> -->
          </li>
        </ul>
      </div>
    </UContainer>

    <UContainer v-else-if="activeTab === 'miljo'">
      <UPageHeader headline="Skogsskötsel" title="Miljöinformation"
        description="Definitationer och bilder på de olika miljöerna." />
      <div class="space-y-6 mt-4">
        <div>
          <h1 size="lg" weight="light" class="mb-2">Var i Sverige</h1>
          <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="option in geographyOptions"
              class="cursor-pointer rounded-xl overflow-hidden border border-neutral-200" @click="openModal(option)">
              <div class="bg-gray-200 h-40 rounded-lg flex items-center justify-center">
                <div class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <Icon name="material-symbols:photo" class="w-8 h-8 text-neutral-500" />
                </div>
              </div>
              <div class="p-2 text-md font-medium text-neutral-600">
                {{ option.label }}
              </div>
            </div>
          </div>
        </div>
        <div>
          <h1 size="lg" weight="light" class="mb-2">Skogstyp</h1>
          <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="option in forestTypeOptions"
              class="cursor-pointer rounded-xl overflow-hidden border border-neutral-200" @click="openModal(option)">
              <div class="bg-gray-200 h-40 rounded-lg flex items-center justify-center">
                <div class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <Icon name="material-symbols:photo" class="w-8 h-8 text-neutral-500" />
                </div>
              </div>
              <div class="p-2 text-md font-medium text-neutral-600">
                {{ option.label }}
              </div>
            </div>
          </div>
        </div>
        <div>
          <h1 size="lg" weight="light" class="mb-2">Skogsålder</h1>
          <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="option in standAgeOptions"
              class="cursor-pointer rounded-xl overflow-hidden border border-neutral-200" @click="openModal(option)">
              <div class="bg-gray-200 h-40 rounded-lg flex items-center justify-center">
                <div class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <Icon name="material-symbols:photo" class="w-8 h-8 text-neutral-500" />
                </div>
              </div>
              <div class="p-2 text-md font-medium text-neutral-600">
                {{ option.label }}
              </div>
            </div>
          </div>
        </div>
        <div>
          <h1 size="lg" weight="light" class="mb-2">Fältskikt</h1>
          <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="option in vegetationTypeOptions"
              class="cursor-pointer rounded-xl overflow-hidden border border-neutral-200" @click="openModal(option)">
              <div class="bg-gray-200 h-40 rounded-lg flex items-center justify-center">
                <div class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <Icon name="material-symbols:photo" class="w-8 h-8 text-neutral-500" />
                </div>
              </div>
              <div class="p-2 text-md font-medium text-neutral-600">
                {{ option.label }}
              </div>
            </div>
          </div>
        </div>
      </div>

    </UContainer>
    <UContainer v-else-if="activeTab === 'dataunderlag'">
      <ForestryChartMain />
      <!-- <UPageHeader headline="Skogsskötsel" title="Dataunderlag"
        description="Information om var dataunderlaget kommer ifrån." /> -->
    </UContainer>
    <div v-else-if="activeTab === 'dashboard'">

      <transition name="fade" mode="out-in">
        <UContainer v-if="!onboardingCompleted">
          <UPageHeader headline="Skogsskötsel" title="Modell"
            description="Här visualiserar vi baserat på den kunskap som finns hur
                    olika former av trakthyggesbruk och hyggesfria metoder
                    påverkar förekomsten av mykorrhizasvampar under en
                    skogsgeneration. Börja med att ange skogens historik och planerad skogskötsel för att ladda modellen" />
          <OnBoarding @go-to-model="onboardingCompleted = true" />
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

const items = [
  { label: "Guide", value: "komigang" },
  { label: "Skötselmetoder", value: "miljo" },
  { label: "Dataunderlag", value: "dataunderlag" },
  { label: "Modell", value: "dashboard" },
];


definePageMeta({
  layout: 'mylayout'
})

</script>

<style scoped>
/* Fade transition for view changes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>