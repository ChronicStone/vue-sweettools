import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"
import WindiCSS from 'vite-plugin-windicss'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import PurgeIcons from 'vite-plugin-purge-icons'
// import typescript from 'rollup-plugin-typescript2';
// import dts from "vite-plugin-dts";
// import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    WindiCSS(),
    Components({
      dts: true,
      resolvers: [IconsResolver()],
    }),
    PurgeIcons(),
    Icons({ autoInstall: true }),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
  server: {
    fs: {
      allow: ['..']
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'VueSweetTables',
      fileName: (format) => `vue-sweet-tables.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },

    },
  },
})