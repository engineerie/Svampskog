import { createError, getQuery } from 'h3'
import { getSpeciesByScientificName } from '../utils/allSpeciesDataset'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const scientificName = typeof query.scientificname === 'string' ? query.scientificname.trim() : ''

  if (!scientificName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing scientificname query parameter'
    })
  }

  const species = await getSpeciesByScientificName(scientificName)

  if (!species) {
    throw createError({
      statusCode: 404,
      statusMessage: `Species not found: ${scientificName}`
    })
  }

  return species
})
