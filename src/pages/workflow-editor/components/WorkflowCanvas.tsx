/**
 * 工作流画布
 * 渲染节点和连接，支持缩放、平移
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useWorkflowEditor } from '@/core/workflow/store';
import { WorkflowNode as WorkflowNodeType } from '@/core/workflow/types';
import { getNodeDefinition } from '@/core/workflow/node-registry';
import { NodeComponent } from './NodeComponent';
import { ConnectionLine } from './ConnectionLine';
import styles from './WorkflowCanvas.module.less';

export const WorkflowCanvas: React.FC = () => {
  const {
    currentWorkflow,
    viewport,
    selectedNodeId,
    selectedConnectionId,
    isConnecting,
    connectingFrom,
    selectNode,
    selectConnection,
    moveNode,
    addConnection,
    startConnecting,
    stopConnecting,
    setViewport,
  } = useWorkflowEditor();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 获取画布相对位置
  const getCanvasPoint = useCallback((clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left - viewport.x) / viewport.zoom,
      y: (clientY - rect.top - viewport.y) / viewport.zoom
    };
  }, [viewport]);

  // 画布平移
  const handleMouseDown = (e: React.MouseEvent) => {
    // 中键或 Alt+左键 拖动画布
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
      return;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // 更新鼠标位置（用于连接线）
    const point = getCanvasPoint(e.clientX, e.clientY);
    setMousePos(point);

    // 平移画布
    if (isPanning) {
      setViewport({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // 滚轮缩放
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.25, Math.min(2, viewport.zoom * delta));
    
    // 以鼠标位置为中心缩放
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const newViewportX = mouseX - (mouseX - viewport.x) * (newZoom / viewport.zoom);
      const newViewportY = mouseY - (mouseY - viewport.y) * (newZoom / viewport.zoom);
      
      setViewport({
        x: newViewportX,
        y: newViewportY,
        zoom: newZoom
      });
    }
  }, [viewport, setViewport]);

  // 处理连接结束
  const handleConnectionEnd = useCallback((targetNodeId: string, targetInput: string) => {
    if (connectingFrom && connectingFrom.nodeId !== targetNodeId) {
      addConnection(
        connectingFrom.nodeId,
        connectingFrom.output,
        targetNodeId,
        targetInput
      );
    }
    stopConnecting();
  }, [connectingFrom, addConnection, stopConnecting]);

  // 点击空白处
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains(styles.canvas)) {
      selectNode(null);
      selectConnection(null);
      stopConnecting();
    }
  };

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape 取消连接
      if (e.key === 'Escape' && isConnecting) {
        stopConnecting();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isConnecting, stopConnecting]);

  if (!currentWorkflow) {
    return (
      <div className={styles.emptyCanvas}>
        <div className={styles.emptyContent}>
          <div className={styles.emptyIcon}>📋</div>
          <p className={styles.emptyTitle}>拖拽左侧节点到画布</p>
          <p className={styles.emptyDesc}>开始创建你的工作流</p>
        </div>
      </div>
    );
  }

  const { nodes, connections } = currentWorkflow;

  return (
    <div
      ref={canvasRef}
      className={`${styles.canvas} ${isPanning ? styles.panning : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
      onWheel={handleWheel}
    >
      {/* 背景网格 */}
      <div
        className={styles.grid}
        style={{
          backgroundPosition: `${viewport.x}px ${viewport.y}px`,
          backgroundSize: `${20 * viewport.zoom}px ${20 * viewport.zoom}px`
        }}
      />

      {/* SVG 层：连接线 */}
      <svg
        className={styles.connectionsLayer}
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0'
        }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
        </defs>

        {/* 已有连接 */}
        {connections.map((conn) => (
          <ConnectionLine
            key={conn.id}
            connection={conn}
            nodes={nodes}
            isSelected={conn.id === selectedConnectionId}
            onClick={() => {
              selectConnection(conn.id);
              selectNode(null);
            }}
          />
        ))}

        {/* 正在创建的连接 */}
        {isConnecting && connectingFrom && (
          <ConnectionLine
            isDraft
            startPos={getNodeOutputPosition(nodes, connectingFrom.nodeId, connectingFrom.output)}
            endPos={mousePos}
          />
        )}
      </svg>

      {/* 节点层 */}
      <div
        className={styles.nodesLayer}
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0'
        }}
      >
        {nodes.map((node) => (
          <NodeComponent
            key={node.id}
            node={node}
            isSelected={node.id === selectedNodeId}
            isConnecting={isConnecting}
            zoom={viewport.zoom}
            onSelect={() => {
              selectNode(node.id);
              selectConnection(null);
            }}
            onMove={(pos) => moveNode(node.id, pos)}
            onConnectionStart={(output) => startConnecting(node.id, output)}
            onConnectionEnd={(input) => handleConnectionEnd(node.id, input)}
          />
        ))}
      </div>

      {/* 缩放指示器 */}
      <div className={styles.zoomIndicator}>
        {Math.round(viewport.zoom * 100)}%
      </div>
    </div>
  );
};

// 辅助函数：获取节点输出端口位置
function getNodeOutputPosition(
  nodes: WorkflowNodeType[],
  nodeId: string,
  output: string
): { x: number; y: number } {
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return { x: 0, y: 0 };

  const definition = getNodeDefinition(node.type);
  const outputIndex = definition?.outputs.findIndex(o => o.id === output) || 0;

  // 节点宽度 250px，输出端口在右侧
  return {
    x: node.position.x + 250,
    y: node.position.y + 50 + outputIndex * 28
  };
}

export default WorkflowCanvas;
