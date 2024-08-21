// vite.config.ts
import path from "node:path";
import { defineConfig } from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/vite/dist/node/index.js";
import Vue from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import UnoCSS from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/unocss/dist/vite.mjs";
import Icons from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/unplugin-icons/dist/vite.mjs";
import IconsResolver from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/unplugin-icons/dist/resolver.mjs";
import Components from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/unplugin-vue-components/dist/vite.js";
import VueJsx from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import PurgeIcons from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/vite-plugin-purge-icons/dist/index.mjs";
import AutoImports from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/unplugin-auto-import/dist/vite.js";
import Dts from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/vite-plugin-dts/dist/index.mjs";
import { NaiveUiResolver } from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/unplugin-vue-components/dist/resolvers.js";
import VueMacros from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/unplugin-vue-macros/dist/vite.mjs";
import Checker from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/vite-plugin-checker/dist/esm/main.js";
import { externalizeDeps } from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/vite-plugin-externalize-deps/dist/index.js";
import VueRouter from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/unplugin-vue-router/dist/vite.mjs";
var __vite_injected_original_dirname = "/Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable";
var vite_config_default = defineConfig({
  plugins: [
    // eslint-disable-next-line node/prefer-global/process
    ...process.env.NODE_ENV === "development" ? [VueRouter({
      dts: "./src/_play/typed-router.d.ts",
      routesFolder: [
        { src: "./src/_play/pages" }
      ]
    })] : [],
    VueMacros({
      plugins: {
        vue: Vue(),
        vueJsx: VueJsx()
      },
      defineProp: true,
      definePropsRefs: true
    }),
    UnoCSS(),
    AutoImports({
      imports: [
        "vue",
        "vue-i18n",
        "@vueuse/core"
      ],
      vueTemplate: true,
      dirs: [
        "src/_shared/composables",
        "src/_shared/config",
        "src/_shared/utils",
        "src/form/composables",
        "src/form/utils",
        "src/data-list/composables",
        "src/data-list/utils",
        "src/excel-reader/composables",
        "src/excel-reader/utils"
      ]
    }),
    Components({
      dts: true,
      dirs: [
        "src/_shared/components",
        "src/form/components",
        "src/data-list/content",
        "src/data-list/layout"
      ],
      resolvers: [IconsResolver({ componentPrefix: "" }), NaiveUiResolver()],
      deep: true
    }),
    PurgeIcons(),
    Icons({ autoInstall: true }),
    Dts(),
    Checker({}),
    externalizeDeps()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    lib: {
      entry: path.resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "VueSweetTools",
      fileName: (format) => `vue-sweettools.${format}.js`
    }
  },
  optimizeDeps: {
    exclude: ["fsevents", "@vue-macros/*", "unplugin-vue-define-options/macros"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvY3lwcmllbnRoYW8vRG9jdW1lbnRzL0RFVi9PUkdBTklaQVRJT05TL1ZURVNUL0xBQlMvdnVlMy1hZHZhbmNlZC1kYXRhdGFibGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9jeXByaWVudGhhby9Eb2N1bWVudHMvREVWL09SR0FOSVpBVElPTlMvVlRFU1QvTEFCUy92dWUzLWFkdmFuY2VkLWRhdGF0YWJsZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvY3lwcmllbnRoYW8vRG9jdW1lbnRzL0RFVi9PUkdBTklaQVRJT05TL1ZURVNUL0xBQlMvdnVlMy1hZHZhbmNlZC1kYXRhdGFibGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IFZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgVW5vQ1NTIGZyb20gJ3Vub2Nzcy92aXRlJ1xuaW1wb3J0IEljb25zIGZyb20gJ3VucGx1Z2luLWljb25zL3ZpdGUnXG5pbXBvcnQgSWNvbnNSZXNvbHZlciBmcm9tICd1bnBsdWdpbi1pY29ucy9yZXNvbHZlcidcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgVnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXG5pbXBvcnQgUHVyZ2VJY29ucyBmcm9tICd2aXRlLXBsdWdpbi1wdXJnZS1pY29ucydcbmltcG9ydCBBdXRvSW1wb3J0cyBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IER0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnXG5pbXBvcnQgeyBOYWl2ZVVpUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5pbXBvcnQgVnVlTWFjcm9zIGZyb20gJ3VucGx1Z2luLXZ1ZS1tYWNyb3Mvdml0ZSdcbmltcG9ydCBDaGVja2VyIGZyb20gJ3ZpdGUtcGx1Z2luLWNoZWNrZXInXG5pbXBvcnQgeyBleHRlcm5hbGl6ZURlcHMgfSBmcm9tICd2aXRlLXBsdWdpbi1leHRlcm5hbGl6ZS1kZXBzJ1xuaW1wb3J0IFZ1ZVJvdXRlciBmcm9tICd1bnBsdWdpbi12dWUtcm91dGVyL3ZpdGUnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vZGUvcHJlZmVyLWdsb2JhbC9wcm9jZXNzXG4gICAgLi4uKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnXG4gICAgICA/IFtWdWVSb3V0ZXIoe1xuICAgICAgICAgIGR0czogJy4vc3JjL19wbGF5L3R5cGVkLXJvdXRlci5kLnRzJyxcbiAgICAgICAgICByb3V0ZXNGb2xkZXI6IFtcbiAgICAgICAgICAgIHsgc3JjOiAnLi9zcmMvX3BsYXkvcGFnZXMnIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSldXG4gICAgICA6IFtdKSxcbiAgICBWdWVNYWNyb3Moe1xuICAgICAgcGx1Z2luczoge1xuICAgICAgICB2dWU6IFZ1ZSgpLFxuICAgICAgICB2dWVKc3g6IFZ1ZUpzeCgpLFxuXG4gICAgICB9LFxuICAgICAgZGVmaW5lUHJvcDogdHJ1ZSxcbiAgICAgIGRlZmluZVByb3BzUmVmczogdHJ1ZSxcbiAgICB9KSxcbiAgICBVbm9DU1MoKSxcbiAgICBBdXRvSW1wb3J0cyh7XG4gICAgICBpbXBvcnRzOiBbXG4gICAgICAgICd2dWUnLFxuICAgICAgICAndnVlLWkxOG4nLFxuICAgICAgICAnQHZ1ZXVzZS9jb3JlJyxcbiAgICAgIF0sXG4gICAgICB2dWVUZW1wbGF0ZTogdHJ1ZSxcbiAgICAgIGRpcnM6IFtcbiAgICAgICAgJ3NyYy9fc2hhcmVkL2NvbXBvc2FibGVzJyxcbiAgICAgICAgJ3NyYy9fc2hhcmVkL2NvbmZpZycsXG4gICAgICAgICdzcmMvX3NoYXJlZC91dGlscycsXG4gICAgICAgICdzcmMvZm9ybS9jb21wb3NhYmxlcycsXG4gICAgICAgICdzcmMvZm9ybS91dGlscycsXG4gICAgICAgICdzcmMvZGF0YS1saXN0L2NvbXBvc2FibGVzJyxcbiAgICAgICAgJ3NyYy9kYXRhLWxpc3QvdXRpbHMnLFxuICAgICAgICAnc3JjL2V4Y2VsLXJlYWRlci9jb21wb3NhYmxlcycsXG4gICAgICAgICdzcmMvZXhjZWwtcmVhZGVyL3V0aWxzJyxcbiAgICAgIF0sXG4gICAgfSksXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICBkdHM6IHRydWUsXG4gICAgICBkaXJzOiBbXG4gICAgICAgICdzcmMvX3NoYXJlZC9jb21wb25lbnRzJyxcbiAgICAgICAgJ3NyYy9mb3JtL2NvbXBvbmVudHMnLFxuICAgICAgICAnc3JjL2RhdGEtbGlzdC9jb250ZW50JyxcbiAgICAgICAgJ3NyYy9kYXRhLWxpc3QvbGF5b3V0JyxcbiAgICAgIF0sXG4gICAgICByZXNvbHZlcnM6IFtJY29uc1Jlc29sdmVyKHsgY29tcG9uZW50UHJlZml4OiAnJyB9KSwgTmFpdmVVaVJlc29sdmVyKCldLFxuICAgICAgZGVlcDogdHJ1ZSxcbiAgICB9KSxcbiAgICBQdXJnZUljb25zKCksXG4gICAgSWNvbnMoeyBhdXRvSW5zdGFsbDogdHJ1ZSB9KSxcbiAgICBEdHMoKSxcbiAgICBDaGVja2VyKHt9KSxcbiAgICBleHRlcm5hbGl6ZURlcHMoKSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9pbmRleC50cycpLFxuICAgICAgbmFtZTogJ1Z1ZVN3ZWV0VG9vbHMnLFxuICAgICAgZmlsZU5hbWU6IGZvcm1hdCA9PiBgdnVlLXN3ZWV0dG9vbHMuJHtmb3JtYXR9LmpzYCxcbiAgICB9LFxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbJ2ZzZXZlbnRzJywgJ0B2dWUtbWFjcm9zLyonLCAndW5wbHVnaW4tdnVlLWRlZmluZS1vcHRpb25zL21hY3JvcyddLFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcWEsT0FBTyxVQUFVO0FBQ3RiLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLFNBQVM7QUFDaEIsU0FBUyx1QkFBdUI7QUFDaEMsT0FBTyxlQUFlO0FBQ3RCLE9BQU8sYUFBYTtBQUNwQixTQUFTLHVCQUF1QjtBQUNoQyxPQUFPLGVBQWU7QUFmdEIsSUFBTSxtQ0FBbUM7QUFrQnpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQTtBQUFBLElBRVAsR0FBSSxRQUFRLElBQUksYUFBYSxnQkFDekIsQ0FBQyxVQUFVO0FBQUEsTUFDVCxLQUFLO0FBQUEsTUFDTCxjQUFjO0FBQUEsUUFDWixFQUFFLEtBQUssb0JBQW9CO0FBQUEsTUFDN0I7QUFBQSxJQUNGLENBQUMsQ0FBQyxJQUNGLENBQUM7QUFBQSxJQUNMLFVBQVU7QUFBQSxNQUNSLFNBQVM7QUFBQSxRQUNQLEtBQUssSUFBSTtBQUFBLFFBQ1QsUUFBUSxPQUFPO0FBQUEsTUFFakI7QUFBQSxNQUNBLFlBQVk7QUFBQSxNQUNaLGlCQUFpQjtBQUFBLElBQ25CLENBQUM7QUFBQSxJQUNELE9BQU87QUFBQSxJQUNQLFlBQVk7QUFBQSxNQUNWLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxhQUFhO0FBQUEsTUFDYixNQUFNO0FBQUEsUUFDSjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1QsS0FBSztBQUFBLE1BQ0wsTUFBTTtBQUFBLFFBQ0o7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxXQUFXLENBQUMsY0FBYyxFQUFFLGlCQUFpQixHQUFHLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQztBQUFBLE1BQ3JFLE1BQU07QUFBQSxJQUNSLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxJQUNYLE1BQU0sRUFBRSxhQUFhLEtBQUssQ0FBQztBQUFBLElBQzNCLElBQUk7QUFBQSxJQUNKLFFBQVEsQ0FBQyxDQUFDO0FBQUEsSUFDVixnQkFBZ0I7QUFBQSxFQUNsQjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsS0FBSztBQUFBLE1BQ0gsT0FBTyxLQUFLLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQzdDLE1BQU07QUFBQSxNQUNOLFVBQVUsWUFBVSxrQkFBa0IsTUFBTTtBQUFBLElBQzlDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLFlBQVksaUJBQWlCLG9DQUFvQztBQUFBLEVBQzdFO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
