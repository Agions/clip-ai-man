import React from 'react';
import { Card, Typography, Alert, Space } from 'antd';
import { ThunderboltOutlined, InfoCircleOutlined } from '@ant-design/icons';
import WorkflowManager from '@/components/business/WorkflowManager';
import FFmpegStatus from '@/components/business/FFmpegStatus';
import styles from './index.module.less';

const { Title, Text } = Typography;

const WorkflowPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Space>
          <ThunderboltOutlined style={{ fontSize: 24, color: '#faad14' }} />
          <Title level={3} style={{ margin: 0 }}>漫剧工作流</Title>
        </Space>
        <Text type="secondary">9 步自动化创作流程，一键生成漫剧视频</Text>
      </div>

      <Alert
        message="工作流说明"
        description="漫剧工作流包含 9 个步骤：剧本创作 → 分镜设计 → 角色设定 → 场景生成 → 图像生成 → 智能配音 → 视频生成 → 后期剪辑 → 导出成品。每个步骤都可以单独执行或跳过。"
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        style={{ marginBottom: 16 }}
      />

      <FFmpegStatus />

      <Card className={styles.workflowCard}>
        <WorkflowManager />
      </Card>
    </div>
  );
};

export default WorkflowPage;
