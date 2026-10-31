// Create a file: scripts/generate-routes.js
import fs from 'node:fs';
import path from 'node:path';

// Get all content files
const contentDir = path.resolve('./content/posts');
const files = fs.readdirSync(contentDir);

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;
const DRAFT_RE = /^draft:\s*true\b/m;
const MD_EXT_RE = /\.md$/;

// A post whose frontmatter sets `draft: true` is excluded from the collection
// queries (see content.config.ts), so it must not get a prerendered route
// either or `nuxt generate` would emit a 404 page for it.
function isDraft(file) {
  const source = fs.readFileSync(path.join(contentDir, file), 'utf8');
  const frontmatter = source.match(FRONTMATTER_RE)?.[1] ?? '';
  return DRAFT_RE.test(frontmatter);
}

// Generate routes list, filtering out dot files and drafts
export const routes = files
  .filter(file => !file.startsWith('.')) // Exclude dot files
  .filter(file => file.endsWith('.md'))
  .filter(file => !isDraft(file))
  .map(file => `/posts/${file.replace(MD_EXT_RE, '')}`);

console.log('Routes:');
console.log(JSON.stringify(routes, null, 2));

// Write to a file that can be imported
// fs.writeFileSync("./routes.json", JSON.stringify(routes));
