import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    eslint(),
    tsconfigPaths(),
    nodePolyfills({
      include: ['path', 'util'],
    }),
  ],
  build: {
    outDir: 'release',
  },
});
