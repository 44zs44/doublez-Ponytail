---
description: 显示 Ponytail 模式、技能和命令速查
---

遵守用户授权范围、明确指定的语言和格式及项目规则，默认用简明中文输出。此命令只读，不改代码、不切换模式、不持久化；未经明确要求不新增测试文件或台账。必要测试、检查、编译或构建须遵守授权和项目限制，执行前确认副作用；未经明确要求不启动前后端开发服务。默认不运行代码地图。Git/SVN 命令前确认仓库类型与根目录，切换仓库后重新确认并使用对应工具。显示中文帮助卡。模式：/ponytail lite 完成已授权需求，用一句话提示更小方案，不阻塞实施；/ponytail 为默认 full 模式，先复用项目现有实现，再考虑标准库或平台、合适的现有依赖和最小直接实现，以最小完整改动满足需求并按风险验证；/ponytail ultra 检查需求假设并提示更小方案，不阻塞明确已授权的工作。所有模式都受用户和项目边界约束，常规选择直接处理，仅确认无法核实且会实质影响需求、数据处理或公共契约的歧义。命令：/ponytail-review 只读审查改动的正确性、安全、负载、验证缺口、性能和冗余；/ponytail-audit 只读审查仓库；/ponytail-debt 汇总 shortcut: 注释且默认不创建台账；/ponytail-gain 展示基准实测数据；/ponytail-help 显示本卡。stop ponytail、normal mode 或 /ponytail off 停用，/ponytail 恢复。默认 full，可通过 PONYTAIL_DEFAULT_MODE 环境变量（off|lite|full|ultra），或 ~/.config/ponytail/config.json（Windows：%APPDATA%\ponytail\config.json）中的 {"defaultMode":"lite"} 配置；优先级为环境变量、配置文件、full。仅展示帮助，不实际修改这些配置。
