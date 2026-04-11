import path from 'node:path'
import { createRequire } from 'node:module'
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
import Checker from 'vite-plugin-checker'

const require = createRequire(import.meta.url)
const pkg = require('./package.json') as {
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

const externalPackages = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
]

const external = (id: string) =>
  externalPackages.some(packageName => id === packageName || id.startsWith(`${packageName}/`))

const globals: Record<string, string> = {
  '@chronicstone/vue-testid': 'VueTestid',
  '@formkit/auto-animate/vue': 'FormKitAutoAnimateVue',
  '@vuelidate/core': 'VuelidateCore',
  '@vuelidate/validators': 'VuelidateValidators',
  '@vueuse/core': 'VueUse',
  'date-fns': 'dateFns',
  'deepmerge-ts': 'deepmergeTs',
  'json-as-xlsx': 'jsonAsXlsx',
  'maska/vue': 'MaskaVue',
  'naive-ui': 'naive',
  'tinycolor2': 'tinycolor',
  'vue': 'Vue',
  'vue-draggable-plus': 'VueDraggablePlus',
  'vue-i18n': 'VueI18n',
  'xlsx': 'XLSX',
  'zod': 'zod',
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue(),
    VueJsx(),
    UnoCSS(),
    AutoImports({
      imports: [
        'vue',
        'vue-i18n',
        '@vueuse/core',
      ],
      ignore: ['useBreakpoints', 'useConfirmDialog'],
      vueTemplate: true,
      dirs: [
        'src/_shared/composables',
        'src/_shared/config',
        'src/_shared/utils',
        'src/form/composables',
        'src/form/utils',
        'src/data-list/composables',
        'src/data-list/utils',
        'src/excel-reader/composables',
        'src/excel-reader/utils',
      ],
    }),
    Components({
      dts: true,
      dtsTsx: false,
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
    Dts({
      skipDiagnostics: true,
      logDiagnostics: false,
    }),
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
      cssFileName: 'style',
    },
    rollupOptions: {
      external,
      output: {
        exports: 'named',
        globals,
      },
    },
  },
  optimizeDeps: {
    exclude: ['fsevents'],
  },
})
