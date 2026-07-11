/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import sass from 'sass';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: {
        exportType: 'named',
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: '**/*.svg',
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@context': '/src/context',
      '@pages': '/src/pages',
      '@assets': '/src/assets',
      '@images': '/src/assets/images',
      '@icons': '/src/assets/icons',
      '@styles': '/src/assets/styles',
      '@api': '/src/api',
      '@services': '/src/services',
      '@services/hooks': '/src/services/hooks',
      '@services/helpers': '/src/services/helpers',
    },
  },
  server: {
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
      },
    },
  },
});
