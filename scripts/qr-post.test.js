import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseMarkdown } from '@nuxtjs/mdc/runtime';
import { fromHast } from 'minimark/hast';
import { it } from 'vitest';
import { decodePost } from './textprov.js';

// Use the same Markdown parser and compression as Nuxt Content.
it('the QR article parses and keeps all ten complete SVG examples as code', async () => {
  const label = 'content/posts/2024-09-08-qr-code.md';
  const parsed = await parseMarkdown(readFileSync(label, 'utf8'));
  const post = {
    ...parsed.data,
    body: { ...fromHast(parsed.body), toc: parsed.toc },
    excerpt: parsed.excerpt ? fromHast(parsed.excerpt) : undefined,
  };
  decodePost(post, label);

  const elements = [];
  function visit(node) {
    if (!Array.isArray(node))
      return;
    elements.push(node);
    node.slice(2).forEach(visit);
  }
  post.body.value.forEach(visit);
  assert.equal(post.title, 'Support for ASCII QR Codes');
  assert.equal(elements.filter(([tag]) => tag === 'svg').length, 0);
  const examples = elements.filter(([tag, props]) => tag === 'pre' && /(?:^|\n)<svg\s/.test(props.code ?? ''));
  assert.equal(examples.length, 10);
  assert.ok(examples.every(([, props]) => props.code.trim().endsWith('</svg>')));
  assert.ok(elements.some(([tag, , text]) => tag === 'code' && text === '</svg>'));
});
