import { createApp } from "vue";
import App from "./App.vue";
import "virtual:windi.css";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";

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
  app.use(Plugin);
  app.use(autoAnimatePlugin);

  await router.isReady();
  app.mount("#app");
}

bootstrap();
