/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = repositoryName ? `/${repositoryName}/` : '/';

export default defineConfig({
  base,
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'SmileSteps POC',
        short_name: 'SmileSteps',
        description: 'A kid-friendly pediatric and orthodontic engagement PWA proof of concept.',
        theme_color: '#2AABB3',
        background_color: '#F4FAFB',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/pwa-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      }
    })
  ]
});
