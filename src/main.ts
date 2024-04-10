import { createApp } from 'vue'
import type { _RouterTyped } from 'unplugin-vue-router/types'
import { createRouter, createWebHistory } from 'vue-router/auto'
import App from './_play/app.vue'
import SweettoolsPlugin from '@/index'
import 'virtual:uno.css'

const router = createRouter({
  history: createWebHistory(),
})

async function bootstrap() {
  const app = createApp(App)

  app.use(router)
  app.use(SweettoolsPlugin, {
    i18n: {
      enable: true,
      dateDisplayFormat: {
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

  await router.isReady()
  app.mount('#app')
}

bootstrap()
