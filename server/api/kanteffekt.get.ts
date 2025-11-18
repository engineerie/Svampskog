import { promises as fs } from 'node:fs';
import { join } from 'node:path';

export default defineEventHandler(async () => {
  const storage = useStorage('assets:storage');
  const publicPath = join(process.cwd(), 'public', 'overlays', 'kanteffekt.json');

  const tryParse = async (rawLoader) => {
    try {
      const raw = await rawLoader();
      return raw ? JSON.parse(typeof raw === 'string' ? raw : raw.toString('utf8')) : null;
    } catch {
      return null;
    }
  };

  const storageData = await tryParse(() => storage.getItemRaw('kanteffekt.json'));
  if (storageData) return storageData;

  const fileData = await tryParse(() => fs.readFile(publicPath, 'utf8'));
  if (fileData) return fileData;

  return { features: [] };
});
