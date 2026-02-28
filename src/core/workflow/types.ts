/**
 * 节点式工作流类型定义
 * 基于 n8n 架构设计
 */

// ============================================
// 基础类型
// ============================================

/**
 * 节点位置
 */
export interface NodePosition {
  x: number;
  y: number;
}

/**
 * 节点连接
 */
export interface NodeConnection {
  id: string;
  sourceNodeId: string;
  sourceOutput: string; // 输出端口
  targetNodeId: string;
  targetInput: string; // 输入端口
}

/**
 * 节点端口定义
 */
export interface NodePort {
  id: string;
  name: string;
  displayName: string;
  type: 'input' | 'output';
  dataType: 'json' | 'binary' | 'any';
  required: boolean;
  multiple?: boolean; // 是否允许多个连接
}

/**
 * 节点参数定义
 */
export interface NodeParameter {
  id: string;
  name: string;
  displayName: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect' | 'code' | 'json' | 'file';
  required: boolean;
  default?: any;
  options?: { label: string; value: any }[];
  description?: string;
  placeholder?: string;
}

// ============================================
// 节点定义
// ============================================

/**
 * 节点类型枚举
 */
export type NodeType =
  // 触发器节点
  | 'trigger.manual'
  | 'trigger.schedule'
  | 'trigger.webhook'
  // AI 节点
  | 'ai.chat'
  | 'ai.script'
  | 'ai.analyze'
  // 图像节点
  | 'image.generate'
  | 'image.edit'
  | 'image.upscale'
  // 视频节点
  | 'video.generate'
  | 'video.edit'
  | 'video.merge'
  // 音频节点
  | 'audio.tts'
  | 'audio.music'
  | 'audio.merge'
  // 数据节点
  | 'data.input'
  | 'data.transform'
  | 'data.merge'
  | 'data.filter'
  | 'data.code'
  // 流程控制
  | 'flow.condition'
  | 'flow.loop'
  | 'flow.parallel'
  | 'flow.delay'
  // 输出节点
  | 'output.export'
  | 'output.save';

/**
 * 节点运行状态
 */
export type NodeStatus = 'idle' | 'running' | 'success' | 'error' | 'skipped';

/**
 * 节点执行结果
 */
export interface NodeExecution {
  nodeId: string;
  status: NodeStatus;
  startTime?: number;
  endTime?: number;
  duration?: number;
  input?: NodeData[];
  output?: NodeData[];
  error?: string;
}

/**
 * 节点数据项（n8n 风格）
 */
export interface NodeDataItem {
  json: Record<string, any>;
  binary?: Record<string, {
    data: string; // Base64
    mimeType: string;
    fileName?: string;
    fileExtension?: string;
  }>;
}

export type NodeData = NodeDataItem[];

/**
 * 节点配置
 */
export interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  position: NodePosition;
  parameters: Record<string, any>;
  inputs: NodePort[];
  outputs: NodePort[];
  settings: NodeSettings;
  status?: NodeStatus;
}

/**
 * 节点设置
 */
export interface NodeSettings {
  executeOnce?: boolean;
  retryOnFail?: boolean;
  retryCount?: number;
  retryDelay?: number;
  timeout?: number;
  onError: 'stop' | 'continue' | 'continueWithError';
  notes?: string;
}

// ============================================
// 工作流定义
// ============================================

/**
 * 工作流状态
 */
export type WorkflowStatus = 'draft' | 'active' | 'running' | 'paused' | 'completed' | 'error';

/**
 * 工作流定义
 */
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  version: number;
  status: WorkflowStatus;
  nodes: WorkflowNode[];
  connections: NodeConnection[];
  settings: WorkflowSettings;
  metadata: WorkflowMetadata;
  createdAt: number;
  updatedAt: number;
}

/**
 * 工作流设置
 */
export interface WorkflowSettings {
  timezone: string;
  saveExecutionProgress: boolean;
  saveManualExecutions: boolean;
  maxExecutionTime: number; // 秒
  errorWorkflow?: string;
}

/**
 * 工作流元数据
 */
export interface WorkflowMetadata {
  tags?: string[];
  author?: string;
  icon?: string;
  color?: string;
}

/**
 * 工作流执行记录
 */
export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'success' | 'error' | 'cancelled';
  startedAt: number;
  finishedAt?: number;
  duration?: number;
  trigger: 'manual' | 'schedule' | 'webhook';
  nodeExecutions: NodeExecution[];
  data: Record<string, NodeData>; // 每个节点的输出数据
  error?: string;
}

// ============================================
// 节点注册表
// ============================================

/**
 * 节点定义（注册表用）
 */
export interface NodeDefinition {
  type: NodeType;
  displayName: string;
  description: string;
  category: 'trigger' | 'ai' | 'image' | 'video' | 'audio' | 'data' | 'flow' | 'output';
  icon: string;
  inputs: NodePort[];
  outputs: NodePort[];
  parameters: NodeParameter[];
  defaultSettings: Partial<NodeSettings>;
}

/**
 * 节点执行器函数
 */
export type NodeExecutor = (
  context: NodeExecutionContext
) => Promise<NodeData>;

/**
 * 节点执行上下文
 */
export interface NodeExecutionContext {
  nodeId: string;
  workflowId: string;
  executionId: string;
  parameters: Record<string, any>;
  inputData: NodeData;
  settings: NodeSettings;
  workflowData: Record<string, NodeData>; // 整个工作流的数据
  appSettings?: any; // 应用设置
  logger: {
    debug: (message: string, data?: any) => void;
    info: (message: string, data?: any) => void;
    warn: (message: string, data?: any) => void;
    error: (message: string, data?: any) => void;
  };
  services: {
    ai: any;
    tts: any;
    image: any;
    video: any;
    ffmpeg: any;
    storage: any;
  };
}

// ============================================
// 工作流事件
// ============================================

export type WorkflowEventType =
  | 'workflow:start'
  | 'workflow:complete'
  | 'workflow:error'
  | 'node:start'
  | 'node:progress'
  | 'node:complete'
  | 'node:error';

export interface WorkflowEvent {
  type: WorkflowEventType;
  workflowId: string;
  executionId: string;
  nodeId?: string;
  data?: any;
  timestamp: number;
}

export type WorkflowEventListener = (event: WorkflowEvent) => void;
