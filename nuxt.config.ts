// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  future: {
    compatibilityVersion: 4,
  },

  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/ui",
    "@compodium/nuxt",
    "nuxt-auth-utils",
    "@pinia/nuxt",
  ],
});