# 工作流系统文档

## 概述

ManGaAI 工作流系统基于 n8n 架构设计，提供可视化的节点式工作流编辑和执行能力。

## 架构设计

### 核心模块

```
src/core/workflow/
├── types.ts           # 类型定义
├── node-registry.ts   # 节点注册表
├── engine.ts          # 执行引擎
├── manager.ts         # 工作流管理
└── store.ts           # 状态管理
```

### 数据结构

工作流使用 n8n 的数据格式：

```typescript
interface NodeData {
  json: Record<string, any>;    // JSON 数据
  binary?: Record<string, {     // 二进制数据
    data: string;               // Base64 编码
    mimeType: string;
    fileName?: string;
  }>;
}
```

## 节点类型

### 触发器节点

| 节点 | 类型 ID | 说明 |
|------|---------|------|
| 手动触发 | `trigger.manual` | 点击执行按钮触发 |
| 定时触发 | `trigger.schedule` | Cron 表达式定时触发 |
| Webhook | `trigger.webhook` | HTTP 请求触发 |

### AI 节点

| 节点 | 类型 ID | 说明 |
|------|---------|------|
| AI 对话 | `ai.chat` | 调用 AI 模型对话 |
| 脚本执行 | `ai.script` | 执行 AI 脚本 |
| 文本分析 | `ai.analyze` | 分析文本内容 |

### 图像节点

| 节点 | 类型 ID | 说明 |
|------|---------|------|
| 图像生成 | `image.generate` | AI 生成图像 |
| 图像编辑 | `image.edit` | 编辑图像 |
| 图像放大 | `image.upscale` | 放大图像分辨率 |

### 视频节点

| 节点 | 类型 ID | 说明 |
|------|---------|------|
| 视频生成 | `video.generate` | AI 生成视频 |
| 视频编辑 | `video.edit` | 剪辑视频 |
| 视频合并 | `video.merge` | 合并多个视频 |

### 音频节点

| 节点 | 类型 ID | 说明 |
|------|---------|------|
| 语音合成 | `audio.tts` | 文本转语音 |
| 音乐生成 | `audio.music` | AI 生成音乐 |
| 音频合并 | `audio.merge` | 合并音频轨道 |

### 数据节点

| 节点 | 类型 ID | 说明 |
|------|---------|------|
| 数据输入 | `data.input` | 输入数据 |
| 数据转换 | `data.transform` | 转换数据格式 |
| 数据合并 | `data.merge` | 合并多条数据 |
| 数据过滤 | `data.filter` | 过滤数据 |
| 代码执行 | `data.code` | 执行自定义代码 |

### 流程控制节点

| 节点 | 类型 ID | 说明 |
|------|---------|------|
| 条件分支 | `flow.condition` | If/Else 条件判断 |
| 循环 | `flow.loop` | 循环处理数据 |
| 并行执行 | `flow.parallel` | 并行执行多个分支 |
| 延迟 | `flow.delay` | 延迟执行 |

### 输出节点

| 节点 | 类型 ID | 说明 |
|------|---------|------|
| 导出 | `output.export` | 导出结果 |
| 保存 | `output.save` | 保存到存储 |

## 使用示例

### 创建工作流

```typescript
import { workflowManager } from '@/core/workflow';

// 创建新工作流
const workflow = workflowManager.createWorkflow('AI 图像生成流程');

// 添加手动触发节点
const trigger = workflowManager.addNode(
  workflow.id,
  'trigger.manual',
  { x: 100, y: 200 }
);

// 添加 AI 对话节点
const chat = workflowManager.addNode(
  workflow.id,
  'ai.chat',
  { x: 350, y: 200 },
  '生成提示词',
  { provider: 'baidu', model: 'ernie-5.0' }
);

// 添加图像生成节点
const imageGen = workflowManager.addNode(
  workflow.id,
  'image.generate',
  { x: 600, y: 200 },
  '生成图像',
  { provider: 'kling', style: 'anime' }
);

// 连接节点
workflowManager.addConnection(workflow.id, trigger.id, 'main', chat.id, 'main');
workflowManager.addConnection(workflow.id, chat.id, 'main', imageGen.id, 'main');

// 执行工作流
await workflowManager.executeWorkflow(workflow.id);
```

### 订阅执行事件

```typescript
const unsubscribe = workflowManager.subscribe((event) => {
  switch (event.type) {
    case 'workflow:start':
      console.log('工作流开始执行');
      break;
    case 'node:start':
      console.log(`节点 ${event.nodeId} 开始执行`);
      break;
    case 'node:complete':
      console.log(`节点 ${event.nodeId} 执行完成`);
      break;
    case 'workflow:complete':
      console.log('工作流执行完成');
      break;
    case 'workflow:error':
      console.error('工作流执行失败:', event.data?.error);
      break;
  }
});

// 取消订阅
unsubscribe();
```

### 导入/导出工作流

```typescript
// 导出为 JSON
const json = workflowManager.exportWorkflow(workflow.id);
console.log(json);

// 导入工作流
const imported = workflowManager.importWorkflow(json);
console.log('导入的工作流:', imported.name);
```

## 执行引擎

### 执行流程

1. **验证工作流** - 检查触发节点、连接有效性、孤立节点
2. **拓扑排序** - 确定节点执行顺序
3. **执行节点** - 按顺序执行，传递数据
4. **错误处理** - 支持重试、继续或停止

### 错误处理策略

| 策略 | 说明 |
|------|------|
| `stop` | 停止工作流执行（默认） |
| `continue` | 忽略错误，继续执行 |
| `continueWithError` | 继续执行并传递错误信息 |

### 重试机制

```typescript
// 节点设置
const nodeSettings = {
  retryOnFail: true,
  retryCount: 3,           // 重试次数
  retryDelay: 1000,        // 初始延迟（毫秒）
  retryBackoff: 'exponential',  // 退避策略
};
```

## 表达式系统

支持在参数中使用表达式：

```typescript
// 引用前一个节点的数据
{{json.title}}

// 引用二进制数据
{{binary.image}}

// 条件表达式
{{json.score > 80 ? '优秀' : '良好'}}
```

## 编辑器组件

### 画布组件

```tsx
import { WorkflowCanvas } from '@/pages/workflow-editor/components/WorkflowCanvas';

<WorkflowCanvas />
```

**功能**：
- 滚轮缩放
- Alt+左键平移
- 点击选择节点
- 拖拽移动节点

### 节点组件

```tsx
import { NodeComponent } from '@/pages/workflow-editor/components/NodeComponent';

<NodeComponent
  node={node}
  isSelected={selectedNodeId === node.id}
  onSelect={() => selectNode(node.id)}
  onMove={(pos) => moveNode(node.id, pos)}
  onConnectionStart={(output) => startConnecting(node.id, output)}
  onConnectionEnd={(input) => handleConnectionEnd(node.id, input)}
/>
```

### 设置面板

```tsx
import { NodeSettingsPanel } from '@/pages/workflow-editor/components/NodeSettingsPanel';

<NodeSettingsPanel nodeId={selectedNodeId} />
```

**配置项**：
- 节点名称
- 参数配置
- 执行一次
- 失败重试
- 超时时间
- 错误处理策略

## 扩展节点

### 创建自定义节点

```typescript
// 1. 定义节点
const customNode: NodeTypeDefinition = {
  type: 'custom.myNode',
  displayName: '自定义节点',
  description: '这是一个自定义节点',
  category: 'data',
  inputs: [{ id: 'main', displayName: '输入', type: 'main' }],
  outputs: [{ id: 'main', displayName: '输出', type: 'main' }],
  parameters: [
    {
      id: 'param1',
      displayName: '参数1',
      type: 'string',
      required: true,
    },
  ],
  executor: async (context) => {
    // 执行逻辑
    const { parameters, getInputData } = context;
    const input = getInputData();
    
    // 返回结果
    return {
      json: { result: 'success' },
    };
  },
};

// 2. 注册节点
NODE_REGISTRY.push(customNode);
```

## 最佳实践

1. **工作流设计** - 从触发器开始，确保有明确的起点
2. **错误处理** - 为关键节点配置重试和超时
3. **数据传递** - 使用 `json` 传递结构化数据，`binary` 传递文件
4. **性能优化** - 使用并行节点处理独立任务
5. **调试** - 添加日志节点监控数据流

## 注意事项

- 工作流执行在浏览器主线程，长时间运行会阻塞 UI
- 大文件处理建议使用 `binary` 字段存储
- API Key 等敏感信息从 `appSettings` 获取，不要硬编码
