import { createApp } from "vue";
import App from "./App.vue";
import "virtual:windi.css";
import "@chronicstone/vue-sweetforms/dist/style.css";

import Plugin from "./index";

import { createRouter, createWebHistory } from "vue-router";
import routes from "~pages";

const router = createRouter({
  routes,
  history: createWebHistory(),
});

async function bootstrap() {
  const app = createApp(App);

  app.use(router);
  app.use(Plugin, {
    isDark: true,
    themeOverrides: {
      common: {
        primaryColor: "#f7382a",
        infoColor: "#f7382a",
      },
    },
  });

  await router.isReady();
  app.mount("#app");
}

bootstrap();
