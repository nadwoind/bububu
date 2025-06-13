import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/bububu/',
  root: '.',
  build: {
    outDir: 'docs',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
      },
    },
  },
});
