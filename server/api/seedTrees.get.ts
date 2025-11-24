import { promises as fs } from 'node:fs';
import { join } from 'node:path';

export default defineEventHandler(async () => {
  const storage = useStorage('assets:storage');
  const publicPaths = [
    join(process.cwd(), 'public', 'seedTrees.json'),
    join(process.cwd(), 'public', 'overlays', 'seedTrees.json'),
  ];

  const tryParse = async (rawLoader: () => Promise<string | Buffer | null>) => {
    try {
      const raw = await rawLoader();
      if (!raw) return null;
      const text = typeof raw === 'string' ? raw : raw.toString('utf8');
      return JSON.parse(text);
    } catch {
      return null;
    }
  };

  for (const path of publicPaths) {
    const fileData = await tryParse(() => fs.readFile(path, 'utf8'));
    if (fileData) return fileData;
  }

  const storageData = await tryParse(() => storage.getItemRaw('seedTrees.json'));
  if (storageData) return storageData;

  return { trees: [] };
});
