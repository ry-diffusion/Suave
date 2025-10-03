// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-26",
  future: {
    compatibilityVersion: 4,
  },

  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  nitro: {
    preset: "cloudflare_module",

    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },

  scripts: {
    registry: {
      rybbitAnalytics: {
        sessionReplay: true,
        trackOutbound: true,
        trackErrors: true,

        // NUXT_PUBLIC_RYBBIT_ANALYTICS_API_KEY
        apiKey: "",
        scriptInput: {
          src: "https://analytics.zesmoi.com.br/api/script.js",
        },
        siteId: "3",
      },
    },
  },

  modules: [
    "nitro-cloudflare-dev",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/ui",
    "@compodium/nuxt",
    "nuxt-auth-utils",
    "@pinia/nuxt",
    "nuxt-echarts",
    "@nuxt/scripts",
  ],
});
