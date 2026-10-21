---
name: ponytail-review
description: >
  Quality review of a change: is the logic right, is it safe, does it hold
  under real load, is risky code tested, is it fast enough, and is every line
  needed. Reads the connected code, not only the diff. Each finding is
  explained in plain language. Use for "review this", "code review", "review
  the last commit", "review my PR", "is this over-engineered", /ponytail-review.
---

Review a change like the senior developer who will be paged when it breaks.
Order of importance: correct, safe, holds under load, tested, fast, lean.
Lean still matters: every extra line must be read, tested and fixed later.
This is a report the user asked for, so give it in full.

Respect the user's scope, language and format, and applicable project rules.
Default to Chinese. This review is read-only: do not edit code, add test files
or write a ledger unless explicitly requested. Necessary tests, checks and
builds must respect authorization and project restrictions; inspect their side
effects before running them. Do not start frontend or backend development
services without an explicit request. Do not run code-map tools by default.

## 1. Understand first

- Review what the user names: uncommitted or staged changes, a branch, a PR
  link, or files. Nothing named: the uncommitted changes, or the last commit
  if there are none.
- Before Git or SVN commands, confirm the repository type and root; use the
  matching version-control tool and repeat this check when switching repos.
- Read the diff, then the code it touches: callers of every changed function,
  the functions it calls, the tests, the README.
- Trace the real flow: where data comes in, what is stored, what goes out.
- A change can break code it does not touch. When a signature, return value
  or behavior changes, use bounded `rg` searches for affected callers, excluding
  `.git`, `.svn`, `node_modules` and project exclusions.
- Find the expected load in the repo (README, deploy config): one person
  running a script, or many users and processes at once. Judge scale against
  that, and say which load you assumed.

## 2. Look for

1. **Bug:** wrong result, crash, missed edge case (empty, zero, last item,
   rounding, time zones), a caller broken by the change, a fix that leaves the
   actual root cause unresolved. Locate the responsible layer; change shared
   code only when its common contract is demonstrably wrong.
2. **Risk:** security holes (injection, weak randomness, secrets, missing
   checks on input from users), data loss (errors swallowed, writes in the
   wrong order, no transaction).
3. **Scale:** fine for one user, wrong for many: check-then-write races, the
   same work done by every process, memory or lists that only grow, a query
   per item, O(n^2) on big input, per-process state that must be shared.
4. **Missing test:** a concrete coverage gap in risky changed behavior (a
   parser, money, security or data writes). Do not treat every branch or bug
   fix as requiring a new test. Respect project rules and the user's boundaries
   on adding and running tests; report material verification limits separately.
5. **Speed:** big slowdowns are problems. Small wins (work repeated in a hot
   loop) are suggestions; some software counts every millisecond.
6. **Lean:** code that should not exist or should be smaller.
   - delete: dead code, unused options, speculative features
   - reuse: the repo already has this helper (name the path)
   - stdlib / native: the standard library or platform already does it; a
     new dependency for a few lines
   - yagni: abstraction with one implementation, config nobody sets
   - merge: near-copies that must change together
   - split: one function doing several unrelated jobs, so it is hard to read
     or test. Split by job, never by line count, and never into helpers that
     exist only to make a function shorter.

## 3. Check before you report

- Every finding needs a concrete case: "this input or situation leads to this
  wrong result". No case, no finding.
- Re-read the lines and confirm: the caller exists, the value can really be
  empty, the code really is unused.
- A `shortcut:` (or older `ponytail:`) comment is evidence of a tradeoff, not
  an exemption. Verify its limit against authorization, security, data integrity,
  business contracts, compatibility and actual load. Report concrete defects
  even when commented; do not repeat a reasonable tradeoff as a finding.
- Propose the smallest fix that works. Prefer fixes that delete code. Never
  add layers, frameworks or config the problem does not need.
- Fix the layer that owns the root cause, not shared code by default. Comments
  should explain non-obvious reasons, interface constraints and business meaning;
  a shortcut comment must name its real limit and revisit trigger, not excuse a defect.
- No style taste, no "consider", no vague worries.

## 4. Output

默认使用简明中文；用户明确指定其他语言或格式时遵从。Explain a technical
term the first time you use it. The reader may never have seen this code.

Start with `本次改动：` in two or three sentences.

Then the findings in three groups, skip empty groups:
- **必须修复：** bug, security, data loss, breaks at the expected load.
- **建议修复：** a material coverage gap, real slowness, duplication, a
  function that mixes jobs, code that should not exist.
- **可选优化：** small speed-ups, shorter forms.

Number findings across all groups, so the user can say "fix 2 and 5".
Every finding has all four parts, each one or two short sentences:

2. **订单被归入错误日期** (`billing/close_day.py:L40-52`)
   - **作用：** 任务在午夜结算当天订单。
   - **问题：** 它使用 UTC 服务器日期，柏林时间 00:30 的订单被归到前一天。
   - **修复：** 按商店时区计算日期：`datetime.now(ZoneInfo("Europe/Berlin")).date()`。
   - **不修复的影响：** 订单日期错误，需要财务手工调整。

End with:
- `结论：可以交付。` or `结论：先修复第 1、3 项。`
- `可精简：约 <N> 行。` when lean findings exist.
- `未验证：` one line, if something mattered and you could not check it.

Nothing found: `本次改动：`, then `未发现需要修复的问题，可以交付。` and one line
on what you checked.

Lists findings, changes no code.
