/// <reference types='vitest' />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

const LIVE_API = 'https://yukunxu.com';

// php -S serves the routes at its root, so a local API needs the /api prefix stripped.
const apiProxy = (localApi: string | undefined) =>
  localApi
    ? { target: localApi, changeOrigin: true, rewrite: (path: string) => path.replace(/^\/api/, '') }
    : { target: LIVE_API, changeOrigin: true };

export default defineConfig(({ mode }) => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/frontend',
  server: {
    port: 4205,
    host: 'localhost',
    proxy: { '/api': apiProxy(loadEnv(mode, import.meta.dirname, 'VITE_').VITE_API_URL) },
  },
  preview: { port: 4205, host: 'localhost' },
  plugins: [react(), tsconfigPaths()],
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: { transformMixedEsModules: true },
  },
  test: {
    name: 'frontend',
    watch: false,
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    server: { deps: { inline: ['@mui/material'] } },
    include: ['test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: { reportsDirectory: './test-output/vitest/coverage', provider: 'v8' as const },
  },
}));