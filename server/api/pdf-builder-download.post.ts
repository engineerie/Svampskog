import { createError, defineEventHandler, readBody, setHeader } from 'h3'

const loadPlaywright = async () => {
  const dynamicImport = new Function('specifier', 'return import(specifier)') as (specifier: string) => Promise<any>
  return dynamicImport('playwright')
}

export default defineEventHandler(async (event) => {
  const payload = await readBody(event)

  if (!payload || typeof payload !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }

  const html = typeof payload.html === 'string' ? payload.html : ''
  if (!html.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Missing HTML content' })
  }

  const filenameBase = typeof payload.filename === 'string' && payload.filename.trim().length
    ? payload.filename.trim()
    : 'artrapport'

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
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
    })

    setHeader(event, 'Content-Type', 'application/pdf')
    setHeader(event, 'Content-Disposition', `attachment; filename="${filenameBase.replace(/[^a-zA-Z0-9-_]/g, '_')}.pdf"`)
    return pdfBuffer
  } finally {
    await browser.close()
  }
})
