import { fileURLToPath } from "node:url";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/ui",
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/image",
    "@vueuse/nuxt",
    "nuxt-og-image",
    "@pinia/nuxt",
    "motion-v/nuxt",
    "nuxt-studio",
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

  studio: {
    repository: {
      provider: "github",
      owner: "engineerie",
      repo: "Svampskog",
      branch: "gh-pages",
    },
  },

  vite: {
    server: {
      cors: true,
    },
    resolve: {
      alias: {
        public: fileURLToPath(new URL("./public", import.meta.url)),
      },
    },
  },

  devtools: {
    enabled: true,
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
    serverAssets: [
      {
        baseName: "storage",
        dir: "storage",
      },
    ],
    prerender: {
      routes: ["/"],
      crawlLinks: false,
    },
  },

  // eslint: {
  //   config: {
  //     stylistic: {
  //       commaDangle: "never",
  //       braceStyle: "1tbs",
  //     },
  //   },
  // },
});
