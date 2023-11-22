import SweettoolsPlugin from '@chronicstone/vue-sweettools'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(SweettoolsPlugin, {
    i18n: {
      enabled: true,
      dateDisplayFormat: {
        fr: {
          date: 'dd MMM yyyy',
          time: 'HH:mm',
          datetime: 'dd MMM yyyy HH:mm',
          daterange: 'dd MMM yyyy',
          datetimerange: 'dd MMM yyyy HH:mm',
          month: 'MMM yyyy',
          monthrange: 'MMM yyyy',
          year: 'yyyy',
        },
        en: {
          date: 'dd MMM yyyy',
          time: 'HH:mm',
          datetime: 'dd MMM yyyy HH:mm',
          daterange: 'dd MMM yyyy',
          datetimerange: 'dd MMM yyyy HH:mm',
          month: 'MMM yyyy',
          monthrange: 'MMM yyyy',
          year: 'yyyy',
        },
      },
    },
  })
})
