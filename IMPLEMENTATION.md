# ManGaAI 功能实现总结

## 实现时间
2026-02-26

## 核心功能

### 1. AI 对话模型（6 个国产模型）

| 厂商 | 模型 | 状态 |
|------|------|------|
| 百度 | ERNIE 5.0 | ✅ |
| 阿里 | Qwen 3.5 | ✅ |
| 智谱 | GLM-5 | ✅ |
| 月之暗面 | Kimi k2.5 | ✅ 新增 |
| MiniMax | M2.5 | ✅ 新增 |
| 字节 | 豆包 Pro | ✅ 新增 |

**文件**: `src/core/services/ai.service.ts`

### 2. TTS 语音合成（4 引擎 60+ 音色）

| 引擎 | 音色数 | 特点 |
|------|--------|------|
| Edge TTS | 25+ | 免费，含方言 |
| 阿里云 | 20+ | 需 API Key |
| 百度 | 11 | 需 API Key |
| 讯飞 | 5 | 需 App ID |

**文件**: `src/core/services/tts.service.ts`

### 3. 图像/视频生成（4 个国产模型）

| 厂商 | 模型 | 类型 |
|------|------|------|
| 字节 | Seedream 2.0 | 图像 |
| 字节 | Seedance 2.0 | 视频 |
| 快手 | 可灵 1.6 | 图像+视频 |
| 生数 | Vidu 2.0 | 视频 |

**文件**: `src/core/services/generation.service.ts`

### 4. FFmpeg 视频处理

- 视频分析（时长、分辨率、FPS、编码）
- 提取关键帧
- 生成缩略图
- 视频剪辑（多片段、转场、字幕）
- 预览生成

**文件**: `src/core/services/ffmpeg.service.ts`, `src-tauri/src/main.rs`

### 5. 漫剧工作流（9 步自动化）

1. 剧本创作 - AI 生成剧本
2. 分镜设计 - 剧本转分镜脚本
3. 角色设定 - 提取角色信息
4. 场景生成 - 提取场景信息
5. 图像生成 - 批量生成图像
6. 智能配音 - 生成角色配音
7. 视频生成 - 图生视频
8. 后期剪辑 - 片段管理
9. 导出成品 - 输出最终视频

**文件**: `src/core/services/workflow.service.ts`

## 组件

| 组件 | 功能 | 位置 |
|------|------|------|
| AIImageGenerator | 图像/视频生成 | 工作流页面 |
| FFmpegStatus | FFmpeg 状态检查 | 工作流页面 |
| WorkflowManager | 工作流管理 | 工作流页面 |
| SmartDubbing | 智能配音 | AIPanel |

## 页面

| 页面 | 路径 | 功能 |
|------|------|------|
| 首页 | / | 项目列表 |
| 漫剧工作流 | /workflow | 工作流 + 图像视频生成 |
| 视频剪辑 | /editor | 编辑器 |
| 设置 | /settings | 配置 |

## Git 提交记录

```
909781f refactor: 将图像/视频生成移到工作流页面
7deb3db feat: 集成新功能到主界面
906e0d3 feat: 实现漫剧工作流自动化服务
7690e47 feat: 实现 FFmpeg 视频处理服务
694e0ec feat: 实现 AI 图像/视频生成服务
77bcb9f feat: 实现 TTS 语音合成服务
16d9412 feat: 添加 3 个国产 AI 模型支持
```

## 技术栈

- React 18 + TypeScript 5
- Vite
- Ant Design 5
- Zustand
- Framer Motion
- Tauri
- FFmpeg

## 国产 AI 服务

全部使用国产 AI 服务，符合要求：
- 对话：百度、阿里、智谱、月之暗面、MiniMax、字节
- TTS：Edge（免费）、阿里、百度、讯飞
- 图像：字节、快手
- 视频：字节、快手、生数
