import assert from 'node:assert/strict';
import { it } from 'vitest';
import { assertPrerenderedPosts } from './check-prerender.js';

const post = '/posts/2024-09-08-qr-code';
const generated = { route: post, fileName: `${post}/index.html` };

it('accepts generated HTML for every published post', () => {
  assert.doesNotThrow(() => assertPrerenderedPosts([post], [generated]));
  assert.doesNotThrow(() => assertPrerenderedPosts([post], [{ ...generated, route: `${post}/` }]));
});

it('rejects a missing published route, even if other routes were generated', () => {
  assert.throws(() => assertPrerenderedPosts([post], [{ route: '/', fileName: '/index.html' }]), /Published posts were not prerendered:\n\/posts\/2024-09-08-qr-code/);
});

it('does not count failed, skipped or non-HTML routes as generated posts', () => {
  for (const route of [
    { ...generated, error: new Error('404 Post not found') },
    { ...generated, skip: true },
    { ...generated, fileName: `${post}/_payload.json` },
  ]) {
    assert.throws(() => assertPrerenderedPosts([post], [route]), /Published posts were not prerendered/);
  }
});

it('keeps ancillary asset failures separate from published post completeness', () => {
  assert.doesNotThrow(() => assertPrerenderedPosts([post], [generated, { route: '/_og/image.png', error: new Error('408') }]));
});
