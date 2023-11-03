// vite.config.ts
import { defineConfig } from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import WindiCSS from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/vite-plugin-windicss/dist/index.mjs";
import Icons from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/unplugin-icons/dist/vite.mjs";
import IconsResolver from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/unplugin-icons/dist/resolver.mjs";
import Components from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/unplugin-vue-components/dist/vite.mjs";
import vueJsx from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import PurgeIcons from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/vite-plugin-purge-icons/dist/index.mjs";
import VueTypeImports from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/vite-plugin-vue-type-imports/dist/index.mjs";
import Pages from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/vite-plugin-pages/dist/index.mjs";
import dts from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/vite-plugin-dts/dist/index.mjs";
import AutoImports from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/unplugin-auto-import/dist/vite.js";
import { NaiveUiResolver } from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/unplugin-vue-components/dist/resolvers.mjs";
var __vite_injected_original_dirname = "/Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable";
var vite_config_default = defineConfig({
  plugins: [
    // VueDevtools(),
    vue({ reactivityTransform: true }),
    VueTypeImports(),
    WindiCSS(),
    AutoImports({
      imports: [
        "vue",
        "vue-router",
        "vue-i18n",
        "@vueuse/head",
        "@vueuse/core"
      ],
      dts: "src/auto-imports.d.ts",
      dirs: [
        "src/composables",
        "src/composables/**",
        "src/libs",
        "src/utils",
        "src/utils/**",
        "src/utils/*",
        "src/config",
        "src/samples"
      ],
      vueTemplate: true
    }),
    Components({
      dts: true,
      resolvers: [IconsResolver({ componentPrefix: "" }), NaiveUiResolver()],
      dirs: ["src/components"]
    }),
    PurgeIcons(),
    Icons({ autoInstall: true }),
    vueJsx(),
    dts(),
    Pages()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  server: {
    fs: {
      allow: [".."]
    }
  },
  optimizeDeps: {
    include: [
      "@ag-grid-community/core",
      "@chronicstone/vue-testid",
      "@vuelidate/core",
      "@vuelidate/validators",
      "@vueuse/components",
      "@vueuse/core",
      "ag-grid-community",
      "ag-grid-vue3",
      "axios",
      "deepmerge-ts",
      "json-as-xlsx",
      "maska",
      "naive-ui",
      "tinycolor2",
      "util",
      "xlsx"
    ]
  },
  build: {
    lib: {
      entry: path.resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "VueSweetTools",
      fileName: (format) => `vue-sweettools.${format}.js`
    },
    rollupOptions: {
      external: ["vue", "naive-ui"],
      output: {
        globals: {
          vue: "Vue"
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvY3lwcmllbnRoYW8vRG9jdW1lbnRzL0RFVi9PUkdBTklaQVRJT05TL1ZURVNUL0xBQlMvdnVlMy1hZHZhbmNlZC1kYXRhdGFibGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9jeXByaWVudGhhby9Eb2N1bWVudHMvREVWL09SR0FOSVpBVElPTlMvVlRFU1QvTEFCUy92dWUzLWFkdmFuY2VkLWRhdGF0YWJsZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvY3lwcmllbnRoYW8vRG9jdW1lbnRzL0RFVi9PUkdBTklaQVRJT05TL1ZURVNUL0xBQlMvdnVlMy1hZHZhbmNlZC1kYXRhdGFibGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IFdpbmRpQ1NTIGZyb20gXCJ2aXRlLXBsdWdpbi13aW5kaWNzc1wiO1xuaW1wb3J0IEljb25zIGZyb20gXCJ1bnBsdWdpbi1pY29ucy92aXRlXCI7XG5pbXBvcnQgSWNvbnNSZXNvbHZlciBmcm9tIFwidW5wbHVnaW4taWNvbnMvcmVzb2x2ZXJcIjtcbmltcG9ydCBDb21wb25lbnRzIGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlXCI7XG5pbXBvcnQgdnVlSnN4IGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWUtanN4XCI7XG5pbXBvcnQgUHVyZ2VJY29ucyBmcm9tIFwidml0ZS1wbHVnaW4tcHVyZ2UtaWNvbnNcIjtcbmltcG9ydCBWdWVUeXBlSW1wb3J0cyBmcm9tIFwidml0ZS1wbHVnaW4tdnVlLXR5cGUtaW1wb3J0c1wiO1xuaW1wb3J0IFBhZ2VzIGZyb20gXCJ2aXRlLXBsdWdpbi1wYWdlc1wiO1xuaW1wb3J0IGR0cyBmcm9tIFwidml0ZS1wbHVnaW4tZHRzXCI7XG5pbXBvcnQgQXV0b0ltcG9ydHMgZnJvbSBcInVucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGVcIjtcbmltcG9ydCB7IE5haXZlVWlSZXNvbHZlciB9IGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnNcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICAvLyBWdWVEZXZ0b29scygpLFxuICAgIHZ1ZSh7IHJlYWN0aXZpdHlUcmFuc2Zvcm06IHRydWUgfSksXG4gICAgVnVlVHlwZUltcG9ydHMoKSxcbiAgICBXaW5kaUNTUygpLFxuICAgIEF1dG9JbXBvcnRzKHtcbiAgICAgIGltcG9ydHM6IFtcbiAgICAgICAgXCJ2dWVcIixcbiAgICAgICAgXCJ2dWUtcm91dGVyXCIsXG4gICAgICAgIFwidnVlLWkxOG5cIixcbiAgICAgICAgXCJAdnVldXNlL2hlYWRcIixcbiAgICAgICAgXCJAdnVldXNlL2NvcmVcIixcbiAgICAgIF0sXG4gICAgICBkdHM6IFwic3JjL2F1dG8taW1wb3J0cy5kLnRzXCIsXG4gICAgICBkaXJzOiBbXG4gICAgICAgIFwic3JjL2NvbXBvc2FibGVzXCIsXG4gICAgICAgIFwic3JjL2NvbXBvc2FibGVzLyoqXCIsXG4gICAgICAgIFwic3JjL2xpYnNcIixcbiAgICAgICAgXCJzcmMvdXRpbHNcIixcbiAgICAgICAgXCJzcmMvdXRpbHMvKipcIixcbiAgICAgICAgXCJzcmMvdXRpbHMvKlwiLFxuICAgICAgICBcInNyYy9jb25maWdcIixcbiAgICAgICAgXCJzcmMvc2FtcGxlc1wiLFxuICAgICAgXSxcbiAgICAgIHZ1ZVRlbXBsYXRlOiB0cnVlLFxuICAgIH0pLFxuICAgIENvbXBvbmVudHMoe1xuICAgICAgZHRzOiB0cnVlLFxuICAgICAgcmVzb2x2ZXJzOiBbSWNvbnNSZXNvbHZlcih7IGNvbXBvbmVudFByZWZpeDogXCJcIiB9KSwgTmFpdmVVaVJlc29sdmVyKCldLFxuICAgICAgZGlyczogW1wic3JjL2NvbXBvbmVudHNcIl0sXG4gICAgfSksXG4gICAgUHVyZ2VJY29ucygpLFxuICAgIEljb25zKHsgYXV0b0luc3RhbGw6IHRydWUgfSksXG4gICAgdnVlSnN4KCksXG4gICAgZHRzKCksXG4gICAgUGFnZXMoKSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBmczoge1xuICAgICAgYWxsb3c6IFtcIi4uXCJdLFxuICAgIH0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFtcbiAgICAgIFwiQGFnLWdyaWQtY29tbXVuaXR5L2NvcmVcIixcbiAgICAgIFwiQGNocm9uaWNzdG9uZS92dWUtdGVzdGlkXCIsXG4gICAgICBcIkB2dWVsaWRhdGUvY29yZVwiLFxuICAgICAgXCJAdnVlbGlkYXRlL3ZhbGlkYXRvcnNcIixcbiAgICAgIFwiQHZ1ZXVzZS9jb21wb25lbnRzXCIsXG4gICAgICBcIkB2dWV1c2UvY29yZVwiLFxuICAgICAgXCJhZy1ncmlkLWNvbW11bml0eVwiLFxuICAgICAgXCJhZy1ncmlkLXZ1ZTNcIixcbiAgICAgIFwiYXhpb3NcIixcbiAgICAgIFwiZGVlcG1lcmdlLXRzXCIsXG4gICAgICBcImpzb24tYXMteGxzeFwiLFxuICAgICAgXCJtYXNrYVwiLFxuICAgICAgXCJuYWl2ZS11aVwiLFxuICAgICAgXCJ0aW55Y29sb3IyXCIsXG4gICAgICBcInV0aWxcIixcbiAgICAgIFwieGxzeFwiLFxuICAgIF0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvaW5kZXgudHNcIiksXG4gICAgICBuYW1lOiBcIlZ1ZVN3ZWV0VG9vbHNcIixcbiAgICAgIGZpbGVOYW1lOiAoZm9ybWF0KSA9PiBgdnVlLXN3ZWV0dG9vbHMuJHtmb3JtYXR9LmpzYCxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGV4dGVybmFsOiBbXCJ2dWVcIiwgXCJuYWl2ZS11aVwiXSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBnbG9iYWxzOiB7XG4gICAgICAgICAgdnVlOiBcIlZ1ZVwiLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFhLFNBQVMsb0JBQW9CO0FBQ2xjLE9BQU8sU0FBUztBQUNoQixPQUFPLFVBQVU7QUFDakIsT0FBTyxjQUFjO0FBQ3JCLE9BQU8sV0FBVztBQUNsQixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLFlBQVk7QUFDbkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxvQkFBb0I7QUFDM0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sU0FBUztBQUNoQixPQUFPLGlCQUFpQjtBQUN4QixTQUFTLHVCQUF1QjtBQWJoQyxJQUFNLG1DQUFtQztBQWdCekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBO0FBQUEsSUFFUCxJQUFJLEVBQUUscUJBQXFCLEtBQUssQ0FBQztBQUFBLElBQ2pDLGVBQWU7QUFBQSxJQUNmLFNBQVM7QUFBQSxJQUNULFlBQVk7QUFBQSxNQUNWLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLEtBQUs7QUFBQSxNQUNMLE1BQU07QUFBQSxRQUNKO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLGFBQWE7QUFBQSxJQUNmLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULEtBQUs7QUFBQSxNQUNMLFdBQVcsQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLEdBQUcsQ0FBQyxHQUFHLGdCQUFnQixDQUFDO0FBQUEsTUFDckUsTUFBTSxDQUFDLGdCQUFnQjtBQUFBLElBQ3pCLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxJQUNYLE1BQU0sRUFBRSxhQUFhLEtBQUssQ0FBQztBQUFBLElBQzNCLE9BQU87QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixJQUFJO0FBQUEsTUFDRixPQUFPLENBQUMsSUFBSTtBQUFBLElBQ2Q7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTO0FBQUEsTUFDUDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsTUFDSCxPQUFPLEtBQUssUUFBUSxrQ0FBVyxjQUFjO0FBQUEsTUFDN0MsTUFBTTtBQUFBLE1BQ04sVUFBVSxDQUFDLFdBQVcsa0JBQWtCLE1BQU07QUFBQSxJQUNoRDtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLE9BQU8sVUFBVTtBQUFBLE1BQzVCLFFBQVE7QUFBQSxRQUNOLFNBQVM7QUFBQSxVQUNQLEtBQUs7QUFBQSxRQUNQO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
