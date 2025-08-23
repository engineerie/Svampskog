import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export default defineEventHandler(async () => {
  const file = join(process.cwd(), 'storage', 'seedTrees.json');
  const raw = await readFile(file, 'utf8');
  const parsed = JSON.parse(raw);
  return parsed; // { trees: [...] }
});