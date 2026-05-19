<template>
  <div class="">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <!-- <div>
        <h2 class="text-lg font-semibold text-neutral-900">
          Taxonomisk översikt
        </h2>
        <p class="text-sm text-neutral-500">
          Klicka på en taxonomisk nod för att filtrera artlistan. Grafen visar bara taxonomin ner till släkte.
        </p>
      </div> -->
      <UContainer>
        <div class="flex items-center gap-2 text-sm text-neutral-500">
          <!-- <UBadge color="neutral" variant="subtle">
          {{ speciesCount }} arter
        </UBadge> -->
          <UButton icon="i-lucide-zoom-in" color="neutral" variant="outline" size="sm" aria-label="Zooma in"
            @click="zoomIn" />
          <UButton icon="i-lucide-zoom-out" color="neutral" variant="outline" size="sm" aria-label="Zooma ut"
            @click="zoomOut" />
          <UButton label="Återställ" color="neutral" variant="outline" size="sm" @click="clearSelection" />
        </div>
      </UContainer>
    </div>

    <!-- <div
      class="flex flex-col gap-2 border-b border-muted/50 px-5 py-3 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {{ selectionDescription }}
      </div>
      <div class="flex items-center gap-2">
        <UBadge color="neutral" variant="subtle">
          {{ visibleNodeCount }} noder
        </UBadge>
        <UBadge color="neutral" variant="subtle">
          {{ visibleLinkCount }} länkar
        </UBadge>
      </div>
    </div> -->

    <!-- <div v-if="(status === 'pending' || status === 'idle') && !rawGraphData.nodes.length" class="space-y-3 px-5 py-5">
      <USkeleton class="h-4 w-full rounded" />
      <USkeleton class="h-4 w-[92%] rounded" />
      <USkeleton class="h-[560px] w-full rounded-2xl" />
    </div> -->

    <UAlert v-if="error" color="error" variant="subtle" title="Kunde inte läsa in taxonomigrafen"
      description="Kontrollera att all-species.json finns och att graf-endpointen svarar." class="m-5" />

    <div v-else class="px-2 sm:px-3 ">
      <VisSingleContainer :data="visualGraphData" :height="graphHeight" class="rounded-xl">
        <VisGraph ref="graphRef" :layout-type="GraphLayoutType.Dagre" :dagre-layout-settings="dagreLayoutSettings"
          :layout-autofit="true" :disable-drag="true" :disable-brush="true" :zoom-scale-extent="[0.2, 1.8]"
          :fit-view-padding="100" :link-curvature="1" :node-size="getNodeSize" :node-fill="getNodeFill"
          :selected-node-id="selectedNodeId" :node-selection-highlight-mode="GraphNodeSelectionHighlightMode.None"
          :selected-node-ids="visualRefreshNodeIds" :node-stroke="getNodeStroke" :node-stroke-width="getNodeStrokeWidth"
          :node-disabled="isNodeDisabled" :node-label="getNodeLabel" :node-label-trim-length="22"
          :link-width="getLinkWidth" :link-stroke="getLinkStroke" :link-disabled="isLinkDisabled"
          :events="graphEvents" />
      </VisSingleContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { VisGraph, VisSingleContainer } from '@unovis/vue'
import { Graph, GraphLayoutType, GraphNodeSelectionHighlightMode } from '@unovis/ts'

type TaxonomyLevel = 'kingdom' | 'fylum' | 'klass' | 'ordning' | 'familj' | 'slakte'

type TaxonomyGraphNode = {
  id: string
  label: string
  level: TaxonomyLevel
  count: number
  searchMatchCount: number
  edibleCount: number
  poisonCount: number
  groupCounts: Record<string, number>
  statusCounts: Record<string, number>
  speciesIds: number[]
}

type TaxonomyGraphLink = {
  id: string
  source: string
  target: string
  baseId?: string
  variant?: string
}

type TaxonomyGraphSpecies = {
  id: number
  groupKey: string
  statusKeys: string[]
  isEdible: boolean
  isPoison: boolean
  fylum: string | null
  klass: string | null
  ordning: string | null
  familj: string | null
  slakte: string | null
}

type GraphResponse = {
  nodes: TaxonomyGraphNode[]
  links: TaxonomyGraphLink[]
  species: TaxonomyGraphSpecies[]
  totalSpeciesCount: number
}

type GraphFilterPayload = {
  level: 'fylum' | 'klass' | 'ordning' | 'familj' | 'slakte' | null
  value: string | null
}

const props = defineProps<{
  activeFilter?: GraphFilterPayload
  statusFilters?: string[]
  matsvampFilters?: string[]
  groupFilters?: string[]
  fylumFilters?: string[]
  klassFilters?: string[]
  ordningFilters?: string[]
  familjFilters?: string[]
  slakteFilters?: string[]
  searchTerm?: string
}>()

const emit = defineEmits<{
  filterChange: [payload: GraphFilterPayload]
}>()

const isMobile = useMediaQuery('(max-width: 767px)')
const graphHeight = computed(() => (isMobile.value ? 120 : 300))
const graphCssVars = {
  '--vis-graph-node-selection-color': '#0f172a',
  '--vis-graph-node-greyout-opacity': '0.28',
  '--vis-graph-node-greyout-color': '#d9dee7',
  '--vis-graph-link-greyout-opacity': '0.14'
}
const selectedNodeId = ref<string | undefined>(undefined)
const selectedNode = ref<TaxonomyGraphNode | null>(null)
const graphRef = ref<{
  component?: {
    zoomIn: () => void
    zoomOut: () => void
    fitView: (duration?: number) => void
  }
} | null>(null)

const dagreLayoutSettings = {
  rankdir: 'TB',
  ranksep: 90,
  nodesep: 16,
  edgesep: 10,
  marginx: 32,
  marginy: 24
}

const graphQuery = computed(() => ({
  maxVisibleLevel: 5,
  search: props.searchTerm?.trim() || undefined
}))

const { data, status, error } = useLazyFetch<GraphResponse>('/api/all-species-graph', {
  key: 'all-species-graph-filter',
  query: graphQuery,
  server: false,
  default: () => ({
    nodes: [],
    links: [],
    species: [],
    totalSpeciesCount: 0
  })
})

const rawGraphData = computed(() => ({
  nodes: data.value?.nodes || [],
  links: data.value?.links || [],
  species: data.value?.species || []
}))

const taxonomyColorScaleByPhylum: Record<string, Record<Exclude<TaxonomyLevel, 'kingdom'>, string>> = {
  Ascomycota: {
    fylum: '#0369a1',
    klass: '#0284c7',
    ordning: '#0ea5e9',
    familj: '#38bdf8',
    slakte: '#7dd3fc'
  },
  Basidiomycota: {
    fylum: '#b45309',
    klass: '#d97706',
    ordning: '#f59e0b',
    familj: '#fbbf24',
    slakte: '#fcd34d'
  },
  Glomeromycota: {
    fylum: '#7e22ce',
    klass: '#9333ea',
    ordning: '#a855f7',
    familj: '#c084fc',
    slakte: '#d8b4fe'
  }
}

const fallbackTaxonomyScale: Record<Exclude<TaxonomyLevel, 'kingdom'>, string> = {
  fylum: '#6b7280',
  klass: '#9ca3af',
  ordning: '#d1d5db',
  familj: '#e5e7eb',
  slakte: '#f3f4f6'
}

const graphStructure = computed(() => {
  const nodeById = new Map<string, TaxonomyGraphNode>()
  const childNodeIdsByParentId = new Map<string, string[]>()
  const linkIdsByParentId = new Map<string, string[]>()
  const parentNodeIdByChildId = new Map<string, string>()
  const parentLinkIdByChildId = new Map<string, string>()

  for (const node of rawGraphData.value.nodes) {
    nodeById.set(node.id, node)
  }

  for (const link of rawGraphData.value.links) {
    const parentId = String(link.source)
    const childId = String(link.target)
    const childIds = childNodeIdsByParentId.get(parentId) ?? []
    childIds.push(childId)
    childNodeIdsByParentId.set(parentId, childIds)

    const linkIds = linkIdsByParentId.get(parentId) ?? []
    linkIds.push(link.id)
    linkIdsByParentId.set(parentId, linkIds)

    parentNodeIdByChildId.set(childId, parentId)
    parentLinkIdByChildId.set(childId, link.id)
  }

  return {
    nodeById,
    childNodeIdsByParentId,
    linkIdsByParentId,
    parentNodeIdByChildId,
    parentLinkIdByChildId
  }
})

const nodePhylumLabelById = computed(() => {
  const map = new Map<string, string>()

  for (const node of rawGraphData.value.nodes) {
    if (node.level === 'kingdom') {
      continue
    }

    let currentNodeId: string | undefined = node.id

    while (currentNodeId) {
      const currentNode = graphStructure.value.nodeById.get(currentNodeId)
      if (!currentNode) {
        break
      }

      if (currentNode.level === 'fylum') {
        map.set(node.id, currentNode.label)
        break
      }

      currentNodeId = graphStructure.value.parentNodeIdByChildId.get(currentNodeId)
    }
  }

  return map
})

function mixHexColors(colorA: string, colorB: string, ratio: number) {
  const normalizedRatio = Math.min(1, Math.max(0, ratio))
  const hexA = colorA.replace('#', '')
  const hexB = colorB.replace('#', '')

  const channels = [0, 2, 4].map((start) => {
    const valueA = Number.parseInt(hexA.slice(start, start + 2), 16)
    const valueB = Number.parseInt(hexB.slice(start, start + 2), 16)
    const mixed = Math.round(valueA + (valueB - valueA) * normalizedRatio)
    return mixed.toString(16).padStart(2, '0')
  })

  return `#${channels.join('')}`
}

function normalizeGroupKey(value: string | null | undefined) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}+/gu, '')
}

const speciesCount = computed(() => data.value?.totalSpeciesCount || 0)
const visibleNodeCount = computed(() => rawGraphData.value.nodes.length)
const visibleLinkCount = computed(() => rawGraphData.value.links.length)
const isSearchFilterActive = computed(() => Boolean(props.searchTerm?.trim()))
const isMatsvampFilterActive = computed(() => props.matsvampFilters?.includes('Matsvamp') ?? false)
const isGiftsvampFilterActive = computed(() => props.matsvampFilters?.includes('Giftsvamp') ?? false)
const activeGroupFilterKeys = computed(() => (props.groupFilters || []).map(normalizeGroupKey).filter(Boolean))
const activeStatusFilterKeys = computed(() => (props.statusFilters || []).map(normalizeGroupKey).filter(Boolean))
const activeTaxonomyFilters = computed(() => ({
  fylum: props.fylumFilters || [],
  klass: props.klassFilters || [],
  ordning: props.ordningFilters || [],
  familj: props.familjFilters || [],
  slakte: props.slakteFilters || []
}))
const hasExactTableFilter = computed(() => (
  activeGroupFilterKeys.value.length > 0
  || activeStatusFilterKeys.value.length > 0
  || (props.matsvampFilters?.length || 0) > 0
  || activeTaxonomyFilters.value.fylum.length > 0
  || activeTaxonomyFilters.value.klass.length > 0
  || activeTaxonomyFilters.value.ordning.length > 0
  || activeTaxonomyFilters.value.familj.length > 0
  || activeTaxonomyFilters.value.slakte.length > 0
))
const groupFilterColorMap: Record<string, string> = {
  ovrigt: '#4b5563',
  hattsvamp: '#db2777',
  kantarell: '#d97706',
  sopp: '#059669',
  taggsvamp: '#0284c7',
  fingersvamp: '#7c3aed',
  skinnsvamp: '#c026d3',
  skinnsvampar: '#c026d3',
  skalsvamp: '#ea580c',
  tryffel: '#65a30d'
}
const statusFilterColorMap: Record<string, string> = {
  livskraftig: '#CDD400',
  kunskapsbrist: '#DDD',
  'ej bedomd': '#DDD',
  'ej tillamplig': '#9ca3af',
  'nara hotad': '#F9C6C7',
  sarbar: '#EF858F',
  'starkt hotad': '#EA516D',
  'akut hotad': '#E5014F',
  'nationellt utdod': '#490F2C',
  signalart: '#14b8a6'
}

function matchesAnyFilter(value: string | null | undefined, filters: string[]) {
  if (!filters.length) return true
  return filters.includes(String(value || ''))
}

function buildHighlightStateFromSpeciesIds(speciesIds: Set<number>) {
  const nodeIds = new Set<string>()
  const linkIds = new Set<string>()

  for (const node of rawGraphData.value.nodes) {
    if (node.speciesIds.some((id) => speciesIds.has(id))) {
      nodeIds.add(node.id)
    }
  }

  for (const link of rawGraphData.value.links) {
    const targetNode = graphStructure.value.nodeById.get(getLinkEndpointId(link.target as any))
    if (targetNode && targetNode.speciesIds.some((id) => speciesIds.has(id))) {
      linkIds.add(link.id)
    }
  }

  return {
    hasSelection: nodeIds.size > 0,
    nodeIds,
    linkIds
  }
}

const exactMatchedSpeciesIds = computed(() => {
  if (!hasExactTableFilter.value) {
    return null
  }

  const matchedIds = new Set<number>()

  for (const species of rawGraphData.value.species) {
    if (activeGroupFilterKeys.value.length && !activeGroupFilterKeys.value.includes(species.groupKey)) {
      continue
    }

    if (activeStatusFilterKeys.value.length && !species.statusKeys.some((key) => activeStatusFilterKeys.value.includes(key))) {
      continue
    }

    if ((props.matsvampFilters?.length || 0) > 0) {
      const matsvampMatches = isMatsvampFilterActive.value && species.isEdible
      const giftsvampMatches = isGiftsvampFilterActive.value && species.isPoison
      if (!matsvampMatches && !giftsvampMatches) {
        continue
      }
    }

    if (!matchesAnyFilter(species.fylum, activeTaxonomyFilters.value.fylum)) continue
    if (!matchesAnyFilter(species.klass, activeTaxonomyFilters.value.klass)) continue
    if (!matchesAnyFilter(species.ordning, activeTaxonomyFilters.value.ordning)) continue
    if (!matchesAnyFilter(species.familj, activeTaxonomyFilters.value.familj)) continue
    if (!matchesAnyFilter(species.slakte, activeTaxonomyFilters.value.slakte)) continue

    matchedIds.add(species.id)
  }

  return matchedIds
})

const exactFilterHighlightState = computed(() => {
  const speciesIds = exactMatchedSpeciesIds.value

  if (!speciesIds) {
    return {
      hasSelection: false,
      nodeIds: new Set<string>(),
      linkIds: new Set<string>()
    }
  }

  return buildHighlightStateFromSpeciesIds(speciesIds)
})
const taxonomyHighlightState = computed(() => {
  const nodeIds = new Set<string>()
  const linkIds = new Set<string>()

  if (!selectedNodeId.value) {
    return {
      hasSelection: false,
      nodeIds,
      linkIds
    }
  }

  const queue = [selectedNodeId.value]
  nodeIds.add(selectedNodeId.value)

  let currentNodeId: string | undefined = selectedNodeId.value
  while (currentNodeId) {
    const parentNodeId = graphStructure.value.parentNodeIdByChildId.get(currentNodeId)
    const parentLinkId = graphStructure.value.parentLinkIdByChildId.get(currentNodeId)

    if (!parentNodeId) {
      break
    }

    nodeIds.add(parentNodeId)
    if (parentLinkId) {
      linkIds.add(parentLinkId)
    }
    currentNodeId = parentNodeId
  }

  while (queue.length) {
    const nodeId = queue.pop()
    if (!nodeId) {
      continue
    }

    const childIds = graphStructure.value.childNodeIdsByParentId.get(nodeId) ?? []
    const childLinkIds = graphStructure.value.linkIdsByParentId.get(nodeId) ?? []

    for (const linkId of childLinkIds) {
      linkIds.add(linkId)
    }

    for (const childId of childIds) {
      if (!nodeIds.has(childId)) {
        nodeIds.add(childId)
        queue.push(childId)
      }
    }
  }

  return {
    hasSelection: true,
    nodeIds,
    linkIds
  }
})

const searchHighlightState = computed(() => {
  const nodeIds = new Set<string>(
    rawGraphData.value.nodes
      .filter((node) => node.searchMatchCount > 0)
      .map((node) => node.id)
  )

  const linkIds = new Set<string>(
    rawGraphData.value.links
      .filter((link) => nodeIds.has(String(link.source)) && nodeIds.has(String(link.target)))
      .map((link) => link.id)
  )

  return {
    hasSelection: nodeIds.size > 0,
    nodeIds,
    linkIds
  }
})

type OverlayLayer = { id: string; color: string; nodeIds: Set<string>; linkIds: Set<string> }

function cloneSet<T>(source: Set<T>) {
  return new Set(source)
}

function intersectSets<T>(a: Set<T>, b: Set<T>) {
  const result = new Set<T>()
  for (const value of a) {
    if (b.has(value)) result.add(value)
  }
  return result
}

function unionLayerSets(layers: OverlayLayer[]) {
  const nodeIds = new Set<string>()
  const linkIds = new Set<string>()
  for (const layer of layers) {
    layer.nodeIds.forEach((id) => nodeIds.add(id))
    layer.linkIds.forEach((id) => linkIds.add(id))
  }
  return { nodeIds, linkIds }
}

function constrainSpeciesIds(speciesIds: Set<number>) {
  if (!exactMatchedSpeciesIds.value) {
    return speciesIds
  }

  return intersectSets(speciesIds, exactMatchedSpeciesIds.value)
}

const overlayFilterGroups = computed(() => {
  const groups: OverlayLayer[][] = []
  const matsvampLayers: OverlayLayer[] = []
  const statusLayers: OverlayLayer[] = []
  const groupLayers: OverlayLayer[] = []

  if (isMatsvampFilterActive.value) {
    const matchingSpeciesIds = constrainSpeciesIds(new Set(
      rawGraphData.value.species
        .filter((species) => species.isEdible)
        .map((species) => species.id)
    ))
    const { nodeIds, linkIds } = buildHighlightStateFromSpeciesIds(matchingSpeciesIds)
    matsvampLayers.push({
      id: 'matsvamp',
      color: '#eab308',
      nodeIds,
      linkIds
    })
  }

  if (isGiftsvampFilterActive.value) {
    const matchingSpeciesIds = constrainSpeciesIds(new Set(
      rawGraphData.value.species
        .filter((species) => species.isPoison)
        .map((species) => species.id)
    ))
    const { nodeIds, linkIds } = buildHighlightStateFromSpeciesIds(matchingSpeciesIds)
    matsvampLayers.push({
      id: 'giftsvamp',
      color: '#84cc16',
      nodeIds,
      linkIds
    })
  }

  for (const statusFilter of props.statusFilters || []) {
    const normalizedStatusKey = normalizeGroupKey(statusFilter)
    const matchingSpeciesIds = constrainSpeciesIds(new Set(
      rawGraphData.value.species
        .filter((species) => species.statusKeys.includes(normalizedStatusKey))
        .map((species) => species.id)
    ))
    const { nodeIds, linkIds } = buildHighlightStateFromSpeciesIds(matchingSpeciesIds)

    statusLayers.push({
      id: `status:${normalizedStatusKey}`,
      color: statusFilterColorMap[normalizedStatusKey] ?? '#9ca3af',
      nodeIds,
      linkIds
    })
  }

  for (const groupKey of activeGroupFilterKeys.value) {
    const matchingSpeciesIds = constrainSpeciesIds(new Set(
      rawGraphData.value.species
        .filter((species) => species.groupKey === groupKey)
        .map((species) => species.id)
    ))
    const { nodeIds, linkIds } = buildHighlightStateFromSpeciesIds(matchingSpeciesIds)

    groupLayers.push({
      id: `group:${groupKey}`,
      color: groupFilterColorMap[groupKey] ?? '#4b5563',
      nodeIds,
      linkIds
    })
  }

  if (matsvampLayers.length) groups.push(matsvampLayers)
  if (statusLayers.length) groups.push(statusLayers)
  if (groupLayers.length) groups.push(groupLayers)

  return groups
})

const visualHighlightState = computed(() => {
  const tableHighlightState = exactFilterHighlightState.value.hasSelection
    ? exactFilterHighlightState.value
    : taxonomyHighlightState.value
  const hasBaseConstraint = tableHighlightState.hasSelection || isSearchFilterActive.value
  const constrainedNodeIds = new Set<string>()
  const constrainedLinkIds = new Set<string>()

  if (!hasBaseConstraint) {
    tableHighlightState.nodeIds.forEach((id) => constrainedNodeIds.add(id))
    tableHighlightState.linkIds.forEach((id) => constrainedLinkIds.add(id))
  } else if (tableHighlightState.hasSelection && isSearchFilterActive.value) {
    for (const nodeId of tableHighlightState.nodeIds) {
      if (searchHighlightState.value.nodeIds.has(nodeId)) {
        constrainedNodeIds.add(nodeId)
      }
    }

    for (const linkId of tableHighlightState.linkIds) {
      if (searchHighlightState.value.linkIds.has(linkId)) {
        constrainedLinkIds.add(linkId)
      }
    }
  } else if (tableHighlightState.hasSelection) {
    tableHighlightState.nodeIds.forEach((id) => constrainedNodeIds.add(id))
    tableHighlightState.linkIds.forEach((id) => constrainedLinkIds.add(id))
  } else if (isSearchFilterActive.value) {
    searchHighlightState.value.nodeIds.forEach((id) => constrainedNodeIds.add(id))
    searchHighlightState.value.linkIds.forEach((id) => constrainedLinkIds.add(id))
  }

  if (!overlayFilterGroups.value.length) {
    return {
      hasSelection: hasBaseConstraint ? constrainedNodeIds.size > 0 : false,
      nodeIds: hasBaseConstraint ? constrainedNodeIds : tableHighlightState.nodeIds,
      linkIds: hasBaseConstraint ? constrainedLinkIds : tableHighlightState.linkIds,
      layerNodeIds: new Map<string, Set<string>>(),
      layerLinkIds: new Map<string, Set<string>>(),
      layerColors: new Map<string, string>(),
      overlayModeActive: false
    }
  }

  let finalNodeIds: Set<string> | null = hasBaseConstraint ? cloneSet(constrainedNodeIds) : null
  let finalLinkIds: Set<string> | null = hasBaseConstraint ? cloneSet(constrainedLinkIds) : null
  const layerNodeIds = new Map<string, Set<string>>()
  const layerLinkIds = new Map<string, Set<string>>()
  const layerColors = new Map<string, string>()

  for (const group of overlayFilterGroups.value) {
    const union = unionLayerSets(group)
    finalNodeIds = finalNodeIds ? intersectSets(finalNodeIds, union.nodeIds) : union.nodeIds
    finalLinkIds = finalLinkIds ? intersectSets(finalLinkIds, union.linkIds) : union.linkIds
  }

  const nodeIds = finalNodeIds ?? new Set<string>()
  const linkIds = finalLinkIds ?? new Set<string>()

  for (const group of overlayFilterGroups.value) {
    for (const layer of group) {
      layerColors.set(layer.id, layer.color)

      for (const nodeId of layer.nodeIds) {
        if (nodeIds.has(nodeId)) {
          if (!layerNodeIds.has(layer.id)) layerNodeIds.set(layer.id, new Set<string>())
          layerNodeIds.get(layer.id)?.add(nodeId)
        }
      }

      for (const linkId of layer.linkIds) {
        if (linkIds.has(linkId)) {
          if (!layerLinkIds.has(layer.id)) layerLinkIds.set(layer.id, new Set<string>())
          layerLinkIds.get(layer.id)?.add(linkId)
        }
      }
    }
  }

  return {
    hasSelection: nodeIds.size > 0,
    nodeIds,
    linkIds,
    layerNodeIds,
    layerLinkIds,
    layerColors,
    overlayModeActive: true
  }
})

const visualGraphData = computed(() => {
  if (!visualHighlightState.value.overlayModeActive) {
    return rawGraphData.value
  }

  const links: TaxonomyGraphLink[] = []

  for (const link of rawGraphData.value.links) {
    const matchingLayers = Array.from(visualHighlightState.value.layerLinkIds.entries())
      .filter(([, linkIds]) => linkIds.has(link.id))
      .map(([layerId]) => layerId)

    if (!matchingLayers.length) {
      links.push({
        ...link,
        baseId: link.id,
        variant: 'base'
      })
      continue
    }

    matchingLayers.forEach((layerId, index) => {
      links.push({
        ...link,
        id: index === 0 ? link.id : `${link.id}::${layerId}`,
        baseId: link.id,
        variant: layerId as TaxonomyGraphLink['variant']
      })
    })
  }

  return {
    nodes: rawGraphData.value.nodes,
    links
  }
})

const visualRefreshNodeIds = computed(() => (
  visualHighlightState.value.hasSelection
    ? Array.from(visualHighlightState.value.nodeIds)
    : undefined
))

const selectionDescription = computed(() => {
  if (!selectedNode.value) {
    return 'Ingen taxonomifiltrering aktiv. Klicka på en taxonomisk nod för att filtrera tabellen.'
  }

  if (selectedNode.value.level === 'slakte') {
    return `Filtrerar tabellen på släkte: ${selectedNode.value.label}`
  }

  if (selectedNode.value.level === 'familj') {
    return `Filtrerar tabellen på familj: ${selectedNode.value.label}`
  }

  if (selectedNode.value.level === 'ordning') {
    return `Filtrerar tabellen på ordning: ${selectedNode.value.label}`
  }

  if (selectedNode.value.level === 'klass') {
    return `Filtrerar tabellen på klass: ${selectedNode.value.label}`
  }

  if (selectedNode.value.level === 'fylum') {
    return `Filtrerar tabellen på fylum: ${selectedNode.value.label}`
  }

  return 'Klicka på en taxonomisk nod för att filtrera tabellen.'
})

watch(
  [() => props.activeFilter, () => rawGraphData.value.nodes],
  ([activeFilter]) => {
    if (!activeFilter?.level || !activeFilter.value) {
      selectedNodeId.value = undefined
      selectedNode.value = null
      return
    }

    const match = rawGraphData.value.nodes.find((node) => node.level === activeFilter.level && node.label === activeFilter.value)
    if (!match) {
      selectedNodeId.value = undefined
      selectedNode.value = null
      return
    }

    selectedNodeId.value = match.id
    selectedNode.value = match
  },
  { deep: true, immediate: true }
)

function zoomIn() {
  graphRef.value?.component?.zoomIn()
}

function zoomOut() {
  graphRef.value?.component?.zoomOut()
}

async function clearSelection() {
  selectedNodeId.value = undefined
  selectedNode.value = null
  emit('filterChange', { level: null, value: null })
  await nextTick()
  graphRef.value?.component?.fitView(250)
}

function getNodeLabel(node: TaxonomyGraphNode) {
  return `${node.label} (${node.count})`
}

function getNodeFill(node: TaxonomyGraphNode) {
  if (visualHighlightState.value.overlayModeActive && visualHighlightState.value.nodeIds.has(node.id)) {
    const matchingLayerColors = Array.from(visualHighlightState.value.layerNodeIds.entries())
      .filter(([, nodeIds]) => nodeIds.has(node.id))
      .map(([layerId]) => visualHighlightState.value.layerColors.get(layerId))
      .filter((color): color is string => Boolean(color))

    if (matchingLayerColors.length === 1) {
      return matchingLayerColors[0]
    }

    if (matchingLayerColors.length > 1) {
      return matchingLayerColors.slice(1).reduce(
        (currentColor, nextColor) => mixHexColors(currentColor, nextColor, 0.5),
        matchingLayerColors[0]!
      )
    }
  }

  if (node.level === 'kingdom') {
    return '#1E4A37'
  }

  const phylumLabel = nodePhylumLabelById.value.get(node.id) || node.label
  const scale = taxonomyColorScaleByPhylum[phylumLabel] || fallbackTaxonomyScale
  return scale[node.level]
}

function getNodeStroke(node: TaxonomyGraphNode) {
  if (selectedNodeId.value === node.id) {
    return '#0f172a'
  }

  return '#ffffff'
}

function getNodeStrokeWidth(node: TaxonomyGraphNode) {
  return selectedNodeId.value === node.id ? 4 : 2
}

function getLinkEndpointId(endpoint: string | number | { _id?: string | number; id?: string | number } | null | undefined) {
  if (endpoint && typeof endpoint === 'object') {
    return String(endpoint._id ?? endpoint.id ?? '')
  }

  return String(endpoint ?? '')
}

function getLinkStroke(link: TaxonomyGraphLink) {
  if (visualHighlightState.value.overlayModeActive) {
    if (link.variant && link.variant !== 'base') {
      return visualHighlightState.value.layerColors.get(link.variant) ?? '#e3d6c5'
    }

    return '#e3d6c5'
  }

  if (!visualHighlightState.value.hasSelection) {
    const targetNode = graphStructure.value.nodeById.get(getLinkEndpointId(link.target as any))
    if (!targetNode || targetNode.level === 'kingdom') {
      return '#e3d6c5'
    }

    const phylumLabel = nodePhylumLabelById.value.get(targetNode.id) || targetNode.label
    const scale = taxonomyColorScaleByPhylum[phylumLabel] || fallbackTaxonomyScale
    return scale.slakte
  }

  if (!visualHighlightState.value.linkIds.has(link.baseId ?? link.id)) {
    return '#e3d6c5'
  }

  const targetNode = graphStructure.value.nodeById.get(getLinkEndpointId(link.target as any))
  if (!targetNode || targetNode.level === 'kingdom') {
    return '#e3d6c5'
  }

  const phylumLabel = nodePhylumLabelById.value.get(targetNode.id) || targetNode.label
  const scale = taxonomyColorScaleByPhylum[phylumLabel] || fallbackTaxonomyScale
  return scale.slakte
}

function getLinkWidth(link: TaxonomyGraphLink) {
  if (visualHighlightState.value.overlayModeActive) {
    if (link.variant && link.variant !== 'base') {
      return 2.1
    }

    return 1
  }

  if (!visualHighlightState.value.hasSelection) {
    return 1.2
  }

  return visualHighlightState.value.linkIds.has(link.baseId ?? link.id) ? 2.4 : 1
}

function isNodeDisabled(node: TaxonomyGraphNode) {
  return visualHighlightState.value.hasSelection && !visualHighlightState.value.nodeIds.has(node.id)
}

function isLinkDisabled(link: TaxonomyGraphLink) {
  if (!visualHighlightState.value.hasSelection) {
    return false
  }

  if (visualHighlightState.value.overlayModeActive) {
    if (link.variant && link.variant !== 'base') {
      return !(visualHighlightState.value.layerLinkIds.get(link.variant)?.has(link.baseId ?? link.id) ?? false)
    }
  }

  return !visualHighlightState.value.linkIds.has(link.baseId ?? link.id)
}

function getNodeSize(node: TaxonomyGraphNode) {
  const count = Math.max(1, Number(node.count) || 1)
  const normalized = Math.min(1, Math.log10(count + 1) / 3.3)
  return Math.round(10 + normalized * 24)
}

const graphEvents = {
  [Graph.selectors.node]: {
    click: (node: TaxonomyGraphNode & { _id?: string | number }) => {
      selectedNodeId.value = String(node._id ?? node.id)
      selectedNode.value = {
        id: node.id,
        label: node.label,
        level: node.level,
        count: node.count
      }

      if (node.level !== 'kingdom') {
        emit('filterChange', {
          level: node.level,
          value: node.label
        })
        return
      }

      emit('filterChange', { level: null, value: null })
    }
  }
}
</script>
