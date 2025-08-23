import { promises as fs } from 'fs';
import { resolve } from 'path';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async () => {
  const file = resolve(process.cwd(), 'storage', 'kanteffekt.json');
  try {
    return JSON.parse(await fs.readFile(file, 'utf-8'));
  } catch {
    return { features: [] };
  }
});