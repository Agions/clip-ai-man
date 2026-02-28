/**
 * 连接线组件
 * 节点之间的 SVG 连接线
 */

import React from 'react';
import { NodeConnection, WorkflowNode } from '@/core/workflow/types';
import { getNodeDefinition } from '@/core/workflow/node-registry';
import styles from './ConnectionLine.module.less';

interface ConnectionLineProps {
  connection?: NodeConnection;
  nodes?: WorkflowNode[];
  isDraft?: boolean;
  startPos?: { x: number; y: number };
  endPos?: { x: number; y: number };
  isSelected?: boolean;
  onClick?: () => void;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  connection,
  nodes,
  isDraft = false,
  startPos,
  endPos,
  isSelected = false,
  onClick,
}) => {
  // 计算贝塞尔曲线
  const calculatePath = (x1: number, y1: number, x2: number, y2: number): string => {
    const dx = Math.abs(x2 - x1);
    const curve = Math.min(dx * 0.5, 100);
    
    const cp1x = x1 + curve;
    const cp1y = y1;
    const cp2x = x2 - curve;
    const cp2y = y2;

    return `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
  };

  // 获取连接的起点和终点
  const getPositions = (): { x1: number; y1: number; x2: number; y2: number } | null => {
    if (isDraft && startPos && endPos) {
      return {
        x1: startPos.x,
        y1: startPos.y,
        x2: endPos.x,
        y2: endPos.y
      };
    }

    if (connection && nodes) {
      const sourceNode = nodes.find(n => n.id === connection.sourceNodeId);
      const targetNode = nodes.find(n => n.id === connection.targetNodeId);

      if (sourceNode && targetNode) {
        const sourceDef = getNodeDefinition(sourceNode.type);
        const targetDef = getNodeDefinition(targetNode.type);
        
        // 计算输出端口位置
        const outputIndex = sourceDef?.outputs.findIndex(o => o.id === connection.sourceOutput) || 0;
        const inputIndex = targetDef?.inputs.findIndex(i => i.id === connection.targetInput) || 0;

        // 源节点输出端口（右侧）
        const x1 = sourceNode.position.x + 250;
        const y1 = sourceNode.position.y + 50 + outputIndex * 28;

        // 目标节点输入端口（左侧）
        const x2 = targetNode.position.x;
        const y2 = targetNode.position.y + 50 + inputIndex * 28;

        return { x1, y1, x2, y2 };
      }
    }

    return null;
  };

  const positions = getPositions();
  if (!positions) return null;

  const { x1, y1, x2, y2 } = positions;
  const path = calculatePath(x1, y1, x2, y2);

  return (
    <g
      className={`${styles.connection} ${isSelected ? styles.selected : ''} ${isDraft ? styles.draft : ''}`}
      onClick={onClick}
    >
      {/* 点击区域（更宽的透明线） */}
      <path
        d={path}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ cursor: 'pointer' }}
      />

      {/* 主线条 */}
      <path
        d={path}
        fill="none"
        stroke={isSelected ? '#e94560' : '#64748b'}
        strokeWidth={isSelected ? 3 : 2}
        strokeLinecap="round"
        className={styles.line}
      />

      {/* 动画点 */}
      {!isDraft && !isSelected && (
        <circle r="3" fill="#e94560" className={styles.animatedDot}>
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path={path}
            rotate="auto"
          />
        </circle>
      )}

      {/* 选中状态的光晕 */}
      {isSelected && (
        <path
          d={path}
          fill="none"
          stroke="#e94560"
          strokeWidth={6}
          strokeLinecap="round"
          className={styles.glow}
        />
      )}
    </g>
  );
};

export default ConnectionLine;
