<template>
  <section class="types-of-mycorrhiza-chart">
    <!-- <div class="mb-4">
      <h2 class="text-lg font-semibold text-neutral-900">
        Typer av mykorrhiza
      </h2>
      <p class="mt-1 max-w-3xl text-sm text-neutral-600">
        Diagrammet visar vilka växter de olika typerna av mykorrhiza bildar relationer med.
        Klicka på träd- och växtgrupperna för att visa eller dölja innehållet.
      </p>
    </div> -->

    <div class="overflow-hidden rounded-xl ">
      <VisSingleContainer :data="graphData" :height="graphHeight">
        <VisTooltip ref="tooltipRef" :triggers="tooltipTriggers" :follow-cursor="false" :allow-hover="true"
          horizontal-placement="center" vertical-placement="top" />
        <VisGraph :layout-type="GraphLayoutType.Elk" :layout-elk-settings="elkLayoutSettings"
          :layout-elk-node-groups="[nodeLayoutGroup]" :layout-autofit="true" :fit-view-padding="54" :disable-drag="true"
          :disable-brush="true" :disable-zoom="true" :node-size="nodeSize" :node-fill="nodeFill"
          :node-stroke="nodeStroke" :node-stroke-width="nodeStrokeWidth" :node-icon="nodeIcon"
          :node-icon-size="nodeIconSize" :node-label="nodeLabel" :node-label-trim="false" :node-sub-label="nodeSubLabel"
          :node-sub-label-trim="false" :link-stroke="linkStroke" :link-width="2" :link-curvature="0.25"
          :link-highlight-on-hover="false" :panels="mycorrhizaClassPanels" :attributes="graphAttributes"
          :events="graphEvents" />
      </VisSingleContainer>
    </div>

    <p class="mt-3 text-sm text-neutral-600">
      I figuren kan du utforska vilka typer av mykorrhiza som olika växtgrupper bildar. Håll pekaren över en grupp,
      eller tryck på den på mobilen, för att läsa mer.
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { Graph, GraphLayoutType, type Tooltip } from '@unovis/ts'
import { VisGraph, VisSingleContainer, VisTooltip } from '@unovis/vue'

type Branch = 'arbuscular' | 'ericoid' | 'orchid' | 'ecto' | 'shared'
type NodeKind = 'mycorrhiza' | 'plant-group' | 'tree-group' | 'tree' | 'plant'

type MycorrhizaNode = {
  id: string
  label: string
  subLabel?: string
  icon: string
  kind: NodeKind
  branch: Branch
  layoutGroup?: string
  expandable?: boolean
}

type MycorrhizaLink = {
  id: string
  source: string
  target: string
  branch: Branch
}

const isMobile = useMediaQuery('(max-width: 767px)')
const tooltipRef = ref<{ component?: Tooltip } | null>(null)
const graphHeight = computed(() => (isMobile.value ? 680 : 560))

const typeNodes: MycorrhizaNode[] = [
  {
    id: 'ecto',
    label: 'Ektomykorrhiza',
    icon: '🍄',
    kind: 'mycorrhiza',
    branch: 'ecto',
    layoutGroup: 'classification-ekto'
  },
  {
    id: 'arbuscular',
    label: 'Arbuskulär mykorrhiza',
    icon: '◉',
    kind: 'mycorrhiza',
    branch: 'arbuscular',
    layoutGroup: 'classification-endo'
  },
  {
    id: 'ericoid',
    label: 'Ericoid mykorrhiza',
    icon: '◉',
    kind: 'mycorrhiza',
    branch: 'ericoid',
    layoutGroup: 'classification-endo'
  },
  {
    id: 'orchid',
    label: 'Orkidémykorrhiza',
    icon: '◉',
    kind: 'mycorrhiza',
    branch: 'orchid',
    layoutGroup: 'classification-endo'
  }
]

const relationshipNodes: MycorrhizaNode[] = [
  {
    id: 'arbuscular-plants',
    label: 'Växter',
    icon: '🌿',
    kind: 'plant-group',
    branch: 'arbuscular'
  },
  {
    id: 'heather-berry',
    label: 'Ljung och bärris',
    icon: '🫐',
    kind: 'plant-group',
    branch: 'ericoid'
  },
  {
    id: 'orchids',
    label: 'Orkidéer',
    icon: '🌱',
    kind: 'plant-group',
    branch: 'orchid'
  },
  {
    id: 'ecto-plants',
    label: 'Vissa växter',
    icon: '🌿',
    kind: 'plant-group',
    branch: 'ecto',
    expandable: true
  },
  {
    id: 'arbuscular-trees',
    label: 'Träd',
    icon: '🌳',
    kind: 'tree-group',
    branch: 'arbuscular',
    expandable: true
  },
  {
    id: 'ecto-trees',
    label: 'Träd',
    icon: '🌲',
    kind: 'tree-group',
    branch: 'ecto',
    expandable: true
  },
  {
    id: 'shared-trees',
    label: 'Träd',
    icon: '🌳',
    kind: 'tree-group',
    branch: 'shared',
    expandable: true
  }
]

const expandedTreeNodes: MycorrhizaNode[] = [
  { id: 'grey-alder', label: 'Gråal', icon: '🌳', kind: 'tree', branch: 'shared' },
  { id: 'black-alder', label: 'Klibbal', icon: '🌳', kind: 'tree', branch: 'shared' },
  { id: 'elm', label: 'Alm', icon: '🌳', kind: 'tree', branch: 'arbuscular' },
  { id: 'ash', label: 'Ask', icon: '🌳', kind: 'tree', branch: 'arbuscular' },
  { id: 'aspen', label: 'Asp', icon: '🌳', kind: 'tree', branch: 'shared' },
  { id: 'hornbeam', label: 'Avenbok', icon: '🌳', kind: 'tree', branch: 'ecto' },
  { id: 'downy-birch', label: 'Glasbjörk', icon: '🌳', kind: 'tree', branch: 'ecto' },
  { id: 'silver-birch', label: 'Vårtbjörk', icon: '🌳', kind: 'tree', branch: 'ecto' },
  { id: 'beech', label: 'Bok', icon: '🌳', kind: 'tree', branch: 'ecto' },
  { id: 'sessile-oak', label: 'Bergek', icon: '🌳', kind: 'tree', branch: 'ecto' },
  { id: 'pedunculate-oak', label: 'Skogsek', icon: '🌳', kind: 'tree', branch: 'ecto' },
  { id: 'juniper', label: 'En', icon: '🌲', kind: 'tree', branch: 'arbuscular' },
  { id: 'spruce', label: 'Gran', icon: '🌲', kind: 'tree', branch: 'ecto' },
  { id: 'bird-cherry', label: 'Hägg', icon: '🌳', kind: 'tree', branch: 'arbuscular' },
  { id: 'hazel', label: 'Hassel', icon: '🌳', kind: 'tree', branch: 'ecto' },
  { id: 'linden', label: 'Lind', icon: '🌳', kind: 'tree', branch: 'ecto' },
  { id: 'maple', label: 'Skogslönn', icon: '🌳', kind: 'tree', branch: 'arbuscular' },
  { id: 'whitebeam', label: 'Oxel', icon: '🌳', kind: 'tree', branch: 'arbuscular' },
  { id: 'rowan', label: 'Rönn', icon: '🌳', kind: 'tree', branch: 'arbuscular' },
  { id: 'goat-willow', label: 'Sälg', icon: '🌳', kind: 'tree', branch: 'shared' },
  { id: 'pine', label: 'Tall', icon: '🌲', kind: 'tree', branch: 'ecto' }
]

const expandedEctoPlantNodes: MycorrhizaNode[] = [
  { id: 'bearberry', label: 'Mjölon', icon: '🌿', kind: 'plant', branch: 'ecto' },
  { id: 'mountain-bearberry', label: 'Ripbär', icon: '🌿', kind: 'plant', branch: 'ecto' },
  { id: 'bistort', label: 'Ormrot', icon: '🌿', kind: 'plant', branch: 'ecto' },
  { id: 'wintergreen', label: 'Pyrola', icon: '🌿', kind: 'plant', branch: 'ecto' },
  { id: 'cinquefoil', label: 'Femfingerört', icon: '🌿', kind: 'plant', branch: 'ecto' }
]

const groupInformation = computed(() => ({
  'arbuscular-plants': {
    title: 'Växter',
    description: 'De flesta gräs, örter och buskar bildar arbuskulär mykorrhiza. Några exempel är:',
    items: ['Timotej', 'Hundäxing', 'Rödklöver', 'Maskros', 'Hagtorn']
  },
  'heather-berry': {
    title: 'Ljung och bärris',
    description: 'Exempel på växter som bildar ericoid mykorrhiza.',
    items: ['Ljung', 'Blåbär', 'Lingon', 'Odon', 'Kråkbär']
  },
  orchids: {
    title: 'Orkidéer',
    description: 'Exempel på orkidéer som bildar orkidémykorrhiza.',
    items: ['Jungfru Marie nycklar', 'Nattviol', 'Knärot', 'Skogsknipprot', 'Guckusko']
  },
  'arbuscular-trees': {
    title: 'Träd med arbuskulär mykorrhiza',
    description: 'Svenska trädslag i denna grupp.',
    items: expandedTreeNodes.filter(node => node.branch === 'arbuscular').map(node => node.label)
  },
  'ecto-trees': {
    title: 'Träd med ektomykorrhiza',
    description: 'Svenska trädslag i denna grupp.',
    items: expandedTreeNodes.filter(node => node.branch === 'ecto').map(node => node.label)
  },
  'shared-trees': {
    title: 'Träd med både ektomykorrhiza och arbuskulär mykorrhiza',
    description: 'Svenska trädslag i denna grupp.',
    items: expandedTreeNodes.filter(node => node.branch === 'shared').map(node => node.label)
  },
  'ecto-plants': {
    title: 'Växter',
    description: 'Ett antal växter bildar ektomykorrhiza. Några exempel är:',
    items: expandedEctoPlantNodes.map(node => node.label)
  }
}))

const classificationInformation = {
  Ektomykorrhiza: {
    title: 'Ektomykorrhiza',
    description: 'Svampens hyfer bildar en mantel runt roten och växer mellan rotens celler, men normalt inte in i dem.'
  },
  Endomykorrhiza: {
    title: 'Endomykorrhiza',
    description: 'Svampens hyfer växer inuti rotens vävnad och bildar strukturer i eller nära rotcellerna.'
  }
}

function groupTooltipContent(node: MycorrhizaNode & { _id?: string | number }) {
  const nodeId = String(node._id ?? node.id)
  const info = groupInformation.value[nodeId as keyof typeof groupInformation.value]
  if (!info) return null

  return `
    <div style="max-width: 280px">
      <div style="font-size: 14px; font-weight: 600; margin-bottom: 2px">${info.title}</div>
      <div style="font-size: 12px; color: #737373; margin-bottom: 8px">${info.description}</div>
      <div style="display: flex; flex-wrap: wrap; gap: 4px">
        ${info.items.map(item => `<span style="border: 1px solid #e5e5e5; border-radius: 6px; padding: 3px 7px; font-size: 12px; background: #fafafa">${item}</span>`).join('')}
      </div>
    </div>
  `
}

function classificationTooltipContent(panel: { label?: string }) {
  const info = classificationInformation[panel.label as keyof typeof classificationInformation]
  if (!info) return null

  return `
    <div style="max-width: 280px">
      <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px">${info.title}</div>
      <div style="font-size: 12px; line-height: 1.45; color: #525252">${info.description}</div>
    </div>
  `
}

const tooltipTriggers = {
  [Graph.selectors.node]: groupTooltipContent,
  [Graph.selectors.panel]: classificationTooltipContent
}

const graphAttributes = {
  [Graph.selectors.node]: {
    'data-tooltip-target': (node: MycorrhizaNode & { _id?: string | number }) =>
      String(node._id ?? node.id) in groupInformation.value
  },
  [Graph.selectors.panel]: {
    'data-tooltip-target': (panel: { label?: string }) =>
      Boolean(classificationInformation[panel.label as keyof typeof classificationInformation])
  }
}

const relationshipOrder = [
  'ecto-plants',
  'ecto-trees',
  'shared-trees',
  'arbuscular-trees',
  'arbuscular-plants',
  'heather-berry',
  'orchids'
]

const relationshipOrderIndex = new Map(relationshipOrder.map((id, index) => [id, index]))
const orderedRelationshipNodes = [...relationshipNodes].sort((a, b) =>
  (relationshipOrderIndex.get(a.id) ?? Number.MAX_SAFE_INTEGER)
  - (relationshipOrderIndex.get(b.id) ?? Number.MAX_SAFE_INTEGER)
)

const baseLinks: MycorrhizaLink[] = [
  { id: 'ecto-plants-link', source: 'ecto', target: 'ecto-plants', branch: 'ecto' },
  { id: 'ecto-trees-link', source: 'ecto', target: 'ecto-trees', branch: 'ecto' },
  { id: 'ecto-shared-trees-link', source: 'ecto', target: 'shared-trees', branch: 'ecto' },
  { id: 'arbuscular-shared-trees-link', source: 'arbuscular', target: 'shared-trees', branch: 'arbuscular' },
  { id: 'arbuscular-trees-link', source: 'arbuscular', target: 'arbuscular-trees', branch: 'arbuscular' },
  { id: 'arbuscular-plants-link', source: 'arbuscular', target: 'arbuscular-plants', branch: 'arbuscular' },
  { id: 'ericoid-link', source: 'ericoid', target: 'heather-berry', branch: 'ericoid' },
  { id: 'orchid-link', source: 'orchid', target: 'orchids', branch: 'orchid' }
]

const graphData = {
  nodes: [...typeNodes, ...orderedRelationshipNodes],
  links: baseLinks
}

function nodeLayoutGroup(node: MycorrhizaNode) {
  return node.layoutGroup || 'relationships'
}

function elkLayoutSettings(group: string) {
  return {
    'elk.algorithm': 'layered',
    'elk.direction': group === 'classification-endo' ? 'RIGHT' : 'DOWN',
    'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
    'elk.layered.spacing.nodeNodeBetweenLayers': '125',
    'elk.spacing.nodeNode': '80',
    'elk.edgeRouting': 'SPLINES',
    'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
    'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
    'elk.layered.crossingMinimization.forceNodeModelOrder': 'true',
    'elk.padding': '[top=35,left=52,bottom=75,right=52]'
  }
}

const mycorrhizaClassPanels = [
  {
    nodes: ['ecto'],
    label: 'Ektomykorrhiza',
    labelPosition: 'top',
    fillColor: 'rgba(156, 118, 84, 0.07)',
    borderColor: 'rgba(156, 118, 84, 0.4)',
    borderWidth: 1,
    padding: { top: 34, right: 24, bottom: 34, left: 24 }
  },
  {
    nodes: ['arbuscular', 'ericoid', 'orchid'],
    label: 'Endomykorrhiza',
    labelPosition: 'top',
    fillColor: 'rgba(142, 81, 255, 0.05)',
    borderColor: 'rgba(142, 81, 255, 0.35)',
    borderWidth: 1,
    padding: { top: 34, right: 24, bottom: 34, left: 24 }
  }
]

const branchColors: Record<Branch, { fill: string, stroke: string }> = {
  arbuscular: { fill: '#d9c7f7', stroke: '#8e51ff' },
  ericoid: { fill: '#d8e7cf', stroke: '#6f945f' },
  orchid: { fill: '#f2d8e5', stroke: '#bd6c96' },
  ecto: { fill: '#e4d4c1', stroke: '#9c7654' },
  shared: { fill: '#e1ddd7', stroke: '#7a7168' }
}

function nodeSize(node: MycorrhizaNode) {
  if (node.kind === 'mycorrhiza') return 62
  if (node.id === 'arbuscular-plants') return 58
  if (node.id === 'ecto-plants') return 42
  if (node.expandable) return 60
  if (node.kind === 'tree') return 42
  return 50
}

function nodeFill(node: MycorrhizaNode) {
  return branchColors[node.branch].fill
}

function nodeStroke(node: MycorrhizaNode) {
  return branchColors[node.branch].stroke
}

function nodeStrokeWidth(node: MycorrhizaNode) {
  return node.expandable ? 3 : 2
}

function nodeIcon(node: MycorrhizaNode) {
  return node.icon
}

function nodeIconSize(node: MycorrhizaNode) {
  return node.kind === 'tree' ? 18 : 24
}

function nodeLabel(node: MycorrhizaNode) {
  return node.label
}

function nodeSubLabel(node: MycorrhizaNode) {
  return node.subLabel || ''
}

function linkStroke(link: MycorrhizaLink) {
  return branchColors[link.branch].stroke
}

function showTooltipAtElement(content: string | null, element?: SVGElement) {
  const tooltip = tooltipRef.value?.component
  if (!content || !element || !tooltip) return

  tooltip.render(content)
  tooltip.display()
  tooltip.placeByElement(element)
}

const graphEvents = {
  [Graph.selectors.node]: {
    click: (
      node: MycorrhizaNode & { _id?: string | number },
      _event: MouseEvent,
      index: number,
      elements: SVGElement[]
    ) => {
      const content = groupTooltipContent(node)
      showTooltipAtElement(content, elements[index])
    }
  },
  [Graph.selectors.panel]: {
    click: (
      panel: { label?: string },
      _event: MouseEvent,
      index: number,
      elements: SVGElement[]
    ) => {
      const content = classificationTooltipContent(panel)
      showTooltipAtElement(content, elements[index])
    }
  }
}
</script>

<style scoped>
.types-of-mycorrhiza-chart :deep(.vis-graph-node-label) {
  fill: #262626;
  font-size: 12px;
  font-weight: 600;
}

.types-of-mycorrhiza-chart :deep(.vis-graph-node-sublabel) {
  fill: #737373;
  font-size: 10px;
}

.types-of-mycorrhiza-chart :deep([data-tooltip-target='true']) {
  cursor: default;
  transition: filter 150ms ease, opacity 150ms ease;
}

.types-of-mycorrhiza-chart :deep([data-tooltip-target='true']:hover) {
  filter: brightness(0.92) saturate(1.15) drop-shadow(0 2px 4px rgb(0 0 0 / 14%));
  opacity: 0.9;
}
</style>
