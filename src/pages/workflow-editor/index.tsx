/**
 * 工作流编辑器页面
 * n8n 风格的可视化节点编辑器
 */

import React, { useEffect, useCallback } from 'react';
import { Layout, Button, Space, Dropdown, Modal, Input, message, Tooltip, Popconfirm } from 'antd';
import {
  PlayCircleOutlined,
  SaveOutlined,
  UndoOutlined,
  RedoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FitViewOutlined,
  SettingOutlined,
  DeleteOutlined,
  CopyOutlined,
  PlusOutlined,
  ImportOutlined,
  ExportOutlined,
  AppstoreOutlined,
  FolderOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import { useWorkflowEditor } from '@/core/workflow/store';
import { workflowManager } from '@/core/workflow';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { NodePanel } from './components/NodePanel';
import { NodeSettingsPanel } from './components/NodeSettingsPanel';
import { ExecutionPanel } from './components/ExecutionPanel';
import styles from './index.module.less';

const { Header, Sider, Content } = Layout;

interface WorkflowEditorProps {
  workflowId?: string;
}

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({ workflowId }) => {
  const {
    currentWorkflow,
    selectedNodeId,
    selectedConnectionId,
    isExecuting,
    showNodePanel,
    showSettingsPanel,
    viewport,
    canUndo,
    canRedo,
    setCurrentWorkflow,
    addNode,
    deleteSelectedNode,
    executeWorkflow,
    stopExecution,
    setViewport,
    fitView,
    undo,
    redo,
    copySelectedNode,
    pasteNode,
    toggleNodePanel,
    toggleSettingsPanel,
  } = useWorkflowEditor();

  // 加载工作流
  useEffect(() => {
    if (workflowId) {
      const workflow = workflowManager.getWorkflow(workflowId);
      if (workflow) {
        setCurrentWorkflow(workflow);
      }
    } else {
      // 创建新工作流
      const workflow = workflowManager.createWorkflow('新工作流');
      setCurrentWorkflow(workflow);
    }
  }, [workflowId, setCurrentWorkflow]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Z: 撤销
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      
      // Ctrl/Cmd + Shift + Z 或 Ctrl/Cmd + Y: 重做
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }

      // Ctrl/Cmd + C: 复制
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedNodeId) {
        e.preventDefault();
        copySelectedNode();
      }

      // Ctrl/Cmd + V: 粘贴
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        pasteNode();
      }

      // Delete/Backspace: 删除选中
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        e.preventDefault();
        deleteSelectedNode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, copySelectedNode, pasteNode, deleteSelectedNode, selectedNodeId]);

  // 缩放
  const handleZoomIn = () => setViewport({ zoom: Math.min(viewport.zoom * 1.2, 2) });
  const handleZoomOut = () => setViewport({ zoom: Math.max(viewport.zoom / 1.2, 0.25) });
  const handleFitView = () => fitView();

  // 拖放节点
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData('nodeType') as any;
    if (!nodeType) return;

    const rect = (e.target as HTMLElement).closest(`.${styles.canvasContainer}`)?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - viewport.x) / viewport.zoom;
    const y = (e.clientY - rect.top - viewport.y) / viewport.zoom;

    addNode(nodeType, { x, y });
  }, [viewport, addNode]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  // 导出工作流
  const handleExport = () => {
    if (!currentWorkflow) return;
    const json = workflowManager.exportWorkflow(currentWorkflow.id);
    if (json) {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentWorkflow.name}.json`;
      a.click();
      URL.revokeObjectURL(url);
      message.success('导出成功');
    }
  };

  // 导入工作流
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const text = await file.text();
      const workflow = workflowManager.importWorkflow(text);
      if (workflow) {
        setCurrentWorkflow(workflow);
        message.success('导入成功');
      } else {
        message.error('导入失败：无效的工作流文件');
      }
    };
    input.click();
  };

  // 新建工作流
  const handleNew = () => {
    Modal.confirm({
      title: '新建工作流',
      content: (
        <Input 
          placeholder="输入工作流名称" 
          id="workflow-name-input"
          defaultValue="新工作流"
        />
      ),
      onOk: () => {
        const name = (document.getElementById('workflow-name-input') as HTMLInputElement)?.value || '新工作流';
        const workflow = workflowManager.createWorkflow(name);
        setCurrentWorkflow(workflow);
        message.success('创建成功');
      }
    });
  };

  // 工作流列表
  const handleShowWorkflows = () => {
    const workflows = workflowManager.getAllWorkflows();
    Modal.info({
      title: '工作流列表',
      width: 600,
      content: (
        <div style={{ maxHeight: 400, overflow: 'auto' }}>
          {workflows.map(w => (
            <div 
              key={w.id} 
              style={{ 
                padding: '12px', 
                borderBottom: '1px solid #eee',
                cursor: 'pointer'
              }}
              onClick={() => {
                setCurrentWorkflow(w);
                Modal.destroyAll();
              }}
            >
              <div style={{ fontWeight: 500 }}>{w.name}</div>
              <div style={{ fontSize: 12, color: '#999' }}>
                {w.nodes.length} 节点 · {new Date(w.updatedAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )
    });
  };

  return (
    <Layout className={styles.workflowEditor}>
      {/* 顶部工具栏 */}
      <Header className={styles.header}>
        <div className={styles.title}>
          <AppstoreOutlined />
          <span>{currentWorkflow?.name || '工作流编辑器'}</span>
        </div>

        <Space className={styles.toolbar}>
          {/* 文件操作 */}
          <Space.Compact>
            <Tooltip title="新建 (Ctrl+N)">
              <Button icon={<PlusOutlined />} onClick={handleNew} />
            </Tooltip>
            <Tooltip title="打开">
              <Button icon={<FolderOutlined />} onClick={handleShowWorkflows} />
            </Tooltip>
            <Tooltip title="导入">
              <Button icon={<ImportOutlined />} onClick={handleImport} />
            </Tooltip>
            <Tooltip title="导出">
              <Button icon={<ExportOutlined />} onClick={handleExport} />
            </Tooltip>
          </Space.Compact>

          {/* 编辑操作 */}
          <Space.Compact>
            <Tooltip title="撤销 (Ctrl+Z)">
              <Button 
                icon={<UndoOutlined />} 
                onClick={undo}
                disabled={!canUndo()}
              />
            </Tooltip>
            <Tooltip title="重做 (Ctrl+Y)">
              <Button 
                icon={<RedoOutlined />} 
                onClick={redo}
                disabled={!canRedo()}
              />
            </Tooltip>
          </Space.Compact>

          {/* 删除 */}
          {(selectedNodeId || selectedConnectionId) && (
            <Popconfirm
              title="确定删除选中的节点？"
              onConfirm={deleteSelectedNode}
            >
              <Button danger icon={<DeleteOutlined />}>删除</Button>
            </Popconfirm>
          )}

          {/* 视图控制 */}
          <Space.Compact>
            <Tooltip title="放大">
              <Button icon={<ZoomInOutlined />} onClick={handleZoomIn} />
            </Tooltip>
            <Tooltip title="缩小">
              <Button icon={<ZoomOutOutlined />} onClick={handleZoomOut} />
            </Tooltip>
            <Tooltip title="适应视图">
              <Button icon={<FitViewOutlined />} onClick={handleFitView} />
            </Tooltip>
          </Space.Compact>

          {/* 显示比例 */}
          <span className={styles.zoomLevel}>{Math.round(viewport.zoom * 100)}%</span>

          {/* 执行控制 */}
          {isExecuting ? (
            <Button
              type="primary"
              danger
              icon={<ClearOutlined />}
              onClick={stopExecution}
            >
              停止
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={executeWorkflow}
              disabled={!currentWorkflow?.nodes.length}
            >
              执行
            </Button>
          )}

          {/* 设置 */}
          <Button
            icon={<SettingOutlined />}
            onClick={toggleSettingsPanel}
            type={showSettingsPanel ? 'primary' : 'default'}
          >
            设置
          </Button>
        </Space>
      </Header>

      <Layout>
        {/* 左侧节点面板 */}
        {showNodePanel && (
          <Sider width={280} className={styles.sider}>
            <NodePanel />
          </Sider>
        )}

        {/* 主画布 */}
        <Content className={styles.content}>
          <div
            className={styles.canvasContainer}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <WorkflowCanvas />
          </div>
        </Content>

        {/* 右侧设置面板 */}
        {showSettingsPanel && (
          <Sider width={320} className={styles.siderRight}>
            {selectedNodeId ? (
              <NodeSettingsPanel nodeId={selectedNodeId} />
            ) : (
              <ExecutionPanel />
            )}
          </Sider>
        )}
      </Layout>
    </Layout>
  );
};

export default WorkflowEditor;
