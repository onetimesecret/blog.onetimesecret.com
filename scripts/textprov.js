// TextProv marks in blog posts, decoded at build time.
//
// A post opts in with `textprov: true` in its frontmatter, and only posts
// whose provenance was recorded while they were written should: the reader
// toggle (app/components/TextProvToggle.vue) claims that the highlighted
// characters are the ones an AI model wrote. In the markdown source each
// AI-written character is followed by U+E0101, the AI selector of the
// experimental TextProv mapping (app/vendor/textprov/).
//
// The selectors never reach the published site. The content:file:afterParse
// hook in nuxt.config.ts runs decodePost() on every parsed post: it strips
// the selectors and wraps each AI run in
// <span class="textprov-ai" data-textprov="ai">, so the SQL dump, the search
// index, the prerendered HTML and copied text carry plain words, and the P+
// body fonts never draw their own mark under the highlight. Heading ids and
// TOC entries derived from marked headings are cleaned the same way.
//
// Only the AI state is decoded, as on the docs site: a human-state selector
// (U+E0100) is also a genuine ideographic variation selector, so it is left
// as written. Code keeps its bytes, so a post can show the encoding verbatim.
//
// It runs on plain Node: scripts/check-content.js uses it without a build.
import textprov from '../app/vendor/textprov/textprov.js';

export const AI_SELECTOR = String.fromCodePoint(textprov.mapping.selectors.ai);

const codepoint = value => `\\u{${value.toString(16)}}`;
// The AI selector, or a legacy PUA mark (tofu without the P+ fonts).
export const MARK_RE = new RegExp(`[${codepoint(textprov.mapping.selectors.ai)}${
  textprov.mapping.puaRanges.map(([start, end]) => `${codepoint(start)}-${codepoint(end)}`).join('')
}]`, 'u');

const INVISIBLE_RE = /[\p{M}\p{C}]/u;
const VERBATIM = new Set(['code', 'pre', 'script', 'style']);
const LABELS = ['alt', 'title', 'ariaLabel', 'aria-label'];

// Whitespace between two AI runs joins them, so a marked phrase is one span
// and the highlight does not break at every space.
export function aiRuns(text) {
  return textprov.runs(text, { merge_whitespace: true }).map(run => ({
    ai: run.state === 'ai',
    text: run.state === 'ai'
      ? textprov.runs(run.text, { strip: true }).map(part => part.text).join('')
      : run.text,
  }));
}

// Context around the first mark, with invisible code points spelled out, so
// the offending cluster can be found in the source.
function excerpt(text) {
  const at = Math.max(0, text.search(MARK_RE));
  return Array.from(text.slice(Math.max(0, at - 24), at + 24), char =>
    INVISIBLE_RE.test(char) ? `<U+${char.codePointAt(0).toString(16).toUpperCase()}>` : char).join('');
}

const plain = text => aiRuns(text).map(run => run.text).join('');
// Slugs can keep a selector whose base character was dropped as punctuation.
// Ids are never displayed, so every AI selector goes.
const plainId = id => plain(id).replaceAll(AI_SELECTOR, '');

/**
 * Decode one parsed post in place (Nuxt Content's minimark body).
 *
 * @param {Record<string, any>} content the afterParse hook's `ctx.content`
 * @param {string} label names the post in errors
 */
export function decodePost(content, label) {
  const fail = (message) => {
    throw new Error(`TextProv: ${message} (${label})`);
  };
  const enrolled = content.textprov === true;
  const ids = [];

  function text(node) {
    if (!MARK_RE.test(node))
      return [node];
    if (!enrolled)
      fail(`AI marks in a post without \`textprov: true\`: "${excerpt(node)}"`);
    const runs = aiRuns(node);
    if (runs.some(run => MARK_RE.test(run.text)))
      fail(`malformed AI mark: "${excerpt(node)}"`);
    return runs.map(run => run.ai
      ? ['span', { 'class': 'textprov-ai', 'data-textprov': 'ai' }, run.text]
      : run.text);
  }

  function element([tag, props = {}, ...children], verbatim) {
    for (const key of ['id', 'href', ...LABELS]) {
      const value = props[key];
      if (typeof value !== 'string' || !MARK_RE.test(value))
        continue;
      if (key === 'href' && !value.startsWith('#'))
        fail(`AI marks in a link target: "${excerpt(value)}"`);
      props[key] = key === 'id' ? plainId(value) : key === 'href' ? `#${plainId(value.slice(1))}` : plain(value);
    }
    if (typeof props.id === 'string')
      ids.push(props.id);
    verbatim ||= VERBATIM.has(tag);
    return [tag, props, ...children.flatMap(child => visit(child, verbatim))];
  }

  function visit(node, verbatim = false) {
    if (typeof node === 'string')
      return verbatim ? [node] : text(node);
    return [element(node, verbatim)];
  }

  function toc(links = []) {
    for (const link of links) {
      link.id = plainId(link.id);
      link.text = plain(link.text);
      toc(link.children);
    }
  }

  for (const tree of [content.body, content.excerpt]) {
    if (tree?.type === 'minimark')
      tree.value = tree.value.flatMap(node => visit(node));
  }
  toc(content.body?.toc?.links);

  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id))
      fail(`decoded id "${id}" is used twice; rename one of the headings`);
    seen.add(id);
  }

  // A title or description missing from the frontmatter is taken from the
  // body, marks and all. Everything else outside the body is frontmatter,
  // which is shown where no highlight can be (meta tags, cards, alt text), so
  // it stays unmarked; scripts/check-content.js reports it at the source.
  for (const key of ['title', 'description']) {
    if (typeof content[key] === 'string')
      content[key] = plain(content[key]);
  }
  for (const [key, value] of Object.entries(content)) {
    if (key !== 'body' && key !== 'excerpt' && MARK_RE.test(JSON.stringify(value) ?? ''))
      fail(`AI marks in \`${key}\`; frontmatter stays unmarked`);
  }
}
