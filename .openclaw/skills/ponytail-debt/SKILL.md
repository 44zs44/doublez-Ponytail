---
name: ponytail-debt
description: "Harvest every shortcut: comment into one debt ledger, so deferrals get tracked instead of forgotten. One-shot report."
homepage: https://github.com/DietrichGebert/ponytail
license: MIT
---

Every deliberate ponytail shortcut is marked with a `shortcut:` comment naming
its ceiling and upgrade path (older code may say `ponytail:`). This collects them into one ledger so a deferral
can't quietly become permanent.

Respect the user's scope, language and format, and applicable project rules.
Default to Chinese. Read and report only; do not add test files or persist a
ledger unless explicitly requested. Necessary tests, checks and builds must
respect authorization and project restrictions; inspect side effects first.
Do not start frontend or backend development services without an explicit
request. Do not run code-map tools by default.

## Scan

Use a bounded `rg` search in the requested scope (the repository when none is
named), excluding `.git`, `.svn`, `node_modules` and project exclusions. Respect
ignore files and add project-specific exclusion globs where needed:

`rg -n --hidden --no-require-git -g '!**/.git/**' -g '!**/.svn/**' -g '!**/node_modules/**' '(#|//|/[*]) ?(shortcut|ponytail):' .`

Replace `.` with the requested scope. `--no-require-git` keeps `.gitignore`
rules effective in SVN and other directories; retain project exclusions.

Add other comment prefixes when the stack uses them. Before any Git or SVN
command, confirm the repository type and root; repeat when switching repos.

If the user names their own marker word (`/ponytail-debt TODO`), search for that
literal word instead; do not interpret it as a shell command or regex.

Each hit is one ledger row. The comment prefix keeps prose that merely mentions
the convention out of the ledger. Skip hits that are not a deferral, like a note
about a keyboard shortcut.

## Output

One row per marker, grouped by file:

`<文件>:<行号>，<简化了什么>。限制：<注明的边界>。升级条件：<重新评估的触发条件>。`

The convention is `shortcut: <ceiling>, <upgrade path>`, so pull the ceiling
and the trigger straight from the comment. When attribution is requested, use
`git blame -L <line>,<line> -- <file>` in Git or `svn blame <file>` in SVN and
select the relevant line. Do not assume a Git repository.

Flag the rot risk: any marker comment that names no upgrade path or
trigger gets a `no-trigger` tag, those are the ones that silently rot.

End with `共 <N> 处标记，其中 <M> 处未注明升级条件。` Nothing found: `未发现 shortcut 技术债。`

## Boundaries

Reads and reports only, changes nothing. Persist a ledger only when the user
explicitly requests it; do not create a file or ask to persist it by default.
A marker records a tradeoff, not proof that a defect is acceptable. One-shot.
