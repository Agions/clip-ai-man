# ManGa AI 文档

## 项目简介

ManGa AI — AI 漫剧视频智能创作平台，将小说/剧本自动转化为高质量动态漫剧视频。

## 功能特性

- 多形式导入 - 支持小说/剧本/AI提示词
- 多模型 AI - GPT-4 / Claude / 通义千问 / 文心一言
- 角色一致性 - 全剧角色形象统一
- 智能分镜 - 自动生成漫画分镜
- 语音合成 - Edge TTS / 阿里云 / 百度等多平台
- 成本控制 - 实时 API 消耗统计

## 7步工作流

```
导入 → 生成 → 分镜 → 角色 → 渲染 → 合成 → 导出
```

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Vite |
| UI | Ant Design 5 |
| 状态 | Zustand |
| 桌面 | Tauri (Rust) |

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建桌面端
npm run tauri build
```

## 文档目录

- [安装指南](./installation.md)
- [使用教程](./guide.md)
- [API 参考](./api.md)
- [配置说明](./config.md)

## 更新日志

See [CHANGELOG](../CHANGELOG.md)

## 许可证

MIT License
