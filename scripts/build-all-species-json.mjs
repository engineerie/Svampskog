import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  pickColumnRef,
  quoteIdentifier,
  resolveSpeciesSourceSchema,
} from '../server/utils/speciesSourceSchema.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const scientificNameRepairs = {
  'Cortinarius moÃ«nne-loccozii': 'Cortinarius moënne-loccozii',
  'Cortinarius oulankaÃ«nsis': 'Cortinarius oulankaënsis',
  'Hygrophorus poÃ«tarum': 'Hygrophorus poëtarum',
  'Tricholoma borgsjoeÃ«nse': 'Tricholoma borgsjöënse'
}

const FOREST_TYPE_LABELS = {
  Granskog: 'Granskog',
  Tallskog: 'Tallskog',
  Barrblandskog: 'Barrblandskog',
  Lövblandskog: 'Lövblandskog',
  Lövskog: 'Lövskog',
  EkBokskog: 'EkBokskog',
  Naturbete: 'Naturbete'
}

const AGE_GROUP_LABELS = {
  '1-40': '1-40',
  '41-90': '41-90',
  '91+': '>91'
}

const VEGETATION_GROUP_LABELS = {
  'Örter_grupp': 'Örttyper',
  'Blåbär_grupp': 'Blåbärstyper',
  'Lingon_grupp': 'Lingon-fattigristyper'
}

const genusToSvampGrupp = {
  Acephala: 'övrigt',
  Alpova: 'tryffel',
  Amanita: 'hattsvamp',
  Amphinema: 'skinnsvamp',
  Boletus: 'sopp',
  Byssocorticium: 'skinnsvamp',
  Calonarius: 'hattsvamp',
  Cenococcum: 'övrigt',
  Chalciporus: 'sopp',
  Chamonixia: 'sopp',
  Chroogomphus: 'hattsvamp',
  Clavulina: 'fingersvamp',
  Cortinarius: 'hattsvamp',
  Craterellus: 'kantarell',
  Elaphomyces: 'tryffel',
  Entoloma: 'hattsvamp',
  Gautieria: 'tryffel',
  Genabea: 'tryffel',
  Genea: 'tryffel',
  Geopora: 'tryffel',
  Gomphidius: 'hattsvamp',
  Gyrodon: 'sopp',
  Hebeloma: 'hattsvamp',
  Helvellosebacina: 'övrigt',
  Humaria: 'skålsvamp',
  Hyaloscypha: 'skålsvamp',
  Hydnellum: 'taggsvamp',
  Hydnotrya: 'tryffel',
  Hydnum: 'taggsvamp',
  Hygronarius: 'hattsvamp',
  Hygrophorus: 'hattsvamp',
  Hymenogaster: 'tryffel',
  Hysterangium: 'tryffel',
  Imleria: 'sopp',
  Inocybe: 'hattsvamp',
  Inosperma: 'hattsvamp',
  Laccaria: 'hattsvamp',
  Lactarius: 'hattsvamp',
  Lactifluus: 'hattsvamp',
  Leccinum: 'sopp',
  Melanogaster: 'tryffel',
  Naucoria: 'hattsvamp',
  Otidea: 'skålsvamp',
  Paxillus: 'hattsvamp',
  Phaeocollybia: 'hattsvamp',
  Phellodon: 'taggsvamp',
  Phlegmacium: 'hattsvamp',
  Piloderma: 'skinnsvamp',
  Polyozellus: 'skinnsvamp',
  Pseudosperma: 'hattsvamp',
  Pseudotomentella: 'skinnsvamp',
  Ramaria: 'fingersvamp',
  Rhizopogon: 'tryffel',
  Russula: 'hattsvamp',
  Sarcodon: 'taggsvamp',
  Scleroderma: 'tryffel',
  Sebacina: 'övrigt',
  Serendipita: 'övrigt',
  Sistotrema: 'skinnsvamp',
  Sistotremella: 'skinnsvamp',
  Suillus: 'sopp',
  Sutorius: 'sopp',
  Tarzetta: 'skålsvamp',
  Thaxterogaster: 'hattsvamp',
  Thelephora: 'skinnsvamp',
  Tomentella: 'skinnsvamp',
  Tomentellopsis: 'skinnsvamp',
  Tretomyces: 'skinnsvamp',
  Tricholoma: 'hattsvamp',
  Trichophaea: 'skålsvamp',
  Tuber: 'tryffel',
  Tylopilus: 'sopp',
  Tylospora: 'skinnsvamp',
  Wilcoxina: 'skålsvamp',
  Xerocomellus: 'sopp',
  Xerocomus: 'sopp'
}

const genusToSynlighet = {
  Acephala: 0,
  Alpova: 0,
  Amanita: 1,
  Amphinema: 0,
  Boletus: 1,
  Byssocorticium: 0,
  Calonarius: 1,
  Cenococcum: 0,
  Chalciporus: 1,
  Chamonixia: 0,
  Chroogomphus: 1,
  Clavulina: 1,
  Cortinarius: 1,
  Craterellus: 1,
  Elaphomyces: 0,
  Entoloma: 1,
  Gautieria: 0,
  Genabea: 0,
  Genea: 0,
  Geopora: 0,
  Gomphidius: 1,
  Gyrodon: 1,
  Hebeloma: 1,
  Helvellosebacina: 0,
  Humaria: 1,
  Hyaloscypha: 0,
  Hydnellum: 1,
  Hydnotrya: 0,
  Hydnum: 1,
  Hygronarius: 1,
  Hygrophorus: 1,
  Hymenogaster: 0,
  Hysterangium: 0,
  Imleria: 1,
  Inocybe: 1,
  Inosperma: 1,
  Laccaria: 1,
  Lactarius: 1,
  Lactifluus: 1,
  Leccinum: 1,
  Melanogaster: 0,
  Naucoria: 1,
  Otidea: 1,
  Paxillus: 1,
  Phaeocollybia: 1,
  Phellodon: 1,
  Phlegmacium: 1,
  Piloderma: 0,
  Polyozellus: 0,
  Pseudosperma: 1,
  Ramaria: 1,
  Rhizopogon: 0,
  Russula: 1,
  Sarcodon: 1,
  Scleroderma: 1,
  Sebacina: 0,
  Serendipita: 0,
  Sistotrema: 0,
  Sistotremella: 0,
  Suillus: 1,
  Sutorius: 1,
  Tarzetta: 1,
  Thaxterogaster: 1,
  Thelephora: 1,
  Tomentella: 0,
  Tomentellopsis: 0,
  Tretomyces: 0,
  Tricholoma: 1,
  Trichophaea: 0,
  Tuber: 0,
  Tylopilus: 1,
  Tylospora: 0,
  Wilcoxina: 0,
  Xerocomellus: 1,
  Xerocomus: 1
}

const taxonToSvampGrupp = {
  Albatrellaceae: 'övrigt',
  Atheliaceae: 'skinnsvamp',
  Cantharellales: 'övrigt',
  Eurotiomycetes: 'övrigt',
  Hydnaceae: 'övrigt',
  Pyronemataceae: 'skålsvamp',
  Thelephoraceae: 'skinnsvamp'
}

function cleanTaxon(scientificname) {
  if (!scientificname) return null
  return scientificname.replace(/ sp\.\d+$/, '').trim()
}

function repairScientificName(scientificname) {
  const normalizedName = String(scientificname || '')
  return scientificNameRepairs[normalizedName] || normalizedName
}

function getScientificGenus(scientificname) {
  if (!scientificname) return null
  const cleaned = cleanTaxon(scientificname)
  if (!cleaned) return null
  const [genus] = cleaned.split(/\s+/, 1)
  return genus || null
}

function createCountMap(labels) {
  return Object.fromEntries(labels.map(label => [label, 0]))
}

function normalizeForestType(marktyp, hForm) {
  if (marktyp === 'Granskog') return 'Granskog'
  if (marktyp === 'Tallskog') return 'Tallskog'
  if (marktyp === 'Barrblandskog' || marktyp === 'Fjällbarrskog') return 'Barrblandskog'
  if (marktyp === 'Hygge' && ['Mår typ 1', 'Mår typ 2'].includes(hForm)) return 'Barrblandskog'
  if (marktyp === 'Blandskog') return 'Lövblandskog'
  if (marktyp === 'Hygge' && hForm === 'Mull') return 'Lövblandskog'
  if (marktyp === 'Björkskog' || marktyp === 'Övrig lövskog') return 'Lövskog'
  if (marktyp === 'Naturbete') return 'Naturbete'
  if (marktyp === 'Ek/Bokskog') return 'EkBokskog'
  return null
}

function normalizeAgeGroup(age) {
  const numericAge = Number(age)
  if (!Number.isFinite(numericAge)) return null
  if (numericAge >= 1 && numericAge <= 40) return '1-40'
  if (numericAge >= 41 && numericAge <= 90) return '41-90'
  if (numericAge >= 91) return '91+'
  return null
}

function normalizeEnvironmentAgeGroup(age) {
  const numericAge = Number(age)
  if (!Number.isFinite(numericAge)) return null
  if (numericAge >= 1 && numericAge <= 40) return '1-40'
  if (numericAge >= 41 && numericAge <= 90) return '41-90'
  if (numericAge >= 91) return '91'
  return null
}

function normalizeGeography(lat) {
  const numericLat = Number(lat)
  if (!Number.isFinite(numericLat)) return null
  return numericLat >= 60 ? 'Norr' : 'Söder'
}

function normalizeVegetationGroup(vegetationType) {
  if (['Högört', 'Lågört', 'Bredblad gräs'].includes(vegetationType)) {
    return VEGETATION_GROUP_LABELS['Örter_grupp']
  }
  if (['Blåbär', 'Smalblad gräs'].includes(vegetationType)) {
    return VEGETATION_GROUP_LABELS['Blåbär_grupp']
  }
  if (['Lingon', 'Kråkbär/Ljung', 'Fattigris'].includes(vegetationType)) {
    return VEGETATION_GROUP_LABELS['Lingon_grupp']
  }
  return null
}

async function computeImages(scientificName, manifest) {
  if (!scientificName) return []

  const cleanedName = scientificName
    .replace(/\s*s\.?\s*(lat\.?|str\.?)\s*$/i, '')
    .replace(/\s+sp\.\s*\d+$/i, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

  const foundImages = []
  const searchFolders = ['Matsvampar', 'Giftsvampar', 'RödlistadeSvampar']

  for (const folder of searchFolders) {
    const files = manifest[folder] || []
    for (const file of files) {
      const base = file.replace(/\.(jpg|jpeg|png|webp)$/i, '')
      const [namePart] = base.split('-', 1)
      const cleanedNamePart = namePart
        .replace(/\s+sp\.\s*\d+$/i, '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()

      if (cleanedNamePart.includes(',')) {
        const [nameA, nameB] = cleanedNamePart.split(',').map(part => part.trim())
        if (nameA === cleanedName || nameB === cleanedName) {
          foundImages.push(`/images/svampbilder/${folder}/${file}`)
        }
      } else if (cleanedNamePart === cleanedName) {
        foundImages.push(`/images/svampbilder/${folder}/${file}`)
      }
    }
  }

  return foundImages
}

async function buildAllSpeciesJson() {
  const db = await open({
    filename: path.join(__dirname, '../server/EDNAData.db'),
    driver: sqlite3.Database
  })
  const schema = await resolveSpeciesSourceSchema(db)
  const speciesTable = quoteIdentifier(schema.speciesTable)
  const artfaktaRef =
    pickColumnRef('m', schema.speciesColumns, ['Artfakta_2025', 'Artfakta 2025', 'Artfakta']) ||
    'NULL'
  const rlRef =
    pickColumnRef('m', schema.speciesColumns, ['RL2025kat', 'RL2020kat']) ||
    'NULL'
  const rl2025Ref =
    pickColumnRef('m', schema.speciesColumns, ['RL2025kat']) ||
    'NULL'
  const kriteriedokumentationRef =
    pickColumnRef('m', schema.speciesColumns, ['Kriteriedokumentation2025']) ||
    pickColumnRef('m', schema.speciesColumns, ['Kriteriedokumentation']) ||
    'NULL'
  const ekologiRef =
    pickColumnRef('m', schema.speciesColumns, ['Ekologi2025', 'ekologi 2025']) ||
    pickColumnRef('m', schema.speciesColumns, ['ekologi']) ||
    'NULL'
  const antalObsarRef =
    pickColumnRef('m', schema.speciesColumns, ['Antal_obsar', 'Antal obsar']) ||
    'NULL'
  const artfakta2025Ref =
    pickColumnRef('m', schema.speciesColumns, ['Artfakta_2025', 'Artfakta 2025']) ||
    'NULL'
  const nya2025Ref =
    pickColumnRef('m', schema.speciesColumns, ['nya_2025', 'nya 2025']) ||
    'NULL'
  const rankRedRef =
    pickColumnRef('m', schema.speciesColumns, ['Rank_rödlist_o_signal', 'Rank rödlist o signal']) ||
    'NULL'
  const rankMatsvampRef =
    pickColumnRef('m', schema.speciesColumns, ['Rank_matsvamp', 'Rank matsvamp']) ||
    'NULL'
  const rankGiftsvampRef =
    pickColumnRef('m', schema.speciesColumns, ['Rank_giftsvamp', 'Rank giftsvamp']) ||
    'NULL'
  const godMatsvampRef =
    pickColumnRef('m', schema.speciesColumns, ['God matsvamp', 'Godmatsvamp']) ||
    'NULL'
  const vedOchBarkRef =
    pickColumnRef('m', schema.speciesColumns, ['Värdtaxa:Vedochbark', 'Värdtaxa:VedochBark']) ||
    'NULL'
  const finaRotterRef =
    pickColumnRef('m', schema.speciesColumns, [
      'Värdtaxa:Finarerötterochrottrådar',
      'VärdTaxa:Finarerötterochrottrådar',
    ]) || 'NULL'
  const norrRef =
    pickColumnRef('m', schema.speciesColumns, ['Norra_Sverige', 'Norra Sverige']) ||
    'NULL'
  const soderRef =
    pickColumnRef('m', schema.speciesColumns, ['Södra_Sverige', 'Södra Sverige']) ||
    'NULL'
  const barrRef =
    pickColumnRef('m', schema.speciesColumns, ['Blandad_barrskog', 'Blandad barrskog']) ||
    'NULL'
  const lovRef =
    pickColumnRef('m', schema.speciesColumns, ['Blandad_lövskog', 'Blandad lövskog']) ||
    'NULL'
  const youngRef =
    pickColumnRef('m', schema.speciesColumns, ['11-20_år', '11-20 år']) ||
    'NULL'
  const earlyRef =
    pickColumnRef('m', schema.speciesColumns, ['1-40_år', '1-40 år']) ||
    'NULL'
  const middleRef =
    pickColumnRef('m', schema.speciesColumns, ['41-90_år', '41-90 år']) ||
    'NULL'
  const oldRef =
    pickColumnRef('m', schema.speciesColumns, ['91_år_och_äldre', '91 år och äldre']) ||
    'NULL'
  const bredbladigtRef =
    pickColumnRef('m', schema.speciesColumns, ['bredbladigt_gräs', 'bredbladigt gräs']) ||
    'NULL'
  const smalbladigtRef =
    pickColumnRef('m', schema.speciesColumns, ['smalbladigt_gräs', 'smalbladigt gräs']) ||
    'NULL'
  const krakbarRef =
    pickColumnRef('m', schema.speciesColumns, ['kråkbär_ljung', 'kråkbär ljung']) ||
    'NULL'

  const manifestPath = path.join(__dirname, '../public/imagemanifest/manifest.json')
  const outputDir = path.join(__dirname, '../public/species')
  const outputPath = path.join(outputDir, 'all-species.json')
  const metaOutputPath = path.join(outputDir, 'all-species-meta.json')
  const ednaDetailsOutputPath = path.join(outputDir, 'edna-species-details.json')

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))

  const speciesRows = await db.all(`
    SELECT
      m.taxon,
      ${antalObsarRef} AS "Antal obsar",
      m.Giftsvamp,
      ${rankRedRef} AS "Rank rödlist o signal",
      ${rankMatsvampRef} AS "Rank matsvamp",
      ${rankGiftsvampRef} AS "Rank giftsvamp",
      m.Scientificname,
      m.Commonname,
      m.Nyttartnamn,
      m.Släkte,
      m.högrenivå,
      COALESCE(${artfaktaRef}, 'Information saknas') AS Artfakta,
      ${artfakta2025Ref} AS Artfakta_2025,
      COALESCE(${rlRef}, '0') AS RL2020kat,
      ${rl2025Ref} AS RL2025kat,
      ${nya2025Ref} AS nya_2025,
      m.RL2020krit,
      m.RLochS,
      ${kriteriedokumentationRef} AS Kriteriedokumentation,
      ${ekologiRef} AS ekologi,
      m."Svamp-grupp",
      m."Svamp-Undersvamp-grupp",
      m.SIGNAL_art,
      m.Svampguiden,
      m.SKR_rek_matsvamp_2026,
      ${godMatsvampRef} AS "God matsvamp",
      m.NOTE,
      ${vedOchBarkRef} AS "Värdtaxa:Vedochbark",
      ${finaRotterRef} AS "Värdtaxa:Finarerötterochrottrådar",
      ${norrRef} AS "Norra Sverige",
      ${soderRef} AS "Södra Sverige",
      m.OVANLIGHET,
      m.KALKmark,
      m.ANNANmark,
      m.Gran,
      m.Tall,
      ${barrRef} AS "Blandad barrskog",
      ${lovRef} AS "Blandad lövskog",
      m.Lövskog,
      m.EkochBokskog,
      m.Naturbete,
      ${youngRef} AS "11-20 år",
      ${earlyRef} AS "1-40 år",
      ${middleRef} AS "41-90 år",
      ${oldRef} AS "91 år och äldre",
      m."ÖRTER_grupp",
      m."BLÅBÄR_grupp",
      m."LINGON_grupp",
      m.OKLART,
      m.högört,
      m.lågört,
      ${bredbladigtRef} AS "bredbladigt gräs",
      ${smalbladigtRef} AS "smalbladigt gräs",
      m.blåbär,
      m.lingon,
      ${krakbarRef} AS "kråkbär ljung",
      s.Fylum,
      s.Klass,
      s.Ordning,
      s.Familj
    FROM ${speciesTable} m
    LEFT JOIN "se_svampen_oktober_18" s
      ON TRIM(m.Scientificname) = TRIM(s.Scientificname)
    ORDER BY COALESCE(m.Commonname, m.Nyttartnamn, m.Släkte, m.högrenivå, m.Scientificname) COLLATE NOCASE
  `)

  const taxonomyByGenus = new Map()

  for (const row of speciesRows) {
    const scientificName = repairScientificName(row.Scientificname)
    const scientificGenus = getScientificGenus(scientificName)
    if (!scientificGenus || !row.Fylum || !row.Klass || !row.Ordning || !row.Familj) {
      continue
    }

    if (!taxonomyByGenus.has(scientificGenus)) {
      taxonomyByGenus.set(scientificGenus, {
        Fylum: row.Fylum,
        Klass: row.Klass,
        Ordning: row.Ordning,
        Familj: row.Familj
      })
    }
  }

  const distributionRows = await db.all(`
    SELECT
      ms.Scientificname AS Scientificname,
      m.Marktyp AS Marktyp,
      m.H_form AS H_form,
      m.Bestandsalder AS Bestandsalder,
      m.Fältskikt AS "Fältskikt",
      1 AS plot_count
    FROM ${speciesTable} ms
    LEFT JOIN Species_database sd
      ON TRIM(REPLACE(sd.Taxon, '(coll.)', '')) = ms.Scientificname
    LEFT JOIN Melted_counts_vs_samples_ECM mcv
      ON mcv.SpeciesCode = sd."ID#"
    LEFT JOIN Metadata m
      ON mcv.GropInventeringID = m.GropInventeringID
    WHERE mcv.GropInventeringID IS NOT NULL
    GROUP BY
      ms.Scientificname,
      m.Marktyp,
      m.H_form,
      m.Bestandsalder,
      m.Fältskikt
  `)

  const metadataDistributionRows = await db.all(`
    SELECT
      m.GropInventeringID AS plot_id,
      m.Marktyp AS Marktyp,
      m.H_form AS H_form,
      m.Bestandsalder AS Bestandsalder,
      m.Fältskikt AS "Fältskikt"
    FROM Metadata m
    WHERE m.GropInventeringID IS NOT NULL
  `)

  const ednaDistributionRows = await db.all(`
    SELECT
      sd."ID#" AS SpeciesCode,
      sd.Taxon_sp AS Scientificname,
      sd.Genus AS Genus,
      sd.Family AS Family,
      sd."Order" AS "OrderName",
      sd.Class AS "ClassName",
      sd.Division AS Division,
      m.Marktyp AS Marktyp,
      m.H_form AS H_form,
      m.Bestandsalder AS Bestandsalder,
      m.Fältskikt AS "Fältskikt",
      COUNT(DISTINCT mcv.GropInventeringID) AS plot_count
    FROM Species_database sd
    INNER JOIN Melted_counts_vs_samples_ECM mcv
      ON mcv.SpeciesCode = sd."ID#"
    INNER JOIN Metadata m
      ON m.GropInventeringID = mcv.GropInventeringID
    GROUP BY
      sd."ID#",
      sd.Taxon_sp,
      sd.Genus,
      sd.Family,
      sd."Order",
      sd.Class,
      sd.Division,
      mcv.GropInventeringID
  `)

  const environmentRows = await db.all(`
    SELECT
      ms.Scientificname AS Scientificname,
      m.lat AS lat,
      m.Marktyp AS Marktyp,
      m.H_form AS H_form,
      m.Bestandsalder AS Bestandsalder,
      m.Fältskikt AS "Fältskikt",
      COUNT(DISTINCT mcv.GropInventeringID) AS plot_count
    FROM ${speciesTable} ms
    LEFT JOIN Species_database sd
      ON TRIM(REPLACE(sd.Taxon, '(coll.)', '')) = ms.Scientificname
    LEFT JOIN Melted_counts_vs_samples_ECM mcv
      ON mcv.SpeciesCode = sd."ID#"
    LEFT JOIN Metadata m
      ON mcv.GropInventeringID = m.GropInventeringID
    WHERE mcv.GropInventeringID IS NOT NULL
    GROUP BY
      ms.Scientificname,
      m.lat,
      m.Marktyp,
      m.H_form,
      m.Bestandsalder,
      m.Fältskikt
  `)

  const distributionsBySpecies = new Map()
  const ednaDetailsBySpeciesCode = {}
  const environmentsBySpecies = new Map()
  const globalDistribution = {
    forestTypePlotCounts: createCountMap(Object.values(FOREST_TYPE_LABELS)),
    standAgePlotCounts: createCountMap(Object.values(AGE_GROUP_LABELS)),
    vegetationPlotCounts: createCountMap(Object.values(VEGETATION_GROUP_LABELS)),
    totalPlotCount: 0
  }

  for (const row of distributionRows) {
    const scientificName = repairScientificName(row.Scientificname)
    if (!distributionsBySpecies.has(scientificName)) {
      distributionsBySpecies.set(scientificName, {
        forestTypePlotCounts: createCountMap(Object.values(FOREST_TYPE_LABELS)),
        standAgePlotCounts: createCountMap(Object.values(AGE_GROUP_LABELS)),
        vegetationPlotCounts: createCountMap(Object.values(VEGETATION_GROUP_LABELS)),
        totalPlotCount: 0
      })
    }

    const current = distributionsBySpecies.get(scientificName)
    const plotCount = Number(row.plot_count) || 0
    current.totalPlotCount += plotCount

    const forestType = normalizeForestType(row.Marktyp, row.H_form)
    if (forestType) {
      current.forestTypePlotCounts[forestType] += plotCount
    }

    const ageGroup = normalizeAgeGroup(row.Bestandsalder)
    if (ageGroup) {
      current.standAgePlotCounts[AGE_GROUP_LABELS[ageGroup]] += plotCount
    }

    const vegetationGroup = normalizeVegetationGroup(row['Fältskikt'])
    if (vegetationGroup && current.vegetationPlotCounts[vegetationGroup] !== undefined) {
      current.vegetationPlotCounts[vegetationGroup] += plotCount
    }
  }

  for (const row of ednaDistributionRows) {
    if (!ednaDetailsBySpeciesCode[row.SpeciesCode]) {
      ednaDetailsBySpeciesCode[row.SpeciesCode] = {
        Scientificname: row.Scientificname,
        Fylum: row.Division || null,
        Klass: row.ClassName || null,
        Ordning: row.OrderName || null,
        Familj: row.Family || null,
        Släkte: row.Genus || null,
        total_plot_count: 0,
        forest_type_plot_counts: createCountMap(Object.values(FOREST_TYPE_LABELS)),
        stand_age_plot_counts: createCountMap(Object.values(AGE_GROUP_LABELS)),
        vegetation_plot_counts: createCountMap(Object.values(VEGETATION_GROUP_LABELS))
      }
    }

    const details = ednaDetailsBySpeciesCode[row.SpeciesCode]
    const plotCount = Number(row.plot_count) || 0
    details.total_plot_count += plotCount

    const forestType = normalizeForestType(row.Marktyp, row.H_form)
    if (forestType) details.forest_type_plot_counts[forestType] += plotCount

    const ageGroup = normalizeAgeGroup(row.Bestandsalder)
    if (ageGroup) details.stand_age_plot_counts[AGE_GROUP_LABELS[ageGroup]] += plotCount

    const vegetationGroup = normalizeVegetationGroup(row['Fältskikt'])
    if (vegetationGroup) details.vegetation_plot_counts[vegetationGroup] += plotCount
  }

  for (const row of metadataDistributionRows) {
    globalDistribution.totalPlotCount += 1

    const forestType = normalizeForestType(row.Marktyp, row.H_form)
    if (forestType) {
      globalDistribution.forestTypePlotCounts[forestType] += 1
    }

    const ageGroup = normalizeAgeGroup(row.Bestandsalder)
    if (ageGroup) {
      globalDistribution.standAgePlotCounts[AGE_GROUP_LABELS[ageGroup]] += 1
    }

    const vegetationGroup = normalizeVegetationGroup(row['Fältskikt'])
    if (vegetationGroup && globalDistribution.vegetationPlotCounts[vegetationGroup] !== undefined) {
      globalDistribution.vegetationPlotCounts[vegetationGroup] += 1
    }
  }

  for (const row of environmentRows) {
    const scientificName = repairScientificName(row.Scientificname)
    const geography = normalizeGeography(row.lat)
    const forestType = normalizeForestType(row.Marktyp, row.H_form)
    const standAge = normalizeEnvironmentAgeGroup(row.Bestandsalder)
    const vegetationType = (() => {
      if (['Högört', 'Lågört', 'Bredblad gräs'].includes(row['Fältskikt'])) return 'Örter_grupp'
      if (['Blåbär', 'Smalblad gräs'].includes(row['Fältskikt'])) return 'Blåbär_grupp'
      if (['Lingon', 'Kråkbär/Ljung', 'Fattigris'].includes(row['Fältskikt'])) return 'Lingon_grupp'
      return null
    })()

    if (!geography || !forestType || !standAge || !vegetationType) {
      continue
    }

    if (!environmentsBySpecies.has(scientificName)) {
      environmentsBySpecies.set(scientificName, new Map())
    }

    const environmentKey = `${geography}|${forestType}|${standAge}|${vegetationType}`
    const speciesEnvironments = environmentsBySpecies.get(scientificName)
    const current = speciesEnvironments.get(environmentKey) || {
      geography,
      forestType,
      standAge,
      vegetationType,
      plotCount: 0
    }

    current.plotCount += Number(row.plot_count) || 0
    speciesEnvironments.set(environmentKey, current)
  }

  const enrichedSpecies = await Promise.all(
    speciesRows.map(async (row) => {
      const repairedScientificName = repairScientificName(row.Scientificname)
      const commonName =
        row.Commonname ||
        row.Nyttartnamn ||
        row.Släkte ||
        row.högrenivå ||
        'Saknar svenskt namn'

      const cleanedTaxon = cleanTaxon(repairedScientificName)
      const scientificGenus = getScientificGenus(repairedScientificName)
      const genusTaxonomy = scientificGenus ? taxonomyByGenus.get(scientificGenus) : null
      const svampGruppSlakte = genusToSvampGrupp[row.Släkte] || taxonToSvampGrupp[cleanedTaxon] || 'Saknas'
      const images = await computeImages(repairedScientificName, manifest)
      const environments = Array.from((environmentsBySpecies.get(repairedScientificName) || new Map()).values())
        .sort((a, b) => b.plotCount - a.plotCount)
      const distribution = distributionsBySpecies.get(repairedScientificName) || {
        forestTypePlotCounts: createCountMap(Object.values(FOREST_TYPE_LABELS)),
        standAgePlotCounts: createCountMap(Object.values(AGE_GROUP_LABELS)),
        vegetationPlotCounts: createCountMap(Object.values(VEGETATION_GROUP_LABELS)),
        totalPlotCount: 0
      }

      return {
        ...row,
        Scientificname: repairedScientificName,
        Commonname: commonName,
        SvensktSläkte: row.Släkte || null,
        Släkte: scientificGenus,
        Fylum: row.Fylum || genusTaxonomy?.Fylum || null,
        Klass: row.Klass || genusTaxonomy?.Klass || null,
        Ordning: row.Ordning || genusTaxonomy?.Ordning || null,
        Familj: row.Familj || genusTaxonomy?.Familj || null,
        'Svamp-grupp-släkte': svampGruppSlakte,
        synlighet: genusToSynlighet[row.Släkte] ?? null,
        images,
        total_plot_count: distribution.totalPlotCount,
        forest_type_plot_counts: distribution.forestTypePlotCounts,
        stand_age_plot_counts: distribution.standAgePlotCounts,
        vegetation_plot_counts: distribution.vegetationPlotCounts,
        environment_occurrences: environments
      }
    })
  )

  fs.mkdirSync(outputDir, { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(enrichedSpecies, null, 2))
  fs.writeFileSync(metaOutputPath, JSON.stringify({
    total_plot_count: globalDistribution.totalPlotCount,
    forest_type_plot_counts: globalDistribution.forestTypePlotCounts,
    stand_age_plot_counts: globalDistribution.standAgePlotCounts,
    vegetation_plot_counts: globalDistribution.vegetationPlotCounts
  }, null, 2))
  fs.writeFileSync(ednaDetailsOutputPath, JSON.stringify(ednaDetailsBySpeciesCode, null, 2))

  await db.close()

  console.log(`Wrote ${enrichedSpecies.length} species to ${outputPath}`)
  console.log(`Wrote meta to ${metaOutputPath}`)
  console.log(`Wrote ${Object.keys(ednaDetailsBySpeciesCode).length} eDNA species details to ${ednaDetailsOutputPath}`)
}

buildAllSpeciesJson().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
