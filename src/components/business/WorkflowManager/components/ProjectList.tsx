import React from 'react';
import { Card, Button, List, Tag, Space, Typography, Empty, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { ComicDramaProject } from '@/core/services/workflow.service';
import styles from '../index.module.less';

const { Text } = Typography;

interface ProjectListProps {
  projects: ComicDramaProject[];
  currentProject: ComicDramaProject | null;
  onSelect: (project: ComicDramaProject) => void;
  onCreate: () => void;
  onDelete: (projectId: string) => void;
}

const STATUS_MAP: Record<string, { text: string; color: string }> = {
  idle: { text: '未开始', color: 'default' },
  running: { text: '进行中', color: 'processing' },
  paused: { text: '已暂停', color: 'warning' },
  completed: { text: '已完成', color: 'success' },
  failed: { text: '失败', color: 'error' },
};

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  currentProject,
  onSelect,
  onCreate,
  onDelete,
}) => {
  if (projects.length === 0) {
    return (
      <Card
        title="漫剧项目"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            新建项目
          </Button>
        }
      >
        <Empty description="暂无项目，点击上方按钮创建">
          <Button type="primary" onClick={onCreate}>
            创建项目
          </Button>
        </Empty>
      </Card>
    );
  }

  return (
    <Card
      title="漫剧项目"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
          新建项目
        </Button>
      }
    >
      <List
        dataSource={projects}
        renderItem={(project) => {
          const status = STATUS_MAP[project.status];
          const isActive = currentProject?.id === project.id;
          const currentStep = project.steps[project.currentStep];

          return (
            <List.Item
              className={isActive ? styles.activeProject : ''}
              actions={[
                <Button
                  key="select"
                  size="small"
                  type={isActive ? 'primary' : 'default'}
                  onClick={() => onSelect(project)}
                >
                  {isActive ? '当前' : '打开'}
                </Button>,
                <Popconfirm
                  key="delete"
                  title="确认删除"
                  description="删除后无法恢复，是否继续？"
                  onConfirm={() => onDelete(project.id)}
                  okText="删除"
                  cancelText="取消"
                >
                  <Button size="small" danger icon={<DeleteOutlined />}>
                    删除
                  </Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={
                  <Space>
                    <Text strong>{project.name}</Text>
                    <Tag color={status.color}>{status.text}</Tag>
                  </Space>
                }
                description={
                  <Space direction="vertical" size={0}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      当前: {currentStep?.name || '已完成'}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {new Date(project.createdAt).toLocaleDateString()}
                    </Text>
                  </Space>
                }
              />
            </List.Item>
          );
        }}
      />
    </Card>
  );
};

export default ProjectList;
