export function quoteIdentifier(value) {
  return `"${String(value).replace(/"/g, '""')}"`
}

function buildColumnSet(rows) {
  return new Set(rows.map((row) => row.name))
}

function findFirst(columns, candidates) {
  return candidates.find((candidate) => columns.has(candidate)) || null
}

export function pickColumnRef(alias, columns, candidates) {
  const column = findFirst(columns, candidates)
  return column ? `${alias}.${quoteIdentifier(column)}` : null
}

export async function resolveSpeciesSourceSchema(db) {
  const tables = await db.all(`SELECT name FROM sqlite_master WHERE type = 'table'`)
  const tableNames = tables.map((row) => row.name)
  const speciesTableCandidates = [
    'Mat_Naturvard_Gift_28_jul_2026',
    'Mat_Naturvard_Gift_29_jun_2026',
    'Mat_Naturvård_Gift_Maj_2026',
    'Mat_Naturvård_Gift_Jan_3',
  ].filter((name) => tableNames.includes(name))

  let speciesTable = null
  for (const candidate of speciesTableCandidates) {
    const [{ count }] = await db.all(
      `SELECT COUNT(*) AS count FROM ${quoteIdentifier(candidate)}`,
    )
    if (Number(count) > 0) {
      speciesTable = candidate
      break
    }
  }

  if (!speciesTable) {
    speciesTable = speciesTableCandidates[0] || null
  }

  if (!speciesTable) {
    throw new Error('No supported Mat_Naturvård table found in EDNAData.db')
  }

  const speciesColumns = buildColumnSet(
    await db.all(`PRAGMA table_info(${quoteIdentifier(speciesTable)})`),
  )

  return {
    speciesTable,
    speciesColumns,
  }
}
