/**
 * 工作流管理器
 * 管理工作流的创建、保存、加载、执行
 */

import { Workflow, WorkflowNode, NodeConnection, WorkflowStatus } from './types';
import { createNode, getNodeDefinition } from './node-registry';
import { workflowEngine, WorkflowEngine } from './engine';
import { v4 as uuidv4 } from 'uuid';

/**
 * 工作流管理器
 */
class WorkflowManager {
  private workflows: Map<string, Workflow> = new Map();
  private storageKey = 'mangaai-workflows';

  constructor() {
    this.loadFromStorage();
  }

  /**
   * 创建新工作流
   */
  createWorkflow(name: string, description?: string): Workflow {
    const workflow: Workflow = {
      id: uuidv4(),
      name,
      description,
      version: 1,
      status: 'draft',
      nodes: [],
      connections: [],
      settings: {
        timezone: 'Asia/Shanghai',
        saveExecutionProgress: true,
        saveManualExecutions: true,
        maxExecutionTime: 3600
      },
      metadata: {
        author: 'ManGaAI',
        icon: 'ApartmentOutlined',
        color: '#1890ff'
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.workflows.set(workflow.id, workflow);
    this.saveToStorage();

    return workflow;
  }

  /**
   * 获取工作流
   */
  getWorkflow(id: string): Workflow | undefined {
    return this.workflows.get(id);
  }

  /**
   * 获取所有工作流
   */
  getAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values())
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  /**
   * 更新工作流
   */
  updateWorkflow(id: string, updates: Partial<Workflow>): Workflow | undefined {
    const workflow = this.workflows.get(id);
    if (!workflow) return undefined;

    Object.assign(workflow, updates, {
      updatedAt: Date.now()
    });

    this.saveToStorage();
    return workflow;
  }

  /**
   * 删除工作流
   */
  deleteWorkflow(id: string): boolean {
    const result = this.workflows.delete(id);
    if (result) {
      this.saveToStorage();
    }
    return result;
  }

  /**
   * 复制工作流
   */
  duplicateWorkflow(id: string): Workflow | undefined {
    const original = this.workflows.get(id);
    if (!original) return undefined;

    const idMap = new Map<string, string>();

    // 创建节点 ID 映射
    for (const node of original.nodes) {
      idMap.set(node.id, uuidv4());
    }

    // 复制节点
    const newNodes: WorkflowNode[] = original.nodes.map(node => ({
      ...node,
      id: idMap.get(node.id)!
    }));

    // 复制连接
    const newConnections: NodeConnection[] = original.connections.map(conn => ({
      ...conn,
      id: uuidv4(),
      sourceNodeId: idMap.get(conn.sourceNodeId)!,
      targetNodeId: idMap.get(conn.targetNodeId)!
    }));

    const duplicate: Workflow = {
      ...original,
      id: uuidv4(),
      name: `${original.name} (副本)`,
      nodes: newNodes,
      connections: newConnections,
      status: 'draft',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.workflows.set(duplicate.id, duplicate);
    this.saveToStorage();

    return duplicate;
  }

  // ============================================
  // 节点操作
  // ============================================

  /**
   * 添加节点
   */
  addNode(
    workflowId: string,
    type: import('./types').NodeType,
    position: { x: number; y: number },
    name?: string,
    parameters?: Record<string, any>
  ): WorkflowNode | undefined {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return undefined;

    const node = createNode(type, uuidv4(), position, name, parameters);
    workflow.nodes.push(node);
    workflow.updatedAt = Date.now();

    this.saveToStorage();
    return node;
  }

  /**
   * 更新节点
   */
  updateNode(
    workflowId: string,
    nodeId: string,
    updates: Partial<WorkflowNode>
  ): WorkflowNode | undefined {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return undefined;

    const node = workflow.nodes.find(n => n.id === nodeId);
    if (!node) return undefined;

    Object.assign(node, updates);
    workflow.updatedAt = Date.now();

    this.saveToStorage();
    return node;
  }

  /**
   * 删除节点
   */
  deleteNode(workflowId: string, nodeId: string): boolean {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return false;

    const nodeIndex = workflow.nodes.findIndex(n => n.id === nodeId);
    if (nodeIndex === -1) return false;

    // 删除节点
    workflow.nodes.splice(nodeIndex, 1);

    // 删除相关连接
    workflow.connections = workflow.connections.filter(
      c => c.sourceNodeId !== nodeId && c.targetNodeId !== nodeId
    );

    workflow.updatedAt = Date.now();
    this.saveToStorage();

    return true;
  }

  /**
   * 移动节点
   */
  moveNode(
    workflowId: string,
    nodeId: string,
    position: { x: number; y: number }
  ): boolean {
    return this.updateNode(workflowId, nodeId, { position }) !== undefined;
  }

  // ============================================
  // 连接操作
  // ============================================

  /**
   * 添加连接
   */
  addConnection(
    workflowId: string,
    sourceNodeId: string,
    sourceOutput: string,
    targetNodeId: string,
    targetInput: string
  ): NodeConnection | undefined {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return undefined;

    // 检查节点是否存在
    const sourceNode = workflow.nodes.find(n => n.id === sourceNodeId);
    const targetNode = workflow.nodes.find(n => n.id === targetNodeId);
    if (!sourceNode || !targetNode) return undefined;

    // 检查是否已存在连接
    const exists = workflow.connections.some(
      c => c.sourceNodeId === sourceNodeId &&
           c.targetNodeId === targetNodeId &&
           c.sourceOutput === sourceOutput &&
           c.targetInput === targetInput
    );
    if (exists) return undefined;

    // 检查是否会形成循环
    if (this.wouldCreateCycle(workflow, sourceNodeId, targetNodeId)) {
      console.warn('连接会形成循环，已阻止');
      return undefined;
    }

    const connection: NodeConnection = {
      id: uuidv4(),
      sourceNodeId,
      sourceOutput,
      targetNodeId,
      targetInput
    };

    workflow.connections.push(connection);
    workflow.updatedAt = Date.now();

    this.saveToStorage();
    return connection;
  }

  /**
   * 删除连接
   */
  deleteConnection(workflowId: string, connectionId: string): boolean {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return false;

    const index = workflow.connections.findIndex(c => c.id === connectionId);
    if (index === -1) return false;

    workflow.connections.splice(index, 1);
    workflow.updatedAt = Date.now();

    this.saveToStorage();
    return true;
  }

  /**
   * 检查是否会形成循环
   */
  private wouldCreateCycle(
    workflow: Workflow,
    sourceNodeId: string,
    targetNodeId: string
  ): boolean {
    const visited = new Set<string>();
    const stack = [sourceNodeId];

    while (stack.length > 0) {
      const current = stack.pop()!;
      
      if (current === targetNodeId) {
        return true;
      }

      if (visited.has(current)) {
        continue;
      }
      visited.add(current);

      // 找到当前节点的所有上游节点
      for (const conn of workflow.connections) {
        if (conn.targetNodeId === current) {
          stack.push(conn.sourceNodeId);
        }
      }
    }

    return false;
  }

  // ============================================
  // 执行
  // ============================================

  /**
   * 执行工作流
   */
  async executeWorkflow(
    workflowId: string,
    trigger: 'manual' | 'schedule' | 'webhook' = 'manual',
    initialData?: import('./types').NodeData
  ): Promise<import('./types').WorkflowExecution> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error('工作流不存在');
    }

    // 更新状态
    workflow.status = 'running';
    this.saveToStorage();

    try {
      const execution = await workflowEngine.execute(workflow, trigger, initialData);
      
      // 更新工作流状态
      workflow.status = execution.status === 'success' ? 'completed' : 'error';
      workflow.updatedAt = Date.now();
      this.saveToStorage();

      return execution;
    } catch (error) {
      workflow.status = 'error';
      this.saveToStorage();
      throw error;
    }
  }

  /**
   * 停止执行
   */
  stopExecution(executionId: string): void {
    workflowEngine.stop(executionId);
  }

  /**
   * 订阅执行事件
   */
  subscribe(listener: import('./types').WorkflowEventListener): () => void {
    return workflowEngine.subscribe(listener);
  }

  // ============================================
  // 模板
  // ============================================

  /**
   * 获取预设模板
   */
  getTemplates(): Workflow[] {
    return [
      this.createComicDramaTemplate(),
      this.createImageToVideoTemplate(),
      this.createBatchProcessingTemplate()
    ];
  }

  /**
   * 从模板创建
   */
  createFromTemplate(templateId: string): Workflow | undefined {
    const templates = this.getTemplates();
    const template = templates.find(t => t.id === templateId);
    if (!template) return undefined;

    return this.duplicateWorkflow(template.id);
  }

  /**
   * 漫剧工作流模板
   */
  private createComicDramaTemplate(): Workflow {
    const workflow = this.createWorkflow('漫剧工作流', '完整的 AI 漫剧创作流程');

    // 添加节点
    const trigger = this.addNode(workflow.id, 'trigger.manual', { x: 100, y: 200 })!;
    const input = this.addNode(workflow.id, 'data.input', { x: 300, y: 200 })!;
    const script = this.addNode(workflow.id, 'ai.script', { x: 500, y: 200 })!;
    const analyze = this.addNode(workflow.id, 'ai.analyze', { x: 700, y: 200 })!;
    const image = this.addNode(workflow.id, 'image.generate', { x: 900, y: 100 })!;
    const video = this.addNode(workflow.id, 'video.generate', { x: 1100, y: 100 })!;
    const tts = this.addNode(workflow.id, 'audio.tts', { x: 900, y: 300 })!;
    const merge = this.addNode(workflow.id, 'audio.merge', { x: 1100, y: 300 })!;
    const exportNode = this.addNode(workflow.id, 'output.export', { x: 1300, y: 200 })!;

    // 添加连接
    this.addConnection(workflow.id, trigger.id, 'main', input.id, 'main');
    this.addConnection(workflow.id, input.id, 'main', script.id, 'main');
    this.addConnection(workflow.id, script.id, 'main', analyze.id, 'main');
    this.addConnection(workflow.id, analyze.id, 'main', image.id, 'main');
    this.addConnection(workflow.id, image.id, 'main', video.id, 'main');
    this.addConnection(workflow.id, analyze.id, 'main', tts.id, 'main');
    this.addConnection(workflow.id, video.id, 'video', merge.id, 'video');
    this.addConnection(workflow.id, tts.id, 'audio', merge.id, 'audio');
    this.addConnection(workflow.id, merge.id, 'main', exportNode.id, 'main');

    return workflow;
  }

  /**
   * 图生视频模板
   */
  private createImageToVideoTemplate(): Workflow {
    const workflow = this.createWorkflow('图生视频', '将静态图像转换为动态视频');

    const trigger = this.addNode(workflow.id, 'trigger.manual', { x: 100, y: 200 })!;
    const image = this.addNode(workflow.id, 'image.generate', { x: 300, y: 200 })!;
    const video = this.addNode(workflow.id, 'video.generate', { x: 500, y: 200 })!;
    const exportNode = this.addNode(workflow.id, 'output.export', { x: 700, y: 200 })!;

    this.addConnection(workflow.id, trigger.id, 'main', image.id, 'main');
    this.addConnection(workflow.id, image.id, 'main', video.id, 'main');
    this.addConnection(workflow.id, video.id, 'main', exportNode.id, 'main');

    return workflow;
  }

  /**
   * 批量处理模板
   */
  private createBatchProcessingTemplate(): Workflow {
    const workflow = this.createWorkflow('批量处理', '批量生成和处理内容');

    const trigger = this.addNode(workflow.id, 'trigger.manual', { x: 100, y: 200 })!;
    const input = this.addNode(workflow.id, 'data.input', { x: 300, y: 200 })!;
    const loop = this.addNode(workflow.id, 'flow.loop', { x: 500, y: 200 })!;
    const image = this.addNode(workflow.id, 'image.generate', { x: 700, y: 200 })!;
    const save = this.addNode(workflow.id, 'output.save', { x: 900, y: 200 })!;

    this.addConnection(workflow.id, trigger.id, 'main', input.id, 'main');
    this.addConnection(workflow.id, input.id, 'main', loop.id, 'main');
    this.addConnection(workflow.id, loop.id, 'main', image.id, 'main');
    this.addConnection(workflow.id, image.id, 'main', save.id, 'main');

    return workflow;
  }

  // ============================================
  // 存储
  // ============================================

  /**
   * 保存到本地存储
   */
  private saveToStorage(): void {
    try {
      const data = JSON.stringify(Array.from(this.workflows.entries()));
      localStorage.setItem(this.storageKey, data);
    } catch (error) {
      console.error('保存工作流失败:', error);
    }
  }

  /**
   * 从本地存储加载
   */
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const entries = JSON.parse(data);
        this.workflows = new Map(entries);
      }
    } catch (error) {
      console.error('加载工作流失败:', error);
      this.workflows = new Map();
    }
  }

  /**
   * 导出工作流为 JSON
   */
  exportWorkflow(id: string): string | undefined {
    const workflow = this.workflows.get(id);
    if (!workflow) return undefined;

    return JSON.stringify(workflow, null, 2);
  }

  /**
   * 导入工作流
   */
  importWorkflow(json: string): Workflow | undefined {
    try {
      const workflow = JSON.parse(json) as Workflow;
      workflow.id = uuidv4();
      workflow.createdAt = Date.now();
      workflow.updatedAt = Date.now();
      workflow.status = 'draft';

      // 重新生成所有 ID
      const idMap = new Map<string, string>();
      workflow.nodes.forEach(node => {
        idMap.set(node.id, uuidv4());
        node.id = idMap.get(node.id)!;
      });

      workflow.connections.forEach(conn => {
        conn.id = uuidv4();
        conn.sourceNodeId = idMap.get(conn.sourceNodeId) || conn.sourceNodeId;
        conn.targetNodeId = idMap.get(conn.targetNodeId) || conn.targetNodeId;
      });

      this.workflows.set(workflow.id, workflow);
      this.saveToStorage();

      return workflow;
    } catch (error) {
      console.error('导入工作流失败:', error);
      return undefined;
    }
  }
}

// 导出单例
export const workflowManager = new WorkflowManager();
export { WorkflowManager };
