import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
    headers: {
      'Content-Security-Policy':
        "default-src 'self'; font-src 'self' data:; connect-src 'self' ws: wss: http: https: res.cloudinary.com; img-src 'self' data: https://res.cloudinary.com; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; manifest-src 'self'; worker-src 'self' blob:;",
    },
  },
  define: {
    __VITE_BACKEND_URL__: JSON.stringify(env.VITE_BACKEND_URL || '/api'),
  },
  preview: {
    headers: {
      'Content-Security-Policy':
        "default-src 'self'; font-src 'self' data:; connect-src 'self' ws: wss: http: https: res.cloudinary.com; img-src 'self' data: https://res.cloudinary.com; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; manifest-src 'self'; worker-src 'self' blob:;",
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react'],
          i18n: ['react-i18next'],
          calendar: ['@fullcalendar/react', '@fullcalendar/daygrid', '@fullcalendar/timegrid', '@fullcalendar/list', '@fullcalendar/interaction'],
        },
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Event Calendar',
        short_name: 'Calendar',
        description: 'Event Calendar for nationwide events',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          // Add PWA icons to public folder when available
          // {
          //   src: 'pwa-192x192.png',
          //   sizes: '192x192',
          //   type: 'image/png'
          // },
          // {
          //   src: 'pwa-512x512.png',
          //   sizes: '512x512',
          //   type: 'image/png'
          // }
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // Only cache static assets, not API requests
        runtimeCaching: [
          {
            // Cache images from Cloudinary
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            // Cache static assets with NetworkFirst strategy
            urlPattern: /\.(?:js|css|html|ico|png|svg)$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'static-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
            },
          },
        ],
        // Don't cache API requests - let them always go to network
        navigateFallback: null,
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  };
});
