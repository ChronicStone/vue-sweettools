import { createApp } from "vue";
import App from "./App.vue";
import "virtual:windi.css";
import "@chronicstone/vue-sweetforms/dist/style.css";

import Plugin from "./index";

createApp(App)
  .use(Plugin, {
    isDark: true,
    themeOverrides: {
      common: {
        primaryColor: "#f7382a",
        infoColor: "#f7382a",
      },
    },
  })
  .mount("#app");
