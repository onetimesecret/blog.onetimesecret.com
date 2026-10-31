// nuxt.config.ts

// Get all content files directly in the config
import { routes } from './scripts/generate-routes';
import { decodePost } from './scripts/textprov';

// Spotnote: optional, dev-only UI feedback for coding agents.
//
// Click an element on the dev server, write what should change, and the agent
// gets its exact file, line and column. The Vite plugin stamps
// data-spotnote="file:line:col" on elements in .vue templates and injects a
// picker (launcher in the bottom-left corner). It does nothing in nuxt build
// or nuxt generate. Components from @nuxt/ui live in node_modules and get no
// stamps, so a click on one resolves to the nearest stamped ancestor.
// https://github.com/harukikuri/spotnote
//
// It is a devDependency, loaded only when installed: a --prod install, or
// removing the package, leaves this config working.
//
// MCP server (optional, once per machine) so a local agent picks up notes as
// you write them and can reply on them:
//
//   claude mcp add --scope user spotnote -- npx -y spotnote-mcp
//   codex mcp add spotnote -- npx -y spotnote-mcp
//
// Then ask the agent: "Watch my Spotnote notes." The server listens on
// 127.0.0.1:4848 only and saves notes in ~/.spotnote/. If the port is taken,
// set SPOTNOTE_PORT to the same free port for the agent and for pnpm dev.
// Without it, Enter copies the note as a prompt to paste instead.
//
// Keep this block free of dollar signs: the Pages workflow runs envsubst over
// this file before building.
const spotnote = await import('spotnote').then(
  m => m.default,
  () => null,
);

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

  // Privacy: never contact third-party font providers (Google Fonts, Bunny,
  // Fontshare, Fontsource, Google icons). @nuxt/ui bundles @nuxt/fonts, which
  // would otherwise probe those at build time. Restricting to the `local`
  // provider disables every remote provider. Our custom fonts (Zilla Slab and
  // Maryheather, both self-hosted via app/assets/css/font.css) are the only
  // webfonts; everything else uses system font stacks, so nothing depends on a
  // remote provider.
  fonts: {
    provider: 'local',
  },

  vite: {
    plugins: [spotnote?.()],
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
    // TextProv: posts with `textprov: true` mark their AI-written characters
    // in the source. Decode them before the body is stored, so no raw
    // selector is published. See scripts/textprov.js. Nuxt Content caches
    // parsed files by checksum: after changing the decoder, clear
    // .data/content/.
    'content:file:afterParse': (ctx) => {
      if (ctx.collection.name === 'posts')
        decodePost(ctx.content, ctx.file.id);
    },
    // Prerendered /_ipx/ SVGs are recorded as text/plain in the node-server
    // asset manifest, and nuxt-security's nosniff then stops the browser
    // rendering them. ipx hands SVG to srvx as a string with raw-array
    // headers; unenv's mock ServerResponse.writeHead (used by nitro's
    // prerender fetch) drops array headers, so the string body falls back to
    // the WHATWG Response default. Binary formats carry no default type and
    // are inferred from the extension, so only SVG is affected. This hook
    // runs before nitro records the route's content type.
    'nitro:init': (nitro) => {
      nitro.hooks.hook('prerender:generate', (route) => {
        if (route.route.startsWith('/_ipx/') && route.fileName?.endsWith('.svg') && route.contentType?.startsWith('text/plain'))
          route.contentType = 'image/svg+xml';
      });
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
        'frame-src': [
          '\'self\'',
          'https://www.youtube-nocookie.com',
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
