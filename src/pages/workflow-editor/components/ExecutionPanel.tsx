/**
 * 执行面板
 * 显示工作流执行状态和日志
 */

import React from 'react';
import { Timeline, Button, Empty, Progress, Tag } from 'antd';
import { PlayCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useWorkflowEditor } from '@/core/workflow/store';
import styles from './ExecutionPanel.module.less';

export const ExecutionPanel: React.FC = () => {
  const {
    isExecuting,
    currentExecution,
    executionLogs,
    executeWorkflow,
    stopExecution,
    clearExecutionLogs,
  } = useWorkflowEditor();

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>执行面板</h3>
      </div>

      {/* 执行控制 */}
      <div className={styles.controls}>
        {isExecuting ? (
          <Button type="primary" danger onClick={stopExecution}>
            停止执行
          </Button>
        ) : (
          <Button type="primary" icon={<PlayCircleOutlined />} onClick={executeWorkflow}>
            执行工作流
          </Button>
        )}
        <Button onClick={clearExecutionLogs}>清空日志</Button>
      </div>

      {/* 执行状态 */}
      {currentExecution && (
        <div className={styles.status}>
          <Tag color={currentExecution.status === 'success' ? 'green' : currentExecution.status === 'error' ? 'red' : 'blue'}>
            {currentExecution.status === 'running' ? '执行中' : currentExecution.status === 'success' ? '成功' : '失败'}
          </Tag>
          {currentExecution.duration && (
            <span className={styles.duration}>{currentExecution.duration}ms</span>
          )}
        </div>
      )}

      {/* 执行日志 */}
      <div className={styles.logs}>
        {executionLogs.length === 0 ? (
          <Empty description="暂无执行记录" />
        ) : (
          <Timeline
            items={executionLogs.map((log, index) => ({
              key: index,
              color: log.message.includes('✅') ? 'green' : log.message.includes('❌') ? 'red' : 'blue',
              children: (
                <div className={styles.logItem}>
                  <span className={styles.logTime}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={styles.logMessage}>{log.message}</span>
                </div>
              )
            }))}
          />
        )}
      </div>
    </div>
  );
};

export default ExecutionPanel;
