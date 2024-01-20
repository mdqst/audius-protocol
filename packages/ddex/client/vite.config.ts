import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import tsconfigPaths from 'vite-tsconfig-paths'

const isDevelopment = process.env.IS_DEV === 'true'

export default defineConfig({
  server: {
    proxy: isDevelopment
      ? {
          '/api': 'http://localhost:8926', // Assuming port for ../server Express server is unchanged
          '/trpc': 'http://localhost:8926'
        }
      : {}
  },
  plugins: [
    react(),
    tsconfigPaths({
      root: './packages/ddex/client'
    }),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true
      },
      protocolImports: true
    })
  ],
  resolve: {
    alias: {
      components: '/src/components',
      pages: '/src/pages',
      providers: '/src/providers',
      utils: '/src/utils',
      hooks: '/src/hooks',
      assets: '/src/assets'
    }
  },
  base: '/ddex/',
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
})
