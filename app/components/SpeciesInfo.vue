<template>
  <div class="w-full relative overflow-visible">
    <div v-if="imageUrls.length > 1" class="group overflow-hidden">
      <UCarousel v-slot="{ item }" @select="currentIndex = $event" :items="imageUrls" :ui="{ item: 'basis-full' }">
        <div class="w-full relative" :key="item">
          <img :src="item" class="w-full" draggable="false" height="300" width="450" loading="lazy" decoding="async"
            alt="Artbild" />
        </div>
      </UCarousel>

      <div class="flex w-full bg-neutral-50 p-1 px-3 justify-between">
        <div class="flex ">
          <Icon name="i-mingcute-copyright-line" class="h-4 w-4 my-1 mr-1" />
          <h1 weight="light" class="">
            Michael Krikorev
          </h1>
        </div>
        <h1>
          {{ currentIndex + 1 }} av {{ imageUrls.length }}
        </h1>
      </div>
    </div>
    <div v-else-if="imageUrls.length === 1" class=" overflow-hidden relative group">
      <img :src="imageUrls[0]" class="w-full" draggable="false" height="300" width="450" loading="lazy" decoding="async"
        alt="Artbild" />
      <div class="flex w-full bg-neutral-50 p-1 px-3 justify-between">
        <div class="flex ">
          <Icon name="i-mingcute-copyright-line" class="h-4 w-4 my-1 mr-1" />
          <h1 weight="light" class="">
            Michael Krikorev
          </h1>
        </div>
        <h1>
          {{ currentIndex + 1 }} av {{ imageUrls.length }}
        </h1>


      </div>
    </div>
    <ImagePlaceholder class="rounded-none" v-else />

    <!-- Content Section -->
    <div class="px-5 pb-3 mt-4">
      <h1 class="text-2xl font-medium text-neutral-800">{{ capitalize(species.Commonname) }}</h1>
      <h1 class="text-neutral-500">{{ species.Scientificname }}</h1>

      <!-- Rarity indicators -->
      <div class="my-1">


        <div v-if="species['Rank matsvamp'] === 3" class="text-sm text-red-700 shrink-0 flex gap-1 items-center ">
          <UIcon name="codicon:circle-large-filled" class="size-3" />
          Minst vanlig matsvamp
        </div>
        <div v-if="species['Rank matsvamp'] === 2" class="text-sm text-yellow-600 shrink-0 flex gap-1 items-center">
          <UIcon name="codicon:color-mode" class="size-3" />
          Mindre vanlig matsvamp
        </div>
        <div v-if="species['Rank giftsvamp'] === 3" class="text-sm shrink-0 text-red-700 flex gap-1 items-center">
          <UIcon name="codicon:circle-large-filled" class="size-3" />
          Minst vanlig giftsvamp
        </div>
        <div v-if="species['Rank giftsvamp'] === 2" class="text-sm text-yellow-600 shrink-0 flex gap-1 items-center">
          <UIcon name="codicon:color-mode" class="size-3" />

          Mindre vanlig giftsvamp
        </div>
        <div v-if="species.RankRed === 3" class="text-sm text-red-700 shrink-0 flex gap-1 items-center">
          <UIcon name="codicon:circle-large-filled" class="size-3" />
          Sällsynt naturvårdsart
        </div>
        <div v-if="species.RankRed === 2" class="text-sm text-yellow-600 shrink-0 flex gap-1 items-center">
          <UIcon name="codicon:color-mode" class="size-3" />
          Ovanlig naturvårdsart
        </div>
      </div>
      <h1 class="mt-3 text-lg">
        {{ truncatedTextEkologi }}
      </h1>



      <div class="-mx-1 mt-4">
        <!-- Svamp-grupp Icon and Name -->
        <!-- <div class="mb-4">
          <div v-for="badge in taxonomyBadges" :key="badge.level" class="inline-flex m-1 h-fit align-bottom">
            <UTooltip :text="badge.tooltip">
              <UBadge variant="subtle" size="lg" :color="badge.color" :class="[badge.class, 'pointer-default']">
                {{ badge.label }}
              </UBadge>
            </UTooltip>
          </div>
          <div v-if="showPhylogeneticTreeButton && phylogeneticAnchor" class="inline-flex m-1 h-fit align-bottom">
            <UButton variant="outline" color="neutral" size="sm" icon="i-lucide-git-branch-plus" label="Visa i träd"
              @click="emit('showPhylogeneticTree', phylogeneticAnchor)" />
          </div>
        </div> -->

        <div class="inline-flex m-1 h-fit align-bottom" v-if="species['Svamp-grupp']">
          <UBadge color="neutral" variant="subtle" size="lg">
            <img :src="getIconPath(species['Svamp-grupp'], species['Svamp-grupp-släkte'])" class="w-4.5"
              alt="Svamp ikon" loading="lazy" decoding="async" />
            {{ capitalize(displayedSvampGrupp) }}
          </UBadge>

        </div>

        <!-- Matsvamp indicator -->
        <div class="shrink-0 inline-flex m-1 align-bottom" v-if="species.SKR_rek_matsvamp_2026 === 'x'">
          <UBadge color="warning" size="lg" variant="subtle" class="">
            <Icon name="icon-park-solid:knife-fork" />Matsvamp
          </UBadge>
        </div>

        <!-- Giftsvamp indicator -->
        <div class=" shrink-0 inline-flex m-1 align-bottom" v-if="species.Giftsvamp === 'x'">
          <UBadge color="poison" size="lg" variant="subtle" class="">
            <Icon name="hugeicons:danger" />Giftsvamp
          </UBadge>
          <!-- <Icon name="hugeicons:danger" class="h-7 w-7 text-lime-500 -my-2" />
        <h1 size="md" weight="light">Giftsvamp</h1> -->
        </div>

        <!-- SIGNAL_art indicator -->
        <div class=" shrink-0 inline-flex m-1 align-bottom" v-if="species.SIGNAL_art === 'S'">
          <UBadge color="signal" size="lg" variant="subtle" class="">Signalart</UBadge>
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

        <UBadge v-if="species.KALKmark" size="lg" color="kalkmark" variant="subtle"
          class="shrink-0 inline-flex m-1 align-bottom"> Kalkmark </UBadge>
        <UBadge v-if="species.ANNANmark" size="lg" color="vanligmark" variant="subtle"
          class="shrink-0 inline-flex m-1 align-bottom"> Vanlig skogsmark </UBadge>
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
        <div class="flex justify-between cursor-pointer" @click="toggleExpand">
          <h1 class="text-lg font-semibold mb-2 flex">
            <div class="flex items-center space-x-2" v-if="species.RL2020kat">
              <div :style="getStatusCircleStyle(species.RL2020kat)"
                class="h-8 w-8 p-4 rounded-full flex items-center justify-center text-white">
                {{ getStatusAbbreviation(species.RL2020kat) }}
              </div>
              <h1 size="md" weight="light">
                {{ getStatusTooltip(species.RL2020kat) }}
              </h1>
            </div>
          </h1>
          <Icon name="mdi:chevron-down" :class="[
            'h-6 w-6 transition-transform duration-300 ease-in-out',
            isExpanded ? 'rotate-180' : 'rotate-0',
          ]" />
        </div>
        <div class="relative overflow-hidden transition-transform duration-300 ease-in-out"
          :class="[isExpanded ? 'max-h-auto' : 'max-h-20']" v-if="species.Kriteriedokumentation" @click="toggleExpand">
          <h1 size="md" weight="light">
            {{ truncatedText }}
          </h1>
        </div>
      </UCard>
      <!-- <hr class="my-2" v-if="species.Kriteriedokumentation" /> -->

      <h1 class="text-md font-medium mt-4 mb-2">Läs mer på</h1>
      <UButton v-if="species.Artfakta != 'Information saknas'" :to="stripDetailsFromURL(species.Artfakta)"
        variant="solid" color="neutral" target="_blank" class=" mb-4" size="md"
        icon="i-heroicons-arrow-up-right-20-solid" label="Artfakta.se" trailing />
      <USeparator />

      <div v-if="plotChartSections.length" class="mt-5 space-y-4">
        <div>
          <h2 class="text-base font-semibold text-neutral-900">Förekomst i markinventeringens provytor</h2>
          <p class="text-sm text-neutral-500">
            {{ species.total_plot_count }} provytor med fynd
          </p>
        </div>


        <div v-for="section in plotChartSections" :key="section.key" class="p-2">
          <div class="mb-3 flex items-center justify-between gap-3">
            <h3 class="text-sm font-medium text-neutral-800">{{ section.title }}</h3>
            <div class="flex items-center gap-2 text-xs text-neutral-500">
              <span class="inline-flex items-center gap-1">
                <span class="size-2 rounded-full" :style="{ backgroundColor: section.colors[0] }" />
                Prov med förekomst
              </span>
              <span class="inline-flex items-center gap-1">
                <span class="size-2 rounded-full" :style="{ backgroundColor: section.colors[1] }" />
                Alla prov
              </span>
            </div>
          </div>

          <VisXYContainer :data="section.data" :height="190" :padding="{ top: 8, right: 8, bottom: 0, left: 8 }"
            :yDomain="[0]">
            <VisGroupedBar :x="plotChartXAccessor" :y="plotChartYAccessors" :color="section.colors" :groupPadding="0.3"
              :groupMaxWidth="24" />
            <VisAxis type="x" :tickValues="getPlotChartTickValues(section)"
              :tickFormat="(value) => plotChartTickFormat(section, value)" :tickTextAngle="20" tickTextAlign="left"
              :gridLine="false" :domainLine="false" />
            <VisAxis type="y" :tickFormat="plotChartPercentTickFormat" :gridLine="false" :domainLine="false" />
            <VisTooltip />
            <VisCrosshair :color="section.colors" :template="plotChartTooltip" />
          </VisXYContainer>
        </div>
      </div>

      <div v-else class="mt-4">
        <h2 class="text-base font-semibold text-neutral-900">Förekomst i markinventeringens provytor</h2>
        <p class="text-sm text-neutral-500">
          0 provytor med fynd
        </p>
      </div>

      <!-- <UButton v-if="species.Svampguiden && species.Svampguiden !== '0'" :to="stripDetailsFromURL(species.Svampguiden)"
        trailing label="Svampguiden.com" icon="i-heroicons-arrow-up-right-20-solid" target="_blank" variant="ghost"
        class=" text-primary-500 w-full" size="xl" /> -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { VisXYContainer, VisGroupedBar, VisAxis, VisTooltip, VisCrosshair } from '@unovis/vue'

const currentIndex = ref(0)

const props = defineProps({
  species: Object,
  showPhylogeneticTreeButton: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["showPhylogeneticTree"]);

const { data: plotComparisonMeta } = useFetch('/species/all-species-meta.json', {
  default: () => ({
    total_plot_count: 0,
    forest_type_plot_counts: {},
    stand_age_plot_counts: {},
    vegetation_plot_counts: {}
  }),
  server: false
})

const taxonomyBadgeColorByPhylum = {
  Basidiomycota: 'amber',
  Ascomycota: 'sky',
  Glomeromycota: 'purple'
}

const taxonomyBadgeClassMap = {
  sky: {
    fylum: 'bg-sky-200/90 text-sky-900 ring ring-inset ring-sky-300/90',
    klass: 'bg-sky-100 text-sky-800 ring ring-inset ring-sky-300/80',
    ordning: 'bg-sky-100 text-sky-700 ring ring-inset ring-sky-300/75',
    familj: 'bg-sky-50 text-sky-700 ring ring-inset ring-sky-200/80',
    slakte: 'bg-sky-100/70 text-sky-700 ring ring-inset ring-sky-200/90'
  },
  amber: {
    fylum: 'bg-amber-200/90 text-amber-900 ring ring-inset ring-amber-300/90',
    klass: 'bg-amber-100 text-amber-800 ring ring-inset ring-amber-300/80',
    ordning: 'bg-amber-100 text-amber-700 ring ring-inset ring-amber-300/75',
    familj: 'bg-amber-50 text-amber-700 ring ring-inset ring-amber-200/80',
    slakte: 'bg-amber-100/70 text-amber-700 ring ring-inset ring-amber-200/90'
  },
  purple: {
    fylum: 'bg-purple-200/90 text-purple-900 ring ring-inset ring-purple-300/90',
    klass: 'bg-purple-100 text-purple-800 ring ring-inset ring-purple-300/80',
    ordning: 'bg-purple-100 text-purple-700 ring ring-inset ring-purple-300/75',
    familj: 'bg-purple-50 text-purple-700 ring ring-inset ring-purple-200/80',
    slakte: 'bg-purple-100/70 text-purple-700 ring ring-inset ring-purple-200/90'
  },
  neutral: {
    fylum: 'bg-gray-200/90 text-gray-900 ring ring-inset ring-gray-300/90',
    klass: 'bg-gray-100 text-gray-800 ring ring-inset ring-gray-300/80',
    ordning: 'bg-gray-100 text-gray-700 ring ring-inset ring-gray-300/75',
    familj: 'bg-gray-50 text-gray-700 ring ring-inset ring-gray-200/80',
    slakte: 'bg-gray-100/70 text-gray-700 ring ring-inset ring-gray-200/90'
  }
}

// Since our prefetch now includes an "images" property, we simply use it:
const imageUrls = computed(() => props.species.images || []);

const phylogeneticAnchor = computed(() => {
  if (!props.species) return null;
  if (props.species["Släkte"]) return { level: "slakte", value: props.species["Släkte"] };
  if (props.species.Familj) return { level: "familj", value: props.species.Familj };
  if (props.species.Ordning) return { level: "ordning", value: props.species.Ordning };
  if (props.species.Klass) return { level: "klass", value: props.species.Klass };
  if (props.species.Fylum) return { level: "fylum", value: props.species.Fylum };
  return null;
});

const taxonomyBadges = computed(() => {
  const color = taxonomyBadgeColorByPhylum[props.species?.Fylum] || 'neutral'
  const levels = [
    { level: 'fylum', tooltip: 'Fylum', label: props.species?.Fylum },
    { level: 'klass', tooltip: 'Klass', label: props.species?.Klass },
    { level: 'ordning', tooltip: 'Ordning', label: props.species?.Ordning },
    { level: 'familj', tooltip: 'Familj', label: props.species?.Familj },
    { level: 'slakte', tooltip: 'Släkte', label: props.species?.['Släkte'] }
  ]

  return levels
    .filter((entry) => Boolean(entry.label))
    .map((entry) => ({
      ...entry,
      color,
      class: taxonomyBadgeClassMap[color][entry.level]
    }))
})

watch(imageUrls, () => {
  currentIndex.value = 0
})

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

const getStatusCircleStyle = (status) => {
  const colors = {
    LC: "var(--color-redlist-lc)",
    DD: "var(--color-redlist-dd)",
    NT: "var(--color-redlist-nt)",
    VU: "var(--color-redlist-vu)",
    EN: "var(--color-redlist-en)",
    CR: "var(--color-redlist-cr)",
    RE: "var(--color-redlist-re)",
  };
  return { backgroundColor: colors[status] || "#d4d4d4" };
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
    övrigt: "ovrigt.webp",
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

const plotChartColorBySection = {
  'forest-type': '#10b981',
  'stand-age': '#6366f1',
  vegetation: '#84cc16'
}
const plotChartComparisonColorBySection = {
  'forest-type': '#a7f3d0',
  'stand-age': '#c7d2fe',
  vegetation: '#d9f99d'
}

const plotChartXAccessor = (d) => d.index
const plotChartYAccessors = [
  (d) => d.speciesPercent,
  (d) => d.globalPercent
]
const getPlotChartTickValues = (section) => section.data.map((entry) => entry.index)
const plotChartTickFormat = (section, value) => {
  const match = section.data.find((entry) => entry.index === Number(value))
  return match?.label || ''
}
const plotChartPercentTickFormat = (value) => `${Math.round(Number(value) || 0)}%`
const plotChartTooltip = (d) => {
  if (!d) return ''
  return `<div class="text-sm"><strong>${d.label}</strong><br/><span style="color: ${d.speciesColor}">●</span> ${d.value} av ${d.totalPlots} provytor<br/><span style="color: ${d.globalColor}">●</span> ${d.globalCount} av ${d.globalTotalPlots} provytor</div>`
}

const buildPlotChartData = (countMap, globalCountMap) => {
  const totalPlots = Number(props.species?.total_plot_count || 0)
  const globalTotalPlots = Number(plotComparisonMeta.value?.total_plot_count || 0)

  return Object.entries(countMap || {})
    .map(([label, value], index) => ({
      index,
      label,
      value: Number(value || 0),
      totalPlots,
      speciesPercent: totalPlots > 0 ? (Number(value || 0) / totalPlots) * 100 : 0,
      globalCount: Number(globalCountMap?.[label] || 0),
      globalTotalPlots,
      globalPercent: globalTotalPlots > 0 ? (Number(globalCountMap?.[label] || 0) / globalTotalPlots) * 100 : 0
    }))
}

const plotChartSections = computed(() => {
  if (!props.species?.total_plot_count || props.species.total_plot_count <= 0) {
    return []
  }

  const sections = [
    {
      key: 'forest-type',
      title: 'Skogstyp',
      data: buildPlotChartData(
        props.species.forest_type_plot_counts,
        plotComparisonMeta.value?.forest_type_plot_counts
      )
    },
    {
      key: 'stand-age',
      title: 'Beståndsålder',
      data: buildPlotChartData(
        props.species.stand_age_plot_counts,
        plotComparisonMeta.value?.stand_age_plot_counts
      )
    },
    {
      key: 'vegetation',
      title: 'Fältskikt',
      data: buildPlotChartData(
        props.species.vegetation_plot_counts,
        plotComparisonMeta.value?.vegetation_plot_counts
      )
    }
  ]

  return sections
    .filter((section) => section.data.length > 0)
    .map((section) => {
      const colors = [
        plotChartColorBySection[section.key] || '#b1835e',
        plotChartComparisonColorBySection[section.key] || '#dcc7ad'
      ]

      return {
        ...section,
        data: section.data.map((entry) => ({
          ...entry,
          speciesColor: colors[0],
          globalColor: colors[1]
        })),
        total: section.data.reduce((sum, entry) => sum + entry.value, 0),
        colors
      }
    })
})
</script>
