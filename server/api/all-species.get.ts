import { getQuery } from 'h3'
import { getAllSpeciesDataset, getDisplayGroupLabel, getStatusDisplayLabel } from '../utils/allSpeciesDataset'

function parseList(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) return []
  return value.split(',').map((entry) => entry.trim()).filter(Boolean)
}

function normalize(value: string | null | undefined) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function getCountTotal(counts: Record<string, number>) {
  return Object.values(counts || {}).reduce((sum, value) => sum + Number(value || 0), 0)
}

function isEdibleSpecies(row: { SKR_rek_matsvamp_2026?: string | null }) {
  return String(row.SKR_rek_matsvamp_2026 || '').toLowerCase() === 'x'
}

function isPoisonSpecies(row: { Giftsvamp?: string | null }) {
  return String(row.Giftsvamp || '').toLowerCase() === 'x'
}

function isUnassessedStatus(status: string | null | undefined) {
  const normalized = String(status || '').trim().toUpperCase()
  return !status || status === '0' || normalized === 'NE'
}

function isNotApplicableStatus(status: string | null | undefined) {
  return String(status || '').trim().toUpperCase() === 'NA'
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || 25))
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const sort = typeof query.sort === 'string' ? query.sort : 'Commonname'
  const order = query.order === 'desc' ? 'desc' : 'asc'

  const filters = {
    group: parseList(query.group),
    status: parseList(query.status),
    matsvamp: parseList(query.matsvamp),
    fylum: parseList(query.fylum),
    klass: parseList(query.klass),
    ordning: parseList(query.ordning),
    familj: parseList(query.familj),
    slakte: parseList(query.slakte)
  }

  const { rows, filterOptions } = await getAllSpeciesDataset()
  const normalizedSearch = normalize(search)

  let filtered = rows.filter((row) => {
    if (normalizedSearch) {
      const matchesSearch =
        normalize(row.Commonname).includes(normalizedSearch) ||
        normalize(row.Scientificname).includes(normalizedSearch)
      if (!matchesSearch) return false
    }

    if (filters.group.length && !filters.group.includes(getDisplayGroupLabel(row))) return false
    if (filters.status.length) {
      const statusMatches = filters.status.includes(getStatusDisplayLabel(row.RL2020kat))
      const signalartMatches = filters.status.includes('Signalart') && row.SIGNAL_art === 'S'
      const ejBedomdMatches = filters.status.includes('Ej bedömd') && isUnassessedStatus(row.RL2020kat)
      const ejTillampligMatches = filters.status.includes('Ej tillämplig') && isNotApplicableStatus(row.RL2020kat)
      if (!statusMatches && !signalartMatches && !ejBedomdMatches && !ejTillampligMatches) return false
    }
    if (filters.matsvamp.length) {
      const matsvampMatches = filters.matsvamp.includes('Matsvamp') && isEdibleSpecies(row)
      const giftsvampMatches = filters.matsvamp.includes('Giftsvamp') && isPoisonSpecies(row)
      if (!matsvampMatches && !giftsvampMatches) return false
    }
    if (filters.fylum.length && !filters.fylum.includes(row.Fylum || '')) return false
    if (filters.klass.length && !filters.klass.includes(row.Klass || '')) return false
    if (filters.ordning.length && !filters.ordning.includes(row.Ordning || '')) return false
    if (filters.familj.length && !filters.familj.includes(row.Familj || '')) return false
    if (filters.slakte.length && !filters.slakte.includes(row.Släkte || '')) return false

    return true
  })

  const sorters: Record<string, (row: typeof rows[number]) => string | number> = {
    Commonname: (row) => normalize(row.Commonname),
    Scientificname: (row) => normalize(row.Scientificname),
    total_plot_count: (row) => row.total_plot_count,
    forestSummary: (row) => getCountTotal(row.forest_type_plot_counts),
    ageSummary: (row) => getCountTotal(row.stand_age_plot_counts),
    vegetationSummary: (row) => getCountTotal(row.vegetation_plot_counts),
    Fylum: (row) => normalize(row.Fylum),
    Klass: (row) => normalize(row.Klass),
    Ordning: (row) => normalize(row.Ordning),
    Familj: (row) => normalize(row.Familj),
    group: (row) => normalize(getDisplayGroupLabel(row)),
    status: (row) => normalize(getStatusDisplayLabel(row.RL2020kat))
  }

  const sorter = sorters[sort] ?? sorters.Commonname ?? ((row: typeof rows[number]) => normalize(row.Commonname))
  filtered = filtered.slice().sort((a, b) => {
    const aValue = sorter(a)
    const bValue = sorter(b)

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return order === 'desc' ? bValue - aValue : aValue - bValue
    }

    const comparison = String(aValue).localeCompare(String(bValue), 'sv')
    return order === 'desc' ? -comparison : comparison
  })

  const total = filtered.length
  const startIndex = (page - 1) * pageSize
  const items = filtered.slice(startIndex, startIndex + pageSize)

  return {
    items,
    total,
    page,
    pageSize,
    filterOptions
  }
})
