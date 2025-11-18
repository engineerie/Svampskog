export default defineEventHandler(async () => {
  const storage = useStorage('assets:storage');
  const raw = await storage.getItemRaw('seedTrees.json');
  if (!raw) {
    return { trees: [] };
  }
  try {
    return JSON.parse(raw.toString('utf8'));
  } catch {
    return { trees: [] };
  }
});
