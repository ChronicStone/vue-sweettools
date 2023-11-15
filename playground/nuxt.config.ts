// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  pages: true,
  devtools: { enabled: true },
  experimental: { typedPages: true },
  css: ['vue-sweettools/dist/style.css'],
  imports: {
    dirs: ['/samples', '/samples/**', '/config'],
  },
})
