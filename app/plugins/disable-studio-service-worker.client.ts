export default defineNuxtPlugin(async () => {
  if (!import.meta.dev || !('serviceWorker' in navigator)) return

  const registrations = await navigator.serviceWorker.getRegistrations()
  const studioRegistrations = registrations.filter((registration) => {
    const scriptUrl = registration.active?.scriptURL
      || registration.waiting?.scriptURL
      || registration.installing?.scriptURL
      || ''

    return new URL(scriptUrl, window.location.origin).pathname === '/sw.js'
  })

  if (!studioRegistrations.length) return

  await Promise.all(studioRegistrations.map(registration => registration.unregister()))

  if (navigator.serviceWorker.controller && !sessionStorage.getItem('studio-sw-cleanup-reload')) {
    sessionStorage.setItem('studio-sw-cleanup-reload', 'true')
    window.location.reload()
  }
})
