# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0] - 2026-02-28

### 🔀 n8n 风格工作流编辑器

全新可视化节点编辑器，提供类似 n8n 的拖拽式工作流设计体验。

**核心组件**：
- `src/core/workflow/types.ts` - 完整类型定义
- `src/core/workflow/node-registry.ts` - 25+ 节点注册表
- `src/core/workflow/engine.ts` - 执行引擎
- `src/core/workflow/manager.ts` - 工作流管理器
- `src/core/workflow/store.ts` - Zustand 状态管理
- `src/pages/workflow-editor/` - 可视化编辑器

**编辑器功能**：
- ✅ 拖拽式节点编辑
- ✅ 贝塞尔曲线连接线
- ✅ 滚轮缩放/Alt+拖动平移
- ✅ 撤销/重做（Ctrl+Z/Y）
- ✅ 复制/粘贴节点
- ✅ 工作流导入/导出（JSON）
- ✅ 节点参数动态配置
- ✅ 执行状态可视化

**25+ 节点类型**：

| 分类 | 节点 |
|------|------|
| 触发器 | manual, schedule, webhook |
| AI | chat, script, analyze |
| 图像 | generate, edit, upscale |
| 视频 | generate, edit, merge |
| 音频 | tts, music, merge |
| 数据 | input, transform, merge, filter, code |
| 流程 | condition, loop, parallel, delay |
| 输出 | export, save |

**高级特性**：
- 条件分支与循环控制
- 并行执行
- 错误重试机制（指数退避）
- 超时控制
- 节点参数验证
- 表达式求值（`{{json.field}}`）

### 🔧 服务层增强

- `ai.service.ts` - 新增 `chat()`, `analyzeText()` 方法
- `generation.service.ts` - 新增 `generateImages()`, `generateVideo()` 简化接口
- `ffmpeg.service.ts` - 新增 `mergeVideos()`, `processVideo()`, `mergeAudioVideo()` 等方法

### 🗑️ 代码清理

- 删除旧的 `src/core/services/workflow/` 目录
- 删除旧的 `src/components/business/WorkflowManager/` 组件
- 更新 Workflow 页面使用新编辑器

## [2.0.0] - 2026-02-22

### 🎉 项目重命名
- 漫剧师 (Manjushi) → **ClipAiMan (ClipAiMan)**
- 全新品牌标识、ASCII Art Logo
- 更新所有配置、代码注释、文档引用

### ✨ 工作流引擎升级
- **Step 6 场景渲染**: 完整实现，融合角色外观 + 分镜 Prompt 生成渲染描述
- **Step 7 动态合成**: 镜头运动系统（推拉摇移）、Ken Burns 效果、转场逻辑
- **Step 8 配音配乐**: 对白收集 + 角色配音映射 + 氛围 BGM 匹配
- **Step 9 导出发布**: 时间轴编排、多轨合成配置、导出参数（格式/分辨率/编码）

### 📝 文档重写
- README.md 全面重写，专业排版
- 9步工作流每步标注输入→处理→输出
- Mermaid 技术架构图
- 快速开始指南

### 🔧 代码改进
- 存储 key 前缀从 `cineforge_` 更新为 `inkmotion_`
- Tauri bundle identifier 更新为 `com.inkmotion.app`
- 版本号升级至 2.0.0

## [1.1.0] - 2026-02-17

### Renamed
- **Project Name**: Nova → 漫剧师 (Manjushi)
  - New ASCII art logo
  - Updated all documentation references
  - GitHub: https://github.com/Agions/Manjushi

### Added
- **8-Step Drama Workflow**: Novel → Script → Storyboard → Character → Scene → Animation → Voiceover → Export
- **Novel Parser**: Automatic novel-to-script conversion with character extraction
- **Storyboard Generator**: AI-powered panel generation from script scenes
- **Character Consistency**: Character appearance and personality management
- **Drama Style System**: Genre/tone/pacing/art style management for comic dramas
- **Vision Service**: Advanced scene detection, object detection (10 classes), 5-dimension emotion analysis
- **Novel Service**: Parse novels, convert to scripts, generate storyboards

### Updated
- **LLM Models (2026 Latest)**:
  - Baidu ERNIE 5.0 (2026-01)
  - Alibaba Qwen 3.5 (2026-01)
  - Moonshot Kimi k2.5 (2025-07)
  - Zhipu GLM-5 (2026-01)
  - MiniMax M2.5 (2025-12)
- **Constants**: Centralized LLM_MODELS with accurate pricing and capabilities
- **AI Service**: Model recommendation and info query methods
- **ModelSelector**: Updated to use new model configuration

### Technical
- Added `useNovel` hook for novel parsing and script generation
- Added `useConsistency` hook for character and style management
- Added `novel.service.ts` for novel-to-script conversion
- Added `consistency.service.ts` for character consistency
- Added `drama.workflow.service.ts` for drama generation workflow
- Added `vision.service.ts` for video analysis

## [1.0.0] - 2026-02-17

### Added
- Initial release of 漫剧师
- AI-powered video content creation platform
- Support for 8 major AI providers (OpenAI, Anthropic, Google, Baidu, Alibaba, Zhipu, iFlytek, Tencent)
- Professional video upload and analysis
- AI script generation with multiple styles and tones
- Video export with subtitle support
- Multi-language support (Chinese, English)
- Dark mode support
- Local storage management
- FFmpeg integration for video processing

### Features
- **Model Selector**: Smart AI model selection with cost estimation
- **Novel Parser**: Upload and parse novels (TXT/EPUB/PDF)
- **Script Generator**: AI-powered script generation from novels
- **Storyboard Generator**: Automatic storyboard creation from scripts
- **Character Designer**: AI character generation with consistency
- **Project Management**: Complete project lifecycle management
- **Storage Service**: Persistent local storage for projects and settings

### Technical
- React 18 + TypeScript + Vite
- Ant Design 5 + Framer Motion
- Tauri for desktop application
- Zustand for state management
- Modular architecture with service layer

## [0.1.0] - 2026-02-16

### Added
- Project initialization
- Basic project structure
- TypeScript configuration
- Development environment setup
