# ManGaAI 项目功能分析与完善建议

## 📊 项目现状分析

### 核心功能模块

| 模块 | 状态 | 描述 |
|------|------|------|
| 🏠 首页/仪表盘 | ✅ 已实现 | 项目列表、快捷操作、统计信息 |
| 📝 项目管理 | ✅ 已实现 | 创建、编辑、删除项目 |
| 🎬 视频编辑器 | ✅ 已实现 | 时间轴、预览、素材面板 |
| 🤖 AI 模型配置 | ⚠️ 部分实现 | UI 完成，API 集成待完善 |
| 📖 脚本生成 | ✅ 已实现 | AI 剧本生成、模板支持 |
| 🎭 角色一致性 | ✅ 已实现 | 角色形象管理 |
| 🎨 场景渲染 | ⚠️ 部分实现 | 框架存在，渲染引擎待集成 |
| 🎤 语音合成 | ⚠️ 部分实现 | TTS 配置 UI，实际合成待完善 |
| 📤 导出功能 | ⚠️ 部分实现 | 导出设置 UI，后端处理待完善 |
| ⚙️ 系统设置 | ✅ 已实现 | API 密钥、偏好设置 |

### 技术架构

```
前端: React 18 + TypeScript 5 + Vite + Ant Design 5
状态: Zustand
动画: Framer Motion
桌面: Tauri (Rust)
存储: LocalStorage (前缀: inkmotion_)
```

---

## 🔴 高优先级 - 核心功能完善

### 1. AI 服务集成（国产模型）

**现状**: 
- ✅ 已实现：百度 ERNIE、阿里通义千问、智谱 GLM
- ❌ 缺少：月之暗面 Kimi、MiniMax、字节豆包

**已支持的国产模型**（2026年2月）：
| 厂商 | 模型 | 状态 | API 端点 |
|------|------|------|----------|
| 百度 | ERNIE 5.0 | ✅ 已实现 | `aip.baidubce.com` |
| 阿里 | Qwen 3.5 | ✅ 已实现 | `dashscope.aliyuncs.com` |
| 智谱 | GLM-5 | ✅ 已实现 | `open.bigmodel.cn` |
| 月之暗面 | Kimi k2.5 | ❌ 待实现 | `api.moonshot.cn` |
| MiniMax | M2.5 | ❌ 待实现 | `api.minimax.chat` |
| 字节 | 豆包 | ❌ 待实现 | `ark.cn-beijing.volces.com` |

**需要补充的 API 实现**：

```typescript
// src/core/services/ai.service.ts

/**
 * 月之暗面 Kimi API
 * 文档: https://platform.moonshot.cn/docs/api/chat
 */
private async callMoonshot(apiKey: string, config: RequestConfig): Promise<AIResponse> {
  const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: config.model, // 'kimi-k2.5'
      messages: config.messages,
      temperature: config.temperature,
      max_tokens: config.max_tokens,
      stream: config.stream
    })
  });
  // ...
}

/**
 * MiniMax API
 * 文档: https://www.minimaxi.com/document/ChatCompletion
 */
private async callMinimax(apiKey: string, config: RequestConfig): Promise<AIResponse> {
  const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: config.model, // 'minimax-m2.5'
      messages: config.messages,
      temperature: config.temperature,
      max_tokens: config.max_tokens
    })
  });
  // ...
}

/**
 * 字节豆包 API
 * 文档: https://www.volcengine.com/docs/82379/1263482
 */
private async callDoubao(apiKey: string, config: RequestConfig): Promise<AIResponse> {
  const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: config.model, // 'doubao-pro-32k'
      messages: config.messages,
      temperature: config.temperature,
      max_tokens: config.max_tokens
    })
  });
  // ...
}
```

**关键文件**:
- `src/core/services/ai.service.ts` - 添加缺失的 3 个国产模型
- `src/core/constants/index.ts` - 模型配置已存在

### 2. 视频处理后端

**现状**: FFmpeg 检查是模拟的，没有实际视频处理能力

**建议实现**:
```rust
// src-tauri/src/main.rs 增强
- 集成 FFmpeg 命令调用
- 视频转码、剪辑、合并
- 缩略图生成
- 视频信息提取（时长、分辨率、码率）
```

### 3. 语音合成 (TTS)

**现状**: 有 TTS 配置界面，缺少实际语音生成

**建议实现**:
```typescript
// 新增 core/services/tts.service.ts
- Edge TTS 集成（免费）
- 阿里云/百度/讯飞 TTS API
- 语音缓存机制
- 批量生成支持
```

---

## 🟡 中优先级 - 功能增强

### 4. 工作流引擎优化

**现状**: 9步工作流有 UI 展示，缺少状态管理和自动化

**建议**:
```typescript
// 增强 core/services/drama.workflow.service.ts
- 工作流状态持久化
- 步骤间数据传递
- 断点续传
- 批量任务队列
- 进度实时推送
```

### 5. 图像/视频生成集成

**现状**: README 提到国产模型，但代码中缺少集成

**国产生成模型**（2026年2月）：
| 类型 | 厂商 | 模型 | API 状态 |
|------|------|------|----------|
| 图像 | 字节 | Seedream 5.0 | 待集成 |
| 图像 | 快手 | 可灵 1.6 | 待集成 |
| 视频 | 字节 | Seedance 2.0 | 待集成 |
| 视频 | 生数 | Vidu 2.0 | 待集成 |
| 视频 | 快手 | 可灵 1.6 | 待集成 |

**建议**:
```typescript
// 新增 core/services/generation.service.ts
- 字节 Seedream/Seedance API
- 快手可灵 API
- 生数 Vidu API
- 生成任务队列管理
- 结果回调处理
```

### 6. 数据持久化增强

**现状**: 使用 LocalStorage，不适合大项目

**建议**:
```typescript
// 增强 storage.service.ts
- IndexedDB 支持（大文件存储）
- 项目文件系统存储
- 自动备份机制
- 数据导入/导出
```

---

## 🟢 低优先级 - 体验优化

### 7. 国际化完善

**现状**: 有 i18n 依赖，但缺少多语言文件

**建议**:
```typescript
// 完善 locales/
- 中文（完整）
- 英文（完整）
- 日语（可选）
```

### 8. 快捷键系统

**建议**:
```typescript
// 新增 hooks/useKeyboard.ts
- 编辑器快捷键（复制、粘贴、撤销）
- 播放控制（空格播放/暂停）
- 自定义快捷键配置
```

### 9. 主题系统增强

**现状**: 有明暗主题，缺少自定义

**建议**:
- 主题色自定义
- 更多预设主题
- 跟随系统主题

---

## 📋 具体任务清单

### 第一阶段：AI 国产模型完善（本周）

- [ ] 补充 3 个缺失的国产模型 API
  - [ ] 月之暗面 Kimi k2.5
  - [ ] MiniMax M2.5
  - [ ] 字节豆包
- [ ] 更新模型选择器 UI
- [ ] 添加流式响应支持
- [ ] 添加 Token 用量统计

### 第二阶段：TTS 服务（下周）

- [ ] Edge TTS（免费方案）
- [ ] 阿里云 TTS
- [ ] 百度 TTS
- [ ] 讯飞 TTS

### 第三阶段：视频/图像生成（后续）

- [ ] 字节 Seedream（图像）
- [ ] 快手可灵（图像/视频）
- [ ] 字节 Seedance（视频）
- [ ] 生数 Vidu（视频）

---

## 💡 架构建议

### 推荐新增目录结构

```
src/
├── core/
│   ├── services/
│   │   ├── ai/              # AI 服务拆分
│   │   │   ├── baidu.ts     # 百度 ERNIE
│   │   │   ├── alibaba.ts   # 阿里通义
│   │   │   ├── zhipu.ts     # 智谱 GLM
│   │   │   ├── moonshot.ts  # 月之暗面 Kimi ⭐ 新增
│   │   │   ├── minimax.ts   # MiniMax ⭐ 新增
│   │   │   └── doubao.ts    # 字节豆包 ⭐ 新增
│   │   ├── tts/             # TTS 服务
│   │   │   ├── edge.ts
│   │   │   ├── aliyun.ts
│   │   │   └── baidu.ts
│   │   └── generation/      # 生成服务
│   │       ├── seedream.ts  # 字节图像
│   │       ├── seedance.ts  # 字节视频
│   │       ├── kling.ts     # 快手
│   │       └── vidu.ts      # 生数
│   └── workers/             # Web Workers
│       ├── ai.worker.ts
│       └── video.worker.ts
├── locales/                 # 国际化
│   ├── zh-CN.ts
│   └── en-US.ts
└── hooks/
    ├── useKeyboard.ts       # 快捷键
    └── useWorker.ts         # Worker 管理
```

---

## 🎯 下一步建议

根据项目现状，建议按以下顺序进行：

1. **立即开始**: 补充 3 个缺失的国产 AI 模型（Kimi、MiniMax、豆包）
2. **本周完成**: TTS 服务（Edge TTS 免费方案）
3. **下周开始**: 国产图像/视频生成模型集成
4. **后续**: 工作流自动化和体验优化

**当前最优先任务**: 在 `ai.service.ts` 中添加 `callMoonshot`、`callMinimax`、`callDoubao` 三个方法。

需要我立即开始实现吗？
