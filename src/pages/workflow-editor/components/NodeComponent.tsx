/**
 * 节点组件
 * 可拖拽的工作流节点
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  PlayCircleOutlined,
  RobotOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  SoundOutlined,
  DatabaseOutlined,
  BranchesOutlined,
  ExportOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { WorkflowNode, NodePosition, NodeStatus } from '@/core/workflow/types';
import { getNodeDefinition } from '@/core/workflow/node-registry';
import styles from './NodeComponent.module.less';

interface NodeComponentProps {
  node: WorkflowNode;
  isSelected: boolean;
  isConnecting: boolean;
  zoom: number;
  onSelect: () => void;
  onMove: (position: NodePosition) => void;
  onConnectionStart: (output: string) => void;
  onConnectionEnd: (input: string) => void;
}

// 分类图标映射
const categoryIcons: Record<string, React.ReactNode> = {
  trigger: <PlayCircleOutlined />,
  ai: <RobotOutlined />,
  image: <PictureOutlined />,
  video: <VideoCameraOutlined />,
  audio: <SoundOutlined />,
  data: <DatabaseOutlined />,
  flow: <BranchesOutlined />,
  output: <ExportOutlined />,
};

// 分类颜色映射
const categoryColors: Record<string, string> = {
  trigger: '#10b981',
  ai: '#8b5cf6',
  image: '#f59e0b',
  video: '#ef4444',
  audio: '#06b6d4',
  data: '#6366f1',
  flow: '#ec4899',
  output: '#14b8a6',
};

// 状态图标和颜色
const statusConfig: Record<NodeStatus, { icon: React.ReactNode; color: string }> = {
  idle: { icon: null, color: '' },
  running: { icon: <LoadingOutlined spin />, color: '#3b82f6' },
  success: { icon: <CheckCircleOutlined />, color: '#10b981' },
  error: { icon: <CloseCircleOutlined />, color: '#ef4444' },
  skipped: { icon: <ClockCircleOutlined />, color: '#64748b' },
};

export const NodeComponent: React.FC<NodeComponentProps> = ({
  node,
  isSelected,
  isConnecting,
  zoom,
  onSelect,
  onMove,
  onConnectionStart,
  onConnectionEnd,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, nodeX: 0, nodeY: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);

  const definition = getNodeDefinition(node.type);
  if (!definition) return null;

  const category = definition.category;
  const color = categoryColors[category] || '#666';
  const statusInfo = statusConfig[node.status || 'idle'];

  // 拖拽开始
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    
    onSelect();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      nodeX: node.position.x,
      nodeY: node.position.y
    });
  };

  // 拖拽中
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = (e.clientX - dragStart.x) / zoom;
      const deltaY = (e.clientY - dragStart.y) / zoom;
      
      onMove({
        x: Math.max(0, dragStart.nodeX + deltaX),
        y: Math.max(0, dragStart.nodeY + deltaY)
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, zoom, onMove]);

  // 渲染端口
  const renderPorts = (ports: any[], type: 'input' | 'output') => {
    return ports.map((port, index) => (
      <div
        key={port.id}
        className={`${styles.port} ${type === 'input' ? styles.inputPort : styles.outputPort}`}
        style={{ '--port-color': color } as React.CSSProperties}
        onMouseDown={(e) => {
          if (type === 'output') {
            e.stopPropagation();
            onConnectionStart(port.id);
          }
        }}
        onMouseUp={(e) => {
          if (type === 'input' && isConnecting) {
            e.stopPropagation();
            onConnectionEnd(port.id);
          }
        }}
        title={port.displayName}
      >
        <div className={styles.portDot} />
        <span className={styles.portLabel}>{port.displayName}</span>
      </div>
    ));
  };

  return (
    <div
      ref={nodeRef}
      className={`${styles.node} ${isSelected ? styles.selected : ''} ${isDragging ? styles.dragging : ''} ${node.status ? styles[`status_${node.status}`] : ''}`}
      style={{
        left: node.position.x,
        top: node.position.y,
        '--node-color': color,
        '--status-color': statusInfo.color
      } as React.CSSProperties}
      onMouseDown={handleMouseDown}
    >
      {/* 输入端口 */}
      <div className={styles.inputs}>
        {renderPorts(definition.inputs, 'input')}
      </div>

      {/* 节点内容 */}
      <div className={styles.nodeContent}>
        <div className={styles.nodeHeader}>
          <div className={styles.nodeIcon} style={{ backgroundColor: `${color}20`, color }}>
            {categoryIcons[category]}
          </div>
          <div className={styles.nodeInfo}>
            <span className={styles.nodeName}>{node.name}</span>
            <span className={styles.nodeType}>{definition.displayName}</span>
          </div>
          {statusInfo.icon && (
            <div className={styles.nodeStatus} style={{ color: statusInfo.color }}>
              {statusInfo.icon}
            </div>
          )}
        </div>
        
        {/* 节点参数摘要 */}
        {Object.keys(node.parameters).length > 0 && (
          <div className={styles.nodeParams}>
            {Object.entries(node.parameters).slice(0, 2).map(([key, value]) => (
              <span key={key} className={styles.paramBadge}>
                {String(value).substring(0, 15)}{String(value).length > 15 ? '...' : ''}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 输出端口 */}
      <div className={styles.outputs}>
        {renderPorts(definition.outputs, 'output')}
      </div>

      {/* 选中指示器 */}
      {isSelected && <div className={styles.selectionBorder} />}
    </div>
  );
};

export default NodeComponent;
