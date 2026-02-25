type ReportRow = {
  commonName?: string
  scientificName?: string
  group?: string
  groupImageUrl?: string
  status?: string
  indicator?: string
  mark?: string
  probability?: string | number
  imageUrl?: string
}

type ReportSection = {
  id?: string
  title?: string
  missingData?: boolean
  rowCount?: number
  rows?: ReportRow[]
}

type SpeciesListPayload = {
  documentTitle?: string
  generatedAt?: string
  searchTerm?: string
  environment?: {
    geography?: string
    forestType?: string
    standAge?: string
    vegetationType?: string
  }
  sections?: ReportSection[]
}

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&#39;')

const formatDateTime = (isoDate?: string) => {
  if (!isoDate) return ''
  const parsed = new Date(isoDate)
  if (Number.isNaN(parsed.getTime())) return ''
  return new Intl.DateTimeFormat('sv-SE', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(parsed)
}

const toSpeciesCards = (rows: ReportRow[] = []) => rows.map((row, index) => `
  <article class="species-card">
    <div class="species-media">
      ${row.imageUrl
        ? `<img src="${escapeHtml(row.imageUrl)}" alt="${escapeHtml(row.commonName || row.scientificName || 'Artbild')}" class="species-image" />`
        : '<div class="species-image species-image-placeholder">Ingen bild</div>'}
    </div>
    <div class="species-content">
      <div class="species-index">#${index + 1}</div>
      <h1 class="species-name">${escapeHtml(row.commonName || 'Okänt namn')}</h1>
      <p class="species-scientific"><em>${escapeHtml(row.scientificName)}</em></p>
      <div class="species-group">
        ${row.groupImageUrl
          ? `<img src="${escapeHtml(row.groupImageUrl)}" alt="${escapeHtml(row.group || 'Grupp')}" class="group-icon" />`
          : ''}
        <span>${escapeHtml(row.group || 'Okänd grupp')}</span>
      </div>
      <div class="species-meta">
        ${row.status ? `<span class="meta-pill">Status: ${escapeHtml(row.status)}</span>` : ''}
        ${row.indicator ? `<span class="meta-pill">Signalart</span>` : ''}
        ${row.mark ? `<span class="meta-pill">${escapeHtml(row.mark)}</span>` : ''}
        ${row.probability !== undefined && row.probability !== '' ? `<span class="meta-pill">Sannolikhet: ${escapeHtml(row.probability)}</span>` : ''}
      </div>
    </div>
  </article>
`).join('')

const toSectionHtml = (section: ReportSection) => {
  const rows = Array.isArray(section.rows) ? section.rows : []
  const rowCount = section.rowCount ?? rows.length

  return `
    <section class="section">
      <div class="section-header">
        <h2>${escapeHtml(section.title ?? 'Artlista')}</h2>
        <p>${rowCount} arter</p>
      </div>
      ${section.missingData ? '<p class="muted">Dataset saknas för vald miljö.</p>' : ''}
      <div class="species-list">
        ${toSpeciesCards(rows)}
      </div>
    </section>
  `
}

export const createSpeciesListPdfHtml = (payload: SpeciesListPayload) => {
  const sections = Array.isArray(payload.sections) ? payload.sections : []
  const generatedAt = formatDateTime(payload.generatedAt)

  return `
<!doctype html>
<html lang="sv">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(payload.documentTitle ?? 'Artrapport')}</title>
    <style>
      @page {
        size: A4;
        margin: 18mm 14mm;
      }
      * {
        box-sizing: border-box;
      }
      body {
        font-family: "Helvetica Neue", Arial, sans-serif;
        margin: 0;
        color: #1f2937;
        font-size: 11px;
        line-height: 1.35;
      }
      .cover {
        border: 1px solid #d1d5db;
        border-radius: 10px;
        padding: 18px;
        margin-bottom: 12px;
        background: linear-gradient(180deg, #f9fafb 0%, #ffffff 100%);
      }
      .cover h1 {
        font-size: 24px;
        margin: 0 0 8px;
        letter-spacing: -0.01em;
      }
      .meta {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 4px 12px;
        margin-top: 10px;
      }
      .meta b {
        color: #111827;
      }
      .section {
        margin: 14px 0 20px;
      }
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 8px;
      }
      .section-header h2 {
        font-size: 16px;
        margin: 0;
      }
      .section-header p {
        margin: 0;
        color: #6b7280;
      }
      .muted {
        color: #6b7280;
        margin: 8px 0;
      }
      .species-list {
        display: grid;
        gap: 10px;
      }
      .species-card {
        display: grid;
        grid-template-columns: 128px 1fr;
        gap: 12px;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 10px;
        background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
        break-inside: avoid;
      }
      .species-media {
        align-self: start;
      }
      .species-image {
        width: 120px;
        height: 88px;
        object-fit: cover;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
        display: block;
        background: #f3f4f6;
      }
      .species-image-placeholder {
        color: #9ca3af;
        display: grid;
        place-items: center;
        font-size: 10px;
        text-align: center;
      }
      .species-content {
        min-width: 0;
      }
      .species-index {
        color: #6b7280;
        font-size: 10px;
        margin-bottom: 2px;
      }
      .species-name {
        margin: 0;
        font-size: 18px;
        line-height: 1.1;
        letter-spacing: -0.01em;
      }
      .species-scientific {
        margin: 2px 0 8px;
        color: #4b5563;
      }
      .species-group {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 8px;
        font-size: 12px;
      }
      .group-icon {
        width: 18px;
        height: 18px;
        object-fit: contain;
      }
      .species-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .meta-pill {
        display: inline-flex;
        align-items: center;
        border: 1px solid #d1d5db;
        border-radius: 999px;
        padding: 2px 8px;
        background: #ffffff;
        color: #374151;
        font-size: 10px;
      }
    </style>
  </head>
  <body>
    <section class="cover">
      <h1>${escapeHtml(payload.documentTitle ?? 'Artrapport')}</h1>
      <p>Sammanställning av arter för vald skogsmiljö.</p>
      <div class="meta">
        <div><b>Geografi:</b> ${escapeHtml(payload.environment?.geography)}</div>
        <div><b>Skogstyp:</b> ${escapeHtml(payload.environment?.forestType)}</div>
        <div><b>Ålder:</b> ${escapeHtml(payload.environment?.standAge)}</div>
        <div><b>Vegetation:</b> ${escapeHtml(payload.environment?.vegetationType)}</div>
        <div><b>Sökterm:</b> ${escapeHtml(payload.searchTerm || 'Ingen')}</div>
        <div><b>Genererad:</b> ${escapeHtml(generatedAt)}</div>
      </div>
    </section>
    ${sections.map(toSectionHtml).join('')}
  </body>
</html>
`
}
