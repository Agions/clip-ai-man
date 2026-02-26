import React from 'react';
import { Timeline, Space, Typography, Tag } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  FileTextOutlined,
  PictureOutlined,
  SoundOutlined,
  VideoCameraOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { WorkflowStep } from '@/core/services/workflow.service';

const { Text } = Typography;

interface StepTimelineProps {
  steps: WorkflowStep[];
}

const STEP_ICONS: Record<string, React.ReactNode> = {
  script: <FileTextOutlined />,
  storyboard: <PictureOutlined />,
  character: <EyeOutlined />,
  scene: <PictureOutlined />,
  image: <PictureOutlined />,
  dubbing: <SoundOutlined />,
  video: <VideoCameraOutlined />,
  edit: <EditOutlined />,
  export: <ExportOutlined />,
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'gray',
  running: 'blue',
  completed: 'green',
  failed: 'red',
  skipped: 'gray',
};

const STATUS_TEXT: Record<string, string> = {
  pending: '等待',
  running: '进行中',
  completed: '已完成',
  failed: '失败',
  skipped: '跳过',
};

const getStatusIcon = (status: WorkflowStep['status']) => {
  switch (status) {
    case 'running':
      return <LoadingOutlined spin />;
    case 'completed':
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    case 'failed':
      return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
    default:
      return null;
  }
};

export const StepTimeline: React.FC<StepTimelineProps> = ({ steps }) => {
  return (
    <Timeline>
      {steps.map((step) => (
        <Timeline.Item
          key={step.id}
          dot={getStatusIcon(step.status)}
          color={STATUS_COLORS[step.status]}
        >
          <Space direction="vertical" size={0}>
            <Space>
              {STEP_ICONS[step.type]}
              <Text strong>{step.name}</Text>
              <Tag color={STATUS_COLORS[step.status]}>
                {STATUS_TEXT[step.status]}
                {step.status === 'running' && step.progress > 0 && ` ${step.progress}%`}
              </Tag>
            </Space>
            {step.status === 'completed' && step.duration && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                耗时: {Math.round(step.duration / 1000)} 秒
              </Text>
            )}
            {step.status === 'failed' && step.error && (
              <Text type="danger" style={{ fontSize: 12 }}>
                {step.error}
              </Text>
            )}
          </Space>
        </Timeline.Item>
      ))}
    </Timeline>
  );
};

export default StepTimeline;
