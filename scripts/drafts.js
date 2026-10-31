// Shared draft detection for build-time config.
//
// A post whose frontmatter sets `draft: true` must not exist in the build at
// all: not as a prerendered route (scripts/generate-routes.js) and not as a
// row in the posts collection (content.config.ts). The collection matters
// because Nuxt Content ships the whole table to the client as a gzipped SQL
// dump under /__nuxt_content/, so a query-time filter alone would still
// publish the draft's full text.
//
// Both consumers run once at startup, so a post toggled to draft while the
// dev server is running is only hidden by the query-time filters until the
// next restart.
import fs from 'node:fs';
import path from 'node:path';

const POSTS_DIR = path.resolve('./content/posts');
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;
const DRAFT_RE = /^draft:\s*true\b/m;

export function isDraft(file) {
  const source = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
  const frontmatter = source.match(FRONTMATTER_RE)?.[1] ?? '';
  return DRAFT_RE.test(frontmatter);
}

// Markdown post filenames (no directory) in content/posts/.
export const postFiles = fs.readdirSync(POSTS_DIR)
  .filter(file => !file.startsWith('.'))
  .filter(file => file.endsWith('.md'));

export const draftFiles = postFiles.filter(isDraft);
