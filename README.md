![nuxt-ui-saas-social-card](https://github.com/nuxt-ui-pro/saas/assets/739984/50bf4ddd-c4d5-47e5-a09e-0f699513dfb5)

# Nuxt UI Pro - SaaS template

[![Nuxt UI Pro](https://img.shields.io/badge/Made%20with-Nuxt%20UI%20Pro-00DC82?logo=nuxt.js&labelColor=020420)](https://ui.nuxt.com/pro)

- [Live demo](https://saas-template.nuxt.dev/)
- [Play on Stackblitz](https://stackblitz.com/github/nuxt-ui-pro/saas)
- [Documentation](https://ui.nuxt.com/pro/getting-started)

## Quick Start

```bash [Terminal]
npx nuxi init -t github:nuxt-ui-pro/saas
```

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Webfonts

The site self-hosts two font families, declared in `app/assets/css/font.css`:
Zilla Slab P+ (headings, nav, buttons) and Maryheather P+
(body). Both are Nerd Font "P+" builds that render a visible mark on text
flagged as AI-generated; plain Zilla Slab and Maryheather faces back the
reader-facing `::ProvenanceToggle` content component. Maryheather is
Merriweather renamed, because "Merriweather" is an OFL Reserved Font Name.

The staged WOFF2 files are produced by `scripts/build-fonts.sh` from patched
TTFs in the gitignored `temp/` directory. See the script header for the input
layout, subsetting rules, and how to validate the result.

## Nuxt Studio integration

Add `@nuxthq/studio` dependency to your package.json:

```bash
# npm
npm install --save-dev @nuxthq/studio

# pnpm
pnpm add -D @nuxthq/studio

# yarn
yarn add -D @nuxthq/studio

# bun
bun add -d @nuxthq/studio
```

Add this module to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  ...
  modules: [
    ...
    '@nuxthq/studio'
  ]
})
```

Read more on [Nuxt Studio docs](https://nuxt.studio/docs/get-started/setup).

## Renovate integration

Install [Renovate GitHub app](https://github.com/apps/renovate/installations/select_target) on your repository and you are good to go.
