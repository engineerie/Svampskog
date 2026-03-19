import { createError, defineEventHandler, readBody, setHeader } from 'h3'
import { createSpeciesListPdfHtml } from '../utils/speciesListPdfTemplate'

const loadPlaywright = async () => {
  const dynamicImport = new Function('specifier', 'return import(specifier)') as (specifier: string) => Promise<any>
  return dynamicImport('playwright')
}

export default defineEventHandler(async (event) => {
  const payload = await readBody(event)
  if (!payload || typeof payload !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }

  const html = createSpeciesListPdfHtml(payload as any)

  let playwrightModule
  try {
    playwrightModule = await loadPlaywright()
  } catch {
    throw createError({
      statusCode: 501,
      statusMessage: 'Playwright is not installed. Install `playwright` to enable PDF export.'
    })
  }

  const browser = await playwrightModule.chromium.launch({ headless: true })
  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle' })
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '12mm', right: '10mm', bottom: '12mm', left: '10mm' }
    })

    setHeader(event, 'Content-Type', 'application/pdf')
    setHeader(event, 'Content-Disposition', 'attachment; filename="species-report.pdf"')
    return pdfBuffer
  } finally {
    await browser.close()
  }
})
