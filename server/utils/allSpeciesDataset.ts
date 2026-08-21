import fs from 'fs'
import path from 'path'

type CountMap = Record<string, number>

export type AllSpeciesRow = {
  Scientificname: string
  Commonname: string
  Nyttartnamn: string | null
  Släkte: string | null
  SvensktSläkte?: string | null
  högrenivå: string | null
  Artfakta: string | null
  RL2020kat: string | null
  RL2020krit: string | null
  Kriteriedokumentation: string | null
  'Svamp-grupp': string | null
  'Svamp-Undersvamp-grupp': string | null
  SIGNAL_art: string | null
  Svampguiden: string | null
  SKR_rek_matsvamp_2026: string | null
  Giftsvamp: string | null
  OVANLIGHET: number | null
  KALKmark: string | null
  ANNANmark: string | null
  ekologi: string | null
  Fylum: string | null
  Klass: string | null
  Ordning: string | null
  Familj: string | null
  images: string[]
  synlighet: number | null
  'Svamp-grupp-släkte': string
  total_plot_count: number
  forest_type_plot_counts: CountMap
  stand_age_plot_counts: CountMap
  vegetation_plot_counts: CountMap
}

type FilterOptions = {
  group: string[]
  status: string[]
  matsvamp: string[]
  fylum: string[]
  klass: string[]
  ordning: string[]
  familj: string[]
  slakte: string[]
  taxonomyPhylumByValue: {
    klass: Record<string, string>
    ordning: Record<string, string>
    familj: Record<string, string>
    slakte: Record<string, string>
  }
}

type Dataset = {
  rows: AllSpeciesRow[]
  filterOptions: FilterOptions
}

export type TaxonomyGraphNode = {
  id: string
  label: string
  subLabel?: string
  level: 'kingdom' | 'fylum' | 'klass' | 'ordning' | 'familj' | 'slakte' | 'species'
  count: number
  searchMatchCount: number
  edibleCount: number
  poisonCount: number
  groupCounts: Record<string, number>
  statusCounts: Record<string, number>
  speciesIds: number[]
  scientificName?: string
}

export type TaxonomyGraphLink = {
  id: string
  source: string
  target: string
}

export type TaxonomyGraphSpecies = {
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

type GraphLevel = TaxonomyGraphNode['level']

type GraphDatasetOptions = {
  focusNodeId?: string | null
  maxVisibleLevel?: number
  search?: string | null
}

let datasetPromise: Promise<Dataset> | null = null
let ednaDetailsPromise: Promise<Record<string, Partial<AllSpeciesRow>>> | null = null

function normalizeString(value: string | null | undefined) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function normalizeGroupKey(value: string | null | undefined) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}+/gu, '')
}

function getStatusLabel(status: string | null) {
  const normalized = normalizeString(status).toUpperCase()
  if (!status || status === '0' || normalized === 'NE') return 'Ej bedömd'
  if (normalized === 'NA') return 'Ej tillämplig'

  const labels: Record<string, string> = {
    LC: 'Livskraftig',
    NT: 'Nära hotad',
    EN: 'Starkt hotad',
    VU: 'Sårbar',
    CR: 'Akut hotad',
    RE: 'Nationellt utdöd',
    DD: 'Kunskapsbrist'
  }

  return labels[String(status).toUpperCase()] || 'Ej bedömd'
}

function getDisplayGroup(row: Pick<AllSpeciesRow, 'Svamp-grupp' | 'Svamp-grupp-släkte'>) {
  if (row['Svamp-grupp'] && row['Svamp-grupp'] !== '0') return row['Svamp-grupp']
  return row['Svamp-grupp-släkte'] || 'Saknas'
}

function isEdibleSpecies(row: Pick<AllSpeciesRow, 'SKR_rek_matsvamp_2026'>) {
  return String(row.SKR_rek_matsvamp_2026 || '').toLowerCase() === 'x'
}

function isPoisonSpecies(row: Pick<AllSpeciesRow, 'Giftsvamp'>) {
  return String(row.Giftsvamp || '').toLowerCase() === 'x'
}

function buildFilterOptions(rows: AllSpeciesRow[]): FilterOptions {
  const unique = (values: Array<string | null | undefined>) =>
    Array.from(new Set(values.filter((value): value is string => Boolean(value)))).sort((a, b) => a.localeCompare(b, 'sv'))

  const taxonomyPhylumByValue = {
    klass: {} as Record<string, string>,
    ordning: {} as Record<string, string>,
    familj: {} as Record<string, string>,
    slakte: {} as Record<string, string>
  }

  for (const row of rows) {
    if (!row.Fylum) continue
    if (row.Klass && !taxonomyPhylumByValue.klass[row.Klass]) taxonomyPhylumByValue.klass[row.Klass] = row.Fylum
    if (row.Ordning && !taxonomyPhylumByValue.ordning[row.Ordning]) taxonomyPhylumByValue.ordning[row.Ordning] = row.Fylum
    if (row.Familj && !taxonomyPhylumByValue.familj[row.Familj]) taxonomyPhylumByValue.familj[row.Familj] = row.Fylum
    if (row.Släkte && !taxonomyPhylumByValue.slakte[row.Släkte]) taxonomyPhylumByValue.slakte[row.Släkte] = row.Fylum
  }

  return {
    group: unique(rows.map((row) => getDisplayGroup(row))),
    status: unique([
      ...rows.map((row) => getStatusLabel(row.RL2020kat)),
      ...(rows.some((row) => row.SIGNAL_art === 'S') ? ['Signalart'] : [])
    ]),
    matsvamp: unique([
      ...(rows.some(isEdibleSpecies) ? ['Matsvamp'] : []),
      ...(rows.some(isPoisonSpecies) ? ['Giftsvamp'] : [])
    ]),
    fylum: unique(rows.map((row) => row.Fylum)),
    klass: unique(rows.map((row) => row.Klass)),
    ordning: unique(rows.map((row) => row.Ordning)),
    familj: unique(rows.map((row) => row.Familj)),
    slakte: unique(rows.map((row) => row.Släkte)),
    taxonomyPhylumByValue
  }
}

async function buildDataset(): Promise<Dataset> {
  const filePath = path.join(process.cwd(), 'public/species/all-species.json')
  const raw = await fs.promises.readFile(filePath, 'utf8')
  const rows = JSON.parse(raw) as AllSpeciesRow[]

  return {
    rows,
    filterOptions: buildFilterOptions(rows)
  }
}

export function getDisplayGroupLabel(row: Pick<AllSpeciesRow, 'Svamp-grupp' | 'Svamp-grupp-släkte'>) {
  return getDisplayGroup(row)
}

export function getStatusDisplayLabel(status: string | null) {
  return getStatusLabel(status)
}

export async function getAllSpeciesDataset() {
  if (!datasetPromise) {
    datasetPromise = buildDataset()
  }
  return datasetPromise
}

export async function getEdnaSpeciesDetailsDataset() {
  if (!ednaDetailsPromise) {
    const filePath = path.join(process.cwd(), 'public/species/edna-species-details.json')
    ednaDetailsPromise = fs.promises
      .readFile(filePath, 'utf8')
      .then(raw => JSON.parse(raw) as Record<string, Partial<AllSpeciesRow>>)
  }
  return ednaDetailsPromise
}

function getLevelOrder(level: GraphLevel) {
  const order: Record<GraphLevel, number> = {
    kingdom: 0,
    fylum: 1,
    klass: 2,
    ordning: 3,
    familj: 4,
    slakte: 5,
    species: 6
  }

  return order[level]
}

function getAncestorIds(nodeId: string) {
  const segments = nodeId.split('|')
  return segments.map((_, index) => segments.slice(0, index + 1).join('|'))
}

function isWithinFocusedBranch(nodeId: string, focusNodeId?: string | null) {
  if (!focusNodeId) return true
  if (nodeId.startsWith(focusNodeId)) return true
  return getAncestorIds(focusNodeId).includes(nodeId)
}

export async function getAllSpeciesGraphDataset(options: GraphDatasetOptions = {}) {
  const { rows } = await getAllSpeciesDataset()
  const nodes = new Map<string, TaxonomyGraphNode>()
  const links = new Map<string, TaxonomyGraphLink>()
  const species: TaxonomyGraphSpecies[] = []
  const kingdomId = 'kingdom:fungi'
  const maxVisibleLevel = Number.isFinite(options.maxVisibleLevel) ? Number(options.maxVisibleLevel) : 4
  const focusNodeId = options.focusNodeId?.trim() || null
  const normalizedSearch = normalizeString(options.search)

  const sortedRows = rows
    .slice()
    .sort((a, b) => {
      const partsA = [a.Fylum, a.Klass, a.Ordning, a.Familj, a.Släkte, a.Scientificname].map((value) => value || '')
      const partsB = [b.Fylum, b.Klass, b.Ordning, b.Familj, b.Släkte, b.Scientificname].map((value) => value || '')
      return partsA.join('|').localeCompare(partsB.join('|'), 'sv')
    })

  const ensureNode = (id: string, node: TaxonomyGraphNode) => {
    if (!nodes.has(id)) {
      nodes.set(id, node)
      return
    }

    const current = nodes.get(id)!
    current.count += 1
    current.searchMatchCount += node.searchMatchCount
    current.edibleCount += node.edibleCount
    current.poisonCount += node.poisonCount
    for (const [groupKey, count] of Object.entries(node.groupCounts)) {
      current.groupCounts[groupKey] = Number(current.groupCounts[groupKey] || 0) + Number(count || 0)
    }
    for (const [statusKey, count] of Object.entries(node.statusCounts)) {
      current.statusCounts[statusKey] = Number(current.statusCounts[statusKey] || 0) + Number(count || 0)
    }
    current.speciesIds.push(...node.speciesIds)
  }

  const ensureLink = (source: string, target: string) => {
    const id = `${source}->${target}`
    if (!links.has(id)) {
      links.set(id, { id, source, target })
    }
  }

  ensureNode(kingdomId, {
    id: kingdomId,
    label: 'Kingdom fungi',
    level: 'kingdom',
    count: 0,
    searchMatchCount: 0,
    edibleCount: 0,
    poisonCount: 0,
    groupCounts: {},
    statusCounts: {},
    speciesIds: []
  })

  sortedRows.forEach((row, speciesIndex) => {
    const searchMatchCount = normalizedSearch
      && (
        normalizeString(row.Commonname).includes(normalizedSearch)
        || normalizeString(row.Scientificname).includes(normalizedSearch)
      )
      ? 1
      : 0
    const edibleCount = isEdibleSpecies(row) ? 1 : 0
    const poisonCount = isPoisonSpecies(row) ? 1 : 0
    const normalizedGroupKey = normalizeGroupKey(getDisplayGroup(row))
    const normalizedStatusKeys = [
      normalizeGroupKey(getStatusLabel(row.RL2020kat)),
      ...(row.SIGNAL_art === 'S' ? ['signalart'] : [])
    ].filter(Boolean)
    const fylum = row.Fylum || 'Fylum saknas'
    const klass = row.Klass || 'Klass saknas'
    const ordning = row.Ordning || 'Ordning saknas'
    const familj = row.Familj || 'Familj saknas'
    const slakte = row.Släkte || 'Släkte saknas'

    const fylumId = `fylum:${fylum}`
    const klassId = `${fylumId}|klass:${klass}`
    const ordningId = `${klassId}|ordning:${ordning}`
    const familjId = `${ordningId}|familj:${familj}`
    const slakteId = `${familjId}|slakte:${slakte}`
    const speciesId = `${slakteId}|species:${row.Scientificname}`
    const chain: Array<{ id: string; label: string; level: GraphLevel; subLabel?: string; scientificName?: string }> = [
      { id: kingdomId, label: 'Kingdom fungi', level: 'kingdom' },
      { id: fylumId, label: fylum, level: 'fylum' },
      { id: klassId, label: klass, level: 'klass' },
      { id: ordningId, label: ordning, level: 'ordning' },
      { id: familjId, label: familj, level: 'familj' },
      { id: slakteId, label: slakte, level: 'slakte' },
      {
        id: speciesId,
        label: row.Scientificname,
        subLabel: row.Commonname,
        level: 'species',
        scientificName: row.Scientificname
      }
    ]

    const visibleChain = chain.filter(({ id, level }) =>
      isWithinFocusedBranch(id, focusNodeId) && getLevelOrder(level) <= maxVisibleLevel
    )

    if (!visibleChain.length) return

    species.push({
      id: speciesIndex,
      groupKey: normalizedGroupKey,
      statusKeys: normalizedStatusKeys,
      isEdible: edibleCount > 0,
      isPoison: poisonCount > 0,
      fylum: row.Fylum,
      klass: row.Klass,
      ordning: row.Ordning,
      familj: row.Familj,
      slakte: row.Släkte
    })

    for (const node of visibleChain) {
      ensureNode(node.id, {
        id: node.id,
        label: node.label,
        subLabel: node.subLabel,
        level: node.level,
        count: 1,
        searchMatchCount,
        edibleCount,
        poisonCount,
        groupCounts: normalizedGroupKey ? { [normalizedGroupKey]: 1 } : {},
        statusCounts: Object.fromEntries(normalizedStatusKeys.map((key) => [key, 1])),
        speciesIds: [speciesIndex],
        scientificName: node.scientificName
      })
    }

    for (let index = 0; index < visibleChain.length - 1; index += 1) {
      ensureLink(visibleChain[index]!.id, visibleChain[index + 1]!.id)
    }
  })

  return {
    nodes: Array.from(nodes.values()),
    links: Array.from(links.values()),
    species,
    totalSpeciesCount: rows.length
  }
}

export async function getSpeciesByScientificName(scientificName: string) {
  const { rows } = await getAllSpeciesDataset()
  return rows.find((row) => row.Scientificname === scientificName) || null
}
