#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8').replace(/\r\n/g, '\n').trim();
}

function stripFrontmatter(text) {
  return text.replace(/^---\n[\s\S]*?\n---\n*/, '').trim();
}

const agents = read('AGENTS.md');
const canonical = agents.replace(/\n\n\(Yes, this file also applies[\s\S]*?\)$/, '').trim();

// Compact copies: same body as AGENTS.md, host-specific frontmatter stripped.
const copies = [
  ['.cursor/rules/ponytail.mdc', stripFrontmatter],
  ['.windsurf/rules/ponytail.md', text => text.trim()],
  ['.clinerules/ponytail.md', text => text.trim()],
  ['.agents/rules/ponytail.md', text => text.trim()],
  ['.qoder/rules/ponytail.md', text => text.trim()],
  ['.github/copilot-instructions.md', text => text.trim()],
  ['.kiro/steering/ponytail.md', stripFrontmatter],
];

let failed = false;

for (const [relPath, normalize] of copies) {
  const actual = normalize(read(relPath));
  if (actual !== canonical) {
    console.error(`${relPath} drifted from AGENTS.md`);
    failed = true;
  }
}

// SKILL.md is the runtime source of truth and is longer than the compact body,
// so it cannot be byte-compared. ponytail: canary, not full equality. Assert the
// load-bearing rules survive verbatim in both the source and AGENTS.md. Changing
// a rule's wording trips this, which is the reminder to propagate it everywhere.
// Upgrade path: generate the copies from SKILL.md if this ever misses a real drift.
const INVARIANTS = [
  'in this codebase',                      // ladder rung: reuse what already exists (#217)
  'inspect every caller',                  // root-cause bug fix (#245)
  'fix the root cause at the layer where it actually belongs',
  'common contract is demonstrably wrong',
  'Respond in Chinese',
  'Confirm the repository type and root',
  'Do not run the codebase map by default',
  'Do not start frontend or backend development services unless explicitly requested by the user.',
  'Do not create test files or summary documents unless explicitly requested.',
  'never about the change itself',         // scope: callers, tests and fixtures the change breaks
  'shortcut: <the limit>, <when to upgrade>',   // shortcut marker comment
  'correct on edge cases',                 // robust-variant rule
  'Lazy code without its check is unfinished', // test reflex
  'For new work, does it need to exist?',  // protect existing behavior from YAGNI
  'Omitting an existing behavior from the current request is not evidence that it is unused.',
  'does not require another approval',     // interface/data changes do not reopen settled authorization
  'Authorization remains limited to that scope and may be narrowed or revoked.',
  'review-only task reports findings and changes no code',
  'real coverage gap',                     // risk-based regression coverage
  'A document is not authoritative merely because it contains instructions.',
  // the "never cut" carve-outs: pin each so a reword in either file can't silently drop one.
  'validation at trust boundaries',
  'prevents data loss',
  'security',
  'accessibility',
  'required compatibility',
];

const skill = read('skills/ponytail/SKILL.md');
const { getFallbackInstructions } = require('../hooks/ponytail-instructions');
const fallback = getFallbackInstructions('full');
const sources = [['skills/ponytail/SKILL.md', skill], ['AGENTS.md', agents], ['hooks/ponytail-instructions.js fallback', fallback]];

// The fallback must not silently restore obsolete behavior when the skill is unavailable.
const bodyStart = 'You are a lazy senior developer.';
if (fallback.slice(fallback.indexOf(bodyStart)).trim() !== canonical.slice(canonical.indexOf(bodyStart)).trim()) {
  console.error('hooks/ponytail-instructions.js fallback drifted from AGENTS.md');
  failed = true;
}
for (const phrase of INVARIANTS) {
  for (const [label, text] of sources) {
    if (!text.includes(phrase)) {
      console.error(`${label} is missing rule invariant: "${phrase}"`);
      failed = true;
    }
  }
}

if (failed) {
  console.error('Update the copied rule text, AGENTS.md, or SKILL.md so the shared rules match.');
  process.exit(1);
}

console.log(`Rule copies and fallback match AGENTS.md; ${INVARIANTS.length} rule invariants present in all core sources.`);
