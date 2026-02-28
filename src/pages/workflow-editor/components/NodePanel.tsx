/**
 * 节点面板
 * 左侧节点选择面板，可拖拽到画布
 */

import React, { useState } from 'react';
import { Input, Collapse, Badge } from 'antd';
import {
  SearchOutlined,
  PlayCircleOutlined,
  RobotOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  SoundOutlined,
  DatabaseOutlined,
  BranchesOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { nodesByCategory, NodeDefinition } from '@/core/workflow';
import styles from './NodePanel.module.less';

const { Panel } = Collapse;

// 分类信息
const categories = [
  { key: 'trigger', name: '触发器', icon: <PlayCircleOutlined />, color: '#10b981' },
  { key: 'ai', name: 'AI', icon: <RobotOutlined />, color: '#8b5cf6' },
  { key: 'image', name: '图像', icon: <PictureOutlined />, color: '#f59e0b' },
  { key: 'video', name: '视频', icon: <VideoCameraOutlined />, color: '#ef4444' },
  { key: 'audio', name: '音频', icon: <SoundOutlined />, color: '#06b6d4' },
  { key: 'data', name: '数据', icon: <DatabaseOutlined />, color: '#6366f1' },
  { key: 'flow', name: '流程控制', icon: <BranchesOutlined />, color: '#ec4899' },
  { key: 'output', name: '输出', icon: <ExportOutlined />, color: '#14b8a6' },
];

export const NodePanel: React.FC = () => {
  const [searchText, setSearchText] = useState('');

  // 过滤节点
  const filterNodes = (nodes: NodeDefinition[]): NodeDefinition[] => {
    if (!searchText) return nodes;
    const lower = searchText.toLowerCase();
    return nodes.filter(
      n =>
        n.displayName.toLowerCase().includes(lower) ||
        n.description.toLowerCase().includes(lower)
    );
  };

  // 拖拽开始
  const handleDragStart = (e: React.DragEvent, nodeType: string) => {
    e.dataTransfer.setData('nodeType', nodeType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className={styles.nodePanel}>
      {/* 搜索框 */}
      <div className={styles.searchWrapper}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="搜索节点..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
      </div>

      {/* 节点列表 */}
      <Collapse
        defaultActiveKey={categories.map(c => c.key)}
        ghost
        className={styles.collapse}
      >
        {categories.map((cat) => {
          const nodes = filterNodes(nodesByCategory[cat.key as keyof typeof nodesByCategory] || []);
          if (nodes.length === 0) return null;

          return (
            <Panel
              key={cat.key}
              header={
                <div className={styles.categoryHeader}>
                  <span style={{ color: cat.color }}>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <Badge count={nodes.length} style={{ backgroundColor: cat.color }} />
                </div>
              }
            >
              <div className={styles.nodeList}>
                {nodes.map((node) => (
                  <div
                    key={node.type}
                    className={styles.nodeItem}
                    draggable
                    onDragStart={(e) => handleDragStart(e, node.type)}
                  >
                    <div
                      className={styles.nodeIcon}
                      style={{ backgroundColor: cat.color }}
                    >
                      {cat.icon}
                    </div>
                    <div className={styles.nodeInfo}>
                      <div className={styles.nodeName}>{node.displayName}</div>
                      <div className={styles.nodeDesc}>{node.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
};

export default NodePanel;
