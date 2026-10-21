---
name: ponytail-help
description: >
  Quick reference for ponytail levels, skills and commands. One-shot display.
  Use for /ponytail-help, "ponytail help", "how do I use ponytail".
---

# Ponytail 帮助

Display this reference card when invoked. One-shot, do NOT change mode,
write flag files, or persist anything.

Respect the user's scope, language and format, and applicable project rules.
Default to Chinese. Do not add test files or ledgers unless explicitly requested.
Necessary tests, checks and builds must respect authorization and project
restrictions; inspect side effects first. Do not start frontend or backend
development services without an explicit request. Do not run code-map tools
by default. Before Git or SVN commands, confirm the repository type and root.

## 模式

| 模式 | 命令 | 行为 |
|-------|---------|-------------|
| **Lite** | `/ponytail lite` | 完成已授权需求，用一句话提示更小方案，不阻塞实施。 |
| **Full** | `/ponytail` | 默认模式：最小完整改动，按风险验证，只说明重要验证限制或风险。 |
| **Ultra** | `/ponytail ultra` | 检查需求假设并提示更小方案，不阻塞明确且已授权的工作。 |

模式保持到再次切换或会话结束。任何模式都不能覆盖用户范围和项目规则。
常规选择直接处理；仅当未解决的歧义实质影响需求、数据处理或公共契约时确认。

## 技能

| 技能 | 命令 | 用途 |
|-------|---------|--------------|
| **ponytail** | `/ponytail` | 用最少必要改动完成任务，明确重要限制或风险。 |
| **ponytail-review** | `/ponytail-review` | 只读审查改动的正确性、安全、负载、验证缺口、性能和冗余，说明证据及修复建议。 |
| **ponytail-audit** | `/ponytail-audit` | 只读审查指定范围或整个仓库，按重要性列出发现。 |
| **ponytail-debt** | `/ponytail-debt` | 汇总 `shortcut:` 注释；默认只输出，不创建台账文件。 |
| **ponytail-gain** | `/ponytail-gain` | 展示基准测试测得的代码量、成本和时间变化。 |
| **ponytail-help** | `/ponytail-help` | 显示本帮助。 |

在 Codex CLI 和 IDE 扩展中，使用 `$ponytail:ponytail`、
`$ponytail:ponytail-review` 或 `$ponytail:ponytail-help` 调用技能。
Claude Code 和 OpenCode 使用上面的斜杠命令；OpenCode 提供全部六个命令。

## 停用

说“stop ponytail”或“normal mode”，也可使用 `/ponytail off` 停用。
随时用 `/ponytail` 恢复。

## 状态栏（Claude Code）

`/ponytail band` 切换提示框上方状态栏的显示。
`/ponytail band on` 和 `/ponytail band off` 直接设置显示状态，不改变模式。
`/ponytail band import` 将历史 Claude Code 会话的成本、代理用时和词元导入面板。

## 配置默认模式

默认模式为 `full`，每次会话自动启用。以下是修改方式，仅供展示，不在帮助调用中执行：

**环境变量**（最高优先级）：
```bash
export PONYTAIL_DEFAULT_MODE=ultra
```

**配置文件**（`~/.config/ponytail/config.json`，Windows：`%APPDATA%\ponytail\config.json`）：
```json
{ "defaultMode": "lite" }
```

设置为 `"off"` 可关闭会话开始时自动启用，需要时用 `/ponytail` 手动启用。

优先级：环境变量 > 配置文件 > `full`。

## 更新

启用自动更新：打开 `/plugin`，进入 Marketplaces，选择 ponytail 并启用自动更新。
Claude Code 随后会在启动时获取新版本，提示时运行 `/reload-plugins`。
手动更新：先运行 `/plugin marketplace update ponytail`，再运行 `/reload-plugins`。

若当前 Claude Code 版本不支持 `/plugin`，按其安装方式更新并重启；
例如 `npm install -g @anthropic-ai/claude-code@latest` 或 `brew upgrade claude-code`。
其他宿主使用各自的更新流程。此帮助仅展示方法，不执行更新。

## 更多

完整文档与示例：https://github.com/DietrichGebert/ponytail
