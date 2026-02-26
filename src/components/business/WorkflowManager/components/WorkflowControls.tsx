import React from 'react';
import { Button, Space, Steps, Card } from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  FileTextOutlined,
  PictureOutlined,
  SoundOutlined,
  VideoCameraOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { ComicDramaProject, WorkflowStep } from '@/core/services/workflow.service';

const { Step } = Steps;

interface WorkflowControlsProps {
  project: ComicDramaProject;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
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

export const WorkflowControls: React.FC<WorkflowControlsProps> = ({
  project,
  onStart,
  onPause,
  onResume,
}) => {
  const getStepStatus = (step: WorkflowStep, index: number) => {
    if (step.status === 'completed') return 'finish';
    if (step.status === 'failed') return 'error';
    if (index === project.currentStep) return 'process';
    return 'wait';
  };

  return (
    <>
      <Card style={{ marginBottom: 16 }}>
        <Steps
          current={project.currentStep}
          status={project.status === 'failed' ? 'error' : 'process'}
          direction="horizontal"
          size="small"
        >
          {project.steps.map((step, index) => (
            <Step
              key={step.id}
              title={step.name}
              icon={
                index === project.currentStep && step.status === 'running' ? (
                  <LoadingOutlined />
                ) : (
                  STEP_ICONS[step.type]
                )
              }
              status={getStepStatus(step, index)}
            />
          ))}
        </Steps>
      </Card>

      <Space style={{ marginBottom: 16 }}>
        {project.status === 'idle' && (
          <Button type="primary" icon={<PlayCircleOutlined />} onClick={onStart}>
            开始创作
          </Button>
        )}
        {project.status === 'running' && (
          <Button icon={<PauseCircleOutlined />} onClick={onPause}>
            暂停
          </Button>
        )}
        {project.status === 'paused' && (
          <Button type="primary" icon={<PlayCircleOutlined />} onClick={onResume}>
            继续
          </Button>
        )}
        {(project.status === 'completed' || project.status === 'failed') && (
          <Button icon={<ReloadOutlined />} onClick={onStart}>
            重新运行
          </Button>
        )}
      </Space>
    </>
  );
};

export default WorkflowControls;
