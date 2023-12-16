// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  pages: true,
  devtools: { enabled: true },
  experimental: { typedPages: true },
  css: ['@chronicstone/vue-sweettools/dist/style.css'],
  imports: {
    dirs: ['/samples', '/samples/**', '/config'],
  },
  modules: ['@unocss/nuxt'],
  app: {
    head: {
      script: [
        { src: 'https://code.iconify.design/1/1.0.0/iconify.min.js' },
      ],
      meta: [
        { name: 'naive-ui-style' },
        { name: 'vueuc-style' },
      ],
    },
  },
})
