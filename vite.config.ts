import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import WindiCSS from "vite-plugin-windicss";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
import PurgeIcons from "vite-plugin-purge-icons";
import VueTypeImports from "vite-plugin-vue-type-imports";
import Pages from "vite-plugin-pages";
import dts from "vite-plugin-dts";
import AutoImports from "unplugin-auto-import/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ reactivityTransform: true }),
    VueTypeImports(),
    WindiCSS(),
    AutoImports({
      imports: [
        "vue",
        "vue-router",
        "vue-i18n",
        "@vueuse/head",
        "@vueuse/core",
      ],
      dts: "src/auto-imports.d.ts",
      dirs: [
        "src/composables",
        "src/composables/**",
        "src/libs",
        "src/utils",
        "src/config",
      ],
      vueTemplate: true,
    }),
    Components({
      dts: true,
      resolvers: [IconsResolver({ componentPrefix: "" }), NaiveUiResolver()],
      dirs: ["src/components"],
    }),
    PurgeIcons(),
    Icons({ autoInstall: true }),
    vueJsx(),
    dts(),
    Pages(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "VueSweetTools",
      fileName: (format) => `vue-sweettools.${format}.js`,
    },
    rollupOptions: {
      external: ["vue", "@vueuse/core", "naive-ui"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
