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
      api: "https://api.nuxt.studio",
    },
  },

  vite: {
    server: {
      cors: true
    }
  },

  devtools: {
    enabled: false,
  },

  css: ["~/assets/css/main.css"],

  ui: {
    theme: {
      colors: [
        "primary",
        "secondary",
        "tertiary",
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

  routeRules: {
    // "/docs": { redirect: "/docs/guide", prerender: false },
    // '/images/**': {
    //   headers: {
    //     'Access-Control-Allow-Origin': '*'
    //   }
    // },
    // '/*': { cors: true, headers: { 'access-control-allow-methods': 'GET' } },
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
    // routeRules: {
    //   '/images/**': {
    //     headers: {
    //       'Access-Control-Allow-Origin': '*'
    //     }
    //   }
    // },
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
