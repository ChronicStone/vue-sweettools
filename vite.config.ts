import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import VueJsx from '@vitejs/plugin-vue-jsx'
import PurgeIcons from 'vite-plugin-purge-icons'
import AutoImports from 'unplugin-auto-import/vite'
import Dts from 'vite-plugin-dts'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import VueMacros from 'unplugin-vue-macros/vite'
import Checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueMacros({
      plugins: {
        vue: Vue(),
        vueJsx: VueJsx(),
      },
    }),
    UnoCSS(),
    AutoImports({
      imports: [
        'vue',
        'vue-i18n',
        '@vueuse/core',
      ],
      dts: 'auto-imports.d.ts',
      vueTemplate: true,
      dirs: [
        'src/_shared/composables',
        'src/_shared/config',
        'src/_shared/utils',
        'src/form/composables',
        'src/form/utils',
        'src/data-list/composables',
        'src/data-list/utils',
      ],
    }),
    Components({
      dts: true,
      dirs: [
        'src/_shared/components',
        'src/form/components',
        'src/data-list/content',
        'src/data-list/layout',
      ],
      resolvers: [IconsResolver({ componentPrefix: '' }), NaiveUiResolver()],
      deep: true,
    }),
    PurgeIcons(),
    Icons({ autoInstall: true }),
    Dts(),
    Checker({}),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'VueSweetTools',
      fileName: format => `vue-sweettools.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'naive-ui', 'date-fns'],
      output: {
        globals: {
          'vue': 'Vue',
          'naive-ui': 'naive-ui',
          'date-fns': 'date-fns',
        },
      },
    },
  },
})
