import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './_play/app.vue'
import SweettoolsPlugin from '@/index'
import 'virtual:uno.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('./_play/pages/index.vue') },
    { path: '/datagrid', component: () => import('./_play/pages/datagrid.vue') },
    { path: '/datalist', component: () => import('./_play/pages/datalist.vue') },
    { path: '/excel', component: () => import('./_play/pages/excel.vue') },
    { path: '/form', component: () => import('./_play/pages/form.vue') },
  ],
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
