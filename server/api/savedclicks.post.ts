// server/api/savedClicks.post.ts
import { promises as fs } from 'fs'
import { resolve } from 'path'
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async event => {
  const click = await readBody(event)

  const storageDir = resolve(process.cwd(), 'storage')
  await fs.mkdir(storageDir, { recursive: true })
  const filePath = resolve(storageDir, 'savedclicks.json')

  let raw: string
  try {
    raw = await fs.readFile(filePath, 'utf-8')
  } catch {
    raw = JSON.stringify({ clicks: [] })
  }

  const data = JSON.parse(raw)
  if (!Array.isArray(data.clicks)) data.clicks = []

  if (!click.id) click.id = `click-${Date.now()}`
  data.clicks.push(click)

  await fs.writeFile(filePath, JSON.stringify({ clicks: data.clicks }, null, 2), 'utf-8')
  return { success: true, click }
})