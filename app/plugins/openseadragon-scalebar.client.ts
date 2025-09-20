import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async (nuxtApp) => {
  // Dynamically import so OpenSeadragon hits window before the scalebar plugin runs
  const { default: OpenSeadragon } = await import('openseadragon')

  if (!(window as any).OpenSeadragon) {
    ;(window as any).OpenSeadragon = OpenSeadragon
  }

  await import('~/assets/js/openseadragon-scalebar.js')

  nuxtApp.provide('osd', OpenSeadragon)
})
