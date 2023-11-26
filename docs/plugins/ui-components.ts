import { UButton } from '#components'
import { FormRenderer } from '@chronicstone/vue-sweettools'

// Expose Nuxt UI components to Nuxt Content
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('UButton', UButton)
  nuxtApp.vueApp.component('FormRenderer', FormRenderer)
})
