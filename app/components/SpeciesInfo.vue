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
      class="group rounded-xl overflow-hidden m-2"
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
            class="w-full rounded-xl border border-neutral-300"
            draggable="false"
            height="300"
            width="450"
            format="webp"
          />
          <div class="absolute bottom-0 right-0 justify-end p-2 items-center">
            <UBadge color="neutral" variant="subtle">
              <h1 weight="light" size="sm" class="">Foto:</h1>
              <Icon name="ph:copyright" class="h-4 w-4 mx-1" />
              <h1 weight="light" size="sm" class="">
                Michael Krikorev
              </h1></UBadge
            >
          </div>
        </div>
      </UCarousel>
    </div>
    <div
      v-else-if="imageUrls.length === 1"
      class="m-2 rounded-xl overflow-hidden relative group"
    >
      <NuxtImg
        :src="imageUrls[0]"
        class="w-full rounded-xl border border-neutral-300"
        draggable="false"
        height="300"
        width="450"
        format="webp"
      />
      <div class="absolute bottom-0 right-0 justify-end p-2 items-center">
        <UBadge color="neutral" variant="subtle">
          <h1 weight="light" size="sm" class="">Foto:</h1>
          <Icon name="ph:copyright" class="h-4 w-4 mx-1" />
          <h1 weight="light" size="sm" class="">Michael Krikorev</h1></UBadge
        >
      </div>
    </div>
    <div v-else>
      <!-- Placeholder image section -->
      <div
        class="m-2 relative pb-[230px] bg-transparent border border-neutral-300 rounded-xl cursor-pointer"
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
    <div class="px-4 pb-3">
      <h1 class="text-2xl font-medium">{{ capitalize(species.Commonname) }}</h1>
      <h1 class="text-neutral-600">{{ species.Scientificname }}</h1>

      <!-- Svamp-grupp Icon and Name -->
      <div
        class="flex items-center space-x-2 mt-3"
        v-if="species['Svamp-grupp']"
      >
        <NuxtImg
          :src="
            getIconPath(species['Svamp-grupp'], species['Svamp-grupp-släkte'])
          "
          class="w-5"
          alt="Svamp Icon"
        />
        <h1 size="md" weight="light">
          {{ capitalize(displayedSvampGrupp) }}
        </h1>
      </div>

      <!-- Matsvamp indicator -->
      <div
        class="flex items-center space-x-2 mt-3"
        v-if="species['Nyasvamp-boken'] === 'x'"
      >
        <Icon
          name="icon-park-solid:knife-fork"
          class="h-7 w-7 text-yellow-500 -my-2"
        />
        <h1 size="md" weight="light">Matsvamp</h1>
      </div>

      <!-- Giftsvamp indicator -->
      <div
        class="flex items-center space-x-2 mt-3"
        v-if="species.Giftsvamp === 'x'"
      >
        <Icon name="hugeicons:danger" class="h-7 w-7 text-lime-500 -my-2" />
        <h1 size="md" weight="light">Giftsvamp</h1>
      </div>

      <!-- SIGNAL_art indicator -->
      <div
        class="flex items-center space-x-2 mt-3"
        v-if="species.SIGNAL_art === 'S'"
      >
        <div
          class="h-8 w-8 rounded-full bg-neutral-500 opacity-100 flex items-center justify-center text-white z-10"
        >
          S
        </div>
        <h1 size="md" weight="light">Signalart</h1>
      </div>

      <!-- RL2020kat Status Badge -->
      <div class="flex items-center space-x-2 mt-3" v-if="species.RL2020kat">
        <div
          :class="getStatusColor(species.RL2020kat)"
          class="h-8 w-8 rounded-full flex items-center justify-center text-white"
        >
          {{ getStatusAbbreviation(species.RL2020kat) }}
        </div>
        <h1 size="md" weight="light">
          {{ getStatusTooltip(species.RL2020kat) }}
        </h1>
      </div>

      <!-- Kalkmark and Vanlig Skogsmark Badges -->
      <div class="flex items-center space-x-2 mt-3">
        <div v-if="species.KALKmark">
          <UBadge color="kalkmark" variant="subtle"> Kalkmark </UBadge>
        </div>
        <div v-if="species.ANNANmark">
          <UBadge color="vanligmark" variant="subtle"> Vanlig skogsmark </UBadge>
        </div>
      </div>

      <hr
        class="my-2"
        v-if="species.ekologi || species.Kriteriedokumentation"
      />

      <!-- Ekologi Section (Expand/Collapse) -->
      <div
        class="flex justify-between cursor-pointer"
        v-if="species.ekologi"
        @click="toggleExpandEkologi"
      >
        <h1 size="lg" weight="medium">Ekologi</h1>
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
      </div>

      <hr class="my-2" v-if="species.Kriteriedokumentation" />

      <!-- Kriteriedokumentation Section (Expand/Collapse) -->
      <div
        class="flex justify-between cursor-pointer"
        v-if="species.Kriteriedokumentation"
        @click="toggleExpand"
      >
        <h1 size="lg" weight="medium">Dokumentation i rödlistan</h1>
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

      <hr class="my-2" v-if="species.Kriteriedokumentation" />

      <!-- Links Section -->
      <h1 size="md" weight="medium">Länkar</h1>
      <NuxtLink
        v-if="species.Artfakta != 'Information saknas'"
        :to="stripDetailsFromURL(species.Artfakta)"
        target="_blank"
        class="text-md font-thin mb-3 underline text-primary-500"
      >
        Artfakta.se
      </NuxtLink>
      <br />
      <NuxtLink
        v-if="species.Svampguiden && species.Svampguiden !== '0'"
        :to="stripDetailsFromURL(species.Svampguiden)"
        target="_blank"
        class="text-md font-thin mb-3 underline text-primary-500"
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
const isExpandedEkologi = ref(false);

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
