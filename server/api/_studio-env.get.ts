export default defineEventHandler(() => ({
  hasId: Boolean(process.env.STUDIO_GITHUB_CLIENT_ID),
  hasSecret: Boolean(process.env.STUDIO_GITHUB_CLIENT_SECRET)
}))
