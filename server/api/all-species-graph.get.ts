import { getQuery } from 'h3'
import { getAllSpeciesGraphDataset } from '../utils/allSpeciesDataset'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const focusNodeId = typeof query.focusNodeId === 'string' ? query.focusNodeId : null
  const maxVisibleLevel = Math.min(6, Math.max(0, Number(query.maxVisibleLevel) || 4))
  const search = typeof query.search === 'string' ? query.search : null

  return await getAllSpeciesGraphDataset({
    focusNodeId,
    maxVisibleLevel,
    search
  })
})
