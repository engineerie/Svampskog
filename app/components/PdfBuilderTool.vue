<template>
  <div>
    <UButton color="neutral" variant="outline" size="lg" icon="i-heroicons-document-text" class="ring-muted/50"
      label="PDF-verktyg" @click="open = true" />

    <UModal v-model:open="open" title="PDF"
      :ui="{ content: 'max-w-4xl', header: 'sm:px-4', body: 'bg-muted  p-0 sm:p-0' }">
      <template #header>
        <div class="flex flex-nowrap items-end gap-2">
          <USelect v-model="localColumns" multiple :items="columnOptions" value-key="value" option-attribute="label"
            placeholder="Kolumner" class="w-42" :ui="{ content: 'min-w-fit' }" />

          <USelect v-model="localQuickFilters" multiple :items="quickFilterOptions" value-key="value"
            option-attribute="label" placeholder="Filter" class="w-42" :ui="{ content: 'min-w-fit' }" />

          <UInput v-model="localSearchTerm" size="md" icon="i-heroicons-magnifying-glass" placeholder="Sök"
            class="w-42" />

          <UButton color="neutral" variant="outline" icon="i-heroicons-arrow-path" :loading="isRefreshing"
            label="Uppdatera" @click="refreshPreview" />

          <UButton color="primary" variant="solid" icon="i-heroicons-arrow-down-tray" :loading="isExporting"
            label="Ladda ner" @click="exportPdf" />
        </div>
      </template>
      <template #body>
        <div class="flex h-[75vh] flex-col gap-3">


          <iframe v-if="previewPages.length" :srcdoc="previewDocumentHtml" title="PDF-förhandsvisning"
            class="h-full w-full " />

          <div v-else class="flex h-full items-center justify-center text-sm text-neutral-500">
            Ingen förhandsvisning ännu.
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useEnvParamsStore } from '~/stores/envParamsStore'
import { useTableStateStore } from '~/stores/tableStateStore'
import { hasEdnaDataset } from '~/utils/edna'

const props = withDefaults(defineProps<{
  searchTerm?: string
  quickFilters?: string[]
  currentTableId?: 'dna' | 'edible' | 'poison' | 'redlisted'
}>(), {
  searchTerm: '',
  quickFilters: () => [],
  currentTableId: 'dna'
})

type TableConfig = {
  id: 'dna' | 'edible' | 'poison' | 'redlisted'
  title: string
  dataTypeFolder: string
  dataType: string
  tableKey: string
  grupp: string
  mat: string
  obs: string
  filterEdible?: boolean
  filterPoison?: boolean
}

type PreviewColumn = {
  accessorKey: string
  header: string
}

type PreviewSection = {
  id: string
  title: string
  rows: Record<string, any>[]
  columns: PreviewColumn[]
}

type PreviewPageSection = {
  key: string
  id: string
  title: string
  rows: Record<string, any>[]
  columns: PreviewColumn[]
  continued: boolean
}

type PreviewPage = {
  index: number
  showHeader: boolean
  sections: PreviewPageSection[]
}

const TABLE_CONFIGS: TableConfig[] = [
  {
    id: 'dna',
    title: 'Enligt DNA',
    dataTypeFolder: 'edna',
    dataType: 'edna',
    tableKey: 'edna',
    grupp: 'Svamp-grupp-släkte',
    mat: 'matsvamp',
    obs: 'sample_plot_count'
  },
  {
    id: 'edible',
    title: 'Matsvampar',
    dataTypeFolder: 'edible',
    dataType: 'edibledata',
    tableKey: 'edna-edible',
    grupp: 'Svamp-grupp',
    mat: 'Nyasvamp-boken',
    obs: 'Rank matsvamp',
    filterEdible: true
  },
  {
    id: 'poison',
    title: 'Giftsvampar',
    dataTypeFolder: 'edible',
    dataType: 'edibledata',
    tableKey: 'edna-poison',
    grupp: 'Svamp-grupp',
    mat: 'Nyasvamp-boken',
    obs: 'Rank giftsvamp',
    filterPoison: true
  },
  {
    id: 'redlisted',
    title: 'Naturvårdsarter',
    dataTypeFolder: 'redlisted',
    dataType: 'redlisted',
    tableKey: 'edna-redlisted',
    grupp: 'Svamp-grupp',
    mat: 'Nyasvamp-boken',
    obs: 'RankRed'
  }
]

const COLUMN_CATALOG = [
  { key: 'image', label: 'Bild' },
  { key: 'commonName', label: 'Svenskt namn' },
  { key: 'scientificName', label: 'Vetenskapligt namn' },
  { key: 'group', label: 'Svampgrupp' },
  { key: 'probability', label: 'Sannolikhet/Förekomst' },
  { key: 'status', label: 'Status' },
  { key: 'indicator', label: 'Signalart' },
  { key: 'mark', label: 'Mark' },
  { key: 'matsvamp', label: 'Matsvamp' },
  { key: 'giftsvamp', label: 'Giftsvamp' }
]

const quickFilterOptions = [
  { label: 'Matsvampar', value: 'matsvamp' },
  { label: 'Giftsvampar', value: 'giftsvamp' },
  { label: 'Naturvårdssvampar', value: 'naturvard' },
  { label: 'Övrigt', value: 'group:ovrigt' },
  { label: 'Hattsvamp', value: 'group:hattsvamp' },
  { label: 'Kantarell', value: 'group:kantarell' },
  { label: 'Sopp', value: 'group:sopp' },
  { label: 'Taggsvamp', value: 'group:taggsvamp' },
  { label: 'Fingersvamp', value: 'group:fingersvamp' },
  { label: 'Skinnsvamp', value: 'group:skinnsvamp' },
  { label: 'Skålsvamp', value: 'group:skalsvamp' },
  { label: 'Tryffel', value: 'group:tryffel' }
]

const groupedQuickFilterChoices = [
  { value: 'group:ovrigt', groups: ['Övrigt'] },
  { value: 'group:hattsvamp', groups: ['Hattsvamp'] },
  { value: 'group:kantarell', groups: ['Kantarell'] },
  { value: 'group:sopp', groups: ['Sopp'] },
  { value: 'group:taggsvamp', groups: ['Taggsvamp'] },
  { value: 'group:fingersvamp', groups: ['Fingersvamp'] },
  { value: 'group:skinnsvamp', groups: ['Skinnsvamp'] },
  { value: 'group:skalsvamp', groups: ['Skålsvamp'] },
  { value: 'group:tryffel', groups: ['Tryffel'] }
]

const naturvardsStatuses = ['VU', 'NT', 'EN', 'CR', 'DD', 'Signalart']

const open = ref(false)
const isRefreshing = ref(false)
const isExporting = ref(false)

const localQuickFilters = ref<string[]>([])
const localSearchTerm = ref('')
const localColumns = ref<string[]>([])

const previewPages = ref<PreviewPage[]>([])
const generatedAtLabel = ref('')

const envStore = useEnvParamsStore()
const tableStateStore = useTableStateStore()

const currentConfig = computed<TableConfig>(() =>
  TABLE_CONFIGS.find(config => config.id === props.currentTableId) || TABLE_CONFIGS[0]!
)

const environmentSummary = computed(() => ({
  geography: envStore.geographyLabel ?? envStore.geography ?? '-',
  forestType: envStore.forestTypeLabel ?? envStore.forestType ?? '-',
  standAge: envStore.standAgeLabel ?? envStore.standAge ?? '-',
  vegetationType: envStore.vegetationTypeLabel ?? envStore.vegetationType ?? '-'
}))

const defaultColumnSelection = (config: TableConfig) => {
  if (config.id === 'dna') return ['commonName', 'scientificName', 'group', 'probability']
  return ['commonName', 'scientificName', 'group', 'probability', 'status', 'indicator']
}

const columnOptions = computed(() => {
  const config = currentConfig.value
  return COLUMN_CATALOG
    .filter(col => !(config.id === 'dna' && (col.key === 'matsvamp' || col.key === 'giftsvamp')))
    .map(col => ({ label: col.label, value: col.key }))
})

const normalize = (value: unknown) => String(value ?? '').trim().toLowerCase()
const normalizeGroup = (value: unknown) => String(value ?? '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/\p{Diacritic}+/gu, '')

const hasValueX = (value: unknown) => normalize(value) === 'x'

const buildQuickFilterState = (quickFilters: string[]) => {
  const selected = new Set(quickFilters)
  return {
    selectedFilter: [
      ...(selected.has('matsvamp') ? ['Matsvamp'] : []),
      ...(selected.has('giftsvamp') ? ['Giftsvamp'] : [])
    ],
    selectedStatus: selected.has('naturvard') ? naturvardsStatuses : [],
    selectedGrupp: groupedQuickFilterChoices
      .filter(choice => selected.has(choice.value))
      .flatMap(choice => choice.groups)
  }
}

const mergeUnique = (a: string[] = [], b: string[] = []) => Array.from(new Set([...(a || []), ...(b || [])]))

const compareValues = (left: unknown, right: unknown) => {
  if (left == null && right == null) return 0
  if (left == null) return 1
  if (right == null) return -1
  const leftNumber = Number(left)
  const rightNumber = Number(right)
  if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) return leftNumber - rightNumber
  return String(left).localeCompare(String(right), 'sv', { sensitivity: 'base', numeric: true })
}

const applyFilters = (rows: any[], config: TableConfig, state: any, searchTerm: string) => {
  const selectedFilter: string[] = Array.isArray(state?.selectedFilter) ? state.selectedFilter : []
  const selectedStatus: string[] = Array.isArray(state?.selectedStatus) ? state.selectedStatus : []
  const selectedGrupp: string[] = Array.isArray(state?.selectedGrupp) ? state.selectedGrupp : []
  const selectedMark: string[] = Array.isArray(state?.selectedMark) ? state.selectedMark : []
  const normalizedSearch = normalize(searchTerm)

  return rows.filter((row) => {
    if (normalizedSearch) {
      const searchable = `${row.Commonname ?? ''} ${row.Scientificname ?? ''}`.toLowerCase()
      if (!searchable.includes(normalizedSearch)) return false
    }
    if (config.filterEdible && !hasValueX(row[config.mat])) return false
    if (config.filterPoison && hasValueX(row[config.mat])) return false

    if (selectedFilter.length > 0) {
      const matches = selectedFilter.some((value: string) => {
        if (value === 'Matsvamp') return hasValueX(row[config.mat])
        if (value === 'Giftsvamp') return hasValueX(row.Giftsvamp)
        return normalize(row[config.mat]) === normalize(value)
      })
      if (!matches) return false
    }

    if (selectedStatus.length > 0) {
      const matchesStatus = selectedStatus.some((status: string) => {
        if (status === 'Signalart') return row.SIGNAL_art === 'S'
        if (status === 'Ej bedömd') return normalize(row.RL2020kat) === '' || normalize(row.RL2020kat) === '0' || normalize(row.RL2020kat) === 'ne'
        if (status === 'Ej tillämplig') return normalize(row.RL2020kat) === 'na'
        return String(row.RL2020kat ?? '') === status
      })
      if (!matchesStatus) return false
    }

    if (selectedGrupp.length > 0) {
      const groupValue = normalizeGroup(row[config.grupp])
      const selectedNormalized = selectedGrupp.map(normalizeGroup)
      if (!selectedNormalized.includes(groupValue)) return false
    }

    if (selectedMark.length > 0) {
      const matchesMark = selectedMark.some((mark: string) => {
        if (mark === 'KALKmark') return Boolean(row.KALKmark)
        if (mark === 'ANNANmark') return Boolean(row.ANNANmark)
        return false
      })
      if (!matchesMark) return false
    }
    return true
  })
}

const applySort = (rows: any[], config: TableConfig, sorting: Array<{ id: string, desc: boolean }>) => {
  const defaultSorting = config.obs.startsWith('Rank')
    ? [{ id: config.obs, desc: false }, { id: 'Commonname', desc: false }]
    : [{ id: config.obs, desc: true }]

  const effective = sorting?.length ? sorting : defaultSorting
  return [...rows].sort((left, right) => {
    for (const sortDef of effective) {
      const columnId = sortDef.id === '__OBS__' ? config.obs : sortDef.id
      const direction = sortDef.desc ? -1 : 1
      const result = compareValues(left?.[columnId], right?.[columnId])
      if (result !== 0) return result * direction
    }
    return 0
  })
}

const resolveColumnsFromCurrentLayout = (config: TableConfig, tableState: any) => {
  const visibility = (tableState?.columnVisibility && typeof tableState.columnVisibility === 'object')
    ? tableState.columnVisibility as Record<string, boolean>
    : {}

  const isVisible = (id: string) => visibility[id] !== false
  const result = defaultColumnSelection(config).filter((key) => {
    if (key === 'commonName') return isVisible('Commonname')
    if (key === 'scientificName') return isVisible('Scientificname')
    if (key === 'group') return isVisible(config.grupp)
    if (key === 'probability') return isVisible(config.obs)
    if (key === 'status') return isVisible('RL2020kat')
    if (key === 'indicator') return isVisible('SIGNAL_art')
    if (key === 'matsvamp') return isVisible(config.mat)
    if (key === 'giftsvamp') return isVisible('Giftsvamp')
    if (key === 'mark') return isVisible('KALKmark') || isVisible('ANNANmark')
    return true
  })

  const imageVisible = isVisible('images')
  const withImage = imageVisible ? ['image', ...result] : result
  const withoutImageByDefault = withImage.filter(column => column !== 'image')

  return withoutImageByDefault.length ? withoutImageByDefault : defaultColumnSelection(config)
}

const toPreviewCell = (row: any, config: TableConfig, key: string) => {
  if (key === 'image') {
    if (Array.isArray(row.images) && row.images.length) return row.images[0]
    return row.image || ''
  }
  if (key === 'commonName') return row.Commonname || ''
  if (key === 'scientificName') return row.Scientificname || ''
  if (key === 'group') return row[config.grupp] || ''
  if (key === 'probability') return row[config.obs] ?? ''
  if (key === 'status') return row.RL2020kat || ''
  if (key === 'indicator') return row.SIGNAL_art === 'S' ? 'Signalart' : ''
  if (key === 'matsvamp') return hasValueX(row[config.mat]) ? 'Ja' : ''
  if (key === 'giftsvamp') return hasValueX(row.Giftsvamp) ? 'Ja' : ''
  if (key === 'mark') return row.KALKmark ? 'Kalkmark' : (row.ANNANmark ? 'Annan mark' : '')
  return ''
}

const initializeControls = () => {
  const config = currentConfig.value
  const tableState = tableStateStore.getState(config.tableKey) || {}

  localSearchTerm.value = props.searchTerm || ''
  localQuickFilters.value = [...(props.quickFilters || [])]
  localColumns.value = resolveColumnsFromCurrentLayout(config, tableState)
}

const buildCurrentSection = async (): Promise<PreviewSection> => {
  const config = currentConfig.value
  const params = [envStore.geography, envStore.forestType, envStore.standAge, envStore.vegetationType]
  if (params.some(param => !param)) {
    return { id: config.id, title: config.title, rows: [], columns: [] }
  }
  if (config.id === 'dna' && !hasEdnaDataset(envStore.geography, envStore.forestType, envStore.standAge, envStore.vegetationType)) {
    return { id: config.id, title: config.title, rows: [], columns: [] }
  }

  const filename = `${config.dataType}-${envStore.geography}-${envStore.forestType}-${envStore.standAge}-${envStore.vegetationType}.json`
  const response = await fetch(`/${config.dataTypeFolder}/${filename}`)
  if (!response.ok) return { id: config.id, title: config.title, rows: [], columns: [] }

  const sourceRows = await response.json()
  const tableState = tableStateStore.getState(config.tableKey) || {}

  const quickState = buildQuickFilterState(localQuickFilters.value)
  const effectiveState = {
    ...tableState,
    selectedFilter: mergeUnique(tableState.selectedFilter, quickState.selectedFilter),
    selectedStatus: mergeUnique(tableState.selectedStatus, quickState.selectedStatus),
    selectedGrupp: mergeUnique(tableState.selectedGrupp, quickState.selectedGrupp),
    sorting: tableState.sorting
  }

  const filtered = applyFilters(sourceRows, config, effectiveState, localSearchTerm.value)
  const sorted = applySort(filtered, config, Array.isArray(effectiveState.sorting) ? effectiveState.sorting : [])

  const selectedColumns = localColumns.value.length ? localColumns.value : resolveColumnsFromCurrentLayout(config, tableState)

  const rows = sorted.map((row: any) =>
    selectedColumns.reduce((acc: Record<string, any>, key: string) => {
      acc[key] = toPreviewCell(row, config, key)
      return acc
    }, {})
  )

  const columns: PreviewColumn[] = selectedColumns.map((key: string) => ({
    accessorKey: key,
    header: COLUMN_CATALOG.find(c => c.key === key)?.label || key
  }))

  return { id: config.id, title: config.title, rows, columns }
}

const FIRST_PAGE_ROW_BUDGET = 34
const OTHER_PAGE_ROW_BUDGET = 40
const SECTION_OVERHEAD = 2

const createPage = (index: number, showHeader: boolean): PreviewPage => ({
  index,
  showHeader,
  sections: []
})

const paginateSections = (sections: PreviewSection[]) => {
  const pages: PreviewPage[] = [createPage(1, true)]
  let currentPage = pages[0]!
  let remainingCapacity = FIRST_PAGE_ROW_BUDGET

  const newPage = () => {
    const page = createPage(pages.length + 1, false)
    pages.push(page)
    currentPage = page
    remainingCapacity = OTHER_PAGE_ROW_BUDGET
  }

  sections.forEach((section) => {
    if (!section.columns.length) return

    let cursor = 0
    while (cursor < section.rows.length || (section.rows.length === 0 && cursor === 0)) {
      if (remainingCapacity <= SECTION_OVERHEAD) newPage()

      const remainingRows = section.rows.length - cursor
      const availableRows = Math.max(0, remainingCapacity - SECTION_OVERHEAD)
      const chunkSize = section.rows.length === 0
        ? 0
        : Math.max(1, Math.min(remainingRows, availableRows || 1))

      const chunkRows = chunkSize > 0 ? section.rows.slice(cursor, cursor + chunkSize) : []

      currentPage.sections.push({
        key: `${section.id}-${cursor}-${currentPage.index}`,
        id: section.id,
        title: section.title,
        rows: chunkRows,
        columns: section.columns,
        continued: cursor > 0
      })

      remainingCapacity -= SECTION_OVERHEAD + chunkRows.length
      cursor += chunkRows.length

      if (section.rows.length === 0) break
      if (cursor < section.rows.length) newPage()
    }
  })

  if (!pages[0]?.sections.length) {
    pages[0]!.sections.push({
      key: 'empty-state',
      id: 'empty',
      title: 'Inget innehåll',
      rows: [],
      columns: [],
      continued: false
    })
  }

  previewPages.value = pages
}

const refreshPreview = async () => {
  isRefreshing.value = true
  try {
    const section = await buildCurrentSection()
    paginateSections([section])
    generatedAtLabel.value = new Intl.DateTimeFormat('sv-SE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date())
  } finally {
    isRefreshing.value = false
  }
}

const escapeHtml = (value: unknown) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll('\'', '&#39;')

const renderSectionTableHtml = (section: PreviewPageSection) => {
  if (!section.columns.length) {
    return '<p class="empty">Inga rader.</p>'
  }

  const head = section.columns
    .map(column => `<th>${escapeHtml(column.header)}</th>`)
    .join('')

  const body = section.rows.length
    ? section.rows.map((row) => {
      const cells = section.columns.map((column) => {
        if (column.accessorKey === 'image') {
          const src = String(row.image || '')
          if (!src) return '<td></td>'
          return `<td><img src="${escapeHtml(src)}" alt="Artbild" class="thumb"></td>`
        }
        return `<td>${escapeHtml(row[column.accessorKey] ?? '')}</td>`
      }).join('')
      return `<tr>${cells}</tr>`
    }).join('')
    : `<tr><td colspan="${section.columns.length}">Inga rader.</td></tr>`

  return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`
}

const renderPrintHtml = () => {
  const pagesHtml = previewPages.value.map((page) => {
    const headerHtml = page.showHeader
      ? `
        <div class="header">
          <h1>${escapeHtml(currentConfig.value.title)}</h1>
          <p>${escapeHtml(environmentSummary.value.geography)} · ${escapeHtml(environmentSummary.value.forestType)} · ${escapeHtml(environmentSummary.value.standAge)} · ${escapeHtml(environmentSummary.value.vegetationType)}</p>
          <p>Skapad: ${escapeHtml(generatedAtLabel.value)}</p>
        </div>
      `
      : ''

    const sectionsHtml = page.sections.map(section => `
      <section>
        <div class="section-head">
          <h2>${escapeHtml(section.title)}${section.continued ? ' (forts.)' : ''}</h2>
          <p>${section.rows.length} rader</p>
        </div>
        ${renderSectionTableHtml(section)}
      </section>
    `).join('')

    return `
      <article class="page">
        ${headerHtml}
        ${sectionsHtml}
        <p class="page-number">Sida ${page.index} av ${previewPages.value.length}</p>
      </article>
    `
  }).join('')

  return `
    <!doctype html>
    <html lang="sv">
      <head>
        <meta charset="utf-8">
        <title>Artrapport</title>
        <style>
          @page { size: A4; margin: 0; }
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f9f6f3;
            color: #b1835e;
            padding: 16px;
          }
          .preview-root {
            display: flex;
            flex-direction: column;
            gap: 16px;
            width: fit-content;
            margin: 0 auto;
          }
          .page {
            width: 210mm;
            min-height: 297mm;
            margin: 0;
            padding: 12mm;
            box-sizing: border-box;
            background: #fff;
            position: relative;
            box-shadow: 0 2px 10px rgba(31, 24, 20, 0.08);
          }
          .header { border-bottom: 1px solid #d1bba0; padding-bottom: 6mm; margin-bottom: 5mm; }
          .header h1 { margin: 0 0 2mm 0; font-size: 20px; }
          .header h1, .section-head h2 { color: #5a3f34; }
          .header p { margin: 0; color: #b1835e; font-size: 12px; }
          section { margin-bottom: 5mm; break-inside: avoid; }
          .section-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2mm; }
          .section-head h2 { margin: 0; font-size: 15px; }
          .section-head p { margin: 0; font-size: 11px; color: #b1835e; }
          table { width: 100%; border-collapse: collapse; table-layout: fixed; }
          th, td {
            padding: 2mm;
            font-size: 11px;
            text-align: left;
            vertical-align: top;
            word-break: break-word;
          }
          th {
            background: transparent;
            font-weight: 600;
            color: #5a3f34;
            border-bottom: 1px solid #d1bba0;
          }
          td {
            color: #b1835e;
            border-bottom: 1px solid #d1bba0;
          }
          .thumb { width: 18mm; height: 12mm; object-fit: cover; border-radius: 2mm; }
          .page-number { position: absolute; right: 12mm; bottom: 8mm; margin: 0; font-size: 10px; color: #b1835e; }
          @media print {
            body { background: #fff; padding: 0; }
            .preview-root { gap: 0; margin: 0; }
            .page { margin: 0; page-break-after: always; box-shadow: none; }
            .page:last-child { page-break-after: auto; }
          }
        </style>
      </head>
      <body><div class="preview-root">${pagesHtml}</div></body>
    </html>
  `
}

const previewDocumentHtml = computed(() => renderPrintHtml())

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

const exportPdf = async () => {
  if (!import.meta.client) return

  isExporting.value = true
  try {
    if (!previewPages.value.length) {
      await refreshPreview()
    }

    const response = await fetch('/api/pdf-builder-download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        html: renderPrintHtml(),
        filename: `artrapport-${new Date().toISOString().slice(0, 10)}`
      })
    })

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || 'PDF download failed')
    }

    const pdfBlob = await response.blob()
    downloadBlob(pdfBlob, `artrapport-${new Date().toISOString().slice(0, 10)}.pdf`)
  } catch (error) {
    console.error('Failed to generate PDF from PdfBuilderTool', error)
    window.alert('Kunde inte ladda ner PDF just nu. Försök igen.')
  } finally {
    isExporting.value = false
  }
}

watch(open, (isOpen) => {
  if (!isOpen) return
  initializeControls()
  refreshPreview()
})

watch(() => props.currentTableId, () => {
  if (!open.value) return
  initializeControls()
  refreshPreview()
})
</script>
