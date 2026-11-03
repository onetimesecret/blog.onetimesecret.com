// Nitro can tolerate ancillary asset failures, but every published post must
// have a generated HTML page before a build is uploaded to Pages.
const TRAILING_SLASH_RE = /\/$/;

export function assertPrerenderedPosts(expected, prerendered) {
  const generated = new Set(prerendered
    .filter(route => !route.error && !route.skip && route.fileName?.endsWith('.html'))
    .map(route => route.route.replace(TRAILING_SLASH_RE, '')));
  const missing = expected.filter(route => !generated.has(route));
  if (missing.length)
    throw new Error(`Published posts were not prerendered:\n${missing.join('\n')}`);
}
