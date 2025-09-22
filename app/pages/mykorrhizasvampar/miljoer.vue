<template>
    <UPage class="flex-1">
        <UContainer class="py-10 space-y-8">
            <header class="space-y-2">
                <h1 class="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">Miljööversikt</h1>
                <p class="text-neutral-600 dark:text-neutral-400 max-w-2xl">
                    Utforska vilka kombinationer av geografi, skogstyp, ålder och fältskikt som har artdata.
                    Tabellen visar antal matsvampar, giftsvampar, naturvårdsarter och DNA-detekterade arter per miljö.
                </p>
            </header>

            <UAlert v-if="fetchError" color="error" variant="solid" title="Kunde inte ladda miljödata"
                :description="fetchError" />

            <div v-else>
                <div v-if="isLoading" class="space-y-3">
                    <USkeleton class="h-12 w-full" />
                    <USkeleton class="h-12 w-full" />
                    <USkeleton class="h-12 w-full" />
                </div>

                <UTable v-else ref="table" v-model:sorting="sorting" :data="tableData" :columns="columns"
                    :loading="isLoading" class="rounded-lg border border-neutral-200 dark:border-neutral-800"
                    @select="handleSelect" />

                <p v-if="status === 'success' && !tableData.length" class="text-neutral-500 dark:text-neutral-400">
                    Inga miljöer hittades.
                </p>
            </div>
        </UContainer>
    </UPage>
</template>

<script setup lang="ts">
import { computed, h, reactive, ref, resolveComponent, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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
    edibleCount: 'Matsvampar',
    poisonousCount: 'Giftsvampar',
    redlistedCount: 'Naturvårdsarter',
    ednaCount: 'DNA-arter',
    sampleEnvCount: 'Miljöer (DNA)',
}

const numericBadgeColors: Record<NumericColumnKey, string> = {
    edibleCount: 'warning',
    poisonousCount: 'poison',
    redlistedCount: 'signal',
    ednaCount: 'secondary',
    sampleEnvCount: 'success',
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
const numberFormatter = new Intl.NumberFormat('sv-SE')

const table = useTemplateRef('table')
const sorting = ref([{ id: 'ednaCount', desc: true }])

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

function applyNumericFilter(columnId: NumericColumnKey, mode: NumericFilterMode) {
    const column = table.value?.tableApi?.getColumn(columnId)
    column?.setFilterValue(mode === 'all' ? undefined : mode)
}

function setNumericFilter(columnId: NumericColumnKey, mode: NumericFilterMode) {
    if (numericFilterState[columnId] === mode) return
    numericFilterState[columnId] = mode
    applyNumericFilter(columnId, mode)
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

const columns = computed(() => {
    const defs: any[] = [
        {
            accessorKey: 'imageUrl',
            header: 'Miljö',
            enableSorting: false,
            filterFn: undefined,
            cell: ({ row }: any) => {
                const src = row.getValue('imageUrl') as string
                const label = `${row.original.geographyLabel}, ${row.original.forestTypeLabel}`

                if (!src) {
                    return h(
                        'div',
                        { class: 'flex h-12 w-12 items-center justify-center rounded-md bg-neutral-100 text-xs text-neutral-500 dark:bg-neutral-800 dark:text-neutral-300' },
                        'Ingen bild'
                    )
                }

                return h(NuxtImg, {
                    src,
                    width: 96,
                    height: 96,
                    alt: `Miljöbild ${label}`,
                    class: 'h-12 w-12 rounded-md border border-neutral-200 object-cover dark:border-neutral-700',
                    format: 'webp',
                })
            },
        },
    ]

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
            cell: ({ row }: any) => row.getValue(key),
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
            cell: ({ row }: any) => {
                const displayMode = numericDisplayState[key]
                const value = Number(row.getValue(key) ?? 0)
                const maxValue = Math.max(numericMaxValues.value[key] || 0, 1)

                const renderBadge = (color: string, label: string, trailingIcon?: string) =>
                    h(
                        UBadge,
                        {
                            size: 'lg',
                            variant: 'subtle',
                            color,
                            class: 'font-semibold text-neutral-700',
                            ...(trailingIcon ? { 'trailing-icon': trailingIcon } : {}),
                        },
                        () => label
                    )

                const renderProgress = (color: string, current: number, label: string, showWarning = false) =>
                    h(
                        'div',
                        { class: 'flex items-center gap-2 w-40' },
                        [
                            h(UProgress, {
                                modelValue: Math.max(current, 0),
                                max: maxValue,
                                color,
                                class: 'w-28',
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
                    const sampleValue = Number(row.getValue('sampleEnvCount') ?? 0)

                    if (ednaTotal <= 0 || !Number.isFinite(sampleValue) || sampleValue <= 0) {
                        return displayMode === 'progress'
                            ? renderProgress('neutral', 0, '–')
                            : renderBadge('neutral', '–')
                    }

                    const color = sampleValue >= 10 ? 'success' : 'warning'
                    const hasWarning = sampleValue < 10

                    return displayMode === 'progress'
                        ? renderProgress(color, sampleValue, formatNumber(sampleValue), hasWarning)
                        : renderBadge(
                            color,
                            formatNumber(sampleValue),
                            hasWarning ? 'i-heroicons-exclamation-triangle' : undefined
                        )
                }

                const color = numericBadgeColors[key] ?? 'neutral'

                return displayMode === 'progress'
                    ? renderProgress(color, value, formatNumber(value))
                    : renderBadge(color, formatNumber(value))
            },
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

function handleSelect(row: any) {
    const target = row?.original?.href
    if (typeof target === 'string' && target.length) {
        router.push(target)
    }
}
</script>

<style scoped>
:deep(tbody tr) {
    cursor: pointer;
}
</style>
