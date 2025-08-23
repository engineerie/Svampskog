// server/api/savedclicks.get.ts
import { promises as fs } from 'fs'
import { resolve } from 'path'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  const storageDir = resolve(process.cwd(), 'storage')
  const filePath = resolve(storageDir, 'savedclicks.json')
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    const data = JSON.parse(raw)
    return Array.isArray(data?.clicks) ? data : { clicks: [] }
  } catch {
    return { clicks: [] }
  }
})