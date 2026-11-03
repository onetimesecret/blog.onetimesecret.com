import assert from 'node:assert/strict';
import { it } from 'vitest';
import { AI_SELECTOR, decodePost } from './textprov.js';

const tree = (...value) => ({ type: 'minimark', value });
const heading = id => ['h2', { id }, 'Heading'];
const marked = text => Array.from(text, char => char + AI_SELECTOR).join('');

it('body and excerpt may repeat the same heading', () => {
  const post = {
    textprov: true,
    body: tree(heading(marked('heading'))),
    excerpt: tree(heading(marked('heading'))),
  };
  decodePost(post, 'excerpt.md');
  assert.equal(post.body.value[0][1].id, 'heading');
  assert.equal(post.excerpt.value[0][1].id, 'heading');
});

for (const field of ['body', 'excerpt']) {
  it(`rejects IDs that collide after decoding within the ${field}`, () => {
    const post = {
      textprov: true,
      [field]: tree(heading(marked('same')), heading('same')),
    };
    assert.throws(() => decodePost(post, 'collision.md'), /decoded id "same" is used twice/);
  });

  it(`rejects unmarked duplicate SVG IDs within the ${field}`, () => {
    const post = {
      [field]: tree(['svg', {}, ['filter', { id: 'matrix-effect' }]], ['svg', {}, ['filter', { id: 'matrix-effect' }]]),
    };
    assert.throws(() => decodePost(post, 'svg.md'), /decoded id "matrix-effect" is used twice/);
  });
}

it('decodes text, heading IDs, links and the TOC while preserving code', () => {
  const source = marked('Example');
  const post = {
    textprov: true,
    title: source,
    body: {
      ...tree(['h2', { id: source }, source], ['a', { href: `#${source}` }, source], ['pre', { code: source }, ['code', {}, source]]),
      toc: { links: [{ id: source, text: source }] },
    },
  };
  decodePost(post, 'marked.md');
  assert.equal(post.title, 'Example');
  assert.deepEqual(post.body.value[0], ['h2', { id: 'Example' }, ['span', { 'class': 'textprov-ai', 'data-textprov': 'ai' }, 'Example']]);
  assert.equal(post.body.value[1][1].href, '#Example');
  assert.deepEqual(post.body.toc.links, [{ id: 'Example', text: 'Example' }]);
  assert.deepEqual(post.body.value[2], ['pre', { code: source }, ['code', {}, source]]);
});

it('still rejects AI text in unenrolled posts', () => {
  assert.throws(() => decodePost({ body: tree(marked('AI')) }, 'unenrolled.md'), /AI marks in a post without/);
});
