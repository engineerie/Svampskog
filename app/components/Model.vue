<template>
  <div :class="['mx-auto', isFullWidth ? 'w-full' : 'w-full']" class="transition-all duration-500">
    <div class="transition-all duration-300">
      <div class="">
        <div class="flex">

          <div class="w-full relative">


            <!-- <div class="relative w-full h-[600px] resize-y overflow-auto flex p-1 pt-0 rounded-lg"> -->
            <div ref="resizableContainer" class="relative flex flex-col w-full pt-0 h-screen ui-zoom-exempt">
              <div class="flex justify-between border-b border-muted">
                <div class="gap-1 flex">
                  <!-- <UButton label="Visa info" variant="solid" color="neutral" @click="infoOpen = !infoOpen"
                    class="ring-muted" icon="i-heroicons-book-open" /> -->
                  <UDrawer :direction="isMobile ? 'bottom' : 'bottom'" :inset="isMobile ? false : false"
                    :dismissible="isMobile ? true : false" :overlay="false" :handle="isMobile ? true : false"
                    :modal="false" v-model:open="open"
                    :ui="{ header: 'flex items-center justify-between', body: 'p-0', container: 'p-0 gap-0', content: 'max-w-[85rem] mx-auto', footer: 'gap-0' }"
                    class="absolute bottom-24 z-50 right-4 sm:block">
                    <UButton label="Visa info" variant="outline" color="neutral" class="border-none"
                      icon="i-ph-sidebar-simple-duotone" />
                    <!-- content: 'w-80 mt-12 mb-14' -->
                    <!-- <template #content>
 
</template> -->
                    <template #footer>
                      <!-- <div class=" grid grid-cols-2 gap-4 p-4">
                        <div class="w-full">
                          <UButton size="md" v-if="hasPrevTime" @click="goPrevTime" variant="outline"
                            class=" ring-muted w-full" :label="prevTitle" color="neutral"
                            icon="i-heroicons-arrow-left-circle" />
                        </div>
                        <div class="w-full">
                          <UButton size="md" v-if="hasNextTime" @click="goNextTime" variant="outline" color="neutral"
                            class="w-full flex justify-end ring-muted" trailing :label="nextTitle"
                            icon="i-heroicons-arrow-right-circle" />
                        </div>
                      </div> -->

                      <div class="flex w-full gap-2 p-1 border-muted border-t overflow-x-scroll md:overflow-hidden">
                        <UPopover class="shrink-0 cursor-pointer h-fit my-1" v-model:open="open2" destroy-on-close
                          :popper="{ placement: 'bottom-start' }">
                          <UButton variant="solid" color="neutral">{{ currentStartskog.label }}
                          </UButton>

                          <template #content>
                            <div class="text-sm w-64 p-3 text-neutral-500 border-b border-neutral-200 ">
                              Kort beskriving av betydelsen för skogens historik
                            </div>
                            <div class="p-1 flex flex-col gap-1">
                              <div v-for="option in startskog" :key="option.value">
                                <UButton @click="selectOption(option)" size="xl" color="white" variant="ghost"
                                  class="hover:bg-neutral-100 w-full cursor-pointer" :class="{
                                    'w-full  text-secondary-500':
                                      currentStartskog.value === option.value,
                                  }">{{ option.label }}
                                </UButton>
                              </div>
                            </div>

                          </template>
                        </UPopover>
                        <UTabs v-model="selectedTimeValue" :items="timeItems" :ui="{
                          list: 'bg-transparent -mb-1.5',
                          indicator: 'bg-white border border-muted/50 shadow',
                          trigger: 'data-[state=active]:text-neutral-800 dark:data-[state=active]:text-violet-400/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                        }" />
                      </div>
                    </template>
                    <template #body>
                      <div class="relative">
                        <DefineSettingsTemplate>
                          <div class="space-y-0.5 p-3">
                            <div class="grid grid-cols-2 gap-2 mb-4">
                              <UButton size="xs" variant="outline" :color="!compareEnabled ? 'primary' : 'neutral'"
                                @click="setCompareMode(false)">
                                <div class="flex flex-col text-center items-center w-full space-y-1">
                                  <UIcon name="i-bx-rectangle" class="size-4" />
                                  <h1>Enkelvy</h1>
                                </div>
                              </UButton>
                              <UButton size="xs" variant="outline" :color="compareEnabled ? 'primary' : 'neutral'"
                                @click="setCompareMode(true)">
                                <div class="flex flex-col text-center items-center w-full space-y-1">
                                  <UIcon name="iconamoon:compare-duotone" class="size-4" />
                                  <h1>Jämför</h1>
                                </div>
                              </UButton>
                            </div>
                            <div class="flex flex-col gap-3 py-1">
                              <div class="flex items-center justify-between gap-12">
                                <span class="text-sm tracking-wide text-neutral-400">Läge</span>
                                <USelect v-model="selectedCompareChoice" :items="compareOptions" size="sm"
                                  placeholder="Välj" :clearable="true" class="w-32 ring-muted" />
                              </div>
                            </div>
                          </div>
                          <USeparator :ui="{ border: 'border-muted/50' }" />
                          <div class="p-3 flex flex-col gap-3">
                            <div class="flex items-center justify-between gap-3">
                              <span class="text-sm tracking-wide text-neutral-400">Trädens synlighet</span>
                              <input type="range" min="0" max="1" step="0.01" v-model="globalOpacity"
                                class="accent-primary-500 h-[5px] w-32" />
                            </div>
                            <div class="flex flex-wrap gap-1">
                              <UBadge v-for="overlay in overlayBadgeItems" :key="overlay.key" :label="overlay.label"
                                :color="pinned[overlay.key] ? 'primary' : 'neutral'"
                                :variant="pinned[overlay.key] ? 'solid' : 'subtle'" class="cursor-pointer"
                                :class="pinned[overlay.key] ? 'shadow-sm' : 'opacity-70 hover:opacity-100'"
                                @click="toggleOverlayBadge(overlay.key)" />
                            </div>
                          </div>
                        </DefineSettingsTemplate>
                        <UDrawer v-if="isMobile" nested :ui="{ content: 'p-0', body: 'p-0', container: 'p-0 gap-0' }"
                          class="absolute top-2 right-2 z-50">
                          <UButton size="md" color="neutral" variant="outline" icon="i-heroicons-adjustments-horizontal"
                            class="ring-muted" />
                          <template #body>
                            <reuseSettingsTemplate />
                          </template>
                        </UDrawer>
                        <UPopover v-else :ui="{ content: 'p-0 w-80', }"
                          :content="{ side: 'bottom', sideOffset: 8, collisionPadding: 8, align: 'start' }"
                          class="absolute top-2 right-2 z-50">
                          <UButton size="md" color="neutral" variant="outline" icon="i-heroicons-adjustments-horizontal"
                            class="ring-muted" />
                          <template #content>
                            <reuseSettingsTemplate />
                          </template>
                        </UPopover>


                        <UTabs :items="panelTabs" variant="link" size="md" class="w-full"
                          :ui="{ indicator: 'hidden', trigger: 'ring ring-muted data-[state=active]:bg-muted data-[state=active]:text-neutral-700 py-1', list: 'gap-2 p-2', root: 'gap-0' }">
                          <template #text>
                            <div class="sm:grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-muted/70">
                              <div v-for="section in timelineSections" :key="section.key"
                                class="p-3 sm:p-6 sm:pb-8 group " @click="handleTimelineClick">
                                <div class="flex items-center justify-between gap-3 mb-4">
                                  <div class="flex items-center gap-2">
                                    <USelect v-if="['single', 'before', 'after', 'framework1'].includes(section.key)"
                                      :items="frameworkOptions" v-model="selectedFrameworkIndex" variant="outline"
                                      class="min-w-[12rem]">
                                      <template #item="{ item }">
                                        <div class="flex flex-col">
                                          <div class="text-sm font-medium">{{ item.label }}</div>
                                          <div v-if="item.description" class="text-xs text-neutral-500">
                                            {{ item.description }}
                                          </div>
                                        </div>
                                      </template>
                                    </USelect>
                                    <USelect v-else-if="section.key === 'framework2'" :items="frameworkOptions"
                                      v-model="selectedFrameworkIndex2" variant="outline" class="min-w-[12rem]">
                                      <template #item="{ item }">
                                        <div class="flex flex-col">
                                          <div class="text-sm font-medium">{{ item.label }}</div>
                                          <div v-if="item.description" class="text-xs text-neutral-500">
                                            {{ item.description }}
                                          </div>
                                        </div>
                                      </template>
                                    </USelect>
                                    <h2 v-else class="text-sm font-medium text-neutral-700">
                                      {{ section.left }}
                                    </h2>
                                  </div>
                                  <UBadge :label="section.right" class="ring-muted/50 py-1" variant="outline"
                                    color="neutral" />

                                </div>
                                <div v-if="section.info" class="">
                                  <div class="space-y-2">
                                    <UButton type="button" variant="ghost" color="neutral"
                                      class="flex w-full items-center font-semibold gap-2 tracking-wide text-neutral-500 transition"
                                      @click.stop="toggleTimelineDetail(section.key, 'skog')">
                                      <span>Utveckling i skogen</span>
                                      <UIcon name="i-heroicons-chevron-down"
                                        class="h-4 w-4 text-neutral-400 transition-transform duration-200"
                                        :class="{ '-rotate-90': !isTimelineDetailOpen(section.key, 'skog') }" />
                                    </UButton>
                                    <p v-if="isTimelineDetailOpen(section.key, 'skog')"
                                      class="text-sm text-neutral-800 leading-relaxed p-2 mb-2 bg-muted rounded"
                                      v-html="makeClickableHtml(section.info.skog)"></p>
                                  </div>
                                  <div class="space-y-2">
                                    <UButton type="button" variant="ghost" color="neutral"
                                      class="flex w-full items-center gap-2 font-semibold  tracking-wide text-neutral-500 transition"
                                      @click.stop="toggleTimelineDetail(section.key, 'svamp')">
                                      <span>Påverkan på mykorrhizasvampar</span>
                                      <UIcon name="i-heroicons-chevron-down"
                                        class="h-4 w-4 text-neutral-400 transition-transform duration-200"
                                        :class="{ '-rotate-90': !isTimelineDetailOpen(section.key, 'svamp') }" />
                                    </UButton>
                                    <span v-if="isTimelineDetailOpen(section.key, 'svamp')"
                                      class="block text-sm text-neutral-800 leading-relaxed p-2 bg-muted rounded"
                                      v-html="makeClickableHtml(section.info.svamp)"></span>
                                  </div>
                                </div>
                                <div v-else class="text-sm text-neutral-400">
                                  {{ section.emptyMessage || timelineEmptyMessage }}
                                </div>
                              </div>
                            </div>
                          </template>
                          <template #chart>

                            <ForestryChartMain
                              :parentSelectedFrameworks="isFrameworkCompareMode ? [currentFramework.value, currentFramework2.value] : [currentFramework.value]"
                              :currentTimeValue="currentTimeValue" :currentStartskog="currentStartskog.value" />


                          </template>
                        </UTabs>
                      </div>

                    </template>
                  </UDrawer>



                  <!-- <USelect size="lg" :items="frameworkOptions" v-model="selectedFrameworkIndex"
                    :placeholder="currentFramework.label" variant="outline" class="ring-muted">
                    <template #item="{ item }">
                      <div class="flex flex-col">
                        <div class="text-md font-medium">{{ item.label }}</div>
                        <div v-if="item.description" class="text-sm text-neutral-500">{{ item.description }}
                        </div>
                      </div>
                    </template>
                  </USelect>
                  <USelect v-if="isFrameworkCompareMode" size="lg" :items="frameworkOptions"
                    v-model="selectedFrameworkIndex2" :placeholder="currentFramework2.label" append-to-body
                    variant="outline" class="ring-muted">
                    <template #item="{ item }">
                      <div class="flex flex-col">
                        <div class="text-md font-medium">{{ item.label }}</div>
                        <div v-if="item.description" class="text-sm text-neutral-500">{{ item.description }}
                        </div>
                      </div>
                    </template>
                  </USelect> -->

                </div>
                <!-- <div class="flex gap-2 justify-end items-center">







                  <UButton @click="emit('close')" color="error" variant="subtle" trailing icon="i-heroicons-x-mark"
                    class="rounded-full h-fit" />

                </div> -->
              </div>



              <div class="ui-zoom-reapply relative flex flex-col flex-1 w-full">


                <div class="flex flex-1">


                  <div class="space-y-1.5 p-2 pt-1 max-w-sm z-50 absolute top-2 right-2 transform-all text-end">
                    <template v-for="card in overlayCards" :key="card.key">
                      <UBadge v-if="pinned[card.key]" :label="card.title" color="neutral" variant="outline"
                        class="cursor-pointer shadow-sm ml-1.5" @click="togglePinned(card.key)" />
                      <UCard v-else :ui="{ body: 'p-3 sm:p-4' }" class="z-50 transform-all text-start">
                        <div>
                          <div>
                            <div class="flex items-start justify-between gap-4">
                              <div class="font-medium ">{{ card.title }}</div>
                              <div class="flex gap-1">
                                <UButton color="neutral" variant="ghost" :ui="{ rounded: 'rounded-full' }"
                                  @click="togglePinned(card.key)" icon="i-solar-minimize-square-3-linear" size="xs"
                                  :class="pinned[card.key] ? 'text-primary-500' : 'text-neutral-500 hover:text-neutral-900'" />
                                <UButton class="text-neutral-500 hover:text-neutral-900" icon="i-heroicons-x-mark"
                                  variant="ghost" color="neutral" size="xs" @click="card.close()" />
                              </div>
                            </div>

                            <p class="text-sm text-neutral-500 mt-1">
                              {{ card.desc }}
                            </p>
                          </div>
                        </div>

                        <template v-if="card.key === 'kanteffekt' && isLuckhuggning">
                          <UCard variant="soft" :ui="{ body: 'sm:p-4 sm:pl-2' }"
                            class="mt-2 backdrop-blur-xl bg-neutral-900/50 border border-white/10">
                            <USwitch
                              :ui="{ root: 'flex-row-reverse justify-between', label: 'text-white', description: 'text-neutral-200', base: 'data-[state=unchecked]:bg-neutral-600' }"
                              size="xs" color="primary" v-model="oldKanteffektVisible" label="Tidigare kanteffekt"
                              description="Visa spår från tidigare kanteffekt" />
                          </UCard>
                        </template>
                      </UCard>
                    </template>
                  </div>

                  <div :class="[
                    'relative overflow-auto transition-all duration-300 ease-in-out ',
                    menuOpen ? 'w-72 border-r border-neutral-300' : 'w-0'
                  ]">
                    <div class="absolute p-2 w-full" v-if="menuOpen">
                      <div class="flex justify-between p-2 items-center mb-2">
                        <h1 class="font-semibold text-lg">Inställningar</h1>

                        <UButton :icon="menuOpen ? 'i-heroicons-chevron-left' : 'i-heroicons-chevron-right'"
                          variant="outline" color="neutral" class="rounded-full left-4 z-10"
                          @click="menuOpen = !menuOpen" />
                      </div>

                      <UCard variant="soft" :ui="{ body: 'p-2 sm:p-3' }" class="mb-2">
                        <div class="flex items-center justify-between gap-2">
                          <div class="text-xs text-neutral-500">UI‑zoom</div>
                          <div class="flex items-center gap-1">
                            <UButton color="neutral" variant="soft" size="xs" icon="i-heroicons-minus"
                              @click="uiZoom = Math.max(0.75, +(uiZoom - 0.1).toFixed(2))" />
                            <div class="min-w-[3ch] text-sm text-neutral-700 dark:text-neutral-200 text-center">
                              {{ Math.round(uiZoom * 100) }}%
                            </div>
                            <UButton color="neutral" variant="soft" size="xs" icon="i-heroicons-plus"
                              @click="uiZoom = Math.min(2, +(uiZoom + 0.1).toFixed(2))" />
                            <UButton color="neutral" variant="ghost" size="xs" :title="'Återställ (100%)'"
                              @click="uiZoom = 1">Reset
                            </UButton>
                          </div>
                        </div>
                      </UCard>
                      <template v-if="isFrameworkCompareMode">
                        <div class="space-y-2 w-full ">
                          <USelect size="lg" :items="frameworkOptions" v-model="selectedFrameworkIndex"
                            :placeholder="currentFramework.label" append-to-body variant="outline" class="w-full">
                            <template #item="{ item }">
                              <div class="flex flex-col">
                                <div class="text-md font-medium">{{ item.label }}</div>
                                <div v-if="item.description" class="text-sm text-neutral-500">{{ item.description }}
                                </div>
                              </div>
                            </template>
                          </USelect>

                          <USelect size="lg" :items="frameworkOptions" v-model="selectedFrameworkIndex2"
                            :placeholder="currentFramework2.label" append-to-body variant="outline" class="w-full">
                            <template #item="{ item }">
                              <div class="flex flex-col">
                                <div class="text-md font-medium">{{ item.label }}</div>
                                <div v-if="item.description" class="text-sm text-neutral-500">{{ item.description }}
                                </div>
                              </div>
                            </template>
                          </USelect>

                        </div>
                      </template>

                      <template v-else>
                        <!-- Replace popover with a select showing label + description -->
                        <h1 class="text-xs text-neutral-400">Skogsbruksmetod</h1>
                        <USelect size="xl" :items="frameworkOptions" v-model="selectedFrameworkIndex"
                          :placeholder="currentFramework.label" append-to-body variant="subtle" class="w-full">
                          <template #item="{ item }">
                            <div class="flex flex-col">
                              <div class="text-md font-medium">{{ item.label }}</div>
                              <div v-if="item.description" class="text-sm text-neutral-500">
                                {{ item.description }}
                              </div>
                            </div>
                          </template>
                        </USelect>
                      </template>

                      <div class="w-full mt-1 relative">

                        <div class="">


                          <div class="space-y-2">
                            <!-- Trakthygge, Luckhuggning, Skärmträd: Hänsynsträd -->
                            <USwitch v-if="isTrakthygge || isLuckhuggning || isSkarmtrad"
                              :ui="{ root: 'flex-row-reverse justify-between' }" color="primary"
                              v-model="retentionVisible" label="Hänsynsträd" />
                            <!-- Trakthygge, Luckhuggning, Skärmträd: Kanteffekt (+ old toggle) -->
                            <USwitch v-if="isTrakthygge || isLuckhuggning || isSkarmtrad"
                              :ui="{ root: 'flex-row-reverse justify-between' }" color="primary"
                              v-model="kanteffektVisible" label="Kanteffekt" />
                            <!-- Småplantor: show small white circles from public JSON -->
                            <USwitch :ui="{ root: 'flex-row-reverse justify-between' }" color="primary"
                              v-model="smaplantorVisible" label="Småplantor" />
                            <UCard v-if="(isLuckhuggning) && kanteffektVisible" variant="soft"
                              :ui="{ body: 'sm:p-4 sm:pl-2' }">
                              <USwitch :ui="{ root: 'flex-row-reverse justify-between' }" size="xs" color="neutral"
                                v-model="oldKanteffektVisible" label="Tidigare kanteffekt" />
                            </UCard>
                            <!-- Blädning & Skärmträd: Kontinuerligt rottäcke -->
                            <USwitch v-if="isBladning || isSkarmtrad" :ui="{ root: 'flex-row-reverse justify-between' }"
                              color="primary" v-model="rottackeVisible" label="Kontinuerligt rottäcke" />
                            <!-- Högstubbar: small black circles from public JSON -->
                            <USwitch :ui="{ root: 'flex-row-reverse justify-between' }" color="primary"
                              v-model="hogstubbarVisible" label="Högstubbar" />
                            <!-- Naturvårdsarter: visible for Trakthygge, Luckhuggning, Blädning, Skärmträd -->
                            <USwitch v-if="isTrakthygge || isLuckhuggning || isBladning || isSkarmtrad"
                              :ui="{ root: 'flex-row-reverse justify-between' }" color="primary"
                              v-model="naturvardsarterVisible" label="Naturvårdsarter" />
                            <USwitch v-if="isSkarmtrad" :ui="{ root: 'flex-row-reverse justify-between' }"
                              color="primary" v-model="seedTreeVisible" label="Fröträd" />
                            <USwitch :ui="{ root: 'flex-row-reverse justify-between' }" color="primary"
                              v-model="tradplantorVisible" label="Trädplantor" />
                            <!-- Dev: Save clicks -->
                            <USwitch :ui="{ root: 'flex-row-reverse justify-between' }" color="warning"
                              v-model="devSaveClicks" label="Spara klick (dev)" />

                          </div>



                        </div>

                      </div>
                    </div>
                  </div>
                  <div class="relative flex-1">
                    <div class="absolute w-full bottom-0 z-50 p-1">
                      <div class="flex w-full justify-end mb-2">
                        <UFieldGroup orientation="vertical"
                          class="size-xs bg-neutral-900/80 backdrop-blur-2xl rounded-sm">
                          <UButton color="neutral" variant="solid" @click="zoomActiveIn"
                            class="hover:bg-neutral-800/50 bg-neutral-900/0  text-neutral-100"
                            icon="i-heroicons-plus" />
                          <UButton color="neutral" variant="solid" @click="zoomActiveOut"
                            class="hover:bg-neutral-800/50 bg-neutral-900/0  text-neutral-100"
                            icon="i-heroicons-minus" />
                        </UFieldGroup>
                      </div>
                    </div>


                    <!-- Single View -->
                    <div v-if="!isCompare && !isFrameworkCompareMode" class="w-full h-full">
                      <!-- <OpenSeadragonViewer :retention-visible="retentionVisible" :retention-trees="retentionTrees"
                  @retentionTreeAdded="retentionTrees.push($event)" :fullscreenLayout="true" :currentFramework="currentFramework" :currentTime="timeLabelForDataFiltering"
                    :currentStartskog="currentStartskog" :layoutMode="currentLayoutMode" ref="singleViewerRef"
                    :frameworkLabel="currentFramework.label" :timeLabel="currentTimeLabel"
                    :dziUrl="currentOverlayImagePath"
                    :overlayDziUrl="currentImagePath" :allowPan="true"
                    :annotations="annotationsVisible ? filteredAnnotations : []" :selectedAnnotation="selectedAnnotation"
                    v-if="!opacitySyncEnabled" @annotationClicked="handleAnnotationClicked" class="w-full h-full" /> -->
                      <OpenSeadragonViewer :tradplantor-visible="tradplantorVisible"
                        :naturvardsarter-visible="naturvardsarterVisible" :hogstubbar-visible="hogstubbarVisible"
                        :smaplantor-visible="smaplantorVisible" :dev-save-clicks="devSaveClicks"
                        :seedTree-visible="seedTreeVisible" :rottacke-visible="rottackeVisible"
                        :retention-visible="retentionVisible" :old-kanteffekt-visible="oldKanteffektVisible"
                        :kanteffekt-visible="kanteffektVisible" :retention-trees="retentionTrees"
                        @retentionTreeAdded="retentionTrees.push($event)" :fullscreenLayout="true"
                        :currentFramework="currentFramework" :currentTime="timeLabelForDataFiltering"
                        :currentStartskog="currentStartskog" :layoutMode="currentLayoutMode" ref="singleViewerRef"
                        :frameworkLabel="currentFramework.label" :timeLabel="currentTimeLabel"
                        :dziUrl="currentOverlayImagePath" :overlayDziUrl="currentImagePath" :allowPan="true"
                        :annotations="annotationsVisible ? filteredAnnotations : []"
                        :selectedAnnotation="selectedAnnotation" v-model:globalOpacity="globalOpacity"
                        @annotationClicked="handleAnnotationClicked" class="w-full h-full ui-zoom-exempt " />
                      <transition name="slide-out">
                        <div v-if="selectedAnnotation"
                          class="absolute inset-y-0 right-0  w-68 bg-white dark:bg-neutral-950/70 backdrop-blur-2xl overflow-auto z-10 pointer-events-auto border-neutral-300 dark:border-neutral-700 border-l ">
                          <div class="h-64 flex items-center justify-center text-neutral-300">
                            Bild kommer snart
                          </div>

                          <!-- <NuxtImg v-if="selectedAnnotation.thumbnail" :src="selectedAnnotation.thumbnail" width="300"
                        height="300" alt="Thumbnail" class=" border-b border-neutral-300" /> -->
                          <UButton color="white" :ui="{ rounded: 'rounded-full' }" icon="heroicons:x-mark"
                            @click="closeAnnotation" class="absolute top-2 right-2" />
                          <div class="px-4 py-2">
                            <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
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

                    <CustomImageComparisonSlider class="w-full" ref="comparisonSliderRef" v-else-if="isCompare"
                      :frameworkLabel="currentFramework.label" timeLabel="Före avverkning"
                      :frameworkLabel2="currentFramework.label" :timeLabel2="currentTimeLabel"
                      :layoutMode="currentLayoutMode">
                      <template #first>
                        <OpenSeadragonViewer :naturvardsarter-visible="naturvardsarterVisible" :fullscreenLayout="true"
                          :currentFramework="currentFramework" currentTime="innan" :currentStartskog="currentStartskog"
                          :layoutMode="currentLayoutMode" ref="beforeViewerRef" :comparisonMode="true"
                          :frameworkLabel="currentFramework.label" timeLabel="Före avverkning"
                          :dziUrl="comparisonOverlayImagePath1" :overlayDziUrl="comparisonImagePath1" :allowPan="true"
                          @opened="onViewerOpened('before')" @activated="activeViewer.valueOf = 'before'"
                          v-if="!opacitySyncEnabled" class="w-full h-full" />
                        <OpenSeadragonViewer :naturvardsarter-visible="naturvardsarterVisible" :fullscreenLayout="true"
                          :currentFramework="currentFramework" currentTime="innan" :currentStartskog="currentStartskog"
                          :layoutMode="currentLayoutMode" ref="beforeViewerRef" :comparisonMode="true"
                          :frameworkLabel="currentFramework.label" timeLabel="Före avverkning"
                          :dziUrl="comparisonOverlayImagePath1" :overlayDziUrl="comparisonImagePath1" :allowPan="true"
                          @opened="onViewerOpened('before')" @activated="activeViewer.valueOf = 'before'" v-else
                          v-model:globalOpacity="globalOpacity" class="w-full h-full" />
                      </template>
                      <template #second>
                        <OpenSeadragonViewer :naturvardsarter-visible="naturvardsarterVisible" :fullscreenLayout="true"
                          :currentFramework="currentFramework" :currentTime="timeLabelForDataFiltering"
                          :currentStartskog="currentStartskog" :layoutMode="currentLayoutMode" ref="afterViewerRef"
                          :comparisonMode="true" :frameworkLabel="currentFramework.label" :timeLabel="currentTimeLabel"
                          :dziUrl="comparisonOverlayImagePath2" :overlayDziUrl="currentImagePath" :allowPan="true"
                          sliderPosition="right" @opened="onViewerOpened('after')"
                          @activated="activeViewer.valueOf = 'after'" v-if="!opacitySyncEnabled"
                          class="w-full h-full " />
                        <OpenSeadragonViewer :naturvardsarter-visible="naturvardsarterVisible" :fullscreenLayout="true"
                          :currentFramework="currentFramework" :currentTime="timeLabelForDataFiltering"
                          :currentStartskog="currentStartskog" :layoutMode="currentLayoutMode" ref="afterViewerRef"
                          :comparisonMode="true" :frameworkLabel="currentFramework.label" :timeLabel="currentTimeLabel"
                          :dziUrl="comparisonOverlayImagePath2" :overlayDziUrl="currentImagePath" :allowPan="true"
                          sliderPosition="right" @opened="onViewerOpened('after')"
                          @activated="activeViewer.valueOf = 'after'" v-else v-model:globalOpacity="globalOpacity"
                          class="w-full h-full  " />
                      </template>
                    </CustomImageComparisonSlider>

                    <!-- Framework Compare -->
                    <CustomImageComparisonSlider v-else-if="isFrameworkCompareMode" ref="comparisonSliderRef"
                      :frameworkLabel="currentFramework.label" :timeLabel="currentTimeLabel"
                      :frameworkLabel2="currentFramework2.label" :timeLabel2="currentTimeLabel"
                      :layoutMode="currentLayoutMode" class="w-full">
                      <template #first>
                        <OpenSeadragonViewer :naturvardsarter-visible="naturvardsarterVisible" :fullscreenLayout="true"
                          :currentFramework="currentFramework" :currentTime="timeLabelForDataFiltering"
                          :currentStartskog="currentStartskog" :layoutMode="currentLayoutMode" ref="framework1ViewerRef"
                          :comparisonMode="true" :frameworkLabel="currentFramework.label" :timeLabel="currentTimeLabel"
                          :dziUrl="frameworkOverlayImagePath1" :overlayDziUrl="currentImagePath"
                          :allowPan="!isCompare && !isFrameworkCompareMode" v-if="!opacitySyncEnabled"
                          @viewportChanged="($event) => onViewportChanged('framework1', $event)"
                          @opened="onViewerOpened('framework1')" @activated="activeViewer.valueOf = 'framework1'"
                          class="w-full h-full" />
                        <OpenSeadragonViewer :naturvardsarter-visible="naturvardsarterVisible" :fullscreenLayout="true"
                          :currentFramework="currentFramework" :currentTime="timeLabelForDataFiltering"
                          :currentStartskog="currentStartskog" :layoutMode="currentLayoutMode" ref="framework1ViewerRef"
                          :comparisonMode="true" :frameworkLabel="currentFramework.label" :timeLabel="currentTimeLabel"
                          :dziUrl="frameworkOverlayImagePath1" :overlayDziUrl="currentImagePath"
                          :allowPan="!isCompare && !isFrameworkCompareMode" v-else v-model:globalOpacity="globalOpacity"
                          @viewportChanged="($event) => onViewportChanged('framework1', $event)"
                          @opened="onViewerOpened('framework1')" @activated="activeViewer.valueOf = 'framework1'"
                          class="w-full h-full" />
                      </template>
                      <template #second>
                        <OpenSeadragonViewer :naturvardsarter-visible="naturvardsarterVisible" :fullscreenLayout="true"
                          :currentFramework="currentFramework2" :currentTime="timeLabelForDataFiltering"
                          :currentStartskog="currentStartskog" :layoutMode="currentLayoutMode" ref="framework2ViewerRef"
                          :comparisonMode="true" :frameworkLabel="currentFramework2.label" :timeLabel="currentTimeLabel"
                          :dziUrl="frameworkOverlayImagePath2" :overlayDziUrl="currentImagePath2"
                          v-if="!opacitySyncEnabled" :allowPan="!isCompare && !isFrameworkCompareMode"
                          sliderPosition="right" @viewportChanged="($event) => onViewportChanged('framework2', $event)"
                          @opened="onViewerOpened('framework2')" @activated="activeViewer.valueOf = 'framework2'"
                          class="w-full h-full" />
                        <OpenSeadragonViewer :naturvardsarter-visible="naturvardsarterVisible" :fullscreenLayout="true"
                          :currentFramework="currentFramework2" :currentTime="timeLabelForDataFiltering"
                          :currentStartskog="currentStartskog" :layoutMode="currentLayoutMode" ref="framework2ViewerRef"
                          :comparisonMode="true" :frameworkLabel="currentFramework2.label" :timeLabel="currentTimeLabel"
                          :dziUrl="frameworkOverlayImagePath2" :overlayDziUrl="currentImagePath2" v-else
                          v-model:globalOpacity="globalOpacity" :allowPan="!isCompare && !isFrameworkCompareMode"
                          sliderPosition="right" @viewportChanged="($event) => onViewportChanged('framework2', $event)"
                          @opened="onViewerOpened('framework2')" @activated="activeViewer.valueOf = 'framework2'"
                          class="w-full h-full" />

                      </template>
                    </CustomImageComparisonSlider>
                  </div>
                  <div :class="[
                    'absolute max-h-screen z-50 top-0 w-sm left-0 overflow-auto transition-all shadow-2xl border-r bg-white border-neutral-100/10 rounded-br-sm duration-300 ease-in-out backdrop-blur-2xl hide-scrollbar',
                  ]" v-if="!infoOpen">
                    <div class=" p-4">
                      <div v-if="!isCompare && !isFrameworkCompareMode">
                        <div class="p-3 group text-base/7" @click="handleTimelineClick">
                          <UPopover :ui="{ content: 'bg-neutral-950/50 backdrop-blur-2xl ring-neutral-900/50' }"
                            destroy-on-close :content="{
                              align: 'start',
                              side: 'left',
                              sideOffset: '1',
                            }">
                            <h2
                              class="text-xl font-medium mb-1 hover:bg-neutral-500/20 w-fit p-2 px-3 -m-3 rounded-sm overflow-hidden cursor-pointer">
                              {{ currentFramework.label }}</h2>
                            <template #content>
                              <div class="p-2 flex flex-col gap-2">
                                <div v-for="(framework, index) in frameworks" :key="framework.id"
                                  @click="selectedFrameworkIndex = index"
                                  class="flex items-center text-white gap-2 cursor-pointer hover:bg-neutral-500/20 p-2 rounded-md">
                                  <div>
                                    <div class="font-medium">{{ framework.label }}</div>
                                    <div class="text-sm text-neutral-300">{{ framework.text }}</div>
                                  </div>
                                </div>
                              </div>
                            </template>
                          </UPopover>
                          <div class="flex justify-between">
                            <h3 class="text-md text-neutral-200">
                              {{ currentTimeLabel }}
                            </h3>
                            <UButton class="h-fit text-white bg-transparent hover:bg-neutral-500/20" color="neutral"
                              variant="soft" size="xs" :label="timeInfoVisible ? 'Dölj info' : 'Visa info'"
                              @click="toggleTimeInfoVisible" />
                          </div>
                          <div v-if="timeInfoVisible && timelineInfo" class="my-4">
                            <p class="mb-4 text-neutral-50" v-html="makeClickableHtml(timelineInfo.skog)"></p>
                            <div>
                              <p class="mb-2 text-white font-bold text-md">Påverkan på mykorrhizasvamp</p>
                              <span class="text-neutral-50" v-html="makeClickableHtml(timelineInfo.svamp)"></span>
                            </div>
                          </div>
                          <div v-else-if="timeInfoVisible" class="my-4 text-neutral-300 text-sm">
                            Ingen tidslinjeinformation hittades för den här kombinationen.
                          </div>
                        </div>
                      </div>

                      <!-- Before/After compare: first always “före” (innan), then the selected time -->
                      <div v-else-if="isCompare" class="space-y-2">
                        <div class="p-3 group text-base/7" v-if="timelineInfoBefore" @click="handleTimelineClick">
                          <UPopover :ui="{ content: 'bg-neutral-950/50 backdrop-blur-2xl ring-neutral-900/50' }"
                            destroy-on-close :content="{
                              align: 'start',
                              side: 'left',
                              sideOffset: '1',
                            }">
                            <h2
                              class="text-2xl text-white font-medium mb-1 hover:bg-neutral-500/20 w-fit p-2 px-3 -m-3 rounded-sm overflow-hidden cursor-pointer">
                              {{ currentFramework.label }}</h2>
                            <template #content>
                              <div class="p-2 flex flex-col gap-2">
                                <div v-for="(framework, index) in frameworks" :key="framework.id"
                                  @click="selectedFrameworkIndex = index"
                                  class="flex items-center text-white gap-2 cursor-pointer hover:bg-neutral-500/20 p-2 rounded-md">
                                  <div>
                                    <div class="font-medium">{{ framework.label }}</div>
                                    <div class="text-sm text-neutral-300">{{ framework.text }}</div>
                                  </div>
                                </div>
                              </div>
                            </template>
                          </UPopover>
                          <div class="flex justify-between  ">
                            <h3 class="text-md text-neutral-200">
                              Före avverkning
                            </h3>
                            <UButton class="h-fit text-white bg-transparent hover:bg-neutral-500/20" variant="soft"
                              color="neutral" size="xs" :label="timeInfoVisible ? 'Dölj info' : 'Visa info'"
                              @click="toggleTimeInfoVisible" />
                          </div>
                          <div v-if="timeInfoVisible" class="my-4">
                            <p class="mb-2 text-neutral-50" v-html="makeClickableHtml(timelineInfoBefore.skog)"></p>
                            <div>
                              <p class="mb-2 text-white font-bold text-md">Påverkan på mykorrhizasvamp</p>
                              <span class="text-neutral-50" v-html="makeClickableHtml(timelineInfoBefore.svamp)"></span>
                            </div>
                          </div>
                        </div>
                        <div class=" p-4 group border border-neutral-200/10 rounded-sm shadow bg-neutral-950/20"
                          v-if="timelineInfo" @click="handleTimelineClick">
                          <!-- <h2 class="text-2xl text-white font-medium mb-1">{{ currentFramework.label }}</h2> -->
                          <div class="flex justify-between ">
                            <h3 class="text-md text-neutral-200">
                              {{ currentTimeLabel }}
                            </h3>
                            <UButton class="h-fit text-white bg-transparent hover:bg-neutral-500/20" variant="soft"
                              color="neutral" size="xs" :label="timeInfo2Visible ? 'Dölj info' : 'Visa info'"
                              @click="toggleTimeInfo2Visible" />
                          </div>
                          <div v-if="timeInfo2Visible" class="my-4">
                            <p class="mb-2 text-neutral-50" v-html="makeClickableHtml(timelineInfo.skog)"></p>
                            <div>
                              <p class="mb-2 text-white font-bold text-md">Påverkan på mykorrhizasvamp</p>
                              <span class="text-neutral-50" v-html="makeClickableHtml(timelineInfo.svamp)"></span>
                            </div>
                          </div>

                        </div>
                      </div>

                      <!-- Framework compare: show both frameworks at current time -->
                      <div v-else-if="isFrameworkCompareMode" class="space-y-2">
                        <div class="p-3 group text-base/7" v-if="timelineInfo" @click="handleTimelineClick">
                          <UPopover :ui="{ content: 'bg-neutral-950/50 backdrop-blur-2xl ring-neutral-900/50' }"
                            destroy-on-close :content="{
                              align: 'start',
                              side: 'left',
                              sideOffset: '1',
                            }">
                            <h2
                              class="text-2xl text-white font-medium mb-1 hover:bg-neutral-500/20 w-fit p-2 px-3 -m-3 rounded-sm overflow-hidden cursor-pointer">
                              {{ currentFramework.label }}</h2>
                            <template #content>
                              <div class="p-2 flex flex-col gap-2">
                                <div v-for="(framework, index) in frameworks" :key="framework.id"
                                  @click="selectedFrameworkIndex = index"
                                  class="flex items-center text-white gap-2 cursor-pointer hover:bg-neutral-500/20 p-2 rounded-md">
                                  <div>
                                    <div class="font-medium">{{ framework.label }}</div>
                                    <div class="text-sm text-neutral-300">{{ framework.text }}</div>
                                  </div>
                                </div>
                              </div>
                            </template>
                          </UPopover>

                          <div class="flex justify-between ">
                            <h3 class="text-md text-neutral-200">
                              {{ currentTimeLabel }}
                            </h3>
                            <UButton class="h-fit text-white bg-transparent hover:bg-neutral-500/20" variant="soft"
                              color="neutral" size="xs" :label="timeInfoVisible ? 'Dölj info' : 'Visa info'"
                              @click="toggleTimeInfoVisible" />
                          </div>
                          <div v-if="timeInfoVisible" class="my-4">
                            <p class="mb-2 text-neutral-50" v-html="makeClickableHtml(timelineInfo.skog)"></p>
                            <div>
                              <p class="mb-2 text-white font-bold text-md">Påverkan på mykorrhizasvamp</p>
                              <span class="text-neutral-50" v-html="makeClickableHtml(timelineInfo.svamp)"></span>
                            </div>
                          </div>
                        </div>
                        <div class="p-4 group border border-neutral-200/10 rounded-sm shadow bg-neutral-950/20"
                          v-if="timelineInfo2" @click="handleTimelineClick">
                          <UPopover :ui="{ content: 'bg-neutral-950/50 backdrop-blur-2xl ring-neutral-900/50' }"
                            destroy-on-close :content="{
                              align: 'start',
                              side: 'left',
                              sideOffset: '1',
                            }">
                            <h2
                              class="text-2xl text-white font-medium mb-1 hover:bg-neutral-500/20 w-fit p-2 px-3 -m-3 rounded-sm overflow-hidden cursor-pointer">
                              {{ currentFramework2.label }}</h2>
                            <template #content>
                              <div class="p-2 flex flex-col gap-2">
                                <div v-for="(framework, index) in frameworks" :key="'framework2-' + framework.id"
                                  @click="selectedFrameworkIndex2 = index"
                                  class="flex items-center text-white gap-2 cursor-pointer hover:bg-neutral-500/20 p-2 rounded-md">
                                  <div>
                                    <div class="font-medium">{{ framework.label }}</div>
                                    <div class="text-sm text-neutral-300">{{ framework.text }}</div>
                                  </div>
                                </div>
                              </div>
                            </template>
                          </UPopover>
                          <div class="flex justify-between ">
                            <h3 class="text-md text-neutral-200">
                              {{ currentTimeLabel }}
                            </h3>
                            <UButton class="h-fit text-white bg-transparent hover:bg-neutral-500/20" variant="soft"
                              color="neutral" size="xs" :label="timeInfo2Visible ? 'Dölj info' : 'Visa info'"
                              @click="toggleTimeInfo2Visible" />
                          </div>
                          <div v-if="timeInfo2Visible" class="my-4">
                            <p class="mb-2 text-neutral-50" v-html="makeClickableHtml(timelineInfo2.skog)"></p>
                            <div>
                              <p class="mb-2 text-white font-bold text-md">Påverkan på mykorrhizasvamp</p>
                              <span class="text-neutral-50" v-html="makeClickableHtml(timelineInfo2.svamp)"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- Time navigation (single view) -->
                      <div class=" grid grid-cols-2 gap-4">
                        <div class="w-full">
                          <UButton size="xl" v-if="hasPrevTime" @click="goPrevTime" variant="ghost"
                            class="text-white hover:bg-neutral-500/20 w-full" :label="prevTitle"
                            icon="i-heroicons-arrow-left-circle" />
                        </div>
                        <div class="w-full">
                          <UButton size="xl" v-if="hasNextTime" @click="goNextTime" variant="ghost"
                            class="w-full text-white hover:bg-neutral-500/20 flex justify-end" trailing
                            :label="nextTitle" icon="i-heroicons-arrow-right-circle" />
                        </div>
                      </div>
                    </div>

                  </div>

                </div>




                <!-- <div class="flex w-full gap-2 p-1 border-muted border-t">
                  <UPopover class="shrink-0 cursor-pointer h-fit my-1" v-model:open="open2" destroy-on-close
                    :popper="{ placement: 'bottom-start' }">
                    <UButton variant="solid" color="neutral">{{ currentStartskog.label }}
                    </UButton>

                    <template #content>
                      <div class="text-sm w-64 p-3 text-neutral-500 border-b border-neutral-200 ">
                        Kort beskriving av betydelsen för skogens historik
                      </div>
                      <div class="p-1 flex flex-col gap-1">
                        <div v-for="option in startskog" :key="option.value">
                          <UButton @click="selectOption(option)" size="xl" color="white" variant="ghost"
                            class="hover:bg-neutral-100 w-full cursor-pointer" :class="{
                              'w-full  text-secondary-500':
                                currentStartskog.value === option.value,
                            }">{{ option.label }}
                          </UButton>
                        </div>
                      </div>

                    </template>
                  </UPopover>
                  <UTabs v-model="selectedTimeValue" :items="timeItems" :ui="{
                    list: 'bg-transparent -mb-1.5',
                    indicator: 'bg-white border border-muted/50 shadow',
                    trigger: 'data-[state=active]:text-neutral-800 dark:data-[state=active]:text-violet-400/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                  }" />
                </div> -->

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">
// import SvampLineChart from "~/components/SvampLineChart.vue";
import { defineAsyncComponent } from 'vue';
const OpenSeadragonViewer = defineAsyncComponent(() =>
  import('~/components/OpenSeadragonViewer.vue')
);
import { ref, computed, watch, onMounted, onBeforeUnmount, onUnmounted, reactive } from "vue";
import { useRuntimeConfig } from '#imports';
import { useAsyncData } from '#app';
let removeShortcutsFn;
import { useOnboardingStore } from "~/stores/onboardingStore";
import annotationsData from "public/annotations.json";
import { useSelectedAnnotationStore } from "~/stores/selectedAnnotationStore";
import { useOverlayStore } from "~/stores/overlayStore";
import { useMediaQuery, createReusableTemplate } from '@vueuse/core'

const [DefineSettingsTemplate, reuseSettingsTemplate] = createReusableTemplate()
const isMobile = useMediaQuery('(max-width: 767px)')

const panelTabs = [
  {
    label: 'Text',
    icon: 'i-heroicons-book-open',
    slot: 'text',
  },
  {
    label: 'Diagram',
    icon: 'i-carbon-chart-line-smooth',
    slot: 'chart',
  }
]

const {
  public: {
    dziBaseUrl: runtimeDziBaseUrl = 'https://assets.svampskog.se/dzi_v2',
    dziVersionSuffix: runtimeDziVersionSuffix = '',
  } = {},
} = useRuntimeConfig();

const DZI_BASE_URL = runtimeDziBaseUrl;
const DZI_VERSION_SUFFIX = runtimeDziVersionSuffix;

function sanitizeSegment(segment) {
  if (!segment) return '';
  return segment
    .toString()
    .toLowerCase()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function buildDziFilename({ framework, timeLabel, fungiVisibility, treeVisibility, startskog }) {
  const safeSegments = [framework, timeLabel, fungiVisibility, treeVisibility, startskog]
    .map(segment => sanitizeSegment(segment))
    .filter(Boolean);
  const base = safeSegments.join('_');
  const suffix = sanitizeSegment(DZI_VERSION_SUFFIX);
  return suffix ? `${base}_${suffix}` : base;
}

function buildDziUrl(parts) {
  return `${DZI_BASE_URL}/${buildDziFilename(parts)}.dzi`;
}

const { data: forestryTimeline } = await useAsyncData(
  'forestry-timeline-modelc',
  () => queryCollection('forestryTimelines').first()
);

const timelineEntries = computed(() => {
  const value = forestryTimeline.value;
  if (!value) return [];
  if (Array.isArray(value)) {
    const doc = value.find(item => item?.id === 'skogsskotsel') || value[0];
    return Array.isArray(doc?.entries) ? doc.entries : [];
  }
  return Array.isArray(value.entries) ? value.entries : [];
});

if (import.meta.dev) {
  watch(timelineEntries, entries => {
    console.debug('[ModelC] timeline entries', entries?.length ?? 0);
  }, { immediate: true });
}

// Compare toggle decoupled from selection: keep selection even when OFF
const compareEnabled = ref(false)
const selectedCompareChoice = ref('beforeAfterCompare') // 'beforeAfterCompare' | 'frameworkCompare'
const currentLayoutMode = ref('slider')                 // 'slider' | 'sideBySide'

const emit = defineEmits(['close'])

const devSaveClicks = ref(false);
const retentionVisible = ref(false);
const kanteffektVisible = ref(false);
const oldKanteffektVisible = ref(false);
const naturvardsarterVisible = ref(false);
const rottackeVisible = ref(false);
const seedTreeVisible = ref(false);
const smaplantorVisible = ref(false);
const hogstubbarVisible = ref(false);
const tradplantorVisible = ref(false);

const uiZoom = ref(1);

const timeInfoVisible = ref(false);
const timeInfo2Visible = ref(false);

function toggleTimeInfoVisible() {
  timeInfoVisible.value = !timeInfoVisible.value
}

function toggleTimeInfo2Visible() {
  timeInfo2Visible.value = !timeInfo2Visible.value
}

// Track the order overlays became visible to control UCard stacking
const overlayOrder = ref([]); // array of keys, e.g., ['retention','smaplantor']

function updateOverlayOrder(key, visible) {
  const arr = overlayOrder.value;
  const idx = arr.indexOf(key);
  if (visible) {
    if (idx !== -1) arr.splice(idx, 1); // move to the end
    arr.push(key);
  } else if (idx !== -1) {
    arr.splice(idx, 1);
  }
}

// Keep overlayOrder in sync with visibility refs
watch(retentionVisible, v => updateOverlayOrder('retention', v), { immediate: true });
watch(kanteffektVisible, v => updateOverlayOrder('kanteffekt', v), { immediate: true });
watch(rottackeVisible, v => updateOverlayOrder('rottacke', v), { immediate: true });
watch(seedTreeVisible, v => updateOverlayOrder('seedTree', v), { immediate: true });
watch(smaplantorVisible, v => updateOverlayOrder('smaplantor', v), { immediate: true });
watch(hogstubbarVisible, v => updateOverlayOrder('hogstubbar', v), { immediate: true });
watch(naturvardsarterVisible, v => updateOverlayOrder('naturvardsarter', v), { immediate: true });
watch(tradplantorVisible, v => updateOverlayOrder('tradplantor', v), { immediate: true });

const overlayStore = useOverlayStore();
const staticOverlayVisible = computed({
  get: () => overlayStore.staticOverlayVisible,
  set: (value) => overlayStore.setStaticOverlayVisible(value),
});
function toggleOverlay() {
  overlayStore.toggleStaticOverlay();
}

const overlayCards = computed(() => {
  const cards = []
  const add = (key, title, desc, close) => {
    if (key === 'staticOverlay') return
    cards.push({
      key,
      title,
      desc,
      close: () => {
        pinned[key] = false
        close?.()
      }
    })
  }

  // Render most-recent first
  const keys = overlayOrder.value.slice().reverse()

  for (const key of keys) {
    switch (key) {
      case 'smaplantor':
        if (smaplantorVisible?.value) {
          add(
            'smaplantor',
            'Yngre träd och småplantor som lämnats',
            'Undviks underröjning före avverkning, kommer mykorrhizasvampar att överleva på dessa plantor och träd på samma sätt som de gör på rötterna av hänsynsträd.',
            () => (smaplantorVisible.value = false),
          )
        }
        break

      case 'hogstubbar':
        if (hogstubbarVisible?.value) {
          add(
            'hogstubbar',
            'Högstubbar',
            'Här finns inga levande mykorrhizamycel. Trädets rötter är döda.',
            () => (hogstubbarVisible.value = false),
          )
        }
        break

      case 'retention':
        if (retentionVisible?.value && (isTrakthygge || isLuckhuggning || isSkarmtrad)) {
          add(
            'retention',
            'Hänsynsträd',
            'De flesta mykorrhizasvamparna som växte med trädens rötter före avverkningen finns kvar och lever vidare. Mycel kan växa in i och spridas till uppväxande trädplantor.',
            () => (retentionVisible.value = false),
          )
        }
        break

      case 'kanteffekt':
        if (kanteffektVisible?.value && (isTrakthygge || isLuckhuggning || isSkarmtrad)) {
          add(
            'kanteffekt',
            'Kanteffekt',
            'Mykorrhizasvamp på trädens rötter i skogskanten kan sträcka sig 10–15 meter in på hygget; starkast närmast kanten.',
            () => (kanteffektVisible.value = false),
          )
        }
        break

      case 'rottacke':
        if (rottackeVisible?.value && (isBladning || isSkarmtrad)) {
          add(
            'rottacke',
            'Kontinuerligt rottäcke',
            'I princip är hela området täckt av rötter där mykorrhizasvampar kan överleva.',
            () => (rottackeVisible.value = false),
          )
        }
        break

      case 'naturvardsarter':
        if (naturvardsarterVisible?.value && (isTrakthygge || isLuckhuggning || isBladning || isSkarmtrad)) {
          add(
            'naturvardsarter',
            'Naturvårdsarter',
            'Naturvårdsarter har ofta speciella miljökrav, och förekommer främst i äldre skog. Generellt kan mycel av mykorrhizasvampar leva vidare på en plats så länge det finns levande träd. Svampindividers mycel kan likt träd bli många decennier till potentiellt sekler gamla.',
            () => (naturvardsarterVisible.value = false),
          )
        }
        break

      case 'seedTree':
        if (seedTreeVisible?.value && isSkarmtrad) {
          add(
            'seedTree',
            'Fröträd',
            'Mycel fortsätter leva på fröträdens rötter och kan koppla till nya plantor.',
            () => (seedTreeVisible.value = false),
          )
        }
        break

      case 'tradplantor':
        if (tradplantorVisible?.value && isTrakthygge) {
          add(
            'tradplantor',
            'Planterade små trädplantor',
            'Har med sig spontant etablerad mykorrhiza från plantskolan där de odlades upp. Det är dock få arter. Dessa ersätts succesivt med bättre anpassade och svamparter som finns på platsen.',
            () => (tradplantorVisible.value = false),
          )
        }
        break
    }
  }

  return cards
})
// Pin states for overlays (pinned overlays remain visible when others are toggled on)
const pinned = reactive({
  staticOverlay: false,
  retention: false,
  kanteffekt: false,
  rottacke: false,
  seedTree: false,
  smaplantor: false,
  hogstubbar: false,
  naturvardsarter: false,
  tradplantor: false,
})

function togglePinned(key) {
  pinned[key] = !pinned[key]
}

const overlayRefMap = {
  staticOverlay: staticOverlayVisible,
  retention: retentionVisible,
  kanteffekt: kanteffektVisible,
  rottacke: rottackeVisible,
  seedTree: seedTreeVisible,
  smaplantor: smaplantorVisible,
  hogstubbar: hogstubbarVisible,
  naturvardsarter: naturvardsarterVisible,
  tradplantor: tradplantorVisible,
} as const

const overlayBadgeItems = computed(() => ([
  { key: 'staticOverlay', label: 'Beståndsgräns' },
  { key: 'retention', label: 'Hänsynsträd' },
  { key: 'kanteffekt', label: 'Kanteffekt' },
  { key: 'rottacke', label: 'Rottäcke' },
  { key: 'seedTree', label: 'Fröträd' },
  { key: 'smaplantor', label: 'Småplantor' },
  { key: 'hogstubbar', label: 'Högstubbar' },
  { key: 'naturvardsarter', label: 'Naturvårdsarter' },
  { key: 'tradplantor', label: 'Trädplantor' },
]))

function toggleOverlayBadge(key: keyof typeof overlayRefMap) {
  const ref = overlayRefMap[key]
  if (!ref) return
  if (pinned[key]) {
    pinned[key] = false
    if (ref.value) ref.value = false
  } else {
    pinned[key] = true
    if (!ref.value) ref.value = true
  }
}

function enforceExclusive(activeKey) {
  (Object.keys(overlayRefMap) as Array<keyof typeof overlayRefMap>).forEach((key) => {
    if (key === activeKey) return
    if (pinned[key]) return
    if (overlayRefMap[key]?.value) overlayRefMap[key].value = false
  })
}

// Make overlays mutually exclusive unless pinned
watch(retentionVisible, (val) => { if (val) enforceExclusive('retention') })
watch(kanteffektVisible, (val) => { if (val) enforceExclusive('kanteffekt') })
watch(rottackeVisible, (val) => { if (val) enforceExclusive('rottacke') })
watch(seedTreeVisible, (val) => { if (val) enforceExclusive('seedTree') })
watch(smaplantorVisible, (val) => { if (val) enforceExclusive('smaplantor') })
watch(hogstubbarVisible, (val) => { if (val) enforceExclusive('hogstubbar') })
watch(naturvardsarterVisible, (val) => { if (val) enforceExclusive('naturvardsarter') })
watch(tradplantorVisible, (val) => { if (val) enforceExclusive('tradplantor') })
watch(staticOverlayVisible, (val) => { if (val) enforceExclusive('staticOverlay') })



const currentFwValue = computed(() => currentFramework.value?.value);
const isTrakthygge = computed(() => currentFwValue.value === 'trakthygge');
const isLuckhuggning = computed(() => currentFwValue.value === 'luckhuggning');
const isBladning = computed(() => currentFwValue.value === 'blädning' || currentFwValue.value === 'bladning');
const isSkarmtrad = computed(() => currentFwValue.value === 'skärmträd' || currentFwValue.value === 'skarmtrad');

// somewhere after your other refs:
const retentionTrees = ref([])

// --- Time navigation that mirrors UTabs exactly (use selectedTimeValue + timeItems) ---
function stepTabs(direction) {
  const items = Array.isArray(timeItems?.value) ? timeItems.value : []
  if (!items.length) return

  const values = items.map(it => String(it.value))
  const currKey = String(selectedTimeValue.value)
  let idx = values.indexOf(currKey)
  if (idx === -1) idx = 0

  if (direction < 0) {
    // step to previous enabled item; do NOT wrap
    for (let j = idx - 1; j >= 0; j--) {
      if (!items[j]?.disabled) {
        selectedTimeValue.value = String(items[j].value)
        return
      }
    }
    return // no previous available
  } else {
    // step to next enabled item; do NOT wrap
    for (let j = idx + 1; j < items.length; j++) {
      if (!items[j]?.disabled) {
        selectedTimeValue.value = String(items[j].value)
        return
      }
    }
    return // no next available
  }
}


function normalizeTid(s) { return (s || '').toString().trim().toLowerCase() }
function firstN(s, n) { const t = (s || '').toString(); return t.length > n ? t.slice(0, n) + '…' : t }

const itemsArray = computed(() =>
  Array.isArray(timeItems?.value) ? timeItems.value
    : (Array.isArray(timeItems) ? timeItems : [])
)

const currentIndex = computed(() => {
  const values = itemsArray.value.map(it => String(it.value))
  const idx = values.indexOf(String(selectedTimeValue.value))
  return idx === -1 ? 0 : idx
})

const prevItem = computed(() => {
  for (let j = currentIndex.value - 1; j >= 0; j--) {
    if (!itemsArray.value[j]?.disabled) return itemsArray.value[j]
  }
  return null
})

const nextItem = computed(() => {
  for (let j = currentIndex.value + 1; j < itemsArray.value.length; j++) {
    if (!itemsArray.value[j]?.disabled) return itemsArray.value[j]
  }
  return null
})

// reuse your hasPrevTime/hasNextTime if they exist; if not:
const hasPrevTime = computed(() => !!prevItem.value)
const hasNextTime = computed(() => !!nextItem.value)

function findTimelineSkog(tid) {
  try {
    const fw = currentFramework.value && currentFramework.value.value
    const st = currentStartskog.value && currentStartskog.value.value
    const rec = timelineEntries.value.find(r =>
      r.atgard === fw &&
      r.startskog === st &&
      normalizeTid(r.tid) === normalizeTid(tid)
    )
    return rec?.skog || ''
  } catch (e) { return '' }
}

const prevTitle = computed(() =>
  prevItem.value ? String(prevItem.value.label ?? prevItem.value.value) : ''
)
const nextTitle = computed(() =>
  nextItem.value ? String(nextItem.value.label ?? nextItem.value.value) : ''
)

const prevTid = computed(() => prevItem.value ? mapTimeValueToDataAlder(Number(prevItem.value.value)) : null)
const nextTid = computed(() => nextItem.value ? mapTimeValueToDataAlder(Number(nextItem.value.value)) : null)

const prevSkog = computed(() => findTimelineSkog(prevTid.value))
const nextSkog = computed(() => findTimelineSkog(nextTid.value))

function goPrevTime() { stepTabs(-1) }
function goNextTime() { stepTabs(1) }



// --- Clickable phrases in timeline text -> overlay toggles ---
const CLICK_RULES = [
  { re: /hänsynsträd/gi, overlay: 'retention' },
  { re: /evighetsträd/gi, overlay: 'retention' },
  { re: /hyggeskanterna/gi, overlay: 'kanteffekt' },
  { re: /luckorna/gi, overlay: 'kanteffekt' },
  { re: /fröträdens rötter/gi, overlay: 'seedTree' },
  { re: /fröträd/gi, overlay: 'seedTree' },
  { re: /skärmträdens rötter/gi, overlay: 'rottacke' },
  { re: /småplantor/gi, overlay: 'smaplantor' },
  { re: /högstubbar/gi, overlay: 'hogstubbar' },
  { re: /rödlistade svampar/gi, overlay: 'naturvardsarter' },
  { re: /rödlistad art/gi, overlay: 'naturvardsarter' },
  { re: /Trädplantor/gi, overlay: 'tradplantor' }

];

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function makeClickableHtml(text = '') {
  let html = escapeHtml(text);
  for (const rule of CLICK_RULES) {
    html = html.replace(rule.re, (m) =>
      `<span class=\" py-0.5 px-1 rounded-md border bg-white border-muted/50 text-neutral-800 cursor-pointer hover:opacity-80\" data-overlay=\"${rule.overlay}\">${m}</span>`
    );
  }
  return html;
}

function handleTimelineClick(evt) {
  const target = evt.target.closest('[data-overlay]');
  if (!target) return;
  const key = target.getAttribute('data-overlay');
  if (key === 'retention') {
    retentionVisible.value = !retentionVisible.value;
  } else if (key === 'kanteffekt') {
    kanteffektVisible.value = !kanteffektVisible.value;
  } else if (key === 'seedTree') {
    seedTreeVisible.value = !seedTreeVisible.value;
  } else if (key === 'rottacke') {
    rottackeVisible.value = !rottackeVisible.value;
  } else if (key === 'smaplantor') {
    smaplantorVisible.value = !smaplantorVisible.value;
  } else if (key === 'hogstubbar') {
    hogstubbarVisible.value = !hogstubbarVisible.value;
  } else if (key === 'naturvardsarter') {
    naturvardsarterVisible.value = !naturvardsarterVisible.value;
  } else if (key === 'tradplantor') {
    tradplantorVisible.value = !tradplantorVisible.value;
  }
}


// Toggle whether the Compare section is open
const compareOpen = ref(false);

// Items for the layout‐mode UTabs
const layoutTabItems = computed(() => [
  { value: 'sideBySide', label: 'Sida vid sida' },
  { value: 'slider', label: 'Skjutreglage' }
]);

const frameworkOptions = computed(() =>
  frameworks.map((fw, i) => ({
    value: i,
    label: fw.label,
    description: fw.text
  }))
)

const infoOpen = ref(true);
const menuOpen = ref(false);


const annotationsVisible = ref(false);


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
const opacitySyncEnabled = ref(true);
const globalOpacity = ref(0);

// Assuming the base image is currentImagePath (trees off)
// For the overlay image, force trees to be visible.
const currentOverlayImagePath = computed(() => {
  const framework = currentFramework.value.value;
  const tLabel = mapTimeToLabel(time.value);
  const treeVisibility = "visa";
  const fungiVisibility = showFungi.value ? "visa" : "dölj";
  const startskogValue = currentStartskog.value.value;
  return buildDziUrl({ framework, timeLabel: tLabel, fungiVisibility, treeVisibility, startskog: startskogValue });
});

// For the "before" viewer (often using a static time label like "före")
const comparisonOverlayImagePath1 = computed(() => {
  const framework = currentFramework.value.value;
  const tLabel = "före";
  const treeVisibility = "visa";
  const fungiVisibility = showFungi.value ? "visa" : "dölj";
  const startskogValue = currentStartskog.value.value;
  return buildDziUrl({ framework, timeLabel: tLabel, fungiVisibility, treeVisibility, startskog: startskogValue });
});

// For the "after" viewer (using the current time label)
const comparisonOverlayImagePath2 = computed(() => {
  const framework = currentFramework.value.value;
  const tLabel = mapTimeToLabel(time.value);
  const treeVisibility = "visa";
  const fungiVisibility = showFungi.value ? "visa" : "dölj";
  const startskogValue = currentStartskog.value.value;
  return buildDziUrl({ framework, timeLabel: tLabel, fungiVisibility, treeVisibility, startskog: startskogValue });
});

// For framework1 viewer:
const frameworkOverlayImagePath1 = computed(() => {
  const framework = currentFramework.value.value;
  const tLabel = mapTimeToLabel(time.value);
  const treeVisibility = "visa";
  const fungiVisibility = showFungi.value ? "visa" : "dölj";
  const startskogValue = currentStartskog.value.value;
  return buildDziUrl({ framework, timeLabel: tLabel, fungiVisibility, treeVisibility, startskog: startskogValue });
});

// For framework2 viewer:
const frameworkOverlayImagePath2 = computed(() => {
  const framework = currentFramework2.value.value;
  const tLabel = mapTimeToLabel(time.value);
  const treeVisibility = "visa";
  const fungiVisibility = showFungi.value ? "visa" : "dölj";
  const startskogValue = currentStartskog.value.value;
  return buildDziUrl({ framework, timeLabel: tLabel, fungiVisibility, treeVisibility, startskog: startskogValue });
});

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


// Views are enabled only when the toggle is ON, but the selection persists
const isCompare = computed(() =>
  compareEnabled.value && selectedCompareChoice.value === 'beforeAfterCompare'
)
const isFrameworkCompareMode = computed(() =>
  compareEnabled.value && selectedCompareChoice.value === 'frameworkCompare'
)

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
const open2 = ref(false);


// defineShortcuts({
//   o: () => (open.value = !open.value),
// });
onMounted(() => {
  removeShortcutsFn = defineShortcuts({
    o: () => (open.value = !open.value),
  });
});

onBeforeUnmount(() => {
  if (typeof removeShortcutsFn === "function") {
    removeShortcutsFn();
  }
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
    text: "Avverkning i tre steg under 20 år",
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
  { label: "Inte tidigare kalavverkad", value: "naturskog" },
  { label: "Tidigare kalavverkad", value: "produktionsskog_" },
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
  sliderSteps.value.map(step => ({
    value: String(step.value),
    label: step.label,
    disabled: isCompare.value && step.value === 3,
  }))
);

const selectedTimeValue = computed({
  get() {
    return String(time.value);
  },
  set(newKey) {
    const step = sliderSteps.value.find(s => String(s.value) === newKey);
    if (step) handleTimeSelection(step);
  }
});

// Create a computed property that gets/sets the selected tab index
// based on the time value. When set, it calls handleTimeSelection.
// Use a ref for the selected tab index
// const selectedTimeIndex = ref(0);

// Watch the selectedTimeIndex and update time when it changes
// watch(selectedTimeIndex, (newIndex) => {
//   const step = sliderSteps.value[newIndex];
//   if (step) {
//     handleTimeSelection(step);
//   }
// });

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

const timelineInfo = computed(() => {
  if (!currentFramework.value?.value || !timeLabelForDataFiltering.value || !currentStartskog.value?.value) return null;
  return timelineEntries.value.find(item =>
    item.atgard === currentFramework.value.value &&
    item.tid === timeLabelForDataFiltering.value &&
    item.startskog === currentStartskog.value.value
  );
});
const timelineInfo2 = computed(() => {
  if (!currentFramework2.value?.value || !timeLabelForDataFiltering.value || !currentStartskog.value?.value) return null;
  return timelineEntries.value.find(item =>
    item.atgard === currentFramework2.value.value &&
    item.tid === timeLabelForDataFiltering.value &&
    item.startskog === currentStartskog.value.value
  );
});


// Always fetch the “before” info (tid: 'innan') for before/after compare
const timelineInfoBefore = computed(() => {
  if (!currentFramework.value?.value || !currentStartskog.value?.value) return null;
  return timelineEntries.value.find(item =>
    item.atgard === currentFramework.value.value &&
    item.tid === 'innan' &&
    item.startskog === currentStartskog.value.value
  );
});

const timelineEmptyMessage = 'Ingen tidslinjeinformation hittades för den här kombinationen.';

type TimelineSection = {
  key: string;
  left: string;
  right: string;
  info: { skog: string; svamp: string } | null;
  emptyMessage?: string;
};

const timelineSections = computed<TimelineSection[]>(() => {
  const sections: TimelineSection[] = [];
  const frameworkLabel = currentFramework.value?.label ?? '';
  const framework2Label = currentFramework2.value?.label ?? '';
  const timeLabel = currentTimeLabel.value ?? '';

  if (isCompare.value) {
    sections.push({
      key: 'before',
      left: frameworkLabel,
      right: 'Före avverkning',
      info: timelineInfoBefore.value ?? null,
    });
    sections.push({
      key: 'after',
      left: frameworkLabel,
      right: timeLabel,
      info: timelineInfo.value ?? null,
    });
  } else if (isFrameworkCompareMode.value) {
    sections.push({
      key: 'framework1',
      left: frameworkLabel,
      right: timeLabel,
      info: timelineInfo.value ?? null,
    });
    sections.push({
      key: 'framework2',
      left: framework2Label,
      right: timeLabel,
      info: timelineInfo2.value ?? null,
    });
  } else {
    sections.push({
      key: 'single',
      left: frameworkLabel,
      right: timeLabel,
      info: timelineInfo.value ?? null,
    });
  }

  return sections;
});

const timelineDetailState = reactive<Record<string, { skog: boolean; svamp: boolean }>>({});

function ensureTimelineDetailState(key: string) {
  if (!timelineDetailState[key]) {
    timelineDetailState[key] = { skog: false, svamp: false };
  }
}

function isTimelineDetailOpen(key: string, field: 'skog' | 'svamp') {
  ensureTimelineDetailState(key);
  return timelineDetailState[key][field];
}

function toggleTimelineDetail(key: string, field: 'skog' | 'svamp') {
  ensureTimelineDetailState(key);
  timelineDetailState[key][field] = !timelineDetailState[key][field];
}

watch(
  timelineSections,
  (sections) => {
    sections.forEach((section) => ensureTimelineDetailState(section.key));
  },
  { immediate: true }
);

function setCompareMode(enabled) {
  compareEnabled.value = enabled;
  if (!enabled) {
    selectedCompareChoice.value = 'beforeAfterCompare';
  } else if (!selectedCompareChoice.value) {
    selectedCompareChoice.value = 'beforeAfterCompare';
  }
}

// Image paths
const comparisonImagePath1 = computed(() => {
  const framework = currentFramework.value.value;
  const timeLabel = "före";
  const treeVisibility = "dölj";
  const fungiVisibility = showFungi.value ? "visa" : "dölj";
  const startskogValue = currentStartskog.value.value;
  return buildDziUrl({ framework, timeLabel, fungiVisibility, treeVisibility, startskog: startskogValue });
});

const currentImagePath2 = computed(() => {
  const framework = currentFramework2.value.value;
  const tLabel = mapTimeToLabel(time.value);
  const treeVisibility = "dölj";
  const fungiVisibility = showFungi.value ? "visa" : "dölj";
  const startskogValue = currentStartskog.value.value;
  return buildDziUrl({ framework, timeLabel: tLabel, fungiVisibility, treeVisibility, startskog: startskogValue });
});

const currentImageKey = computed(() => {
  const framework = currentFramework.value.value.toLowerCase();
  const tLabel = mapTimeToLabel(time.value);
  return `${framework}_${tLabel}`;
});

const currentImagePath = computed(() => {
  const framework = currentFramework.value.value;
  const tLabel = mapTimeToLabel(time.value);
  const treeVisibility = "dölj";
  const fungiVisibility = showFungi.value ? "visa" : "dölj";
  const startskogValue = currentStartskog.value.value;
  return buildDziUrl({ framework, timeLabel: tLabel, fungiVisibility, treeVisibility, startskog: startskogValue });
});

if (import.meta.dev) {
  watch(
    [currentImagePath, currentOverlayImagePath],
    ([base, overlay]) => {
      console.debug('[OSD] Base DZI:', base);
      console.debug('[OSD] Overlay DZI:', overlay);
    },
    { immediate: true }
  );
}

// Watchers
watch([currentFramework, isCompare, isFrameworkCompareMode], () => {
  const validValues = sliderSteps.value.map((s) => s.value);
  if (!validValues.includes(time.value)) {
    time.value = 15;
  }
});

// // Preload watcher: robust DZI manifest parsing and tile calculation
// watch([currentFramework, currentStartskog, showFungi], ([framework, startskog, fungiVisible]) => {
//   const frameworkValue = framework.value.toLowerCase();
//   const startskogValue = startskog.value;
//   const treeVisibility = 'dölj';
//   const fungiVisibility = fungiVisible ? 'visa' : 'dölj';
//   // Build all DZI URLs for the current slider steps
//   const urls = sliderSteps.value.map(step => {
//     const tLabel = step.timeLabel;
//     return `/images/DZI_Images/${frameworkValue}_${tLabel}_${fungiVisibility}_${treeVisibility}_${startskogValue}_v2.dzi`;
//   });
//   // Deduplicate URLs
//   const uniqueUrls = Array.from(new Set(urls));
//   uniqueUrls.forEach(dziUrl => {
//     console.log('Preloading DZI:', dziUrl);
//     fetch(dziUrl)
//       .then(res => res.text())
//       .then(xmlText => {
//         const parser = new DOMParser();
//         const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
//         const imageEl = xmlDoc.documentElement; // <Image> root
//         const format = imageEl.getAttribute('Format');
//         const tileSize = parseInt(imageEl.getAttribute('TileSize'), 10);
//         const sizeEl = xmlDoc.getElementsByTagName('Size')[0];
//         const width = parseInt(sizeEl.getAttribute('Width'), 10);
//         const height = parseInt(sizeEl.getAttribute('Height'), 10);
//         const maxLevel = Math.ceil(Math.log2(Math.max(width, height)));
//         const targetLevel = Math.min(11, maxLevel);
//         for (let level = 0; level <= targetLevel; level++) {
//           const scale = Math.pow(2, maxLevel - level);
//           const levelWidth = Math.ceil(width / scale);
//           const levelHeight = Math.ceil(height / scale);
//           const cols = Math.ceil(levelWidth / tileSize);
//           const rows = Math.ceil(levelHeight / tileSize);
//           for (let x = 0; x < cols; x++) {
//             for (let y = 0; y < rows; y++) {
//               const tileUrl = dziUrl.replace('.dzi', `_files/${level}/${x}_${y}.${format}`);
//               console.log(`Preloading tile L${level} (${x},${y}):`, tileUrl);
//               const img = new Image();
//               img.crossOrigin = 'Anonymous';
//               img.src = tileUrl;
//             }
//           }
//         }
//       })
//       .catch(() => {});
//   });
// }, { immediate: true });

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
  { label: 'Två metoder', value: 'frameworkCompare' },
  { label: 'Före / efter', value: 'beforeAfterCompare' }
]

// This reactive variable holds the currently selected compare option.
// const selectedCompareChoice = ref('beforeAfterCompare')

// Build the dropdown items array based on your compare options.
// Each item is rendered as a checkbox with its "checked" state computed from selectedCompareChoice.


// A new reactive variable for layout mode, independent of isFrameworkCompareMode.
// const currentLayoutMode = ref('slider');
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
  if (selectedCompareChoice.value === 'frameworkCompare') return 'Två metoder';
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

watch(currentLayoutMode, (mode) => {
  if (comparisonSliderRef.value && comparisonSliderRef.value.setLayoutMode) {
    comparisonSliderRef.value.setLayoutMode(mode);
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

.hide-scrollbar {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari, Opera */
}
</style>
