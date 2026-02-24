```
   __  __         _          ____ ___ _____
  |  \/  |__   __| |__  _   / ___|_ _|_   _|
  | |\/| '_ \ / _` '_ \| | |  \___ \| | | | |
  | |  | | | | (_| | | | |_| |___) | | |_| |
  |_|  |_| |_|\__,_| |_|\___/|____/|___|\__, |
                                        |___/
```

<p align="center">
  <strong>ManGa AI — AI 漫剧视频智能创作平台</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.1.0-blue.svg" alt="Version" />
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-18-61dafb?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tauri-2.0-ffc131?logo=tauri" alt="Tauri" />
  <img src="https://img.shields.io/badge/Vite-4-646cff?logo=vite" alt="Vite" />
</p>

---

## 📖 简介

**ManGa AI** 是一款专业的 AI 漫剧视频智能创作平台，将小说/漫画内容自动转化为高质量动态漫剧视频。通过 10 步智能工作流，覆盖从文本输入到视频导出的完整创作链路。

> 🎬 **产品定位**：漫剧视频生成（漫画/动漫剧集） ≠ 解说短剧
>
> 📝 **更名历史**：ReelForge → Nova → 漫剧师 → **ManGa AI** (2026-02-22)

### ✨ 核心优势

- 🤖 **多模型智能调度** — 自动选择最优 AI 模型，支持 OpenAI / Anthropic / 百度 / 阿里 / 智谱
- 🎭 **角色一致性引擎** — 全剧角色形象、表情、风格、声音保持统一
- 🔒 **原创性保障** — 内容指纹 + 语义去重 + 模板检测，杜绝重复
- 💰 **成本可控** — 实时 Token 统计与 API 用量追踪
- 🎤 **对口型同步** — Wav2Lip / SadTalker / 基础三种模式
- 📦 **桌面端支持** — Web / Desktop (Tauri) 跨平台
- 📋 **丰富模板** — 分镜/场景/角色/风格预置模板
- 🛡️ **稳定可靠** — 重试机制 + 检查点保存 + 智能缓存

---

## 🔄 7 步智能工作流

ManGa AI 的核心是一条完整的 7 步漫剧创作流水线。

```
导入 → 生成 → 分镜 → 角色 → 渲染 → 合成 → 导出
```

### Step 1: 📥 导入

| 项目 | 说明 |
|------|------|
| **支持格式** | TXT / EPUB / PDF / JSON |
| **导入方式** | 小说文件 / 剧本文件 / AI提示词 |
| **处理** | 文件解析、编码检测、智能分章、角色提取 |

### Step 2: 🤖 生成

| 项目 | 说明 |
|------|------|
| **AI模型** | GPT-4 / Claude 3 / 通义千问 / 文心一言 |
| **集数** | 1-200 集可选 |
| **剧本风格** | 标准格式 / 戏剧化 / 漫画分镜式 |

### Step 3: 🎬 分镜

| 项目 | 说明 |
|------|------|
| **画面比例** | 竖屏(9:16) / 横屏(16:9) / 方形(1:1) |
| **分辨率** | 720p / 1080p / 4K |
| **镜头数** | 每场景 1-9 个镜头 |
| **处理** | 按章节拆解为场景；生成对白、动作描写、场景描述；估算时长 |
| **输出** | `Script` — 场景化剧本（含角色列表、场景序列、预估总时长） |

### Step 4: 🎬 智能分镜

| 项目 | 说明 |
|------|------|
| **输入** | `Script` 剧本场景 |
| **处理** | AI 拆解每个场景为分镜面板；指定镜头类型（远/中/近/特写）、角度、运动方式 |
| **输出** | `Storyboard[]` — 分镜脚本（含构图描述、镜头语言、AI 绘图 Prompt） |

### Step 5: 🎭 角色设计

| 项目 | 说明 |
|------|------|
| **输入** | 角色列表 + 角色描述 |
| **处理** | AI 生成角色形象；一致性引擎确保全剧风格统一；支持手动调整 |
| **输出** | `Character[]` — 角色卡（外观、表情、性格、配音参数、参考图） |

### Step 6: 🖼️ 场景渲染

| 项目 | 说明 |
|------|------|
| **输入** | 分镜脚本 + 角色卡 |
| **处理** | 根据分镜 Prompt 调用图像生成 API；漫画风格渲染；背景与角色合成 |
| **输出** | 渲染后的场景图片序列 |

### Step 7: 🎞️ 动态合成

| 项目 | 说明 |
|------|------|
| **输入** | 场景图片 + 分镜参数 |
| **处理** | 镜头推拉摇移、表情动画、转场效果 |
| **输出** | 动画片段序列 |

### Step 4: 👤 角色

| 项目 | 说明 |
|------|------|
| **风格** | 日漫 / 美漫 / 国漫 / 写实 |
| **一致性** | 角色形象全剧统一 |
| **表情** | 3-12 种表情变化 |

### Step 5: 🎨 渲染

| 项目 | 说明 |
|------|------|
| **引擎** | 快速 / 高质量 / 实时预览 |
| **背景** | AI生成 / 模板库 / 自定义 |
| **光照** | 自动 / 明亮 / 氛围 / 戏剧化 |

### Step 6: ✨ 合成

| 项目 | 说明 |
|------|------|
| **动画** | 对口型 / 肢体动作 / 全身动画 |
| **帧率** | 24fps / 30fps / 60fps |
| **语音** | Edge TTS / Azure / 阿里云 / 百度 / 腾讯 / 讯飞 |
| **配音** | 5+ 音色可选，语速/音调可调 |
| **音乐** | 背景音乐 + 音量控制 |

### Step 7: 📤 导出

| 项目 | 说明 |
|------|------|
| **格式** | MP4 / WebM / MOV |
| **质量** | 低 / 中 / 高 |
| **字幕** | 3 种样式可选 |
| **分集** | 支持分集导出 |

---

## 🎛️ 工作流配置

每个步骤都支持详细参数配置：

| 步骤 | 可配置项 |
|------|----------|
| 📥 导入 | 导入类型、文件编码、智能分章、提取角色 |
| 🤖 生成 | AI模型、集数、剧本风格、对白详细度、自动审核 |
| 🎬 分镜 | 画面比例、分辨率、镜头数、转场风格、镜头运动 |
| 👤 角色 | 角色风格、一致性引擎、表情/姿态变化、服装、声线 |
| 🎨 渲染 | 渲染引擎、背景风格、光照、色调、质量 |
| ✨ 合成 | 动画类型、帧率、TTS提供商、音色、语速、BGM |
| 📤 导出 | 视频格式、质量、字幕、水印、分集导出 |

### 语音合成支持

| 提供商 | 特点 |
|--------|------|
| Edge TTS | 免费、音色丰富 |
| Azure TTS | 高质量合成 |
| 阿里云 TTS | 中文优势 |
| 百度 TTS | 中文优势 |
| 腾讯云 TTS | 中文优势 |
| 讯飞 TTS | 多语言支持 |

---

## 🤝 参与贡献
|------|------|
| **输入** | 剧本对白 + 角色配音参数 + 场景氛围 |
| **处理** | TTS 多角色语音合成；AI 匹配背景音乐；音效叠加；音频混音 |
| **输出** | 完整音轨（对白 + BGM + SFX） |

### Step 9: 🎤 对口型 (新增)

| 项目 | 说明 |
|------|------|
| **输入** | 音频 + 角色参考图 |
| **处理** | Wav2Lip / SadTalker / 基础口型动画 |
| **输出** | 对口型视频片段 |

### Step 10: 📦 导出发布

| 项目 | 说明 |
|------|------|
| **输入** | 动画序列 + 音轨 |
| **处理** | 时间轴编排、音画同步、格式编码、分辨率调整 |
| **输出** | 成品视频文件（MP4 / WebM / MOV，480p ~ 4K） |

---

## 🏗️ 技术架构

```mermaid
graph TB
    subgraph Frontend["前端 (React 18 + TypeScript)"]
        Pages[页面层<br/>Home / Workflow / Editor / Settings]
        Components[组件层<br/>ModelSelector / StoryboardGenerator / CharacterDesigner]
        Hooks[Hooks 层<br/>useWorkflow / useModel / useProject / useNovel]
    end

    subgraph Core["核心层"]
        Services[服务层]
        Stores[状态管理 Zustand]
        Types[类型系统]
    end

    subgraph Services_Detail["服务详情"]
        AI[AI Service<br/>多模型调度]
        Novel[Novel Service<br/>小说解析/剧本/分镜]
        Video[Video Service<br/>视频处理/导出]
        LipSync[Lip Sync Service<br/>对口型处理]
        Consistency[Consistency Service<br/>角色一致性]
        Originality[Originality Service<br/>原创性检测]
        Template[Template Service<br/>模板系统]
        Workflow[Workflow Service<br/>10步流水线]
        Cost[Cost Service<br/>成本追踪]
        Storage[Storage Service<br/>本地持久化]
    end

    subgraph Platform["平台适配"]
        Web[Web 端]
        Desktop[Desktop 端 Tauri]
    end

    Pages --> Components --> Hooks --> Services
    Services --> Services_Detail
    Services_Detail --> Platform
    Stores --> Hooks
    Types --> Services_Detail
```

---

## 🤖 支持的 AI 模型 (2026)

| 提供商 | 模型 | 用途 |
|--------|------|------|
| **OpenAI** | GPT-5 | 剧本生成、分镜设计 |
| **Anthropic** | Claude 4 | 小说解析、角色设计 |
| **百度** | ERNIE 5.0 | 中文剧本优化 |
| **阿里** | Qwen 3.5 | 通用文本生成 |
| **智谱** | GLM-5 | 多模态理解 |

---

## 🚀 快速开始

### 环境要求

- Node.js ≥ 18
- pnpm 或 npm
- Rust (Tauri 桌面端需要)

### 安装运行

```bash
# 克隆项目
git clone https://github.com/Agions/clip-ai-man.git
cd clip-ai-man

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动 Tauri 桌面应用
npm run tauri dev
```

### 配置 API 密钥

进入 **设置页面**，配置至少一个 AI 模型的 API 密钥即可开始使用。

---

## 📁 项目结构

```
src/
├── core/                       # 核心层
│   ├── api/client.ts           # 统一 HTTP 请求客户端
│   ├── config/                 # 配置文件
│   ├── constants/              # 全局常量
│   ├── hooks/                  # 业务 Hooks
│   │   ├── useWorkflow.ts     # 工作流管理
│   │   ├── useModel.ts        # 模型选择
│   │   ├── useProject.ts      # 项目管理
│   │   └── useNovel.ts        # 小说处理
│   ├── services/               # 业务服务 ⭐
│   │   ├── drama.workflow.service.ts    # 10步工作流引擎
│   │   ├── enhanced-drama-workflow.service.ts  # 增强版工作流
│   │   ├── novel.service.ts    # 小说解析/剧本/分镜
│   │   ├── ai.service.ts      # 多模型 AI 调度
│   │   ├── lip-sync.service.ts # 对口型服务
│   │   ├── consistency.service.ts  # 角色一致性
│   │   ├── enhanced-consistency.service.ts  # 增强一致性
│   │   ├── originality.service.ts  # 原创性检测
│   │   ├── drama-template.service.ts  # 漫剧模板
│   │   ├── video.service.ts   # 视频处理/FFmpeg
│   │   ├── cost.service.ts   # 成本追踪
│   │   └── storage.service.ts # 本地存储
│   ├── stores/                 # Zustand 状态管理
│   ├── types/                 # 类型定义
│   └── utils/                 # 工具函数
│       └── platform.ts        # 多端平台适配
├── components/                 # UI 组件
│   ├── business/               # 业务组件
│   └── common/                # 通用组件
├── pages/                     # 页面
│   ├── Home.tsx               # 首页
│   ├── Workflow/index.tsx     # 10步工作流页面
│   ├── Editor/                # 分镜编辑器
│   └── Settings.tsx           # 设置
└── context/                   # React Context

src-tauri/                     # Tauri 桌面端 (Rust)
```

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **前端框架** | React 18 + TypeScript 5 |
| **构建工具** | Vite 4 |
| **UI 组件** | Ant Design 5 |
| **状态管理** | Zustand 4 |
| **动画** | Framer Motion |
| **桌面端** | Tauri (Rust) |
| **代码规范** | ESLint + Prettier |
| **包管理** | pnpm / npm |

---

## 📋 核心服务

| 服务 | 功能 |
|------|------|
| `drama.workflow` | 10步工作流引擎 |
| `enhanced-drama-workflow` | 增强版工作流 (重试/缓存/检查点/并行) |
| `novel` | 小说解析/剧本/分镜 |
| `ai` | 多模型 AI 调度 |
| `lip-sync` | 对口型处理 (Wav2Lip/SadTalker/basic) |
| `consistency` | 角色一致性 |
| `enhanced-consistency` | 增强一致性 (表情/风格/声音) |
| `originality` | 原创性检测 (指纹/去重/模板) |
| `drama-template` | 漫剧模板系统 |
| `video` | 视频处理/FFmpeg |
| `cost` | 成本追踪 |
| `storage` | 本地存储 |
| `platform` | 多端平台适配 |

---

## 🤝 参与贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing-feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

### 提交规范

- `feat:` 新功能
- `fix:` 修复
- `docs:` 文档
- `refactor:` 重构
- `style:` 样式
- `test:` 测试
- `perf:` 性能优化

---

## 📄 许可证

本项目采用 [MIT License](./LICENSE) 开源。

---

<p align="center">
  <strong>ManGa AI</strong> — 让每一帧都有灵魂
</p>
