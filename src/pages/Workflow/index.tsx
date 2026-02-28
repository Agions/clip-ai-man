import React, { useState } from 'react';
import { Card, Typography, Alert, Space, Tabs } from 'antd';
import { ThunderboltOutlined, InfoCircleOutlined, PictureOutlined, ClusterOutlined } from '@ant-design/icons';
import WorkflowEditor from '@/pages/workflow-editor';
import FFmpegStatus from '@/components/business/FFmpegStatus';
import AIImageGenerator from '@/components/business/AIImageGenerator';
import styles from './index.module.less';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const WorkflowPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('workflow');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Space>
          <ThunderboltOutlined style={{ fontSize: 24, color: '#faad14' }} />
          <Title level={3} style={{ margin: 0 }}>漫剧工作流</Title>
        </Space>
        <Text type="secondary">节点式可视化工作流编辑器，自由组合 AI、图像、视频、音频节点</Text>
      </div>

      <Alert
        message="工作流编辑器"
        description="从左侧拖拽节点到画布，连接节点创建工作流。支持 AI 对话、图像生成、视频生成、语音合成等 25+ 节点类型。"
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        style={{ marginBottom: 16 }}
      />

      <FFmpegStatus />

      <Card className={styles.workflowCard}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <ClusterOutlined />
                工作流编辑器
              </span>
            }
            key="workflow"
          >
            <div style={{ height: 600 }}>
              <WorkflowEditor />
            </div>
          </TabPane>
          <TabPane
            tab={
              <span>
                <PictureOutlined />
                图像/视频生成
              </span>
            }
            key="generation"
          >
            <AIImageGenerator />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default WorkflowPage;
