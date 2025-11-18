import { promises as fs } from 'node:fs';
import { join } from 'node:path';

export default defineEventHandler(async () => {
  const filePath = join(process.cwd(), 'public', 'overlays', 'kanteffekt.json');
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { features: [] };
  }
});
