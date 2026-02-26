import React, { useState, useEffect, useCallback } from 'react';
import { Card, Form, Typography, message, Row, Col, Collapse } from 'antd';
import {
  ProjectList,
  CreateProjectModal,
  StepTimeline,
  EventLog,
  WorkflowControls,
} from './components';
import {
  workflowService,
  ComicDramaProject,
  WorkflowEvent,
} from '@/core/services/workflow.service';
import styles from './index.module.less';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const WorkflowManager: React.FC = () => {
  const [projects, setProjects] = useState<ComicDramaProject[]>([]);
  const [currentProject, setCurrentProject] = useState<ComicDramaProject | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form] = Form.useForm();
  const [eventLog, setEventLog] = useState<string[]>([]);

  const refreshProjects = useCallback(() => {
    setProjects(workflowService.getAllProjects());
    if (currentProject) {
      const updated = workflowService.getProject(currentProject.id);
      if (updated) setCurrentProject(updated);
    }
  }, [currentProject]);

  useEffect(() => {
    const unsubscribe = workflowService.subscribe((event: WorkflowEvent) => {
      const timestamp = new Date().toLocaleTimeString();
      let logMessage = `[${timestamp}] `;

      switch (event.type) {
        case 'stepStart':
          logMessage += `开始: ${event.stepType}`;
          break;
        case 'stepProgress':
          logMessage += `进度: ${event.stepType} ${event.progress}%`;
          break;
        case 'stepComplete':
          logMessage += `完成: ${event.stepType}`;
          break;
        case 'stepFail':
          logMessage += `失败: ${event.stepType} - ${event.error}`;
          break;
        case 'workflowComplete':
          logMessage += '✅ 工作流完成';
          message.success('漫剧创作完成！');
          break;
        case 'workflowFail':
          logMessage += `❌ 失败: ${event.error}`;
          message.error('工作流执行失败');
          break;
      }

      setEventLog((prev) => [...prev.slice(-49), logMessage]);
      refreshProjects();
    });

    refreshProjects();
    return () => unsubscribe();
  }, [refreshProjects]);

  const handleCreateProject = async (values: any) => {
    const config = {
      name: values.name,
      description: values.description,
      aiProvider: values.aiProvider,
      aiApiKey: values.aiApiKey,
      imageProvider: values.imageProvider,
      imageApiKey: values.imageApiKey,
      videoProvider: values.videoProvider,
      videoApiKey: values.videoApiKey,
      ttsProvider: values.ttsProvider,
      style: values.style,
      aspectRatio: values.aspectRatio,
      duration: values.duration,
      autoProceed: values.autoProceed,
    };

    const project = workflowService.createProject(values.name, config);
    setCurrentProject(project);
    setIsCreating(false);
    form.resetFields();
    refreshProjects();
    message.success('项目创建成功');
  };

  const handleStartWorkflow = async () => {
    if (!currentProject) return;
    try {
      await workflowService.runWorkflow(currentProject.id);
    } catch (error) {
      console.error('启动失败:', error);
    }
  };

  const handlePauseWorkflow = () => {
    if (!currentProject) return;
    workflowService.pauseWorkflow(currentProject.id);
    refreshProjects();
    message.info('已暂停');
  };

  const handleResumeWorkflow = async () => {
    if (!currentProject) return;
    try {
      await workflowService.resumeWorkflow(currentProject.id);
    } catch (error) {
      console.error('继续失败:', error);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    workflowService.deleteProject(projectId);
    if (currentProject?.id === projectId) setCurrentProject(null);
    refreshProjects();
    message.success('已删除');
  };

  const renderProjectDetail = () => {
    if (!currentProject) {
      return (
        <Card>
          <Text type="secondary">选择一个项目或创建新项目</Text>
        </Card>
      );
    }

    return (
      <Card
        title={
          <Space>
            <Title level={5} style={{ margin: 0 }}>
              {currentProject.name}
            </Title>
            <Text type="secondary">
              {currentProject.status === 'idle' && '未开始'}
              {currentProject.status === 'running' && '进行中'}
              {currentProject.status === 'paused' && '已暂停'}
              {currentProject.status === 'completed' && '已完成'}
              {currentProject.status === 'failed' && '失败'}
            </Text>
          </Space>
        }
      >
        <WorkflowControls
          project={currentProject}
          onStart={handleStartWorkflow}
          onPause={handlePauseWorkflow}
          onResume={handleResumeWorkflow}
        />

        <Collapse defaultActiveKey={['steps']}>
          <Panel header="步骤详情" key="steps">
            <StepTimeline steps={currentProject.steps} />
          </Panel>
        </Collapse>

        <div style={{ marginTop: 16 }}>
          <EventLog logs={eventLog} />
        </div>
      </Card>
    );
  };

  return (
    <div className={styles.container}>
      <Row gutter={16}>
        <Col span={8}>
          <ProjectList
            projects={projects}
            currentProject={currentProject}
            onSelect={setCurrentProject}
            onCreate={() => setIsCreating(true)}
            onDelete={handleDeleteProject}
          />
        </Col>
        <Col span={16}>{renderProjectDetail()}</Col>
      </Row>

      <CreateProjectModal
        visible={isCreating}
        onCancel={() => setIsCreating(false)}
        onSubmit={handleCreateProject}
        form={form}
      />
    </div>
  );
};

import { Space } from 'antd';

export default WorkflowManager;
