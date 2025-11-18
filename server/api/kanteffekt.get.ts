export default defineEventHandler(async () => {
  const storage = useStorage('assets:storage');
  const raw = await storage.getItemRaw('kanteffekt.json');
  if (!raw) {
    return { features: [] };
  }
  try {
    return JSON.parse(raw.toString('utf8'));
  } catch {
    return { features: [] };
  }
});
