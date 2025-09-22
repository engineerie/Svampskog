<template>
    <UPage class="flex-1">
        <UContainer class="py-10 space-y-8">
            <!-- <header class="space-y-2">
                <h1 class="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">Miljööversikt</h1>
                <p class="text-neutral-600 dark:text-neutral-400 max-w-2xl">
                    Utforska vilka kombinationer av geografi, skogstyp, ålder och fältskikt som har artdata.
                </p>
            </header> -->

            <div v-if="activeFilterBadges.length" class="flex justify-end">
                <div class="flex flex-wrap gap-2 -mb-4">
                    <UBadge v-for="badge in activeFilterBadges" :key="badge.id" :variant="badge.variant ?? 'soft'"
                        :color="badge.color ?? undefined"
                        :class="['cursor-pointer font-medium', badge.class].filter(Boolean).join(' ')"
                        trailing-icon="i-heroicons-x-mark" @click="badge.onClear()">
                        {{ badge.label }}
                    </UBadge>
                </div>
            </div>

            <UAlert v-if="fetchError" color="error" variant="solid" title="Kunde inte ladda miljödata"
                :description="fetchError" />

            <div v-else>
                <div v-if="isLoading" class="space-y-3">
                    <USkeleton class="h-12 w-full" />
                    <USkeleton class="h-12 w-full" />
                    <USkeleton class="h-12 w-full" />
                </div>

                <template v-else>
                    <div v-if="isMobile" class="flex gap-2 mb-3">
                        <UDropdownMenu :items="mobileSortItems" :content="{ align: 'start' }">
                            <UButton label="Sortera" icon="i-lucide-arrow-up-down" color="neutral" variant="soft"
                                aria-label="Sortera" size="xl" />
                        </UDropdownMenu>
                        <UDropdownMenu :items="mobileFilterItems" :content="{ align: 'start' }">
                            <UButton label="Filtrera" icon="i-lucide-list-filter" color="neutral" variant="soft"
                                aria-label="Filter" size="xl" />
                        </UDropdownMenu>
                    </div>

                    <UTable ref="table" v-model:sorting="sorting" v-model:column-visibility="columnVisibility"
                        v-model:row-selection="rowSelection" :data="tableData" :columns="columns" :ui="tableUi"
                        :loading="isLoading"
                        class="rounded-lg border border-neutral-200 dark:border-neutral-800 border-none -mx-4"
                        @select="handleSelect" />
                </template>

                <p v-if="status === 'success' && !tableData.length" class="text-neutral-500 dark:text-neutral-400">
                    Inga miljöer hittades.
                </p>
            </div>
        </UContainer>
    </UPage>
</template>

<script setup lang="ts">
import { computed, h, reactive, ref, resolveComponent, watch, useTemplateRef } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'
import { useEnvParamsStore } from '~/stores/envParamsStore'

const router = useRouter()
const route = useRoute()
const envStore = useEnvParamsStore()

const textColumnIds = ['geographyLabel', 'forestTypeLabel', 'standAgeLabel', 'vegetationTypeLabel'] as const
const numericColumnIds = ['edibleCount', 'poisonousCount', 'redlistedCount', 'ednaCount', 'sampleEnvCount'] as const

type TextColumnKey = typeof textColumnIds[number]
type NumericColumnKey = typeof numericColumnIds[number]
type NumericFilterMode = 'all' | 'gt0' | 'zero'

const textColumnLabels: Record<TextColumnKey, string> = {
    geographyLabel: 'Geografi',
    forestTypeLabel: 'Skogstyp',
    standAgeLabel: 'Skogsålder',
    vegetationTypeLabel: 'Fältskikt',
}

const numericColumnLabels: Record<NumericColumnKey, string> = {
    edibleCount: 'Matsvamp',
    poisonousCount: 'Giftsvamp',
    redlistedCount: 'Naturvårdsart',
    ednaCount: 'DNA-art',
    sampleEnvCount: 'Miljöer (DNA)',
}

const numericBadgeColors: Record<NumericColumnKey, string> = {
    edibleCount: 'warning',
    poisonousCount: 'poison',
    redlistedCount: 'signal',
    ednaCount: 'secondary',
    sampleEnvCount: 'success',
}

const numericIcons: Record<NumericColumnKey, string> = {
    edibleCount: 'icon-park-solid:knife-fork',
    poisonousCount: 'i-hugeicons-danger',
    redlistedCount: 'i-material-symbols-award-star-outline',
    ednaCount: 'solar:dna-linear',
    sampleEnvCount: 'i-hugeicons-tree-06',
}

const { data, pending, error, status } = await useFetch('/environmentSummary.json', {
    default: () => [],
    server: false,
})

const tableData = computed(() => data.value ?? [])
const isLoading = computed(() => pending.value || status.value === 'idle')
const fetchError = computed(() => error.value ? error.value.message || 'Okänt fel' : '')

const NuxtImg = resolveComponent('NuxtImg')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UProgress = resolveComponent('UProgress')
const Icon = resolveComponent('Icon')
const UCheckbox = resolveComponent('UCheckbox')
const numberFormatter = new Intl.NumberFormat('sv-SE')

const table = useTemplateRef('table')
const sorting = ref([{ id: 'ednaCount', desc: true }])
const columnVisibility = ref<Record<string, boolean>>({})
const isMobile = useMediaQuery('(max-width: 767px)')
const rowSelection = ref<Record<string, boolean>>({})

const textFilterState = reactive<Record<TextColumnKey, string[]>>(
    Object.fromEntries(textColumnIds.map((key) => [key, []])) as Record<TextColumnKey, string[]>
)

const numericFilterState = reactive<Record<NumericColumnKey, NumericFilterMode>>(
    Object.fromEntries(numericColumnIds.map((key) => [key, 'all'])) as Record<NumericColumnKey, NumericFilterMode>
)

const numericDisplayState = reactive<Record<NumericColumnKey, 'badge' | 'progress'>>(
    Object.fromEntries(numericColumnIds.map((key) => [key, 'badge'])) as Record<NumericColumnKey, 'badge' | 'progress'>
)

const numericMaxValues = computed<Record<NumericColumnKey, number>>(() => {
    const base = Object.fromEntries(
        numericColumnIds.map((key) => [key, 0])
    ) as Record<NumericColumnKey, number>

    for (const row of tableData.value) {
        for (const key of numericColumnIds) {
            const raw = Number(row?.[key] ?? 0)
            if (Number.isFinite(raw) && raw > base[key]) {
                base[key] = raw
            }
        }
    }

    return base
})

const environmentTextKeys: TextColumnKey[] = ['geographyLabel', 'forestTypeLabel', 'standAgeLabel', 'vegetationTypeLabel']

const selectedEnvKey = computed(() => {
    const { geography, forestType, standAge, vegetationType } = envStore
    if (!geography || !forestType || !standAge || !vegetationType) return ''
    return `${geography}-${forestType}-${standAge}-${vegetationType}`
})

const rowIdByKey = computed<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    tableData.value.forEach((row, index) => {
        if (row.key != null) {
            map[row.key] = String(index)
        }
    })
    return map
})

const keyByRowId = computed<Record<string, any>>(() => {
    const map: Record<string, any> = {}
    tableData.value.forEach((row, index) => {
        map[String(index)] = row
    })
    return map
})

const uniqueTextOptions = computed<Record<TextColumnKey, string[]>>(() => {
    const accum = Object.fromEntries(
        textColumnIds.map((key) => [key, new Set<string>()])
    ) as Record<TextColumnKey, Set<string>>

    for (const row of tableData.value) {
        for (const key of textColumnIds) {
            const value = row?.[key]
            if (typeof value === 'string' && value.trim().length > 0) {
                accum[key].add(value)
            }
        }
    }

    return Object.fromEntries(
        textColumnIds.map((key) => [
            key,
            Array.from(accum[key]).sort((a, b) => a.localeCompare(b, 'sv')),
        ])
    ) as Record<TextColumnKey, string[]>
})

watch(
    tableData,
    () => {
        const available = uniqueTextOptions.value
        for (const key of textColumnIds) {
            const validOptions = new Set(available[key] ?? [])
            const current = textFilterState[key] ?? []
            const filtered = current.filter((option) => validOptions.has(option))
            if (filtered.length !== current.length) {
                textFilterState[key] = filtered
                applyTextFilter(key, filtered)
            }
        }
    },
    { flush: 'post' }
)

let syncingFromStore = false
let syncingFromSelection = false

watch(
    [selectedEnvKey, tableData],
    () => {
        if (syncingFromSelection) return
        const key = selectedEnvKey.value
        syncingFromStore = true
        const selectionId = key ? rowIdByKey.value[key] : undefined
        rowSelection.value = selectionId ? { [selectionId]: true } : {}
        syncingFromStore = false
    },
    { immediate: true }
)

watch(
    rowSelection,
    (selection) => {
        if (syncingFromStore) return
        const selectionId = Object.keys(selection).find(k => selection[k])
        if (!selectionId) return
        const match = keyByRowId.value[selectionId]
        if (!match) return
        const key = match.key
        if (key === selectedEnvKey.value) return
        if (!match) return
        syncingFromSelection = true
        envStore.setParams({
            geography: match.geography ?? null,
            forestType: match.forestType ?? null,
            standAge: match.standAge ?? null,
            vegetationType: match.vegetationType ?? null,
        })
        syncingFromSelection = false
    },
    { deep: true }
)

function formatNumber(value: unknown) {
    const numeric = Number(value ?? 0)
    return Number.isFinite(numeric) ? numberFormatter.format(numeric) : '0'
}

function getSortIcon(column: any) {
    const state = column.getIsSorted?.()
    if (state === 'asc') return 'i-lucide-arrow-up-narrow-wide'
    if (state === 'desc') return 'i-lucide-arrow-down-wide-narrow'
    return 'i-lucide-arrow-up-down'
}

function sortColumn(column: any, desc: boolean) {
    column.clearSorting?.()
    column.toggleSorting?.(desc)
}

function setSortingColumn(columnId: string, desc: boolean) {
    sorting.value = [{ id: columnId, desc }]
}

function getTextBadgeProps(columnId: TextColumnKey, value: string | null | undefined) {
    return { color: 'neutral', variant: 'outline' as const }
}

function renderNumericValue(row: any, key: NumericColumnKey, icon?: string) {
    const displayMode = numericDisplayState[key]
    const rawValue = Number(row.getValue(key) ?? 0)
    const maxValue = Math.max(numericMaxValues.value[key] || 0, 1)

    const renderBadge = (color: string, label: string, trailingIcon?: string) =>
        h(
            UBadge,
            {
                variant: 'soft',
                color,
                class: 'font-medium',
                ...(trailingIcon ? { 'trailing-icon': trailingIcon } : {}),
            },
            () => h('span', { class: 'inline-flex items-center gap-1' }, [
                icon ? h(Icon, { name: icon, class: ' text-base leading-none' }) : null,
                label,
            ].filter(Boolean))
        )

    const renderProgress = (color: string, current: number, label: string, showWarning = false) =>
        h(
            'div',
            { class: 'flex items-center gap-2 min-w-[9rem]' },
            [
                icon
                    ? h(Icon, { name: icon, class: ' text-base leading-none' })
                    : null,
                h(UProgress, {
                    modelValue: Math.max(current, 0),
                    max: maxValue,
                    color,
                    class: 'w-24 flex-1',
                    'onUpdate:modelValue': () => { },
                }),
                h('span', { class: 'text-sm font-medium text-neutral-700 dark:text-neutral-200' }, label),
                showWarning
                    ? h(Icon, {
                        name: 'i-heroicons-exclamation-triangle',
                        class: 'text-warning-500 text-base leading-none',
                    })
                    : null,
            ].filter(Boolean)
        )

    if (key === 'sampleEnvCount') {
        const ednaTotal = Number(row.original?.ednaCount ?? 0)
        const value = Number(row.getValue('sampleEnvCount') ?? 0)

        if (ednaTotal <= 0 || !Number.isFinite(value) || value <= 0) {
            return displayMode === 'progress'
                ? renderProgress('neutral', 0, '–')
                : renderBadge('neutral', '–')
        }

        const color = value >= 10 ? 'success' : 'warning'
        const hasWarning = value < 10
        const label = formatNumber(value)

        return displayMode === 'progress'
            ? renderProgress(color, value, label, hasWarning)
            : renderBadge(color, label, hasWarning ? 'i-heroicons-exclamation-triangle' : undefined)
    }

    const color = numericBadgeColors[key] ?? 'neutral'
    const label = formatNumber(rawValue)

    return displayMode === 'progress'
        ? renderProgress(color, rawValue, label)
        : renderBadge(color, label)
}

function applyTextFilter(columnId: TextColumnKey, values: string[]) {
    const column = table.value?.tableApi?.getColumn(columnId)
    column?.setFilterValue(values.length ? values : undefined)
}

function updateTextFilter(columnId: TextColumnKey, option: string, checked: boolean) {
    const current = textFilterState[columnId] ?? []
    const hasValue = current.includes(option)
    let next = current

    if (checked && !hasValue) {
        next = [...current, option]
    } else if (!checked && hasValue) {
        next = current.filter((value) => value !== option)
    }

    if (next !== current) {
        textFilterState[columnId] = next
        applyTextFilter(columnId, next)
    }
}

function clearTextFilter(columnId: TextColumnKey) {
    if ((textFilterState[columnId] ?? []).length === 0) return
    textFilterState[columnId] = []
    applyTextFilter(columnId, [])
}

function removeTextFilterValue(columnId: TextColumnKey, value: string) {
    const current = textFilterState[columnId] ?? []
    if (!current.includes(value)) return
    const next = current.filter((entry) => entry !== value)
    textFilterState[columnId] = next
    applyTextFilter(columnId, next)
}

function applyNumericFilter(columnId: NumericColumnKey, mode: NumericFilterMode) {
    const column = table.value?.tableApi?.getColumn(columnId)
    column?.setFilterValue(mode === 'all' ? undefined : mode)
}

function setNumericFilter(columnId: NumericColumnKey, mode: NumericFilterMode) {
    if (numericFilterState[columnId] === mode) return
    numericFilterState[columnId] = mode
    applyNumericFilter(columnId, mode)
}

function clearNumericFilter(columnId: NumericColumnKey) {
    if (numericFilterState[columnId] === 'all') return
    numericFilterState[columnId] = 'all'
    applyNumericFilter(columnId, 'all')
}

watch(
    () => table.value?.tableApi,
    (api) => {
        if (!api) return
        for (const key of textColumnIds) {
            const values = textFilterState[key] ?? []
            if (values.length) {
                api.getColumn(key)?.setFilterValue(values)
            }
        }
        for (const key of numericColumnIds) {
            const mode = numericFilterState[key]
            if (mode !== 'all') {
                api.getColumn(key)?.setFilterValue(mode)
            }
        }
    },
    { immediate: true }
)

const selectColumn = {
    id: 'select',
    enableSorting: false,
    enableHiding: false,
    size: 48,
    cell: ({ row }: any) =>
        h(UCheckbox, {
            modelValue: row.getIsSelected(),
            'onUpdate:modelValue': (value: boolean | 'indeterminate') => {
                row.table?.toggleAllRowsSelected(false)
                row.toggleSelected(!!value)
                if (!value) {
                    rowSelection.value = {}
                }
            },
            'aria-label': 'Välj rad'
        })
}

const baseColumns = computed(() => {
    const defs: any[] = [selectColumn]

    for (const key of textColumnIds) {
        defs.push({
            accessorKey: key,
            header: ({ column }: any) => {
                const options = uniqueTextOptions.value[key] ?? []
                const selected = textFilterState[key] ?? []
                const items: any[] = [
                    {
                        label: 'A → Ö',
                        icon: 'i-lucide-arrow-up-narrow-wide',
                        onSelect: (event: Event) => {
                            event?.preventDefault()
                            sortColumn(column, false)
                        },
                    },
                    {
                        label: 'Ö → A',
                        icon: 'i-lucide-arrow-down-wide-narrow',
                        onSelect: (event: Event) => {
                            event?.preventDefault()
                            sortColumn(column, true)
                        },
                    },
                ]

                if (options.length) {
                    items.push({ type: 'separator' })
                    items.push({
                        label: 'Rensa filter',
                        icon: 'i-lucide-eraser',
                        disabled: selected.length === 0,
                        onSelect: (event: Event) => {
                            event?.preventDefault()
                            clearTextFilter(key)
                        },
                    })
                    items.push({ type: 'separator' })
                    for (const option of options) {
                        items.push({
                            label: option,
                            type: 'checkbox',
                            checked: selected.includes(option),
                            onUpdateChecked: (checked: boolean) => {
                                updateTextFilter(key, option, checked)
                            },
                            onSelect: (event: Event) => event?.preventDefault(),
                        })
                    }
                }

                return h(
                    UDropdownMenu,
                    {
                        items,
                        content: { align: 'start' },
                        ui: { content: 'w-64' },
                    },
                    {
                        default: () =>
                            h(UButton, {
                                label: textColumnLabels[key],
                                variant: 'ghost',
                                color: 'neutral',
                                icon: getSortIcon(column),
                                class: '-mx-1.5',
                            }),
                    }
                )
            },
            cell: ({ row }: any) => {
                const value = row.getValue(key)
                if (!value) {
                    return h(UBadge, { variant: 'soft', color: 'neutral', class: 'font-medium' }, () => '–')
                }
                const props = getTextBadgeProps(key, value)
                return h(
                    UBadge,
                    {
                        variant: props.variant ?? 'soft',
                        color: props.color ?? 'neutral',
                        class: 'font-medium',
                    },
                    () => value
                )
            },
            filterFn: (row: any, columnId: string, filterValue: string[]) => {
                if (!Array.isArray(filterValue) || filterValue.length === 0) return true
                const value = row.getValue(columnId)
                return filterValue.includes(value)
            },
        })
    }

    for (const key of numericColumnIds) {
        defs.push({
            accessorKey: key,
            header: ({ column }: any) => {
                const mode = numericFilterState[key]
                const items: any[] = [
                    {
                        label: 'Lägst → Högst',
                        icon: 'i-lucide-arrow-up-narrow-wide',
                        onSelect: (event: Event) => {
                            event?.preventDefault()
                            sortColumn(column, false)
                        },
                    },
                    {
                        label: 'Högst → Lägst',
                        icon: 'i-lucide-arrow-down-wide-narrow',
                        onSelect: (event: Event) => {
                            event?.preventDefault()
                            sortColumn(column, true)
                        },
                    },
                    { type: 'separator' },
                    {
                        label: 'Rensa filter',
                        icon: 'i-lucide-eraser',
                        disabled: mode === 'all',
                        onSelect: (event: Event) => {
                            event?.preventDefault()
                            setNumericFilter(key, 'all')
                        },
                    },
                    { type: 'separator' },
                    {
                        label: 'Visa > 0',
                        type: 'checkbox',
                        checked: mode === 'gt0',
                        onUpdateChecked: (checked: boolean) => {
                            setNumericFilter(key, checked ? 'gt0' : 'all')
                        },
                        onSelect: (event: Event) => event?.preventDefault(),
                    },
                    {
                        label: 'Visa endast 0',
                        type: 'checkbox',
                        checked: mode === 'zero',
                        onUpdateChecked: (checked: boolean) => {
                            setNumericFilter(key, checked ? 'zero' : 'all')
                        },
                        onSelect: (event: Event) => event?.preventDefault(),
                    },
                    { type: 'separator' },
                    {
                        label: 'Visa som märken',
                        type: 'checkbox',
                        checked: numericDisplayState[key] === 'badge',
                        onUpdateChecked: (checked: boolean) => {
                            if (checked) {
                                numericDisplayState[key] = 'badge'
                            } else if (numericDisplayState[key] !== 'progress') {
                                numericDisplayState[key] = 'progress'
                            }
                        },
                        onSelect: (event: Event) => event?.preventDefault(),
                    },
                    {
                        label: 'Visa som progress',
                        type: 'checkbox',
                        checked: numericDisplayState[key] === 'progress',
                        onUpdateChecked: (checked: boolean) => {
                            numericDisplayState[key] = checked ? 'progress' : 'badge'
                        },
                        onSelect: (event: Event) => event?.preventDefault(),
                    },
                ]

                return h(
                    UDropdownMenu,
                    {
                        items,
                        content: { align: 'start' },
                        ui: { content: 'w-64' },
                    },
                    {
                        default: () =>
                            h(UButton, {
                                label: numericColumnLabels[key],
                                variant: 'ghost',
                                color: 'neutral',
                                icon: getSortIcon(column),
                                class: '-mx-1.5',
                            }),
                    }
                )
            },
            cell: ({ row }: any) => renderNumericValue(row, key, numericIcons[key]),
            filterFn: (row: any, columnId: string, filterValue: NumericFilterMode) => {
                if (!filterValue || filterValue === 'all') return true
                const value = Number(row.getValue(columnId) ?? 0)
                if (filterValue === 'gt0') return value > 0
                if (filterValue === 'zero') return value === 0
                return true
            },
        })
    }

    return defs
})

const mobileSummaryColumn = computed(() => ({
    id: 'mobileSummary',
    header: 'Miljö',
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }: any) => {
        const isSelected = row.getIsSelected?.() ?? false
        const environmentBadges = environmentTextKeys.map((key) => {
            const value = row.original[key]
            const props = getTextBadgeProps(key, value)
            return h(UBadge, {
                variant: props.variant ?? 'outline',
                color: props.color ?? 'neutral',
                class: 'font-medium text-sm',
            }, () => value || '–')
        })

        const metricBadges = numericColumnIds.map((key) =>
            renderNumericValue(row, key, numericIcons[key])
        )

        return h('div', { class: 'space-y-3' }, [
            h('div', { class: 'flex items-center gap-2 overflow-x-auto flex-nowrap min-w-0' }, [
                h(UCheckbox, {
                    modelValue: isSelected,
                    'onUpdate:modelValue': (value: boolean | 'indeterminate') => {
                        row.table?.toggleAllRowsSelected(false)
                        row.toggleSelected(!!value)
                        if (!value) {
                            rowSelection.value = {}
                        }
                    },
                    'aria-label': 'Välj rad'
                }),
                ...environmentBadges,
            ]),
            h('div', { class: 'flex gap-2 overflow-x-auto flex-nowrap min-w-0 ' }, metricBadges),
        ])
    },
}))

const desktopColumns = computed(() => baseColumns.value)
const mobileColumns = computed(() => [mobileSummaryColumn.value, ...baseColumns.value])

const columns = computed(() => (isMobile.value ? mobileColumns.value : desktopColumns.value))

watch(
    [isMobile, baseColumns],
    () => {
        if (isMobile.value) {
            const visibility: Record<string, boolean> = { mobileSummary: true }
            for (const column of baseColumns.value) {
                const key = column.accessorKey ?? column.id
                if (key) {
                    visibility[key] = false
                }
            }
            columnVisibility.value = visibility
        } else {
            columnVisibility.value = {}
        }
    },
    { immediate: true }
)

const tableUi = computed(() => ({
    table: isMobile.value ? 'min-w-full table-fixed' : 'min-w-full',
    thead: isMobile.value
        ? 'hidden'
        : 'hidden md:table-header-group bg-neutral-50 dark:bg-neutral-800/40',
    tbody: isMobile.value
        ? 'divide-y divide-neutral-200 dark:divide-neutral-800'
        : 'divide-y divide-neutral-100 dark:divide-neutral-800',
    tr: isMobile.value ? 'align-top' : 'align-middle',
    td: `${isMobile.value ? 'px-4 py-4 overflow-hidden max-w-[calc(100vw-2rem)]' : 'px-4 py-4'} text-lg text-neutral-800 dark:text-neutral-100`,
}))

const mobileSortItems = computed(() => {
    const items: any[] = []

    for (const key of textColumnIds) {
        items.push({
            label: textColumnLabels[key],
            children: [
                {
                    label: 'A → Ö',
                    icon: 'i-lucide-arrow-up-narrow-wide',
                    onSelect: (event: Event) => {
                        event?.preventDefault()
                        setSortingColumn(key, false)
                    },
                },
                {
                    label: 'Ö → A',
                    icon: 'i-lucide-arrow-down-wide-narrow',
                    onSelect: (event: Event) => {
                        event?.preventDefault()
                        setSortingColumn(key, true)
                    },
                },
            ],
        })
    }

    for (const key of numericColumnIds) {
        items.push({
            label: numericColumnLabels[key],
            children: [
                {
                    label: 'Lägst → Högst',
                    icon: 'i-lucide-arrow-up-narrow-wide',
                    onSelect: (event: Event) => {
                        event?.preventDefault()
                        setSortingColumn(key, false)
                    },
                },
                {
                    label: 'Högst → Lägst',
                    icon: 'i-lucide-arrow-down-wide-narrow',
                    onSelect: (event: Event) => {
                        event?.preventDefault()
                        setSortingColumn(key, true)
                    },
                },
            ],
        })
    }

    return items
})

const mobileFilterItems = computed(() => {
    const items: any[] = []

    for (const key of textColumnIds) {
        const options = uniqueTextOptions.value[key] ?? []
        const selected = textFilterState[key] ?? []
        const children: any[] = []

        if (selected.length) {
            children.push({
                label: 'Rensa filter',
                icon: 'i-lucide-eraser',
                onSelect: (event: Event) => {
                    event?.preventDefault()
                    clearTextFilter(key)
                },
            })
            children.push({ type: 'separator' })
        }

        for (const option of options) {
            children.push({
                label: option,
                type: 'checkbox',
                checked: selected.includes(option),
                onUpdateChecked: (checked: boolean) => {
                    updateTextFilter(key, option, checked)
                },
                onSelect: (event: Event) => event?.preventDefault(),
            })
        }

        items.push({
            label: textColumnLabels[key],
            children,
        })
    }

    for (const key of numericColumnIds) {
        const mode = numericFilterState[key]
        items.push({
            label: numericColumnLabels[key],
            children: [
                {
                    label: 'Rensa filter',
                    icon: 'i-lucide-eraser',
                    disabled: mode === 'all',
                    onSelect: (event: Event) => {
                        event?.preventDefault()
                        clearNumericFilter(key)
                    },
                },
                { type: 'separator' },
                {
                    label: 'Visa > 0',
                    type: 'checkbox',
                    checked: mode === 'gt0',
                    onUpdateChecked: (checked: boolean) => {
                        setNumericFilter(key, checked ? 'gt0' : 'all')
                    },
                    onSelect: (event: Event) => event?.preventDefault(),
                },
                {
                    label: 'Visa endast 0',
                    type: 'checkbox',
                    checked: mode === 'zero',
                    onUpdateChecked: (checked: boolean) => {
                        setNumericFilter(key, checked ? 'zero' : 'all')
                    },
                    onSelect: (event: Event) => event?.preventDefault(),
                },
            ],
        })
    }

    return items
})

const activeFilterBadges = computed(() => {
    const badges: Array<{
        id: string
        label: string
        color?: string
        class?: string
        variant?: string
        onClear: () => void
    }> = []

    for (const key of textColumnIds) {
        const values = textFilterState[key] ?? []
        for (const value of values) {
            const props = getTextBadgeProps(key, value)
            badges.push({
                id: `${key}-${value}`,
                label: value,
                color: props.color,
                variant: props.variant,
                onClear: () => removeTextFilterValue(key, value),
            })
        }
    }

    for (const key of numericColumnIds) {
        const mode = numericFilterState[key]
        if (mode === 'all') continue

        const label = mode === 'gt0'
            ? `${numericColumnLabels[key]} > 0`
            : `${numericColumnLabels[key]} = 0`

        badges.push({
            id: `${key}-${mode}`,
            label,
            color: numericBadgeColors[key] ?? 'neutral',
            variant: 'soft',
            onClear: () => clearNumericFilter(key),
        })
    }

    return badges
})

function handleSelect(row: any) {
    if (!row || !row.original) return

    syncingFromSelection = true
    envStore.setParams({
        geography: row.original.geography ?? null,
        forestType: row.original.forestType ?? null,
        standAge: row.original.standAge ?? null,
        vegetationType: row.original.vegetationType ?? null,
    })
    syncingFromSelection = false

    const selectionId = String(row.id ?? '')
    syncingFromStore = true
    rowSelection.value = selectionId ? { [selectionId]: true } : {}
    syncingFromStore = false
}
</script>

<style scoped>
:deep(tbody tr) {
    cursor: pointer;
}
</style>
