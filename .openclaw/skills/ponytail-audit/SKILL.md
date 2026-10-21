---
name: ponytail-audit
description: "Quality audit of the whole repo: bugs, security, real load, missing tests, speed, and what to delete. Most important first."
homepage: https://github.com/DietrichGebert/ponytail
license: MIT
---

Audit the whole repo like the senior developer who just inherited it and
will be paged when it breaks. Order of importance: correct, safe, holds under
load, tested, fast, lean. Lean still matters: every extra line must be read,
tested and fixed later. This is a report the user asked for, so give it in full.

Respect the user's scope, language and format, and applicable project rules.
Default to Chinese. This audit is read-only: do not edit code, add test files
or write a ledger unless explicitly requested. Necessary tests, checks and
builds must respect authorization and project restrictions; inspect their side
effects before running them. Do not start frontend or backend development
services without an explicit request. Do not run code-map tools by default.

## 1. Map first

- Audit what the user names: a folder, a package, or the whole repo.
  Nothing named: the whole repo.
- Before Git or SVN commands, confirm the repository type and root; use the
  matching version-control tool and repeat this check when switching repos.
- Read the README, the deploy and build config, the dependency list, the
  entry points (main, routes, handlers, jobs, CLI commands) and the tests.
- Find the expected load: one person running a script, or many users and
  processes at once. Judge scale against that, and say which load you assumed.
- Trace the main flows end to end: where data comes in, what is stored,
  what goes out. Read those paths fully: input from users, money, auth,
  data writes, background jobs, anything shared between processes.
- Big repo: go deep where a mistake costs the most, not file by file. Say
  which parts you did not read.

## 2. Look for

1. **Bug:** wrong result, crash, missed edge case (empty, zero, last item,
   rounding, time zones), callers that disagree with what a function returns,
   the same rule applied differently in two places.
2. **Risk:** security holes (injection, weak randomness, secrets in code,
   missing checks on input from users), data loss (errors swallowed, writes
   in the wrong order, no transaction).
3. **Scale:** fine for one user, wrong for many: check-then-write races, the
   same work done by every process, memory or lists that only grow, a query
   per item, O(n^2) on big input, per-process state that must be shared.
4. **Missing test:** a concrete coverage gap in risky behavior (a parser,
   money, security or data writes). Do not treat every branch as requiring a
   new test. Respect project rules and the user's boundaries on adding and
   running tests; report material verification limits separately.
5. **Speed:** big slowdowns are problems. Small wins (work repeated in a hot
   loop) are suggestions; some software counts every millisecond.
6. **Lean:** code that should not exist or should be smaller.
   - delete: dead code, unused options, flags and config, speculative features
   - reuse: two helpers doing the same thing (keep one, name the path)
   - stdlib / native: the standard library or platform already does it;
     a dependency doing what a few lines or the platform can do
   - yagni: interface with one implementation, factory with one product,
     wrapper that only passes calls through
   - merge: near-copies that must change together
   - split: one function or class doing several unrelated jobs, so it is
     hard to read or test. Split by job, never by line count, and never into
     helpers that exist only to make a function shorter.

## 3. Check before you report

- Every finding needs a concrete case: "this input or situation leads to this
  wrong result". No case, no finding.
- Before calling code unused, use bounded `rg` searches for tests, fixtures,
  config, and string or dynamic references, excluding `.git`, `.svn`,
  `node_modules` and project exclusions.
- A `shortcut:` (or older `ponytail:`) comment is evidence of a tradeoff, not
  an exemption. Verify its limit against authorization, security, data integrity,
  business contracts, compatibility and actual load. Report concrete defects
  even when commented; do not repeat a reasonable tradeoff as a finding.
- Propose the smallest fix that works. Prefer fixes that delete code. Never
  add layers, frameworks or config the problem does not need.
- Locate and fix the layer that owns the root cause. Change shared code only
  when its common contract is demonstrably wrong. Comments should explain
  non-obvious reasons, interface constraints and business meaning; a shortcut
  comment must name its real limit and revisit trigger, not excuse a defect.
- No style taste, no "consider", no vague worries.

## 4. Output

默认使用简明中文；用户明确指定其他语言或格式时遵从。Explain a technical
term the first time you use it. The reader may never have seen this code.

Start with `仓库用途：` in two or three sentences, and the load
you assumed.

Then the findings in three groups, most important first, skip empty groups:
- **必须修复：** bug, security, data loss, breaks at the expected load.
- **建议修复：** a material coverage gap, real slowness, duplication, a
  function that mixes jobs, code that should not exist.
- **可选优化：** small speed-ups, shorter forms.

Number findings across all groups, so the user can say "fix 2 and 5". At
most 20 findings; if you left smaller ones out, say how many.
Every finding has all four parts, each one or two short sentences:

2. **订单被归入错误日期** (`billing/close_day.py:L40-52`)
   - **作用：** 任务在午夜结算当天订单。
   - **问题：** 它使用 UTC 服务器日期，柏林时间 00:30 的订单被归到前一天。
   - **修复：** 按商店时区计算日期：`datetime.now(ZoneInfo("Europe/Berlin")).date()`。
   - **不修复的影响：** 订单日期错误，需要财务手工调整。

End with:
- `结论：` one line: healthy, or what to fix first.
- `可精简：约 <N> 行、<M> 个依赖。` when lean findings exist.
- `未验证：` the parts you did not read or could not run.

Nothing found: `仓库用途：`, then `未发现需要修复的问题。` and
one line on what you checked.

One-shot report, changes no code.
