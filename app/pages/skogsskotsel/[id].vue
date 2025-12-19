<template>
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
    <div class="flex-1 transition-all" v-if="page">





        <Transition name="fold-down">
            <div v-if="isMobile && showMobileStickySelect"
                class="fixed top-18 inset-x-3 z-50 pointer-events-auto origin-top flex gap-3">
                <!-- <USelect :items="startskogTabs" v-model="selectedStartskogTab" size="xl" :icon="selectedStartskogIcon"
                    class="ring-muted w-full shadow rounded-lg" /> -->
                <USelect size="xl" :items="frameworkOptions" v-model="selectedFrameworkIndex"
                    :placeholder="selectedMethod.title || 'Välj metod'" append-to-body variant="outline"
                    class="ring-muted w-full shadow rounded-lg"
                    :ui="{ content: 'min-w-fit rounded-lg z-50', viewport: 'text-center' }" />
                <UPopover :ui="{ content: 'py-1' }">
                    <UChip :text="markerCards.length" size="3xl">
                        <UButton icon="i-hugeicons-center-focus" size="xl" variant="outline"
                            class="shadow rounded-lg ring-muted" color="neutral" />
                    </UChip>
                    <template #content>
                        <div v-for="card in markerCards" :key="card.key" class="p-1">
                            <UModal v-if="card.key === 'naturvardsarter'" v-model:open="naturvardsModalOpen"
                                :title="card.title" :description="card.description" :ui="{ header: 'shrink-0' }"
                                fullscreen>
                                <div>
                                    <UButton :label="card.title" :icon="card.icon" color="neutral" variant="ghost"
                                        class="ring-muted/50 w-full justify-start" />
                                </div>
                                <template #body>
                                    <div v-if="card.images?.length" class="space-y-3 mb-10">
                                        <UCarousel dots arrows :items="card.images.map((src, idx) => ({ src, idx }))"
                                            prev-icon="i-heroicons-chevron-left" next-icon="i-heroicons-chevron-right"
                                            :ui="{

                                                // controls: 'absolute -bottom-8 inset-x-12 max-w-30 mx-auto',
                                                dots: '-bottom-4',
                                                dot: 'w-6 h-1',
                                                prev: 'start-4 sm:start-4 top-1/2 -translate-y-1/2',
                                                next: 'end-4 sm:end-4 top-1/2 -translate-y-1/2',

                                            }" class="w-full">
                                            <template #default="{ item }">
                                                <div
                                                    class="relative rounded-lg overflow-hidden ring ring-muted/50 m-1 shadow">
                                                    <img :src="item.src" :alt="card.title" class="h-72 w-full"
                                                        loading="lazy" />
                                                    <div v-if="card.imageDescriptions?.[item.idx]"
                                                        class="text-sm text-neutral-100 absolute bottom-0 w-full bg-neutral-950/50 p-2">
                                                        {{ card.imageDescriptions[item.idx] }}
                                                    </div>
                                                </div>
                                            </template>
                                        </UCarousel>
                                    </div>
                                    <img v-else-if="card.image" :src="card.image" class="rounded-md mb-4" />
                                    <ImagePlaceholder v-else />


                                    <ContentRenderer v-if="card.doc?.body" :value="card.doc" />
                                    <p v-else class="text-neutral-800">{{ card.description }}</p>
                                    <div class="mt-4">
                                        <UButton color="signal" variant="subtle" icon="i-carbon-chart-line-smooth"
                                            label="Diagram för naturvårdssvampar" class=" "
                                            @click="goToNaturvardsChart" />
                                    </div>
                                </template>
                            </UModal>
                            <UModal fullscreen v-else :title="card.title" :description="card.description"
                                :ui="{ header: 'shrink-0' }">
                                <div>
                                    <UButton :label="card.title" :icon="card.icon" color="neutral" variant="ghost"
                                        class="ring-muted/50 w-full justify-start" />
                                </div>
                                <template #body>
                                    <div v-if="card.images?.length" class="space-y-3 mb-10">
                                        <UCarousel dots arrows :items="card.images.map((src, idx) => ({ src, idx }))"
                                            prev-icon="i-heroicons-chevron-left" next-icon="i-heroicons-chevron-right"
                                            :ui="{

                                                dots: '-bottom-4',
                                                dot: 'w-6 h-1',
                                                prev: 'start-4 sm:start-4 top-1/2 -translate-y-1/2',
                                                next: 'end-4 sm:end-4 top-1/2 -translate-y-1/2',

                                            }" class="w-full">
                                            <template #default="{ item }">
                                                <div
                                                    class="relative rounded-lg overflow-hidden ring ring-muted/50 m-1 shadow">
                                                    <img :src="item.src" :alt="card.title" class="h-72 w-full"
                                                        loading="lazy" />
                                                    <div v-if="card.imageDescriptions?.[item.idx]"
                                                        class="text-sm text-neutral-100 absolute bottom-0 w-full bg-neutral-950/50 p-2">
                                                        {{ card.imageDescriptions[item.idx] }}
                                                    </div>
                                                </div>
                                            </template>
                                        </UCarousel>
                                    </div>
                                    <img v-else-if="card.image" :src="card.image" class="rounded-md mb-4" />
                                    <ImagePlaceholder v-else />


                                    <ContentRenderer v-if="card.doc?.body" :value="card.doc" />
                                    <p v-else class="text-neutral-800">{{ card.description }}</p>
                                </template>
                            </UModal>
                        </div>

                    </template>
                </UPopover>
            </div>
        </Transition>


        <!-- <Transition name="fade"> -->
        <UContainer v-if="!selectedMethod.id" class="w-full px-0">

            <UPageHero :ui="{ container: 'py-20 pb-16 lg:py-24', title: 'sm:text-7xl', headline: 'text-neutral' }"
                :description="page.hero.description" :orientation="page.hero.orientation" class="">

            </UPageHero>

        </UContainer>
        <!-- </Transition> -->

        <!-- <UContainer v-if="!isMobile"
            class="w-full flex flex-col sm:flex-row  justify-between gap-3 sm:gap-6 overflow-x-auto transition-all overflow-visible"
            :class="[selectedMethod.id ? 'mt-0 flex-row' : 'mt-8 flex-col']">
            <Motion v-for="method in methods" :key="method.id" class="relative" :initial="{
                scale: 1,
                transform: 'translateY(10px)',
                opacity: 0,

            }" :animate="{
                scale: 1,
                transform: 'translateY(0px)',
                opacity: 1,
            }" :transition="{
                duration: 0.3,
                delay: 0.5 + 0.05 * (method.index ?? 0)
            }">

                <div v-if="!selectedMethod.id" @click="selectedId = method.id" :class="[
                    'shrink-0 lg:shrink sm:w-58 lg:w-full bg-white transition-all hover:opacity-100 border border-muted/50 overflow-hidden rounded-lg h-fit shadow-lg hover:shadow-md relative cursor-pointer',
                    !selectedId ? 'opacity-100' : (selectedId === method.id ? 'opacity-100 ring-primary/40 shadow-lg' : 'opacity-50')
                ]">

                    <template v-if="!selectedMethod.id">
                        <UBadge v-if="method.type" class="absolute top-2 left-2" :label="method.type" color="neutral"
                            variant="subtle" />
                        <img :src="methodImage(method, 'card')" :alt="method.title" width="300" height="160"
                            class=" w-full h-full" loading="lazy" decoding="async" />
                        <h1 class="text-lg p-2 px-3 font-medium text-nowrap ">{{ method.title }}</h1>
                    </template>
                 
                </div>


             
            </Motion>
        </UContainer> -->
        <!-- 
        <div v-else-if="selectedMethod.id" class="p-4 mb-3 flex gap-3">

            <USelect size="xl" :items="frameworkOptions" v-model="selectedFrameworkIndex"
                :placeholder="selectedMethod.title || 'Välj metod'" append-to-body variant="outline"
                class="ring-muted w-full shadow rounded-lg"
                :ui="{ content: 'min-w-fit rounded-lg z-50', viewport: 'text-center' }" />
            <UPopover :ui="{ content: 'py-1' }">
                <UChip :text="markerCards.length" size="3xl">
                    <UButton icon="i-hugeicons-center-focus" size="xl" variant="outline"
                        class="shadow rounded-lg ring-muted" color="neutral" />
                </UChip>
                <template #content>
                    <div v-for="card in markerCards" :key="card.key" class="p-1">
                        <UModal v-if="card.key === 'naturvardsarter'" v-model:open="naturvardsModalOpen"
                            :title="card.title" :description="card.description" :ui="{ header: 'shrink-0' }"
                            :fullscreen="true">
                            <div>
                                <UButton :label="card.title" :icon="card.icon" color="neutral" variant="ghost"
                                    class="ring-muted/50 w-full justify-start" />
                            </div>
                            <template #body>
                                <div v-if="card.images?.length" class="space-y-3 mb-10">
                                    <UCarousel  dots arrows
                                        :items="card.images.map((src, idx) => ({ src, idx }))"
                                        prev-icon="i-heroicons-chevron-left" next-icon="i-heroicons-chevron-right" :ui="{
                                            dots: '-bottom-4',
                                            dot: 'w-6 h-1',
                                            prev: 'start-4 sm:start-4 top-1/2 -translate-y-1/2',
                                            next: 'end-4 sm:end-4 top-1/2 -translate-y-1/2',
                                        }" class="w-full">
                                        <template #default="{ item }">
                                            <div
                                                class="relative rounded-lg overflow-hidden ring ring-muted/50 m-1 shadow">
                                                <img :src="item.src" :alt="card.title" class=" w-full" loading="lazy" />
                                                <div v-if="card.imageDescriptions?.[item.idx]"
                                                    class="text-sm text-neutral-100 absolute bottom-0 w-full bg-neutral-950/50 p-2">
                                                    {{ card.imageDescriptions[item.idx] }}
                                                </div>
                                            </div>
                                        </template>
                                    </UCarousel>
                                </div>
                                <img v-else-if="card.image" :src="card.image" class="rounded-md mb-4" />
                                <ImagePlaceholder v-else />


                                <ContentRenderer v-if="card.doc?.body" :value="card.doc" />
                                <p v-else class="text-neutral-800">{{ card.description }}</p>
                                <div class="mt-4">
                                    <UButton color="signal" variant="subtle" icon="i-carbon-chart-line-smooth"
                                        label="Diagram för naturvårdssvampar" class=" " @click="goToNaturvardsChart" />
                                </div>
                            </template>
                        </UModal>
                        <UModal fullscreen v-else :title="card.title" :description="card.description"
                            :ui="{ header: 'shrink-0' }">
                            <div>
                                <UButton :label="card.title" :icon="card.icon" color="neutral" variant="ghost"
                                    class="ring-muted/50 w-full justify-start" />
                            </div>
                            <template #body>
                                <div v-if="card.images?.length" class="space-y-3 mb-10">
                                    <UCarousel  dots arrows
                                        :items="card.images.map((src, idx) => ({ src, idx }))"
                                        prev-icon="i-heroicons-chevron-left" next-icon="i-heroicons-chevron-right" :ui="{

                                            dots: '-bottom-4',
                                            dot: 'w-6 h-1',
                                            prev: 'start-4 sm:start-4 top-1/2 -translate-y-1/2',
                                            next: 'end-4 sm:end-4 top-1/2 -translate-y-1/2',

                                        }" class="w-full">
                                        <template #default="{ item }">
                                            <div
                                                class="relative rounded-lg overflow-hidden ring ring-muted/50 m-1 shadow">
                                                <img :src="item.src" :alt="card.title" class=" w-full" loading="lazy" />
                                                <div v-if="card.imageDescriptions?.[item.idx]"
                                                    class="text-sm text-neutral-100 absolute bottom-0 w-full bg-neutral-950/50 p-2">
                                                    {{ card.imageDescriptions[item.idx] }}
                                                </div>
                                            </div>
                                        </template>
                                    </UCarousel>
                                </div>
                                <img v-else-if="card.image" :src="card.image" class="rounded-md mb-4" />
                                <ImagePlaceholder v-else />


                                <ContentRenderer v-if="card.doc?.body" :value="card.doc" />
                                <p v-else class="text-neutral-800">{{ card.description }}</p>
                            </template>
                        </UModal>
                    </div>
                </template>
            </UPopover>
        </div> -->

        <!-- <Motion v-else class="relative" :initial="{
            transform: 'translateX(10px)',
            opacity: 0,
            filter: 'blur(5px)'

        }" :animate="{
            transform: 'translateX(0px)',
            opacity: 1,
            filter: 'blur(0px)'
        }" :transition="{
            duration: 0.5,
            delay: 0.2
        }">
            <UCarousel  v-slot="{ item }" :items="methods" loop :speed="4"
                :ui="{ item: 'basis-3/5 md:basis-1/3 p-2' }" class="mobile-carousel">

                <div @click="selectedId = item.id" :class="[
                    'shrink-0 bg-white transition-all hover:opacity-100 border border-muted/50 overflow-hidden rounded-lg h-fit shadow hover:shadow-md relative cursor-pointer mb-4',
                    !selectedId ? 'opacity-100' : (selectedId === item.id ? 'opacity-100 ring-primary/40 shadow-lg' : 'opacity-50')
                ]">
                    <template v-if="!selectedMethod.id">
                        <UBadge v-if="item.type" class="absolute top-2 left-2" :label="item.type" color="neutral"
                            variant="subtle" />
                        <img :src="methodImage(item, 'card')" :alt="item.title" width="300" height="160"
                            class="w-full h-full" loading="lazy" decoding="async" />
                        <h1 class="text-lg p-2 px-3 font-medium text-nowrap ">{{ item.title }}</h1>
                    </template>
                    <template v-else>
                        <div class="flex items-center gap-3 p-3">
                            <img v-if="selectedId === item.id" :src="methodImage(item, 'thumb')" :alt="item.title"
                                width="64" height="64" class="w-16 h-16 rounded-md object-cover ring-1 ring-muted/50"
                                loading="lazy" decoding="async" />
                            <h1 class="text-lg font-medium text-nowrap">{{ item.title }}</h1>
                        </div>
                    </template>
                </div>

            </UCarousel>
        </Motion> -->



        <!-- <div class="w-full bg-neutral-50 border-t border-muted"> -->


        <UContainer class="w-full px-0 " v-if="selectedMethod.id">
            <UPage class="pt-0 min-h-screen" :left="immersiveAsideOpen" :right="false" :ui="immersivePageUi">
                <template v-if="immersiveAsideOpen" #left>
                    <UPageAside :ui="{ container: ' flex flex-col flex-1 h-full', root: '' }">
                        <template #top>
                            <div>
                                <p class="text-sm font-medium text-neutral-800 mt-4 mb-2">Skötselmetoder</p>

                                <div v-for="method in methods" class="space-y-1">
                                    <UTooltip :text="method.shortdescription || method.title" :content="{
                                        side: 'right',
                                    }">
                                        <UButton :label="method.title" :leading-icon="method.icon"
                                            @click="selectedId = method.id"
                                            :color="selectedId === method.id ? 'primary' : 'neutral'" variant="ghost"
                                            class="ring-muted/50 w-full" />
                                    </UTooltip>
                                </div>
                            </div>

                        </template>
                        <template #default>
                            <USeparator class="mb-8" />

                            <div class="space-y-1">
                                <!-- <p class="text-xs uppercase tracking-wide text-muted px-1">Fokusområden</p> -->
                                <template v-for="card in markerCards" :key="card.key">
                                    <UModal v-if="card.key === 'naturvardsarter'" v-model:open="naturvardsModalOpen"
                                        :title="card.title" :description="card.description"
                                        :ui="{ header: 'shrink-0' }">
                                        <div>
                                            <UButton :label="card.title" :icon="card.icon" color="neutral"
                                                variant="ghost" class="ring-muted/50 w-full justify-start" />
                                        </div>
                                        <template #body>
                                            <div v-if="card.images?.length" class="space-y-3 mb-10">
                                                <UCarousel dots arrows
                                                    :items="card.images.map((src, idx) => ({ src, idx }))"
                                                    prev-icon="i-heroicons-chevron-left"
                                                    next-icon="i-heroicons-chevron-right" :ui="{

                                                        // controls: 'absolute -bottom-8 inset-x-12 max-w-30 mx-auto',
                                                        dots: '-bottom-4',
                                                        dot: 'w-6 h-1',
                                                        prev: 'start-4 sm:start-4 top-1/2 -translate-y-1/2',
                                                        next: 'end-4 sm:end-4 top-1/2 -translate-y-1/2',

                                                    }" class="w-full">
                                                    <template #default="{ item }">
                                                        <div
                                                            class="relative rounded-lg overflow-hidden ring ring-muted/50 m-1 shadow">
                                                            <img :src="item.src" :alt="card.title" class="h-72 w-full"
                                                                loading="lazy" />
                                                            <div v-if="card.imageDescriptions?.[item.idx]"
                                                                class="text-sm text-neutral-100 absolute bottom-0 w-full bg-neutral-950/50 p-2">
                                                                {{ card.imageDescriptions[item.idx] }}
                                                            </div>
                                                        </div>
                                                    </template>
                                                </UCarousel>
                                            </div>
                                            <img v-else-if="card.image" :src="card.image" class="rounded-md mb-4" />
                                            <ImagePlaceholder v-else />


                                            <ContentRenderer v-if="card.doc?.body" :value="card.doc" />
                                            <p v-else class="text-neutral-800">{{ card.description }}</p>
                                            <div class="mt-4">
                                                <UButton color="signal" variant="subtle"
                                                    icon="i-carbon-chart-line-smooth"
                                                    label="Diagram för naturvårdssvampar" class=" "
                                                    @click="goToNaturvardsChart" />
                                            </div>
                                        </template>
                                    </UModal>
                                    <UModal v-else :title="card.title" :description="card.description"
                                        :ui="{ header: 'shrink-0' }">
                                        <div>
                                            <UButton :label="card.title" :icon="card.icon" color="neutral"
                                                variant="ghost" class="ring-muted/50 w-full justify-start" />
                                        </div>
                                        <template #body>
                                            <div v-if="card.images?.length" class="space-y-3 mb-10">
                                                <UCarousel dots arrows
                                                    :items="card.images.map((src, idx) => ({ src, idx }))"
                                                    prev-icon="i-heroicons-chevron-left"
                                                    next-icon="i-heroicons-chevron-right" :ui="{

                                                        // controls: 'absolute -bottom-8 inset-x-12 max-w-30 mx-auto',
                                                        dots: '-bottom-4',
                                                        dot: 'w-6 h-1',
                                                        prev: 'start-4 sm:start-4 top-1/2 -translate-y-1/2',
                                                        next: 'end-4 sm:end-4 top-1/2 -translate-y-1/2',

                                                    }" class="w-full">
                                                    <template #default="{ item }">
                                                        <div
                                                            class="relative rounded-lg overflow-hidden ring ring-muted/50 m-1 shadow">
                                                            <img :src="item.src" :alt="card.title" class="h-72 w-full"
                                                                loading="lazy" />
                                                            <div v-if="card.imageDescriptions?.[item.idx]"
                                                                class="text-sm text-neutral-100 absolute bottom-0 w-full bg-neutral-950/50 p-2">
                                                                {{ card.imageDescriptions[item.idx] }}
                                                            </div>
                                                        </div>
                                                    </template>
                                                </UCarousel>
                                            </div>
                                            <img v-else-if="card.image" :src="card.image" class="rounded-md mb-4" />
                                            <ImagePlaceholder v-else />


                                            <ContentRenderer v-if="card.doc?.body" :value="card.doc" />
                                            <p v-else class="text-neutral-800">{{ card.description }}</p>
                                        </template>
                                    </UModal>
                                </template>
                            </div>
                        </template>
                        <template #bottom>
                            <div class="mt-1 flex flex-col gap-1.5 absolute bottom-0 w-full">
                                <UModal scrollable :fullscreen="isMobile ? true : false"
                                    :title="page.ecologyintro?.title ?? ''"
                                    :description="page.ecologyintro?.description ?? ''" :ui="{
                                        header: 'shrink-0',
                                    }" class="h-full">

                                    <UButton icon="i-heroicons-book-open" color="neutral" variant="ghost"
                                        label="Fakta i korthet" class="sm:w-full ring-muted/50" />
                                    <template #body>
                                        <EcologyIntro :section="page.ecologyintro" />
                                    </template>
                                </UModal>
                                <UModal :fullscreen="isMobile ? true : false" :title="page.underlag"
                                    :description="page.underlagdescription" :ui="{
                                        header: 'shrink-0',
                                    }">

                                    <UButton icon="i-heroicons-document-magnifying-glass" color="neutral"
                                        variant="ghost" :label="page.underlag" class="sm:w-full ring-muted/50" />
                                    <template #body>
                                        <UnderlagContent :underlag="page.underlag" :underlagbild="page.underlagbild"
                                            :sections="page.underlagSections" />
                                    </template>
                                </UModal>
                            </div>
                        </template>

                    </UPageAside>
                </template>
                <div
                    class=" border-b border-muted/50 px-3 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30">
                    <div class="flex gap-3">
                        <UButton color="neutral" variant="ghost" icon="i-f7-sidebar-left" class="ring-muted"
                            @click="immersiveAsideOpen = !immersiveAsideOpen" />

                    </div>


                    <div class="flex flex-wrap gap-2 items-center">
                        <UTabs v-model="immersiveTab" :items="immersiveTabItems" size="sm" placeholder="Välj"
                            :clearable="false" class="w-full ring-muted " :ui="{
                                root: 'min-w-max flex-shrink-0',
                                list: 'flex-nowrap rounded-xl bg-muted/50 -mb-2 gap-2',
                                indicator: 'bg-white border border-muted/50 shadow ',
                                trigger: ' data-[state=active]:text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary '
                            }" />
                    </div>
                </div>

                <div class="" v-if="immersiveTab === 'timeline'">
                    <div class="relative w-full overflow-hidden shadow aspect-video bg-neutral-900"
                        :style="heroBackgroundStyle">
                        <Transition name="image-fade">
                            <div :key="heroImageKey" class="absolute inset-0">
                                <div
                                    class=" bg-neutral-950/80 p-1 py-2 rounded-sm flex flex-col items-center gap-2 text-xs text-neutral-500 absolute bottom-4 right-4 z-20">

                                    <UIcon name="i-mingcute-tree-fill" class="size-5 text-primary" />
                                    <USlider v-model="treeFade" :min="0" :max="1" :step="0.05" class="h-20 sm:h-32"
                                        color="primary" orientation="vertical" inverse size="xs" />
                                    <UPopover>
                                        <div class="flex flex-col cursor-help ">
                                            <UIcon name="i-fluent-shape-organic-16-filled" class="size-4 text-gray-300 z-20" />
                                            <UIcon name="i-fluent-shape-organic-16-filled"
                                                class="size-4 -mt-3 text-signal-400 z-10" />
                                            <UIcon name="i-fluent-shape-organic-16-filled"
                                                class="size-4 -mt-3 text-yellow-400" />
                                        </div>
                                        <template #content>
                                            <div class="flex flex-col gap-2 p-4">
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

                                <template v-if="compareModeEnabled && comparisonImages">
                                    <CustomImageComparisonSlider class="w-full h-full"
                                        :framework-label="comparisonLabels?.leftFramework"
                                        :time-label="comparisonLabels?.leftTime"
                                        :framework-label2="comparisonLabels?.rightFramework"
                                        :time-label2="comparisonLabels?.rightTime">
                                        <template #first>
                                            <div class="relative w-full h-full">
                                                <img :src="comparisonImages.leftHidden || comparisonImages.left"
                                                    class="w-full h-full object-cover absolute inset-0" loading="lazy" />
                                                <img :src="comparisonImages.left" class="w-full h-full object-cover relative"
                                                    loading="lazy" :style="{ opacity: treeFade }" />
                                            </div>
                                        </template>
                                        <template #second>
                                            <div class="relative w-full h-full">
                                                <img :src="comparisonImages.rightHidden || comparisonImages.right"
                                                    class="w-full h-full object-cover absolute inset-0" loading="lazy" />
                                                <img :src="comparisonImages.right"
                                                    class="w-full h-full object-cover relative transition-opacity duration-500"
                                                    loading="lazy" :style="{ opacity: treeFade }" />
                                            </div>
                                        </template>
                                    </CustomImageComparisonSlider>
                                </template>
                                <template v-else-if="currentTimelineItem">
                                    <img :src="currentTimelineItem.thumbHidden" :alt="`Foto ${currentTimelineItem.tid}`"
                                        class="w-full h-full object-cover absolute inset-0" />
                                    <img :src="currentTimelineItem.thumb" :alt="`Foto ${currentTimelineItem.tid}`"
                                        class="w-full h-full object-cover relative transition-opacity duration-500"
                                        :style="{ opacity: treeFade }" />
                                    <div class="absolute top-2 left-2 z-20 flex flex-col items-start gap-1 pointer-events-none">
                                        <UBadge v-if="!isMobile" size="md"
                                            class="backdrop-blur-xl bg-neutral-100/0 text-neutral-100 h-fit whitespace-nowrap mb-0.5">
                                            {{ selectedMethod.title || selectedMethod.id }}
                                        </UBadge>
                                        <UBadge size="md"
                                            class="backdrop-blur-xl bg-neutral-950/50 text-neutral-100 h-fit whitespace-nowrap">
                                            {{ formatTimelineCurrentLabel(timelineItems[activeTimelineIndex]?.tid) }}
                                        </UBadge>
                                    </div>
                                </template>
                                <ImagePlaceholder v-else />
                            </div>
                        </Transition>
                    </div>
                    <div
                        class=" border-b border-muted/50 px-3 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30">


                        <div class="flex flex-wrap gap-2 items-center">
                            <UPopover :close="false" :transition="true" :overlay="true"
                                :ui="{ content: 'max-w-xs sm:max-w-xs p-4 sm:p-6 pb-2' }"
                                title="Har skogen varit kalavverkad tidigare?"
                                description="Hur skogen har brukats tidigare påverkar vilka mykorrhizasvampar som finns. Valet återspeglas i tidslinjen och diagrammen.">
                                <UTooltip text="Skogens historik">
                                    <UButton color="neutral" variant="outline"
                                        :leading-icon="selectedStartskogOption?.icon"
                                        :label="selectedStartskogOption?.label || ''" class="ring-muted/50" />
                                </UTooltip>

                                <template #content>
                                    <h1 class="font-semibold mb-2">Har skogen varit kalavverkad
                                        tidigare?
                                    </h1>
                                    <p class="text-muted text-sm mb-4">Hur skogen har brukats
                                        tidigare
                                        påverkar
                                        vilka
                                        mykorrhizasvampar som finns. Valet återspeglas i tidslinjen
                                        och
                                        diagrammen.</p>
                                    <USelect :items="startskogTabs" v-model="selectedStartskogTab"
                                        :icon="selectedStartskogIcon"
                                        class="transition-all ring-muted/50 mb-2 sm:mb-0" />
                                    <p class="text-neutral-700 text-xs">

                                    </p>
                                    <!-- <div class="flex gap-2">
                                                <UButton color="neutral" variant="outline" class="ring-muted/50"
                                                    label="Fortsätt" @click="startskogModalOpen = false" />
                                            </div> -->
                                </template>
                            </UPopover>
                            <USeparator orientation="vertical" class="h-6" />
                            <UButton v-for="(item, index) in timelineItems" :key="`immersive-timeline-${index}`"
                                color="neutral" variant="outline"
                                :class="index === activeTimelineIndex ? 'border-neutral-900 bg-neutral-900 hover:bg-neutral-900 text-white opacity-100 ring-0 shadow' : 'border-transparent opacity-70 hover:opacity-100'"
                                class="ring-muted/50 flex-none whitespace-nowrap"
                                :label="formatTimelineButtonLabel(item.tid)" @click="selectTimelineSlide(index)" />
                        </div>
                        <UPopover :ui="{ content: 'p-0 w-80' }" :content="{
                            align: 'end',
                            side: 'bottom',
                            sideOffset: 8
                        }">
                            <UButton color="neutral" variant="outline" icon="iconamoon:compare-duotone"
                                :label="compareEnabled ? 'Jämför' : 'Jämför'" class="ring-muted" />
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

                                    <UTabs v-if="compareEnabled" v-model="compareMode" :items="compareOptions" size="sm"
                                        placeholder="Välj" :clearable="false" class="w-full ring-muted -mb-2 mt-2" :ui="{
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
                    </div>
                    <div class="grid grid-cols-2">

                        <div class="space-y-2 p-5">
                            <h3 class="text-xl font-semibold text-neutral-900">
                                {{ formatTimelineCurrentLabel(timelineItems[activeTimelineIndex]?.tid) }}
                            </h3>
                            <p class="text-md text-muted">
                                {{ timelineItems[activeTimelineIndex]?.skog }}
                            </p>
                            <p class="text-md">{{ timelineItems[activeTimelineIndex]?.svamp }}</p>
                        </div>
                        <ForestryChartMain :selectedChart="chartSelected" class="p-2"
                            @update:selectedChart="val => chartSelected = val"
                            :parentSelectedFrameworks="chartFrameworks" :currentStartskog="selectedStartskogTab"
                            :currentTimeValue="currentTimelineTime" preserveFrameworkOrder />
                    </div>

                </div>
                <div v-else-if="immersiveTab === 'about'" class="space-y-6">
                    <UPageHero :title="selectedMethod.title"
                        :ui="{ container: 'pt-7 pb-3 sm:py-5 md:pt-16 md:pb-10 lg:pt-16 lg:pb-10 flex flex-col justify-center', title: 'text-4xl sm:text-6xl', headline: 'flex justify-center items-center' }">
                        <!-- <template #headline>
                                <UBreadcrumb :items="breadcrumbLinks" separator-icon="i-heroicons-slash"
                                    class="lg:hidden" />
                            </template> -->
                        <img :src="methodImage(selectedMethod, 'detail')" :alt="`Bild för ${selectedMethod.title}`"
                            class="rounded-lg ring ring-muted/50 " />
                    </UPageHero>
                    <!-- <Transition name="fade" mode="out-in">
                            
                        </Transition> -->
                    <div class="w-full flex justify-center my-0 sm:my-6">
                        <div class="space-y-8 max-w-xl">
                            <section v-for="section in accordionItems" :key="`${section.value}-${selectedMethod.id}`"
                                class="space-y-3">
                                <h2 :class="[
                                    'font-semibold text-neutral-900',
                                    section.value === 'svamp'
                                        ? 'text-lg md:text-xl'
                                        : 'text-xl md:text-2xl'
                                ]">
                                    {{ section.label }}
                                </h2>
                                <div class="space-y-3 text-md md:text-lg text-neutral-800">
                                    <template v-for="(para, idx) in section.paragraphs">
                                        <div v-if="section.value === 'svamp'"
                                            class="flex items-center gap-2 text-md md:text-xl font-semibold text-neutral-900"
                                            v-show="idx === section.paragraphs.length - 2">
                                            <UIcon name="icon-park-solid:knife-fork" class="size-5 text-warning-500" />
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
                    <div class="grid grid-cols-2 gap-6 items-center py-10 max-w-4xl mx-auto">
                        <UPageCard v-if="methodNav.prev" color="neutral" variant="outline"
                            icon="i-heroicons-arrow-left-20-solid" :title="`${methodNav.prev.title}`"
                            class="ring-muted/50" @click="handleMethodNav(methodNav.prev.id)" :ui="{
                                leading: 'text-sm',
                                title: 'truncate whitespace-nowrap max-w-[14ch] sm:max-w-none'
                            }">
                            <template #leading class="text-muted">
                                <UIcon name="i-heroicons-chevron-left" class="mr-1" /> Föregående
                            </template>
                        </UPageCard>
                        <div v-else />
                        <UPageCard v-if="methodNav.next" color="neutral" variant="outline"
                            icon="i-heroicons-arrow-right-20-solid" :title="`${methodNav.next.title}`"
                            class="ring-muted/50 " @click="handleMethodNav(methodNav.next.id)" :ui="{
                                leading: 'w-full flex justify-end text-sm',
                                body: 'w-full flex justify-end',
                                title: 'truncate whitespace-nowrap max-w-[14ch] sm:max-w-none text-right'
                            }">
                            <template #leading class="text-muted">Nästa
                                <UIcon name="i-heroicons-chevron-right" class="ml-1" />
                            </template>
                        </UPageCard>
                    </div>
                </div>
            </UPage>
        </UContainer>
        <USlideover :modal="false" :dismissible="false" v-model:open="chartSlideoverOpen" side="right"
            :ui="{ body: 'p-2 lg:p-2' }">
            <template #title>Diagram</template>
            <template #body>
                <ForestryChartMain :selectedChart="chartSelected" @update:selectedChart="val => chartSelected = val"
                    :parentSelectedFrameworks="chartFrameworks" :currentStartskog="selectedStartskogTab"
                    :currentTimeValue="currentTimelineTime" preserveFrameworkOrder />
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
import { ref, computed, watch, watchEffect, onMounted, onBeforeUnmount, nextTick } from 'vue'
import type { TabsItem } from '@nuxt/ui'
import { useMediaQuery } from '@vueuse/core'
import { useOnboardingStore } from '~/stores/onboardingStore'
import { useOverlayRegistry } from '~/composables/useOverlayRegistry'
import { useAsyncData, useRoute, useRouter, navigateTo } from '#app'

definePageMeta({
    scrollToTop: false,
    pageTransition: false,
    key: 'skogsskotsel-method',
})

const treeFade = ref(0.8)
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
const showMobileStickySelect = ref(false)
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
    description: string
    descriptionsvamp: string
    type?: string
    icon?: string
}

const methods = computed<Method[]>(() => methodsData.value?.methods ?? [])
const frameworkOptions = computed(() =>
    methods.value.map((method, index) => ({
        label: method.title,
        value: index
    }))
)

const emptyMethod: Method = {
    id: '',
    title: '',
    image: '',
    shortdescription: '',
    description: '',
    descriptionsvamp: ''
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
const compareEnabled = computed({
    get: () => compareModeEnabled.value,
    set: (val: boolean) => {
        compareModeEnabled.value = val
        if (!val) compareMode.value = 'beforeAfter'
    }
})
const compareOptions = computed(() => compareModeItems)
const setCompareMode = (enabled: boolean) => {
    compareEnabled.value = enabled
}
const immersiveAsideOpen = ref(true)
const immersiveTabItems = [
    { label: 'Tidslinje', value: 'timeline' },
    { label: 'Om metoden', value: 'about' },
]
const immersiveTab = ref<'timeline' | 'about'>('timeline')
const immersivePageUi = computed(() => {
    if (immersiveAsideOpen.value) {
        return {
            root: ' lg:gap-0',
            center: ' border-x border-muted lg:col-span-8',
        }
    }
    return {
        root: 'lg:grid-cols-10 lg:gap-0',
        center: 'lg:col-span-10  border-x border-muted',
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
const chartFrameworks = computed(() => {
    if (compareModeEnabled.value && compareMode.value === 'methods' && compareMethodResolved.value) {
        return [selectedMethod.value.id, compareMethodResolved.value]
    }
    return [selectedMethod.value.id]
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

const selectedStartskogTab = ref(startskogTabs[onboardingStore.selectedStartskog ?? 0]?.value || startskogTabs[0].value)
const selectedStartskogIcon = computed(() =>
    startskogTabs.find(tab => tab.value === selectedStartskogTab.value)?.icon
)
const selectedStartskogOption = computed(() =>
    startskogTabs.find(tab => tab.value === selectedStartskogTab.value)
)

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
    { key: 'retention', icon: 'i-pepicons-pop-tree-circle' },
    { key: 'kanteffekt', icon: 'i-healthicons-square-medium-negative' },
    { key: 'rottacke', icon: 'i-game-icons-tree-roots' },
    { key: 'rottackeSkarmtrad', icon: 'i-game-icons-tree-roots' },
    { key: 'rottackeBladning', icon: 'i-game-icons-tree-roots' },
    { key: 'seedTree', icon: 'i-teenyicons-redwoodjs-outline' },
    { key: 'smaplantor', icon: 'i-pepicons-pop-seedling-circle' },
    { key: 'hogstubbar', icon: 'i-roentgen-wood' },
    { key: 'naturvardsarter', icon: 'i-material-symbols-award-star-outline' },
    { key: 'tradplantor', icon: 'i-hugeicons-plant-02' },
]

const markerCards = computed(() => {
    const currentMethod = selectedMethod.value.id
    const allowedByMethod: Record<string, string[] | 'all'> = {
        naturvardsarter: 'all',
        retention: ['trakthygge', 'luckhuggning', 'skärmträd', 'skarmtrad', 'blädning', 'bladning'],
        kanteffekt: ['trakthygge', 'luckhuggning', 'skärmträd', 'skarmtrad'],
        tradplantor: ['trakthygge'],
        smaplantor: ['trakthygge'],
        hogstubbar: ['trakthygge'],
        rottackeBladning: ['blädning', 'bladning'],
        rottackeSkarmtrad: ['skärmträd', 'skarmtrad'],
        seedTree: ['skärmträd', 'skarmtrad'],
    }

    return markerDefinitions
        .filter(def => {
            const allow = allowedByMethod[def.key] ?? []
            if (allow === 'all') return true
            return allow.includes(currentMethod)
        })
        .map(def => {
            const copy = overlayTextMap.value[def.key] ?? { title: def.key, description: '' }
            return {
                ...def,
                title: copy.title,
                description: copy.description,
                image: copy.image,
                images: copy.images,
                imageDescriptions: copy.imageDescriptions,
                doc: copy.doc,
            }
        })
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
        label: 'Introduktion',
        icon: 'i-hugeicons-tree-06',
        value: 'description',
        paragraphs: selectedMethod.value.descriptionParagraphs?.length
            ? selectedMethod.value.descriptionParagraphs
            : splitParagraphs(selectedMethod.value.description),
    },
    {
        label: 'Påverkan på mykorrhizasvampar',
        icon: 'i-hugeicons-mushroom',
        value: 'svamp',
        paragraphs: selectedMethod.value.descriptionsvampParagraphs?.length
            ? selectedMethod.value.descriptionsvampParagraphs
            : splitParagraphs(selectedMethod.value.descriptionsvamp),
    }
])

const frameworkIndexMap: Record<string, number> = {
    naturskydd: 0,
    trakthygge: 1,
    luckhuggning: 2,
    skarmtrad: 3,
    'skärmträd': 3,
    bladning: 4,
    'blädning': 4,
}

function normalizeFrameworkId(value: string) {
    return (value || '')
        .trim()
        .normalize('NFD')
        .replace(/\p{Diacritic}+/gu, '')
        .toLowerCase()
}

function openModelWithCurrentFramework() {
    const normalized = normalizeFrameworkId(selectedMethod.value.id)
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
</style>
