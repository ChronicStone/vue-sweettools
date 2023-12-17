// vite.config.ts
import path from "node:path";
import { defineConfig } from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/vite/dist/node/index.js";
import Vue from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import UnoCSS from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/unocss/dist/vite.mjs";
import Icons from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/unplugin-icons/dist/vite.mjs";
import IconsResolver from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/unplugin-icons/dist/resolver.mjs";
import Components from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/unplugin-vue-components/dist/vite.mjs";
import VueJsx from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import PurgeIcons from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/vite-plugin-purge-icons/dist/index.mjs";
import AutoImports from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/unplugin-auto-import/dist/vite.js";
import Dts from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/vite-plugin-dts/dist/index.mjs";
import { NaiveUiResolver } from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import VueMacros from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/unplugin-vue-macros/dist/vite.mjs";
import Checker from "file:///Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable/node_modules/vite-plugin-checker/dist/esm/main.js";
var __vite_injected_original_dirname = "/Users/cyprienthao/Documents/DEV/ORGANIZATIONS/VTEST/LABS/vue3-advanced-datatable";
var vite_config_default = defineConfig({
  plugins: [
    VueMacros({
      plugins: {
        vue: Vue(),
        vueJsx: VueJsx()
      }
    }),
    UnoCSS(),
    AutoImports({
      imports: [
        "vue",
        "vue-i18n",
        "@vueuse/core"
      ],
      dts: "auto-imports.d.ts",
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
    Checker({})
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
    },
    rollupOptions: {
      external: ["vue", "naive-ui", "date-fns"],
      output: {
        globals: {
          "vue": "Vue",
          "naive-ui": "naive-ui",
          "date-fns": "date-fns"
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvY3lwcmllbnRoYW8vRG9jdW1lbnRzL0RFVi9PUkdBTklaQVRJT05TL1ZURVNUL0xBQlMvdnVlMy1hZHZhbmNlZC1kYXRhdGFibGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9jeXByaWVudGhhby9Eb2N1bWVudHMvREVWL09SR0FOSVpBVElPTlMvVlRFU1QvTEFCUy92dWUzLWFkdmFuY2VkLWRhdGF0YWJsZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvY3lwcmllbnRoYW8vRG9jdW1lbnRzL0RFVi9PUkdBTklaQVRJT05TL1ZURVNUL0xBQlMvdnVlMy1hZHZhbmNlZC1kYXRhdGFibGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IFZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgVW5vQ1NTIGZyb20gJ3Vub2Nzcy92aXRlJ1xuaW1wb3J0IEljb25zIGZyb20gJ3VucGx1Z2luLWljb25zL3ZpdGUnXG5pbXBvcnQgSWNvbnNSZXNvbHZlciBmcm9tICd1bnBsdWdpbi1pY29ucy9yZXNvbHZlcidcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgVnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXG5pbXBvcnQgUHVyZ2VJY29ucyBmcm9tICd2aXRlLXBsdWdpbi1wdXJnZS1pY29ucydcbmltcG9ydCBBdXRvSW1wb3J0cyBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IER0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnXG5pbXBvcnQgeyBOYWl2ZVVpUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5pbXBvcnQgVnVlTWFjcm9zIGZyb20gJ3VucGx1Z2luLXZ1ZS1tYWNyb3Mvdml0ZSdcbmltcG9ydCBDaGVja2VyIGZyb20gJ3ZpdGUtcGx1Z2luLWNoZWNrZXInXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgVnVlTWFjcm9zKHtcbiAgICAgIHBsdWdpbnM6IHtcbiAgICAgICAgdnVlOiBWdWUoKSxcbiAgICAgICAgdnVlSnN4OiBWdWVKc3goKSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgVW5vQ1NTKCksXG4gICAgQXV0b0ltcG9ydHMoe1xuICAgICAgaW1wb3J0czogW1xuICAgICAgICAndnVlJyxcbiAgICAgICAgJ3Z1ZS1pMThuJyxcbiAgICAgICAgJ0B2dWV1c2UvY29yZScsXG4gICAgICBdLFxuICAgICAgZHRzOiAnYXV0by1pbXBvcnRzLmQudHMnLFxuICAgICAgdnVlVGVtcGxhdGU6IHRydWUsXG4gICAgICBkaXJzOiBbXG4gICAgICAgICdzcmMvX3NoYXJlZC9jb21wb3NhYmxlcycsXG4gICAgICAgICdzcmMvX3NoYXJlZC9jb25maWcnLFxuICAgICAgICAnc3JjL19zaGFyZWQvdXRpbHMnLFxuICAgICAgICAnc3JjL2Zvcm0vY29tcG9zYWJsZXMnLFxuICAgICAgICAnc3JjL2Zvcm0vdXRpbHMnLFxuICAgICAgICAnc3JjL2RhdGEtbGlzdC9jb21wb3NhYmxlcycsXG4gICAgICAgICdzcmMvZGF0YS1saXN0L3V0aWxzJyxcbiAgICAgICAgJ3NyYy9leGNlbC1yZWFkZXIvY29tcG9zYWJsZXMnLFxuICAgICAgICAnc3JjL2V4Y2VsLXJlYWRlci91dGlscycsXG4gICAgICBdLFxuICAgIH0pLFxuICAgIENvbXBvbmVudHMoe1xuICAgICAgZHRzOiB0cnVlLFxuICAgICAgZGlyczogW1xuICAgICAgICAnc3JjL19zaGFyZWQvY29tcG9uZW50cycsXG4gICAgICAgICdzcmMvZm9ybS9jb21wb25lbnRzJyxcbiAgICAgICAgJ3NyYy9kYXRhLWxpc3QvY29udGVudCcsXG4gICAgICAgICdzcmMvZGF0YS1saXN0L2xheW91dCcsXG4gICAgICBdLFxuICAgICAgcmVzb2x2ZXJzOiBbSWNvbnNSZXNvbHZlcih7IGNvbXBvbmVudFByZWZpeDogJycgfSksIE5haXZlVWlSZXNvbHZlcigpXSxcbiAgICAgIGRlZXA6IHRydWUsXG4gICAgfSksXG4gICAgUHVyZ2VJY29ucygpLFxuICAgIEljb25zKHsgYXV0b0luc3RhbGw6IHRydWUgfSksXG4gICAgRHRzKCksXG4gICAgQ2hlY2tlcih7fSksXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIGxpYjoge1xuICAgICAgZW50cnk6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXgudHMnKSxcbiAgICAgIG5hbWU6ICdWdWVTd2VldFRvb2xzJyxcbiAgICAgIGZpbGVOYW1lOiBmb3JtYXQgPT4gYHZ1ZS1zd2VldHRvb2xzLiR7Zm9ybWF0fS5qc2AsXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogWyd2dWUnLCAnbmFpdmUtdWknLCAnZGF0ZS1mbnMnXSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBnbG9iYWxzOiB7XG4gICAgICAgICAgJ3Z1ZSc6ICdWdWUnLFxuICAgICAgICAgICduYWl2ZS11aSc6ICduYWl2ZS11aScsXG4gICAgICAgICAgJ2RhdGUtZm5zJzogJ2RhdGUtZm5zJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFhLE9BQU8sVUFBVTtBQUN0YixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sV0FBVztBQUNsQixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLFlBQVk7QUFDbkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsdUJBQXVCO0FBQ2hDLE9BQU8sZUFBZTtBQUN0QixPQUFPLGFBQWE7QUFicEIsSUFBTSxtQ0FBbUM7QUFnQnpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLFVBQVU7QUFBQSxNQUNSLFNBQVM7QUFBQSxRQUNQLEtBQUssSUFBSTtBQUFBLFFBQ1QsUUFBUSxPQUFPO0FBQUEsTUFDakI7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELE9BQU87QUFBQSxJQUNQLFlBQVk7QUFBQSxNQUNWLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxLQUFLO0FBQUEsTUFDTCxhQUFhO0FBQUEsTUFDYixNQUFNO0FBQUEsUUFDSjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1QsS0FBSztBQUFBLE1BQ0wsTUFBTTtBQUFBLFFBQ0o7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxXQUFXLENBQUMsY0FBYyxFQUFFLGlCQUFpQixHQUFHLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQztBQUFBLE1BQ3JFLE1BQU07QUFBQSxJQUNSLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxJQUNYLE1BQU0sRUFBRSxhQUFhLEtBQUssQ0FBQztBQUFBLElBQzNCLElBQUk7QUFBQSxJQUNKLFFBQVEsQ0FBQyxDQUFDO0FBQUEsRUFDWjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsS0FBSztBQUFBLE1BQ0gsT0FBTyxLQUFLLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQzdDLE1BQU07QUFBQSxNQUNOLFVBQVUsWUFBVSxrQkFBa0IsTUFBTTtBQUFBLElBQzlDO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsT0FBTyxZQUFZLFVBQVU7QUFBQSxNQUN4QyxRQUFRO0FBQUEsUUFDTixTQUFTO0FBQUEsVUFDUCxPQUFPO0FBQUEsVUFDUCxZQUFZO0FBQUEsVUFDWixZQUFZO0FBQUEsUUFDZDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
