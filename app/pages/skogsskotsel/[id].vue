<template>
    <DefineMethodPanelBody v-if="contentTab === 'method'">
        <div class="grid grid-cols-1 md:grid-cols-3 border-muted/50 p-3 sm:p-0 overflow-visible ">

            <div class="grid md:grid-cols-2 lg:grid-cols-3 col-span-3 gap-4 sm:m-3  min-w-0">
                <div class="ring ring-gray-300/30 bg-gray-50/50 p-4 sm:p-6 rounded-lg w-full min-w-0 overflow-hidden">
                    <div class="space-y-3 w-full min-w-0">
                        <!-- <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">{{
                            selectedMethod.title }}</p> -->
                        <div class="flex items-center gap-2">
                            <UIcon name="lineicons:mushroom" class="size-5 text-gray-500" />
                            <h3 class="text-xl font-semibold text-neutral-900">
                                Mängd mykorrhizasvamp
                            </h3>
                        </div>
                        <div v-if="methodChartTab === 'skogsskole' && methodMangdMykorrhizaDoc"
                            class="cursor-pointer rounded-md" role="button" tabindex="0"
                            @click="toggleChartInfoExpansion('skogsskole')"
                            @keydown.enter.prevent="toggleChartInfoExpansion('skogsskole')"
                            @keydown.space.prevent="toggleChartInfoExpansion('skogsskole')">
                            <ContentRenderer :value="methodMangdMykorrhizaDoc" :class="[
                                'text-md text-neutral-800 ring-muted/50 rounded-md [&>*:first-child]:mt-0',
                                { 'line-clamp-1': !chartInfoExpanded.skogsskole }
                            ]" />
                        </div>
                        <div v-else-if="methodSvampgrupperDoc" class="cursor-pointer rounded-md" role="button"
                            tabindex="0" @click="toggleChartInfoExpansion('grupper')"
                            @keydown.enter.prevent="toggleChartInfoExpansion('grupper')"
                            @keydown.space.prevent="toggleChartInfoExpansion('grupper')">
                            <ContentRenderer :value="methodSvampgrupperDoc" :class="[
                                'text-md text-neutral-800 ring-muted/50 rounded-md [&>*:first-child]:mt-0',
                                { 'line-clamp-1': !chartInfoExpanded.grupper }
                            ]" />
                        </div>
                        <ForestryChartMain v-model:selectedChart="methodChartTab" :selectedChart="methodChartTab"
                            :parentSelectedFrameworks="chartFrameworks" :currentStartskog="selectedStartskogTab"
                            :currentTimeValue="currentTimelineTime" preserveFrameworkOrder :showControls="false"
                            :showInlineTabs="true" class="pt-2 w-full min-w-0 max-w-full" />
                    </div>
                </div>
                <div
                    class="ring ring-warning-600/10 bg-warning-50/50 p-4 sm:p-6 rounded-lg w-full min-w-0 overflow-hidden">
                    <div class="space-y-3 w-full min-w-0">
                        <!-- <p class="text-xs font-semibold text-warning-600 uppercase tracking-wide">{{
                            selectedMethod.title }}</p> -->
                        <div class="flex items-center gap-2">
                            <UIcon name="icon-park-solid:knife-fork" class="size-5 text-warning-500" />
                            <h3 class="text-xl font-semibold text-neutral-900">Matsvampar</h3>
                        </div>
                        <div v-if="methodMatsvampSection" class="cursor-pointer rounded-md" role="button" tabindex="0"
                            @click="toggleChartInfoExpansion('matsvampar')"
                            @keydown.enter.prevent="toggleChartInfoExpansion('matsvampar')"
                            @keydown.space.prevent="toggleChartInfoExpansion('matsvampar')">
                            <ContentRenderer :value="methodMatsvampSection" :class="[
                                'text-md text-neutral-800 ring-muted/50 rounded-md [&>*:first-child]:mt-0',
                                { 'line-clamp-1': !chartInfoExpanded.matsvampar }
                            ]" />
                        </div>
                        <ForestryChartMain :selectedChart="'matsvampar'" :parentSelectedFrameworks="chartFrameworks"
                            :currentStartskog="selectedStartskogTab" :currentTimeValue="currentTimelineTime"
                            preserveFrameworkOrder :showControls="false" :showMatsvampSelector="true"
                            class="pt-2 w-full min-w-0 max-w-full" />
                    </div>
                </div>
                <div
                    class="ring ring-signal-700/10 bg-signal-50/50 p-4 sm:p-6 rounded-lg w-full min-w-0 overflow-hidden">
                    <div class="space-y-3 w-full min-w-0">
                        <!-- <p class="text-xs font-semibold text-signal-600 uppercase tracking-wide">{{
                            selectedMethod.title }}</p> -->
                        <div class="flex items-center gap-2 ">
                            <UIcon name="i-material-symbols-award-star" class="size-5 text-signal-500" />
                            <h3 class="text-xl font-semibold text-neutral-900">Naturvårdssvampar</h3>
                        </div>
                        <div v-if="methodNaturvardSection" class="cursor-pointer rounded-md" role="button" tabindex="0"
                            @click="toggleChartInfoExpansion('rodlistade')"
                            @keydown.enter.prevent="toggleChartInfoExpansion('rodlistade')"
                            @keydown.space.prevent="toggleChartInfoExpansion('rodlistade')">
                            <ContentRenderer :value="methodNaturvardSection" :class="[
                                'text-md text-neutral-800 [&>*:first-child]:mt-0',
                                { 'line-clamp-1': !chartInfoExpanded.rodlistade }
                            ]" />
                        </div>
                        <ForestryChartMain :selectedChart="'rodlistade'" :parentSelectedFrameworks="chartFrameworks"
                            :currentStartskog="selectedStartskogTab" :currentTimeValue="currentTimelineTime"
                            preserveFrameworkOrder :showControls="false" class="pt-2 w-full min-w-0 max-w-full" />
                    </div>

                </div>
            </div>
            <!-- <div class="col-span-3 px-4 pb-4 md:px-3 md:pb-3 border-t border-muted/50">
                <div class="rounded-lg ring ring-muted/40 bg-white/80 p-2 sm:p-3">
                    <UTable :data="markerLibraryRows" :columns="markerLibraryColumns" :ui="{
                        thead: 'hidden',
                        tr: 'align-top',
                        td: 'py-2'
                    }" class="w-full">
                        <template #icon-cell="{ row }">
                            <button type="button" class="flex items-center justify-center p-1 cursor-pointer"
                                @click="openMarkerInfo(row.original.key)">
                                <UIcon :name="row.original.icon || 'i-heroicons-information-circle'"
                                    class="size-5 text-neutral-600" />
                            </button>
                        </template>
<template #name-cell="{ row }">
                            <button type="button" class="text-left cursor-pointer"
                                @click="openMarkerInfo(row.original.key)">
                                <p class="text-sm font-medium text-neutral-800">{{ row.original.name }}</p>
                            </button>
                        </template>
<template #image-cell="{ row }">
                            <button type="button"
                                class="w-20 h-12 rounded-md overflow-hidden ring ring-muted/40 bg-neutral-100 flex items-center justify-center cursor-pointer"
                                @click="openMarkerInfo(row.original.key)">
                                <NuxtImg v-if="row.original.image" :src="row.original.image" :alt="row.original.name"
                                    width="160" height="96" class="w-full h-full object-cover" loading="lazy" />
                                <UIcon v-else :name="row.original.icon || 'i-heroicons-photo'"
                                    class="size-5 text-neutral-400" />
                            </button>
                        </template>
<template #frameworks-cell="{ row }">
                            <div class="flex flex-wrap gap-1.5">
                                <UBadge v-for="framework in row.original.frameworks"
                                    :key="`${row.original.key}-${framework.key}`"
                                    :color="framework.key === 'compare' ? 'warning' : 'neutral'" variant="subtle"
                                    size="sm">
                                    {{ framework.label }}
                                </UBadge>
                            </div>
                        </template>
</UTable>
</div>
</div> -->
        </div>
    </DefineMethodPanelBody>
    <DefineMethodPanelFooter>
        <div class="grid w-full grid-cols-2 sm:gap-6 gap-3 items-center py-2">
            <UPageCard v-if="methodNav.prev" color="neutral" variant="outline" icon="i-heroicons-arrow-left-20-solid"
                :title="`${methodNav.prev.title}`" class="ring-muted/50 w-full flex-1"
                @click="handleMethodNav(methodNav.prev.id)" :ui="{
                    root: 'w-full',
                    header: 'w-full',
                    body: 'w-full',
                    leading: 'text-sm',
                    title: 'truncate whitespace-nowrap max-w-[14ch] sm:max-w-none'
                }">
                <template #leading class="text-muted">
                    <UIcon name="i-heroicons-chevron-left" class="mr-1" /> Föregående
                </template>
            </UPageCard>
            <div v-else class="w-full" />
            <UPageCard v-if="methodNav.next" color="neutral" variant="outline" icon="i-heroicons-arrow-right-20-solid"
                :title="`${methodNav.next.title}`" class="ring-muted/50 w-full flex-1 "
                @click="handleMethodNav(methodNav.next.id)" :ui="{
                    root: 'w-full',
                    header: 'w-full',
                    body: 'w-full flex justify-end',
                    leading: 'w-full flex justify-end text-sm',
                    title: 'truncate whitespace-nowrap max-w-[14ch] sm:max-w-none text-right'
                }">
                <template #leading class="text-muted">Nästa
                    <UIcon name="i-heroicons-chevron-right" class="ml-1" />
                </template>
            </UPageCard>
        </div>
    </DefineMethodPanelFooter>
    <DefineMarkerCardsRow>
        <div class="flex flex-wrap gap-2 items-center p-2 max-w-88">
            <UPopover :ui="{ content: 'p-2 w-56 ' }" @update:open="(open) => { bestandsgransPreview = open }">
                <UButton label="Beståndsgräns" color="neutral"
                    :variant="(bestandsgransVisible || bestandsgransPreview) ? 'solid' : 'outline'"
                    class="justify-start ring-muted/50 shadow" />
                <template #content>
                    <div class="flex items-center justify-between gap-2 p-2">
                        <div class="flex items-center gap-1">
                            <UIcon name="codicon:pinned" />
                            <span class="text-sm text-neutral-700">Fäst markör</span>
                        </div>
                        <USwitch v-model="bestandsgransVisible" />
                    </div>
                </template>
            </UPopover>
            <div v-for="card in markerCards" :key="card.key">
                <ReuseMarkerCardTrigger :card="card" />
            </div>
        </div>
    </DefineMarkerCardsRow>
    <DefineMarkerInfoPanel>
        <MySlideover v-if="!isMobile" v-model="markerPanelOpenSingle" :pinned="markerSlideoverPinned"
            @update:pinned="(val) => (markerSlideoverPinned = val)">
            <div v-if="selectedMarkerCard">
                <ReuseMarkerCardHeader :card="selectedMarkerCard" />
                <ReuseMarkerCardBody :card="selectedMarkerCard" />
            </div>
        </MySlideover>
        <UModal v-else v-model:open="markerPanelOpenSingle" :title="selectedMarkerCard?.title"
            :ui="{ header: 'shrink-0 sm:p-0' }" :snapPoints="[0.2, 0.9]">
            <template #header>
                <div class="w-full flex items-center justify-between gap-2">
                    <p class="text-md font-bold">{{ selectedMarkerCard?.title }}</p>
                    <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" class="ring-muted/50"
                        @click="markerPanelOpenSingle = false" />
                </div>
            </template>
            <template #body>
                <template v-if="selectedMarkerCard">
                    <ReuseMarkerCardHeader :card="selectedMarkerCard" />
                    <ReuseMarkerCardBody :card="selectedMarkerCard" />
                </template>
            </template>
        </UModal>
    </DefineMarkerInfoPanel>
    <DefineMarkerCardHeader v-slot="{ card }">
        <div v-if="card.images?.length" class="space-y-3 mb-10">
            <UCarousel dots arrows :items="card.images.map((src, idx) => ({ src, idx }))"
                prev-icon="i-heroicons-chevron-left" next-icon="i-heroicons-chevron-right" :ui="{

                    dots: '-bottom-4',
                    dot: 'w-6 h-1',
                    prev: 'start-4 sm:start-4 top-1/2 -translate-y-1/2',
                    next: 'end-4 sm:end-4 top-1/2 -translate-y-1/2',

                }" class="w-full">
                <template #default="{ item }">
                    <div class="relative overflow-hidden ring ring-muted/50 shadow">
                        <img :src="item.src" :alt="card.title" class="h-72 w-full rounded" loading="lazy" />
                        <div v-if="card.imageDescriptions?.[item.idx]"
                            class="text-sm text-neutral-100 absolute bottom-0 w-full bg-neutral-950/50 p-1">
                            {{ card.imageDescriptions[item.idx] }}
                        </div>
                    </div>
                </template>
            </UCarousel>
        </div>
        <div v-else-if="card.image">
            <img :src="card.image" class="rounded-lg sm:rounded-none" />
        </div>
        <ImagePlaceholder v-else />
    </DefineMarkerCardHeader>
    <DefineMarkerCardTrigger v-slot="{ card }">
        <UPopover :ui="{ content: 'p-2 w-56' }"
            @update:open="(open) => { if (card.overlayAvailable === false) return; if (open) { markerPanelOpen[card.key] = true; markerPreview[card.key] = true } else { markerPreview[card.key] = false; if (!markerPinned[card.key]) markerPanelOpen[card.key] = false } }">
            <UButton :label="card.title" :icon="card.icon" color="neutral"
                :variant="(markerPanelOpen[card.key] || markerPinned[card.key]) ? 'solid' : 'outline'"
                class="ring-muted/50 w-full justify-start" :class="[
                    card.overlayAvailable === false ? 'opacity-50' : 'shadow',

                ]" />
            <template #content>
                <div class="flex items-center justify-between gap-2 p-2">
                    <div class="flex items-center gap-1"
                        :class="card.overlayAvailable ? 'text-neutral-700' : 'text-neutral-300'">
                        <UIcon name="codicon:pinned" />
                        <span class="text-sm ">Fäst markör</span>
                    </div>

                    <USwitch v-model="markerPinned[card.key]" :disabled="card.overlayAvailable === false" />
                </div>
                <USeparator class="my-1" />
                <UButton color="neutral" variant="ghost" icon="i-heroicons-information-circle" label="Information"
                    class="w-full justify-start" @click="openMarkerInfo(card.key)" />
            </template>
        </UPopover>
    </DefineMarkerCardTrigger>
    <DefineMarkerCardBody v-slot="{ card }">
        <div class="pt-4 sm:p-4">
            <h1 class="text-2xl font-medium text-neutral-800 -mb-2">{{ card.title }}</h1>
            <ContentRenderer v-if="card.doc?.body" :value="card.doc" />
        </div>
    </DefineMarkerCardBody>
    <DefineMethodHeroImage>
        <div class="relative w-full z-10 max-h-40 lg:max-h-60 shadow ring-muted/50 overflow-hidden bg-neutral-400">
            <NuxtImg :src="methodImage(selectedMethod, 'detail')" height="450" width="900"
                :alt="`Bild för ${selectedMethod.title}`" class="w-full h-full opacity-90" />
            <!-- <div v-if="compareModeEnabled && compareMode === 'methods' && compareMethod"
                class="absolute inset-y-0 right-0 w-1/2 overflow-hidden bg-neutral-400 border-l-2 border-neutral-50">
                <NuxtImg :src="methodImage(compareMethod, 'detail')" height="450" width="900"
                    :alt="`Bild för ${compareMethod.title || compareMethod.id}`"
                    class="w-full h-full object-cover opacity-80" />
            </div> -->
        </div>
    </DefineMethodHeroImage>
    <div class="flex flex-col flex-1 bg-neutral-50 pb-6 w-full" v-if="page">
        <UContainer class="w-full flex-1 flex flex-col px-0 sm:px-0 md:px-0" v-if="selectedMethod.id">

            <Head>
                <link v-for="(link, idx) in timelinePreloadLinks" :key="`${link.href}-${idx}`"
                    :rel="link.rel || 'prefetch'" :as="link.as || 'image'" :href="link.href" />
            </Head>
            <div v-if="!isMobile"
                class="hidden lg:grid grid-cols-4 my-3 ring-muted/50 ring bg-white rounded-xl overflow-hidden">
                <ReuseMethodHeroImage class="  overflow-hidden ring ring-muted/50 " />
                <div :class="[
                    'mx-4 lg:mx-0 lg:px-6 lg:py-4 lg:pt-6  w-full h-full flex flex-col justify-between col-span-2',
                ]">
                    <div class="flex flex-col gap-2">


                        <UPopover :ui="{ content: 'overflow-y-auto bar-chart-container ' }"
                            v-model:open="methodTitlePopoverOpen" :content="{ align: 'start', side: 'bottom' }">
                            <button type="button"
                                class="inline-flex gap-2 items-center w-full text-lg lg:text-4xl font-medium text-neutral-800 text-nowrap cursor-pointer hover:opacity-85 transition-opacity">
                                <span>{{ selectedMethod.title }}</span>
                                <UIcon name="i-heroicons-chevron-down-20-solid"
                                    class="size-4 lg:size-10 text-neutral-800" />
                            </button>
                            <template #content>
                                <div class="relative py-1 min-w-60 max-w-110">
                                    <span
                                        class="pointer-events-none absolute left-2 top-2 bottom-2 w-0.5 rounded-full bg-linear-to-b from-emerald-500 via-amber-400 to-rose-500" />
                                    <div v-for="option in frameworkOptions" :key="option.value" class="pl-4 pr-2">
                                        <div class="hover:bg-neutral-50 p-3 w-full justify-between flex items-center gap-4 rounded-md my-1 cursor-pointer"
                                            :class="{ 'bg-neutral-100': option.value === selectedFrameworkIndex }"
                                            @click="selectedFrameworkIndex = option.value; methodTitlePopoverOpen = false">
                                            <div>
                                                <h1 class="text-md font-semibold text-neutral-900">{{ option.label }}
                                                </h1>
                                                <p class="text-sm text-neutral-500 font-light">{{ option.description ||
                                                    '' }}</p>
                                            </div>
                                            <div class="size-10 flex justify-center items-center bg-muted rounded-md">
                                                <UIcon v-if="option.icon" :name="option.icon" />
                                                <UIcon v-else name="i-heroicons-photo" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </UPopover>
                        <p class="text-muted text-md ">{{ selectedMethod.shortdescription }}</p>
                        <div class="flex flex-wrap items-center gap-1 mt-1">

                            <UBadge v-if="selectedMethod.impactLabel" :color="selectedMethod.impactColor || 'warning'"
                                variant="soft" size="md">{{ selectedMethod.impactLabel }} påverkan</UBadge>
                            <UPopover v-if="isHyggesfrittType" mode="hover"
                                :content="{ align: 'start', side: 'bottom' }">
                                <UBadge :label="selectedMethod.type" color="neutral" variant="soft" size="md"
                                    class="cursor-default" />
                                <template #content>
                                    <div class="max-w-md p-3 space-y-2 text-sm text-neutral-700">
                                        <p>
                                            Hyggesfritt skogsbruk innebär att skogen brukas så att marken förblir
                                            trädbevuxen.
                                        </p>
                                        <p v-if="isLuckhuggningMethod" class="text-muted">
                                            Luckor som är större än 0,25 hektar räknas som hyggen enligt
                                            Skogsstyrelsens definition.
                                        </p>
                                        <p v-if="isSkarmtradMethod" class="text-muted">
                                            För överhållen skärm att räknas som hyggesfritt ska minst 25 träd per
                                            hektar, med en höjd
                                            på minst 10 meter, lämnas kvar och ingå i det nya beståndet.
                                        </p>
                                        <UButton label="Skogsstyrelsens definition" trailing target="_blank"
                                            variant="outline" icon="i-heroicons-arrow-top-right-on-square-20-solid"
                                            color="neutral" class="ring-muted/50"
                                            to="https://www.skogsstyrelsen.se/bruka-skog/olika-satt-att-skota-din-skog/hyggesfritt-skogsbruk/definition-av-hyggesfritt-skogsbruk" />

                                    </div>
                                </template>
                            </UPopover>
                            <UBadge v-else-if="selectedMethod.type" :label="selectedMethod.type" color="neutral"
                                variant="soft" size="md" />
                        </div>
                    </div>

                </div>
                <div class="col-span-1 w-full h-full flex flex-col items-end">
                    <div class="flex flex-col h-full justify-between items-end gap-2 p-4  ring-muted/50  w-fit ">

                        <div class="flex flex-col items-end gap-2">






                            <UButton v-if="!isMobile" label="Om metoden" icon="i-heroicons-information-circle"
                                color="neutral" variant="solid" class="ring-muted/50 rounded-lg" size="lg"
                                @click="methodInfoPanelOpen = true" />

                        </div>

                        <UPopover v-if="!isMobile" mode="hover" :content="{ align: 'start', side: 'bottom' }">
                            <div class="relative w-80 h-2 rounded-sm bg-linear-to-r from-emerald-500 via-amber-400 to-rose-500 ring ring-neutral-300/40 "
                                aria-label="Påverkansskala">
                                <span
                                    class="absolute inset-y-0 left-0 rounded-l-sm bg-neutral-100/30 transition-all duration-300 ease-out"
                                    :style="{ width: `${Math.max(0, Math.min(100, impact.value))}%` }" />
                                <span v-if="comparisonImpact"
                                    class="absolute inset-y-0 left-0 rounded-l-sm transition-all duration-300 ease-out"
                                    :style="{
                                        width: `${Math.max(0, Math.min(100, comparisonImpact.value))}%`,
                                        opacity: '0.2',
                                        backgroundImage: 'repeating-linear-gradient(135deg, rgb(64 64 64) 0 2px, transparent 2px 6px)'
                                    }" />
                                <span
                                    class="absolute top-0 h-2 w-0.5 bg-neutral-100/80 -translate-x-1/2 transition-all duration-300 ease-out"
                                    :style="{ left: `${Math.max(0, Math.min(100, impact.value))}%` }">
                                    <UIcon :name="selectedMethod.icon || 'i-heroicons-information-circle'"
                                        class="absolute -top-4 left-1/2 -translate-x-1/2 size-3.5 text-neutral-500" />
                                </span>
                                <span v-if="comparisonImpact"
                                    class="absolute top-0 h-2 w-0.5 bg-neutral-700/20 -translate-x-1/2 transition-all duration-300 ease-out"
                                    :style="{ left: `${Math.max(0, Math.min(100, comparisonImpact.value))}%` }">
                                    <UIcon :name="compareMethod?.icon || 'i-iconamoon-compare'"
                                        class="absolute -top-4 left-1/2 -translate-x-1/2 size-3.5 text-neutral-500/60" />
                                </span>
                            </div>
                            <template #content>
                                <div class="p-3 min-w-56 space-y-2">
                                    <p class="text-sm font-semibold text-neutral-900">Påverkan på mykorrhiza</p>
                                    <div class="flex items-center gap-1">
                                        <UIcon :name="selectedMethod.icon || 'i-heroicons-information-circle'"
                                            class="size-4 text-neutral-600" />
                                        <p class="text-sm text-neutral-600">
                                            {{ selectedMethod.title || selectedMethod.id }}
                                        </p>
                                        <UBadge size="sm" class="ml-2"
                                            :color="impact.tone === 'low' ? 'primary' : impact.tone === 'high' ? 'error' : 'tertiary'"
                                            variant="subtle">
                                            {{ impact.label }}
                                        </UBadge>
                                    </div>
                                    <div v-if="comparisonImpact" class="flex items-center gap-1">
                                        <UIcon :name="compareMethod?.icon || 'i-iconamoon-compare'"
                                            class="size-4 text-neutral-600" />
                                        <p class="text-sm text-neutral-600">
                                            {{ compareMethodLabel }}
                                        </p>
                                        <UBadge size="sm" class="ml-2"
                                            :color="comparisonImpact.tone === 'low' ? 'primary' : comparisonImpact.tone === 'high' ? 'error' : 'tertiary'"
                                            variant="subtle">
                                            {{ comparisonImpact.label }}
                                        </UBadge>
                                    </div>
                                </div>
                            </template>
                        </UPopover>




                    </div>
                </div>
            </div>
            <UPage class="pt-0 flex-1 flex flex-col relative ">

                <!-- <UPopover v-if="isMobile" :ui="{ content: ' overflow-y-auto bar-chart-container max-w-80' }" :content="{
                    align: 'start',
                    side: 'bottom',
                }" class="absolute top-2 left-2 z-20">
                    <UButton :label="selectedStartskogLabel" :icon="selectedStartskogIcon" color="neutral"
                        variant="outline" size="lg" class="cursor-pointer ring-muted/50" />
                    <template #content>
                        <div class="py-1 min-w-50 max-w-110">
                            <div class="px-3 my-2 pb-1">
                                <h3 class="text-sm font-semibold text-neutral-900">Skogens historik</h3>
                                <p class="text-xs text-neutral-500">
                                    Har skogen varit kalavverkad tidigare?
                                </p>
                            </div>
                            <USeparator class="mb-2" />
                            <div class="px-2">
                                <div class="hover:bg-neutral-50 p-3 w-full justify-between flex items-center gap-4 rounded-md my-1 cursor-pointer"
                                    :class="{ 'bg-neutral-100': selectedStartskogTab === 'naturskog' }"
                                    @click="selectedStartskogTab = 'naturskog'">
                                    <div>
                                        <h1 class="text-md font-semibold text-neutral-900">Inte
                                            kalavverkad
                                        </h1>
                                        <p class="text-sm text-neutral-500 font-light">
                                            Skogen har oftast skogsbrukats, men inte varit kalavverkad.
                                        </p>
                                    </div>
                                    <div class="size-10 flex justify-center items-center bg-muted rounded-md shrink-0">
                                        <UIcon name="i-material-symbols-light-forest-rounded" />
                                    </div>
                                </div>
                                <div class="hover:bg-neutral-50 p-3 w-full justify-between flex items-center gap-4 rounded-md my-1 cursor-pointer"
                                    :class="{ 'bg-neutral-100': selectedStartskogTab === 'produktionsskog_' }"
                                    @click="selectedStartskogTab = 'produktionsskog_'">
                                    <div>
                                        <h1 class="text-md font-semibold text-neutral-900">Kalavverkad
                                        </h1>
                                        <p class="text-sm text-neutral-500 font-light">
                                            Skogen har varit kalavverkad eller är etablerad på tidigare
                                            trädlös
                                            mark.
                                        </p>
                                    </div>
                                    <div class="size-10 flex justify-center items-center bg-muted rounded-md shrink-0">
                                        <UIcon name="i-ph-farm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </UPopover> -->


                <div class=" pb-0" v-if="isMobile">
                    <ReuseMethodHeroImage class="" v-if="isMobile" />

                    <UPopover mode="hover" :content="{ align: 'start', side: 'bottom' }">
                        <div class="relative w-full  h-4 bg-linear-to-r from-emerald-500 via-amber-400 to-rose-500 ring ring-neutral-300/40 "
                            aria-label="Påverkansskala">
                            <span
                                class="absolute inset-y-0 left-0 rounded-l-sm bg-neutral-100/30 transition-all duration-300 ease-out"
                                :style="{ width: `${Math.max(0, Math.min(100, impact.value))}%` }" />
                            <span v-if="comparisonImpact"
                                class="absolute inset-y-0 left-0 rounded-l-sm transition-all duration-300 ease-out"
                                :style="{
                                    width: `${Math.max(0, Math.min(100, comparisonImpact.value))}%`,
                                    opacity: '0.2',
                                    backgroundImage: 'repeating-linear-gradient(135deg, rgb(64 64 64) 0 2px, transparent 2px 6px)'
                                }" />
                            <span
                                class="absolute top-0 h-4 w-0.5 bg-neutral-100/80 -translate-x-1/2 transition-all duration-300 ease-out"
                                :style="{ left: `${Math.max(0, Math.min(100, impact.value))}%` }">
                                <UIcon :name="selectedMethod.icon || 'i-heroicons-information-circle'"
                                    class="absolute left-1 top-1/2 -translate-y-1/2 size-3.5 text-neutral-50/80" />
                            </span>
                            <span v-if="comparisonImpact"
                                class="absolute top-0 h-4 w-0.5 bg-neutral-700/20 -translate-x-1/2 transition-all duration-300 ease-out"
                                :style="{ left: `${Math.max(0, Math.min(100, comparisonImpact.value))}%` }">
                                <UIcon :name="compareMethod?.icon || 'i-iconamoon-compare'"
                                    class="absolute left-1 top-1/2 -translate-y-1/2 size-3.5 text-neutral-500" />
                            </span>
                        </div>


                        <template #content>
                            <div class="p-3 min-w-56 space-y-2">
                                <p class="text-sm font-semibold text-neutral-900">Påverkan på mykorrhiza</p>
                                <div class="flex items-center gap-1">
                                    <UIcon :name="selectedMethod.icon || 'i-heroicons-information-circle'"
                                        class="size-4 text-neutral-600" />
                                    <p class="text-sm text-neutral-600">
                                        {{ selectedMethod.title || selectedMethod.id }}
                                    </p>
                                    <UBadge size="sm" class="ml-2"
                                        :color="impact.tone === 'low' ? 'primary' : impact.tone === 'high' ? 'error' : 'tertiary'"
                                        variant="subtle">
                                        {{ impact.label }}
                                    </UBadge>
                                </div>
                                <div v-if="comparisonImpact" class="flex items-center gap-1">
                                    <UIcon :name="compareMethod?.icon || 'i-iconamoon-compare'"
                                        class="size-4 text-neutral-600" />
                                    <p class="text-sm text-neutral-600">
                                        {{ compareMethodLabel }}
                                    </p>
                                    <UBadge size="sm" class="ml-2"
                                        :color="comparisonImpact.tone === 'low' ? 'primary' : comparisonImpact.tone === 'high' ? 'error' : 'tertiary'"
                                        variant="subtle">
                                        {{ comparisonImpact.label }}
                                    </UBadge>
                                </div>
                            </div>
                        </template>
                    </UPopover>
                    <div class="flex gap-2 p-2">
                        <USelect v-model="selectedFrameworkIndex" :items="frameworkOptions" v-if="isMobile"
                            option-attribute="label" value-key="value" placeholder="Välj metod" size="lg"
                            variant="outline" class="w-full sm:w-fit ring-muted/50 text-neutral-700" :ui="{
                                content: 'pl-3 min-w-fit min-h-70 relative overflow-y-auto bar-chart-container max-w-96 before:pointer-events-none before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:rounded-full before:bg-linear-to-b before:from-emerald-500 before:via-amber-400 before:to-rose-500'
                            }">
                            <template #item="{ item }">
                                <div class="px-1 w-full">
                                    <div
                                        class="hover:bg-neutral-50 p-1 w-full justify-between flex items-center gap-4 rounded-md my-1">
                                        <div>
                                            <h1 class="text-md font-semibold text-neutral-900">{{ item.label }}
                                            </h1>
                                            <p class="text-sm text-neutral-500 font-light">{{ item.description
                                                || ''
                                            }}
                                            </p>
                                        </div>
                                        <div class="size-10 flex justify-center items-center bg-muted rounded-md">
                                            <UIcon v-if="item.icon" :name="item.icon" />
                                            <UIcon v-else name="i-heroicons-photo" />
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </USelect>

                        <UDrawer>
                            <UButton color="neutral" variant="outline" class="ring-muted/50"
                                icon="i-heroicons-ellipsis-horizontal-16-solid" size="xl" />
                            <template #content>
                                <div class="p-4 flex flex-col gap-2">
                                    <div class="flex flex-col rounded-lg bg-neutral-50">
                                        <div class=" pl-4 p-2  w-full items-center flex justify-between">
                                            <div class="text-neutral-700 text-semibold">Historik</div>
                                            <UPopover :ui="{ content: ' overflow-y-auto bar-chart-container max-w-80' }"
                                                :content="{
                                                    align: 'start',
                                                    side: 'bottom',
                                                }">
                                                <UButton :label="selectedStartskogLabel"
                                                    icon="i-heroicons-chevron-up-down" color="neutral" variant="soft"
                                                    trailing size="xl" class="cursor-pointer ring-muted/50" />
                                                <template #content>
                                                    <div class="py-1 min-w-50 max-w-110">
                                                        <div class="px-3 my-2 pb-1">
                                                            <h3 class="text-sm font-semibold text-neutral-900">
                                                                Skogens
                                                                historik
                                                            </h3>
                                                            <p class="text-xs text-neutral-500">Har skogen varit
                                                                kalavverkad
                                                                tidigare?</p>
                                                        </div>
                                                        <USeparator class="mb-2" />
                                                        <div class="px-2">
                                                            <div class="hover:bg-neutral-50 p-3 w-full justify-between flex items-center gap-4 rounded-md my-1 cursor-pointer"
                                                                :class="{ 'bg-neutral-100': selectedStartskogTab === 'naturskog' }"
                                                                @click="selectedStartskogTab = 'naturskog'">
                                                                <div>
                                                                    <h1 class="text-md font-semibold text-neutral-900">
                                                                        Inte
                                                                        kalavverkad</h1>
                                                                    <p class="text-sm text-neutral-500 font-light">
                                                                        Skogen har
                                                                        oftast skogsbrukats, men inte varit
                                                                        kalavverkad.
                                                                    </p>
                                                                </div>
                                                                <div
                                                                    class="size-10 flex justify-center items-center bg-muted rounded-md shrink-0">
                                                                    <UIcon
                                                                        name="i-material-symbols-light-forest-rounded" />
                                                                </div>
                                                            </div>
                                                            <div class="hover:bg-neutral-50 p-3 w-full justify-between flex items-center gap-4 rounded-md my-1 cursor-pointer"
                                                                :class="{ 'bg-neutral-100': selectedStartskogTab === 'produktionsskog_' }"
                                                                @click="selectedStartskogTab = 'produktionsskog_'">
                                                                <div>
                                                                    <h1 class="text-md font-semibold text-neutral-900">
                                                                        Kalavverkad</h1>
                                                                    <p class="text-sm text-neutral-500 font-light">
                                                                        Skogen har
                                                                        varit kalavverkad eller är etablerad på
                                                                        tidigare
                                                                        trädlös
                                                                        mark.</p>
                                                                </div>
                                                                <div
                                                                    class="size-10 flex justify-center items-center bg-muted rounded-md shrink-0">
                                                                    <UIcon name="i-ph-farm" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>
                                            </UPopover>

                                        </div>
                                        <USeparator class="border-white" />
                                        <div class="pl-4 p-2 w-full items-center flex justify-between">
                                            <div class="text-neutral-700 text-semibold">Jämför</div>
                                            <UPopover :ui="{ content: ' overflow-y-auto bar-chart-container max-w-96' }"
                                                :content="{
                                                    align: 'end',
                                                    side: 'bottom',
                                                }" v-model:open="compareFrameworkPopoverOpen">
                                                <UButton trailing variant="soft" color="neutral"
                                                    class="ring-muted/50 lg:max-w-[85vw] sm:max-w-none h-fit" size="xl"
                                                    icon="i-heroicons-chevron-up-down">
                                                    <span class="block truncate sm:max-w-none">
                                                        {{ compareMethodLabel || 'Ingen jämförelse' }}
                                                    </span>
                                                </UButton>

                                                <template #content>
                                                    <div class="py-1 min-w-60 max-w-110">
                                                        <div class="px-2">
                                                            <div class="hover:bg-neutral-50 p-3 w-full justify-between flex items-center gap-4 rounded-md my-1 cursor-pointer"
                                                                :class="{ 'bg-neutral-100': !compareModeEnabled }"
                                                                @click="setCompareFrameworkIndex(null); compareFrameworkPopoverOpen = false">
                                                                <div>
                                                                    <h1 class="text-md font-semibold text-neutral-900">
                                                                        Ingen
                                                                        jämförelse</h1>
                                                                    <p class="text-sm text-neutral-500 font-light">
                                                                        Stäng
                                                                        av
                                                                        jämförelse.</p>
                                                                </div>
                                                                <div
                                                                    class="size-10 flex justify-center items-center bg-muted rounded-md">
                                                                    <UIcon name="i-heroicons-x-mark" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <USeparator class="my-2 w-full" />

                                                        <div class="relative py-1">
                                                            <span
                                                                class="pointer-events-none absolute left-2 top-2 bottom-2 w-0.5 rounded-full bg-linear-to-b from-emerald-500 via-amber-400 to-rose-500" />
                                                            <div v-for="option in compareFrameworkOptions"
                                                                :key="option.value" class="pl-4 pr-2">
                                                                <div class="hover:bg-neutral-50 p-3 w-full justify-between flex items-center gap-4 rounded-md my-1 cursor-pointer"
                                                                    :class="{ 'bg-neutral-100': option.value === selectedCompareFrameworkIndex }"
                                                                    @click="setCompareFrameworkIndex(option.value); compareFrameworkPopoverOpen = false">
                                                                    <div>
                                                                        <h1
                                                                            class="text-md font-semibold text-neutral-900">
                                                                            {{
                                                                                option.label }}</h1>
                                                                        <p class="text-sm text-neutral-500 font-light">
                                                                            {{
                                                                                option.description || '' }}</p>
                                                                    </div>
                                                                    <div
                                                                        class="size-10 flex justify-center items-center bg-muted rounded-md">
                                                                        <UIcon v-if="option.icon" :name="option.icon" />
                                                                        <UIcon v-else name="i-heroicons-photo" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>
                                            </UPopover>
                                        </div>
                                    </div>

                                    <UButton label="Om metoden" icon="i-heroicons-information-circle" color="neutral"
                                        variant="solid" class="ring-muted/50 w-full justify-center" size="xl"
                                        @click="methodInfoPanelOpen = true" />
                                </div>
                            </template>
                        </UDrawer>
                    </div>
                </div>



                <!-- <UPageHeader :title="selectedMethod.title" /> -->
                <div class="relative  bg-white ring ring-muted/50 lg:rounded-xl shadow overflow-x-clip ">
                    <div class="border-b border-muted/50 w-full flex justify-between pl-2 pr-3 items-center">
                        <UTabs :unmount-on-hide="false" v-model="contentTab" :items="contentTabItems" size="lg"
                            :clearable="false" :ui="{
                                root: '',
                                list: 'flex-nowrap gap-2 bg-transparent',
                                indicator: 'bg-white border border-muted/50 shadow',
                                trigger: 'data-[state=active]:text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                            }" class="w-full lg:w-fit pt-2" />
                        <div class="flex gap-2">
                            <UPopover v-if="!isMobile"
                                :ui="{ content: ' overflow-y-auto bar-chart-container max-w-80' }" :content="{
                                    align: 'start',
                                    side: 'bottom',
                                }">
                                <UButton :label="selectedStartskogLabel" :icon="selectedStartskogIcon" color="neutral"
                                    variant="outline" size="lg" class="cursor-pointer ring-muted/50" />
                                <template #content>
                                    <div class="py-1 min-w-50 max-w-110">
                                        <div class="px-3 my-2 pb-1">
                                            <h3 class="text-sm font-semibold text-neutral-900">Skogens historik
                                            </h3>
                                            <p class="text-xs text-neutral-500">Har skogen varit kalavverkad
                                                tidigare?</p>
                                        </div>
                                        <USeparator class="mb-2" />
                                        <div class="px-2">
                                            <div class="hover:bg-neutral-50 p-3 w-full justify-between flex items-center gap-4 rounded-md my-1 cursor-pointer"
                                                :class="{ 'bg-neutral-100': selectedStartskogTab === 'naturskog' }"
                                                @click="selectedStartskogTab = 'naturskog'">
                                                <div>
                                                    <h1 class="text-md font-semibold text-neutral-900">Inte
                                                        kalavverkad</h1>
                                                    <p class="text-sm text-neutral-500 font-light">Skogen har
                                                        oftast skogsbrukats, men inte varit kalavverkad.</p>
                                                </div>
                                                <div
                                                    class="size-10 flex justify-center items-center bg-muted rounded-md shrink-0">
                                                    <UIcon name="i-material-symbols-light-forest-rounded" />
                                                </div>
                                            </div>
                                            <div class="hover:bg-neutral-50 p-3 w-full justify-between flex items-center gap-4 rounded-md my-1 cursor-pointer"
                                                :class="{ 'bg-neutral-100': selectedStartskogTab === 'produktionsskog_' }"
                                                @click="selectedStartskogTab = 'produktionsskog_'">
                                                <div>
                                                    <h1 class="text-md font-semibold text-neutral-900">
                                                        Kalavverkad</h1>
                                                    <p class="text-sm text-neutral-500 font-light">Skogen har
                                                        varit kalavverkad eller är etablerad på tidigare trädlös
                                                        mark.</p>
                                                </div>
                                                <div
                                                    class="size-10 flex justify-center items-center bg-muted rounded-md shrink-0">
                                                    <UIcon name="i-ph-farm" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </UPopover>
                            <UPopover v-if="!isMobile"
                                :ui="{ content: ' overflow-y-auto bar-chart-container max-w-96' }" :content="{
                                    align: 'end',
                                    side: 'bottom',
                                }" v-model:open="compareFrameworkPopoverOpen">
                                <UButton variant="outline" color="neutral"
                                    class="ring-muted/50 max-w-[85vw] sm:max-w-none h-fit" size="lg"
                                    icon="i-iconamoon-compare">
                                    <span class="block truncate max-w-12 sm:max-w-none">
                                        {{ compareMethodLabel || 'Jämför' }}
                                    </span>
                                </UButton>

                                <template #content>
                                    <div class="py-1 min-w-60 max-w-110">
                                        <div class="px-2">
                                            <div class="hover:bg-neutral-50 p-3 w-full justify-between flex items-center gap-4 rounded-md my-1 cursor-pointer"
                                                :class="{ 'bg-neutral-100': !compareModeEnabled }"
                                                @click="setCompareFrameworkIndex(null); compareFrameworkPopoverOpen = false">
                                                <div>
                                                    <h1 class="text-md font-semibold text-neutral-900">Ingen
                                                        jämförelse</h1>
                                                    <p class="text-sm text-neutral-500 font-light">Stäng av
                                                        jämförelse.</p>
                                                </div>
                                                <div
                                                    class="size-10 flex justify-center items-center bg-muted rounded-md">
                                                    <UIcon name="i-heroicons-x-mark" />
                                                </div>
                                            </div>
                                        </div>
                                        <USeparator class="my-2 w-full" />

                                        <div class="relative py-1">
                                            <span
                                                class="pointer-events-none absolute left-2 top-2 bottom-2 w-0.5 rounded-full bg-linear-to-b from-emerald-500 via-amber-400 to-rose-500" />
                                            <div v-for="option in compareFrameworkOptions" :key="option.value"
                                                class="pl-4 pr-2">
                                                <div class="hover:bg-neutral-50 p-3 w-full justify-between flex items-center gap-4 rounded-md my-1 cursor-pointer"
                                                    :class="{ 'bg-neutral-100': option.value === selectedCompareFrameworkIndex }"
                                                    @click="setCompareFrameworkIndex(option.value); compareFrameworkPopoverOpen = false">
                                                    <div>
                                                        <h1 class="text-md font-semibold text-neutral-900">{{
                                                            option.label }}</h1>
                                                        <p class="text-sm text-neutral-500 font-light">{{
                                                            option.description || '' }}</p>
                                                    </div>
                                                    <div
                                                        class="size-10 flex justify-center items-center bg-muted rounded-md">
                                                        <UIcon v-if="option.icon" :name="option.icon" />
                                                        <UIcon v-else name="i-heroicons-photo" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </UPopover>
                        </div>
                    </div>

                    <Transition :name="contentTransitionName" mode="out-in">

                        <div v-if="contentTab === 'timeline'" key="timeline" class=" flex-1 flex flex-col">
                            <div
                                class="sticky top-16 border-b sm:mb-2 border-muted/50  bg-white backdrop-blur w-full flex flex-wrap items-center justify-center sm:justify-center gap-3 z-40">


                                <UTabs v-model="activeTimelineIndex" :items="timelineTabItems" size="md" :ui="{
                                    root: '',
                                    list: 'flex-nowrap gap-2 bg-transparent',
                                    indicator: 'bg-white border border-muted/50 shadow',
                                    trigger: ' data-[state=active]:text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:data-[state=inactive]:bg-neutral-50'
                                }" class="p-1.5 pb-0 w-full" />
                            </div>
                            <div
                                class="md:flex justify-center  gap-3 space-x-0 sm:p-3 sm:pt-1 p-0  border-muted/50 relative">

                                <div v-if="showImages" class="flex-1 min-w-60 sm:min-h-60">
                                    <div ref="heroPanelRef"
                                        class="relative w-full overflow-hidden ring-muted/50 ring shadow aspect-video bg-neutral-900 h-full max-h-150 sm:rounded-xl"
                                        :style="heroPanelStyle">
                                        <Transition name="image-fade">
                                            <div :key="heroImageKey" class="absolute inset-0">


                                                <template v-if="compareModeEnabled && comparisonImages">
                                                    <CustomImageComparisonSlider class="w-full h-full"
                                                        :framework-label="comparisonLabels?.leftFramework"
                                                        :time-label="comparisonLabels?.leftTime"
                                                        :framework-label2="comparisonLabels?.rightFramework"
                                                        :time-label2="comparisonLabels?.rightTime"
                                                        :use-method-labels="compareMode === 'methods'">
                                                        <template #first>
                                                            <div class="relative w-full h-full">
                                                                <img :src="comparisonImages.leftHidden || comparisonImages.left"
                                                                    class="w-full h-full object-cover absolute inset-0"
                                                                    loading="lazy" />
                                                                <img :src="comparisonImages.left"
                                                                    class="w-full h-full object-cover relative"
                                                                    loading="lazy" :style="{ opacity: treeFade }" />
                                                                <svg v-if="isBestandsgransVisible"
                                                                    class="absolute inset-0 w-full h-full pointer-events-none"
                                                                    viewBox="0 0 1500 844"
                                                                    preserveAspectRatio="xMidYMid slice">
                                                                    <image :href="bestandsgransSrc" x="0" y="0"
                                                                        width="1500" height="844"
                                                                        preserveAspectRatio="xMidYMid slice" />
                                                                </svg>
                                                                <div class="absolute inset-0 pointer-events-none">
                                                                    <template
                                                                        v-for="(card, idx) in (compareMode === 'beforeAfter' ? markerCardsBefore : markerCards)"
                                                                        :key="`overlay-compare-left-${card.key}`">
                                                                        <template
                                                                            v-if="card.key !== 'naturvardsarter' && isMarkerOverlayVisible(card.key) && card.overlayAvailable !== false">
                                                                            <template v-if="card.overlaySvgs?.length">
                                                                                <img v-for="(overlay, svgIdx) in card.overlaySvgs"
                                                                                    :key="`${card.key}-left-${svgIdx}`"
                                                                                    :src="overlay.src" :alt="card.title"
                                                                                    class="absolute inset-0 w-full h-full object-cover"
                                                                                    :style="{ opacity: overlay.opacity ?? 1 }" />
                                                                            </template>
                                                                            <img v-else-if="card.svgPath"
                                                                                :src="card.svgPath" :alt="card.title"
                                                                                class="absolute inset-0 w-full h-full object-cover"
                                                                                :style="{ opacity: card.overlayOpacity ?? 1 }" />
                                                                            <div v-else
                                                                                class="absolute rounded-md border border-neutral-100/60 bg-neutral-900/40 px-2 py-1 text-xs text-neutral-100 backdrop-blur"
                                                                                :style="markerOverlayStyle(idx)">
                                                                                {{ card.title }}
                                                                            </div>
                                                                        </template>
                                                                    </template>
                                                                </div>
                                                                <div v-if="compareLeftMarkerBadges.length"
                                                                    class="absolute top-2 left-2 z-20 flex flex-col gap-1">
                                                                    <template v-for="badge in compareLeftMarkerBadges"
                                                                        :key="`left-marker-badge-${badge.key}`">
                                                                        <UPopover v-if="badge.description" mode="hover"
                                                                            :content="{ side: 'right', align: 'start' }">
                                                                            <div
                                                                                class="inline-flex w-fit cursor-default items-center gap-1.5 rounded-md bg-neutral-950/55 px-2.5 py-1.5 text-sm text-neutral-50 backdrop-blur-xs pointer-events-auto">
                                                                                <UIcon :name="badge.icon"
                                                                                    class="size-4" />
                                                                                <span class="leading-none">{{
                                                                                    badge.label
                                                                                    }}</span>
                                                                            </div>
                                                                            <template #content>
                                                                                <p
                                                                                    class="max-w-64 p-2 text-sm text-neutral-700">
                                                                                    {{ badge.description }}
                                                                                </p>
                                                                            </template>
                                                                        </UPopover>
                                                                        <div v-else
                                                                            class="inline-flex w-fit cursor-default items-center gap-1.5 rounded-md bg-neutral-950/55 px-2.5 py-1.5 text-sm text-neutral-50 backdrop-blur-xs pointer-events-auto">
                                                                            <UIcon :name="badge.icon" class="size-4" />
                                                                            <span class="leading-none">{{ badge.label
                                                                                }}</span>
                                                                        </div>
                                                                    </template>
                                                                </div>
                                                                <NaturvardsOverlayLayer
                                                                    :visible="isMarkerOverlayVisible('naturvardsarter')"
                                                                    :framework="selectedFrameworkKey"
                                                                    :startskog="selectedStartskogTab"
                                                                    :time-label="compareMode === 'beforeAfter' ? 'innan' : timelineItems[activeTimelineIndex]?.tid" />
                                                            </div>
                                                        </template>
                                                        <template #second>
                                                            <div class="relative w-full h-full">
                                                                <img :src="comparisonImages.rightHidden || comparisonImages.right"
                                                                    class="w-full h-full object-cover absolute inset-0"
                                                                    loading="lazy" />
                                                                <img :src="comparisonImages.right"
                                                                    class="w-full h-full object-cover relative transition-opacity duration-500"
                                                                    loading="lazy" :style="{ opacity: treeFade }" />
                                                                <svg v-if="isBestandsgransVisible"
                                                                    class="absolute inset-0 w-full h-full pointer-events-none"
                                                                    viewBox="0 0 1500 844"
                                                                    preserveAspectRatio="xMidYMid slice">
                                                                    <image :href="bestandsgransSrc" x="0" y="0"
                                                                        width="1500" height="844"
                                                                        preserveAspectRatio="xMidYMid slice" />
                                                                </svg>
                                                                <div class="absolute inset-0 pointer-events-none">
                                                                    <template
                                                                        v-for="(card, idx) in (compareMode === 'methods' ? markerCardsCompare : markerCards)"
                                                                        :key="`overlay-compare-right-${card.key}`">
                                                                        <template
                                                                            v-if="card.key !== 'naturvardsarter' && isMarkerOverlayVisible(card.key) && card.overlayAvailable !== false">
                                                                            <template v-if="card.overlaySvgs?.length">
                                                                                <img v-for="(overlay, svgIdx) in card.overlaySvgs"
                                                                                    :key="`${card.key}-right-${svgIdx}`"
                                                                                    :src="overlay.src" :alt="card.title"
                                                                                    class="absolute inset-0 w-full h-full object-cover"
                                                                                    :style="{ opacity: overlay.opacity ?? 1 }" />
                                                                            </template>
                                                                            <img v-else-if="card.svgPath"
                                                                                :src="card.svgPath" :alt="card.title"
                                                                                class="absolute inset-0 w-full h-full object-cover"
                                                                                :style="{ opacity: card.overlayOpacity ?? 1 }" />
                                                                            <div v-else
                                                                                class="absolute rounded-md border border-neutral-100/60 bg-neutral-900/40 px-2 py-1 text-xs text-neutral-100 backdrop-blur"
                                                                                :style="markerOverlayStyle(idx)">
                                                                                {{ card.title }}
                                                                            </div>
                                                                        </template>
                                                                    </template>
                                                                </div>
                                                                <div v-if="compareRightMarkerBadges.length"
                                                                    class="absolute top-2 left-2 z-20 flex flex-col gap-1">
                                                                    <template v-for="badge in compareRightMarkerBadges"
                                                                        :key="`right-marker-badge-${badge.key}`">
                                                                        <UPopover v-if="badge.description" mode="hover"
                                                                            :content="{ side: 'right', align: 'start' }">
                                                                            <div
                                                                                class="inline-flex w-fit cursor-default items-center gap-1.5 rounded-md bg-neutral-950/55 px-2.5 py-1.5 text-sm text-neutral-50 backdrop-blur-xs pointer-events-auto">
                                                                                <UIcon :name="badge.icon"
                                                                                    class="size-4" />
                                                                                <span class="leading-none">{{
                                                                                    badge.label
                                                                                    }}</span>
                                                                            </div>
                                                                            <template #content>
                                                                                <p
                                                                                    class="max-w-64 p-2 text-sm text-neutral-700">
                                                                                    {{ badge.description }}
                                                                                </p>
                                                                            </template>
                                                                        </UPopover>
                                                                        <div v-else
                                                                            class="inline-flex w-fit cursor-default items-center gap-1.5 rounded-md bg-neutral-950/55 px-2.5 py-1.5 text-sm text-neutral-50 backdrop-blur-xs pointer-events-auto">
                                                                            <UIcon :name="badge.icon" class="size-4" />
                                                                            <span class="leading-none">{{ badge.label
                                                                                }}</span>
                                                                        </div>
                                                                    </template>
                                                                </div>
                                                                <NaturvardsOverlayLayer
                                                                    :visible="isMarkerOverlayVisible('naturvardsarter')"
                                                                    :framework="compareMode === 'methods' ? compareFrameworkKey : selectedFrameworkKey"
                                                                    :startskog="selectedStartskogTab"
                                                                    :time-label="compareMode === 'methods' ? comparisonTimelineItem?.tid : timelineItems[activeTimelineIndex]?.tid" />
                                                            </div>
                                                        </template>
                                                    </CustomImageComparisonSlider>
                                                </template>
                                                <template v-else-if="currentTimelineItem">
                                                    <img :src="currentTimelineItem.thumbHidden"
                                                        :alt="`Foto ${currentTimelineItem.tid}`"
                                                        class="w-full h-full object-cover absolute inset-0" />
                                                    <img :src="currentTimelineItem.thumb"
                                                        :alt="`Foto ${currentTimelineItem.tid}`"
                                                        class="w-full h-full object-cover relative transition-opacity duration-500"
                                                        :style="{ opacity: treeFade }" />
                                                    <svg v-if="isBestandsgransVisible"
                                                        class="absolute inset-0 w-full h-full pointer-events-none"
                                                        viewBox="0 0 1500 844" preserveAspectRatio="xMidYMid slice">
                                                        <image :href="bestandsgransSrc" x="0" y="0" width="1500"
                                                            height="844" preserveAspectRatio="xMidYMid slice" />
                                                    </svg>
                                                    <div class="absolute inset-0 pointer-events-none">
                                                        <template v-for="(card, idx) in markerCards"
                                                            :key="`overlay-${card.key}`">
                                                            <template
                                                                v-if="card.key !== 'naturvardsarter' && isMarkerOverlayVisible(card.key) && card.overlayAvailable !== false">
                                                                <template v-if="card.overlaySvgs?.length">
                                                                    <img v-for="(overlay, svgIdx) in card.overlaySvgs"
                                                                        :key="`${card.key}-single-${svgIdx}`"
                                                                        :src="overlay.src" :alt="card.title"
                                                                        class="absolute inset-0 w-full h-full object-cover"
                                                                        :style="{ opacity: overlay.opacity ?? 1 }" />
                                                                </template>
                                                                <img v-else-if="card.svgPath" :src="card.svgPath"
                                                                    :alt="card.title"
                                                                    class="absolute inset-0 w-full h-full object-cover"
                                                                    :style="{ opacity: card.overlayOpacity ?? 1 }" />
                                                                <div v-else
                                                                    class="absolute rounded-md border border-neutral-100/60 bg-neutral-900/40 px-2 py-1 text-xs text-neutral-100 backdrop-blur"
                                                                    :style="markerOverlayStyle(idx)">
                                                                    {{ card.title }}
                                                                </div>
                                                            </template>
                                                        </template>
                                                    </div>
                                                    <div v-if="singleImageMarkerBadges.length"
                                                        class="absolute top-2 left-2 z-20 flex flex-col gap-1">
                                                        <template v-for="badge in singleImageMarkerBadges"
                                                            :key="`single-marker-badge-${badge.key}`">
                                                            <UPopover v-if="badge.description" mode="hover"
                                                                :content="{ side: 'right', align: 'start' }">
                                                                <div
                                                                    class="inline-flex w-fit cursor-default items-center gap-1.5 rounded-md bg-neutral-950/55 px-2.5 py-1.5 text-sm text-neutral-50 backdrop-blur-xs pointer-events-auto">
                                                                    <UIcon :name="badge.icon" class="size-4" />
                                                                    <span class="leading-none">{{ badge.label }}</span>
                                                                </div>
                                                                <template #content>
                                                                    <p class="max-w-64 p-2 text-sm text-neutral-700">
                                                                        {{ badge.description }}
                                                                    </p>
                                                                </template>
                                                            </UPopover>
                                                            <div v-else
                                                                class="inline-flex w-fit cursor-default items-center gap-1.5 rounded-md bg-neutral-950/55 px-2.5 py-1.5 text-sm text-neutral-50 backdrop-blur-xs pointer-events-auto">
                                                                <UIcon :name="badge.icon" class="size-4" />
                                                                <span class="leading-none">{{ badge.label }}</span>
                                                            </div>
                                                        </template>
                                                    </div>
                                                    <NaturvardsOverlayLayer
                                                        :visible="isMarkerOverlayVisible('naturvardsarter')"
                                                        :framework="selectedFrameworkKey"
                                                        :startskog="selectedStartskogTab"
                                                        :time-label="currentTimelineItem?.tid" />
                                                    <!-- <div
                                                        class="absolute top-2 left-2 z-20 flex flex-col items-start gap-1 pointer-events-none">
                                                        <UBadge v-if="!isMobile" size="md"
                                                            class="backdrop-blur-xl bg-neutral-100/0 text-neutral-100 h-fit whitespace-nowrap mb-0.5">
                                                            {{ selectedMethod.title || selectedMethod.id }}
                                                        </UBadge>
                                                        <UBadge size="md"
                                                            class="backdrop-blur-xl bg-neutral-950/50 text-neutral-100 h-fit whitespace-nowrap">
                                                            {{
                                                                formatTimelineCurrentLabel(timelineItems[activeTimelineIndex]?.tid)
                                                            }}
                                                        </UBadge>
                                                    </div> -->
                                                </template>
                                                <ImagePlaceholder v-else />
                                            </div>
                                        </Transition>
                                        <div class="flex absolute right-3 bottom-3 z-20 gap-2">
                                            <UPopover :content="{
                                                align: 'end',
                                                side: 'bottom',
                                            }" :ui="{ content: 'p-0 max-w-[24rem] ' }">
                                                <UTooltip text="Markörer">
                                                    <UButton icon="i-heroicons-map-pin" variant="outline"
                                                        class="ring-muted/50" color="neutral" size="sm" />
                                                </UTooltip>
                                                <template #content>
                                                    <div class="max-h-[22rem] overflow-y-auto">
                                                        <ReuseMarkerCardsRow />
                                                    </div>
                                                </template>
                                            </UPopover>
                                            <UPopover :content="{
                                                align: 'end',
                                                side: 'bottom',
                                            }">
                                                <UTooltip text="Genomskinlighet">
                                                    <UButton icon="mingcute:tree-fill" variant="outline"
                                                        class="ring-muted/50" color="neutral" size="sm" />
                                                </UTooltip>
                                                <template #content>
                                                    <div class="p-3 flex  items-center gap-2 text-xs text-neutral-500 ">

                                                        <!-- <div class="flex ">
                                                <UIcon name="i-fluent-shape-organic-16-filled"
                                                    class="size-4 text-gray-300 z-20" />
                                                <UIcon name="i-fluent-shape-organic-16-filled"
                                                    class="size-4 -ml-3 text-signal-400 z-10" />
                                                <UIcon name="i-fluent-shape-organic-16-filled"
                                                    class="size-4 -ml-3 text-yellow-400" />
                                            </div> -->
                                                        <!-- <UIcon name="mingcute:tree-line" class="size-5 text-primary" /> -->

                                                        <USlider v-model="treeFade" :min="0" :max="1" :step="0.05"
                                                            class="w-32" color="primary" orientation="horizontal"
                                                            inverse size="xs" />
                                                        <!-- <UIcon name="mingcute:tree-fill" class="size-5 text-primary" /> -->



                                                    </div>
                                                </template>
                                            </UPopover>


                                            <UPopover :content="{
                                                align: 'end',
                                                side: 'bottom',
                                            }">
                                                <UTooltip text="Legend">
                                                    <UButton icon="i-fluent-shape-organic-16-filled" variant="outline"
                                                        class="ring-muted/50" color="neutral" size="sm" />
                                                </UTooltip>
                                                <template #content>
                                                    <div class="flex flex-col gap-2 p-3">
                                                        <div class="flex w-full">
                                                            <UIcon name="i-fluent-shape-organic-16-filled"
                                                                class="size-6 text-gray-300 z-20" />
                                                            <UIcon name="i-fluent-shape-organic-16-filled"
                                                                class="size-6 -ml-4 text-gray-400 z-10" />
                                                            <UIcon name="i-fluent-shape-organic-16-filled"
                                                                class="size-6 -ml-4 mr-4 text-gray-500" />
                                                            <h1 class="font-medium">Mykorrhizasvampar</h1>
                                                        </div>
                                                        <div class="flex w-full justify-between">
                                                            <UIcon name="i-fluent-shape-organic-16-filled"
                                                                class="size-6 text-signal-400" />

                                                            <h1 class="font-medium">Naturvårdssvampar</h1>
                                                        </div>
                                                        <div class="flex w-full justify-between">
                                                            <UIcon name="i-fluent-shape-organic-16-filled"
                                                                class="size-6 text-yellow-400" />

                                                            <h1 class="font-medium">Matsvampar</h1>
                                                        </div>

                                                    </div>
                                                </template>
                                            </UPopover>
                                        </div>



                                    </div>
                                    <div v-if="!isMobile" class="w-full flex justify-center py-1">
                                        <button type="button"
                                            class="h-1 w-16 transition-all rounded-full bg-neutral-300/90 hover:bg-neutral-400 cursor-row-resize"
                                            aria-label="Ändra bildhöjd" @pointerdown.prevent="startHeroResize" />
                                    </div>
                                </div>
                                <!-- <UButton v-if="!isMobile" size="sm" color="neutral"
                                    class="absolute top-3 right-5 ring-muted/50 z-20"
                                    :label="showSharedChart ? 'Dölj diagram' : 'Visa diagram'" variant="outline"
                                    @click="showSharedChart = !showSharedChart" /> -->
                                <div v-if="!isMobile && showChart && showSharedChart"
                                    class="relative flex-1 min-w-60 sm:min-h-60 border-muted/50">

                                    <ForestryChartMain :selectedChart="chartSelected" class="p-2 h-full bg-white"
                                        @update:selectedChart="val => chartSelected = val"
                                        :parentSelectedFrameworks="chartFrameworks"
                                        :currentStartskog="selectedStartskogTab" :currentTimeValue="currentTimelineTime"
                                        preserveFrameworkOrder :showControls="true" :showInlineTabs="true"
                                        :hideGrupperInSelect="true" />
                                </div>
                            </div>
                            <div v-if="isMobile && comparisonTimelineItem"
                                class=" bg-neutral-50/50 border-t border-muted/50 ">
                                <UTabs v-model="activeTimelineSummaryIndex" :items="timelineSummaryTabItems" size="sm"
                                    :ui="{
                                        root: 'p-2 pb-0',
                                        list: 'grid grid-cols-2 gap-1 p-1 bg-transparent',
                                        indicator: 'bg-white border border-muted/50 shadow',
                                        trigger: 'text-xs data-[state=active]:text-neutral-800'
                                    }" />
                                <UCarousel ref="timelineSummaryCarousel" :items="timelineSummaryCarouselItems" :ui="{


                                }" class="w-full" @select="handleTimelineSummarySelect">
                                    <template #default="{ item }">
                                        <div class="space-y-2 p-6 pt-2 min-h-44">
                                            <!-- <p class="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                                                {{ item.title || selectedMethodLabel }}
                                            </p> -->
                                            <h3 class="text-xl font-semibold text-neutral-900">
                                                {{ item.timeLabel }}
                                            </h3>
                                            <p class="text-md text-muted">
                                                {{ item.skog }}
                                            </p>
                                            <p class="text-md">{{ item.svamp }}</p>
                                        </div>
                                    </template>
                                </UCarousel>
                            </div>
                            <div v-else class="grid lg:grid-cols-2 bg-neutral-50/50 border-t border-muted/50">
                                <div class="space-y-2 p-6 ">
                                    <p class="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                                        {{ selectedMethod.title || selectedMethod.id }}
                                    </p>
                                    <h3 class="text-xl font-semibold text-neutral-900">
                                        {{ formatTimelineCurrentLabel(timelineItems[activeTimelineIndex]?.tid) }}
                                    </h3>
                                    <p class="text-md text-muted">
                                        {{ timelineItems[activeTimelineIndex]?.skog }}
                                    </p>
                                    <p class="text-md">{{ timelineItems[activeTimelineIndex]?.svamp }}</p>
                                </div>
                                <div v-if="comparisonTimelineItem"
                                    class="space-y-2 p-6 border-dashed border-l-2 border-neutral-200  bg-neutral-50">
                                    <p class="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                                        {{ compareMethodLabel }}
                                    </p>
                                    <h3 class="text-xl font-semibold text-neutral-900">
                                        {{ formatTimelineCurrentLabel(comparisonTimelineItem?.tid) }}
                                    </h3>
                                    <p class="text-md text-muted">
                                        {{ comparisonTimelineItem?.skog }}
                                    </p>
                                    <p class="text-md">{{ comparisonTimelineItem?.svamp }}</p>
                                </div>
                            </div>

                        </div>
                        <div v-else key="method" class="flex-1 flex flex-col sm:gap-6 gap-3">
                            <div class="overwflow-visible scrollbar-hidden">
                                <ReuseMethodPanelBody />
                            </div>
                            <!-- <ReuseMethodPanelFooter /> -->
                        </div>
                    </Transition>
                    <ReuseMarkerInfoPanel />
                    <USlideover v-model:open="methodInfoPanelOpen" title="Om metoden" modal direction="right"
                        :handle="false" :ui="{
                            content: 'sm:max-w-md bg-white scrollbar-hidden',
                            body: ' scrollbar-hidden',
                            header: 'items-center justify-between',
                            container: 'scrollbar-hidden',
                        }">
                        <!-- <template #title>
                            
                        </template> -->
                        <template #body>
                            <ReuseMethodHeroImage class="mb-6 rounded-lg overflow-hidden ring ring-muted/50" />

                            <h1 class="text-3xl font-medium text-neutral-800">{{ selectedMethod.title }}</h1>

                            <div class="space-y-4 ">

                                <div
                                    class="relative text-md text-neutral-700 text-pretty rounded-md overflow-hidden group">
                                    <div>
                                        <div>
                                            <ContentRenderer v-if="methodOmSection" :value="methodOmSection" />
                                        </div>
                                        <h3 class="text-xl font-semibold text-neutral-800 mt-2 mb-4">
                                            Påverkan
                                            på mykorrhiza</h3>
                                        <div class="text-pretty rounded-md ">
                                            <ContentRenderer v-if="methodSvampSection" :value="methodSvampSection" />
                                        </div>
                                    </div>
                                </div>
                                <!-- <div class="flex w-full justify-center">
                                    <ImpactDonut :value="impact.value" :label="impact.label" :tone="impact.tone"
                                        :comparison-value="comparisonImpact?.value"
                                        :comparison-tone="comparisonImpact?.tone" :method-label="selectedMethodLabel"
                                        :comparison-label="comparisonMethodLabel"
                                        :comparison-impact-label="comparisonImpact?.label" />
                                </div> -->
                            </div>
                        </template>
                    </USlideover>
                </div>
            </UPage>
        </UContainer>
        <USlideover :modal="false" :dismissible="false" v-model:open="chartSlideoverOpen" side="right"
            :ui="{ body: 'p-2 lg:p-2' }">
            <template #title>Diagram</template>
            <template #body>
                <ForestryChartMain :selectedChart="chartSelected" @update:selectedChart="val => chartSelected = val"
                    :parentSelectedFrameworks="chartFrameworks" :currentStartskog="selectedStartskogTab"
                    :currentTimeValue="currentTimelineTime" preserveFrameworkOrder :showControls="true"
                    :showInlineTabs="true" :hideGrupperInSelect="true" />
            </template>
        </USlideover>
        <!-- <Motion :initial="{
            opacity: 0,
            transform: 'translatex(-10px)'
            // filter: 'blur(20px)'
        }" :animate="{
            opacity: 1,
            transform: 'translateY(0px)'
            // filter: 'blur(0px)'
        }" :transition="{
            duration: 0.5,
            delay: 0.8
        }">

            <UContainer>
                <USeparator class="my-6" v-if="isMobile" />

                <div
                    class="mb-4 flex flex-col sm:flex-row gap-1.5 p-1 rounded-lg ring ring-muted/50 sm:w-fit bg-muted/30">
                    <UModal :fullscreen="isMobile ? true : false" :title="faktaDoc?.title ?? ''"
                        :description="faktaDoc?.description ?? ''" :ui="{
                            header: 'shrink-0',
                        }">
                        <UAlert icon="i-heroicons-book-open" color="neutral" variant="outline" title="Fakta i korthet"
                            class="sm:w-fit shadow ring-muted/50 hover:opacity-85 hover:cursor-pointer" />
                        <template #body>
                            <ContentRenderer v-if="faktaDoc" :value="faktaDoc" />
                        </template>
                    </UModal>
                    <UModal :fullscreen="isMobile ? true : false" :title="underlagDoc?.title"
                        :description="underlagDoc?.description" :ui="{
                            header: 'shrink-0',
                        }">
                        <UAlert icon="i-heroicons-document-magnifying-glass" color="neutral" variant="outline"
                            :title="underlagDoc?.title"
                            class="sm:w-fit shadow ring-muted/50 hover:opacity-85 hover:cursor-pointer" />
                        <template #body>
                            <ContentRenderer v-if="underlagDoc" :value="underlagDoc" />
                        </template>
                    </UModal>
                </div>
            </UContainer>
        </Motion> -->
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, watchEffect, onMounted, onBeforeUnmount, nextTick, reactive } from 'vue'
import type { TabsItem } from '@nuxt/ui'
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'
import { useOnboardingStore } from '~/stores/onboardingStore'
import { useOverlayRegistry } from '~/composables/useOverlayRegistry'
import { useAsyncData, useRoute, useRouter, navigateTo } from '#app'

definePageMeta({
    pageTransition: false,
    key: 'skogsskotsel-method',
})

const treeFade = ref(0.8)
const showMethodOmExtras = ref(false)
const isMethodImpactExpanded = ref(false)

type ChartInfoKey = 'skogsskole' | 'grupper' | 'matsvampar' | 'rodlistade'
const chartInfoExpanded = reactive<Record<ChartInfoKey, boolean>>({
    skogsskole: false,
    grupper: false,
    matsvampar: false,
    rodlistade: false,
})
const toggleChartInfoExpansion = (key: ChartInfoKey) => {
    chartInfoExpanded[key] = !chartInfoExpanded[key]
}
const [DefineMethodPanelBody, ReuseMethodPanelBody] = createReusableTemplate()
const [DefineMethodPanelFooter, ReuseMethodPanelFooter] = createReusableTemplate()
const [DefineMarkerCardsRow, ReuseMarkerCardsRow] = createReusableTemplate()
const [DefineMarkerInfoPanel, ReuseMarkerInfoPanel] = createReusableTemplate()
const [DefineMarkerCardHeader, ReuseMarkerCardHeader] = createReusableTemplate()
const [DefineMarkerCardTrigger, ReuseMarkerCardTrigger] = createReusableTemplate()
const [DefineMarkerCardBody, ReuseMarkerCardBody] = createReusableTemplate()
const [DefineMethodHeroImage, ReuseMethodHeroImage] = createReusableTemplate()
const markerPanelOpen = reactive<Record<string, boolean>>({})
const markerPinned = reactive<Record<string, boolean>>({})
const markerPreview = reactive<Record<string, boolean>>({})
const isMarkerOverlayVisible = (key: string) => markerPinned[key] || markerPreview[key]
const selectedMarkerKey = ref<string | null>(null)
const markerSlideoverPinned = ref(false)
const methodInfoPanelOpen = ref(false)
const selectedMarkerCard = computed(() =>
    markerCards.value.find(card => card.key === selectedMarkerKey.value) ?? null
)
const markerPanelOpenSingle = ref(false)
watch(markerPanelOpenSingle, (open) => {
    if (open) return
    if (selectedMarkerKey.value) {
        markerPanelOpen[selectedMarkerKey.value] = false
        selectedMarkerKey.value = null
    }
})
const openMarkerPanel = (key: string) => {
    Object.keys(markerPanelOpen).forEach(existing => {
        markerPanelOpen[existing] = false
    })
    markerPanelOpen[key] = true
    markerPinned[key] = true
    selectedMarkerKey.value = key
    markerPanelOpenSingle.value = true
}
const openMarkerInfo = (key: string) => {
    selectedMarkerKey.value = key
    markerPanelOpenSingle.value = true
}
const closeMarkerPanel = () => {
    markerPanelOpenSingle.value = false
}
const markerTriggerMenu = (card: { key: string }) => ([
    [
        {
            label: markerPinned[card.key] ? 'Dölj markör' : 'Visa markör',
            icon: markerPinned[card.key] ? 'i-heroicons-eye-slash' : 'i-heroicons-eye',
            onSelect: () => {
                markerPinned[card.key] = !markerPinned[card.key]
            }
        }
    ]
])
const markerOverlayStyle = (idx: number) => ({
    top: `${12 + (idx % 4) * 28}px`,
    left: `${12 + Math.floor(idx / 4) * 140}px`
})
const expandedMarker = ref<string | null>(null)
const methodImage = (method: any, variant: 'thumb' | 'card' | 'detail') => {
    const src = method?.image ?? '';
    const base = src.split('/').pop()?.split('.')[0] ?? '';
    const size = variant === 'thumb'
        ? '64'
        : variant === 'detail'
            ? '800x400'
            : '300x160';
    return base ? `/images/metoder/web/${base}_${size}.webp` : src;
};

const isMobile = useMediaQuery('(max-width: 1024px)')
const isDesktop = useMediaQuery('(min-width: 640px)')
const compareFrameworkPopoverOpen = ref(false)
const contentTab = ref<'timeline' | 'method'>('method')
const contentTransitionName = computed(() =>
    contentTab.value === 'timeline' ? 'slide-left-fade' : 'slide-right-fade'
)
const contentTabItems = [
    { label: 'Diagram', value: 'method', icon: 'i-carbon-chart-line' },
    { label: 'Tidslinje', value: 'timeline', icon: 'i-tabler-timeline-event' },

]
const showMobileStickySelect = ref(false)
const bestandsgransVisible = ref(false)
const bestandsgransPreview = ref(false)
const isBestandsgransVisible = computed(() => bestandsgransVisible.value || bestandsgransPreview.value)
const kanteffektOldVisible = ref(true)
const bestandsgransSrc = '/svg/best%C3%A5ndsgr%C3%A4ns.svg'
let __scrollHandler: (() => void) | null = null
const evaluateStickySelect = () => {
    if (typeof window === 'undefined') return
    if (!isMobile.value) {
        showMobileStickySelect.value = false
        return
    }
    const threshold = window.innerHeight * 0.5
    showMobileStickySelect.value = window.scrollY > threshold
}
onMounted(() => {
    if (typeof window === 'undefined') return
    evaluateStickySelect()
    __scrollHandler = () => evaluateStickySelect()
    window.addEventListener('scroll', __scrollHandler, { passive: true })
})
onBeforeUnmount(() => {
    if (__scrollHandler && typeof window !== 'undefined') {
        window.removeEventListener('scroll', __scrollHandler)
    }
    __scrollHandler = null
})
watch(isMobile, () => {
    if (isMobile.value) {
        evaluateStickySelect()
    } else {
        showMobileStickySelect.value = false
    }
})

const modelOpen = ref(false)
const chartComponent = ref<{ setSelectedChart?: (value: string) => void } | null>(null)
const chartSelected = ref<string>('skogsskole')
const chartSection = ref<HTMLElement | null>(null)
const MODAL_SCROLL_CLASS = 'modal-no-scrollbar'

const updateScrollState = (open: boolean) => {
    if (!process.client) return
    const root = document.documentElement
    if (open) {
        root.classList.add(MODAL_SCROLL_CLASS)
    } else {
        root.classList.remove(MODAL_SCROLL_CLASS)
    }
}

watch(modelOpen, (open) => updateScrollState(open))
onBeforeUnmount(() => updateScrollState(false))
onBeforeUnmount(() => stopHeroResize())
onBeforeUnmount(() => {
    naturvardsModalOpen.value = false
    startskogModalOpen.value = false
    overlayRegistry?.closeAll?.()
})

const onboardingStore = useOnboardingStore()
const route = useRoute()
const router = useRouter()

const { data: page } = await useAsyncData('skogsskotsel', () => queryCollection('skogsskotsel').first())
const { data: skogsskotselInfo } = await useAsyncData('skogsskotsel-info', () =>
    queryCollection('skogsskotselInfo').all()
)
const contentSlug = computed(() => normalizeFrameworkId(String(route.params.id || '')))
const contentPath = computed(() => `/skogsskotsel/frameworks/${contentSlug.value || route.params.id}`)
const { data: frameworkDoc } = await useAsyncData(
    'forestry-framework-doc',
    () => queryCollection('forestryFrameworks').path(contentPath.value).first(),
    { watch: [contentPath] }
)
const { data: surround } = await useAsyncData(
    'forestry-framework-surround',
    () => queryCollectionItemSurroundings('forestryFrameworks', contentPath.value, {
        fields: ['description']
    }),
    { watch: [contentPath] }
)
const { data: methodIndexDocs } = await useAsyncData(
    'skotselmetod-index',
    () => queryCollection('skotselmetodSections').where('section', '=', 'om_metoden').all()
)
if (!page.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Page not found',
        fatal: true
    })
}
const faktaDoc = computed(() => (skogsskotselInfo.value ?? []).find(doc => doc.key === 'fakta') ?? null)
const underlagDoc = computed(() => (skogsskotselInfo.value ?? []).find(doc => doc.key === 'underlag') ?? null)
interface Method {
    index?: number
    id: string
    title: string
    image: string
    shortdescription: string
    type?: string
    icon?: string
    impactLabel?: string
    impactTone?: 'low' | 'medium' | 'high'
    impactColor?: string
}

const { data: methodImpactDocs } = await useAsyncData(
    'skotselmetod-impacts',
    () => queryCollection('skotselmetodSections').where('section', '=', 'paverkan_pa_svamp').all()
)

const methods = computed<Method[]>(() => {
    const list = (methodIndexDocs.value as any[]) || []
    const impacts = (methodImpactDocs.value as any[]) || []
    const impactByMethod = new Map<string, any>()
    for (const doc of impacts) {
        if (doc?.methodId) impactByMethod.set(doc.methodId, doc)
    }
    return list
        .map(doc => ({
            index: doc.index,
            id: doc.methodId,
            title: doc.methodTitle ?? doc.title ?? doc.methodId,
            image: doc.image ?? '',
            shortdescription: doc.shortdescription ?? '',
            type: doc.type,
            icon: doc.icon,
            impactLabel: impactByMethod.get(doc.methodId)?.impactLabel ?? '',
            impactTone: impactByMethod.get(doc.methodId)?.impactTone ?? 'medium',
            impactColor: impactByMethod.get(doc.methodId)?.impactTone === 'low'
                ? 'success'
                : impactByMethod.get(doc.methodId)?.impactTone === 'high'
                    ? 'error'
                    : 'warning',
        }))
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
})
const frameworkOptions = computed(() =>
    methods.value.map((method, index) => ({
        label: method.title,
        value: index,
        icon: method.icon,
        description: method.shortdescription
    }))
)
const compareFrameworkOptions = computed(() =>
    frameworkOptions.value.filter(option => option.value !== selectedFrameworkIndex.value)
)

const emptyMethod: Method = {
    id: '',
    title: '',
    image: '',
    shortdescription: '',
}
const selectedId = ref<string | null>(null)
const routeMethodId = computed(() => (route.params.id as string) || '')

const syncSelectedFromRoute = () => {
    if (routeMethodId.value && selectedId.value !== routeMethodId.value) {
        selectedId.value = routeMethodId.value
    }
}

watch(routeMethodId, syncSelectedFromRoute, { immediate: true })
watch(methods, () => syncSelectedFromRoute())
watchEffect(() => {
    if (methods.value.length && routeMethodId.value && !methods.value.some(m => m.id === routeMethodId.value)) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Method not found',
            fatal: true
        })
    }
})

watch(selectedId, async (newVal, oldVal) => {
    if (newVal && newVal !== routeMethodId.value) {
        const { entry, ...rest } = route.query
        await navigateTo({ path: `/skogsskotsel/${newVal}`, query: rest }, { replace: true, external: false, scroll: false })
    }
})

const selectedMethod = computed<Method>(() => {
    const list = methods.value
    if (!list.length) {
        return emptyMethod
    }
    if (!selectedId.value) return emptyMethod
    return list.find(method => method.id === selectedId.value) ?? emptyMethod
})

const { data: methodSectionDocs, pending: methodSectionPending } = await useAsyncData(
    'skotselmetod-sections',
    () => {
        const id = selectedId.value || routeMethodId.value
        if (!id) return []
        return queryCollection('skotselmetodSections').where('methodId', '=', id).all()
    },
    { watch: [selectedId, routeMethodId] }
)

const methodOmDoc = computed(() =>
    (methodSectionDocs.value as any[])?.find(doc => doc.section === 'om_metoden') ?? null
)
const methodSvampDoc = computed(() =>
    (methodSectionDocs.value as any[])?.find(doc => doc.section === 'paverkan_pa_svamp') ?? null
)
const methodMatsvampDoc = computed(() =>
    (methodSectionDocs.value as any[])?.find(doc => doc.section === 'matsvamp') ?? null
)
const methodNaturvardDoc = computed(() =>
    (methodSectionDocs.value as any[])?.find(doc => doc.section === 'naturvardssvamp') ?? null
)
const methodMangdMykorrhizaDoc = computed(() =>
    (methodSectionDocs.value as any[])?.find(doc => doc.section === 'mangd_mykorrhiza') ?? null
)
const methodSvampgrupperDoc = computed(() =>
    (methodSectionDocs.value as any[])?.find(doc => doc.section === 'svampgrupper') ?? null
)
const selectedFrameworkIndex = computed<number | null>({
    get() {
        if (!selectedId.value) return null
        const idx = methods.value.findIndex(method => method.id === selectedId.value)
        return idx >= 0 ? idx : null
    },
    set(value) {
        if (typeof value === 'number' && methods.value[value]) {
            selectedId.value = methods.value[value].id
        }
    }
})
const selectedCompareFrameworkIndex = computed(() => {
    if (!compareMethodResolved.value) return null
    const idx = methods.value.findIndex(method => method.id === compareMethodResolved.value)
    return idx >= 0 ? idx : null
})

const breadcrumbLinks = computed(() => {
    const methodLabel = selectedMethod.value.title || selectedMethod.value.id || routeMethodId.value || 'Metod'
    const methodTo = selectedId.value ? `/skogsskotsel/${selectedId.value}` : undefined
    return [
        { label: 'Skogsskötsel', to: '/skogsskotsel' },
        { label: methodLabel, to: methodTo },
    ]
})

const chartSlideoverOpen = ref(false)
const currentTimelineItem = computed(() => timelineItems.value[activeTimelineIndex.value])
const timelineTabItems = computed(() =>
    timelineItems.value.map((item, index) => ({
        label: formatTimelineButtonLabel(item.tid),
        value: index
    }))
)
const heroImageKey = computed(() => {
    if (compareModeEnabled.value && comparisonImages.value) {
        return [
            'compare',
            comparisonImages.value.left,
            comparisonImages.value.right,
            selectedStartskogTab.value,
            compareMode.value,
            compareMethodId.value
        ].join('|')
    }
    const item = currentTimelineItem.value
    return ['single', item?.thumbHidden, item?.thumb, selectedStartskogTab.value, activeTimelineIndex.value].join('|')
})

const heroBackgroundStyle = computed(() => {
    let url: string | undefined
    if (compareModeEnabled.value && comparisonImages.value) {
        url = comparisonImages.value.left || comparisonImages.value.leftHidden || comparisonImages.value.right
    } else if (currentTimelineItem.value) {
        url = currentTimelineItem.value.thumb || currentTimelineItem.value.thumbHidden
    }
    return url ? { backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}
})
const heroPanelRef = ref<HTMLElement | null>(null)
const heroPanelHeight = ref<number | null>(null)
const heroResizeState = reactive({
    active: false,
    startY: 0,
    startHeight: 0,
})
const minHeroPanelHeight = 240
const getMaxHeroPanelHeight = () => {
    if (typeof window === 'undefined') return 600
    return Math.max(360, Math.floor(window.innerHeight * 0.8))
}
const heroPanelStyle = computed(() => {
    const baseStyle = heroBackgroundStyle.value as Record<string, string>
    if (!heroPanelHeight.value) return baseStyle
    return {
        ...baseStyle,
        height: `${heroPanelHeight.value}px`
    }
})
const clampHeroPanelHeight = (value: number) =>
    Math.min(getMaxHeroPanelHeight(), Math.max(minHeroPanelHeight, value))
const stopHeroResize = () => {
    heroResizeState.active = false
    if (typeof window === 'undefined') return
    window.removeEventListener('pointermove', onHeroResizeMove)
    window.removeEventListener('pointerup', stopHeroResize)
    window.removeEventListener('pointercancel', stopHeroResize)
}
const onHeroResizeMove = (event: PointerEvent) => {
    if (!heroResizeState.active) return
    const nextHeight = heroResizeState.startHeight + (event.clientY - heroResizeState.startY)
    heroPanelHeight.value = clampHeroPanelHeight(nextHeight)
}
const startHeroResize = (event: PointerEvent) => {
    if (isMobile.value) return
    const panel = heroPanelRef.value
    if (!panel || typeof window === 'undefined') return
    heroResizeState.active = true
    heroResizeState.startY = event.clientY
    heroResizeState.startHeight = panel.offsetHeight
    heroPanelHeight.value = panel.offsetHeight
    window.addEventListener('pointermove', onHeroResizeMove)
    window.addEventListener('pointerup', stopHeroResize)
    window.addEventListener('pointercancel', stopHeroResize)
}
const compareModeEnabled = ref(false)
const compareMode = ref<'beforeAfter' | 'methods'>('beforeAfter')
const compareMethodId = ref<string | null>(null)
const compareModeItems = [
    { label: 'Före/Efter', value: 'beforeAfter' },
    { label: 'Metoder', value: 'methods' }
]
const displayMode = ref<'images' | 'both' | 'chart'>('both')
const compareEnabled = computed({
    get: () => compareModeEnabled.value,
    set: (val: boolean) => {
        compareModeEnabled.value = val
        if (!val) compareMode.value = 'beforeAfter'
    }
})
const compareOptions = computed(() => compareModeItems)
const displayModeLabel = computed(() => {
    if (displayMode.value === 'images') return 'Bilder'
    if (displayMode.value === 'chart') return 'Diagram'
    return 'Bilder + Diagram'
})
const showImages = computed(() => displayMode.value !== 'chart')
const showChart = computed(() => displayMode.value !== 'images')
const showSharedChart = ref(true)
const setCompareMode = (enabled: boolean) => {
    compareEnabled.value = enabled
}
const setCompareFrameworkIndex = (index: number | null) => {
    if (index === null) {
        compareModeEnabled.value = false
        compareMode.value = 'beforeAfter'
        compareMethodId.value = null
        return
    }
    const method = methods.value[index]
    if (!method) return
    compareModeEnabled.value = true
    compareMode.value = 'methods'
    compareMethodId.value = method.id
}
const immersiveAsideOpen = ref(false)
const immersivePageUi = computed(() => {
    if (immersiveAsideOpen.value) {
        return {
            left: 'lg:col-span-3',
            root: ' lg:gap-0',
            center: '  border-muted lg:col-span-7 flex flex-col',
        }
    }
    return {
        root: 'lg:grid-cols-10 lg:gap-0',
        center: 'lg:col-span-10  border-muted flex flex-col',
    }
})
const compareMethodResolved = computed(() => {
    if (compareMode.value !== 'methods') return null
    if (compareMethodId.value && compareMethodId.value !== selectedMethod.value.id) {
        return compareMethodId.value
    }
    const alt = methods.value.find(m => m.id !== selectedMethod.value.id)
    return alt?.id ?? null
})
const compareMethod = computed(() =>
    methods.value.find(method => method.id === compareMethodResolved.value) ?? null
)
const selectedMethodLabel = computed(() =>
    selectedMethod.value.title || selectedMethod.value.id || 'Vald metod'
)
const comparisonMethodLabel = computed(() =>
    compareMethod.value?.title || compareMethodResolved.value || 'Påverkan'
)
const chartFrameworks = computed(() => {
    const primary = selectedFrameworkKey.value
    if (compareModeEnabled.value && compareMode.value === 'methods' && compareMethodResolved.value) {
        return [primary, compareFrameworkKey.value]
    }
    return [primary]
})

interface TimelineEntry {
    startskog: string
    atgard: string
    tid: string
    skog: string
    svamp: string
}

interface TimelineDoc {
    id: string
    entries: TimelineEntry[]
}

const normalizeTimelineStartskog = (value: string) => {
    const lower = value?.toLowerCase?.() ?? ''
    if (lower === 'intekalavverkad') return 'naturskog'
    if (lower === 'produktionsskog') return 'produktionsskog_'
    return value
}

const normalizeTimelineAtgard = (value: string) => {
    const lower = value?.toLowerCase?.() ?? ''
    if (lower === 'ingenatgard') return 'naturskydd'
    if (lower === 'skarmtrad') return 'skärmträd'
    if (lower === 'bladning') return 'blädning'
    return value
}

const normalizeTimeToken = (t: string | number) => {
    const s = String(t).trim().toLowerCase()
    if (s.includes('efter')) return 'efter'
    if (s.includes('innan')) return 'före'
    if (s.includes('före') || s.includes('fore')) return 'före'
    const nums = s.replace(/[^0-9]/g, '')
    return nums || s
}

const makeThumbSrc = (atgard: string, tid: string | number, startskog: string, visibility: 'visa_visa' | 'visa_dölj' = 'visa_visa') => {
    const slug = (v: string) => v
        .trim()
        .toLowerCase()
        // keep Swedish chars, collapse everything else to underscores
        .replace(/[^a-z0-9_åäö]+/g, '_')
        .replace(/_+/g, '_')

    const fileName = `${slug(atgard)}_${normalizeTimeToken(String(tid))}_${visibility}_${slug(startskog)}.webp`
    return `/images/thumbnails/${fileName}`
}

const { data: forestryTimeline } = await useAsyncData<TimelineDoc | null>('forestry-timeline-skogsskotsel', () =>
    queryCollection('forestryTimelines').first()
)

interface TimelineDisplayItem {
    tid: string
    skog: string
    svamp: string
    thumb: string
    thumbHidden: string
}


const startskogOptions = [
    { label: 'Inte tidigare kalavverkad', value: 'naturskog' },
    { label: 'Tidigare kalavverkad', value: 'produktionsskog_' },
]

const startskogTabs = startskogOptions.map(option => ({
    label: option.label,
    value: option.value,
    icon: option.value === 'naturskog' ? 'i-material-symbols-light-forest-rounded' : 'i-ph-farm'
}))

const selectedStartskogTab = ref(startskogTabs[onboardingStore.selectedStartskog ?? 1]?.value || startskogTabs[1].value)
const selectedStartskogIcon = computed(() =>
    startskogTabs.find(tab => tab.value === selectedStartskogTab.value)?.icon
)
const selectedStartskogOption = computed(() =>
    startskogTabs.find(tab => tab.value === selectedStartskogTab.value)
)
const startskogPreviouslyClearcut = computed({
    get: () => selectedStartskogTab.value === 'produktionsskog_',
    set: (val: boolean) => {
        selectedStartskogTab.value = val ? 'produktionsskog_' : 'naturskog'
    }
})

watch(() => onboardingStore.selectedStartskog, (val) => {
    const option = startskogOptions[val ?? 0]
    if (option && option.value !== selectedStartskogTab.value) {
        selectedStartskogTab.value = option.value
    }
}, { immediate: true })

function handleStartskogTabChange(value: string) {
    selectedStartskogTab.value = value
    const index = startskogOptions.findIndex(option => option.value === value)
    if (index !== -1) {
        onboardingStore.selectedStartskog = index
    }
}

const selectedStartskogLabel = computed(() => startskogOptions.find(opt => opt.value === selectedStartskogTab.value)?.label ?? '')

const timelineItems = computed<TimelineDisplayItem[]>(() => {
    const list = forestryTimeline.value?.entries ?? []
    const method = selectedMethod.value.id
    const canonicalMethod = normalizeTimelineAtgard(method)
    return list
        .map((entry) => ({
            ...entry,
            startskog: normalizeTimelineStartskog(entry.startskog),
            atgard: normalizeTimelineAtgard(entry.atgard)
        }))
        .filter((entry) => entry.startskog === normalizeTimelineStartskog(selectedStartskogTab.value) && entry.atgard === canonicalMethod)
        .map((entry) => ({
            tid: entry.tid,
            skog: entry.skog,
            svamp: entry.svamp,
            thumb: makeThumbSrc(entry.atgard, entry.tid, entry.startskog, 'visa_visa'),
            thumbHidden: makeThumbSrc(entry.atgard, entry.tid, entry.startskog, 'visa_dölj')
        }))
})

const compareMethodOptions = computed(() =>
    methods.value
        .filter(method => method.id !== selectedMethod.value.id)
        .map(method => ({ label: method.title, value: method.id }))
)

const timelinePreloadLinks = computed(() => {
    const links: { rel: string; as?: string; href: string }[] = []
    const items = timelineItems.value
    if (!items.length) return links

    // current first, then remaining in order
    const ordered = [
        items[activeTimelineIndex.value],
        ...items.filter((_, idx) => idx !== activeTimelineIndex.value)
    ].filter(Boolean)

    for (const item of ordered) {
        if (item?.thumb) {
            links.push({ rel: 'prefetch', as: 'image', href: item.thumb })
        }
        if (item?.thumbHidden) {
            links.push({ rel: 'prefetch', as: 'image', href: item.thumbHidden })
        }
    }
    return links
})

const timelineItemsForMethod = (methodId: string) => {
    const list = forestryTimeline.value?.entries ?? []
    const canonicalMethod = normalizeTimelineAtgard(methodId)
    return list
        .map((entry) => ({
            ...entry,
            startskog: normalizeTimelineStartskog(entry.startskog),
            atgard: normalizeTimelineAtgard(entry.atgard)
        }))
        .filter((entry) => entry.startskog === normalizeTimelineStartskog(selectedStartskogTab.value) && entry.atgard === canonicalMethod)
        .map((entry) => ({
            tid: entry.tid,
            skog: entry.skog,
            svamp: entry.svamp,
            thumb: makeThumbSrc(entry.atgard, entry.tid, entry.startskog, 'visa_visa'),
            thumbHidden: makeThumbSrc(entry.atgard, entry.tid, entry.startskog, 'visa_dölj')
        }))
}

const timelineCarousel = ref<any>(null)
const activeTimelineIndex = ref(0)

function handleTimelinePrev() {
    timelineCarousel.value?.emblaApi?.scrollPrev?.()
}

function handleTimelineNext() {
    timelineCarousel.value?.emblaApi?.scrollNext?.()
}

function handleTimelineSelect(index: number) {
    activeTimelineIndex.value = index
}

function selectTimelineSlide(index: number) {
    activeTimelineIndex.value = index
    timelineCarousel.value?.emblaApi?.scrollTo?.(index)
}

watch(timelineItems, (items) => {
    activeTimelineIndex.value = 0
    if (items.length) {
        requestAnimationFrame(() => {
            timelineCarousel.value?.emblaApi?.scrollTo?.(0)
        })
    }
})

watch(compareModeEnabled, (enabled) => {
    if (enabled && compareMode.value === 'methods' && !compareMethodId.value) {
        const alt = methods.value.find(m => m.id !== selectedMethod.value.id)
        compareMethodId.value = alt?.id ?? null
    }
})

watch(selectedMethod, (val) => {
    if (compareMethodId.value === val.id) {
        const alt = methods.value.find(m => m.id !== val.id)
        compareMethodId.value = alt?.id ?? null
    }
})

const mapTimelineTidToChartValue = (tid?: string) => {
    if (!tid) return undefined
    const token = normalizeTimeToken(tid)
    if (!token) return undefined
    if (token === 'före') return 'före'
    if (token === 'efter') return 'efter'
    const num = Number(token)
    if (!Number.isNaN(num)) return String(num)
    return undefined
}

const currentTimelineTime = computed(() => mapTimelineTidToChartValue(timelineItems.value[activeTimelineIndex.value]?.tid))

const comparisonImages = computed(() => {
    if (!compareModeEnabled.value) return null
    const active = timelineItems.value[activeTimelineIndex.value]
    if (!active) return null

    if (compareMode.value === 'beforeAfter') {
        const before = timelineItems.value.find(item => {
            const token = normalizeTimeToken(item.tid)
            return token === 'före'
        }) ?? active
        return {
            left: before.thumb,
            leftHidden: before.thumbHidden,
            right: active.thumb,
            rightHidden: active.thumbHidden
        }
    }

    // Method compare
    const otherMethodId = compareMethodResolved.value
    if (!otherMethodId) return null

    const otherTimeline = timelineItemsForMethod(otherMethodId)
    const targetToken = normalizeTimeToken(active.tid)
    const other = otherTimeline.find(item => normalizeTimeToken(item.tid) === targetToken) ?? otherTimeline[0]
    if (!other) return null
    return {
        left: active.thumb,
        leftHidden: active.thumbHidden,
        right: other.thumb,
        rightHidden: other.thumbHidden
    }
})

const comparisonLabels = computed(() => {
    if (!compareModeEnabled.value) return null
    const currentLabel = selectedMethod.value.title || selectedMethod.value.id
    const currentTimeLabel = formatTimelineCurrentLabel(timelineItems.value[activeTimelineIndex.value]?.tid)

    if (compareMode.value === 'beforeAfter') {
        return {
            leftFramework: currentLabel,
            leftTime: 'Före avverkning',
            rightFramework: currentLabel,
            rightTime: currentTimeLabel,
        }
    }
    const otherMethodId = compareMethodResolved.value
    const otherMethod = methods.value.find(m => m.id === otherMethodId)
    const otherLabel = otherMethod?.title || otherMethodId || ''
    return {
        leftFramework: currentLabel,
        leftTime: currentTimeLabel,
        rightFramework: otherLabel,
        rightTime: currentTimeLabel,
    }
})

const compareMethodLabel = computed(() => {
    if (!compareModeEnabled.value || compareMode.value !== 'methods') return ''
    const otherMethodId = compareMethodResolved.value
    const otherMethod = methods.value.find(m => m.id === otherMethodId)
    return otherMethod?.title || otherMethodId || ''
})

const comparisonTimelineItem = computed(() => {
    if (!compareModeEnabled.value || compareMode.value !== 'methods') return null
    const otherMethodId = compareMethodResolved.value
    if (!otherMethodId) return null
    const otherTimeline = timelineItemsForMethod(otherMethodId)
    const active = timelineItems.value[activeTimelineIndex.value]
    const token = normalizeTimeToken(active?.tid)
    return otherTimeline.find(item => normalizeTimeToken(item.tid) === token) ?? otherTimeline[0] ?? null
})

const timelineSummaryCarousel = ref<any>(null)
const activeTimelineSummaryIndex = ref(0)

const timelineSummaryCarouselItems = computed(() => {
    const primary = timelineItems.value[activeTimelineIndex.value]
    if (!primary) return []

    const items = [
        {
            key: 'primary',
            title: selectedMethodLabel.value || selectedMethod.title || selectedMethod.id || 'Vald metod',
            timeLabel: formatTimelineCurrentLabel(primary.tid),
            skog: primary.skog,
            svamp: primary.svamp
        }
    ]

    if (comparisonTimelineItem.value) {
        items.push({
            key: 'compare',
            title: compareMethodLabel.value || 'Jämförelse',
            timeLabel: formatTimelineCurrentLabel(comparisonTimelineItem.value.tid),
            skog: comparisonTimelineItem.value.skog,
            svamp: comparisonTimelineItem.value.svamp
        })
    }

    return items
})

const timelineSummaryTabItems = computed(() =>
    timelineSummaryCarouselItems.value.map((item, index) => ({
        label: item.title || (index === 0 ? selectedMethodLabel.value : 'Jämförelse'),
        value: index
    }))
)

function handleTimelineSummarySelect(index: number) {
    activeTimelineSummaryIndex.value = index
}

watch(activeTimelineSummaryIndex, (index) => {
    timelineSummaryCarousel.value?.emblaApi?.scrollTo?.(index)
})

watch(timelineSummaryCarouselItems, (items) => {
    const maxIndex = Math.max(0, items.length - 1)
    if (activeTimelineSummaryIndex.value > maxIndex) {
        activeTimelineSummaryIndex.value = 0
    }
    if (items.length) {
        requestAnimationFrame(() => {
            timelineSummaryCarousel.value?.emblaApi?.scrollTo?.(activeTimelineSummaryIndex.value)
        })
    }
})

function formatTimelineButtonLabel(tid?: string) {
    if (!tid) return ''
    return tid.charAt(0).toUpperCase() + tid.slice(1)
}

function formatTimelineCurrentLabel(tid?: string) {
    if (!tid) return ''
    const token = normalizeTimeToken(tid)
    if (token === 'före') return 'Innan avverkning'
    if (token === 'efter') return 'Efter avverkning'
    const num = Number(token)
    if (!Number.isNaN(num)) {
        return `${num} år efter avverkning`
    }
    return tid.charAt(0).toUpperCase() + tid.slice(1)
}

const overlayRegistry = useOverlayRegistry()
const { data: overlayTextData } = await useAsyncData('overlay-texts-skogs', () =>
    queryCollection('overlayTexts').all()
)

const overlayTextMap = computed<Record<string, { title: string; description: string; image?: string; images?: string[]; imageDescriptions?: string[]; doc?: any }>>(() => {
    const docs = (overlayTextData.value as any[]) || []
    const map: Record<string, { title: string; description: string; image?: string; images?: string[]; imageDescriptions?: string[]; doc?: any }> = {}
    docs.forEach((doc: any) => {
        const key = doc?.key
        if (!key) return
        map[key] = {
            title: doc.title ?? key,
            description: doc.description ?? '',
            image: doc.image,
            images: doc.images,
            imageDescriptions: doc.imageDescriptions,
            doc,
        }
    })
    return map
})

const markerDefinitions = [
    { key: 'kanteffekt', icon: 'i-healthicons-square-medium-negative' },
    { key: 'rottacke', icon: 'i-game-icons-tree-roots' },
    { key: 'rottackeSkarmtrad', icon: 'i-streamline-tree-3', label: 'Skärmträd', svgPath: '/svg/sk%C3%A4rmtr%C3%A4d.svg' },
    { key: 'rottackeBladning', icon: 'i-tabler-christmas-tree', label: 'Träd blädning', svgPath: '/svg/Bl%C3%A4dning.svg' },
    { key: 'seedTree', icon: 'i-teenyicons-redwoodjs-outline', label: 'Fröträd', svgPath: '/svg/Fr%C3%B6tr%C3%A4d.svg' },
    { key: 'smaplantor', icon: 'i-pepicons-pop-seedling-circle' },
    { key: 'hogstubbar', icon: 'i-roentgen-wood', label: 'Högstubbar', svgPath: '/svg/H%C3%B6gstubbe.svg' },
    { key: 'naturvardsarter', icon: 'i-material-symbols-award-star-outline' },
    { key: 'tradplantor', icon: 'i-hugeicons-plant-02', label: 'Planterade plantor', svgPath: '/svg/planterade_plantor.svg' },
    { key: 'hansyn_enstaka', icon: 'i-tabler-tree', label: 'Hänsynsträd', svgPath: '/svg/h%C3%A4nsyn_enstaka.svg' },
    { key: 'hansyn_yta', icon: 'i-tabler-trees', label: 'Hänsynsyta', svgPath: '/svg/h%C3%A4nsyn_yta.svg' },
]

const getKanteffektOverlays = (methodKey: string, timeToken: string, showOld: boolean) => {
    if (methodKey === 'luckhuggning') {
        if (timeToken === 'efter' || timeToken === '20') {
            return [{ src: '/svg/Kanteffekt_luckhuggning_1.svg', opacity: 1 }]
        }
        if (timeToken === '50') {
            return showOld
                ? [
                    { src: '/svg/Kanteffekt_luckhuggning_2.svg', opacity: 1 },
                    { src: '/svg/Kanteffekt_luckhuggning_1.svg', opacity: 0.5 }
                ]
                : [{ src: '/svg/Kanteffekt_luckhuggning_2.svg', opacity: 1 }]
        }
        if (timeToken === '80') {
            return showOld
                ? [
                    { src: '/svg/Kanteffekt_luckhuggning_3.svg', opacity: 1 },
                    { src: '/svg/Kanteffekt_luckhuggning_2.svg', opacity: 0.5 },
                    { src: '/svg/Kanteffekt_luckhuggning_1.svg', opacity: 0.35 }
                ]
                : [{ src: '/svg/Kanteffekt_luckhuggning_3.svg', opacity: 1 }]
        }
        return null
    }
    if (methodKey === 'trakthygge') {
        if (timeToken === 'efter' || timeToken === '20') {
            return [{ src: '/svg/Kanteffekt.svg', opacity: 1 }]
        }
        if (timeToken === '50' || timeToken === '80') {
            return showOld ? [{ src: '/svg/Kanteffekt.svg', opacity: 0.5 }] : null
        }
        return null
    }
    if (methodKey === 'skarmtrad') {
        if (timeToken === '10' || timeToken === '20') {
            return [{ src: '/svg/Kanteffekt.svg', opacity: 1 }]
        }
        if (timeToken === '50' || timeToken === '80') {
            return showOld ? [{ src: '/svg/Kanteffekt.svg', opacity: 0.5 }] : null
        }
        return null
    }
    return null
}

const buildMarkerCardsFor = (methodId: string, timeLabel?: string) => {
    const currentMethod = methodId
    const methodKey = normalizeFrameworkId(normalizeTimelineAtgard(currentMethod))
    const timeToken = normalizeTimeToken(timeLabel ?? '')
    const allowedByMethod: Record<string, string[] | 'all'> = {
        naturvardsarter: 'all',
        kanteffekt: ['trakthygge', 'luckhuggning', 'skärmträd', 'skarmtrad'],
        tradplantor: ['trakthygge'],
        smaplantor: ['trakthygge'],
        hogstubbar: ['trakthygge'],
        rottackeBladning: ['blädning', 'bladning'],
        rottackeSkarmtrad: ['skärmträd', 'skarmtrad'],
        seedTree: ['skärmträd', 'skarmtrad'],
        hansyn_enstaka: 'all',
        hansyn_yta: 'all',
    }

    const isNaturskydd = normalizeTimelineAtgard(currentMethod) === 'naturskydd'
    return markerDefinitions
        .filter(def => {
            if (isNaturskydd && (def.key === 'hansyn_enstaka' || def.key === 'hansyn_yta')) {
                return false
            }
            const allow = allowedByMethod[def.key] ?? []
            if (allow === 'all') return true
            return allow.map(entry => normalizeFrameworkId(entry)).includes(methodKey)
        })
        .map(def => {
            const copy = overlayTextMap.value[def.key] ?? { title: def.label ?? def.key, description: '' }
            let svgPath = def.svgPath
            let overlayOpacity: number | undefined
            let overlaySvgs: Array<{ src: string; opacity?: number }> | undefined
            let overlayAvailable = true
            if (def.key === 'kanteffekt') {
                const kanteffekt = getKanteffektOverlays(methodKey, timeToken, kanteffektOldVisible.value)
                if (kanteffekt) {
                    overlaySvgs = kanteffekt
                } else {
                    overlayAvailable = false
                }
            }
            if (def.key === 'rottackeSkarmtrad' && timeToken !== 'efter') {
                overlayAvailable = false
            }
            if (def.key === 'rottackeBladning' && (timeToken === 'innan' || timeToken === 'före')) {
                overlayAvailable = false
            }
            if (def.key === 'seedTree' && timeToken !== '10') {
                overlayAvailable = false
            }
            if (def.key === 'tradplantor' && timeToken !== '20') {
                overlayAvailable = false
            }
            if (def.key === 'hogstubbar' && (timeToken === 'före' || timeToken === 'innan')) {
                overlayAvailable = false
            }
            return {
                ...def,
                title: copy.title,
                description: copy.description,
                image: copy.image,
                images: copy.images,
                imageDescriptions: copy.imageDescriptions,
                doc: copy.doc,
                svgPath,
                overlayOpacity,
                overlaySvgs,
                overlayAvailable,
            }
        })
}

const markerCards = computed(() => {
    const timeLabel = timelineItems.value[activeTimelineIndex.value]?.tid
    return buildMarkerCardsFor(selectedMethod.value.id, timeLabel)
})

watch(markerCards, (cards) => {
    if (!selectedMarkerKey.value) return
    const stillExists = cards.some(card => card.key === selectedMarkerKey.value)
    if (!stillExists) {
        closeMarkerPanel()
    }
})

const markerCardsBefore = computed(() => {
    if (!compareModeEnabled.value || compareMode.value !== 'beforeAfter') {
        return markerCards.value
    }
    return buildMarkerCardsFor(selectedMethod.value.id, 'innan')
})

const markerCardsCompare = computed(() => {
    if (!compareModeEnabled.value || compareMode.value !== 'methods') return []
    const otherMethodId = compareMethodResolved.value
    if (!otherMethodId) return []
    return buildMarkerCardsFor(otherMethodId, comparisonTimelineItem.value?.tid)
})

type ActiveMarkerBadge = {
    key: string
    icon: string
    label: string
    description?: string
}

const panelCardsLeft = computed(() => compareMode.value === 'beforeAfter' ? markerCardsBefore.value : markerCards.value)
const panelCardsRight = computed(() => compareMode.value === 'methods' ? markerCardsCompare.value : markerCards.value)

const hasActiveMarkerInCards = (cards: Array<{ key: string; overlayAvailable?: boolean }>, key: string) =>
    cards.some(card => card.key === key && card.overlayAvailable !== false) && isMarkerOverlayVisible(key)

const buildActiveMarkerBadges = (
    cards: Array<{ key: string; overlayAvailable?: boolean }>,
    timeLabel?: string,
    startskog?: string
): ActiveMarkerBadge[] => {
    const badges: ActiveMarkerBadge[] = []
    const timeToken = normalizeTimeToken(timeLabel ?? '')
    const numericTime = Number(timeToken)
    const hasNumericTime = !Number.isNaN(numericTime)
    const isNaturskog = startskog === 'naturskog'

    const showRootCircle = (
        hasActiveMarkerInCards(cards, 'hansyn_enstaka') ||
        hasActiveMarkerInCards(cards, 'hansyn_yta') ||
        hasActiveMarkerInCards(cards, 'rottackeSkarmtrad') ||
        hasActiveMarkerInCards(cards, 'seedTree')
    )
    if (showRootCircle) {
        badges.push({
            key: 'root-circle',
            icon: 'i-fluent-emoji-high-contrast-red-circle',
            label: 'Yta med rötter',
        })
    }

    if (hasActiveMarkerInCards(cards, 'hogstubbar')) {
        badges.push({
            key: 'hogstubbar',
            icon: 'i-roentgen-wood',
            label: 'Högstubbar',
        })
    }

    if (hasActiveMarkerInCards(cards, 'kanteffekt') || hasActiveMarkerInCards(cards, 'rottackeBladning')) {
        badges.push({
            key: 'root-square',
            icon: 'i-fluent-emoji-high-contrast-red-square',
            label: 'Yta med rötter',
        })
    }

    if (isBestandsgransVisible.value) {
        badges.push({
            key: 'bestandsgrans',
            icon: 'i-fluent-emoji-high-contrast-white-flag',
            label: 'Beståndsgräns',
        })
    }

    if (hasActiveMarkerInCards(cards, 'naturvardsarter')) {
        badges.push({
            key: 'naturvardsarter',
            icon: 'i-material-symbols-award-star-outline-rounded',
            label: 'Naturvårdssvamp',
            description: 'Mycel av rödlistad svamp eller signalart',
        })

        const isAfterFelling = timeToken === 'efter' || (hasNumericTime && numericTime >= 10)
        if (isAfterFelling) {
            badges.push({
                key: 'naturvardsarter-avverkning',
                icon: 'i-fluent-emoji-high-contrast-carpentry-saw',
                label: 'Avverkning',
                description: 'Svampen har tynat bort och dött efter att träd avverkats.',
            })
        }

        if (hasNumericTime && numericTime >= 20) {
            badges.push({
                key: 'naturvardsarter-sjalvdod',
                icon: 'i-tabler-mushroom-off',
                label: 'Självdöd/utkonkurrerad',
                description: 'Svampen har dött av ålder, konkurrens eller annan orsak.',
            })
        }

        if (hasNumericTime && numericTime >= 50) {
            badges.push({
                key: 'naturvardsarter-sporer-hansyn',
                icon: 'i-mingcute-floating-dust-line',
                label: 'Sporer',
                description: 'Har etablerats med sporer från svamp som överlevt vid hänsynsträd.',
            })
        }

        if (hasNumericTime && numericTime >= 50 && isNaturskog) {
            badges.push({
                key: 'naturvardsarter-flyttat-sig',
                icon: 'i-heroicons-arrow-down-right-solid',
                label: 'Flyttat sig',
                description: 'Svampen har flyttat sig genom att mycel har växt och expanderat.',
            })
        }

        if (hasNumericTime && numericTime >= 80 && isNaturskog) {
            badges.push({
                key: 'naturvardsarter-sporer-omgivning',
                icon: 'i-fluent-weather-duststorm-20-regular',
                label: 'Sporer',
                description: 'Har etablerats med sporer spridda från närliggande skogar.',
            })
        }
    }

    return badges
}

const singleImageMarkerBadges = computed(() =>
    buildActiveMarkerBadges(
        markerCards.value,
        currentTimelineItem.value?.tid,
        selectedStartskogTab.value
    )
)
const compareLeftMarkerBadges = computed(() =>
    buildActiveMarkerBadges(
        panelCardsLeft.value,
        compareMode.value === 'beforeAfter' ? 'innan' : timelineItems.value[activeTimelineIndex.value]?.tid,
        selectedStartskogTab.value
    )
)
const compareRightMarkerBadges = computed(() =>
    buildActiveMarkerBadges(
        panelCardsRight.value,
        compareMode.value === 'methods' ? comparisonTimelineItem.value?.tid : timelineItems.value[activeTimelineIndex.value]?.tid,
        selectedStartskogTab.value
    )
)

const markerLibraryColumns = [
    { accessorKey: 'icon', id: 'icon' },
    { accessorKey: 'name', id: 'name' },
    { accessorKey: 'image', id: 'image' },
    { accessorKey: 'frameworks', id: 'frameworks' }
]

const markerLibraryRows = computed(() => {
    const primaryMap = new Map(markerCards.value.map(card => [card.key, card] as const))
    const includeCompare = compareModeEnabled.value && compareMode.value === 'methods'
    const compareMap = includeCompare
        ? new Map(markerCardsCompare.value.map(card => [card.key, card] as const))
        : new Map<string, any>()

    const keys = new Set<string>([
        ...primaryMap.keys(),
        ...compareMap.keys()
    ])

    const primaryLabel = selectedMethod.value.title || selectedMethod.value.id || 'Vald metod'
    const compareLabel = compareMethodLabel.value || 'Jämförelse'

    return Array.from(keys).map((key) => {
        const primary = primaryMap.get(key)
        const secondary = compareMap.get(key)
        const base = primary || secondary
        const image = base?.images?.[0] || base?.image || ''
        const frameworks = [
            ...(primary ? [{ key: 'primary', label: primaryLabel }] : []),
            ...(secondary ? [{ key: 'compare', label: compareLabel }] : [])
        ]

        return {
            key,
            icon: base?.icon || 'i-heroicons-information-circle',
            name: base?.title || key,
            image,
            frameworks
        }
    }).sort((a, b) => a.name.localeCompare(b.name, 'sv'))
})

function toggleMarkerCard(key: string) {
    expandedMarker.value = expandedMarker.value === key ? null : key
}

const naturvardsModalOpen = ref(false)

async function goToNaturvardsChart() {
    chartSelected.value = 'rodlistade'
    chartComponent.value?.setSelectedChart?.('rodlistade')
    naturvardsModalOpen.value = false
    overlayRegistry?.closeAll?.()
    await nextTick()
    if (chartSection.value && process.client) {
        chartSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}

const tabs = ref<TabsItem[]>([
    {
        label: 'Intro',
        icon: 'i-heroicons-book-open',
        slot: 'text' as const
    },

    {
        label: 'Diagram',
        icon: 'i-heroicons-presentation-chart-line',
        slot: 'diagram' as const
    },
    {
        label: 'Tidslinje',
        icon: 'i-heroicons-list-bullet',
        slot: 'timeline' as const
    },

])

const methodChartTab = ref<'skogsskole' | 'grupper'>('skogsskole')

const startskogModalOpen = ref(route.query.entry === '1' || route.query.entry === 'true')
const methodTitlePopoverOpen = ref(false)

const renderedMethodOmSection = ref<any>(null)
const renderedMethodSvampSection = ref<any>(null)
watch([methodOmDoc, methodSvampDoc, methodSectionPending], ([omDoc, svampDoc, pending]) => {
    // Keep previous content during method data fetch to avoid animating via an empty state.
    if (pending) return
    renderedMethodOmSection.value = omDoc ?? null
    renderedMethodSvampSection.value = svampDoc ?? null
}, { immediate: true })

const methodOmSection = computed(() => renderedMethodOmSection.value)
const methodSvampSection = computed(() => renderedMethodSvampSection.value)
const methodMatsvampSection = computed(() => methodMatsvampDoc.value)
const methodNaturvardSection = computed(() => methodNaturvardDoc.value)

watch([methodOmSection, methodSvampSection], () => {
    // No-op: snap-only layout for this panel.
}, { flush: 'post' })

const frameworkIndexMap: Record<string, number> = {
    naturskydd: 0,
    trakthygge: 1,
    luckhuggning: 2,
    skarmtrad: 3,
    bladning: 4,
}

function normalizeFrameworkId(value: string) {
    return (value || '')
        .trim()
        .normalize('NFD')
        .replace(/\p{Diacritic}+/gu, '')
        .toLowerCase()
}

const resolveFrameworkKey = (value: string | null | undefined) => {
    const normalized = normalizeFrameworkId(value || '')
    if (normalized === 'ingenatgard') return 'naturskydd'
    if (normalized === 'skarmtrad') return 'skärmträd'
    if (normalized === 'bladning') return 'blädning'
    return value || ''
}

const normalizeFrameworkKey = (value: string | null | undefined) =>
    normalizeFrameworkId(resolveFrameworkKey(value))

const selectedFrameworkKey = computed(() => resolveFrameworkKey(selectedMethod.value.id))
const compareFrameworkKey = computed(() => resolveFrameworkKey(compareMethodResolved.value))
const normalizedSelectedFrameworkKey = computed(() => normalizeFrameworkId(selectedFrameworkKey.value))
const isHyggesfrittType = computed(() =>
    String(selectedMethod.value.type || '').toLowerCase().includes('hyggesfritt')
)
const isLuckhuggningMethod = computed(() => normalizedSelectedFrameworkKey.value === 'luckhuggning')
const isSkarmtradMethod = computed(() => normalizedSelectedFrameworkKey.value === 'skarmtrad')

const impactBarClass = computed(() => {
    if (impact.value.tone === 'low') return 'bg-emerald-500'
    if (impact.value.tone === 'high') return 'bg-rose-500'
    return 'bg-amber-500'
})

const impactTextClass = computed(() => {
    if (impact.value.tone === 'low') return 'text-emerald-500'
    if (impact.value.tone === 'high') return 'text-rose-500'
    return 'text-amber-500'
})

const comparisonImpactBarClass = computed(() => {
    if (comparisonImpact.value?.tone === 'low') return 'bg-emerald-500'
    if (comparisonImpact.value?.tone === 'high') return 'bg-rose-500'
    return 'bg-amber-500'
})

const comparisonImpactTextClass = computed(() => {
    if (comparisonImpact.value?.tone === 'low') return 'text-emerald-500'
    if (comparisonImpact.value?.tone === 'high') return 'text-rose-500'
    return 'text-amber-500'
})

const impactByMethod = computed<Record<string, { value: number; tone: 'low' | 'medium' | 'high'; label: string }>>(() => {
    const docs = (methodImpactDocs.value as any[]) || []
    const map: Record<string, { value: number; tone: 'low' | 'medium' | 'high'; label: string }> = {}
    docs.forEach(doc => {
        if (!doc?.methodId) return
        const value = Number(doc.impactValue)
        const tone = doc.impactTone as 'low' | 'medium' | 'high' | undefined
        const label = doc.impactLabel as string | undefined
        if (!Number.isNaN(value) && tone && label) {
            map[doc.methodId] = { value, tone, label }
        }
    })
    return map
})

const resolveImpact = (methodId: string | null | undefined) => {
    const normalized = normalizeFrameworkKey(methodId)
    const base =
        impactByMethod.value[methodId || ''] ??
        impactByMethod.value[normalized] ??
        { value: 50, tone: 'medium', label: 'Medel påverkan' }
    const isNaturskog = selectedStartskogTab.value === 'naturskog'
    const needsBoost = isNaturskog && normalized !== 'naturskydd'
    return {
        ...base,
        value: Math.min(100, base.value + (needsBoost ? 10 : 0))
    }
}

const impact = computed(() => resolveImpact(selectedMethod.value.id))
const comparisonImpact = computed(() => {
    if (!compareModeEnabled.value || compareMode.value !== 'methods') return null
    return resolveImpact(compareMethodResolved.value)
})

function openModelWithCurrentFramework() {
    const normalized = normalizeFrameworkKey(selectedMethod.value.id)
    const index = frameworkIndexMap[normalized]
    if (typeof index === 'number') {
        onboardingStore.selectedFramework = index
    }
    modelOpen.value = true
}

const methodNav = computed(() => {
    const list = methods.value
    const idx = list.findIndex(m => m.id === selectedMethod.value.id)
    return {
        prev: idx > 0 ? list[idx - 1] : null,
        next: idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null,
    }
})

async function handleMethodNav(id: string) {
    selectedId.value = id
    await nextTick()
    if (process.client) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-left-fade-enter-active,
.slide-right-fade-enter-active {
    transition: opacity 0.3s ease, transform 0.25s ease;
}

.slide-left-fade-leave-active,
.slide-right-fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.slide-left-fade-enter-from {
    opacity: 0;
    transform: translateX(-8px);
}

.slide-left-fade-leave-to {
    opacity: 0;
    transform: translateX(8px);
}

.slide-right-fade-enter-from {
    opacity: 0;
    transform: translateX(8px);
}

.slide-right-fade-leave-to {
    opacity: 0;
    transform: translateX(-8px);
}

.striped-bg {
    background-image: repeating-linear-gradient(135deg,
            rgba(0, 0, 0, 0.08) 0,
            rgba(0, 0, 0, 0.08) 8px,
            rgba(0, 0, 0, 0.02) 8px,
            rgba(0, 0, 0, 0.02) 16px);
}

.impact-dashed {
    background-image: repeating-linear-gradient(90deg,
            var(--ui-color-neutral-400) 0 8px,
            color-mix(in srgb, var(--ui-color-neutral-400) 5%, transparent) 6px 10px);
}

.mobile-carousel {
    width: 100vw;
    margin-left: 50%;
    transform: translateX(-50%);
}

@media (min-width: 768px) {
    .mobile-carousel {
        width: auto;
        margin-left: 0;
        transform: none;
    }
}

.fold-down-enter-active,
.fold-down-leave-active {
    transition: all 0.2s ease;
    transform-origin: top;
}

.fold-down-enter-from,
.fold-down-leave-to {
    transform: scaleY(0.8) translateY(-8px);
    opacity: 0;
}

.image-fade-enter-active,
.image-fade-leave-active {
    transition: opacity 0.45s ease;
    position: absolute;
    inset: 0;
}

.image-fade-enter-from,
.image-fade-leave-to {
    opacity: 0;
}

.background {
    /* background-color: #f9f6f3; */
    background-image: linear-gradient(#f2ece2 1px, transparent 1px), linear-gradient(to right, #f2ece2 1px, #ffffff 1px);
    background-size: 20px 20px;
}
</style>

<style>
.scrollbar-hidden {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-hidden::-webkit-scrollbar {
    display: none;
}
</style>
