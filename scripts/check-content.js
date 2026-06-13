// scripts/check-content.js
//
// Content linter for blog posts. It catches the classes of mistakes that have
// slipped into published posts before: empty/broken links, malformed URLs,
// relative asset paths, missing frontmatter, leaked AI-assistant replies,
// duplicate page titles, broken local image references, and filename/`date`
// drift.
//
// It runs on plain Node with no dependencies and without a Nuxt build, so it is
// fast and works in CI without installing the full toolchain or the Nuxt UI Pro
// license. It is complementary to the lychee link checker (bin/check-links.sh),
// which validates that links resolve; this validates the markdown around them.
//
// Usage:
//   node scripts/check-content.js     # lint content/posts
//   pnpm check:content
//
// Exit code is non-zero only when ERROR-level problems are found. WARN-level
// findings are reported for visibility but do not fail the build.

import fs from 'node:fs';
import path from 'node:path';

const POSTS_DIR = path.resolve('content/posts');
const PUBLIC_DIR = path.resolve('public');

const ERROR = 'error';
const WARN = 'warn';

// Distinctive phrases that indicate an AI-assistant reply was pasted into the
// authored prose by mistake. These are matched only in authored prose — outside
// code fences, blockquotes, and ::CollapsibleContent blocks (where the
// intentional, clearly-delimited conversation transcripts live).
const LEAKED_AI_PHRASES = [
  'craft an updated summary',
  'aligns with the communication guidelines',
  'thank you for providing the detailed',
  'as an ai language model',
  'is there anything else you\'d like me to',
  'i\'ve updated the blog post with',
  'let me know if you\'d like me to',
];

// Consecutive duplicate words are almost always typos. A few legitimate doubles
// are allowed to avoid false positives.
const DUP_WORD_ALLOW = new Set(['that', 'had', 'ha', 'no', 'so', 'is', 'many', 'really']);

const findings = [];
function report(level, file, line, rule, message) {
  findings.push({ level, file, line, rule, message });
}

// --- frontmatter -----------------------------------------------------------

function parseFrontmatter(lines) {
  if (lines[0]?.trim() !== '---') {
    return { fmLines: [], bodyStart: 0 };
  }
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      return { fmLines: lines.slice(1, i), bodyStart: i + 1 };
    }
  }
  return { fmLines: [], bodyStart: 0 };
}

function frontmatterField(fmLines, key) {
  const re = new RegExp(`^${key}:\\s*(.+)$`);
  for (const l of fmLines) {
    const m = l.match(re);
    if (m) {
      return m[1].trim().replace(/^['"]|['"]$/g, '');
    }
  }
  return null;
}

// The post image lives either as `image: /path` or as a nested `image:\n  src: /path`.
function frontmatterImage(fmLines) {
  const idx = fmLines.findIndex(l => /^image:/.test(l));
  if (idx === -1)
    return null;
  const inline = fmLines[idx].match(/^image:\s*(\S.*)$/);
  if (inline)
    return inline[1].trim().replace(/^['"]|['"]$/g, '');
  for (let i = idx + 1; i < fmLines.length; i++) {
    if (/^\S/.test(fmLines[i]))
      break; // dedented: left the image block
    const m = fmLines[i].match(/^\s*src:\s*(.+)$/);
    if (m)
      return m[1].trim().replace(/^['"]|['"]$/g, '');
  }
  return null;
}

// --- asset references -------------------------------------------------------

// Pull candidate asset targets out of a line: HTML/component src="…" and
// markdown ](…). Quote/paren delimited so paths containing spaces survive.
function extractRefs(line) {
  const refs = [];
  for (const m of line.matchAll(/src\s*=\s*["']([^"']+)["']/g)) refs.push(m[1]);
  for (const m of line.matchAll(/\]\(([^)]+)\)/g)) refs.push(m[1]);
  return refs;
}

function isLocalAsset(target) {
  return /^\/(img|archive)\//.test(target);
}

function assetExists(target) {
  const clean = target.split(/[?#]/)[0];
  return fs.existsSync(path.join(PUBLIC_DIR, clean));
}

// --- per-file checks --------------------------------------------------------

function checkFile(file) {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
  const lines = raw.split('\n');
  const { fmLines, bodyStart } = parseFrontmatter(lines);

  // Frontmatter: required fields.
  const title = frontmatterField(fmLines, 'title');
  const date = frontmatterField(fmLines, 'date');
  if (!title)
    report(ERROR, file, 1, 'frontmatter', 'missing `title`');
  if (!date) {
    report(ERROR, file, 1, 'frontmatter', 'missing `date`');
  }
  else if (!/^\d{4}-\d{2}-\d{2}/.test(date)) {
    report(ERROR, file, 1, 'frontmatter', `\`date\` is not YYYY-MM-DD: "${date}"`);
  }

  // Filename date prefix vs frontmatter date.
  const fileDate = file.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];
  if (fileDate && date && date.slice(0, 10) !== fileDate) {
    report(WARN, file, 1, 'date-drift', `filename date ${fileDate} != frontmatter date ${date.slice(0, 10)} (URL slug and displayed date disagree)`);
  }

  // Draft posts still render — there is no draft filter in the posts query.
  if (fmLines.some(l => /^_draft:\s*true\b/.test(l))) {
    report(WARN, file, 1, 'draft', '`_draft: true` is set but drafts are not filtered — this post will publish');
  }

  // Frontmatter image: relative path (missing leading slash) or missing file.
  const fmImage = frontmatterImage(fmLines);
  if (fmImage) {
    if (/^(img|archive)\//.test(fmImage))
      report(ERROR, file, 1, 'asset-path', `frontmatter image is a relative path (needs leading slash): "${fmImage}"`);
    else if (isLocalAsset(fmImage) && !assetExists(fmImage))
      report(WARN, file, 1, 'asset-missing', `frontmatter image not found in public/: "${fmImage}"`);
  }

  // Body, line by line, tracking code fences / blockquotes / containers so the
  // intentional AI transcripts are not mistaken for authored prose.
  let inCode = false;
  const containerStack = [];
  for (let i = bodyStart; i < lines.length; i++) {
    const line = lines[i];
    const ln = i + 1;
    const trimmed = line.trim();

    if (/^(```|~~~)/.test(trimmed)) {
      inCode = !inCode;
      continue;
    }
    if (inCode)
      continue;

    // MDC container tracking (::Component … ::).
    const open = trimmed.match(/^::([A-Za-z][\w-]*)/);
    if (open)
      containerStack.push(open[1]);
    else if (trimmed === '::')
      containerStack.pop();
    const inTranscript = containerStack.includes('CollapsibleContent');
    const isQuote = trimmed.startsWith('>');

    // Empty links: [text]()
    if (/\]\(\s*\)/.test(line))
      report(ERROR, file, ln, 'empty-link', 'empty link target: `]()`');

    // Malformed protocol: https:/// (triple slash)
    if (/https?:\/\/\//.test(line))
      report(ERROR, file, ln, 'bad-url', 'malformed URL with triple slash (e.g. `https:///`)');

    // Asset references: relative path error + existence warning.
    for (const ref of extractRefs(line)) {
      if (/^(img|archive)\//.test(ref))
        report(ERROR, file, ln, 'asset-path', `relative asset path (needs leading slash): "${ref}"`);
      else if (isLocalAsset(ref) && !assetExists(ref))
        report(WARN, file, ln, 'asset-missing', `local asset not found in public/: "${ref}"`);
    }

    // Body-level H1 — the page template already renders the frontmatter title
    // as the page <h1>, so a `# ` heading here is a second, duplicate H1.
    if (/^#\s/.test(line))
      report(WARN, file, ln, 'duplicate-h1', 'body uses a level-1 heading (`# `); the title is already rendered as the page H1');

    // Authored-prose checks: skip transcripts, quotes.
    if (!inTranscript && !isQuote) {
      const lower = line.toLowerCase();
      for (const phrase of LEAKED_AI_PHRASES) {
        if (lower.includes(phrase)) {
          report(WARN, file, ln, 'leaked-ai', `looks like a leaked AI-assistant reply: "${phrase}"`);
          break;
        }
      }
      // Require the repeated token to be a standalone word, not part of a
      // hyphenated identifier (e.g. Tailwind's `bg-clip-text text-transparent`
      // or `grid grid-cols-1`), which are not prose typos.
      const dup = line.match(/(?<![\w-])([A-Za-z]{2,})\s+\1(?![\w-])/);
      if (dup && !DUP_WORD_ALLOW.has(dup[1].toLowerCase()))
        report(WARN, file, ln, 'dup-word', `repeated word: "${dup[1]} ${dup[1]}"`);
    }
  }
}

// --- run --------------------------------------------------------------------

const files = fs.readdirSync(POSTS_DIR)
  .filter(f => f.endsWith('.md') && !f.startsWith('.'))
  .sort();

for (const file of files) checkFile(file);

const errors = findings.filter(f => f.level === ERROR);
const warnings = findings.filter(f => f.level === WARN);

function printGroup(items, label) {
  if (!items.length)
    return;
  console.log(`\n${label} (${items.length}):`);
  let current = '';
  for (const f of items.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)) {
    if (f.file !== current) {
      current = f.file;
      console.log(`\n  ${f.file}`);
    }
    console.log(`    ${String(f.line).padStart(4)}  [${f.rule}] ${f.message}`);
  }
}

console.log(`Checked ${files.length} posts in content/posts/`);
printGroup(errors, 'ERRORS');
printGroup(warnings, 'WARNINGS');

console.log(`\n${errors.length} error(s), ${warnings.length} warning(s).`);
if (errors.length) {
  console.error('\nContent check failed: fix the errors above.');
  process.exit(1);
}
console.log('Content check passed (no errors).');
