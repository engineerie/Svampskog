import { createError, getQuery } from 'h3'
import { getAllSpeciesDataset, getEdnaSpeciesDetailsDataset } from '../utils/allSpeciesDataset'

function normalizeScientificName(value: string) {
  return value.trim().toLocaleLowerCase('sv-SE')
}

function parentScientificName(value: string) {
  return value
    .replace(/\s+sp\.\s*\d+$/i, '')
    .replace(/\s*\(coll\.\)\s*$/i, '')
    .trim()
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const speciesCode = typeof query.speciesCode === 'string' ? query.speciesCode.trim() : ''
  const scientificName = typeof query.scientificName === 'string' ? query.scientificName.trim() : ''

  if (!speciesCode && !scientificName) {
    throw createError({ statusCode: 400, statusMessage: 'speciesCode or scientificName is required' })
  }

  const [{ rows }, ednaDetailsBySpeciesCode] = await Promise.all([
    getAllSpeciesDataset(),
    getEdnaSpeciesDetailsDataset()
  ])
  const candidateNames = [scientificName, parentScientificName(scientificName)]
    .filter(Boolean)
    .map(normalizeScientificName)
  const curatedSpecies = rows.find(row => candidateNames.includes(normalizeScientificName(row.Scientificname)))
  const ednaDetails = speciesCode ? ednaDetailsBySpeciesCode[speciesCode] : null

  if (!curatedSpecies && !ednaDetails) {
    throw createError({ statusCode: 404, statusMessage: 'Species not found' })
  }

  return {
    ...(curatedSpecies || {}),
    ...(ednaDetails || {}),
    ...(scientificName ? { Scientificname: scientificName } : {})
  }
})
