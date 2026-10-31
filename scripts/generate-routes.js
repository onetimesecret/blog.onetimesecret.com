// Create a file: scripts/generate-routes.js
import { draftFiles, postFiles } from './drafts.js';

const MD_EXT_RE = /\.md$/;

// Generate routes list, filtering out dot files and drafts. Drafts are also
// excluded from the posts collection (see content.config.ts), so a route for
// one would only prerender a 404.
export const routes = postFiles
  .filter(file => !draftFiles.includes(file))
  .map(file => `/posts/${file.replace(MD_EXT_RE, '')}`);

console.log('Routes:');
console.log(JSON.stringify(routes, null, 2));

// Write to a file that can be imported
// fs.writeFileSync("./routes.json", JSON.stringify(routes));
