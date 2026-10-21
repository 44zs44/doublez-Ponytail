#!/usr/bin/env node
// Every ponytail command the pi extension registers must also ship as a
// file-based command for the hosts that need one: Claude Code (commands/*.toml,
// which Gemini CLI reuses) and OpenCode (.opencode/command/*.md). /ponytail-help
// was advertised in the README and the help card but missing both files; this
// guards that drift -- a registered command with no adapter file fails here.

const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

// pi-extension registers the canonical command set.
const piSource = fs.readFileSync(path.join(root, 'pi-extension', 'index.js'), 'utf8');
const commands = [...piSource.matchAll(/registerCommand\(["']([\w-]+)["']/g)].map((m) => m[1]);

test('pi registers at least the base command', () => {
  assert.ok(commands.includes('ponytail'), 'expected pi to register a ponytail command');
});

test('every registered command ships a Claude commands/*.toml', () => {
  for (const name of commands) {
    assert.ok(
      fs.existsSync(path.join(root, 'commands', `${name}.toml`)),
      `missing commands/${name}.toml`,
    );
  }
});

test('every registered command ships an OpenCode .opencode/command/*.md', () => {
  for (const name of commands) {
    assert.ok(
      fs.existsSync(path.join(root, '.opencode', 'command', `${name}.md`)),
      `missing .opencode/command/${name}.md`,
    );
  }
});

// /ponytail-debt documents one scoped search, shipped in four copies.
// It missed C-style /* ponytail: */ block comments (#810), so the ledger silently
// skipped every C/Java/CSS marker. Feed each shipped expression to real rg
// rather than restating it here: a copied regex only tests the copy.
const debtCopies = [
  'skills/ponytail-debt/SKILL.md',
  '.openclaw/skills/ponytail-debt/SKILL.md',
  'commands/ponytail-debt.toml',
  '.opencode/command/ponytail-debt.md',
];
const debtSamples = [
  ['# ponytail: hash marker', true],
  ['#ponytail: hash marker, no space', true],
  ['// ponytail: slash marker', true],
  ['//ponytail: slash marker, no space', true],
  ['/* ponytail: block marker, closed here */', true],
  ['/*ponytail: block marker, no space */', true],
  ['/* ponytail: block opener, closed some lines below', true],
  ['prose that merely mentions ponytail: markers stays out of the ledger', false],
];

test('every ponytail-debt copy greps #, // and /* markers but not prose', (t) => {
  const input = debtSamples.map(([line]) => line).join('\n') + '\n';
  const expected = debtSamples.flatMap(([line, hit], i) => (hit ? [`${i + 1}:${line}`] : []));

  for (const rel of debtCopies) {
    const documented = fs.readFileSync(path.join(root, rel), 'utf8').match(/\brg -n [^\n]*?'(\(#\|[^']+)'/);
    assert.ok(documented, `${rel} no longer documents an rg -n ... '<pattern>'`);

    const result = spawnSync('rg', ['-n', documented[1]], { input, encoding: 'utf8', timeout: 5000 });
    if (result.error) {
      if (result.error.code === 'ENOENT') return t.skip('rg not available on this platform');
      throw result.error;
    }
    assert.equal(result.status, 0, `rg failed for ${rel}: ${result.stderr}`);
    assert.deepEqual(result.stdout.split('\n').filter(Boolean), expected, `${rel} misses or over-matches markers`);
  }
});

// Git and SVN workspaces must both exclude metadata, dependencies and ignored output.
for (const metadata of ['.git', '.svn']) {
  test(`the ponytail-debt scan respects exclusions and ignore files in a ${metadata} workspace`, (t) => {
    const cmd = fs.readFileSync(path.join(root, 'skills/ponytail-debt/SKILL.md'), 'utf8').match(/`(rg -n [^`]+)`/)[1];
    const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'ponytail-debt-'));
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
    for (const sub of ['src', metadata, `nested/${metadata}`, 'node_modules/pkg', 'nested/node_modules/pkg', 'dist', 'build', '.next']) {
      fs.mkdirSync(path.join(dir, sub), { recursive: true });
      fs.writeFileSync(path.join(dir, sub, 'a.js'), '// ponytail: marker\n');
    }
    fs.writeFileSync(path.join(dir, '.gitignore'), 'dist/\nbuild/\n.next/\n');
    const result = spawnSync('sh', ['-c', cmd], { cwd: dir, encoding: 'utf8', timeout: 5000 });
    if (result.error || result.status === 127) return t.skip(`sh/rg not available: ${result.error ? result.error.code : result.stderr}`);
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(result.stdout.split('\n').filter(Boolean).map(line => line.replace(/^\.\//, '')), ['src/a.js:1:// ponytail: marker']);
  });
}
