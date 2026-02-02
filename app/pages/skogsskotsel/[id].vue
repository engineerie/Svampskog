<template>
    <DefineMethodPanelBody>
        <div class="grid grid-cols-1 md:grid-cols-3 sm:gap-4 gap-3 p-3 sm:p-0.5">
            <div class="sm:space-y-4 space-y-3">

                <UCard class="h-fit ring-muted/50 shadow rounded-xl cursor-pointer select-none hover:bg-neutral-100"
                    role="button" tabindex="0" @click="isMethodDescriptionExpanded = !isMethodDescriptionExpanded"
                    @keydown.enter.prevent="isMethodDescriptionExpanded = !isMethodDescriptionExpanded"
                    @keydown.space.prevent="isMethodDescriptionExpanded = !isMethodDescriptionExpanded">


                    <div class="space-y-3 text-md md:text-md text-neutral-800">
                        <NuxtImg :src="methodImage(selectedMethod, 'detail')" height="800" width="1500"
                            :alt="`Bild för ${selectedMethod.title}`" class="rounded-xl ring ring-muted/50 w-full" />
                        <div class="flex items-center gap-2 pt-4">
                            <h2 class="text-3xl font-semibold text-neutral-900">{{ selectedMethod.title }}</h2>
                        </div>
                        <div :class="{ 'line-clamp-3': !isMethodDescriptionExpanded }" class="space-y-3">
                            <template v-for="(para, idx) in methodDescriptionSection?.paragraphs" :key="`desc-${idx}`">
                                <MDC :value="para" unwrap="p" class="text-md block" />
                            </template>
                        </div>
                    </div>
                </UCard>
                <UCard class="h-fit ring-muted/50 shadow rounded-xl cursor-pointer select-none hover:bg-neutral-100"
                    role="button" tabindex="0" @click="isSvampDescriptionExpanded = !isSvampDescriptionExpanded"
                    @keydown.enter.prevent="isSvampDescriptionExpanded = !isSvampDescriptionExpanded"
                    @keydown.space.prevent="isSvampDescriptionExpanded = !isSvampDescriptionExpanded">

                    <div class="text-md md:text-md text-neutral-800 space-y-3">
                        <div class="flex items-center gap-2 ">
                            <!-- <UIcon name="i-hugeicons-mushroom" class="size-5 text-neutral-700" /> -->
                            <h2 class="text-2xl font-semibold text-neutral-900">Påverkan på mykorrhiza</h2>
                        </div>






                        <ImpactDonut :value="impact.value" :label="impact.label" :tone="impact.tone"
                            :comparison-value="comparisonImpact?.value" :comparison-tone="comparisonImpact?.tone"
                            :method-label="selectedMethodLabel" :comparison-label="comparisonMethodLabel"
                            :comparison-impact-label="comparisonImpact?.label" />


                        <UAlert v-if="selectedStartskogTab === 'naturskog' && selectedFrameworkKey !== 'naturskydd'"
                            color="info" variant="subtle" icon="i-heroicons-information-circle" title="Äldre skog"
                            description="Skötselingrepp i skog som inte tidigare har varit kalavverkad har i regel större påverkan.
                            " />
                        <div :class="{ 'line-clamp-3': !isSvampDescriptionExpanded }" class="space-y-3">
                            <template v-for="(para, idx) in svampMainParagraphs" :key="`svamp-${idx}`">
                                <MDC :value="para" unwrap="p" class="text-md block" />
                            </template>
                        </div>
                    </div>
                </UCard>
            </div>


            <!-- <template #header>
                    <div class="flex items-center gap-2">
                        <UIcon name="i-hugeicons-mushroom" class="size-5 text-neutral-700" />
                        <h2 class="text-xl font-semibold text-neutral-900">Påverkan på mykorrhiza</h2>
                    </div>
                </template> -->
            <div class="flex flex-col sm:gap-4 gap-3">


                <UCard class="ring-muted/50 shadow rounded-xl">
                    <div class="space-y-3">
                        <div class="flex items-center gap-2">
                            <UIcon name="lineicons:mushroom" class="size-5 text-gray-500" />
                            <h3 class="text-xl font-semibold text-neutral-900">Mängd mykorrhizasvamp</h3>
                        </div>

                        <ForestryChartMain :selectedChart="'skogsskole'" :parentSelectedFrameworks="chartFrameworks"
                            :currentStartskog="selectedStartskogTab" :currentTimeValue="currentTimelineTime"
                            preserveFrameworkOrder :showControls="false" class="pt-2" />
                    </div>
                </UCard>
                <UCard class="ring-muted/50 shadow rounded-xl">
                    <div class="space-y-3">
                        <div class="flex items-center gap-2">
                            <UIcon name="i-material-symbols-category-rounded" class="size-5 text-rose-500" />
                            <h3 class="text-xl font-semibold text-neutral-900">Svampgrupper</h3>
                        </div>
                        <ForestryChartMain :selectedChart="'grupper'" :parentSelectedFrameworks="chartFrameworks"
                            :currentStartskog="selectedStartskogTab" :currentTimeValue="currentTimelineTime"
                            preserveFrameworkOrder :showControls="false" class="pt-2" />
                    </div>
                </UCard>


            </div>


            <div class="flex flex-col sm:gap-4 gap-3 ">
                <UCard class="ring-muted/50 shadow rounded-xl">
                    <div class="space-y-3">
                        <div class="flex items-center gap-2">
                            <UIcon name="icon-park-solid:knife-fork" class="size-5 text-warning-500" />
                            <h3 class="text-xl font-semibold text-neutral-900">Matsvampar</h3>
                        </div>

                        <MDC v-if="svampMatsvampParagraph" :value="svampMatsvampParagraph" unwrap="p"
                            class="text-md text-neutral-800 ring-muted/50 rounded-md" />
                        <ForestryChartMain :selectedChart="'matsvampar'" :parentSelectedFrameworks="chartFrameworks"
                            :currentStartskog="selectedStartskogTab" :currentTimeValue="currentTimelineTime"
                            preserveFrameworkOrder :showControls="false" :showMatsvampSelector="true" class="pt-2" />
                    </div>
                </UCard>
                <UCard class=" ring-muted/50 shadow rounded-xl">
                    <div class="space-y-3">
                        <div class="flex items-center gap-2 ">
                            <UIcon name="i-material-symbols-award-star" class="size-5 text-signal-500" />
                            <h3 class="text-xl font-semibold text-neutral-900">Naturvårdssvampar</h3>
                        </div>

                        <MDC v-if="svampNaturvardParagraph" :value="svampNaturvardParagraph" unwrap="p"
                            class="text-md text-neutral-800" />
                        <ForestryChartMain :selectedChart="'rodlistade'" :parentSelectedFrameworks="chartFrameworks"
                            :currentStartskog="selectedStartskogTab" :currentTimeValue="currentTimelineTime"
                            preserveFrameworkOrder :showControls="false" class="pt-2" />
                    </div>

                </UCard>
            </div>
        </div>
        <!-- <UModal fullscreen>
            <UButton label="modell" />
            <template #content>
                <Model />
            </template>
        </UModal> -->
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
        <div
            class="flex gap-2  my-3 bg-neutral-100 w-full sm:w-fit transition-all duration-300 rounded-lg border-muted/50 ">
            <!-- <UButton label="Markörer" color="neutral" variant="outline" class="ring-muted/50 m-2"
                @click="markersRowOpen = !markersRowOpen" /> -->

            <div v-if="markersRowOpen" class="flex flex-wrap gap-2 items-center p-2">
                <UPopover :ui="{ content: 'p-2 w-56' }" @update:open="(open) => { bestandsgransPreview = open }">
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
        </div>
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
    </DefineMarkerCardsRow>
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


            <!-- <div class="flex items-center gap-3 mb-3">
                <div v-if="card.key === 'kanteffekt'">
                    <UButton color="neutral" variant="outline"
                        :class="kanteffektOldVisible ? 'ring-primary ring-2' : 'ring-muted/50'"
                        :icon="kanteffektOldVisible ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'"
                        label="Tidigare kanteffekt" @click="kanteffektOldVisible = !kanteffektOldVisible" />
                </div>
            </div> -->

            <h1 class="text-2xl font-medium text-neutral-800 -mb-2">{{ card.title }}</h1>
            <ContentRenderer v-if="card.doc?.body" :value="card.doc" />
            <p v-else class="text-neutral-800">{{ card.description }}</p>
        </div>

    </DefineMarkerCardBody>
    <!-- <UModal v-model:open="startskogModalOpen" :close="false" :transition="true" :overlay="true"
        :ui="{ body: 'space-y-2 pt-2 sm:pt-2', content: 'max-w-sm divide-none' }"
        title="Har skogen varit kalavverkad tidigare?"
        description="Hur skogen har brukats tidigare påverkar vilka mykorrhizasvampar som finns. Valet återspeglas i tidslinjen och diagrammen.">
        <template #body>
            <USelect :items="startskogTabs" v-model="selectedStartskogTab" :icon="selectedStartskogIcon"
                class="w-full transition-all ring-muted/50" />
            <p class="text-neutral-700 text-xs">

            </p>
            <div class="flex gap-2">
                <UButton color="neutral" variant="outline" class="ring-muted/50" label="Fortsätt"
                    @click="startskogModalOpen = false" />
            </div>
        </template>
</UModal> -->
    <div class="flex flex-col flex-1 bg-neutral-50 pb-6 w-full" v-if="page">






        <!-- <Transition name="fade"> -->
        <!-- <UContainer v-if="!selectedMethod.id" class="w-full px-0">

            <UPageHero :ui="{ container: 'py-20 pb-16 lg:py-24', title: 'sm:text-7xl', headline: 'text-neutral' }"
                :description="page.hero.description" :orientation="page.hero.orientation" class="">

            </UPageHero>

        </UContainer> -->


        <UContainer class="w-full flex-1 flex flex-col px-0" v-if="selectedMethod.id">

            <Head>
                <link v-for="(link, idx) in timelinePreloadLinks" :key="`${link.href}-${idx}`"
                    :rel="link.rel || 'prefetch'" :as="link.as || 'image'" :href="link.href" />
            </Head>
            <UPage class="pt-0 flex-1 flex flex-col" :left="immersiveAsideOpen" :right="false" :ui="immersivePageUi">
                <template v-if="immersiveAsideOpen && contentTab === 'timeline'" #left>

                    <UPageAside>
                        <img :src="methodImage(selectedMethod, 'detail')" :alt="`Bild för ${selectedMethod.title}`"
                            class="rounded-md ring ring-muted/50 " />

                        <div class="w-full flex justify-center my-0 sm:my-6">
                            <div class="space-y-8 max-w-xl">
                                <section v-for="section in accordionItems"
                                    :key="`${section.value}-${selectedMethod.id}`" class="space-y-3">
                                    <h2 :class="[
                                        'font-semibold text-neutral-900',
                                        section.value === 'svamp'
                                            ? 'text-lg md:text-md'
                                            : 'text-xl md:text-md'
                                    ]">
                                        {{ section.label }}
                                    </h2>
                                    <div class="space-y-3 text-md md:text-md text-neutral-800">
                                        <template v-for="(para, idx) in section.paragraphs">
                                            <div v-if="section.value === 'svamp'"
                                                class="flex items-center gap-2 text-md md:text-md font-semibold text-neutral-900"
                                                v-show="idx === section.paragraphs.length - 2">
                                                <UIcon name="icon-park-solid:knife-fork"
                                                    class="size-5 text-warning-500" />
                                                <span>Matsvampar</span>
                                            </div>
                                            <div v-if="section.value === 'svamp'"
                                                class="flex items-center gap-2 text-md md:text-xl font-semibold text-neutral-900"
                                                v-show="idx === section.paragraphs.length - 1">
                                                <UIcon name="i-material-symbols-award-star"
                                                    class="size-5 text-signal-500" />
                                                <span>Naturvårdssvampar</span>
                                            </div>
                                            <MDC :value="para" unwrap="p" />
                                        </template>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </UPageAside>


                </template>
                <div
                    class="  border-muted/50 sm:pt-3 flex flex-wrap items-center justify-between gap-3 z-30 p-3 sm:p-0">
                    <UPopover :ui="{ content: ' overflow-y-auto bar-chart-container max-w-80' }" :content="{
                        align: 'start',
                        side: 'bottom',
                    }">
                        <UBadge :label="selectedStartskogLabel" :icon="selectedStartskogIcon" color="primary"
                            variant="subtle" size="xl" class="cursor-pointer" />
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
                                            <h1 class="text-md font-semibold text-neutral-900">Inte kalavverkad</h1>
                                            <p class="text-sm text-neutral-500 font-light">
                                                Skogen har oftast skogsbrukats, men inte varit kalavverkad.
                                            </p>
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
                                            <h1 class="text-md font-semibold text-neutral-900">Kalavverkad</h1>
                                            <p class="text-sm text-neutral-500 font-light">
                                                Skogen har varit kalavverkad eller är etablerad på tidigare trädlös
                                                mark.
                                            </p>
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
                    <div class="sm:flex gap-3 items-end justify-between w-full">
                        <!-- <UButton color="neutral" variant="ghost" icon="i-f7-sidebar-left" class="ring-muted"
                            @click="immersiveAsideOpen = !immersiveAsideOpen" /> -->


                        <!--
                        <USelect :items="frameworkOptions" v-model="selectedFrameworkIndex"
                            :placeholder="selectedMethod.title || 'Välj metod'" append-to-body variant="outline"
                            :icon="selectedMethod.icon" class="ring-muted w-full max-w-xs"
                            :ui="{ content: 'min-w-fit rounded-lg z-50' }" />
                        -->

                        <div class="grid grid-cols-2 sm:flex flex-wrap items-center gap-3 mb-3">
                            <UPopover :ui="{ content: ' overflow-y-auto bar-chart-container max-w-96' }" :content="{
                                align: 'start',
                                side: 'bottom',
                            }">
                                <div class="">
                                    <transition name="slide-up" mode="out-in">
                                        <div :key="selectedMethod.title || 'Välj metod'"
                                            class="flex items-center md:justify-center cursor-pointer ring ring-muted/50 shadow bg-white hover:bg-neutral-100/70 p-3 px-4 rounded-lg w-full">
                                            <div class="">
                                                <h1 class="text-neutral-500">Metod
                                                </h1>
                                                <h1 class="md:text-2xl font-medium">
                                                    {{ selectedMethod.title || 'Välj metod' }}
                                                </h1>
                                            </div>
                                        </div>
                                    </transition>
                                </div>
                                <template #content>
                                    <div class=" py-1 min-w-60 max-w-110">

                                        <div v-for="option in frameworkOptions" :key="option.value" class="px-2">
                                            <div class="hover:bg-neutral-50 p-3 w-full justify-between flex items-center gap-4 rounded-md my-1 cursor-pointer"
                                                :class="{
                                                    'bg-neutral-100': option.value === selectedFrameworkIndex
                                                }" @click="selectedFrameworkIndex = option.value">
                                                <div>
                                                    <h1 class="text-md font-semibold text-neutral-900">
                                                        {{ option.label }}
                                                    </h1>
                                                    <p class="text-sm text-neutral-500 font-light">
                                                        {{ option.description || '' }}
                                                    </p>
                                                </div>
                                                <div
                                                    class="size-10 flex justify-center items-center bg-muted rounded-md">
                                                    <UIcon v-if="option.icon" :name="option.icon" />
                                                    <UIcon v-else name="i-heroicons-photo" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </UPopover>
                            <UPopover :ui="{ content: ' overflow-y-auto bar-chart-container max-w-96' }" :content="{
                                align: 'start',
                                side: 'bottom',
                            }">
                                <div class="">
                                    <transition name="slide-up" mode="out-in">
                                        <div :key="compareMethodLabel || 'Jämför'"
                                            :class="compareModeEnabled
                                                ? 'flex items-center md:justify-center cursor-pointer outline-2 outline-dashed outline-neutral-200 bg-neutral-50 hover:bg-neutral-100/70 p-3 px-4 rounded-lg w-full '
                                                : 'flex items-center md:justify-center cursor-pointer bg-neutral-50 hover:bg-neutral-100/70 p-3 px-4 rounded-lg w-full outline-2 outline-dashed outline-neutral-200 outline-offset-0 opacity-50 hover:opacity-100'">
                                            <div :class="compareModeEnabled ? '' : ''">
                                                <h1 class="text-neutral-500">Jämför</h1>
                                                <h1 class="md:text-2xl font-medium">
                                                    {{ compareMethodLabel || 'Välj metod' }}
                                                </h1>
                                            </div>
                                        </div>
                                    </transition>
                                </div>
                                <template #content>
                                    <div class="py-1 min-w-60 max-w-110">
                                        <!-- <div class="px-4 pt-3 pb-2">
                                            <h3 class="text-sm font-semibold text-neutral-900">Välj metod att jämföra</h3>
                                            <p class="text-xs text-neutral-500">Valet aktiverar metodjämförelse.</p>
                                        </div> -->
                                        <div class="px-2">
                                            <div class="hover:bg-neutral-50 p-3 w-full justify-between flex items-center gap-4 rounded-md my-1 cursor-pointer"
                                                :class="{ 'bg-neutral-100': !compareModeEnabled }"
                                                @click="setCompareFrameworkIndex(null)">
                                                <div>
                                                    <h1 class="text-md font-semibold text-neutral-900">Ingen jämförelse
                                                    </h1>
                                                    <p class="text-sm text-neutral-500 font-light">Stäng av jämförelse.
                                                    </p>
                                                </div>
                                                <div
                                                    class="size-10 flex justify-center items-center bg-muted rounded-md">
                                                    <UIcon name="i-heroicons-x-mark" />
                                                </div>
                                            </div>
                                        </div>
                                        <USeparator class="my-2 w-full" />

                                        <div v-for="option in compareFrameworkOptions" :key="option.value" class="px-2">
                                            <div class="hover:bg-neutral-50 p-3 w-full justify-between flex items-center gap-4 rounded-md my-1 cursor-pointer"
                                                :class="{
                                                    'bg-neutral-100': option.value === selectedCompareFrameworkIndex
                                                }" @click="setCompareFrameworkIndex(option.value)">
                                                <div>
                                                    <h1 class="text-md font-semibold text-neutral-900">
                                                        {{ option.label }}
                                                    </h1>
                                                    <p class="text-sm text-neutral-500 font-light">
                                                        {{ option.description || '' }}
                                                    </p>
                                                </div>
                                                <div
                                                    class="size-10 flex justify-center items-center bg-muted rounded-md">
                                                    <UIcon v-if="option.icon" :name="option.icon" />
                                                    <UIcon v-else name="i-heroicons-photo" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </UPopover>
                        </div>
                        <UTabs v-model="contentTab" :items="contentTabItems" size="xl" :clearable="false" :ui="{
                            root: 'min-w-max flex-shrink-0 ',
                            list: 'flex-nowrap gap-2 ring ring-muted/50',
                            indicator: 'bg-white border border-muted/50 shadow ',
                            trigger: 'data-[state=active]:text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                        }" />
                    </div>

                </div>

                <div v-if="contentTab === 'timeline'" class=" flex-1 flex flex-col  sm:p-0">
                    <div
                        class=" sticky w-full top-18  pb-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-3 z-30">


                        <div class="flex flex-nowrap gap-2 items-center px-1 overflow-visible">
                            <!-- <UPopover :close="false" :transition="true" :overlay="true" :content="{ align: 'start' }"
                                :ui="{ content: 'max-w-xs sm:max-w-sm p-4 sm:p-4 pb-2' }"
                                title="Har skogen varit kalavverkad tidigare?"
                                description="Hur skogen har brukats tidigare påverkar vilka mykorrhizasvampar som finns.">
                                <UTooltip text="Skogens historik">
                                    <UButton color="neutral" variant="outline" size="xl"
                                        :leading-icon="selectedStartskogOption?.icon"
                                        :label="selectedStartskogOption?.label || ''"
                                        :aria-label="selectedStartskogOption?.label || 'Skogens historik'"
                                        :ui="{ label: isMobile ? 'hidden sm:inline' : '' }" class="ring-muted/50" />
                                </UTooltip>

                                <template #content>
                                    <h1 class="font-semibold mb-2">Har skogen varit kalavverkad
                                        tidigare?
                                    </h1>
                                    <p class="text-muted text-sm mb-4">Hur skogen har brukats
                                        tidigare
                                        påverkar
                                        vilka
                                        mykorrhizasvampar som finns. </p>
                                    <USelect :items="startskogTabs" v-model="selectedStartskogTab"
                                        :icon="selectedStartskogIcon"
                                        class="transition-all ring-muted/50 mb-2 sm:mb-0" />
                                    <p class="text-neutral-700 text-xs">

                                    </p>
                                
                                </template>
                            </UPopover>
                            <USeparator orientation="vertical" class="h-6" /> -->
                            <UFieldGroup class="w-full ">
                                <UButton v-for="(item, index) in timelineItems" :key="`immersive-timeline-${index}`"
                                    size="xl" color="neutral" variant="outline"
                                    :class="index === activeTimelineIndex ? 'border-neutral-900 bg-neutral-900 hover:bg-neutral-900 text-white opacity-100 ring-0 shadow' : 'border-transparent  hover:opacity-100'"
                                    class="ring-muted rounded-lg shadow" :label="formatTimelineButtonLabel(item.tid)"
                                    @click="selectTimelineSlide(index)" />
                            </UFieldGroup>

                        </div>
                        <!-- <div class="flex items-center gap-2">
                            <UPopover :ui="{ content: 'p-0 w-80' }" :content="{
                                align: 'end',
                                side: 'bottom',
                                sideOffset: 8
                            }">
                                <UButton color="neutral" variant="outline" icon="iconamoon:compare-duotone"
                                    :label="compareEnabled ? 'Jämför' : 'Jämför'" class="ring-muted" size="lg" />
                                <template #content>
                                    <div class="space-y-0.5 p-3">
                                        <div class="grid grid-cols-2 gap-2 ">
                                            <UButton size="xs" variant="outline" color="neutral"
                                                @click="setCompareMode(false)"
                                                :class="!compareEnabled ? 'bg-neutral-100 shadow ring-muted' : 'text-muted/60 hover:text-muted ring-muted/50'">
                                                <div class="flex flex-col text-center items-center w-full space-y-1">
                                                    <UIcon name="i-bx-rectangle" class="size-4" />
                                                    <h1>Enkelvy</h1>
                                                </div>
                                            </UButton>
                                            <UButton size="xs" variant="outline" color="neutral"
                                                @click="setCompareMode(true)"
                                                :class="compareEnabled ? 'bg-neutral-100 shadow ring-muted' : 'text-muted/60 hover:text-muted ring-muted/50'">
                                                <div class="flex flex-col text-center items-center w-full space-y-1">
                                                    <UIcon name="iconamoon:compare-duotone" class="size-4" />
                                                    <h1>Jämför</h1>
                                                </div>
                                            </UButton>
                                        </div>

                                        <UTabs v-if="compareEnabled" v-model="compareMode" :items="compareOptions"
                                            size="sm" placeholder="Välj" :clearable="false"
                                            class="w-full ring-muted -mb-2 mt-2" :ui="{
                                                root: 'min-w-max flex-shrink-0',
                                                list: 'flex-nowrap rounded-xl bg-muted/50 -mb-1.5 gap-2',
                                                indicator: 'bg-white border border-muted/50 shadow ',
                                                trigger: ' data-[state=active]:text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary '
                                            }" />

                                        <div v-if="compareEnabled && compareMode === 'methods'" class="space-y-2 mt-3">
                                            <p class="text-xs text-neutral-600 pt-2">Välj metod att jämföra med</p>
                                            <USelect :items="compareMethodOptions" v-model="compareMethodId"
                                                placeholder="Välj metod" class="w-full ring-muted"
                                                :popper="{ placement: 'bottom-start' }" />
                                        </div>

                                    </div>
                                </template>
                            </UPopover>
                            <UPopover :ui="{ content: 'p-3 w-72' }" :content="{
                                align: 'end',
                                side: 'bottom',
                                sideOffset: 8
                            }">
                                <UButton color="neutral" variant="outline" icon="i-bi-layout-split" label="Layout"
                                    class="ring-muted" size="lg" />
                                <template #content>
                                    <div class="grid grid-cols-3 gap-2">
                                        <UButton size="xs" variant="outline" color="neutral"
                                            @click="displayMode = 'images'"
                                            :class="displayMode === 'images' ? 'bg-neutral-100 shadow ring-muted' : 'text-muted/60 hover:text-muted ring-muted/50'">
                                            <div class="flex flex-col text-center items-center w-full space-y-1">
                                                <UIcon name="i-heroicons-photo" class="size-4" />
                                                <h1>Bilder</h1>
                                            </div>
                                        </UButton>
                                        <UButton size="xs" variant="outline" color="neutral"
                                            @click="displayMode = 'both'"
                                            :class="displayMode === 'both' ? 'bg-neutral-100 shadow ring-muted' : 'text-muted/60 hover:text-muted ring-muted/50'">
                                            <div class="flex flex-col text-center items-center w-full space-y-1">
                                                <UIcon name="i-bi-layout-split" class="size-4" />
                                                <h1>Båda</h1>
                                            </div>
                                        </UButton>
                                        <UButton size="xs" variant="outline" color="neutral"
                                            @click="displayMode = 'chart'"
                                            :class="displayMode === 'chart' ? 'bg-neutral-100 shadow ring-muted' : 'text-muted/60 hover:text-muted ring-muted/50'">
                                            <div class="flex flex-col text-center items-center w-full space-y-1">
                                                <UIcon name="i-heroicons-presentation-chart-line" class="size-4" />
                                                <h1>Diagram</h1>
                                            </div>
                                        </UButton>
                                    </div>
                                </template>
                            </UPopover>
                        </div> -->


                    </div>
                    <div class="md:flex justify-center space-x-4 sm:p-1 p-3">
                        <div v-if="showImages"
                            class="flex-1 rounded-xl ring ring-muted/50 relative w-full overflow-hidden shadow aspect-video bg-neutral-900 resize min-w-60 min-h-60 h-full max-h-150"
                            :style="heroBackgroundStyle">
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
                                                        class="w-full h-full object-cover relative" loading="lazy"
                                                        :style="{ opacity: treeFade }" />
                                                    <svg v-if="isBestandsgransVisible"
                                                        class="absolute inset-0 w-full h-full pointer-events-none"
                                                        viewBox="0 0 1500 844" preserveAspectRatio="xMidYMid slice">
                                                        <image :href="bestandsgransSrc" x="0" y="0" width="1500"
                                                            height="844" preserveAspectRatio="xMidYMid slice" />
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
                                                        viewBox="0 0 1500 844" preserveAspectRatio="xMidYMid slice">
                                                        <image :href="bestandsgransSrc" x="0" y="0" width="1500"
                                                            height="844" preserveAspectRatio="xMidYMid slice" />
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
                                        <img :src="currentTimelineItem.thumb" :alt="`Foto ${currentTimelineItem.tid}`"
                                            class="w-full h-full object-cover relative transition-opacity duration-500"
                                            :style="{ opacity: treeFade }" />
                                        <svg v-if="isBestandsgransVisible"
                                            class="absolute inset-0 w-full h-full pointer-events-none"
                                            viewBox="0 0 1500 844" preserveAspectRatio="xMidYMid slice">
                                            <image :href="bestandsgransSrc" x="0" y="0" width="1500" height="844"
                                                preserveAspectRatio="xMidYMid slice" />
                                        </svg>
                                        <div class="absolute inset-0 pointer-events-none">
                                            <template v-for="(card, idx) in markerCards" :key="`overlay-${card.key}`">
                                                <template
                                                    v-if="card.key !== 'naturvardsarter' && isMarkerOverlayVisible(card.key) && card.overlayAvailable !== false">
                                                    <template v-if="card.overlaySvgs?.length">
                                                        <img v-for="(overlay, svgIdx) in card.overlaySvgs"
                                                            :key="`${card.key}-single-${svgIdx}`" :src="overlay.src"
                                                            :alt="card.title"
                                                            class="absolute inset-0 w-full h-full object-cover"
                                                            :style="{ opacity: overlay.opacity ?? 1 }" />
                                                    </template>
                                                    <img v-else-if="card.svgPath" :src="card.svgPath" :alt="card.title"
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
                                        <NaturvardsOverlayLayer :visible="isMarkerOverlayVisible('naturvardsarter')"
                                            :framework="selectedFrameworkKey" :startskog="selectedStartskogTab"
                                            :time-label="currentTimelineItem?.tid" />
                                        <div
                                            class="absolute top-2 left-2 z-20 flex flex-col items-start gap-1 pointer-events-none">
                                            <UBadge v-if="!isMobile" size="md"
                                                class="backdrop-blur-xl bg-neutral-100/0 text-neutral-100 h-fit whitespace-nowrap mb-0.5">
                                                {{ selectedMethod.title || selectedMethod.id }}
                                            </UBadge>
                                            <UBadge size="md"
                                                class="backdrop-blur-xl bg-neutral-950/50 text-neutral-100 h-fit whitespace-nowrap">
                                                {{ formatTimelineCurrentLabel(timelineItems[activeTimelineIndex]?.tid)
                                                }}
                                            </UBadge>
                                        </div>
                                    </template>
                                    <ImagePlaceholder v-else />
                                </div>
                            </Transition>
                            <div class="flex absolute right-3 bottom-3 z-20 gap-2">
                                <UPopover :content="{
                                    align: 'end',
                                    side: 'top',
                                }">
                                    <UButton icon="mingcute:tree-fill" label="Genomskinlighet" variant="outline"
                                        class="ring-muted/50" color="neutral" size="sm" />
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

                                            <USlider v-model="treeFade" :min="0" :max="1" :step="0.05" class="w-32"
                                                color="primary" orientation="horizontal" inverse size="xs" />
                                            <!-- <UIcon name="mingcute:tree-fill" class="size-5 text-primary" /> -->



                                        </div>
                                    </template>
                                </UPopover>

                                <UPopover :content="{
                                    align: 'end',
                                    side: 'top',
                                }">
                                    <UButton icon="i-fluent-shape-organic-16-filled" label="Mycelfärger"
                                        variant="outline" class="ring-muted/50" color="neutral" size="sm" />
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
                        <ReuseMarkerCardsRow v-if="isMobile" />
                        <div class="flex-1 min-w-60 min-h-60">
                            <ForestryChartMain v-show="showChart" :selectedChart="chartSelected"
                                class="p-2 h-full border-muted/50 ring-muted/50 ring rounded-xl shadow bg-white"
                                @update:selectedChart="val => chartSelected = val"
                                :parentSelectedFrameworks="chartFrameworks" :currentStartskog="selectedStartskogTab"
                                :currentTimeValue="currentTimelineTime" preserveFrameworkOrder :showControls="true"
                                :showMatsvampSelector="true" />
                        </div>
                    </div>
                    <ReuseMarkerCardsRow v-if="!isMobile" />

                    <div class="grid md:grid-cols-2 gap-4 px-3 sm:px-1">
                        <div class="space-y-2 p-6 ring ring-muted/50 rounded-xl shadow bg-white">
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
                            class="space-y-2 p-6 outline-dashed outline-2 outline-neutral-200 rounded-xl  bg-neutral-50">
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
                <div v-else class="flex-1 flex flex-col sm:gap-6 gap-3">
                    <div class="overflow-auto scrollbar-hidden">
                        <ReuseMethodPanelBody />
                    </div>
                    <!-- <ReuseMethodPanelFooter /> -->
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
                    :showMatsvampSelector="true" />
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
                    <UModal :fullscreen="isMobile ? true : false" :title="page.ecologyintro?.title ?? ''"
                        :description="page.ecologyintro?.description ?? ''" :ui="{
                            header: 'shrink-0',
                        }">
                        <UAlert icon="i-heroicons-book-open" color="neutral" variant="outline" title="Fakta i korthet"
                            class="sm:w-fit shadow ring-muted/50 hover:opacity-85 hover:cursor-pointer" />
                        <template #body>
                            <EcologyIntro :section="page.ecologyintro" />
                        </template>
                    </UModal>
                    <UModal :fullscreen="isMobile ? true : false" :title="page.underlag"
                        :description="page.underlagdescription" :ui="{
                            header: 'shrink-0',
                        }">
                        <UAlert icon="i-heroicons-document-magnifying-glass" color="neutral" variant="outline"
                            :title="page.underlag"
                            class="sm:w-fit shadow ring-muted/50 hover:opacity-85 hover:cursor-pointer" />
                        <template #body>
                            <UnderlagContent :underlag="page.underlag" :underlagbild="page.underlagbild"
                                :sections="page.underlagSections" />
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
    scrollToTop: false,
    pageTransition: false,
    key: 'skogsskotsel-method',
})

const treeFade = ref(0.8)
const isMethodDescriptionExpanded = ref(false)
const isSvampDescriptionExpanded = ref(false)
const [DefineMethodPanelBody, ReuseMethodPanelBody] = createReusableTemplate()
const [DefineMethodPanelFooter, ReuseMethodPanelFooter] = createReusableTemplate()
const [DefineMarkerCardsRow, ReuseMarkerCardsRow] = createReusableTemplate()
const markersRowOpen = ref(true)
const [DefineMarkerCardHeader, ReuseMarkerCardHeader] = createReusableTemplate()
const [DefineMarkerCardTrigger, ReuseMarkerCardTrigger] = createReusableTemplate()
const [DefineMarkerCardBody, ReuseMarkerCardBody] = createReusableTemplate()
const markerPanelOpen = reactive<Record<string, boolean>>({})
const markerPinned = reactive<Record<string, boolean>>({})
const markerPreview = reactive<Record<string, boolean>>({})
const isMarkerOverlayVisible = (key: string) => markerPinned[key] || markerPreview[key]
const selectedMarkerKey = ref<string | null>(null)
const markerSlideoverPinned = ref(false)
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

const isMobile = useMediaQuery('(max-width: 767px)')
const isDesktop = useMediaQuery('(min-width: 640px)')
const contentTab = ref<'timeline' | 'method'>('method')
const contentTabItems = [
    { label: 'Om metoden', value: 'method' },
    { label: 'Tidslinje', value: 'timeline' },

]
const showMobileStickySelect = ref(false)
const bestandsgransVisible = ref(true)
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
onBeforeUnmount(() => {
    naturvardsModalOpen.value = false
    startskogModalOpen.value = false
    overlayRegistry?.closeAll?.()
})

const onboardingStore = useOnboardingStore()
const route = useRoute()
const router = useRouter()

const { data: page } = await useAsyncData('skogsskotsel', () => queryCollection('skogsskotsel').first())
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
const { data: methodsData } = await useAsyncData('skotselmetoder', () => queryCollection('skotselmetoder').first())
if (!page.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Page not found',
        fatal: true
    })
}
interface Method {
    index?: number
    id: string
    title: string
    image: string
    shortdescription: string
    description?: string
    descriptionsvamp?: string
    descriptionParagraphs?: string[]
    descriptionsvampParagraphs?: string[]
    descriptionmatsvampParagraphs?: string[]
    descriptionnaturvårdssvampParagraphs?: string[]
    type?: string
    icon?: string
}

const methods = computed<Method[]>(() => methodsData.value?.methods ?? [])
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
    description: '',
    descriptionsvamp: '',
    descriptionParagraphs: [],
    descriptionsvampParagraphs: [],
    descriptionmatsvampParagraphs: [],
    descriptionnaturvårdssvampParagraphs: []
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
    compareMethod.value?.title || compareMethodResolved.value || 'Jämförelse'
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

const startskogModalOpen = ref(route.query.entry === '1' || route.query.entry === 'true')

const splitParagraphs = (text: string | undefined | null) =>
    (text || '')
        .split(/\n\s*\n/g)
        .map(p => p.trim())
        .filter(Boolean)

// Accordion items for the selected method
const accordionItems = computed(() => [
    {
        label: 'Om metoden',
        icon: 'i-hugeicons-tree-06',
        value: 'description',
        paragraphs: selectedMethod.value.descriptionParagraphs?.length
            ? selectedMethod.value.descriptionParagraphs
            : splitParagraphs(selectedMethod.value.description),
    },
    {
        label: 'Påverkan på mykorrhiza',
        icon: 'i-hugeicons-mushroom',
        value: 'svamp',
        paragraphs: selectedMethod.value.descriptionsvampParagraphs?.length
            ? selectedMethod.value.descriptionsvampParagraphs
            : splitParagraphs(selectedMethod.value.descriptionsvamp),
    }
])
const methodDescriptionSection = computed(() =>
    accordionItems.value.find(section => section.value === 'description')
)
const methodSvampSection = computed(() =>
    accordionItems.value.find(section => section.value === 'svamp')
)
const svampParagraphs = computed(() => methodSvampSection.value?.paragraphs ?? [])
const svampMainParagraphs = computed(() => svampParagraphs.value)
const svampMatsvampParagraph = computed(() => {
    const paragraphs = selectedMethod.value.descriptionmatsvampParagraphs;
    if (paragraphs?.length) return paragraphs.join('\n\n');
    if (svampParagraphs.value.length >= 2) {
        return svampParagraphs.value[svampParagraphs.value.length - 2];
    }
    return '';
})
const svampNaturvardParagraph = computed(() => {
    const paragraphs = selectedMethod.value.descriptionnaturvårdssvampParagraphs;
    if (paragraphs?.length) return paragraphs.join('\n\n');
    if (svampParagraphs.value.length >= 1) {
        return svampParagraphs.value[svampParagraphs.value.length - 1];
    }
    return '';
})

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

const impactByMethod: Record<string, { value: number; tone: 'low' | 'medium' | 'high'; label: string }> = {
    naturskydd: { value: 5, tone: 'low', label: 'Låg ' },
    trakthygge: { value: 85, tone: 'high', label: 'Hög ' },
    bladning: { value: 20, tone: 'low', label: 'Låg ' },
    luckhuggning: { value: 55, tone: 'medium', label: 'Medel ' },
    skarmtrad: { value: 40, tone: 'medium', label: 'Medel ' },
}

const resolveImpact = (methodId: string | null | undefined) => {
    const normalized = normalizeFrameworkKey(methodId)
    const base = impactByMethod[normalized] ?? { value: 50, tone: 'medium', label: 'Medel påverkan' }
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

.scrollbar-hidden {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-hidden::-webkit-scrollbar {
    display: none;
}
</style>
