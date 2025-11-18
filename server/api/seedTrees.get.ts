import { promises as fs } from 'node:fs';
import { join } from 'node:path';

export default defineEventHandler(async () => {
  const storage = useStorage('assets:storage');
  const publicPath = join(process.cwd(), 'public', 'overlays', 'seedTrees.json');

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

  const storageData = await tryParse(() => storage.getItemRaw('seedTrees.json'));
  if (storageData) return storageData;

  const fileData = await tryParse(() => fs.readFile(publicPath, 'utf8'));
  if (fileData) return fileData;

  return { trees: [] };
});
