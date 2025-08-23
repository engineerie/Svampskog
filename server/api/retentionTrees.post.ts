import { promises as fs } from 'fs'
import { resolve } from 'path'
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async event => {
  const tree = await readBody(event)
// write to a non-public folder to avoid triggering full-page reload on file change
const storageDir = resolve(process.cwd(), 'storage')
await fs.mkdir(storageDir, { recursive: true })
const filePath = resolve(storageDir, 'retentionTrees.json')
let raw: string
try {
  raw = await fs.readFile(filePath, 'utf-8')
} catch {
  // initialize if missing
  raw = JSON.stringify({ trees: [] })
}
  const data = JSON.parse(raw)
  // Give the new tree a unique ID if none provided
  if (!tree.id) tree.id = `tree-${Date.now()}`
  data.trees.push(tree)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
  return { success: true, tree }
})