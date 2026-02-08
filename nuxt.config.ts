// nuxt.config.ts

// Get all content files directly in the config
import { routes } from './scripts/generate-routes';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@vueuse/nuxt',
    'nuxt-og-image',
    'nuxt-security',
  ],

  nitro: {
    prerender: {
      concurrency: 250,
      interval: 250,
      failOnError: false,
      crawlLinks: false,
      routes,
      ignore: [route => route.includes('/posts/.')],
    },
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'houston',
            dark: 'one-dark-pro',
          },
          langs: [
            'javascript',
            'typescript',
            'python',
            'perl',
            'ruby',
            'go',
            'powershell',
            'csharp',
            'bash',
            'html',
            'css',
            'markdown',
            'xml',
          ],
        },
      },
    },
  },

  image: {
    format: ['webp', 'jpg', 'png', 'svg'],
    provider: 'ipx',
  },

  vite: {
    server: {
      allowedHosts:
        process.env.VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS?.split(',') || [],
    },
  },

  css: ['~/assets/css/main.css', '~/assets/css/font.css'],

  hooks: {
    'components:extend': (components: any[]) => {
      const globals = components.filter(c =>
        ['UButton'].includes(c.pascalName),
      );
      globals.forEach(c => (c.global = true));
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/api/search.json': { prerender: true },
    '/docs': { redirect: '/docs/introduction', prerender: true },
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        'script-src': [
          '\'self\'',
          'https:',
          '\'unsafe-inline\'',
          '\'strict-dynamic\'',
          '\'nonce-{{nonce}}\'',
          '\'wasm-unsafe-eval\'',
        ],
      },
    },
  },

  devtools: {
    enabled: true,
  },

  typescript: {
    strict: false,
  },

  future: {
    compatibilityVersion: 4,
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
      },
    },
  },

  compatibilityDate: '2024-07-11',
});
