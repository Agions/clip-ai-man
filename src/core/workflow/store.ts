/**
 * 工作流编辑器状态管理
 * 使用 Zustand 管理编辑器状态
 */

import { create } from 'zustand';
import {
  Workflow,
  WorkflowNode,
  NodeConnection,
  NodeType,
  WorkflowEvent,
  WorkflowExecution,
  NodePosition
} from '@/core/workflow/types';
import { workflowManager } from '@/core/workflow/manager';

// 历史记录
interface HistoryState {
  nodes: WorkflowNode[];
  connections: NodeConnection[];
}

interface EditorState {
  // 当前工作流
  currentWorkflow: Workflow | null;
  
  // 选中的节点/连接
  selectedNodeId: string | null;
  selectedConnectionId: string | null;
  
  // 编辑器状态
  isDragging: boolean;
  isConnecting: boolean;
  connectingFrom: { nodeId: string; output: string } | null;
  
  // 视口状态
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  
  // 执行状态
  isExecuting: boolean;
  currentExecution: WorkflowExecution | null;
  executionLogs: { timestamp: number; message: string; nodeId?: string }[];
  
  // 面板状态
  showNodePanel: boolean;
  showSettingsPanel: boolean;
  
  // 历史记录（撤销/重做）
  history: HistoryState[];
  historyIndex: number;
  maxHistorySize: number;
  
  // 剪贴板
  clipboard: WorkflowNode[];
  
  // Actions
  setCurrentWorkflow: (workflow: Workflow | null) => void;
  selectNode: (nodeId: string | null) => void;
  selectConnection: (connectionId: string | null) => void;
  addNode: (type: NodeType, position: NodePosition) => WorkflowNode | null;
  updateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  deleteNode: (nodeId: string) => void;
  moveNode: (nodeId: string, position: NodePosition) => void;
  addConnection: (sourceNodeId: string, sourceOutput: string, targetNodeId: string, targetInput: string) => NodeConnection | null;
  deleteConnection: (connectionId: string) => void;
  deleteSelectedNode: () => void;
  startConnecting: (nodeId: string, output: string) => void;
  stopConnecting: () => void;
  setDragging: (isDragging: boolean) => void;
  setViewport: (viewport: Partial<{ x: number; y: number; zoom: number }>) => void;
  fitView: () => void;
  executeWorkflow: () => Promise<void>;
  stopExecution: () => void;
  clearExecutionLogs: () => void;
  toggleNodePanel: () => void;
  toggleSettingsPanel: () => void;
  
  // 历史记录
  saveHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // 复制粘贴
  copySelectedNode: () => void;
  pasteNode: (position?: NodePosition) => void;
  
  // 刷新工作流
  refreshWorkflow: () => void;
}

export const useWorkflowEditor = create<EditorState>((set, get) => ({
  // 初始状态
  currentWorkflow: null,
  selectedNodeId: null,
  selectedConnectionId: null,
  isDragging: false,
  isConnecting: false,
  connectingFrom: null,
  viewport: { x: 100, y: 100, zoom: 1 },
  isExecuting: false,
  currentExecution: null,
  executionLogs: [],
  showNodePanel: true,
  showSettingsPanel: false,
  history: [],
  historyIndex: -1,
  maxHistorySize: 50,
  clipboard: [],

  // Actions
  setCurrentWorkflow: (workflow) => {
    set({ 
      currentWorkflow: workflow, 
      selectedNodeId: null, 
      selectedConnectionId: null,
      history: [],
      historyIndex: -1
    });
    // 保存初始历史
    if (workflow) {
      get().saveHistory();
    }
  },

  selectNode: (nodeId) => {
    set({ selectedNodeId: nodeId, selectedConnectionId: null, showSettingsPanel: !!nodeId });
  },

  selectConnection: (connectionId) => {
    set({ selectedConnectionId: connectionId, selectedNodeId: null });
  },

  addNode: (type, position) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return null;

    const node = workflowManager.addNode(currentWorkflow.id, type, position);
    if (node) {
      get().saveHistory();
      get().refreshWorkflow();
    }
    return node;
  },

  updateNode: (nodeId, updates) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;

    workflowManager.updateNode(currentWorkflow.id, nodeId, updates);
    get().saveHistory();
    get().refreshWorkflow();
  },

  deleteNode: (nodeId) => {
    const { currentWorkflow, selectedNodeId } = get();
    if (!currentWorkflow) return;

    workflowManager.deleteNode(currentWorkflow.id, nodeId);
    get().saveHistory();
    get().refreshWorkflow();
    
    if (selectedNodeId === nodeId) {
      set({ selectedNodeId: null });
    }
  },

  deleteSelectedNode: () => {
    const { selectedNodeId } = get();
    if (selectedNodeId) {
      get().deleteNode(selectedNodeId);
    }
  },

  moveNode: (nodeId, position) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;

    workflowManager.moveNode(currentWorkflow.id, nodeId, position);
    get().refreshWorkflow();
  },

  addConnection: (sourceNodeId, sourceOutput, targetNodeId, targetInput) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return null;

    const connection = workflowManager.addConnection(
      currentWorkflow.id,
      sourceNodeId,
      sourceOutput,
      targetNodeId,
      targetInput
    );
    
    if (connection) {
      get().saveHistory();
      get().refreshWorkflow();
    }
    return connection;
  },

  deleteConnection: (connectionId) => {
    const { currentWorkflow, selectedConnectionId } = get();
    if (!currentWorkflow) return;

    workflowManager.deleteConnection(currentWorkflow.id, connectionId);
    get().saveHistory();
    get().refreshWorkflow();
    
    if (selectedConnectionId === connectionId) {
      set({ selectedConnectionId: null });
    }
  },

  startConnecting: (nodeId, output) => {
    set({ isConnecting: true, connectingFrom: { nodeId, output } });
  },

  stopConnecting: () => {
    set({ isConnecting: false, connectingFrom: null });
  },

  setDragging: (isDragging) => {
    set({ isDragging });
  },

  setViewport: (viewport) => {
    set((state) => ({
      viewport: { ...state.viewport, ...viewport }
    }));
  },

  fitView: () => {
    const { currentWorkflow } = get();
    if (!currentWorkflow || currentWorkflow.nodes.length === 0) {
      set({ viewport: { x: 100, y: 100, zoom: 1 } });
      return;
    }

    // 计算所有节点的边界
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    for (const node of currentWorkflow.nodes) {
      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + 250);
      maxY = Math.max(maxY, node.position.y + 100);
    }

    // 计算缩放和偏移
    const padding = 100;
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;
    
    // 假设画布大小
    const canvasWidth = 800;
    const canvasHeight = 600;
    
    const zoom = Math.min(1, Math.min(canvasWidth / width, canvasHeight / height));
    const x = (canvasWidth - width * zoom) / 2 - minX * zoom + padding;
    const y = (canvasHeight - height * zoom) / 2 - minY * zoom + padding;

    set({ viewport: { x, y, zoom } });
  },

  executeWorkflow: async () => {
    const { currentWorkflow, isExecuting } = get();
    if (!currentWorkflow || isExecuting) return;

    set({ isExecuting: true, executionLogs: [] });

    const unsubscribe = workflowManager.subscribe((event: WorkflowEvent) => {
      const { type, nodeId, data } = event;
      let message = '';

      switch (type) {
        case 'workflow:start':
          message = '🚀 工作流开始执行';
          break;
        case 'workflow:complete':
          message = '✅ 工作流执行完成';
          break;
        case 'workflow:error':
          message = `❌ 工作流执行失败: ${data?.error}`;
          break;
        case 'node:start':
          message = `▶️ 开始执行节点`;
          break;
        case 'node:complete':
          message = `✅ 节点执行完成 (${data?.duration}ms)`;
          break;
        case 'node:error':
          message = `❌ 节点执行失败: ${data?.error}`;
          break;
      }

      if (message) {
        set((state) => ({
          executionLogs: [...state.executionLogs, { timestamp: Date.now(), message, nodeId }]
        }));
      }
    });

    try {
      const execution = await workflowManager.executeWorkflow(currentWorkflow.id);
      set({ currentExecution: execution });
    } catch (error) {
      console.error('执行失败:', error);
    } finally {
      unsubscribe();
      set({ isExecuting: false });
    }
  },

  stopExecution: () => {
    const { currentExecution } = get();
    if (currentExecution) {
      workflowManager.stopExecution(currentExecution.id);
    }
    set({ isExecuting: false });
  },

  clearExecutionLogs: () => {
    set({ executionLogs: [] });
  },

  toggleNodePanel: () => {
    set((state) => ({ showNodePanel: !state.showNodePanel }));
  },

  toggleSettingsPanel: () => {
    set((state) => ({ showSettingsPanel: !state.showSettingsPanel }));
  },

  // 历史记录
  saveHistory: () => {
    const { currentWorkflow, history, historyIndex, maxHistorySize } = get();
    if (!currentWorkflow) return;

    const state: HistoryState = {
      nodes: JSON.parse(JSON.stringify(currentWorkflow.nodes)),
      connections: JSON.parse(JSON.stringify(currentWorkflow.connections))
    };

    // 删除当前位置之后的历史
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);

    // 限制历史大小
    if (newHistory.length > maxHistorySize) {
      newHistory.shift();
    }

    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { history, historyIndex, currentWorkflow } = get();
    if (!currentWorkflow || historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    const state = history[newIndex];
    
    workflowManager.updateWorkflow(currentWorkflow.id, {
      nodes: JSON.parse(JSON.stringify(state.nodes)),
      connections: JSON.parse(JSON.stringify(state.connections))
    });

    set({ historyIndex: newIndex });
    get().refreshWorkflow();
  },

  redo: () => {
    const { history, historyIndex, currentWorkflow } = get();
    if (!currentWorkflow || historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;
    const state = history[newIndex];
    
    workflowManager.updateWorkflow(currentWorkflow.id, {
      nodes: JSON.parse(JSON.stringify(state.nodes)),
      connections: JSON.parse(JSON.stringify(state.connections))
    });

    set({ historyIndex: newIndex });
    get().refreshWorkflow();
  },

  canUndo: () => {
    const { historyIndex } = get();
    return historyIndex > 0;
  },

  canRedo: () => {
    const { history, historyIndex } = get();
    return historyIndex < history.length - 1;
  },

  // 复制粘贴
  copySelectedNode: () => {
    const { currentWorkflow, selectedNodeId } = get();
    if (!currentWorkflow || !selectedNodeId) return;

    const node = currentWorkflow.nodes.find(n => n.id === selectedNodeId);
    if (node) {
      set({ clipboard: [JSON.parse(JSON.stringify(node))] });
    }
  },

  pasteNode: (position) => {
    const { currentWorkflow, clipboard } = get();
    if (!currentWorkflow || clipboard.length === 0) return;

    for (const node of clipboard) {
      const newPos = position || {
        x: node.position.x + 50,
        y: node.position.y + 50
      };
      
      workflowManager.addNode(
        currentWorkflow.id,
        node.type,
        newPos,
        `${node.name} (副本)`,
        JSON.parse(JSON.stringify(node.parameters))
      );
    }

    get().saveHistory();
    get().refreshWorkflow();
  },

  refreshWorkflow: () => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;

    const updated = workflowManager.getWorkflow(currentWorkflow.id);
    set({ currentWorkflow: updated || null });
  }
}));
