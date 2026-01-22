export default defineEventHandler(() => ({
  hasId: Boolean(process.env.STUDIO_GITHUB_CLIENT_ID),
  hasSecret: Boolean(process.env.STUDIO_GITHUB_CLIENT_SECRET),
  nodeEnv: process.env.NODE_ENV || null,
  studioDisabled: process.env.NUXT_STUDIO_DISABLED || null
}))
