// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/ui-pro",
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/image",
    "@vueuse/nuxt",
    "nuxt-og-image",
    "@pinia/nuxt",
  ],
  icon: {
    clientBundle: {
      icons: ["lineicons:mushroom-1"],
      scan: true,
      includeCustomCollections: true,
    },
  },

  content: {
    preview: {
      api: "https://api.nuxt.studio",
    },
  },

  vite: {
    server: {
      cors: true,
    },
  },

  devtools: {
    enabled: false,
  },

  css: ["~/assets/css/main.css"],

  ui: {
    colorMode: false,
    theme: {
      colors: [
        "primary",
        "secondary",
        "tertiary",
        "rodeodust",
        "poison",
        "signal",
        "info",
        "success",
        "warning",
        "error",
        "kalkmark",
        "vanligmark",
        "time",
      ],
      transitions: true,
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2024-07-11",

  nitro: {
    prerender: {
      routes: ["/", "/docs", "/info"],
      crawlLinks: true,
    },
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
});
