<template>
  <div :class="['mx-auto', isFullWidth ? 'max-w-[150rem]' : 'max-w-[85rem]']" class="transition-all duration-500 px-4">
    <div class="transition-all duration-300">
      <div class="pt-2">
        <div class="w-full flex gap-2">
          <div class=" w-full mx-3 mt-2" v-if="!frameworksVisible">
            <div class="flex gap-2 items-center justify-between w-full">

              <div class="flex">
                <!-- Custom popover-based select for main framework -->
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <h1 class="text-2xl flex items-center ">
                    {{ currentFramework.label }}
                    <Icon name="i-heroicons-chevron-down-solid" class="size-5 ml-1 mt-1" />
                  </h1>

                  <template #content>
                    <div class="p-2 flex flex-col gap-2">
                      <div v-for="(framework, index) in frameworks" :key="framework.id"
                        @click="selectedFrameworkIndex = index"
                        class="flex items-center gap-2 cursor-pointer hover:bg-neutral-100 p-2 rounded-md">

                        <div>
                          <div class="font-medium">{{ framework.label }}</div>
                          <div class="text-sm text-neutral-500">
                            {{ framework.text }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </UPopover>
                <template v-if="isFrameworkCompareMode">
                  <div class="flex gap-2 items-center">
                    <h1 class="text-neutral-800 text-2xl">
                      <USeparator orientation="vertical" class="h-8 ml-5 mr-3" />
                    </h1>

                    <div>
                      <UPopover :ui="{ rounded: 'rounded-xl' }" :popper="{ placement: 'bottom-start' }">
                        <h1 class=" text-2xl flex items-center">
                          {{ currentFramework2.label }}
                          <Icon name="i-heroicons-chevron-down-solid" class="size-5 ml-1 mt-1" />
                        </h1>

                        <template #content>
                          <div class="p-2 flex flex-col gap-2">
                            <div v-for="(framework, index) in frameworks" :key="'framework2-' + framework.id"
                              @click="selectedFrameworkIndex2 = index"
                              class="flex items-center gap-2 cursor-pointer hover:bg-neutral-100 p-2 rounded-md">

                              <div>
                                <div class="font-medium">
                                  {{ framework.label }}
                                </div>
                                <div class="text-sm text-neutral-500">
                                  {{ framework.text }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>
                      </UPopover>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="flex">

          <div class="w-full">
            <div class="flex gap-2 items-center justify-between mx-1">
              <div class="flex gap-3 items-center">
                <UPopover v-model:open="open" :popper="{ placement: 'bottom-start' }">
                  <UBadge size="lg" variant="subtle" class="h-fit" color="neutral">{{ currentStartskog.label }}
                  </UBadge>
                  <!-- <USeparator orientation="vertical" class="h-8" /> -->

                  <template #content>
                    <div class="p-1 flex flex-col gap-1">
                      <div v-for="option in startskog" :key="option.value">
                        <UButton @click="selectOption(option)" color="white" variant="ghost"
                          class="hover:bg-neutral-100 w-full" :class="{
                            ' w-full  text-primary-500':
                              currentStartskog.value === option.value,
                          }">{{ option.label }}
                        </UButton>
                      </div>
                    </div>
                  </template>
                </UPopover>
                <UTabs variant="link" color="neutral" v-model="selectedTimeIndex" :items="timeItems" size="md" />

              </div>
              <div class="flex">




                <UDropdownMenu :items="compareItems" :content="{ align: 'end', side: 'bottom', sideOffset: 8 }">
                  <UButton :label="selectedCompareLabel" variant="ghost" color="neutral" :icon="activatorIcon" />
                </UDropdownMenu>
                <!-- <USelect v-model="selectedCompareChoice" :items="compareOptions" placeholder="Välj jämförelseläge"
                    class="" variant="ghost" /> -->
                <UButton variant="ghost" color="neutral" icon="i-heroicons-x-mark-solid"
                  v-if="selectedCompareChoice === 'frameworkCompare' || selectedCompareChoice === 'beforeAfterCompare'"
                  @click="selectedCompareChoice = 'none'" />
              </div>
            </div>
            <!-- <div class="relative w-full h-[600px] resize-y overflow-auto flex p-1 pt-0 rounded-lg"> -->
            <div ref="resizableContainer" class="relative w-full overflow-visible flex p-1 pt-0 rounded-lg"
              :style="{ height: containerHeight + 'px' }">
              <div class="relative w-full ">


                <div v-if="chartVisible"
                  class="w-[45rem]  absolute top-9 left-1/2 transform -translate-x-1/2 bg-neutral-900/70 backdrop-blur-xl rounded-2xl shadow p-4 border border-neutral-700 z-20">

                  <div class="w-full justify-between flex pl-2">
                    <div class="text-neutral-100 text-xl flex gap-2 items-center">
                      <h1>{{ currentFramework.label }}</h1>
                      <div class="flex items-center" v-if="isFrameworkCompareMode">
                        <USeparator orientation="vertical" class="h-6 mr-2 " color="" />
                        <h1 class="text-blue-400">{{ currentFramework2.label }}</h1>
                      </div>
                    </div>

                    <div class="flex gap-1">

                      <UButton color="neutral" variant="solid" @click="toggleChartType" size="sm"
                        :icon="chartType === 'line' ? 'i-carbon-chart-column' : 'i-carbon-chart-line-smooth'"
                        class="z-10 hover:bg-neutral-800 bg-neutral-900 text-neutral-100 mb-2" />
                      <UButton color="neutral" variant="solid" @click="toggleChartVisible" icon="i-heroicons-x-mark"
                        size="sm" class="z-10 hover:bg-neutral-800 bg-neutral-900 text-neutral-100 mb-2" />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-8">
                    <div class="px-2">
                      <p class="text-neutral-400">Diagramet för total mykorrhizasvamp visar andelen mycelmassa
                        relativt till den ursprungliga mängden i <span @click="toggleOverlay"
                          class="underline  hover:cursor-pointer">skötselområdet</span>. Kurvan återspeglar
                        sockertillförseln
                        från träden till
                        marken.
                      </p>
                      <p class="text-neutral-200 my-2">Total mykorrhizasvamp</p>
                      <LineChartForestry species="total" :selectedFramework="currentFramework.value"
                        :isComparison="isFrameworkCompareMode" :secondFramework="currentFramework2.value"
                        dataSource="total" :chartType="chartType" />
                    </div>
                    <div class="px-2">
                      <p class="text-neutral-400">Diagramen för matsvamp och naturvårdsarter visar andelen svampmycel
                        relativt
                        till den totala mängden
                        mykorrhizamycel i
                        hela
                        <span @click="toggleOverlay" class="underline  hover:cursor-pointer">skötselområdet</span>.
                      </p>
                      <p class="text-neutral-200 my-2">Matsvamp</p>
                      <LineChartForestry species="matsvamp" :selectedFramework="currentFramework.value"
                        :selectedStartskog="currentStartskog.value" :isComparison="isFrameworkCompareMode"
                        :secondFramework="currentFramework2.value" :chartType="chartType" />
                      <p class="text-neutral-200 my-2">Rödlistade och signalarter</p>
                      <LineChartForestry species="rödlistade + signalarter" :selectedFramework="currentFramework.value"
                        :selectedStartskog="currentStartskog.value" :isComparison="isFrameworkCompareMode"
                        :secondFramework="currentFramework2.value" :chartType="chartType" />
                    </div>
                  </div>



                </div>



                <div class="absolute p-2 z-10">
                  <div>
                    <UButton color="neutral" variant="solid" @click="opacitySyncEnabled = !opacitySyncEnabled"
                      :icon="opacitySyncEnabled ? 'mdi:lock' : 'mdi:lock-open'"
                      class=" z-10 hover:bg-neutral-800 bg-neutral-900 text-neutral-100 mb-2" />
                  </div>
                  <div>
                    <UButtonGroup class="size-xs  mb-2">


                      <UButton color="neutral" variant="solid" @click="toggleOverlay"
                        class="hover:bg-neutral-800 bg-neutral-900 text-neutral-100"
                        icon="i-material-symbols-rectangle-outline" />
                      <UButton color="neutral" variant="solid" @click="zoomActiveIn"
                        class="hover:bg-neutral-800 bg-neutral-900 text-neutral-100"
                        icon="i-heroicons-magnifying-glass-plus" />
                      <UButton color="neutral" variant="solid" @click="zoomActiveOut"
                        class="hover:bg-neutral-800 bg-neutral-900 text-neutral-100"
                        icon="i-heroicons-magnifying-glass-minus" />
                    </UButtonGroup>
                  </div>
                  <div>
                    <UButton color="neutral" variant="solid" @click="toggleChartVisible"
                      icon="i-carbon-chart-line-smooth"
                      class=" z-10 hover:bg-neutral-800 bg-neutral-900 text-neutral-100 mb-2" />
                  </div>
                  <div class="shrink-0 bg-neutral-950/50 backdrop-blur-lg rounded-md"
                    v-if="!isCompare && !isFrameworkCompareMode">
                    <ul>
                      <li v-for="annotation in filteredAnnotations" :key="annotation.id" class="mb-0.5">
                        <UButton :color="selectedAnnotation &&
                          selectedAnnotation.id === annotation.id
                          ? 'green'
                          : 'white'
                          " :variant="selectedAnnotation &&
                            selectedAnnotation.id === annotation.id
                            ? 'soft'
                            : 'solid'
                            " size="xs" class="w-full text-neutral-100" @click="handleAnnotationClicked(annotation)">
                          <template #leading>
                            <Icon :name="annotation.icon" :class="selectedAnnotation &&
                              selectedAnnotation.id === annotation.id
                              ? 'text-green-500'
                              : ['text-' + annotation.color]
                              " class="size-4" />
                          </template>
                          {{ annotation.title }}
                        </UButton>
                      </li>
                    </ul>
                  </div>
                </div>



                <!-- Single View -->
                <div v-if="!isCompare && !isFrameworkCompareMode"
                  class="w-full h-full overflow-hidden rounded-xl relative border border-neutral-200 dark:border-neutral-800 shadow">
                  <OpenSeadragonViewer :currentFramework="currentFramework" :currentTime="timeLabelForDataFiltering"
                    :currentStartskog="currentStartskog" :layoutMode="currentLayoutMode" ref="singleViewerRef"
                    :frameworkLabel="currentFramework.label" :timeLabel="currentTimeLabel"
                    :dziUrl="currentImagePath.replace('.png', '.dzi')"
                    :overlayDziUrl="currentOverlayImagePath.replace('.png', '.dzi')" :allowPan="true"
                    :annotations="filteredAnnotations" :selectedAnnotation="selectedAnnotation"
                    v-if="!opacitySyncEnabled" @annotationClicked="handleAnnotationClicked" class="w-full h-full" />
                  <OpenSeadragonViewer :currentFramework="currentFramework" :currentTime="timeLabelForDataFiltering"
                    :currentStartskog="currentStartskog" :layoutMode="currentLayoutMode" ref="singleViewerRef"
                    :frameworkLabel="currentFramework.label" :timeLabel="currentTimeLabel"
                    :dziUrl="currentImagePath.replace('.png', '.dzi')"
                    :overlayDziUrl="currentOverlayImagePath.replace('.png', '.dzi')" :allowPan="true"
                    :annotations="filteredAnnotations" :selectedAnnotation="selectedAnnotation" v-else
                    v-model:globalOpacity="globalOpacity" @annotationClicked="handleAnnotationClicked"
                    class="w-full h-full" />
                  <transition name="slide-out">
                    <div v-if="selectedAnnotation"
                      class="absolute inset-y-0 right-0  w-68 bg-neutral-50 overflow-auto z-10 pointer-events-auto border-neutral-300 border-l ">
                      <div class="h-64 flex items-center justify-center text-neutral-300">
  Bild kommer snart
</div>
                      
                      <!-- <NuxtImg v-if="selectedAnnotation.thumbnail" :src="selectedAnnotation.thumbnail" width="300"
                        height="300" alt="Thumbnail" class=" border-b border-neutral-300" /> -->
                      <UButton color="white" :ui="{ rounded: 'rounded-full' }" icon="heroicons:x-mark"
                        @click="closeAnnotation" class="absolute bottom-2 right-2" />
                      <div class="px-4 py-2">
                        <h3 class="text-lg font-semibold text-neutral-800">
                          {{ selectedAnnotation.title }}
                        </h3>
                        <p class="text-neutral-400">
                          {{ selectedAnnotation.text }}
                        </p>
                      </div>
                    </div>
                  </transition>

                </div>

                <!-- Before/After Compare -->

                <CustomImageComparisonSlider class="w-full h-full" ref="comparisonSliderRef" v-else-if="isCompare"
                  :frameworkLabel="currentFramework.label" timeLabel="Före avverkning"
                  :frameworkLabel2="currentFramework.label" :timeLabel2="currentTimeLabel"
                  :layoutMode="currentLayoutMode">
                  <template #first>
                    <OpenSeadragonViewer :currentFramework="currentFramework" currentTime="innan"
                      :currentStartskog="currentStartskog" :layoutMode="currentLayoutMode" ref="beforeViewerRef"
                      :comparisonMode="true" :frameworkLabel="currentFramework.label" timeLabel="Före avverkning"
                      :dziUrl="comparisonImagePath1.replace('.png', '.dzi')"
                      :overlayDziUrl="comparisonOverlayImagePath1.replace('.png', '.dzi')" :allowPan="true"
                      @opened="onViewerOpened('before')" @activated="activeViewer.valueOf = 'before'"
                      v-if="!opacitySyncEnabled"
                      class="w-full h-full z-0 rounded-xl border-[0.5px] border-neutral-300 dark:border-neutral-800 overflow-hidden" />
                    <OpenSeadragonViewer :currentFramework="currentFramework" currentTime="innan"
                      :currentStartskog="currentStartskog" :layoutMode="currentLayoutMode" ref="beforeViewerRef"
                      :comparisonMode="true" :frameworkLabel="currentFramework.label" timeLabel="Före avverkning"
                      :dziUrl="comparisonImagePath1.replace('.png', '.dzi')"
                      :overlayDziUrl="comparisonOverlayImagePath1.replace('.png', '.dzi')" :allowPan="true"
                      @opened="onViewerOpened('before')" @activated="activeViewer.valueOf = 'before'" v-else
                      v-model:globalOpacity="globalOpacity"
                      class="w-full h-full z-0 rounded-xl border-[0.5px] border-neutral-300 dark:border-neutral-800 overflow-hidden" />
                  </template>
                  <template #second>
                    <OpenSeadragonViewer :currentFramework="currentFramework" :currentTime="timeLabelForDataFiltering"
                      :currentStartskog="currentStartskog" :layoutMode="currentLayoutMode" ref="afterViewerRef"
                      :comparisonMode="true" :frameworkLabel="currentFramework.label" :timeLabel="currentTimeLabel"
                      :dziUrl="currentImagePath.replace('.png', '.dzi')"
                      :overlayDziUrl="comparisonOverlayImagePath2.replace('.png', '.dzi')" :allowPan="true"
                      sliderPosition="right" @opened="onViewerOpened('after')"
                      @activated="activeViewer.valueOf = 'after'" v-if="!opacitySyncEnabled"
                      class="w-full h-full z-0 rounded-xl border-[0.5px] border-neutral-300 dark:border-neutral-800 overflow-hidden" />
                    <OpenSeadragonViewer :currentFramework="currentFramework2" :currentTime="timeLabelForDataFiltering"
                      :currentStartskog="currentStartskog" :layoutMode="currentLayoutMode" ref="afterViewerRef"
                      :comparisonMode="true" :frameworkLabel="currentFramework.label" :timeLabel="currentTimeLabel"
                      :dziUrl="currentImagePath.replace('.png', '.dzi')"
                      :overlayDziUrl="comparisonOverlayImagePath2.replace('.png', '.dzi')" :allowPan="true"
                      sliderPosition="right" @opened="onViewerOpened('after')"
                      @activated="activeViewer.valueOf = 'after'" v-else v-model:globalOpacity="globalOpacity"
                      class="w-full h-full z-0 rounded-xl border-[0.5px] border-neutral-300 dark:border-neutral-800 overflow-hidden" />
                  </template>
                </CustomImageComparisonSlider>

                <!-- Framework Compare -->
                <CustomImageComparisonSlider v-else-if="isFrameworkCompareMode" ref="comparisonSliderRef"
                  :frameworkLabel="currentFramework.label" :timeLabel="currentTimeLabel"
                  :frameworkLabel2="currentFramework2.label" :timeLabel2="currentTimeLabel"
                  :layoutMode="currentLayoutMode" class="w-full h-full">
                  <template #first>
                    <OpenSeadragonViewer :currentFramework="currentFramework" :currentTime="timeLabelForDataFiltering"
                      :currentStartskog="currentStartskog" :layoutMode="currentLayoutMode" ref="framework1ViewerRef"
                      :comparisonMode="true" :frameworkLabel="currentFramework.label" :timeLabel="currentTimeLabel"
                      :dziUrl="currentImagePath.replace('.png', '.dzi')"
                      :overlayDziUrl="frameworkOverlayImagePath1.replace('.png', '.dzi')"
                      :allowPan="!isCompare && !isFrameworkCompareMode" v-if="!opacitySyncEnabled"
                      @viewportChanged="($event) => onViewportChanged('framework1', $event)"
                      @opened="onViewerOpened('framework1')" @activated="activeViewer.valueOf = 'framework1'"
                      class="w-full h-full z-0 rounded-xl border-[0.5px] border-neutral-300 dark:border-neutral-800 overflow-hidden" />
                    <OpenSeadragonViewer :currentFramework="currentFramework" :currentTime="timeLabelForDataFiltering"
                      :currentStartskog="currentStartskog" :layoutMode=currentLayoutMode ref="framework1ViewerRef"
                      :comparisonMode="true" :frameworkLabel="currentFramework.label" :timeLabel="currentTimeLabel"
                      :dziUrl="currentImagePath.replace('.png', '.dzi')"
                      :overlayDziUrl="frameworkOverlayImagePath1.replace('.png', '.dzi')"
                      :allowPan="!isCompare && !isFrameworkCompareMode" v-else v-model:globalOpacity="globalOpacity"
                      @viewportChanged="($event) => onViewportChanged('framework1', $event)"
                      @opened="onViewerOpened('framework1')" @activated="activeViewer.valueOf = 'framework1'"
                      class="w-full h-full z-0 rounded-xl border-[0.5px] border-neutral-300 dark:border-neutral-800 overflow-hidden" />
                  </template>
                  <template #second>
                    <OpenSeadragonViewer :currentFramework="currentFramework2" :currentTime="timeLabelForDataFiltering"
                      :currentStartskog="currentStartskog" :layoutMode="currentLayoutMode" ref="framework2ViewerRef"
                      :comparisonMode="true" :frameworkLabel="currentFramework2.label" :timeLabel="currentTimeLabel"
                      :dziUrl="currentImagePath2.replace('.png', '.dzi')"
                      :overlayDziUrl="frameworkOverlayImagePath2.replace('.png', '.dzi')" v-if="!opacitySyncEnabled"
                      :allowPan="!isCompare && !isFrameworkCompareMode" sliderPosition="right"
                      @viewportChanged="($event) => onViewportChanged('framework2', $event)"
                      @opened="onViewerOpened('framework2')" @activated="activeViewer.valueOf = 'framework2'"
                      class="w-full h-full z-0 rounded-xl border-[0.5px] border-neutral-300 dark:border-neutral-800 overflow-hidden" />

                    <OpenSeadragonViewer :currentFramework="currentFramework2" :currentTime="timeLabelForDataFiltering"
                      :currentStartskog="currentStartskog" :layoutMode="currentLayoutMode" ref="framework2ViewerRef"
                      :comparisonMode="true" :frameworkLabel="currentFramework2.label" :timeLabel="currentTimeLabel"
                      :dziUrl="currentImagePath2.replace('.png', '.dzi')"
                      :overlayDziUrl="frameworkOverlayImagePath2.replace('.png', '.dzi')" v-else
                      v-model:globalOpacity="globalOpacity" :allowPan="!isCompare && !isFrameworkCompareMode"
                      sliderPosition="right" @viewportChanged="($event) => onViewportChanged('framework2', $event)"
                      @opened="onViewerOpened('framework2')" @activated="activeViewer.valueOf = 'framework2'"
                      class="w-full h-full z-0 rounded-xl border-[0.5px] border-neutral-300 dark:border-neutral-800 overflow-hidden" />

                  </template>
                </CustomImageComparisonSlider>
              </div>
              <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-full flex justify-center z-10">
                <!-- Style the handle as needed -->
                <div class="h-1.5  w-24 bg-neutral-500/30 hover:bg-neutral-500/70 rounded cursor-grab transition-all"
                  @pointerdown="startVerticalResize">
                </div>
              </div>
              <div class="absolute -bottom-8 w-full flex justify-end pr-2">

                <UButton @click="toggleFullWidth" color="neutral" variant="ghost"
                  :icon="isFullWidth ? 'i-ri-collapse-horizontal-line' : 'i-ri-expand-horizontal-s-line'">

                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>



<script setup>
// import SvampLineChart from "~/components/SvampLineChart.vue";
import OpenSeadragonViewer from "~/components/OpenSeadragonViewer.vue";
import { ref, computed, watch } from "vue";
import { useOnboardingStore } from "~/stores/onboardingStore";
import annotationsData from "public/annotations.json"; // NEW: import your annotations JSON
import { useSelectedAnnotationStore } from "~/stores/selectedAnnotationStore";
import { useOverlayStore } from "~/stores/overlayStore";

// New reactive variable for container width (in rem), starting at 85rem.
const containerWidth = ref(85);

// Variables to track horizontal resizing
let startX = 0;
let startWidth = containerWidth.value;

function startResizing(event) {
  isResizing = true;
  startX = event.clientX;
  startWidth = containerWidth.value;
  window.addEventListener('pointermove', handleResize);
  window.addEventListener('pointerup', stopResizing);
}

function handleResize(event) {
  if (!isResizing) return;
  const dx = event.clientX - startX;
  // Convert pixels to rem (assuming base 16px per rem)
  const dxRem = dx / 16;
  containerWidth.value = startWidth + dxRem;
}

function stopResizing() {
  isResizing = false;
  window.removeEventListener('pointermove', handleResize);
  window.removeEventListener('pointerup', stopResizing);
}

onUnmounted(() => {
  window.removeEventListener('pointermove', handleResize);
  window.removeEventListener('pointerup', stopResizing);
});

const containerHeight = ref(600);

// Variables to store state while resizing
let isResizing = false;
let startY = 0;
let startHeight = containerHeight.value;

function startVerticalResize(event) {
  isResizing = true;
  startY = event.clientY;
  startHeight = containerHeight.value;
  window.addEventListener('pointermove', handleVerticalResize);
  window.addEventListener('pointerup', stopVerticalResize);
}

function handleVerticalResize(event) {
  if (!isResizing) return;
  const dy = event.clientY - startY;
  containerHeight.value = startHeight + dy;
}

function stopVerticalResize() {
  isResizing = false;
  window.removeEventListener('pointermove', handleVerticalResize);
  window.removeEventListener('pointerup', stopVerticalResize);
}

// Clean up event listeners when the component unmounts
onUnmounted(() => {
  window.removeEventListener('pointermove', handleVerticalResize);
  window.removeEventListener('pointerup', stopVerticalResize);
});

const isFullWidth = ref(false);

function toggleFullWidth() {
  isFullWidth.value = !isFullWidth.value;
}

// const overlayOpacityValue = ref(0.8);

const chartVisible = ref(false)

function toggleChartVisible() {
  chartVisible.value = !chartVisible.value;
}
// Global opacity sync state
const opacitySyncEnabled = ref(false);
const globalOpacity = ref(1);

// Assuming the base image is currentImagePath (trees off)
// For the overlay image, force trees to be visible.
const currentOverlayImagePath = computed(() => {
  const framework = currentFramework.value.value.toLowerCase();
  const tLabel = mapTimeToLabel(time.value);
  // Force trees to be visible (replace the tree visibility flag with 'visa')
  const treeVisibility = "visa";
  const fungiVisibility = showFungi.value ? "visa" : "dölj";
  const startskogValue = currentStartskog.value.value;
  return `/images/DZI_Images/${framework}_${tLabel}_${fungiVisibility}_${treeVisibility}_${startskogValue}_v2.png`;
});

// For the "before" viewer (often using a static time label like "före")
const comparisonOverlayImagePath1 = computed(() => {
  const framework = currentFramework.value.value.toLowerCase();
  const tLabel = "före"; // or another fixed value if needed
  const treeVisibility = "visa"; // force trees visible if desired
  const fungiVisibility = showFungi.value ? "visa" : "dölj";
  const startskogValue = currentStartskog.value.value;
  return `/images/DZI_Images/${framework}_${tLabel}_${fungiVisibility}_${treeVisibility}_${startskogValue}_v2.png`;
});

// For the "after" viewer (using the current time label)
const comparisonOverlayImagePath2 = computed(() => {
  const framework = currentFramework.value.value.toLowerCase();
  const tLabel = mapTimeToLabel(time.value);
  const treeVisibility = "visa"; // force trees visible if desired
  const fungiVisibility = showFungi.value ? "visa" : "dölj";
  const startskogValue = currentStartskog.value.value;
  return `/images/DZI_Images/${framework}_${tLabel}_${fungiVisibility}_${treeVisibility}_${startskogValue}_v2.png`;
});

// For framework1 viewer:
const frameworkOverlayImagePath1 = computed(() => {
  const framework = currentFramework.value.value.toLowerCase();
  const tLabel = mapTimeToLabel(time.value);
  const treeVisibility = "visa";
  const fungiVisibility = showFungi.value ? "visa" : "dölj";
  const startskogValue = currentStartskog.value.value;
  return `/images/DZI_Images/${framework}_${tLabel}_${fungiVisibility}_${treeVisibility}_${startskogValue}_v2.png`;
});

// For framework2 viewer:
const frameworkOverlayImagePath2 = computed(() => {
  const framework = currentFramework2.value.value.toLowerCase();
  const tLabel = mapTimeToLabel(time.value);
  const treeVisibility = "visa";
  const fungiVisibility = showFungi.value ? "visa" : "dölj";
  const startskogValue = currentStartskog.value.value;
  return `/images/DZI_Images/${framework}_${tLabel}_${fungiVisibility}_${treeVisibility}_${startskogValue}_v2.png`;
});

const overlayStore = useOverlayStore();
function toggleOverlay() {
  overlayStore.toggleStaticOverlay();
}

const selectedAnnotationStore = useSelectedAnnotationStore();
const selectedAnnotation = computed(
  () => selectedAnnotationStore.selectedAnnotation
);

// Now, when a marker or button is clicked, call:
function handleAnnotationClicked(annotation) {
  selectedAnnotationStore.setSelectedAnnotation(annotation);
  // Center the viewer on the annotation if it has a valid position.
  if (annotation.position && singleViewerRef.value) {
    // Use the current zoom level to maintain the current scale.
    const currentZoom = singleViewerRef.value.getZoom();
    // Center the viewport on the annotation's x and y coordinates.
    singleViewerRef.value.setZoomAndCenter(currentZoom, annotation.position);
  }
}

function closeAnnotation() {
  selectedAnnotationStore.clearSelectedAnnotation();
}

// Make sure you have a ref attached to your CustomImageComparisonSlider:
const comparisonSliderRef = ref(null);

const chartType = ref('line')

function toggleChartType() {
  chartType.value = chartType.value === 'line' ? 'bar' : 'line'
}

// Initialize the store
const onboardingStore = useOnboardingStore();

// Other refs
const frameworksVisible = ref(false);
const showFungi = ref(true);
const isFrameworkCompareMode = ref(false);
const isCompare = ref(false);

// Define selectedFrameworkIndex
const selectedFrameworkIndex = computed({
  get: () => onboardingStore.selectedFramework,
  set: (value) => (onboardingStore.selectedFramework = value),
});

// Define selectedStartskogIndex
const selectedStartskogIndex = computed({
  get: () => onboardingStore.selectedStartskog ?? 0,
  set: (val) => {
    onboardingStore.selectedStartskog = val;
  },
});

// Define selectedFrameworkIndex2 as an independent ref
const selectedFrameworkIndex2 = ref(selectedFrameworkIndex.value);
const currentFramework2 = computed(() => {
  // This ensures that if selectedFrameworkIndex2 is out of bounds, we still get the first framework
  return frameworks[selectedFrameworkIndex2.value] || frameworks[0];
});

watch([isFrameworkCompareMode, isCompare], ([frameworkCompare, compare]) => {
  if (!frameworkCompare || !compare) {
    compareChoice.value = "framework1";
  }
});

const open = ref(false);

defineShortcuts({
  o: () => (open.value = !open.value),
});

// Function to handle selecting an option
const selectOption = (option) => {
  const newIndex = startskog.findIndex((o) => o.value === option.value);
  if (newIndex !== -1) {
    selectedStartskogIndex.value = newIndex;
  }
  open.value = false;
};

// Frameworks array
const frameworks = [
  {
    id: 0,
    label: "Ingen åtgärd",
    value: "naturskydd",
    text: "Orörd skog",
    icon: "pepicons-pop:tree-circle",
    iconColor: "text-green-500",
  },
  {
    id: 1,
    label: "Trakthygge",
    value: "trakthygge",
    text: "Kalavverkning med hänsyn",
    icon: "material-symbols:resize",
    iconColor: "text-violet-500",
  },
  {
    id: 2,
    label: "Luckhuggning",
    value: "luckhuggning",
    text: "Mindre ytor kalavverkas",
    icon: "pixelarticons:chess",
    iconColor: "text-sky-500",
  },
  {
    id: 3,
    label: "Överhållen skärm",
    value: "skärmträd",
    text: "Överhållen skärm",
    icon: "catppuccin:redwood",
    iconColor: "text-orange-500",
  },
  {
    id: 4,
    label: "Blädning",
    value: "blädning",
    text: "Enstaka träd gallras",
    icon: "lineicons:trees",
    iconColor: "text-teal-500",
  },
];

// Startskog array
const startskog = [
  { label: "I äldre skog som inte kalavverkats", value: "naturskog" },
  { label: "I skog som har kalavverkats", value: "produktionsskog_" },
];

// Current framework and startskog
const currentFramework = computed(() =>
  frameworks[selectedFrameworkIndex.value !== undefined ? selectedFrameworkIndex.value : 0]
);
// Compute the current startskog object based on the store index
// The current startskog object from the options array
const currentStartskog = computed(
  () => startskog[selectedStartskogIndex.value]
);

// Time references
const time = ref(3);

// Handle time selection
function handleTimeSelection(step) {
  if (isCompare.value && step.value === 3) return;
  time.value = step.value;
}

// Mapping functions
function mapTimeValueToDataAlder(value) {
  const mapping = {
    3: "innan",
    15: "efter",
    30: "10 år",
    45: "20 år",
    70: "50 år",
    99: "80 år",
  };
  return mapping[value] || "innan";
}

function mapTimeToLabel(value) {
  const step = sliderSteps.value.find((s) => s.value === value);
  return step ? step.timeLabel : "före";
}

// Slider steps
const sliderSteps = computed(() => {
  const steps = [
    { value: 3, label: "Före avverkning", timeLabel: "före" },
    { value: 15, label: "1 år efter ", timeLabel: "efter" },
  ];
  if (
    currentFramework.value?.value === "skärmträd" &&
    !isFrameworkCompareMode.value
  ) {
    steps.push({ value: 30, label: "10 år efter", timeLabel: "10" });
  }
  steps.push(
    { value: 45, label: "20 år efter ", timeLabel: "20" },
    { value: 70, label: "50 år efter ", timeLabel: "50" },
    { value: 99, label: "+ 80 år efter ", timeLabel: "80" }
  );
  return steps;
});

// Create UTabs items from sliderSteps
const timeItems = computed(() =>
  sliderSteps.value.map((step) => ({
    key: String(step.value), // Ensure the key is a string
    label: step.label,
    disabled: isCompare.value && step.value === 3,
  }))
);

// Create a computed property that gets/sets the selected tab index
// based on the time value. When set, it calls handleTimeSelection.
// Use a ref for the selected tab index
const selectedTimeIndex = ref(0);

// Watch the selectedTimeIndex and update time when it changes
watch(selectedTimeIndex, (newIndex) => {
  const step = sliderSteps.value[newIndex];
  if (step) {
    handleTimeSelection(step);
  }
});

// Current time labels
const currentTimeLabel = computed(() => {
  const step = sliderSteps.value.find((s) => s.value === time.value);
  return step ? step.label : "";
});

// Time for data filtering
const time2 = computed(() => (isCompare.value ? 3 : null));
const timeLabelForDataFiltering2 = computed(() =>
  time2.value !== null ? mapTimeValueToDataAlder(time2.value) : null
);
const timeLabelForDataFiltering = computed(() =>
  mapTimeValueToDataAlder(time.value)
);

// Image paths
const comparisonImagePath1 = computed(() => {
  const framework = currentFramework.value.value.toLowerCase();
  const timeLabel = "före";
  const treeVisibility = "dölj";
  const fungiVisibility = showFungi.value ? "visa" : "dölj";
  const startskogValue = currentStartskog.value.value;
  return `/images/DZI_Images/${framework}_${timeLabel}_${fungiVisibility}_${treeVisibility}_${startskogValue}_v2.png`;
});

const currentImagePath2 = computed(() => {
  const framework = currentFramework2.value.value.toLowerCase();
  const tLabel = mapTimeToLabel(time.value);
  const treeVisibility = "dölj";
  const fungiVisibility = showFungi.value ? "visa" : "dölj";
  const startskogValue = currentStartskog.value.value;
  return `/images/DZI_Images/${framework}_${tLabel}_${fungiVisibility}_${treeVisibility}_${startskogValue}_v2.png`;
});

const currentImageKey = computed(() => {
  const framework = currentFramework.value.value.toLowerCase();
  const tLabel = mapTimeToLabel(time.value);
  return `${framework}_${tLabel}`;
});

const currentImagePath = computed(() => {
  const framework = currentFramework.value.value.toLowerCase();
  const tLabel = mapTimeToLabel(time.value);
  const treeVisibility = "dölj";
  const fungiVisibility = showFungi.value ? "visa" : "dölj";
  const startskogValue = currentStartskog.value.value;
  return `/images/DZI_Images/${framework}_${tLabel}_${fungiVisibility}_${treeVisibility}_${startskogValue}_v2.png`;
});

// Watchers
watch([currentFramework, isCompare, isFrameworkCompareMode], () => {
  const validValues = sliderSteps.value.map((s) => s.value);
  if (!validValues.includes(time.value)) {
    time.value = 15;
  }
});

// Viewer references
const singleViewerRef = ref(null);
const beforeViewerRef = ref(null);
const afterViewerRef = ref(null);

// Guard flags to prevent infinite loops
let beforeSyncGuard = false;
let afterSyncGuard = false;

// Synchronization handlers for before/after viewers
function beforeViewerSyncHandler() {
  if (afterSyncGuard) return;
  beforeSyncGuard = true;
  const zoom = beforeViewerRef.value?.getZoom();
  const center = beforeViewerRef.value?.getCenter();
  if (zoom && center && afterViewerRef.value) {
    afterViewerRef.value.setZoomAndCenter(zoom, center);
  }
  beforeSyncGuard = false;
}

function afterViewerSyncHandler() {
  if (beforeSyncGuard) return;
  afterSyncGuard = true;
  const zoom = afterViewerRef.value?.getZoom();
  const center = afterViewerRef.value?.getCenter();
  if (zoom && center && beforeViewerRef.value) {
    beforeViewerRef.value.setZoomAndCenter(zoom, center);
  }
  afterSyncGuard = false;
}

function onViewerOpened(source) {
  if (source === "before" && beforeViewerRef.value) {
    beforeViewerRef.value.addSyncHandler("zoom", beforeViewerSyncHandler);
    beforeViewerRef.value.addSyncHandler("pan", beforeViewerSyncHandler);
  } else if (source === "after" && afterViewerRef.value) {
    afterViewerRef.value.addSyncHandler("zoom", afterViewerSyncHandler);
    afterViewerRef.value.addSyncHandler("pan", afterViewerSyncHandler);
  } else if (source === "framework1" && framework1ViewerRef.value) {
    framework1ViewerRef.value.addSyncHandler("zoom", framework1SyncHandler);
    framework1ViewerRef.value.addSyncHandler("pan", framework1SyncHandler);
  } else if (source === "framework2" && framework2ViewerRef.value) {
    framework2ViewerRef.value.addSyncHandler("zoom", framework2SyncHandler);
    framework2ViewerRef.value.addSyncHandler("pan", framework2SyncHandler);
  }
}

// Define new guard flags for framework compare mode:
let framework1SyncGuard = false;
let framework2SyncGuard = false;

// Define sync handler for framework1 viewer.
function framework1SyncHandler() {
  if (framework2SyncGuard) return;
  framework1SyncGuard = true;
  const zoom = framework1ViewerRef.value?.getZoom();
  const center = framework1ViewerRef.value?.getCenter();
  if (zoom && center && framework2ViewerRef.value) {
    framework2ViewerRef.value.setZoomAndCenter(zoom, center);
  }
  framework1SyncGuard = false;
}

// Define sync handler for framework2 viewer.
function framework2SyncHandler() {
  if (framework1SyncGuard) return;
  framework2SyncGuard = true;
  const zoom = framework2ViewerRef.value?.getZoom();
  const center = framework2ViewerRef.value?.getCenter();
  if (zoom && center && framework1ViewerRef.value) {
    framework1ViewerRef.value.setZoomAndCenter(zoom, center);
  }
  framework2SyncGuard = false;
}

const framework1ViewerRef = ref(null);
const framework2ViewerRef = ref(null);

// Viewport synchronization
let viewportChangeSource = null;
const globalViewport = ref({ zoom: 1, center: null });

function onViewportChanged(source, { zoom, center } = {}) {
  if (!zoom || !center) return;
  if (viewportChangeSource !== source) {
    viewportChangeSource = source;
    globalViewport.value = { zoom, center };
  }
}

// Helper: Return an object mapping identifiers to viewer component instances.
function getActiveViewerComponents() {
  if (!isCompare.value && !isFrameworkCompareMode.value) {
    return { single: singleViewerRef.value };
  } else if (isCompare.value) {
    return { before: beforeViewerRef.value, after: afterViewerRef.value };
  } else if (isFrameworkCompareMode.value) {
    return {
      framework1: framework1ViewerRef.value,
      framework2: framework2ViewerRef.value,
    };
  }
  return {};
}

// Whenever globalViewport changes, update all viewers (except the one that was the source).
watch(globalViewport, ({ zoom, center }) => {
  const viewers = getActiveViewerComponents();
  Object.entries(viewers).forEach(([key, viewerComp]) => {
    if (
      key !== viewportChangeSource &&
      viewerComp &&
      viewerComp.setZoomAndCenter
    ) {
      viewerComp.setZoomAndCenter(zoom, center);
    }
  });
});
// Make sure activeViewer is a reactive ref (e.g., 'single', 'before', 'after', 'framework1', 'framework2')
const activeViewer = ref("single");

// Zoom in function
function zoomActiveIn() {
  // Single view mode:
  if (!isCompare.value && !isFrameworkCompareMode.value) {
    singleViewerRef.value?.zoomIn();
    return;
  }

  // Before/After compare mode: default to using "before" as the active viewer
  if (isCompare.value) {
    const newZoom = beforeViewerRef.value?.zoomIn();
    const center = beforeViewerRef.value?.getCenter();
    afterViewerRef.value?.setZoomAndCenter(newZoom, center);
    return;
  }

  // Framework compare mode: default to using "framework1" as the active viewer
  if (isFrameworkCompareMode.value) {
    const newZoom = framework1ViewerRef.value?.zoomIn();
    const center = framework1ViewerRef.value?.getCenter();
    framework2ViewerRef.value?.setZoomAndCenter(newZoom, center);
    return;
  }
}

// Zoom out function (similar logic)

function zoomActiveOut() {
  if (!isCompare.value && !isFrameworkCompareMode.value) {
    singleViewerRef.value?.zoomOut();
    return;
  }

  if (isCompare.value) {
    const newZoom = beforeViewerRef.value?.zoomOut();
    const center = beforeViewerRef.value?.getCenter();
    afterViewerRef.value?.setZoomAndCenter(newZoom, center);
    return;
  }

  if (isFrameworkCompareMode.value) {
    const newZoom = framework1ViewerRef.value?.zoomOut();
    const center = framework1ViewerRef.value?.getCenter();
    framework2ViewerRef.value?.setZoomAndCenter(newZoom, center);
    return;
  }
}

const tabItems = computed(() => [
  { key: "framework1", label: currentFramework.value.label },
  { key: "framework2", label: currentFramework2.value.label },
]);
// Use a ref for the selected index (default to 0 for framework1)
const selectedIndex = ref(0);
// const selectedTabKey = computed(() => tabItems.value[selectedIndex.value].key);

watch(isFrameworkCompareMode, (newVal) => {
  if (!newVal) {
    selectedIndex.value = 0;
  }
});

// v-model primitive: selected compare choice (id)
const compareChoice = ref("none");

// Define your compare options (same as before)
const compareOptions = [
  { label: 'Två olika metoder', value: 'frameworkCompare' },
  { label: 'Före / efter', value: 'beforeAfterCompare' }
]

// This reactive variable holds the currently selected compare option.
const selectedCompareChoice = ref(null)

// Build the dropdown items array based on your compare options.
// Each item is rendered as a checkbox with its "checked" state computed from selectedCompareChoice.


// A new reactive variable for layout mode, independent of isFrameworkCompareMode.
const currentLayoutMode = ref('sideBySide'); // 'sideBySide' or 'slider'

// Update your toggle function to use the comparisonSliderRef.
function toggleComparisonLayout() {
  if (comparisonSliderRef.value && comparisonSliderRef.value.toggleLayoutMode) {
    comparisonSliderRef.value.toggleLayoutMode();
  }
  // Optionally, you could toggle here too—but now each checkbox sets its own value.
  console.log("Current layout:", currentLayoutMode.value);
}

const layoutToggleItem = computed(() => ({
  label: currentLayoutMode.value === 'sideBySide' ? 'Sida vid sida' : 'Skjutreglage',
  type: 'button',
  onSelect(e) {
    e.preventDefault();
    toggleComparisonLayout();
  },
  icon: currentLayoutMode.value === 'sideBySide'
    ? 'i-circum-grid-2-v'
    : 'iconamoon:compare-duotone'
}));

const compareItems = computed(() => [
  {
    label: compareOptions[0].label,
    type: 'checkbox',
    checked: selectedCompareChoice.value === 'frameworkCompare',
    onUpdateChecked(checked) {
      if (checked) {
        selectedCompareChoice.value = 'frameworkCompare';
      } else if (selectedCompareChoice.value === 'frameworkCompare') {
        selectedCompareChoice.value = null;
      }
    },
    onSelect(e) {
      e.preventDefault();
    }
  },
  {
    label: compareOptions[1].label,
    type: 'checkbox',
    checked: selectedCompareChoice.value === 'beforeAfterCompare',
    onUpdateChecked(checked) {
      if (checked) {
        selectedCompareChoice.value = 'beforeAfterCompare';
      } else if (selectedCompareChoice.value === 'beforeAfterCompare') {
        selectedCompareChoice.value = null;
      }
    },
    onSelect(e) {
      e.preventDefault();
    }
  },
  { type: 'separator' },
  // New layout checkbox for side-by-side
  {
    label: 'Sida vid sida',
    type: 'checkbox',
    checked: currentLayoutMode.value === 'sideBySide',
    onUpdateChecked(checked) {
      if (checked) {
        currentLayoutMode.value = 'sideBySide';
        // Optionally, call your slider method if needed.
        if (comparisonSliderRef.value && comparisonSliderRef.value.setLayoutMode) {
          comparisonSliderRef.value.setLayoutMode('sideBySide');
        }
      }
    },
    onSelect(e) {
      e.preventDefault();
    },
    icon: 'i-circum-grid-2-v'
  },
  // New layout checkbox for slider
  {
    label: 'Skjutreglage',
    type: 'checkbox',
    checked: currentLayoutMode.value === 'slider',
    onUpdateChecked(checked) {
      if (checked) {
        currentLayoutMode.value = 'slider';
        if (comparisonSliderRef.value && comparisonSliderRef.value.setLayoutMode) {
          comparisonSliderRef.value.setLayoutMode('slider');
        }
      }
    },
    onSelect(e) {
      e.preventDefault();
    },
    icon: 'iconamoon:compare-duotone'
  }
]);

// Use currentLayoutMode in your activator icon as well.
const activatorIcon = computed(() => {
  return currentLayoutMode.value === 'sideBySide'
    ? 'i-circum-grid-2-v'
    : 'iconamoon:compare-duotone';
});

// Your selectedCompareLabel remains as before:
const selectedCompareLabel = computed(() => {
  if (selectedCompareChoice.value === 'frameworkCompare') return 'Två olika metoder';
  if (selectedCompareChoice.value === 'beforeAfterCompare') return 'Före / efter';
  return 'Jämför';
});

watch(selectedCompareChoice, (newVal) => {
  if (newVal === "frameworkCompare") {
    isCompare.value = false;
    isFrameworkCompareMode.value = true;
  } else if (newVal === "beforeAfterCompare") {
    isCompare.value = true;
    isFrameworkCompareMode.value = false;
  } else {
    isCompare.value = false;
    isFrameworkCompareMode.value = false;
  }
});

watch(isCompare, (newVal) => {
  if (newVal && time.value === 3) {
    time.value = 15;
  }
});

const currentTimeValue = computed(() => {
  const step = sliderSteps.value.find((s) => s.value === time.value);
  return step ? step.timeLabel : "";
});

const filteredAnnotations = computed(() => {
  const currentFrameworkValue = currentFramework.value.value;
  const currentTimeLower = currentTimeValue.value.toLowerCase();

  return annotationsData.annotations.flatMap((annotation) => {
    if (annotation.positions && Array.isArray(annotation.positions)) {
      return annotation.positions
        .filter((pos) => {
          // Check if the position's framework matches:
          const matchesFramework = Array.isArray(pos.framework)
            ? pos.framework.includes(currentFrameworkValue)
            : pos.framework === currentFrameworkValue;
          // Check if the position's times array includes the current time:
          const matchesTime = Array.isArray(pos.times)
            ? pos.times.map((t) => t.toLowerCase()).includes(currentTimeLower)
            : pos.times.toLowerCase() === currentTimeLower;
          return matchesFramework && matchesTime;
        })
        .map((pos) => ({
          ...annotation,
          position: {
            x: pos.x,
            y: pos.y,
            placement: pos.placement,
          },
        }));
    } else {
      // For global annotations (without positions) use the original arrays:
      const matchesFramework = Array.isArray(annotation.frameworks)
        ? annotation.frameworks.includes(currentFrameworkValue)
        : annotation.framework === currentFrameworkValue;
      const matchesTime = Array.isArray(annotation.times)
        ? annotation.times
          .map((t) => t.toLowerCase())
          .includes(currentTimeLower)
        : annotation.time.toLowerCase() === currentTimeLower;
      return matchesFramework && matchesTime ? [annotation] : [];
    }
  });
});

watch(activeViewer, (newVal) => {
  console.log("activeViewer updated to:", newVal);
});
</script>

<style scoped>
.slide-out-enter-active,
.slide-out-leave-active {
  transition: transform 0.3s ease;
}

.slide-out-enter-from,
.slide-out-leave-to {
  transform: translateX(100%);
}

.slide-out-enter-to,
.slide-out-leave-from {
  transform: translateX(0);
}
</style>