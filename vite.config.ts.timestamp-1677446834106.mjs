// vite.config.ts
import { defineConfig } from "file:///Users/cyprienthao/Documents/DEV/OSS/AsyncAPI/vue3-advanced-datatable/node_modules/.pnpm/vite@4.1.1_gyrp4zacqcjjrmgvdzgac5epyy/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/cyprienthao/Documents/DEV/OSS/AsyncAPI/vue3-advanced-datatable/node_modules/.pnpm/@vitejs+plugin-vue@4.0.0_vite@4.1.1+vue@3.2.47/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import WindiCSS from "file:///Users/cyprienthao/Documents/DEV/OSS/AsyncAPI/vue3-advanced-datatable/node_modules/.pnpm/vite-plugin-windicss@1.8.10_vite@4.1.1/node_modules/vite-plugin-windicss/dist/index.mjs";
import Icons from "file:///Users/cyprienthao/Documents/DEV/OSS/AsyncAPI/vue3-advanced-datatable/node_modules/.pnpm/unplugin-icons@0.15.2/node_modules/unplugin-icons/dist/vite.mjs";
import IconsResolver from "file:///Users/cyprienthao/Documents/DEV/OSS/AsyncAPI/vue3-advanced-datatable/node_modules/.pnpm/unplugin-icons@0.15.2/node_modules/unplugin-icons/dist/resolver.mjs";
import Components from "file:///Users/cyprienthao/Documents/DEV/OSS/AsyncAPI/vue3-advanced-datatable/node_modules/.pnpm/unplugin-vue-components@0.23.0_vue@3.2.47/node_modules/unplugin-vue-components/dist/vite.mjs";
import vueJsx from "file:///Users/cyprienthao/Documents/DEV/OSS/AsyncAPI/vue3-advanced-datatable/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.0.0_vite@4.1.1+vue@3.2.47/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import PurgeIcons from "file:///Users/cyprienthao/Documents/DEV/OSS/AsyncAPI/vue3-advanced-datatable/node_modules/.pnpm/vite-plugin-purge-icons@0.9.2_vite@4.1.1/node_modules/vite-plugin-purge-icons/dist/index.mjs";
import VueTypeImports from "file:///Users/cyprienthao/Documents/DEV/OSS/AsyncAPI/vue3-advanced-datatable/node_modules/.pnpm/vite-plugin-vue-type-imports@0.2.4_vite@4.1.1+vue@3.2.47/node_modules/vite-plugin-vue-type-imports/dist/index.mjs";
import Pages from "file:///Users/cyprienthao/Documents/DEV/OSS/AsyncAPI/vue3-advanced-datatable/node_modules/.pnpm/vite-plugin-pages@0.28.0_vite@4.1.1/node_modules/vite-plugin-pages/dist/index.mjs";
import dts from "file:///Users/cyprienthao/Documents/DEV/OSS/AsyncAPI/vue3-advanced-datatable/node_modules/.pnpm/vite-plugin-dts@1.7.2_rgy4fnry75xg7rw6lgswyd3x2m/node_modules/vite-plugin-dts/dist/index.mjs";
import AutoImports from "file:///Users/cyprienthao/Documents/DEV/OSS/AsyncAPI/vue3-advanced-datatable/node_modules/.pnpm/unplugin-auto-import@0.11.5/node_modules/unplugin-auto-import/dist/vite.js";
import { NaiveUiResolver } from "file:///Users/cyprienthao/Documents/DEV/OSS/AsyncAPI/vue3-advanced-datatable/node_modules/.pnpm/unplugin-vue-components@0.23.0_vue@3.2.47/node_modules/unplugin-vue-components/dist/resolvers.mjs";
var __vite_injected_original_dirname = "/Users/cyprienthao/Documents/DEV/OSS/AsyncAPI/vue3-advanced-datatable";
var vite_config_default = defineConfig({
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
        "@vueuse/core"
      ],
      dts: "src/auto-imports.d.ts",
      dirs: [
        "src/composables",
        "src/composables/**",
        "src/libs",
        "src/utils",
        "src/config"
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
  build: {
    lib: {
      entry: path.resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "VueSweetTools",
      fileName: (format) => `vue-sweettools.${format}.js`
    },
    rollupOptions: {
      external: [
        "vue",
        "@vueuse/core",
        "@chronicstone/vue-sweetforms",
        "naive-ui"
      ],
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvY3lwcmllbnRoYW8vRG9jdW1lbnRzL0RFVi9PU1MvQXN5bmNBUEkvdnVlMy1hZHZhbmNlZC1kYXRhdGFibGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9jeXByaWVudGhhby9Eb2N1bWVudHMvREVWL09TUy9Bc3luY0FQSS92dWUzLWFkdmFuY2VkLWRhdGF0YWJsZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvY3lwcmllbnRoYW8vRG9jdW1lbnRzL0RFVi9PU1MvQXN5bmNBUEkvdnVlMy1hZHZhbmNlZC1kYXRhdGFibGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IFdpbmRpQ1NTIGZyb20gXCJ2aXRlLXBsdWdpbi13aW5kaWNzc1wiO1xuaW1wb3J0IEljb25zIGZyb20gXCJ1bnBsdWdpbi1pY29ucy92aXRlXCI7XG5pbXBvcnQgSWNvbnNSZXNvbHZlciBmcm9tIFwidW5wbHVnaW4taWNvbnMvcmVzb2x2ZXJcIjtcbmltcG9ydCBDb21wb25lbnRzIGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlXCI7XG5pbXBvcnQgdnVlSnN4IGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWUtanN4XCI7XG5pbXBvcnQgUHVyZ2VJY29ucyBmcm9tIFwidml0ZS1wbHVnaW4tcHVyZ2UtaWNvbnNcIjtcbmltcG9ydCBWdWVUeXBlSW1wb3J0cyBmcm9tIFwidml0ZS1wbHVnaW4tdnVlLXR5cGUtaW1wb3J0c1wiO1xuaW1wb3J0IFBhZ2VzIGZyb20gXCJ2aXRlLXBsdWdpbi1wYWdlc1wiO1xuaW1wb3J0IGR0cyBmcm9tIFwidml0ZS1wbHVnaW4tZHRzXCI7XG5pbXBvcnQgQXV0b0ltcG9ydHMgZnJvbSBcInVucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGVcIjtcbmltcG9ydCB7IE5haXZlVWlSZXNvbHZlciB9IGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnNcIjtcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdnVlKHsgcmVhY3Rpdml0eVRyYW5zZm9ybTogdHJ1ZSB9KSxcbiAgICBWdWVUeXBlSW1wb3J0cygpLFxuICAgIFdpbmRpQ1NTKCksXG4gICAgQXV0b0ltcG9ydHMoe1xuICAgICAgaW1wb3J0czogW1xuICAgICAgICBcInZ1ZVwiLFxuICAgICAgICBcInZ1ZS1yb3V0ZXJcIixcbiAgICAgICAgXCJ2dWUtaTE4blwiLFxuICAgICAgICBcIkB2dWV1c2UvaGVhZFwiLFxuICAgICAgICBcIkB2dWV1c2UvY29yZVwiLFxuICAgICAgXSxcbiAgICAgIGR0czogXCJzcmMvYXV0by1pbXBvcnRzLmQudHNcIixcbiAgICAgIGRpcnM6IFtcbiAgICAgICAgXCJzcmMvY29tcG9zYWJsZXNcIixcbiAgICAgICAgXCJzcmMvY29tcG9zYWJsZXMvKipcIixcbiAgICAgICAgXCJzcmMvbGlic1wiLFxuICAgICAgICBcInNyYy91dGlsc1wiLFxuICAgICAgICBcInNyYy9jb25maWdcIixcbiAgICAgIF0sXG4gICAgICB2dWVUZW1wbGF0ZTogdHJ1ZSxcbiAgICB9KSxcbiAgICBDb21wb25lbnRzKHtcbiAgICAgIGR0czogdHJ1ZSxcbiAgICAgIHJlc29sdmVyczogW0ljb25zUmVzb2x2ZXIoeyBjb21wb25lbnRQcmVmaXg6IFwiXCIgfSksIE5haXZlVWlSZXNvbHZlcigpXSxcbiAgICAgIGRpcnM6IFtcInNyYy9jb21wb25lbnRzXCJdLFxuICAgIH0pLFxuICAgIFB1cmdlSWNvbnMoKSxcbiAgICBJY29ucyh7IGF1dG9JbnN0YWxsOiB0cnVlIH0pLFxuICAgIHZ1ZUpzeCgpLFxuICAgIGR0cygpLFxuICAgIFBhZ2VzKCksXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgZnM6IHtcbiAgICAgIGFsbG93OiBbXCIuLlwiXSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIGxpYjoge1xuICAgICAgZW50cnk6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2luZGV4LnRzXCIpLFxuICAgICAgbmFtZTogXCJWdWVTd2VldFRvb2xzXCIsXG4gICAgICBmaWxlTmFtZTogKGZvcm1hdCkgPT4gYHZ1ZS1zd2VldHRvb2xzLiR7Zm9ybWF0fS5qc2AsXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogW1xuICAgICAgICBcInZ1ZVwiLFxuICAgICAgICBcIkB2dWV1c2UvY29yZVwiLFxuICAgICAgICBcIkBjaHJvbmljc3RvbmUvdnVlLXN3ZWV0Zm9ybXNcIixcbiAgICAgICAgXCJuYWl2ZS11aVwiLFxuICAgICAgXSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBnbG9iYWxzOiB7XG4gICAgICAgICAgdnVlOiBcIlZ1ZVwiLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlZLFNBQVMsb0JBQW9CO0FBQzlaLE9BQU8sU0FBUztBQUNoQixPQUFPLFVBQVU7QUFDakIsT0FBTyxjQUFjO0FBQ3JCLE9BQU8sV0FBVztBQUNsQixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLFlBQVk7QUFDbkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxvQkFBb0I7QUFDM0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sU0FBUztBQUNoQixPQUFPLGlCQUFpQjtBQUN4QixTQUFTLHVCQUF1QjtBQWJoQyxJQUFNLG1DQUFtQztBQWV6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJLEVBQUUscUJBQXFCLEtBQUssQ0FBQztBQUFBLElBQ2pDLGVBQWU7QUFBQSxJQUNmLFNBQVM7QUFBQSxJQUNULFlBQVk7QUFBQSxNQUNWLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLEtBQUs7QUFBQSxNQUNMLE1BQU07QUFBQSxRQUNKO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLGFBQWE7QUFBQSxJQUNmLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULEtBQUs7QUFBQSxNQUNMLFdBQVcsQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLEdBQUcsQ0FBQyxHQUFHLGdCQUFnQixDQUFDO0FBQUEsTUFDckUsTUFBTSxDQUFDLGdCQUFnQjtBQUFBLElBQ3pCLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxJQUNYLE1BQU0sRUFBRSxhQUFhLEtBQUssQ0FBQztBQUFBLElBQzNCLE9BQU87QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixJQUFJO0FBQUEsTUFDRixPQUFPLENBQUMsSUFBSTtBQUFBLElBQ2Q7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsTUFDSCxPQUFPLEtBQUssUUFBUSxrQ0FBVyxjQUFjO0FBQUEsTUFDN0MsTUFBTTtBQUFBLE1BQ04sVUFBVSxDQUFDLFdBQVcsa0JBQWtCO0FBQUEsSUFDMUM7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sU0FBUztBQUFBLFVBQ1AsS0FBSztBQUFBLFFBQ1A7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
