// Create a file: scripts/generate-routes.js
import fs from 'node:fs';
import path from 'node:path';

// Get all content files
const contentDir = path.resolve('./content/posts');
const files = fs.readdirSync(contentDir);

const MD_EXT_RE = /\.md$/;

// Generate routes list, filtering out files that start with a dot
export const routes = files
  .filter(file => !file.startsWith('.')) // Exclude dot files
  .filter(file => file.endsWith('.md'))
  .map(file => `/posts/${file.replace(MD_EXT_RE, '')}`);

console.log('Routes:');
console.log(JSON.stringify(routes, null, 2));

// Write to a file that can be imported
// fs.writeFileSync("./routes.json", JSON.stringify(routes));
