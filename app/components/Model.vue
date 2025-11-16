<template>
  <div class="relative flex flex-col w-full h-dvh">
    <UButton v-if="isMobile" icon="i-heroicons-x-mark" variant="solid" color="error"
      class="rounded-full h-fit absolute bottom-4 left-4 z-50" :ui="{ rounded: 'rounded-full' }" @click="emit('close')"
      aria-label="Stäng modellvy" size="xl" />
    <DefineSettingsTemplate>
      <div class="space-y-0.5 p-3">
        <div class="grid grid-cols-2 gap-2 ">
          <UButton size="xs" variant="outline" color="neutral" @click="setCompareMode(false)"
            :class="!compareEnabled ? 'bg-neutral-100 shadow ring-muted' : 'text-muted/60 hover:text-muted ring-muted/50'">
            <div class="flex flex-col text-center items-center w-full space-y-1">
              <UIcon name="i-bx-rectangle" class="size-4" />
              <h1>Enkelvy</h1>
            </div>
          </UButton>
          <UButton size="xs" variant="outline" color="neutral" @click="setCompareMode(true)"
            :class="compareEnabled ? 'bg-neutral-100 shadow ring-muted' : 'text-muted/60 hover:text-muted ring-muted/50'">
            <div class="flex flex-col text-center items-center w-full space-y-1">
              <UIcon name="iconamoon:compare-duotone" class="size-4" />
              <h1>Jämför</h1>
            </div>
          </UButton>
        </div>

        <!-- <span class="text-sm tracking-wide text-neutral-400">Läge</span> -->
        <UTabs v-if="compareEnabled" v-model="selectedCompareChoice" :items="compareOptions" size="sm"
          placeholder="Välj" :clearable="true" class="w-full ring-muted -mb-2 mt-2" :ui="{
            root: 'min-w-max flex-shrink-0',
            list: 'flex-nowrap rounded-xl bg-muted/50 -mb-1.5 gap-2',
            indicator: 'bg-white border border-muted/50 shadow ',
            trigger: ' data-[state=active]:text-neutral-800 dark:data-[state=active]:text-violet-400/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary '
          }" />

      </div>
      <!-- <USeparator :ui="{ border: 'border-muted/50' }" />
      <div class="p-3 flex flex-col gap-3">

        <div class="flex flex-wrap gap-1">
          <UBadge v-for="overlay in overlayBadgeItems" :key="overlay.key" :label="overlay.label" :icon="overlay.icon"
            :color="pinned[overlay.key] ? 'primary' : 'neutral'" :variant="pinned[overlay.key] ? 'solid' : 'subtle'"
            class="cursor-pointer" :class="pinned[overlay.key] ? 'shadow-sm' : 'opacity-70 hover:opacity-100'"
            @click="toggleOverlayBadge(overlay.key)" />
        </div>
      </div> -->
    </DefineSettingsTemplate>
    <div>
      <div class="absolute top-0 z-50 w-full sm:flex">
        <div class="sm:flex items-center border-muted sm:p-1 ">
          <div class="flex w-full sm:w-fit h-fit justify-center pt-5 pb-0 sm:pb-0 items-center sm:items-start">
            <div class="w-full">


              <div v-if="frameworkOptions.length"
                class="grid sm:gap-4 gap-2 pl-4 pr-2.5 sm:py-1 flex-row sm:items-center sm:justify-start h-fit w-full sm:w-fit"
                :class="isFrameworkCompareMode ? 'grid-cols-2' : 'grid-cols-1'">
                <USelect size="xl" :items="frameworkOptions" v-model="selectedFrameworkIndex"
                  :placeholder="currentFramework.label" append-to-body variant="outline"
                  class="ring-muted  w-full shadow rounded-full "
                  :ui="{ content: 'min-w-fit rounded-xl z-50', viewport: 'text-center' }" />
                <USelect v-if="isFrameworkCompareMode" size="xl" :items="frameworkOptions"
                  v-model="selectedFrameworkIndex2" :placeholder="currentFramework2.label" append-to-body
                  variant="outline" class="ring-muted  w-full shadow rounded-full "
                  :ui="{ content: 'rounded-xl min-w-fit z-50' }" />
              </div>
              <div class="hidden sm:block pl-4 pt-4">
                <UButton size="lg" color="neutral" variant="outline" class="ring-muted rounded-full shadow"
                  :icon="infoDrawerOpen ? 'i-heroicons-chevron-left' : 'i-heroicons-chevron-right'"
                  @click="infoDrawerOpen = !infoDrawerOpen" />
              </div>
            </div>
            <div>
              <UPopover :ui="{ content: 'p-0 w-80 rounded-lg mr-2 z-50', }"
                :content="{ side: 'bottom', sideOffset: 8, collisionPadding: 8, align: 'start' }"
                class="pointer-events-auto mr-4 sm:mt-1">
                <UButton size="xl" color="neutral" variant="outline" icon="iconamoon:compare-duotone"
                  class="ring-muted/50 shadow  rounded-full" />
                <template #content>
                  <reuseSettingsTemplate />
                </template>
              </UPopover>
              <!-- <UDrawer v-else :modal="false" :ui="{ content: 'p-0', body: 'p-0', container: 'p-0 gap-0' }">
                <UButton :size="isMobile ? 'xl' : 'md'" color="neutral" variant="outline"
                  :label="isMobile ? null : 'Display'" icon="iconamoon:compare-duotone"
                  class="ring-muted rounded-full sm:rounded pointer-events-auto mr-4 shadow" />
                <template #body>
                  <reuseSettingsTemplate />
                </template>
              </UDrawer> -->
            </div>


            <!-- <USeparator v-if="!isMobile" orientation="vertical" class="mx-3 h-8" /> -->
          </div>


          <div v-if="!isMobile" class="absolute top-3 right-3">
            <UButton icon="i-heroicons-x-mark" variant="solid" color="error" class="rounded-full"
              :ui="{ rounded: 'rounded-full' }" @click="emit('close')" aria-label="Stäng modellvy" />
          </div>



        </div>
        <div
          class="flex sm:justify-center items-center overflow-x-scroll md:overflow-hidden my-3 h-fit sm:mt-8 sm:my-0 gap-2 ">

          <UPopover class=" cursor-pointer z-50" v-model:open="open2"
            :content="{ side: 'bottom', sideOffset: 8, collisionPadding: 8, align: 'start' }"
            :ui="{ content: 'rounded-xl z-50' }">
            <UButton :variant="isMobile ? 'soft' : 'soft'" color="neutral" :size="isMobile ? 'lg' : 'md'"
              class="rounded-full ring-muted h-fit ml-3 sm:ml-0"
              :icon="currentStartskog.value == 'naturskog' ? 'i-material-symbols-light-forest-rounded' : 'i-ph-farm'">
              <!-- <div v-if="!isMobile" class="flex items-center gap-2">

                <span>{{ currentStartskog.label }}</span>
                <UIcon v-if="currentStartskog && currentStartskog.value && !isMobile" name="i-heroicons-chevron-down"
                  class="w-4 h-4 " />
              </div> -->
            </UButton>
            <template #content>
              <div class="text-sm w-64 p-3 text-neutral-500 border-b border-neutral-200 ">
                Har skogen varit kalavverkad tidigare?
              </div>
              <div class="p-1 flex flex-col gap-1">
                <div v-for="option in startskog" :key="option.value">
                  <UButton @click="selectOption(option)" size="lg" color="neutral" variant="ghost" :label="option.label"
                    class="hover:bg-neutral-100 cursor-pointer text-neutral-400 w-full rounded-lg" :class="{
                      ' bg-neutral-100 text-neutral-800': currentStartskog.value === option.value,
                    }" :icon="option.value === 'naturskog' ? 'i-material-symbols-light-forest-rounded' : 'i-ph-farm'">
                  </UButton>
                </div>
              </div>
            </template>
          </UPopover>

          <div class="w-full max-w-full">
            <div class="inline-flex flex-nowrap whitespace-nowrap gap-2">
              <UButton v-for="(it, idx) in timeItems" :key="'time-btn-' + idx" :disabled="it?.disabled"
                :size="isMobile ? 'md' : 'md'" color="neutral" variant="outline"
                class="rounded-full ring-muted/50 flex-none shrink-0 disabled:bg-neutral-900 disabled:text-white"
                :class="String(selectedTimeValue) === String(it?.value)
                  ? 'bg-neutral-900 text-white shadow hover:bg-neutral-900 '
                  : 'opacity-100 hover:opacity-100'" :label="String(it?.label ?? it?.value)"
                :aria-pressed="String(selectedTimeValue) === String(it?.value)"
                @click="!it?.disabled && (selectedTimeValue = String(it?.value))" />
            </div>
          </div>
        </div>
      </div>


      <div class="flex justify-center">
        <!-- <div class="absolute top-3 left-3 flex flex-col gap-1 pointer-events-auto">
          <USwitch :ui="{ root: 'flex-row-reverse justify-between' }" color="warning" v-model="devSaveClicks"
            label="Spara klick (dev)" />
          <USwitch :ui="{ root: 'flex-row-reverse justify-between' }" color="warning" v-model="devOverlayLabelsVisible"
            label="Visa myc-etiketter (dev)" />
          <USwitch :ui="{ root: 'flex-row-reverse justify-between' }" color="warning"
            v-model="devNaturvardCounterVisible" label="Visa naturvårdssiffra (dev)" />
        </div> -->


        <div
          class="absolute bottom-8 left-1/2 transform -translate-x-1/2 p-4 sm:p-0 space-y-2 sm:space-y-0 pointer-events-none sm:flex gap-2 items-center z-40">


          <UDrawer :direction="isMobile ? 'bottom' : 'left'" :inset="isMobile ? false : true"
            :dismissible="isMobile ? false : false" :overlay="false" :handle="isMobile ? false : false" :modal="false"
            v-model:open="infoDrawerOpen" class="pointer-events-auto "
            :ui="{ header: 'flex items-center justify-between', body: 'p-0 ', container: 'p-0 gap-0 ', content: 'sm:max-w-xs sm:ring-muted/50 rounded-t-xl sm:rounded-xl sm:shadow sm:mt-18 sm:h-fit sm:overflow-visible', footer: 'gap-0' }">
            <div class="sm:hidden z-50">
              <UButton :size="'xl'" :label="'Information'" color="neutral" :icon="'i-heroicons-chevron-up'"
                class="ring-muted rounded-full shadow z-50" :variant="infoDrawerOpen ? 'subtle' : 'outline'" />
            </div>
            <template #body>

              <UButton
                class="absolute top-1.5 sm:top-0 sm:-right-12 right-1.5 rounded-full transition-all ring-muted/50 pointer-events-auto z-50"
                :class="infoDrawerOpen ? '' : 'hidden'" variant="outline" color="neutral"
                @click="infoDrawerOpen = false" :icon="isMobile ? 'i-heroicons-x-mark' : 'i-heroicons-chevron-left'"
                size="lg" />
              <div class="relative">
                <UTabs v-model="infoActiveTab" :items="panelTabs" variant="pill" size="sm" color="neutral"
                  :ui="{ root: 'gap-0', content: '', list: 'w-fit m-2 p-0.5 px-1 bg-muted/50', indicator: 'shadow  bg-white active:text-neutral-900', trigger: 'data-[state=active]:text-neutral-900' }"
                  class="">

                  <template #text>
                    <div class="sm:grid divide-y sm:divide-y-0 sm:divide-x divide-muted/70 transition-all relative"
                      :class="[compareEnabled ? 'sm:grid-cols-1' : 'sm:grid-cols-1',]">
                      <!-- <div class="absolute inset-0 bg-neutral-500 transition-all pointer-events-none"
                        :class="activeOverlayContent ? 'opacity-0 sm:bg-neutral-500/50' : 'opacity-0'">
                      </div> -->
                      <div v-if="!(isFrameworkCompareMode || isCompare)" v-for="section in timelineSections"
                        :key="section.key" class="p-4 sm:p-5 group" @click="handleTimelineClick">
                        <div v-if="section.info" class="space-y-4">
                          <div class="space-y-2 ">
                            <!-- <UButton type="button" variant="ghost" color="neutral"
                              class="flex w-full items-center font-semibold gap-2 tracking-wide text-neutral-500 transition"
                              @click.stop="toggleTimelineDetail(section.key, 'skog')">
                              <span>Utveckling i skogen</span>
                              <UIcon name="i-heroicons-chevron-down"
                                class="h-4 w-4 text-neutral-400 transition-transform duration-200"
                                :class="{ '-rotate-90': !isTimelineDetailOpen(section.key, 'skog') }" />
                            </UButton> -->
                            <p class="text-sm text-muted" v-html="makeClickableHtml(section.info.skog)"></p>
                          </div>
                          <div class="space-y-2">
                            <!-- <UButton type="button" variant="ghost" color="neutral"
                              class="flex w-full items-center gap-2 font-semibold  tracking-wide text-neutral-500 transition"
                              @click.stop="toggleTimelineDetail(section.key, 'svamp')">
                              <span>Påverkan på mykorrhizasvampar</span>
                              <UIcon name="i-heroicons-chevron-down"
                                class="h-4 w-4 text-neutral-400 transition-transform duration-200"
                                :class="{ '-rotate-90': !isTimelineDetailOpen(section.key, 'svamp') }" />
                            </UButton> -->
                            <span class="text-sm" v-html="makeClickableHtml(section.info.svamp)"></span>
                          </div>
                        </div>
                        <div v-else class="text-sm text-neutral-400">
                          {{ section.emptyMessage || timelineEmptyMessage }}
                        </div>
                      </div>
                      <div v-else class="w-full">
                        <UCarousel :dots="isMobile ? false : true" :items="timelineSections" class="max-w-4xl mx-auto"
                          :ui="{ item: 'basis-12/13', viewport: 'p-3 sm:mb-12' }">
                          <template #default="{ item: section }">
                            <UCard :ui="{ body: 'p-4 space-y-4' }" class="" variant="soft" @click="handleTimelineClick">
                              <div class="flex items-center justify-between gap-3">
                                <h2 class="text-sm font-medium text-neutral-700">
                                  {{ section.left }}
                                </h2>
                                <UBadge :label="section.right" class="ring-muted/50 py-1" variant="outline"
                                  color="neutral" />
                              </div>
                              <div v-if="section.info" class="space-y-2">
                                <div>
                                  <!-- <UButton type="button" variant="ghost" color="neutral"
                                    class="-mx-2 flex w-full items-center font-semibold gap-2 tracking-wide text-neutral-500 transition"
                                    @click.stop="toggleTimelineDetail(section.key, 'skog')">
                                    <span>Utveckling i skogen</span>
                                    <UIcon name="i-heroicons-chevron-down"
                                      class="h-4 w-4 text-neutral-400 transition-transform duration-200"
                                      :class="{ '-rotate-90': !isTimelineDetailOpen(section.key, 'skog') }" />
                                  </UButton> -->
                                  <p class="text-sm text-muted" v-html="makeClickableHtml(section.info.skog)"></p>
                                </div>
                                <div class="space-y-2">
                                  <!-- <UButton type="button" variant="ghost" color="neutral"
                                    class="-mx-2 flex w-full items-center gap-2 font-semibold tracking-wide text-neutral-500 transition"
                                    @click.stop="toggleTimelineDetail(section.key, 'svamp')">
                                    <span>Påverkan på mykorrhizasvampar</span>
                                    <UIcon name="i-heroicons-chevron-down"
                                      class="h-4 w-4 text-neutral-400 transition-transform duration-200"
                                      :class="{ '-rotate-90': !isTimelineDetailOpen(section.key, 'svamp') }" />
                                  </UButton> -->
                                  <span class="text-sm" v-html="makeClickableHtml(section.info.svamp)"></span>
                                </div>
                              </div>
                              <div v-else class="text-sm text-neutral-400">
                                {{ section.emptyMessage || timelineEmptyMessage }}
                              </div>
                            </UCard>
                          </template>
                        </UCarousel>
                      </div>
                    </div>
                  </template>
                  <template #diagram>
                    <div class="sm:p-3 sm:pt-0">


                      <ForestryChartMain v-if="infoActiveTab === 'diagram'" ref="chartMainRef"
                        v-model:selectedChart="persistedChartKey"
                        :parentSelectedFrameworks="isFrameworkCompareMode ? [currentFramework.value, currentFramework2.value] : [currentFramework.value]"
                        :currentTimeValue="currentTimeValue" :currentStartskog="currentStartskog.value" />
                    </div>
                  </template>
                  <template #markers>
                    <div class="flex flex-wrap gap-1.5 sm:gap-2 p-2 sm:p-4">
                      <UBadge v-for="overlay in overlayBadgeItems" :key="overlay.key" :label="overlay.label"
                        :icon="overlay.icon" :color="pinned[overlay.key] ? 'primary' : 'neutral'"
                        :variant="pinned[overlay.key] ? 'solid' : 'subtle'" class="cursor-pointer"
                        :class="pinned[overlay.key] ? 'shadow-sm' : 'opacity-70 hover:opacity-100'"
                        @click="toggleOverlayBadge(overlay.key)" />
                    </div>
                  </template>
                </UTabs>
              </div>
              <UDrawer v-if="activeOverlayContent" v-model:open="overlayDrawerOpen" :nested="isMobile ? true : false"
                direction="bottom" :modal="true" :overlay="false" :inset="isMobile ? false : true"
                :handle="isMobile ? true : false" :ui="{
                  container: 'p-0 gap-0',
                  content: 'sm:max-w-sm w-full mx-auto',
                  body: 'p-4 space-y-3'
                }">
                <template #body>
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex items-start gap-2">
                      <UIcon v-if="activeOverlayIcon" :name="activeOverlayIcon"
                        class="size-5 text-primary-500 mt-0.5" />
                      <h3 class="text-base font-semibold text-neutral-800">
                        {{ activeOverlayContent.title }}
                      </h3>
                    </div>
                    <div class="flex gap-1">
                      <UButton :color="activeOverlayPinned ? 'error' : 'primary'" variant="subtle" size="xs"
                        :ui="{ rounded: 'rounded-full' }" :label="activeOverlayPinned ? 'Ta bort' : 'Fäst i vyn'"
                        :icon="activeOverlayPinned ? 'i-tabler-pinned-off' : 'i-tabler-pinned'"
                        :aria-pressed="activeOverlayPinned" :title="activeOverlayPinned ? 'Lossa' : 'Fäst'"
                        @click="togglePinned(activeOverlayContent.key, { hideWhenUnpin: false })" />
                    </div>
                  </div>
                  <p class="text-sm text-neutral-600 leading-relaxed">
                    {{ activeOverlayContent.description }}
                  </p>
                  <UButton v-if="activeOverlayContent.key === 'naturvardsarter'" size="sm" color="primary"
                    variant="soft" class="mt-2" icon="i-carbon-chart-line-smooth" @click="openNaturvardsarterChart()">
                    Visa naturvårdsartsdiagram
                  </UButton>
                  <UCard v-if="activeOverlayContent.key === 'kanteffekt'" variant="soft"
                    :ui="{ body: 'sm:p-4 sm:pl-2' }" class="mt-2 backdrop-blur-xl border border-white/10">
                    <USwitch :ui="{
                      root: 'flex-row-reverse justify-between',
                      label: '',
                      description: '',
                      base: 'data-[state=unchecked]:bg-neutral-600'
                    }" size="md" color="primary" v-model="oldKanteffektVisible" label="Tidigare kanteffekt"
                      description="Visa spår från tidigare kanteffekt" />
                  </UCard>
                </template>
              </UDrawer>



            </template>
          </UDrawer>

          <!-- <div>
              <UDrawer :direction="isMobile ? 'bottom' : 'bottom'" :inset="isMobile ? false : true" handle-only
                :dismissible="isMobile ? true : false" :overlay="false" :handle="isMobile ? true : false" :modal="false"
                v-model:open="chartDrawerOpen" class="pointer-events-auto"
                :ui="{ header: 'flex items-center justify-between', body: 'p-0', container: 'p-0 gap-0', content: 'max-w-4xl mx-auto', footer: 'gap-0' }">
                <UButton :size="isMobile ? 'xl' : 'md'" :label="isMobile ? null : 'Diagram'"
                  :variant="chartDrawerOpen ? 'subtle' : 'outline'" color="neutral" class="ring-muted"
                  icon="i-carbon-chart-line-smooth" />
                <template #body>
                  <ForestryChartMain ref="chartMainRef"
                    :parentSelectedFrameworks="isFrameworkCompareMode ? [currentFramework.value, currentFramework2.value] : [currentFramework.value]"
                    :currentTimeValue="currentTimeValue" :currentStartskog="currentStartskog.value" />
                  <div class="px-4 pb-4 text-xs text-muted">
                    Fugiat irure tempor nisi dolor. Sit irure reprehenderit sint est nostrud. Voluptate reprehenderit
                    amet
                    laboris non nostrud.
                  </div>
                </template>
              </UDrawer>
            </div> -->

        </div>


      </div>


    </div>


    <div class="ui-zoom-reapply relative flex flex-col flex-1 w-full">


      <div class="flex flex-1">
        <div class="absolute bottom-4 right-0 z-50 flex flex-col items-center">
          <UIcon name="i-mingcute-tree-fill" class="size-7 mb-3 text-primary" />
          <div class="flex items-center justify-center gap-2">

            <USlider orientation="vertical" :min="0" :max="1" :step="0.01" v-model="globalOpacity" class="h-28 w-full "
              color="primary" />
          </div>
          <UPopover>
            <div class="flex w-full mt-4">
              <UIcon name="i-fluent-shape-organic-16-filled" class="size-6 text-gray-300 z-20" />
              <UIcon name="i-fluent-shape-organic-16-filled" class="size-6 -ml-4 text-signal-400 z-10" />
              <UIcon name="i-fluent-shape-organic-16-filled" class="size-6 -ml-4 mr-4 text-yellow-400" />
            </div>
            <template #content>
              <div class="flex flex-col gap-2 p-4">
                <div class="flex w-full">
                  <UIcon name="i-fluent-shape-organic-16-filled" class="size-6 text-gray-300 z-20" />
                  <UIcon name="i-fluent-shape-organic-16-filled" class="size-6 -ml-4 text-gray-400 z-10" />
                  <UIcon name="i-fluent-shape-organic-16-filled" class="size-6 -ml-4 mr-4 text-gray-500" />
                  <h1 class="font-medium">Mykorrhizasvampar</h1>
                </div>
                <div class="flex w-full justify-between">
                  <UIcon name="i-fluent-shape-organic-16-filled" class="size-6 text-signal-400" />

                  <h1 class="font-medium">Naturvårdssvampar</h1>
                </div>
                <div class="flex w-full justify-between">
                  <UIcon name="i-fluent-shape-organic-16-filled" class="size-6 text-yellow-400" />

                  <h1 class="font-medium">Matsvampar</h1>
                </div>

              </div>
            </template>
          </UPopover>
        </div>

        <div v-if="pinnedOverlayBadges.length"
          class="space-y-1.5 sm:p-4 p-2 max-w-sm z-50 absolute top-28 right-0 transform-all text-end pointer-events-none">
          <template v-for="badge in pinnedOverlayBadges" :key="badge.key">
            <div class="pointer-events-auto flex flex-col sm:flex sm:flex-wrap gap-1 items-end">
              <UPopover :open-delay="500" :close-delay="300" mode="click" v-model:open="badgePopoverOpen[badge.key]"
                :popper="{ placement: 'bottom-end' }" :ui="{ content: 'p-0 w-80' }">
                <div>
                  <UBadge color="neutral" variant="outline" size="lg" :class="[
                    'cursor-pointer shadow-sm sm:ml-1.5 w-fit transition-opacity ring-muted/50',
                    (badge.key === 'staticOverlay' || isOverlayAssociatedAny(badge.key)) ? '' : 'opacity-50'
                  ]">

                    <div class="flex items-center gap-1">
                      <UIcon v-if="badge.icon" :name="badge.icon" class="size-5 text-primary-500" />
                      <span v-if="!isMobile">{{ badge.title }}</span>
                      <!-- <UIcon name="i-heroicons-x-mark" /> -->
                    </div>



                  </UBadge>
                </div>

                <template #content>
                  <div class="p-3 space-y-2">
                    <div class="flex w-full justify-between">
                      <div class="flex items-start gap-2">
                        <UIcon v-if="badge.icon" :name="badge.icon" class="size-5 text-primary-500 mt-0.5" />
                        <h3 class="text-sm font-semibold text-neutral-800">
                          {{ getOverlayInfo(badge.key).title || badge.title }}
                        </h3>
                      </div>
                      <UButton label="Ta bort" variant="subtle" color="error" size="xs" icon="i-tabler-pinned-off"
                        @click="togglePinned(badge.key), badgePopoverOpen[badge.key] = true" />
                    </div>

                    <p v-if="getOverlayInfo(badge.key).description" class="text-sm text-neutral-600 leading-relaxed">
                      {{ getOverlayInfo(badge.key).description }}
                    </p>
                    <div v-else class="text-xs text-neutral-400">Ingen beskrivning tillgänglig.</div>
                    <UButton v-if="badge.key === 'naturvardsarter'" size="sm" color="primary" variant="soft"
                      icon="i-carbon-chart-line-smooth" @click.stop="openNaturvardsarterChart({ badgeKey: badge.key })">
                      Visa naturvårdsartsdiagram
                    </UButton>
                    <UCard v-if="badge.key === 'kanteffekt'" variant="soft" :ui="{ body: 'sm:p-4 sm:pl-2' }"
                      class="mt-2 backdrop-blur-xl border border-white/10">
                      <USwitch :ui="{
                        root: 'flex-row-reverse justify-between',
                        label: '',
                        description: '',
                        base: 'data-[state=unchecked]:bg-neutral-600'
                      }" size="md" color="primary" v-model="oldKanteffektVisible" label="Tidigare kanteffekt"
                        description="Visa spår från tidigare kanteffekt" />
                    </UCard>
                  </div>
                </template>
              </UPopover>
            </div>
          </template>
        </div>

        <div :class="[
          'relative overflow-auto transition-all duration-300 ease-in-out ',
          menuOpen ? 'w-72 border-r border-neutral-300' : 'w-0'
        ]">
          <div class="absolute p-2 w-full" v-if="menuOpen">
            <div class="flex justify-between p-2 items-center mb-2">
              <h1 class="font-semibold text-lg">Inställningar</h1>

              <UButton :icon="menuOpen ? 'i-heroicons-chevron-left' : 'i-heroicons-chevron-right'" variant="outline"
                color="neutral" class="rounded-full left-4 z-10" @click="menuOpen = !menuOpen" />
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
                  <UButton color="neutral" variant="ghost" size="xs" :title="'Återställ (100%)'" @click="uiZoom = 1">
                    Reset
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
                    :ui="{ root: 'flex-row-reverse justify-between' }" color="primary" v-model="retentionVisible"
                    label="Hänsynsträd" />
                  <!-- Trakthygge, Luckhuggning, Skärmträd: Kanteffekt (+ old toggle) -->
                  <USwitch v-if="isTrakthygge || isLuckhuggning || isSkarmtrad"
                    :ui="{ root: 'flex-row-reverse justify-between' }" color="primary" v-model="kanteffektVisible"
                    label="Kanteffekt" />
                  <!-- Småplantor: show small white circles from public JSON -->
                  <USwitch :ui="{ root: 'flex-row-reverse justify-between' }" color="primary"
                    v-model="smaplantorVisible" label="Småplantor" />
                  <UCard v-if="(isLuckhuggning) && kanteffektVisible" variant="soft" :ui="{ body: 'sm:p-4 sm:pl-2' }">
                    <USwitch :ui="{ root: 'flex-row-reverse justify-between' }" size="xs" color="neutral"
                      v-model="oldKanteffektVisible" label="Tidigare kanteffekt" />
                  </UCard>
                  <!-- Skärmträd: Rottäcke skärmträd -->
                  <USwitch v-if="isSkarmtrad" :ui="{ root: 'flex-row-reverse justify-between' }" color="primary"
                    v-model="rottackeSkarmtradVisible" label="Rötter skärmträd" />
                  <!-- Blädning: Rottäcke blädning -->
                  <USwitch v-if="isBladning" :ui="{ root: 'flex-row-reverse justify-between' }" color="primary"
                    v-model="rottackeBladningVisible" label="Rötter blädning" />
                  <!-- Högstubbar: small black circles from public JSON -->
                  <USwitch :ui="{ root: 'flex-row-reverse justify-between' }" color="primary"
                    v-model="hogstubbarVisible" label="Högstubbar" />
                  <!-- Naturvårdsarter: visible for Trakthygge, Luckhuggning, Blädning, Skärmträd -->
                  <USwitch v-if="isTrakthygge || isLuckhuggning || isBladning || isSkarmtrad"
                    :ui="{ root: 'flex-row-reverse justify-between' }" color="primary" v-model="naturvardsarterVisible"
                    label="Naturvårdsarter" />
                  <USwitch v-if="isSkarmtrad" :ui="{ root: 'flex-row-reverse justify-between' }" color="primary"
                    v-model="seedTreeVisible" label="Fröträd" />
                  <USwitch :ui="{ root: 'flex-row-reverse justify-between' }" color="primary"
                    v-model="tradplantorVisible" label="Trädplantor" />
                  <!-- Dev: Save clicks -->
                  <USwitch :ui="{ root: 'flex-row-reverse justify-between' }" color="warning" v-model="devSaveClicks"
                    label="Spara klick (dev)" />
                  <USwitch :ui="{ root: 'flex-row-reverse justify-between' }" color="warning"
                    v-model="devOverlayLabelsVisible" label="Visa myc-etiketter (dev)" />
                  <USwitch :ui="{ root: 'flex-row-reverse justify-between' }" color="warning"
                    v-model="devNaturvardCounterVisible" label="Visa naturvårdssiffra (dev)" />

                </div>



              </div>

            </div>
          </div>
        </div>
        <div class="relative flex-1">
          <!-- <div class="absolute w-full bottom-0 z-50 p-1">
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
                    </div> -->


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
              :show-overlay-labels="devOverlayLabelsVisible" :show-naturvard-counter="devNaturvardCounterVisible"
              :seedTree-visible="seedTreeVisible" :rottacke-skarmtrad-visible="rottackeSkarmtradVisible"
              :rottacke-bladning-visible="rottackeBladningVisible" :retention-visible="retentionVisible"
              :old-kanteffekt-visible="oldKanteffektVisible" :kanteffekt-visible="kanteffektVisible"
              :retention-points="filteredOverlayData.retention" :seed-tree-points="filteredOverlayData.seedTree"
              :smaplantor-points="filteredOverlayData.smaplantor" :hogstubbar-points="filteredOverlayData.hogstubbar"
              :naturvardsarter-points="filteredOverlayData.naturvardsarter"
              :kanteffekt-features="filteredOverlayData.kanteffekt" :fullscreenLayout="true"
              :currentFramework="currentFramework" :currentTime="timeLabelForDataFiltering"
              :currentStartskog="currentStartskog" :layoutMode="currentLayoutMode" ref="singleViewerRef"
              :frameworkLabel="currentFramework.label" :timeLabel="currentTimeLabel" :dziUrl="currentImagePath"
              :overlayDziUrl="currentOverlayImagePath" :allowPan="true" :preload-dzi-urls="preloadUrlsFramework1"
              :annotations="annotationsVisible ? filteredAnnotations : []" :selectedAnnotation="selectedAnnotation"
              v-model:globalOpacity="globalOpacity" @annotationClicked="handleAnnotationClicked"
              class="w-full h-full ui-zoom-exempt " />
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
            :frameworkLabel2="currentFramework.label" :timeLabel2="currentTimeLabel" :layoutMode="currentLayoutMode">
            <template #first>
              <OpenSeadragonViewer :naturvardsarter-visible="naturvardsarterVisible"
                :retention-visible="retentionVisible" :kanteffekt-visible="kanteffektVisible"
                :old-kanteffekt-visible="oldKanteffektVisible" :rottacke-skarmtrad-visible="rottackeSkarmtradVisible"
                :rottacke-bladning-visible="rottackeBladningVisible" :seedTree-visible="seedTreeVisible"
                :smaplantor-visible="smaplantorVisible" :hogstubbar-visible="hogstubbarVisible"
                :tradplantor-visible="tradplantorVisible" :fullscreenLayout="true"
                :show-overlay-labels="devOverlayLabelsVisible" :show-naturvard-counter="devNaturvardCounterVisible"
                :retention-points="filteredBeforeOverlayData.retention"
                :seed-tree-points="filteredBeforeOverlayData.seedTree"
                :smaplantor-points="filteredBeforeOverlayData.smaplantor"
                :hogstubbar-points="filteredBeforeOverlayData.hogstubbar"
                :naturvardsarter-points="filteredBeforeOverlayData.naturvardsarter"
                :kanteffekt-features="filteredBeforeOverlayData.kanteffekt" :currentFramework="currentFramework"
                currentTime="innan" :currentStartskog="currentStartskog" :layoutMode="currentLayoutMode"
                ref="beforeViewerRef" :comparisonMode="true" :frameworkLabel="currentFramework.label"
                timeLabel="Före avverkning" :dziUrl="comparisonImagePath1" :overlayDziUrl="comparisonOverlayImagePath1"
                :allowPan="true" :preload-dzi-urls="preloadUrlsFramework1" @opened="onViewerOpened('before')"
                @activated="activeViewer.valueOf = 'before'" v-if="!opacitySyncEnabled" class="w-full h-full" />
              <OpenSeadragonViewer :naturvardsarter-visible="naturvardsarterVisible"
                :retention-visible="retentionVisible" :kanteffekt-visible="kanteffektVisible"
                :old-kanteffekt-visible="oldKanteffektVisible" :rottacke-skarmtrad-visible="rottackeSkarmtradVisible"
                :rottacke-bladning-visible="rottackeBladningVisible" :seedTree-visible="seedTreeVisible"
                :smaplantor-visible="smaplantorVisible" :hogstubbar-visible="hogstubbarVisible"
                :tradplantor-visible="tradplantorVisible" :fullscreenLayout="true"
                :show-overlay-labels="devOverlayLabelsVisible" :show-naturvard-counter="devNaturvardCounterVisible"
                :retention-points="filteredBeforeOverlayData.retention"
                :seed-tree-points="filteredBeforeOverlayData.seedTree"
                :smaplantor-points="filteredBeforeOverlayData.smaplantor"
                :hogstubbar-points="filteredBeforeOverlayData.hogstubbar"
                :naturvardsarter-points="filteredBeforeOverlayData.naturvardsarter"
                :kanteffekt-features="filteredBeforeOverlayData.kanteffekt" :currentFramework="currentFramework"
                currentTime="innan" :currentStartskog="currentStartskog" :layoutMode="currentLayoutMode"
                ref="beforeViewerRef" :comparisonMode="true" :frameworkLabel="currentFramework.label"
                timeLabel="Före avverkning" :dziUrl="comparisonImagePath1" :overlayDziUrl="comparisonOverlayImagePath1"
                :allowPan="true" :preload-dzi-urls="preloadUrlsFramework1" @opened="onViewerOpened('before')"
                @activated="activeViewer.valueOf = 'before'" v-else v-model:globalOpacity="globalOpacity"
                class="w-full h-full" />
            </template>
            <template #second>
              <OpenSeadragonViewer :naturvardsarter-visible="naturvardsarterVisible"
                :retention-visible="retentionVisible" :kanteffekt-visible="kanteffektVisible"
                :old-kanteffekt-visible="oldKanteffektVisible" :rottacke-skarmtrad-visible="rottackeSkarmtradVisible"
                :rottacke-bladning-visible="rottackeBladningVisible" :seedTree-visible="seedTreeVisible"
                :smaplantor-visible="smaplantorVisible" :hogstubbar-visible="hogstubbarVisible"
                :tradplantor-visible="tradplantorVisible" :fullscreenLayout="true"
                :show-overlay-labels="devOverlayLabelsVisible" :show-naturvard-counter="devNaturvardCounterVisible"
                :retention-points="filteredOverlayData.retention" :seed-tree-points="filteredOverlayData.seedTree"
                :smaplantor-points="filteredOverlayData.smaplantor" :hogstubbar-points="filteredOverlayData.hogstubbar"
                :naturvardsarter-points="filteredOverlayData.naturvardsarter"
                :kanteffekt-features="filteredOverlayData.kanteffekt" :currentFramework="currentFramework"
                :currentTime="timeLabelForDataFiltering" :currentStartskog="currentStartskog"
                :layoutMode="currentLayoutMode" ref="afterViewerRef" :comparisonMode="true"
                :frameworkLabel="currentFramework.label" :timeLabel="currentTimeLabel" :dziUrl="currentImagePath"
                :overlayDziUrl="comparisonOverlayImagePath2" :allowPan="true" sliderPosition="right"
                :preload-dzi-urls="preloadUrlsFramework1" @opened="onViewerOpened('after')"
                @activated="activeViewer.valueOf = 'after'" v-if="!opacitySyncEnabled" class="w-full h-full " />
              <OpenSeadragonViewer :naturvardsarter-visible="naturvardsarterVisible"
                :retention-visible="retentionVisible" :kanteffekt-visible="kanteffektVisible"
                :old-kanteffekt-visible="oldKanteffektVisible" :rottacke-skarmtrad-visible="rottackeSkarmtradVisible"
                :rottacke-bladning-visible="rottackeBladningVisible" :seedTree-visible="seedTreeVisible"
                :smaplantor-visible="smaplantorVisible" :hogstubbar-visible="hogstubbarVisible"
                :tradplantor-visible="tradplantorVisible" :fullscreenLayout="true"
                :show-overlay-labels="devOverlayLabelsVisible" :show-naturvard-counter="devNaturvardCounterVisible"
                :retention-points="filteredOverlayData.retention" :seed-tree-points="filteredOverlayData.seedTree"
                :smaplantor-points="filteredOverlayData.smaplantor" :hogstubbar-points="filteredOverlayData.hogstubbar"
                :naturvardsarter-points="filteredOverlayData.naturvardsarter"
                :kanteffekt-features="filteredOverlayData.kanteffekt" :currentFramework="currentFramework"
                :currentTime="timeLabelForDataFiltering" :currentStartskog="currentStartskog"
                :layoutMode="currentLayoutMode" ref="afterViewerRef" :comparisonMode="true"
                :frameworkLabel="currentFramework.label" :timeLabel="currentTimeLabel" :dziUrl="currentImagePath"
                :overlayDziUrl="comparisonOverlayImagePath2" :allowPan="true" sliderPosition="right"
                :preload-dzi-urls="preloadUrlsFramework1" @opened="onViewerOpened('after')"
                @activated="activeViewer.valueOf = 'after'" v-else v-model:globalOpacity="globalOpacity"
                class="w-full h-full  " />
            </template>
          </CustomImageComparisonSlider>

          <!-- Framework Compare -->
          <CustomImageComparisonSlider v-else-if="isFrameworkCompareMode" ref="comparisonSliderRef"
            :frameworkLabel="currentFramework.label" :timeLabel="currentTimeLabel"
            :frameworkLabel2="currentFramework2.label" :timeLabel2="currentTimeLabel" :layoutMode="currentLayoutMode"
            class="w-full">
            <template #first>
              <OpenSeadragonViewer :naturvardsarter-visible="naturvardsarterVisible"
                :retention-visible="retentionVisible" :kanteffekt-visible="kanteffektVisible"
                :old-kanteffekt-visible="oldKanteffektVisible" :rottacke-skarmtrad-visible="rottackeSkarmtradVisible"
                :rottacke-bladning-visible="rottackeBladningVisible" :seedTree-visible="seedTreeVisible"
                :smaplantor-visible="smaplantorVisible" :hogstubbar-visible="hogstubbarVisible"
                :tradplantor-visible="tradplantorVisible" :fullscreenLayout="true"
                :show-overlay-labels="devOverlayLabelsVisible" :show-naturvard-counter="devNaturvardCounterVisible"
                :retention-points="filteredOverlayData.retention" :seed-tree-points="filteredOverlayData.seedTree"
                :smaplantor-points="filteredOverlayData.smaplantor" :hogstubbar-points="filteredOverlayData.hogstubbar"
                :naturvardsarter-points="filteredOverlayData.naturvardsarter"
                :kanteffekt-features="filteredOverlayData.kanteffekt" :currentFramework="currentFramework"
                :currentTime="timeLabelForDataFiltering" :currentStartskog="currentStartskog"
                :layoutMode="currentLayoutMode" ref="framework1ViewerRef" :comparisonMode="true"
                :frameworkLabel="currentFramework.label" :timeLabel="currentTimeLabel" :dziUrl="currentImagePath"
                :overlayDziUrl="frameworkOverlayImagePath1" :allowPan="!isCompare && !isFrameworkCompareMode"
                :preload-dzi-urls="preloadUrlsFramework1" v-if="!opacitySyncEnabled"
                @viewportChanged="($event) => onViewportChanged('framework1', $event)"
                @opened="onViewerOpened('framework1')" @activated="activeViewer.valueOf = 'framework1'"
                class="w-full h-full" />
              <OpenSeadragonViewer :naturvardsarter-visible="naturvardsarterVisible"
                :retention-visible="retentionVisible" :kanteffekt-visible="kanteffektVisible"
                :old-kanteffekt-visible="oldKanteffektVisible" :rottacke-skarmtrad-visible="rottackeSkarmtradVisible"
                :rottacke-bladning-visible="rottackeBladningVisible" :seedTree-visible="seedTreeVisible"
                :smaplantor-visible="smaplantorVisible" :hogstubbar-visible="hogstubbarVisible"
                :tradplantor-visible="tradplantorVisible" :fullscreenLayout="true"
                :show-overlay-labels="devOverlayLabelsVisible" :show-naturvard-counter="devNaturvardCounterVisible"
                :retention-points="filteredOverlayData.retention" :seed-tree-points="filteredOverlayData.seedTree"
                :smaplantor-points="filteredOverlayData.smaplantor" :hogstubbar-points="filteredOverlayData.hogstubbar"
                :naturvardsarter-points="filteredOverlayData.naturvardsarter"
                :kanteffekt-features="filteredOverlayData.kanteffekt" :currentFramework="currentFramework"
                :currentTime="timeLabelForDataFiltering" :currentStartskog="currentStartskog"
                :layoutMode="currentLayoutMode" ref="framework1ViewerRef" :comparisonMode="true"
                :frameworkLabel="currentFramework.label" :timeLabel="currentTimeLabel" :dziUrl="currentImagePath"
                :overlayDziUrl="frameworkOverlayImagePath1" :allowPan="!isCompare && !isFrameworkCompareMode"
                :preload-dzi-urls="preloadUrlsFramework1" v-else v-model:globalOpacity="globalOpacity"
                @viewportChanged="($event) => onViewportChanged('framework1', $event)"
                @opened="onViewerOpened('framework1')" @activated="activeViewer.valueOf = 'framework1'"
                class="w-full h-full" />
            </template>
            <template #second>
              <OpenSeadragonViewer :naturvardsarter-visible="naturvardsarterVisible"
                :retention-visible="retentionVisible" :kanteffekt-visible="kanteffektVisible"
                :old-kanteffekt-visible="oldKanteffektVisible" :rottacke-skarmtrad-visible="rottackeSkarmtradVisible"
                :rottacke-bladning-visible="rottackeBladningVisible" :seedTree-visible="seedTreeVisible"
                :smaplantor-visible="smaplantorVisible" :hogstubbar-visible="hogstubbarVisible"
                :tradplantor-visible="tradplantorVisible" :fullscreenLayout="true"
                :show-overlay-labels="devOverlayLabelsVisible" :show-naturvard-counter="devNaturvardCounterVisible"
                :retention-points="filteredOverlayDataFramework2.retention"
                :seed-tree-points="filteredOverlayDataFramework2.seedTree"
                :smaplantor-points="filteredOverlayDataFramework2.smaplantor"
                :hogstubbar-points="filteredOverlayDataFramework2.hogstubbar"
                :naturvardsarter-points="filteredOverlayDataFramework2.naturvardsarter"
                :kanteffekt-features="filteredOverlayDataFramework2.kanteffekt" :currentFramework="currentFramework2"
                :currentTime="timeLabelForDataFiltering" :currentStartskog="currentStartskog"
                :layoutMode="currentLayoutMode" ref="framework2ViewerRef" :comparisonMode="true"
                :frameworkLabel="currentFramework2.label" :timeLabel="currentTimeLabel" :dziUrl="currentImagePath2"
                :overlayDziUrl="frameworkOverlayImagePath2" v-if="!opacitySyncEnabled"
                :preload-dzi-urls="preloadUrlsFramework2" :allowPan="!isCompare && !isFrameworkCompareMode"
                sliderPosition="right" @viewportChanged="($event) => onViewportChanged('framework2', $event)"
                @opened="onViewerOpened('framework2')" @activated="activeViewer.valueOf = 'framework2'"
                class="w-full h-full" />
              <OpenSeadragonViewer :naturvardsarter-visible="naturvardsarterVisible"
                :retention-visible="retentionVisible" :kanteffekt-visible="kanteffektVisible"
                :old-kanteffekt-visible="oldKanteffektVisible" :rottacke-skarmtrad-visible="rottackeSkarmtradVisible"
                :rottacke-bladning-visible="rottackeBladningVisible" :seedTree-visible="seedTreeVisible"
                :smaplantor-visible="smaplantorVisible" :hogstubbar-visible="hogstubbarVisible"
                :tradplantor-visible="tradplantorVisible" :fullscreenLayout="true"
                :show-overlay-labels="devOverlayLabelsVisible" :show-naturvard-counter="devNaturvardCounterVisible"
                :retention-points="filteredOverlayDataFramework2.retention"
                :seed-tree-points="filteredOverlayDataFramework2.seedTree"
                :smaplantor-points="filteredOverlayDataFramework2.smaplantor"
                :hogstubbar-points="filteredOverlayDataFramework2.hogstubbar"
                :naturvardsarter-points="filteredOverlayDataFramework2.naturvardsarter"
                :kanteffekt-features="filteredOverlayDataFramework2.kanteffekt" :currentFramework="currentFramework2"
                :currentTime="timeLabelForDataFiltering" :currentStartskog="currentStartskog"
                :layoutMode="currentLayoutMode" ref="framework2ViewerRef" :comparisonMode="true"
                :frameworkLabel="currentFramework2.label" :timeLabel="currentTimeLabel" :dziUrl="currentImagePath2"
                :overlayDziUrl="frameworkOverlayImagePath2" v-else v-model:globalOpacity="globalOpacity"
                :preload-dzi-urls="preloadUrlsFramework2" :allowPan="!isCompare && !isFrameworkCompareMode"
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
                <UPopover :ui="{ content: 'bg-neutral-950/50 backdrop-blur-2xl ring-neutral-900/50' }" destroy-on-close
                  :content="{
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
                <UPopover :ui="{ content: 'bg-neutral-950/50 backdrop-blur-2xl ring-neutral-900/50' }" destroy-on-close
                  :content="{
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
                <UPopover :ui="{ content: 'bg-neutral-950/50 backdrop-blur-2xl ring-neutral-900/50' }" destroy-on-close
                  :content="{
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
                <UPopover :ui="{ content: 'bg-neutral-950/50 backdrop-blur-2xl ring-neutral-900/50' }" destroy-on-close
                  :content="{
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
                  class="w-full text-white hover:bg-neutral-500/20 flex justify-end" trailing :label="nextTitle"
                  icon="i-heroicons-arrow-right-circle" />
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
import { ref, computed, watch, onMounted, onBeforeUnmount, onUnmounted, reactive, nextTick } from "vue";
import type { Ref } from "vue";
import { useRuntimeConfig } from '#imports';
import { useAsyncData } from '#app';
let removeShortcutsFn;
import { useOnboardingStore } from "~/stores/onboardingStore";
import annotationsData from "public/annotations.json";
import { useSelectedAnnotationStore } from "~/stores/selectedAnnotationStore";
import { useOverlayStore } from "~/stores/overlayStore";
import { useMediaQuery, createReusableTemplate } from '@vueuse/core'
import { useOverlayRegistry } from '~/composables/useOverlayRegistry';
import { useOverlayPopover } from '~/composables/useOverlayPopover';
// Popover open state per badge key (for hover behavior)
const badgePopoverOpen = reactive<Record<string, boolean>>({});

const overlayRegistry = useOverlayRegistry();
const { hide: hideOverlayPopover } = useOverlayPopover();

const chartMainRef = ref<null | { setSelectedChart?: (value: string) => void }>(null);
const NATURVARDSARTER_CHART_VALUE = 'rodlistade';

function fwToString(fw: any): string | null {
  if (!fw) return null;
  if (typeof fw === 'string') return fw;
  if (typeof fw === 'object') {
    // common shapes we use throughout the app
    if ('value' in fw && typeof (fw as any).value === 'string') return (fw as any).value;
    if ('framework' in fw && typeof (fw as any).framework === 'string') return (fw as any).framework;
    if ('label' in fw && typeof (fw as any).label === 'string') return (fw as any).label;
  }
  return String(fw ?? '');
}

// Map overlay key -> visibility ref getter
const overlayToggleMap: Record<string, () => boolean> = {
  retention: () => !!retentionVisible.value,
  kanteffekt: () => !!kanteffektVisible.value,
  rottackeSkarmtrad: () => !!rottackeSkarmtradVisible.value,
  rottackeBladning: () => !!rottackeBladningVisible.value,
  seedTree: () => !!seedTreeVisible.value,
  smaplantor: () => !!smaplantorVisible.value,
  hogstubbar: () => !!hogstubbarVisible.value,
  naturvardsarter: () => !!naturvardsarterVisible.value,
  tradplantor: () => !!tradplantorVisible.value,
};

function isOverlayVisibleInContext(overlayKey: string, ctx: { framework: any, startskog?: any, time?: any }): boolean {
  // 1) Toggle must be ON
  const getter = overlayToggleMap[overlayKey];
  if (getter && !getter()) return false;
  // 2) Special-case split rottäcke overlays to base association on framework/time
  const fw = fwToString(ctx.framework) || '';
  const time = typeof ctx.time === 'string' ? ctx.time : fwToString(ctx.time);
  if (overlayKey === 'rottackeSkarmtrad') {
    return (fw === 'skärmträd' || fw === 'skarmtrad') && time === 'efter';
  }
  if (overlayKey === 'rottackeBladning') {
    if (!(fw === 'blädning' || fw === 'bladning')) return false;
    return time === 'efter' || time === '20 år' || time === '50 år' || time === '80 år';
  }
  // 3) Data must be available for the given context
  try {
    const avail = overlayRegistry.availabilityFor({
      framework: fw,
      startskog: fwToString(ctx.startskog),
      time,
    });
    return !!(avail && (avail as any)[overlayKey]);
  } catch (_) {
    return false;
  }
}

const activeContexts = computed(() => {
  const ctxs: Array<{ framework: any, startskog?: any, time?: any }> = [];
  const fw1 = fwToString((currentFramework as any)?.value ?? currentFramework);
  const fw2 = fwToString((currentFramework2 as any)?.value ?? currentFramework2);
  const skog = (currentStartskog as any)?.value ?? currentStartskog;
  const timeNow = (timeLabelForDataFiltering as any);

  if (isCompare.value) {
    // Before/After: same framework, two times
    ctxs.push({ framework: fw1, startskog: skog?.value ?? skog, time: 'innan' });
    ctxs.push({ framework: fw1, startskog: skog?.value ?? skog, time: timeNow });
  } else if (isFrameworkCompareMode.value) {
    // Framework compare: two frameworks, same time
    ctxs.push({ framework: fw1, startskog: skog?.value ?? skog, time: timeNow });
    ctxs.push({ framework: fw2, startskog: skog?.value ?? skog, time: timeNow });
  } else {
    // Single
    ctxs.push({ framework: fw1, startskog: skog?.value ?? skog, time: timeNow });
  }
  return ctxs;
});

function isOverlayAssociatedAny(overlayKey: string): boolean {
  const ctxs = activeContexts.value;
  for (const ctx of ctxs) {
    if (isOverlayVisibleInContext(overlayKey, ctx)) return true;
  }
  return false;
}

const [DefineSettingsTemplate, reuseSettingsTemplate] = createReusableTemplate()
const isMobile = useMediaQuery('(max-width: 767px)')
const panelTabs = [
  {
    label: 'Text',
    icon: 'i-heroicons-book-open',
    slot: 'text',
    value: 'text',
  },
  {
    label: 'Markörer',
    icon: 'i-material-symbols-location-on',
    slot: 'markers',
    value: 'markers',
  },
  {
    label: 'Diagram',
    icon: 'i-carbon-chart-line-smooth',
    slot: 'diagram',
    value: 'diagram',
  }
]

const {
  public: {
    dziBaseUrl: runtimeDziBaseUrl = 'https://assets.svampskog.se/dzi_v3',
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
const devOverlayLabelsVisible = ref(false);
const devNaturvardCounterVisible = ref(false);
const retentionVisible = ref(false);
const kanteffektVisible = ref(false);
const oldKanteffektVisible = ref(false);
const naturvardsarterVisible = ref(false);
const rottackeSkarmtradVisible = ref(false);
const rottackeBladningVisible = ref(false);
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

// Overlay tracking helpers
const overlayKeys = ['retention', 'kanteffekt', 'rottackeSkarmtrad', 'rottackeBladning', 'seedTree', 'smaplantor', 'hogstubbar', 'naturvardsarter', 'tradplantor'] as const;
type OverlayKey = typeof overlayKeys[number];

const overlayOrder = ref<OverlayKey[]>([]);

function updateOverlayOrder(key: OverlayKey, visible: boolean) {
  const order = overlayOrder.value;
  const idx = order.indexOf(key);
  if (visible) {
    if (idx !== -1) order.splice(idx, 1);
    order.push(key);
  } else if (idx !== -1) {
    order.splice(idx, 1);
  }
}

const overlayStore = useOverlayStore();
const staticOverlayVisible = computed({
  get: () => overlayStore.staticOverlayVisible,
  set: (value) => overlayStore.setStaticOverlayVisible(value),
});
function toggleOverlay() {
  overlayStore.toggleStaticOverlay();
}

const overlayDrawerOpen = ref(false);
const overlayDrawerPending = ref(false);
const activeOverlayKey = ref<string | null>(null);
const textDrawerOpen = ref(false);
const chartDrawerOpen = ref(false);
const persistedChartKey = ref<string>('skogsskole');
const pendingSelectNaturvardsarter = ref(false);

// Centralized Information drawer state (tabs: 'text' | 'diagram')
const infoDrawerOpen = ref(false);
const infoActiveTab = ref<'text' | 'diagram'>('text');

function showDiagramTab() {
  infoActiveTab.value = 'diagram';
  infoDrawerOpen.value = true;
  // Close desktop text popover if open for a clean transition
  try {
    if (!isMobile.value) {
      hideOverlayPopover?.();
    }
  } catch { }
}

function showTextTab() {
  infoActiveTab.value = 'text';
  infoDrawerOpen.value = true;
}
const open = computed({
  get: () => infoDrawerOpen.value,
  set: (val: boolean) => {
    infoDrawerOpen.value = val;
  }
}) as Ref<boolean>;
const open2 = ref(false);
const open3 = computed({
  get: () => chartDrawerOpen.value,
  set: (val: boolean) => {
    chartDrawerOpen.value = val;
  }
}) as Ref<boolean>;

// somewhere after your other refs:
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
  { re: /skärmträdens rötter/gi, overlay: 'rottackeSkarmtrad' },
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
  // Add a delegated action link for opening the diagram tab
  html = html.replace(/Visa\s+naturvårdsdiagram/gi, () => (
    '<a href="#" data-action="show-diagram">Visa naturvårdsdiagram</a>'
  ));
  for (const rule of CLICK_RULES) {
    html = html.replace(rule.re, (m) =>
      `<span class=\" text-primary-500 font-medium underline cursor-pointer hover:opacity-80\" data-overlay=\"${rule.overlay}\">${m}</span>`
    );
  }
  return html;
}

const overlayKeySet = new Set<OverlayKey>(overlayKeys);
const isOverlayKeyString = (value: string | null): value is OverlayKey =>
  typeof value === 'string' && overlayKeySet.has(value as OverlayKey);

function handleTimelineClick(evt: MouseEvent) {
  // First: delegated actions coming from v-html (e.g., <a data-action="show-diagram">)
  const el = (evt.target as HTMLElement | null);
  if (!el) return;

  const actionEl = el.closest('[data-action]') as HTMLElement | null;
  if (actionEl) {
    const action = actionEl.getAttribute('data-action');
    if (action === 'show-diagram') {
      evt.preventDefault();
      openNaturvardsarterChart();
      return;
    }
  }

  // Then: existing overlay trigger handling
  const target = el.closest('[data-overlay]') as HTMLElement | null;
  if (!target) return;
  const key = target.getAttribute('data-overlay');
  if (!isOverlayKeyString(key)) return;

  handleOverlayTrigger(key);
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
const globalOpacity = ref(1);

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

function timeLabelsForFrameworkValue(frameworkValue) {
  if (!frameworkValue) return [];
  const labels = ["före", "efter"];
  if (frameworkValue === "skärmträd" && !isFrameworkCompareMode.value) {
    labels.push("10");
  }
  labels.push("20", "50", "80");
  return labels;
}

function buildPreloadUrlsForFramework(frameworkValue) {
  if (!frameworkValue) return [];
  const startskogVal = currentStartskog.value?.value;
  if (!startskogVal) return [];
  const fungiVisibility = showFungi.value ? "visa" : "dölj";
  const labels = timeLabelsForFrameworkValue(frameworkValue);
  const urls = [];
  for (const timeLabel of labels) {
    urls.push(buildDziUrl({
      framework: frameworkValue,
      timeLabel,
      fungiVisibility,
      treeVisibility: "dölj",
      startskog: startskogVal,
    }));
  }
  return Array.from(new Set(urls));
}

const preloadUrlsFramework1 = computed(() =>
  buildPreloadUrlsForFramework(currentFramework.value?.value)
);
const preloadUrlsFramework2 = computed(() =>
  buildPreloadUrlsForFramework(currentFramework2.value?.value)
);

watch([isFrameworkCompareMode, isCompare], ([frameworkCompare, compare]) => {
  if (!frameworkCompare || !compare) {
    compareChoice.value = "framework1";
  }
});

onMounted(() => {
  removeShortcutsFn = defineShortcuts({
    o: () => (open.value = !open.value),
    n: () => {
      naturvardsarterVisible.value = !naturvardsarterVisible.value;
    },
  });
});

onBeforeUnmount(() => {
  if (typeof removeShortcutsFn === "function") {
    removeShortcutsFn();
  }
  if (overlayCloseTimer) {
    clearTimeout(overlayCloseTimer);
    overlayCloseTimer = null;
  }
  overlayCloseRequested = false;
  overlayCloseShouldHide = true;
});

// Function to handle selecting an option
const selectOption = (option) => {
  const newIndex = startskog.findIndex((o) => o.value === option.value);
  if (newIndex !== -1) {
    selectedStartskogIndex.value = newIndex;
  }
  open2.value = false;
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
  { label: "Inte kalavverkad", value: "naturskog" },
  { label: "Kalavverkad", value: "produktionsskog_" },
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

const currentFwValue = computed(() => currentFramework.value?.value);
const currentStartskogValue = computed(() => currentStartskog.value?.value ?? null);
const isTrakthygge = computed(() => currentFwValue.value === 'trakthygge');
const isLuckhuggning = computed(() => currentFwValue.value === 'luckhuggning');
const isBladning = computed(() => currentFwValue.value === 'blädning' || currentFwValue.value === 'bladning');
const isSkarmtrad = computed(() => currentFwValue.value === 'skärmträd' || currentFwValue.value === 'skarmtrad');

type OverlayContentConfig = {
  title: string;
  description: string;
  condition: () => boolean;
  close: () => void;
};

const overlayConfigs: Record<OverlayKey, OverlayContentConfig> = {
  retention: {
    title: 'Hänsynsträd',
    description: 'De flesta mykorrhizasvamparna som växte med trädens rötter före avverkningen finns kvar och lever vidare. Mycel kan växa in i och spridas till uppväxande trädplantor.',
    condition: () => retentionVisible.value && (currentFwValue.value !== 'naturskydd'),
    close: () => { retentionVisible.value = false },
  },
  kanteffekt: {
    title: 'Kanteffekt',
    description: 'Mykorrhizasvamp på trädens rötter i skogskanten kan sträcka sig 10–15 meter in på hygget; starkast närmast kanten.',
    condition: () => kanteffektVisible.value && (isTrakthygge.value || isLuckhuggning.value || isSkarmtrad.value),
    close: () => { kanteffektVisible.value = false },
  },
  rottackeSkarmtrad: {
    title: 'Rottäcke skärmträd',
    description: 'Kontinuerligt rottäcke kopplat till överhållen skärm (1 år efter).',
    condition: () => rottackeSkarmtradVisible.value && isSkarmtrad.value,
    close: () => { rottackeSkarmtradVisible.value = false },
  },
  rottackeBladning: {
    title: 'Rottäcke blädning',
    description: 'Kontinuerligt rottäcke kopplat till blädning (efter, 20, 50, 80 år).',
    condition: () => rottackeBladningVisible.value && isBladning.value,
    close: () => { rottackeBladningVisible.value = false },
  },
  seedTree: {
    title: 'Fröträd',
    description: 'Mycel fortsätter leva på fröträdens rötter och kan koppla till nya plantor.',
    condition: () => seedTreeVisible.value && isSkarmtrad.value,
    close: () => { seedTreeVisible.value = false },
  },
  smaplantor: {
    title: 'Yngre träd och plantor som lämnats',
    description: 'Undviks underröjning före avverkning, kommer mykorrhizasvampar att överleva på dessa plantor och träd på samma sätt som de gör på rötterna av hänsynsträd.',
    condition: () => smaplantorVisible.value,
    close: () => { smaplantorVisible.value = false },
  },
  hogstubbar: {
    title: 'Högstubbar',
    description: 'Här finns inga levande mykorrhizamycel. Trädets rötter är döda.',
    condition: () => hogstubbarVisible.value,
    close: () => { hogstubbarVisible.value = false },
  },
  naturvardsarter: {
    title: 'Naturvårdsarter',
    description: 'Naturvårdsarter har ofta speciella miljökrav, och förekommer främst i äldre skog. Generellt kan mycel av mykorrhizasvampar leva vidare på en plats så länge det finns levande träd. Svampindividers mycel kan likt träd bli många decennier till potentiellt sekler gamla.',
    condition: () => naturvardsarterVisible.value && (isTrakthygge.value || isLuckhuggning.value || isBladning.value || isSkarmtrad.value),
    close: () => { naturvardsarterVisible.value = false },
  },
  tradplantor: {
    title: 'Planterade små trädplantor',
    description: 'Har med sig spontant etablerad mykorrhiza från plantskolan där de odlades upp. Det är dock få arter. Dessa ersätts succesivt med bättre anpassade och svamparter som finns på platsen.',
    condition: () => tradplantorVisible.value && isTrakthygge.value,
    close: () => { tradplantorVisible.value = false },
  },
};

const overlayIcons: Record<string, string> = {
  staticOverlay: 'i-material-symbols-light-rectangle-outline',
  retention: 'i-pepicons-pop-tree-circle',
  kanteffekt: 'i-healthicons-square-medium-negative',
  rottackeSkarmtrad: 'i-fluent-emoji-high-contrast-blue-square',
  rottackeBladning: 'i-fluent-emoji-high-contrast-blue-square',
  seedTree: 'i-teenyicons-redwoodjs-outline',
  smaplantor: 'i-pepicons-pop-seedling-circle',
  hogstubbar: 'i-roentgen-wood',
  naturvardsarter: 'i-material-symbols-award-star-outline',
  tradplantor: 'i-hugeicons-plant-02',
};

const overlayInfo = computed<Record<string, { title: string; description: string }>>(() => {
  const info: Record<string, { title: string; description: string }> = {
    staticOverlay: {
      title: 'Beståndsgräns',
      description: 'Visar gränsen för den berörda skogen',
    },
  };

  overlayKeys.forEach((key) => {
    const config = overlayConfigs[key];
    info[key] = {
      title: config.title,
      description: config.description,
    };
  });

  return info;
});

function getOverlayInfo(key: string): { title: string; description: string; icon?: string } {
  const info = overlayInfo.value[key] ?? { title: key, description: '' };
  const icon = overlayIcons[key];
  return {
    title: info.title,
    description: info.description,
    icon,
  };
}

// Pin states for overlays (pinned overlays remain visible when others are toggled on)
const pinned = reactive({
  staticOverlay: false,
  retention: false,
  kanteffekt: false,
  rottackeSkarmtrad: false,
  rottackeBladning: false,
  seedTree: false,
  smaplantor: false,
  hogstubbar: false,
  naturvardsarter: false,
  tradplantor: false,
});

const overlayRefMap = {
  staticOverlay: staticOverlayVisible,
  retention: retentionVisible,
  kanteffekt: kanteffektVisible,
  rottackeSkarmtrad: rottackeSkarmtradVisible,
  rottackeBladning: rottackeBladningVisible,
  seedTree: seedTreeVisible,
  smaplantor: smaplantorVisible,
  hogstubbar: hogstubbarVisible,
  naturvardsarter: naturvardsarterVisible,
  tradplantor: tradplantorVisible,
} as const;

type OverlayMapKey = keyof typeof overlayRefMap;

const isDrawerOverlayKey = (key: OverlayMapKey): key is OverlayKey => true;

function togglePinned(rawKey: OverlayMapKey, options: { hideWhenUnpin?: boolean } = {}) {
  const ref = overlayRefMap[rawKey];
  if (!ref) return;

  const key = rawKey as OverlayKey;
  const hideWhenUnpin = options.hideWhenUnpin ?? true;
  const next = !pinned[key];
  pinned[key] = next;

  if (next) {
    if (!ref.value) ref.value = true;
    activeOverlayKey.value = key;
    return;
  }

  if (hideWhenUnpin) {
    if (activeOverlayKey.value === key) {
      closeActiveOverlay({ hideOverlay: true });
    } else if (ref.value) {
      ref.value = false;
    }
  }
}

const normalizeFrameworkKey = (value?: string | null) => {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

const visibleFrameworkKeys = computed(() => {
  const set = new Set<string>();
  const add = (fw?: string | null) => {
    const key = normalizeFrameworkKey(fw);
    if (key) set.add(key);
  };
  add(currentFramework.value?.value);
  if (isFrameworkCompareMode.value) {
    add(currentFramework2.value?.value);
  }
  return set;
});

const overlayFrameworkRules: Record<string, 'all' | string[]> = {
  staticOverlay: 'all',
  naturvardsarter: 'all',
  retention: ['trakthygge', 'luckhuggning', 'skarmtrad', 'bladning'],
  kanteffekt: ['trakthygge', 'luckhuggning', 'skarmtrad'],
  tradplantor: ['trakthygge'],
  smaplantor: ['trakthygge'],
  hogstubbar: ['trakthygge'],
  rottackeBladning: ['bladning'],
  rottackeSkarmtrad: ['skarmtrad'],
  seedTree: ['skarmtrad'],
};

function overlayAllowedForFramework(key: string) {
  const rule = overlayFrameworkRules[key];
  if (!rule || rule === 'all') return true;
  const visible = visibleFrameworkKeys.value;
  if (!visible.size) return true;
  return rule.some(fw => visible.has(fw));
}

const overlayBadgeItems = computed(() => {
  const info = overlayInfo.value;
  const items: Array<{ key: string; label: string; description: string; icon?: string }> = [];
  if (overlayAllowedForFramework('staticOverlay')) {
    items.push({
      key: 'staticOverlay',
      label: info.staticOverlay?.title ?? 'Beståndsgräns',
      description: info.staticOverlay?.description ?? '',
      icon: overlayIcons.staticOverlay,
    });
  }
  overlayKeys.forEach((key) => {
    if (!overlayAllowedForFramework(key)) return;
    items.push({
      key,
      label: info[key]?.title ?? key,
      description: info[key]?.description ?? '',
      icon: overlayIcons[key] ?? undefined,
    });
  });
  return items;
});

const overlayMeta = computed<Record<string, { label: string; icon?: string }>>(() => {
  const meta: Record<string, { label: string; icon?: string }> = {
    staticOverlay: {
      label: overlayInfo.value.staticOverlay?.title ?? 'Beståndsgräns',
      icon: overlayIcons.staticOverlay,
    },
  };
  overlayKeys.forEach((key) => {
    meta[key] = {
      label: overlayConfigs[key].title,
      icon: overlayIcons[key] ?? undefined,
    };
  });
  // Override with filtered badge labels/icons
  overlayBadgeItems.value.forEach(item => {
    meta[item.key] = { label: item.label, icon: item.icon };
  });
  return meta;
})

const activeOverlayContent = computed(() => {
  const key = activeOverlayKey.value;
  if (!key) return null;
  if (!isOverlayActive(key)) return null;
  const info = getOverlayInfo(key);
  return { key, title: info.title, description: info.description };
});

const activeOverlayPinned = computed(() => {
  const key = activeOverlayKey.value;
  return key ? pinned[key] : false;
});

const activeOverlayIcon = computed(() => {
  const key = activeOverlayKey.value;
  return key ? overlayMeta.value[key]?.icon ?? null : null;
})

const pinnedOverlayBadges = computed(() => {
  const meta = overlayMeta.value;
  const availability = overlayAvailability.value;

  const items: Array<{ key: string; title: string; icon: string | null; isAssociated: boolean }> = [];

  // Include static overlay when pinned
  if (pinned.staticOverlay) {
    items.push({
      key: 'staticOverlay',
      title: meta.staticOverlay?.label ?? 'Beståndsgräns',
      icon: meta.staticOverlay?.icon || null,
      isAssociated: true,
    });
  }

  // Include all other overlays
  overlayKeys.forEach((key) => {
    if (!pinned[key]) return;
    items.push({
      key,
      title: meta[key]?.label ?? overlayConfigs[key].title,
      icon: meta[key]?.icon || null,
      isAssociated: availability[key] ?? true,
    });
  });

  return items;
});

watch(infoDrawerOpen, (isOpen) => {
  if (isOpen && chartDrawerOpen.value) {
    chartDrawerOpen.value = false;
  }
});

watch(chartDrawerOpen, (isOpen) => {
  if (isOpen && infoDrawerOpen.value) {
    infoDrawerOpen.value = false;
  }
});

const OVERLAY_DRAWER_CLOSE_DELAY = 220;
let overlayCloseTimer: ReturnType<typeof setTimeout> | null = null;
let overlayCloseShouldHide = true;
let overlayCloseRequested = false;

function toggleOverlayBadge(key: OverlayMapKey) {
  togglePinned(key);
}

function enforceExclusive(activeKey: keyof typeof overlayRefMap) {
  (Object.keys(overlayRefMap) as Array<keyof typeof overlayRefMap>).forEach((key) => {
    if (key === activeKey) return;
    if (pinned[key]) return;
    if (overlayRefMap[key]?.value) overlayRefMap[key].value = false;
  });
}

function isOverlayActive(key: OverlayKey) {
  const config = overlayConfigs[key];
  return !!config && config.condition();
}

function handleOverlayStateChange(key: OverlayKey) {
  const visible = isOverlayActive(key);
  updateOverlayOrder(key, visible);

  if (visible) {
    activeOverlayKey.value = key;
    if (overlayDrawerPending.value) {
      overlayDrawerOpen.value = true;
      overlayDrawerPending.value = false;
      if (!isMobile.value) {
        hideOverlayPopover();
      }
    }
    return;
  }

  if (activeOverlayKey.value === key) {
    const fallback = overlayOrder.value.slice().reverse().find((candidate) => isOverlayActive(candidate));
    if (fallback) {
      activeOverlayKey.value = fallback;
      if (overlayDrawerPending.value) {
        overlayDrawerOpen.value = true;
        overlayDrawerPending.value = false;
        if (!isMobile.value) {
          hideOverlayPopover();
        }
      }
    } else {
      closeActiveOverlay({ hideOverlay: false });
      hideOverlayPopover();
    }
  }
}

function handleOverlayTrigger(key: OverlayKey) {
  const ref = overlayRefMap[key];
  if (!ref) return;

  overlayDrawerPending.value = true;
  if (!ref.value) {
    ref.value = true;
    return;
  }
  activeOverlayKey.value = key;
  overlayDrawerOpen.value = true;
  overlayDrawerPending.value = false;
  hideOverlayPopover();
}

async function openNaturvardsarterChart(options: { badgeKey?: string } = {}) {
  showDiagramTab();
  persistedChartKey.value = NATURVARDSARTER_CHART_VALUE;
  pendingSelectNaturvardsarter.value = true;
  await nextTick();
  if (chartMainRef.value?.setSelectedChart) {
    chartMainRef.value.setSelectedChart(NATURVARDSARTER_CHART_VALUE);
    pendingSelectNaturvardsarter.value = false;
  }
  if (options.badgeKey) {
    badgePopoverOpen[options.badgeKey] = false;
  }
  if (!isMobile.value) {
    hideOverlayPopover();
  }
  // Close overlay info drawer to focus on the diagram
  try {
    closeActiveOverlay({ hideOverlay: false });
  } catch { }
  // Pin and show the Naturvårdsarter overlay without reopening the info drawer
  try {
    pinned.naturvardsarter = true;
    const ref = overlayRefMap.naturvardsarter;
    if (ref && !ref.value) ref.value = true;
  } catch { }
}

watch([infoActiveTab, () => chartMainRef.value], async ([tab, refInst]) => {
  if (tab === 'diagram' && pendingSelectNaturvardsarter.value && refInst?.setSelectedChart) {
    await nextTick();
    try {
      refInst.setSelectedChart(NATURVARDSARTER_CHART_VALUE);
    } finally {
      pendingSelectNaturvardsarter.value = false;
    }
  }
});

function openOverlayDrawer(key: OverlayKey) {
  const ref = overlayRefMap[key];
  if (!ref) return;
  activeOverlayKey.value = key;
  overlayDrawerOpen.value = true;
  overlayDrawerPending.value = false;
  hideOverlayPopover();
}

function closeActiveOverlay(options: { hideOverlay?: boolean } = {}) {
  overlayCloseRequested = true;
  const key = activeOverlayKey.value;
  overlayCloseShouldHide = options.hideOverlay ?? (key ? !pinned[key] : true);

  if (!key) {
    overlayCloseRequested = false;
    overlayCloseShouldHide = true;
    overlayDrawerOpen.value = false;
    hideOverlayPopover();
    return;
  }

  if (!overlayDrawerOpen.value) {
    finalizeOverlayClose();
    return;
  }

  overlayDrawerOpen.value = false;
}

function finalizeOverlayClose() {
  if (overlayCloseTimer) {
    clearTimeout(overlayCloseTimer);
    overlayCloseTimer = null;
  }

  const key = activeOverlayKey.value;
  if (!key) {
    overlayCloseShouldHide = true;
    overlayCloseRequested = false;
    return;
  }

  const shouldHide = overlayCloseShouldHide;

  activeOverlayKey.value = null;
  overlayCloseShouldHide = true;
  overlayCloseRequested = false;

  if (shouldHide) {
    const ref = overlayRefMap[key];
    if (ref && ref.value) ref.value = false;
    hideOverlayPopover();
  }
}

watch(overlayDrawerOpen, (isOpen, wasOpen) => {
  if (overlayCloseTimer) {
    clearTimeout(overlayCloseTimer);
    overlayCloseTimer = null;
  }

  if (!isOpen && wasOpen) {
    if (!overlayCloseRequested) {
      const key = activeOverlayKey.value;
      overlayCloseShouldHide = key ? !pinned[key] : true;
    }
    overlayCloseTimer = setTimeout(() => {
      finalizeOverlayClose();
    }, OVERLAY_DRAWER_CLOSE_DELAY);
  } else if (isOpen) {
    overlayCloseRequested = false;
  }
});

watch(open, (isOpen) => {
  if (!isOpen) {
    closeActiveOverlay({ hideOverlay: false });
    if (!isMobile.value) {
      hideOverlayPopover();
    }
  }
});

// Ensure Beståndsgräns (static overlay) is active and pinned by default
onMounted(() => {
  try {
    if (!staticOverlayVisible.value) staticOverlayVisible.value = true;
  } catch { }
  pinned.staticOverlay = true;
});

// Make overlays mutually exclusive unless pinned and drive nested drawer state
watch(retentionVisible, (val) => {
  if (val) enforceExclusive('retention');
  handleOverlayStateChange('retention');
}, { immediate: true });

watch(kanteffektVisible, (val) => {
  if (val) enforceExclusive('kanteffekt');
  handleOverlayStateChange('kanteffekt');
}, { immediate: true });

// split watchers defined above for rottackeSkarmtradVisible and rottackeBladningVisible

watch(rottackeBladningVisible, (val) => {
  if (val) enforceExclusive('rottackeBladning');
  handleOverlayStateChange('rottackeBladning');
}, { immediate: true });

watch(seedTreeVisible, (val) => {
  if (val) enforceExclusive('seedTree');
  handleOverlayStateChange('seedTree');
}, { immediate: true });

watch(smaplantorVisible, (val) => {
  if (val) enforceExclusive('smaplantor');
  handleOverlayStateChange('smaplantor');
}, { immediate: true });

watch(hogstubbarVisible, (val) => {
  if (val) enforceExclusive('hogstubbar');
  handleOverlayStateChange('hogstubbar');
}, { immediate: true });

watch(naturvardsarterVisible, (val) => {
  if (val) enforceExclusive('naturvardsarter');
  handleOverlayStateChange('naturvardsarter');
}, { immediate: true });

watch(tradplantorVisible, (val) => {
  if (val) enforceExclusive('tradplantor');
  handleOverlayStateChange('tradplantor');
}, { immediate: true });

watch(staticOverlayVisible, (val) => { if (val) enforceExclusive('staticOverlay') });

watch(currentFwValue, () => {
  overlayKeys.forEach((key) => handleOverlayStateChange(key));
});


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
  const beforeLabel = currentFramework.value?.value === "naturskydd"
    ? "Ingen avverkning"
    : "Före avverkning";
  const steps = [
    { value: 3, label: beforeLabel, timeLabel: "före" },
    { value: 15, label: "1 år efter", timeLabel: "efter" },
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

const overlayContext = computed(() => ({
  framework: currentFwValue.value ?? null,
  startskog: currentStartskogValue.value ?? null,
  time: timeLabelForDataFiltering.value ?? null,
}));

if (import.meta.dev) {
  watch(
    overlayContext,
    (ctx) => {
      console.log('[Model] overlay context', ctx);
    },
    { immediate: true, deep: true },
  );
}

const overlayAvailability = computed<Record<OverlayKey, boolean>>(() =>
  overlayRegistry.availabilityFor(overlayContext.value),
);

const filteredOverlayData = computed(() => overlayRegistry.filterAll(overlayContext.value));

const beforeOverlayContext = computed(() => ({
  framework: currentFwValue.value ?? null,
  startskog: currentStartskogValue.value ?? null,
  time: isCompare.value ? 'innan' : timeLabelForDataFiltering.value ?? null,
}));

const filteredBeforeOverlayData = computed(() =>
  overlayRegistry.filterAll(beforeOverlayContext.value),
);

const overlayContextFramework2 = computed(() => ({
  framework: currentFramework2.value?.value ?? null,
  startskog: currentStartskogValue.value ?? null,
  time: timeLabelForDataFiltering.value ?? null,
}));

const filteredOverlayDataFramework2 = computed(() =>
  overlayRegistry.filterAll(overlayContextFramework2.value),
);

if (import.meta.dev) {
  watch(
    filteredOverlayData,
    (data) => {
      console.log('[Model] overlay data counts', {
        retention: data.retention?.length ?? 0,
        seedTree: data.seedTree?.length ?? 0,
        smaplantor: data.smaplantor?.length ?? 0,
        hogstubbar: data.hogstubbar?.length ?? 0,
        naturvardsarter: data.naturvardsarter?.length ?? 0,
        kanteffekt: data.kanteffekt?.length ?? 0,
      });
    },
    { immediate: true },
  );
}

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

const timelineCarouselEnabled = computed(() => {
  const infoCount = timelineSections.value.filter((section) => !!section.info).length;
  return isMobile.value && infoCount > 1 && (isCompare.value || isFrameworkCompareMode.value);
});

const timelineDetailState = reactive<Record<string, { skog: boolean; svamp: boolean }>>({});

function ensureTimelineDetailState(key: string) {
  if (!timelineDetailState[key]) {
    timelineDetailState[key] = { skog: true, svamp: true };
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
  { label: 'Före / efter', value: 'beforeAfterCompare' },
  { label: 'Två metoder', value: 'frameworkCompare' }
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
