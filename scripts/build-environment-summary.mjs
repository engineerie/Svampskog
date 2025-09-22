import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const publicDir = path.join(projectRoot, 'public')

const geographyOptions = [
  { value: 'Norr', label: 'Norra Sverige' },
  { value: 'Söder', label: 'Södra Sverige' }
]

const forestTypeOptions = [
  { value: 'Granskog', label: 'Granskog' },
  { value: 'Tallskog', label: 'Tallskog' },
  { value: 'Barrblandskog', label: 'Barrblandskog' },
  { value: 'Lövblandskog', label: 'Blandskog' },
  { value: 'Lövskog', label: 'Övrig lövskog' },
  { value: 'EkBokskog', label: 'Ek och Bokskog' },
  { value: 'Naturbete', label: 'Trädklädd betesmark' }
]

const standAgeOptions = [
  { value: '1-40', label: '1–40 år' },
  { value: '41-90', label: '41–90 år' },
  { value: '91', label: '91 år och äldre' },
  { value: 'allaåldrar', label: 'Alla åldrar' }
]

const vegetationTypeOptions = [
  { value: 'Örter_grupp', label: 'Örttyper' },
  { value: 'Blåbär_grupp', label: 'Blåbärstyper' },
  { value: 'Lingon_grupp', label: 'Lingon-/fattigris-typer' }
]

const geographyLabels = Object.fromEntries(geographyOptions.map(({ value, label }) => [value, label]))
const forestTypeLabels = Object.fromEntries(forestTypeOptions.map(({ value, label }) => [value, label]))
const standAgeLabels = Object.fromEntries(standAgeOptions.map(({ value, label }) => [value, label]))
const vegetationTypeLabels = Object.fromEntries(vegetationTypeOptions.map(({ value, label }) => [value, label]))

const defaultOutputPath = path.join(publicDir, 'environmentSummary.json')
const outputPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : defaultOutputPath

const validCombinationsPath = path.join(publicDir, 'validCombinations.json')

async function readJsonIfExists(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    return { data: JSON.parse(content), exists: true }
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { data: [], exists: false }
    }
    throw error
  }
}

function normalizeFlag(value) {
  return typeof value === 'string' && value.trim().toLowerCase() === 'x'
}

function labelFor(value, map) {
  return map[value] || value
}

async function ensureDirectoryForFile(filePath) {
  const dir = path.dirname(filePath)
  await fs.mkdir(dir, { recursive: true })
}

async function main() {
  const combinationsRaw = await fs.readFile(validCombinationsPath, 'utf8')
  const expectedCombinations = new Set(
    JSON.parse(combinationsRaw).map(
      combo => `${combo.geo}-${combo.forest}-${combo.age}-${combo.veg}`
    )
  )

  const combinations = []
  for (const geo of geographyOptions) {
    for (const forest of forestTypeOptions) {
      for (const age of standAgeOptions) {
        for (const veg of vegetationTypeOptions) {
          combinations.push({
            geo: geo.value,
            forest: forest.value,
            age: age.value,
            veg: veg.value,
          })
        }
      }
    }
  }

  const results = []
  const missingFiles = new Map()

  for (const combo of combinations) {
    const { geo, forest, age, veg } = combo
    const slug = `${geo}-${forest}-${age}-${veg}`

    const ediblePath = path.join(publicDir, 'edible', `edibledata-${slug}.json`)
    const redlistedPath = path.join(publicDir, 'redlisted', `redlisted-${slug}.json`)
    const ednaPath = path.join(publicDir, 'edna', `edna-${slug}.json`)

    const [edibleResult, redlistedResult, ednaResult] = await Promise.all([
      readJsonIfExists(ediblePath),
      readJsonIfExists(redlistedPath),
      readJsonIfExists(ednaPath)
    ])

    const edibleData = edibleResult.data
    const redlistedData = redlistedResult.data
    const ednaData = ednaResult.data

    const isExpected = expectedCombinations.has(slug)

    if (isExpected && !edibleResult.exists) {
      missingFiles.set(ediblePath, (missingFiles.get(ediblePath) || 0) + 1)
    }
    if (isExpected && !redlistedResult.exists) {
      missingFiles.set(redlistedPath, (missingFiles.get(redlistedPath) || 0) + 1)
    }
    if (isExpected && !ednaResult.exists) {
      missingFiles.set(ednaPath, (missingFiles.get(ednaPath) || 0) + 1)
    }

    const edibleCount = edibleData.filter(row => normalizeFlag(row['Nyasvamp-boken'])).length
    const poisonousCount = edibleData.filter(row => normalizeFlag(row.Giftsvamp)).length
    const redlistedCount = redlistedData.length
    const ednaCount = ednaData.length

    const sampleEnvCount = ednaData.reduce((max, row) => {
      const value = Number(row.sample_env_count ?? row.sampleEnvCount)
      return Number.isFinite(value) && value > max ? value : max
    }, 0)

    const imageUrl = `/images/EDNA_bilder_skog/${geo}_${forest}_${age}_${veg}.png`

    const encodedSegments = [geo, forest, age, veg].map(segment => encodeURIComponent(segment))
    const href = `/mykorrhizasvampar/${encodedSegments.join('/')}`

    results.push({
      key: slug,
      geography: geo,
      geographyLabel: labelFor(geo, geographyLabels),
      forestType: forest,
      forestTypeLabel: labelFor(forest, forestTypeLabels),
      standAge: age,
      standAgeLabel: labelFor(age, standAgeLabels),
      vegetationType: veg,
      vegetationTypeLabel: labelFor(veg, vegetationTypeLabels),
      edibleCount,
      poisonousCount,
      redlistedCount,
      ednaCount,
      sampleEnvCount,
      imageUrl,
      href
    })
  }

  results.sort((a, b) => {
    return (
      a.geographyLabel.localeCompare(b.geographyLabel) ||
      a.forestTypeLabel.localeCompare(b.forestTypeLabel) ||
      a.standAgeLabel.localeCompare(b.standAgeLabel) ||
      a.vegetationTypeLabel.localeCompare(b.vegetationTypeLabel)
    )
  })

  await ensureDirectoryForFile(outputPath)
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2), 'utf8')

  console.log(`Environment summary written to ${outputPath}`)

  const missingEntries = Array.from(missingFiles.keys())
  if (missingEntries.length) {
    console.warn('\nSome data files were missing or empty:')
    for (const file of missingEntries) {
      console.warn(` - ${path.relative(projectRoot, file)}`)
    }
  }
}

main().catch(error => {
  console.error('Failed to build environment summary:', error)
  process.exitCode = 1
})
