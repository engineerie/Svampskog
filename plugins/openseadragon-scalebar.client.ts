// plugins/openseadragon-scalebar.client.ts
import { defineNuxtPlugin } from '#app'
import OpenSeadragon from 'openseadragon'

// Expose OpenSeadragon as a global so that the scalebar script can
// augment its Viewer prototype
;(window as any).OpenSeadragon = OpenSeadragon

// Import the scalebar plugin—it will immediately augment OpenSeadragon.Viewer
import '~/assets/js/openseadragon-scalebar.js'

export default defineNuxtPlugin((nuxtApp) => {
  // Optionally inject $osd so you can access it in Vue components
  nuxtApp.provide('osd', OpenSeadragon)
})