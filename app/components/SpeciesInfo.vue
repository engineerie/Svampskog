<!-- SpeciesInfo.vue -->
<template>
  <div class="w-full relative overflow-visible">
    <!-- Top Heading Bar -->
    <!-- <div class="absolute top-0 w-full z-50 flex justify-between">
      <h1 class="pt-3 pb-2 px-6 text-3xl">
        {{ capitalize(species.Commonname) }}
      </h1>
    </div> -->

    <!-- Images Section -->
    <div
      v-if="imageUrls.length > 1"
      class="group overflow-hidden"
    >
      <UCarousel
        v-slot="{ item }"
        :items="imageUrls"
        :ui="{ item: 'basis-full' }"
        :prev-button="{
          color: 'gray',
          class:
            'invisible group-hover:visible scale-0 group-hover:scale-100 transition-transform',
        }"
        :next-button="{
          color: 'gray',
          class:
            'invisible group-hover:visible scale-0 group-hover:scale-100 transition-transform',
        }"
        arrows
      >
        <div class="w-full relative">
          <NuxtImg
            :src="item"
            class="w-full "
            draggable="false"
            height="300"
            width="450"
            format="webp"
          />
          <!-- <div class="absolute bottom-0 right-0 justify-end p-2 items-center">
            <UBadge color="neutral" variant="subtle">
              <h1 weight="light" size="sm" class="">Foto:</h1>
              <Icon name="ph:copyright" class="h-4 w-4 mx-1" />
              <h1 weight="light" size="sm" class="">
                Michael Krikorev
              </h1></UBadge
            >
          </div> -->
        </div>
      </UCarousel>
    </div>
    <div
      v-else-if="imageUrls.length === 1"
      class=" overflow-hidden relative group"
    >
      <NuxtImg
        :src="imageUrls[0]"
        class="w-full"
        draggable="false"
        height="300"
        width="450"
        format="webp"
      />
      
    </div>
    <div v-else>
      <!-- Placeholder image section -->
      <div
        class=" relative pb-[230px] bg-transparent cursor-pointer"
        style="
          background-image: repeating-linear-gradient(
            -45deg,
            rgba(0, 0, 0, 0.1) 0px,
            rgba(0, 0, 0, 0.1) 5px,
            transparent 5px,
            transparent 10px
          );
        "
      ></div>
    </div>

    <!-- Content Section -->
    <div class="px-5 pb-3 mt-4">
      <h1 class="text-2xl font-medium">{{ capitalize(species.Commonname) }}</h1>
      <h1 class="text-neutral-500">{{ species.Scientificname }}</h1>
      <!-- Rarity indicators -->
       <div class="my-1">

      
<div
  v-if="species['Rank matsvamp'] === 3"
  
  
  
  class="text-sm text-red-700 shrink-0 flex gap-1 items-center "
>
<UIcon name="codicon:circle-large-filled" class="size-3"/>
  Sällsynt matsvamp
</div>
<div
  v-if="species['Rank matsvamp'] === 2"
  
  
  class="text-sm text-yellow-600 shrink-0 flex gap-1 items-center"
>
<UIcon name="codicon:color-mode" class="size-3"/>
  Ovanlig matsvamp
</div>
<div
  v-if="species['Rank giftsvamp'] === 3"
  
  class="text-sm shrink-0 text-red-700 flex gap-1 items-center"
>
<UIcon name="codicon:circle-large-filled" class="size-3"/>
  Sällsynt giftsvamp
</div>
<div
  v-if="species['Rank giftsvamp'] === 2"
  
  class="text-sm text-yellow-600 shrink-0 flex gap-1 items-center"
>
<UIcon name="codicon:color-mode" class="size-3"/>

  Ovanlig giftsvamp
</div>
<div
  v-if="species.RankRed === 3"
  
  class="text-sm text-red-700 shrink-0 flex gap-1 items-center"
>
<UIcon name="codicon:circle-large-filled" class="size-3"/>
  Sällsynt naturvårdsart
</div>
<div
  v-if="species.RankRed === 2"
 
  class="text-sm text-yellow-600 shrink-0 flex gap-1 items-center"
>
<UIcon name="codicon:color-mode" class="size-3"/>
  Ovanlig naturvårdsart
</div> 
 </div>
      <h1 class="mt-3 text-lg">
          {{ truncatedTextEkologi }}
        </h1>

        <div class="-mx-1 mt-4">
      <!-- Svamp-grupp Icon and Name -->
      <div
        class="inline-flex m-1 h-fit align-bottom"
        v-if="species['Svamp-grupp']"
      >
      <UBadge color="neutral" variant="subtle" size="xl" >   <NuxtImg
          :src="
            getIconPath(species['Svamp-grupp'], species['Svamp-grupp-släkte'])
          "
          class="w-4.5 "
          alt="Svamp Icon"
        />
          {{ capitalize(displayedSvampGrupp) }}
      </UBadge>
     
      </div>

      <!-- Matsvamp indicator -->
      <div
        class="shrink-0 inline-flex m-1 align-bottom"
        v-if="species['Nyasvamp-boken'] === 'x'"
      >
      <UBadge color="warning" size="xl" variant="subtle" class=""><Icon
          name="icon-park-solid:knife-fork"
        />Matsvamp</UBadge>
      </div>

      <!-- Giftsvamp indicator -->
      <div
        class=" shrink-0 inline-flex m-1 align-bottom"
        v-if="species.Giftsvamp === 'x'"
      >
      <UBadge color="poison" size="xl" variant="subtle" class=""><Icon name="hugeicons:danger" />Giftsvamp</UBadge>
        <!-- <Icon name="hugeicons:danger" class="h-7 w-7 text-lime-500 -my-2" />
        <h1 size="md" weight="light">Giftsvamp</h1> -->
      </div>

      <!-- SIGNAL_art indicator -->
      <div
        class=" shrink-0 inline-flex m-1 align-bottom"
        v-if="species.SIGNAL_art === 'S'"
      >
      <UBadge color="signal" size="xl" variant="subtle" class="">Signalart</UBadge>
        <!-- <div
          class="h-8 w-8 rounded-full bg-neutral-500 opacity-100 flex items-center justify-center text-white z-10"
        >
          S
        </div>
        <h1 size="md" weight="light">Signalart</h1> -->
      </div>

      <!-- RL2020kat Status Badge -->
      <!-- <div class="flex items-center space-x-2 mt-3" v-if="species.RL2020kat">
        <div
          :class="getStatusColor(species.RL2020kat)"
          class="h-8 w-8 rounded-full flex items-center justify-center text-white"
        >
          {{ getStatusAbbreviation(species.RL2020kat) }}
        </div>
        <h1 size="md" weight="light">
          {{ getStatusTooltip(species.RL2020kat) }}
        </h1>
      </div> -->

      <!-- Kalkmark and Vanlig Skogsmark Badges -->
    
          <UBadge v-if="species.KALKmark" size="xl" color="kalkmark" variant="subtle" class="shrink-0 inline-flex m-1 align-bottom">  Kalkmark </UBadge>
          <UBadge  v-if="species.ANNANmark" size="xl" color="vanligmark" variant="subtle" class="shrink-0 inline-flex m-1 align-bottom"> Vanlig skogsmark </UBadge>
      </div>

      <!-- <hr
        class="my-2"
        v-if="species.ekologi || species.Kriteriedokumentation"
      /> -->

      <!-- Ekologi Section (Expand/Collapse) -->
      <!-- <div
        class="flex justify-between cursor-pointer"
        v-if="species.ekologi"
        @click="toggleExpandEkologi"
      >
        <h1 class="text-lg font-semibold">Ekologi</h1>
        <Icon
          name="mdi:chevron-down"
          :class="[
            'h-6 w-6 transition-transform duration-300 ease-in-out',
            isExpandedEkologi ? 'rotate-180' : 'rotate-0',
          ]"
        />
      </div>
      <div
        class="relative overflow-hidden transition-transform duration-300 ease-in-out"
        :class="[isExpandedEkologi ? 'max-h-auto' : 'max-h-20']"
        v-if="species.ekologi"
        @click="toggleExpandEkologi"
      >
        <h1 size="md" weight="light">
          {{ truncatedTextEkologi }}
        </h1>
      </div> -->

      <!-- <hr class="my-2" v-if="species.Kriteriedokumentation" /> -->

      <!-- Kriteriedokumentation Section (Expand/Collapse) -->
       <UCard class="my-4" v-if="species.Kriteriedokumentation">
      <div
        class="flex justify-between cursor-pointer"
        
        @click="toggleExpand"
      >
        <h1 class="text-lg font-semibold mb-2 flex">   <div class="flex items-center space-x-2" v-if="species.RL2020kat">
        <div
          :class="getStatusColor(species.RL2020kat)"
          class="h-8 w-8 rounded-full flex items-center justify-center text-white"
        >
          {{ getStatusAbbreviation(species.RL2020kat) }}
        </div>
        <h1 size="md" weight="light">
          {{ getStatusTooltip(species.RL2020kat) }}
        </h1>
      </div></h1>
        <Icon
          name="mdi:chevron-down"
          :class="[
            'h-6 w-6 transition-transform duration-300 ease-in-out',
            isExpanded ? 'rotate-180' : 'rotate-0',
          ]"
        />
      </div>
      <div
        class="relative overflow-hidden transition-transform duration-300 ease-in-out"
        :class="[isExpanded ? 'max-h-auto' : 'max-h-20']"
        v-if="species.Kriteriedokumentation"
        @click="toggleExpand"
      >
        <h1 size="md" weight="light">
          {{ truncatedText }}
        </h1>
      </div>
       </UCard>
      <!-- <hr class="my-2" v-if="species.Kriteriedokumentation" /> -->

      <!-- Links Section -->
      <h1 class="text-lg font-medium  mt-4">Läs mer på</h1>
      <NuxtLink
        v-if="species.Artfakta != 'Information saknas'"
        :to="stripDetailsFromURL(species.Artfakta)"
        target="_blank"
        class="text-lg mb-3 underline text-primary-500"
      >
        Artfakta.se
      </NuxtLink>
      <br />
      <NuxtLink
        v-if="species.Svampguiden && species.Svampguiden !== '0'"
        :to="stripDetailsFromURL(species.Svampguiden)"
        target="_blank"
        class="text-lg  mb-3 underline text-primary-500"
      >
        Svampguiden.com
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  species: Object,
});

// Since our prefetch now includes an "images" property, we simply use it:
const imageUrls = computed(() => props.species.images || []);

// Expand/Collapse state for text sections
const isExpanded = ref(false);
const isExpandedEkologi = ref(true);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};
const toggleExpandEkologi = () => {
  isExpandedEkologi.value = !isExpandedEkologi.value;
};

const charLimit = 50;
const truncatedText = computed(() => {
  if (!props.species.Kriteriedokumentation) return "";
  return isExpanded.value
    ? props.species.Kriteriedokumentation
    : props.species.Kriteriedokumentation.slice(0, charLimit) + "...";
});
const truncatedTextEkologi = computed(() => {
  if (!props.species.ekologi) return "";
  return isExpandedEkologi.value
    ? props.species.ekologi
    : props.species.ekologi.slice(0, charLimit) + "...";
});

// Utility functions
const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const stripDetailsFromURL = (url) => {
  if (!url) return "";
  return url.replace("/detaljer", "").replace("/artinformation", "");
};

const getStatusAbbreviation = (status) => {
  const abbreviations = {
    LC: "LC",
    NT: "NT",
    EN: "EN",
    VU: "VU",
    CR: "CR",
    RE: "RE",
    DD: "DD",
  };
  return abbreviations[status] || "NE";
};

const getStatusColor = (status) => {
  const colors = {
    LC: "bg-green-500",
    NT: "bg-[#D7838E]",
    EN: "bg-[#C4004F]",
    VU: "bg-[#D7838E]",
    CR: "bg-[#C4004F]",
    RE: "bg-[#421A31]",
    DD: "bg-[#E8E9E7]",
  };
  return colors[status] || "bg-neutral-300";
};

const getStatusTooltip = (status) => {
  const tooltips = {
    LC: "Livskraftig",
    NT: "Nära hotad",
    EN: "Starkt hotad",
    VU: "Sårbar",
    CR: "Akut hotad",
    RE: "Nationellt utdöd",
    DD: "Kunskapsbrist",
  };
  return tooltips[status] || "Ej bedömd";
};

const getIconPath = (primary, fallback) => {
  // If primary is "0", use the fallback value
  const group = primary === "0" && fallback ? fallback : primary;
  const iconMapping = {
    övrigt: "BasilOther1Solid.png",
    hattsvamp: "hattsvamp.png",
    kantarell: "kantarell.webp",
    sopp: "sopp.png",
    taggsvamp: "taggsvamp.png",
    fingersvamp: "fingersvamp.webp",
    tryffel: "tryffel.webp",
    skinnsvamp: "skinnsvamp.webp",
    skålsvamp: "skalsvamp.webp",
  };
  return `/images/svampgrupp/${iconMapping[group] || "default-icon.webp"}`;
};

const displayedSvampGrupp = computed(() => {
  return props.species["Svamp-grupp"] === "0" &&
    props.species["Svamp-grupp-släkte"]
    ? props.species["Svamp-grupp-släkte"]
    : props.species["Svamp-grupp"];
});
</script>
