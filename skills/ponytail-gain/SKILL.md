---
name: ponytail-gain
description: >
  Show ponytail's measured savings (code, cost, speed) from the benchmark.
  One-shot display. Use for /ponytail-gain, "what does ponytail save",
  "ponytail impact".
---

# Ponytail 实测收益

Display this scoreboard when invoked. One-shot: do NOT change mode, write flag
files, or persist anything.

Respect the user's scope, language and format, and applicable project rules.
Default to Chinese. Read and report only; do not add test files or ledgers
unless explicitly requested. Necessary tests, checks and builds must respect
authorization and project restrictions; inspect side effects first. Do not
start frontend or backend development services without an explicit request.
Do not run code-map tools by default. Before Git or SVN commands, confirm the
repository type and root.

The figures are the published agentic benchmark of Ponytail 5: headless Claude
Code (Opus 5.5, default effort) on 39 tasks (feature tickets in a real FastAPI +
React repo, bug fixes, security and privacy cases, small apps), 5 runs each,
against the same agent without the skill. 18 of the tasks have hidden checks
for correctness and safety. Each figure is the geometric mean of the per-task
medians. They are measured, not computed from the current repo.
Source: `benchmarks/results/2026-10-07-agentic.md` and the README.

## 实测数据

Render plain ASCII bars. The bar length shows ponytail as a share of the
no-skill baseline; the label carries the exact figure:

```
  Ponytail 实测收益       基准测试 · 39 项任务 × 5 次运行 · Opus 5.5

  无技能基线      ████████████████████  100%
  代码行数        █████████···········   47%   ▼ 53%
  输出词元        ███████████·········   55%   ▼ 45%
  成本            ███████████████·····   74%   ▼ 26%
  时间            ████████████········   59%   ▼ 41%
  隐藏检查通过率   97%（无技能基线 96%）
  需要测试的逻辑有测试覆盖   98%（无技能基线 68%）

  当前仓库： /ponytail-debt （已记录的简化取舍）
             /ponytail-audit（仍可精简的内容）
```

## Honesty boundary

These are benchmark averages, not this repo. NEVER print a per-repo savings
number ("you saved X lines/tokens here"): the unbuilt version was never
written, so there is no real baseline to subtract from in a live repo. The
only real per-repo figures come from `/ponytail-debt` (a counted ledger), and
this card points there instead of inventing one.

## Boundaries

One-shot display. Edits nothing, changes no mode.
