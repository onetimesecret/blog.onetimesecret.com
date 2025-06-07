// nuxt.config.ts

import fs from "fs";
import path from "path";

// Get all content files directly in the config
import { routes } from "./scripts/generate-routes";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ["@nuxt/ui-pro"],

  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "nuxt-og-image",
    "nuxt-security",
  ],

  experimental: {
    appManifest: false,

    // Possible fix for logging errors
    // https://github.com/nuxt/nuxt/issues/20889
    renderJsonPayloads: false,
  },

  ui: {},
  nitro: {
    prerender: {
      concurrency: 250,
      interval: 250,
      failOnError: false,
      crawlLinks: false,
      routes: routes,
      ignore: [
        // Filter out routes for dot files
        (route) => route.includes("/posts/."),
      ],
    },
    publicAssets: [
      {
        dir: path.resolve(__dirname, "public"),
        maxAge: 60 * 60 * 24 * 7, // Cache for 1 week (adjust as needed)
      },
    ],
    hooks: {},
  },
  content: {
    // or you might have 'mdc' instead of 'content' depending on your setup
    highlight: {
      theme: {
        default: "houston", // Light theme
        dark: "one-dark-pro", // Dark theme
      },
      themes: ["houston", "aurora-x"], // This lists available themes for Shiki
      langs: [
        "javascript",
        "typescript",
        "python",
        "perl",
        "ruby",
        "go",
        "powershell",
        "csharp",
        "bash",
        "html",
        "css",
        "markdown",
        "xml",
      ],
    },
  },
  image: {
    // Add SVG to the format list if not already present
    format: ["webp", "jpg", "png", "svg"],
    // Configure IPX to handle SVGs
    provider: "ipx",
    ipx: {
      // Optional: Add specific SVG optimization options
      svgo: {},
    },
  },
  /**
   * Configuration for Nuxt UI Pro.
   *
   * The `uiPro` object contains settings specific to the Nuxt UI Pro module.
   *
   * @property {string} license - The license key for Nuxt UI Pro.
   *   This value is obtained from the environment variable `NUXT_UI_PRO_LICENSE`.
   *   If the environment variable is not set, it falls back to a placeholder
   *   `${NUXT_UI_PRO_LICENSE}` which can be replaced using `envsubst` during deployment.
   *
   *  e.g.
   *
   *    $ export NUXT_UI_PRO_LICENSE
   *    $ envsubst < nuxt.config.ts > nuxt.config.ts.tmp && mv nuxt.config.ts.tmp nuxt.config.ts
   */
  uiPro: {
    license: process.env.NUXT_UI_PRO_LICENSE || "${NUXT_UI_PRO_LICENSE}",
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ["@/assets/css/main.css", "@/assets/css/font.css"],
  vite: {
    plugins: [require("vite-svg-loader")],
    assetsInclude: ["@/assets/css/fonts/**/*.woff", "@/**/**/*.woff2"],
    server: {
      allowedHosts: true,
    },
  },
  hooks: {
    // Define `@nuxt/ui` components as global to use them in `.md` (feel free to add those you need)
    "components:extend": (components) => {
      const globals = components.filter((c) =>
        ["UButton"].includes(c.pascalName),
      );

      globals.forEach((c) => (c.global = true));
    },
  },

  colorMode: {
    disableTransition: true,
  },

  routeRules: {
    // Temporary workaround for prerender regression. see https://github.com/nuxt/nuxt/issues/27490
    "/": { prerender: true },
    "/api/search.json": { prerender: true },
    "/docs": { redirect: "/docs/introduction", prerender: true },
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
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },

  compatibilityDate: "2024-07-11",
});
