# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the OneTimeSecret blog built with Nuxt 3, serving as a static site for blog posts and documentation. The site uses Nuxt UI Pro for components and Nuxt Content for markdown-based content management.

## Essential Commands

### Development
```bash
pnpm dev          # Start dev server on port 5175
pnpm build        # Build for production
pnpm generate     # Generate static site
pnpm preview      # Preview production build
```

### Code Quality
```bash
pnpm lint         # Run ESLint
pnpm typecheck    # TypeScript type checking
```

After making changes, always run both `pnpm lint` and `pnpm typecheck` to ensure code quality.

## Architecture

### Content System
- Blog posts live in `/content/posts/` as Markdown files with frontmatter
- Dynamic routing via `/app/pages/posts/[slug].vue` handles individual posts
- Content is processed through Nuxt Content module with Shiki syntax highlighting
- Static routes are pre-generated via `/scripts/generate-routes.js`

### Styling Architecture
- Tailwind CSS with custom configuration in `tailwind.config.ts`
- UI components from Nuxt UI Pro (requires license)
- Theme configuration in `app/app.config.ts` defining colors, typography, and component defaults
- Dark mode support via class-based switching

### Build Process
- Static Site Generation (SSG) using `nuxt generate`
- Nitro prerendering with custom route configuration
- Memory limits set for build (2GB) and generate (4GB) processes
- Content assets handled by nuxt-content-assets module

## Code Conventions

### TypeScript/JavaScript
- ESLint with @antfu/eslint-config
- 2 spaces indentation, single quotes, semicolons required
- Vue 3 Composition API with `<script setup>`
- TypeScript strict mode is disabled

### File Structure
- `/app/pages/` - File-based routing
- `/app/components/` - Auto-imported Vue components
- `/content/posts/` - Blog post markdown files
- `/public/` - Static assets served directly

## Important Notes

- This is a macOS environment - use `lsd --tree` instead of `tree`
- No automated tests are currently configured despite vitest being installed
- Nuxt UI Pro requires a license key (configured via `NUXT_UI_PRO_LICENSE` env var)
- The site is optimized for static generation, not server-side rendering