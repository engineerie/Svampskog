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
  

  content: {
    preview: {
      api: 'https://api.nuxt.studio'
    }
  },

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  ui: {
    theme: {
      colors: ['primary', 'secondary', 'tertiary', 'poison', 'signal', 'info', 'success', 'warning', 'error', 'kalkmark', 'vanligmark'],
      transitions: true
    }
  },

  // routeRules: {
  //   "/docs": { redirect: "/docs/guide", prerender: false },
  // },

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
