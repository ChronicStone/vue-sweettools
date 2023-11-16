import SweettoolsPlugin from '@chronicstone/vue-sweettools'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(SweettoolsPlugin)
})
