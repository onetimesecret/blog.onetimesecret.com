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
pnpm check:content # Lint blog markdown (frontmatter, links, asset paths, etc.)
pnpm check:links  # Check for broken links with lychee (requires lychee installed)
```

After making changes, always run both `pnpm lint` and `pnpm typecheck` to ensure code quality.

When editing or adding blog posts in `/content/posts/`, also run `pnpm check:content`.
It runs on plain Node (no build/license needed) and is enforced in CI via
`.github/workflows/check-content.yml`. Errors (empty links, malformed URLs,
relative asset paths, missing/invalid frontmatter, misplaced TextProv marks)
fail the build; warnings (filename/`date` drift, duplicate H1, leaked AI
replies, missing local assets, legacy `_draft:` keys) are reported for review.
Posts with `draft: true` are excluded from the posts collection itself (`scripts/drafts.js`), so they never
reach the public SQL dump, the index, post routes, surround links or search.
Restart the dev server after toggling `draft`.
See `scripts/check-content.js`.

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

## AI-Written Text (TextProv)

A post can let readers highlight its AI-written characters. Only enroll a
post whose provenance was recorded while it was written; the highlight is a
claim about who wrote each character, not a guess.

- In the source, each AI-written character is followed by U+E0101 (whitespace
  and markdown syntax stay bare). Frontmatter stays unmarked.
- Set `textprov: true` in the frontmatter. The post page then shows
  `TextProvToggle`, and the build decodes the marks into
  `<span class="textprov-ai">` (`scripts/textprov.js`, run from the
  `content:file:afterParse` hook in `nuxt.config.ts`). No raw selector is
  published.
- `pnpm check:content` errors on marks in a post without `textprov: true` or
  in frontmatter, and warns on an enrolled post with no marks.
- Edits to an enrolled post must keep the existing selectors: new human text
  stays unmarked, AI text added later gets marked.

## Blog Post Hero Images

Each post gets an AI-generated SVG illustration, referenced from frontmatter as
`image:\n  src: /img/blog/<year>/<yyyymmdd>-<slug>.svg`.

- **Size: 800x400 (2:1 landscape).** The featured post on the index page uses
  Nuxt UI Pro's horizontal `UBlogPost` card, which crops the image to a wide
  aspect ratio. A square (400x400) image only shows its top half there. Keep
  the whole composition inside the middle band and avoid anything essential
  near the top or bottom edges.
- **House style:** dark radial "void" background, a subtle stars pattern,
  neon glow and bloom filters, gradient fills, a light `feTurbulence` warp,
  and faint rotated monospace text fragments scattered in the background.
  See `public/img/blog/2026/20260907-provenance-sawtooth.svg` and
  `20260319-api-carumba.svg` as references.
- **Fonts:** the SVG is served through `<img>`, so it cannot use the site's
  self-hosted webfonts. Any `font-family` stack must end in a generic fallback
  (Georgia, serif, monospace) and the design must still work with it.
- **Preview locally** with `rsvg-convert -w 1200 file.svg -o preview.png`
  before wiring it in. Validate with `pnpm check:content`, which errors on
  relative asset paths and warns when the frontmatter image is missing.
- **Disclose it.** Close the post with a
  `::CollapsibleContent{summary="About this post"}` block that says the image
  was made by Claude and describes the brief.

## Important Notes

- This is a macOS environment - use `lsd --tree` instead of `tree`
- No automated tests are currently configured despite vitest being installed
- Nuxt UI Pro requires a license key (configured via `NUXT_UI_PRO_LICENSE` env var)
- The site is optimized for static generation, not server-side rendering
